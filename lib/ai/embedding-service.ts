import { openai } from "@ai-sdk/openai"
import { embed, embedMany } from "ai"

export interface EmbeddingResult {
  text: string
  embedding: number[]
  model: string
}

/**
 * Erstellt ein Embedding für einen einzelnen Text
 */
export async function createEmbedding(text: string): Promise<EmbeddingResult> {
  try {
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: text,
    })

    return {
      text,
      embedding,
      model: "text-embedding-3-small",
    }
  } catch (error) {
    console.error("Fehler beim Erstellen des Embeddings:", error)
    throw new Error("Embedding konnte nicht erstellt werden")
  }
}

/**
 * Erstellt Embeddings für mehrere Texte
 */
export async function createEmbeddings(texts: string[]): Promise<EmbeddingResult[]> {
  try {
    const { embeddings } = await embedMany({
      model: openai.embedding("text-embedding-3-small"),
      values: texts,
    })

    return texts.map((text, index) => ({
      text,
      embedding: embeddings[index],
      model: "text-embedding-3-small",
    }))
  } catch (error) {
    console.error("Fehler beim Erstellen der Embeddings:", error)
    throw new Error("Embeddings konnten nicht erstellt werden")
  }
}

/**
 * Berechnet die Kosinus-Ähnlichkeit zwischen zwei Vektoren
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vektoren müssen die gleiche Länge haben")
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  normA = Math.sqrt(normA)
  normB = Math.sqrt(normB)

  if (normA === 0 || normB === 0) {
    return 0
  }

  return dotProduct / (normA * normB)
}

/**
 * Findet die ähnlichsten Texte basierend auf Embeddings
 */
export async function findSimilarTexts(
  queryText: string,
  candidates: Array<{ id: string; text: string; embedding?: number[] }>,
  topK = 5,
): Promise<Array<{ id: string; text: string; similarity: number }>> {
  // Erstelle Embedding für die Suchanfrage
  const queryEmbedding = await createEmbedding(queryText)

  // Berechne Ähnlichkeiten
  const similarities = candidates
    .filter((candidate) => candidate.embedding)
    .map((candidate) => ({
      id: candidate.id,
      text: candidate.text,
      similarity: cosineSimilarity(queryEmbedding.embedding, candidate.embedding!),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK)

  return similarities
}

/**
 * Erstellt eine semantische Zusammenfassung eines Erlebnisses
 */
export async function createSemanticSummary(titel: string, beschreibung: string, tags: string[]): Promise<string> {
  const combinedText = `
    Titel: ${titel}
    Beschreibung: ${beschreibung}
    Tags: ${tags.join(", ")}
  `

  // Erstelle Embedding für semantische Repräsentation
  const embedding = await createEmbedding(combinedText)

  // Hier könnten wir das Embedding für weitere Analysen nutzen
  // Für jetzt geben wir eine einfache Zusammenfassung zurück
  return `Semantisches Profil erstellt (${embedding.embedding.length} Dimensionen)`
}
