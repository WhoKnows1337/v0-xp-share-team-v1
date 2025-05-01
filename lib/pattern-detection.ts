import type { XPEintrag } from "@/types/xp-eintrag"

// Symbole und Muster, die erkannt werden sollen
const commonSymbols = [
  { name: "Wasser", keywords: ["wasser", "meer", "ozean", "see", "fluss", "schwimmen", "tauchen", "regen"] },
  { name: "Fliegen", keywords: ["fliegen", "flug", "schweben", "luft", "himmel", "vogel", "flügel"] },
  { name: "Fallen", keywords: ["fallen", "sturz", "absturz", "abgrund", "tiefe"] },
  { name: "Verfolgung", keywords: ["verfolg", "jagen", "flucht", "entkommen", "verstecken"] },
  { name: "Prüfung", keywords: ["prüfung", "test", "examen", "klausur", "bestehen", "durchfallen"] },
  { name: "Zähne", keywords: ["zahn", "zähne", "mund", "kauen", "beißen"] },
  { name: "Haus", keywords: ["haus", "gebäude", "zimmer", "raum", "wohnung", "tür", "fenster"] },
  { name: "Familie", keywords: ["familie", "eltern", "mutter", "vater", "geschwister", "kind"] },
  { name: "Reise", keywords: ["reise", "weg", "pfad", "straße", "ziel", "ankommen"] },
  { name: "Transformation", keywords: ["verwandlung", "veränderung", "wandel", "mutation", "metamorphose"] },
]

// Erkennt Symbole in einem Eintrag
export function detectSymbols(entry: XPEintrag): Array<{ symbol: string; count: number }> {
  const content = entry.inhalt.toLowerCase()
  const title = entry.titel.toLowerCase()
  const fullText = `${title} ${content}`

  return commonSymbols
    .map((symbol) => {
      let count = 0
      symbol.keywords.forEach((keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, "gi")
        const matches = fullText.match(regex)
        if (matches) {
          count += matches.length
        }
      })
      return { symbol: symbol.name, count }
    })
    .filter((result) => result.count > 0)
    .sort((a, b) => b.count - a.count)
}

// Erkennt wiederkehrende Symbole in mehreren Einträgen
export function detectRecurringSymbols(
  entries: XPEintrag[],
): Array<{ symbol: string; count: number; entries: string[] }> {
  const symbolCounts: Record<string, { count: number; entries: Set<string> }> = {}

  entries.forEach((entry) => {
    const detectedSymbols = detectSymbols(entry)
    detectedSymbols.forEach(({ symbol }) => {
      if (!symbolCounts[symbol]) {
        symbolCounts[symbol] = { count: 0, entries: new Set() }
      }
      symbolCounts[symbol].count += 1
      symbolCounts[symbol].entries.add(entry.id)
    })
  })

  return Object.entries(symbolCounts)
    .map(([symbol, { count, entries }]) => ({
      symbol,
      count,
      entries: Array.from(entries),
    }))
    .filter((item) => item.count > 1) // Nur Symbole, die in mehr als einem Eintrag vorkommen
    .sort((a, b) => b.count - a.count)
}

// Berechnet die Häufigkeit von Wörtern in Einträgen (für Tag-Cloud)
export function calculateWordFrequency(entries: XPEintrag[]): Array<{ word: string; count: number }> {
  const stopWords = new Set([
    "der",
    "die",
    "das",
    "und",
    "in",
    "zu",
    "den",
    "mit",
    "von",
    "für",
    "auf",
    "im",
    "ein",
    "eine",
    "ist",
    "es",
    "an",
    "ich",
    "du",
    "er",
    "sie",
    "wir",
    "ihr",
    "sie",
    "mich",
    "dich",
    "sich",
    "uns",
    "euch",
    "mein",
    "dein",
    "sein",
    "ihr",
    "unser",
    "euer",
    "nicht",
    "auch",
    "als",
    "am",
    "bei",
    "nach",
    "um",
    "aus",
    "so",
    "aber",
    "oder",
    "wenn",
    "wie",
    "was",
    "wer",
    "wo",
    "wann",
    "warum",
    "dass",
    "ob",
  ])

  const wordCounts: Record<string, number> = {}

  entries.forEach((entry) => {
    const content = entry.inhalt.toLowerCase()
    const words = content.split(/\W+/).filter((word) => word.length > 3 && !stopWords.has(word))

    words.forEach((word) => {
      wordCounts[word] = (wordCounts[word] || 0) + 1
    })
  })

  return Object.entries(wordCounts)
    .map(([word, count]) => ({ word, count }))
    .filter((item) => item.count > 1)
    .sort((a, b) => b.count - a.count)
}
