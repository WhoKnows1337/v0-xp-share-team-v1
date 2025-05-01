import type { XPEintrag } from "@/types/xp-eintrag"

// Simulierte KI-Zusammenfassung eines Eintrags
export function summarizeEntry(entry: XPEintrag): string {
  // In einer echten Anwendung würde hier ein KI-Modell verwendet werden
  // Für die Demo simulieren wir eine einfache Zusammenfassung

  const content = entry.inhalt

  // Extrahiere die ersten 2-3 Sätze
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const firstSentences = sentences.slice(0, Math.min(2, sentences.length)).join(". ") + "."

  // Füge einen zusammenfassenden Satz hinzu
  let summary = firstSentences

  // Füge Stimmungs-Analyse hinzu, wenn vorhanden
  if (entry.mood) {
    const moods = Array.isArray(entry.mood) ? entry.mood : [entry.mood]
    const moodText =
      moods.length === 1 ? `Die Stimmung war ${moods[0]}.` : `Die Stimmungen waren ${moods.join(" und ")}.`

    summary += ` ${moodText}`
  }

  // Füge Tag-Analyse hinzu, wenn vorhanden
  if (entry.tags && entry.tags.length > 0) {
    const tagText = `Hauptthemen: ${entry.tags.slice(0, 3).join(", ")}.`
    summary += ` ${tagText}`
  }

  return summary
}

// Simulierte KI-Zusammenfassung mehrerer Einträge
export function summarizeEntries(entries: XPEintrag[]): string {
  if (entries.length === 0) return "Keine Einträge vorhanden."

  // Anzahl der Einträge
  const count = entries.length

  // Zeitraum
  const dates = entries.map((e) => new Date(e.datum))
  const oldestDate = new Date(Math.min(...dates.map((d) => d.getTime())))
  const newestDate = new Date(Math.max(...dates.map((d) => d.getTime())))

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })
  }

  // Häufigste Stimmungen
  const moodCounts: Record<string, number> = {}
  entries.forEach((entry) => {
    if (entry.mood) {
      const moods = Array.isArray(entry.mood) ? entry.mood : [entry.mood]
      moods.forEach((mood) => {
        moodCounts[mood] = (moodCounts[mood] || 0) + 1
      })
    }
  })

  const topMoods = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([mood]) => mood)

  // Häufigste Tags
  const tagCounts: Record<string, number> = {}
  entries.forEach((entry) => {
    if (entry.tags) {
      entry.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    }
  })

  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => tag)

  // Zusammenfassung erstellen
  let summary = `Du hast ${count} Einträge im Zeitraum vom ${formatDate(oldestDate)} bis ${formatDate(newestDate)} verfasst.`

  if (topMoods.length > 0) {
    summary += ` Die vorherrschenden Stimmungen waren ${topMoods.join(" und ")}.`
  }

  if (topTags.length > 0) {
    summary += ` Häufige Themen waren ${topTags.join(", ")}.`
  }

  return summary
}
