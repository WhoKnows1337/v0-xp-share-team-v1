import type { XPEintrag } from "@/types/xp-eintrag"

// Berechnet die Ähnlichkeit zwischen zwei Einträgen basierend auf Tags
export function calculateTagSimilarity(entry1: XPEintrag, entry2: XPEintrag): number {
  if (!entry1.tags || !entry2.tags || entry1.tags.length === 0 || entry2.tags.length === 0) {
    return 0
  }

  const tags1 = new Set(entry1.tags)
  const tags2 = new Set(entry2.tags)

  // Jaccard-Ähnlichkeit: Größe der Schnittmenge geteilt durch Größe der Vereinigungsmenge
  const intersection = new Set([...tags1].filter((tag) => tags2.has(tag)))
  const union = new Set([...tags1, ...tags2])

  return intersection.size / union.size
}

// Berechnet die Ähnlichkeit zwischen zwei Einträgen basierend auf Mood
export function calculateMoodSimilarity(entry1: XPEintrag, entry2: XPEintrag): number {
  if (!entry1.mood || !entry2.mood) {
    return 0
  }

  const moods1 = Array.isArray(entry1.mood) ? entry1.mood : [entry1.mood]
  const moods2 = Array.isArray(entry2.mood) ? entry2.mood : [entry2.mood]

  const mood1Set = new Set(moods1)
  const mood2Set = new Set(moods2)

  // Jaccard-Ähnlichkeit für Moods
  const intersection = new Set([...mood1Set].filter((mood) => mood2Set.has(mood)))
  const union = new Set([...mood1Set, ...mood2Set])

  return intersection.size / union.size
}

// Berechnet die Ähnlichkeit zwischen zwei Einträgen basierend auf Inhalt (einfache Implementierung)
export function calculateContentSimilarity(entry1: XPEintrag, entry2: XPEintrag): number {
  // In einer echten Anwendung würde hier eine fortschrittlichere NLP-Methode verwendet werden
  // Für die Demo verwenden wir eine einfache Wortüberlappung

  const words1 = entry1.inhalt
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 3)
  const words2 = entry2.inhalt
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 3)

  const wordSet1 = new Set(words1)
  const wordSet2 = new Set(words2)

  // Jaccard-Ähnlichkeit für Wörter
  const intersection = new Set([...wordSet1].filter((word) => wordSet2.has(word)))
  const union = new Set([...wordSet1, ...wordSet2])

  return intersection.size / union.size
}

// Berechnet die semantische Ähnlichkeit zwischen zwei Einträgen (simuliert)
export function calculateSemanticSimilarity(entry1: XPEintrag, entry2: XPEintrag): number {
  // In einer echten Anwendung würde hier ein Embedding-Modell verwendet werden
  // Für die Demo simulieren wir semantische Ähnlichkeit mit einer Kombination aus anderen Metriken

  const contentSim = calculateContentSimilarity(entry1, entry2)
  const tagSim = calculateTagSimilarity(entry1, entry2)

  // Gewichtete Kombination
  return contentSim * 0.7 + tagSim * 0.3
}

// Berechnet die Gesamtähnlichkeit zwischen zwei Einträgen
export function calculateOverallSimilarity(entry1: XPEintrag, entry2: XPEintrag): number {
  const tagSimilarity = calculateTagSimilarity(entry1, entry2)
  const moodSimilarity = calculateMoodSimilarity(entry1, entry2)
  const contentSimilarity = calculateContentSimilarity(entry1, entry2)
  const semanticSimilarity = calculateSemanticSimilarity(entry1, entry2)

  // Gewichtete Summe der Ähnlichkeiten
  return tagSimilarity * 0.3 + moodSimilarity * 0.1 + contentSimilarity * 0.3 + semanticSimilarity * 0.3
}

// Findet ähnliche Einträge zu einem gegebenen Eintrag
export function findSimilarEntries(entry: XPEintrag, allEntries: XPEintrag[], limit = 5): XPEintrag[] {
  if (!entry || !allEntries.length) return []

  // Berechne Ähnlichkeit für jeden Eintrag (außer dem Eintrag selbst)
  const entriesWithSimilarity = allEntries
    .filter((e) => e.id !== entry.id)
    .map((e) => ({
      entry: e,
      similarity: calculateOverallSimilarity(entry, e),
    }))
    .sort((a, b) => b.similarity - a.similarity)

  // Gib die ähnlichsten Einträge zurück
  return entriesWithSimilarity
    .slice(0, limit)
    .filter((e) => e.similarity > 0.1) // Nur Einträge mit einer Mindestähnlichkeit
    .map((e) => e.entry)
}

// Findet ähnliche Einträge mit Ähnlichkeitswerten
export function findSimilarEntriesWithScores(
  entry: XPEintrag,
  allEntries: XPEintrag[],
  limit = 5,
): Array<{ entry: XPEintrag; similarity: number }> {
  if (!entry || !allEntries.length) return []

  // Berechne Ähnlichkeit für jeden Eintrag (außer dem Eintrag selbst)
  const entriesWithSimilarity = allEntries
    .filter((e) => e.id !== entry.id)
    .map((e) => ({
      entry: e,
      similarity: calculateOverallSimilarity(entry, e),
    }))
    .sort((a, b) => b.similarity - a.similarity)

  // Gib die ähnlichsten Einträge mit Ähnlichkeitswerten zurück
  return entriesWithSimilarity.slice(0, limit).filter((e) => e.similarity > 0.1) // Nur Einträge mit einer Mindestähnlichkeit
}
