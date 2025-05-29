import { createEmbedding, cosineSimilarity } from "./embedding-service"
import type { Erlebnis } from "@/types/erlebnis"
import type { XPEintrag } from "@/types/xp-eintrag"

export interface SearchResult<T> {
  item: T
  score: number
  highlights: string[]
}

/**
 * Semantische Suche für Erlebnisse
 */
export async function semanticSearchErlebnisse(
  query: string,
  erlebnisse: Erlebnis[],
  options: {
    limit?: number
    minScore?: number
    includeEmbeddings?: boolean
  } = {},
): Promise<SearchResult<Erlebnis>[]> {
  const { limit = 10, minScore = 0.5 } = options

  // Erstelle Embedding für die Suchanfrage
  const queryEmbedding = await createEmbedding(query)

  // Berechne Ähnlichkeiten für alle Erlebnisse
  const results = await Promise.all(
    erlebnisse.map(async (erlebnis) => {
      // Kombiniere relevante Textfelder für das Embedding
      const combinedText = `${erlebnis.titel} ${erlebnis.kurzfassung} ${erlebnis.beschreibung} ${erlebnis.tags.join(" ")}`

      // Erstelle Embedding für das Erlebnis (in Produktion würden diese gecacht)
      const erlebnisEmbedding = await createEmbedding(combinedText)

      // Berechne Ähnlichkeit
      const similarity = cosineSimilarity(queryEmbedding.embedding, erlebnisEmbedding.embedding)

      // Erstelle Highlights (vereinfachte Version)
      const highlights = extractHighlights(query, combinedText)

      return {
        item: erlebnis,
        score: similarity,
        highlights,
      }
    }),
  )

  // Filtere und sortiere Ergebnisse
  return results
    .filter((result) => result.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/**
 * Semantische Suche für XP-Einträge
 */
export async function semanticSearchXPEintraege(
  query: string,
  eintraege: XPEintrag[],
  options: {
    limit?: number
    minScore?: number
  } = {},
): Promise<SearchResult<XPEintrag>[]> {
  const { limit = 10, minScore = 0.5 } = options

  // Erstelle Embedding für die Suchanfrage
  const queryEmbedding = await createEmbedding(query)

  // Berechne Ähnlichkeiten für alle Einträge
  const results = await Promise.all(
    eintraege.map(async (eintrag) => {
      // Kombiniere relevante Textfelder
      const combinedText = `${eintrag.titel} ${eintrag.inhalt} ${(eintrag.tags || []).join(" ")}`

      // Erstelle Embedding
      const eintragEmbedding = await createEmbedding(combinedText)

      // Berechne Ähnlichkeit
      const similarity = cosineSimilarity(queryEmbedding.embedding, eintragEmbedding.embedding)

      // Erstelle Highlights
      const highlights = extractHighlights(query, combinedText)

      return {
        item: eintrag,
        score: similarity,
        highlights,
      }
    }),
  )

  // Filtere und sortiere Ergebnisse
  return results
    .filter((result) => result.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/**
 * Hybride Suche: Kombiniert Keyword-Suche mit semantischer Suche
 */
export async function hybridSearch<T extends { titel: string; [key: string]: any }>(
  query: string,
  items: T[],
  textExtractor: (item: T) => string,
  options: {
    limit?: number
    keywordWeight?: number
    semanticWeight?: number
  } = {},
): Promise<SearchResult<T>[]> {
  const { limit = 10, keywordWeight = 0.3, semanticWeight = 0.7 } = options

  // Keyword-basierte Scores
  const keywordScores = items.map((item) => {
    const text = textExtractor(item).toLowerCase()
    const queryLower = query.toLowerCase()
    const words = queryLower.split(/\s+/)

    let score = 0
    words.forEach((word) => {
      if (text.includes(word)) {
        score += 1 / words.length
      }
    })

    return { item, score }
  })

  // Semantische Scores
  const queryEmbedding = await createEmbedding(query)
  const semanticScores = await Promise.all(
    items.map(async (item) => {
      const text = textExtractor(item)
      const itemEmbedding = await createEmbedding(text)
      const similarity = cosineSimilarity(queryEmbedding.embedding, itemEmbedding.embedding)

      return { item, score: similarity }
    }),
  )

  // Kombiniere Scores
  const combinedResults = items.map((item, index) => {
    const keywordScore = keywordScores[index].score
    const semanticScore = semanticScores[index].score
    const combinedScore = keywordWeight * keywordScore + semanticWeight * semanticScore

    const highlights = extractHighlights(query, textExtractor(item))

    return {
      item,
      score: combinedScore,
      highlights,
    }
  })

  // Sortiere und limitiere Ergebnisse
  return combinedResults.sort((a, b) => b.score - a.score).slice(0, limit)
}

/**
 * Extrahiert relevante Textausschnitte als Highlights
 */
function extractHighlights(query: string, text: string, maxHighlights = 3): string[] {
  const words = query.toLowerCase().split(/\s+/)
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)

  const highlights: Array<{ sentence: string; score: number }> = []

  sentences.forEach((sentence) => {
    const sentenceLower = sentence.toLowerCase()
    let score = 0

    words.forEach((word) => {
      if (sentenceLower.includes(word)) {
        score++
      }
    })

    if (score > 0) {
      highlights.push({ sentence: sentence.trim(), score })
    }
  })

  // Sortiere nach Score und nimm die besten Highlights
  return highlights
    .sort((a, b) => b.score - a.score)
    .slice(0, maxHighlights)
    .map((h) => h.sentence)
}

/**
 * Findet ähnliche Inhalte basierend auf einem Referenz-Item
 */
export async function findSimilarContent<T>(
  referenceItem: T,
  candidates: T[],
  textExtractor: (item: T) => string,
  options: {
    limit?: number
    minScore?: number
    excludeSelf?: boolean
  } = {},
): Promise<SearchResult<T>[]> {
  const { limit = 5, minScore = 0.6, excludeSelf = true } = options

  const referenceText = textExtractor(referenceItem)
  const referenceEmbedding = await createEmbedding(referenceText)

  const results = await Promise.all(
    candidates.map(async (candidate) => {
      // Überspringe das Referenz-Item wenn gewünscht
      if (excludeSelf && candidate === referenceItem) {
        return null
      }

      const candidateText = textExtractor(candidate)
      const candidateEmbedding = await createEmbedding(candidateText)

      const similarity = cosineSimilarity(referenceEmbedding.embedding, candidateEmbedding.embedding)

      return {
        item: candidate,
        score: similarity,
        highlights: [], // Keine Highlights bei Ähnlichkeitssuche
      }
    }),
  )

  return results
    .filter((result): result is SearchResult<T> => result !== null && result.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
