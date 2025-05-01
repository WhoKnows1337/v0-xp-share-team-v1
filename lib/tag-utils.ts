import type { XPEintrag } from "@/types/xp-eintrag"
import { mockXPEintraege } from "./mock-xp-eintraege"

// Gibt alle verfügbaren Tags zurück
export function getAllTags(): string[] {
  const tagSet = new Set<string>()

  mockXPEintraege.forEach((entry) => {
    if (entry.tags) {
      entry.tags.forEach((tag) => tagSet.add(tag))
    }
  })

  return Array.from(tagSet).sort()
}

// Gibt Tags zurück, die dem Suchmuster entsprechen
export function getMatchingTags(searchPattern: string): string[] {
  if (!searchPattern || searchPattern.trim() === "") {
    return getAllTags()
  }

  const pattern = searchPattern.toLowerCase().trim()
  return getAllTags().filter((tag) => tag.toLowerCase().includes(pattern))
}

// Liste von häufigen deutschen Themen für Erfahrungen
const commonThemes = [
  "Arbeit",
  "Familie",
  "Freunde",
  "Reise",
  "Natur",
  "Sport",
  "Musik",
  "Kunst",
  "Essen",
  "Gesundheit",
  "Lernen",
  "Meditation",
  "Traum",
  "Erfolg",
  "Herausforderung",
  "Beziehung",
  "Liebe",
  "Trauer",
  "Freude",
  "Ärger",
  "Angst",
  "Hoffnung",
  "Zukunft",
  "Vergangenheit",
  "Erinnerung",
  "Ziel",
  "Wachstum",
  "Veränderung",
  "Inspiration",
  "Kreativität",
  "Reflexion",
  "Dankbarkeit",
  "Erkenntnis",
  "Überraschung",
  "Abenteuer",
]

// Extrahiert potenzielle Tags aus dem Inhalt
export function extractTagsFromContent(content: string): string[] {
  if (!content) return []

  // Entferne Sonderzeichen und teile den Text in Wörter
  const words = content
    .toLowerCase()
    .replace(/[^\w\säöüß]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3)

  // Finde Übereinstimmungen mit häufigen Themen
  const matchedThemes = commonThemes.filter((theme) => {
    const lowerTheme = theme.toLowerCase()
    return words.some((word) => word === lowerTheme || word.includes(lowerTheme))
  })

  // Entferne Duplikate und gib die ersten 5 zurück
  return Array.from(new Set(matchedThemes)).slice(0, 5)
}

// Schlägt Tags basierend auf vorhandenem Inhalt und häufig verwendeten Tags vor
export function suggestTags(content: string, existingTags: string[] = [], allEntries: XPEintrag[] = []): string[] {
  // Extrahiere Tags aus dem Inhalt
  const contentTags = extractTagsFromContent(content)

  // Sammle häufig verwendete Tags aus allen Einträgen
  const tagFrequency: Record<string, number> = {}
  allEntries.forEach((entry) => {
    if (entry.tags) {
      entry.tags.forEach((tag) => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1
      })
    }
  })

  // Sortiere Tags nach Häufigkeit
  const popularTags = Object.entries(tagFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag)
    .slice(0, 10)

  // Kombiniere Tags aus Inhalt und häufig verwendete Tags
  const suggestedTags = [...contentTags, ...popularTags]

  // Entferne bereits vorhandene Tags und Duplikate
  return Array.from(new Set(suggestedTags))
    .filter((tag) => !existingTags.includes(tag))
    .slice(0, 10)
}

// Findet ähnliche Tags zu einem eingegebenen Tag
export function findSimilarTags(input: string, allTags: string[]): string[] {
  if (!input || input.length < 2) return []

  const lowerInput = input.toLowerCase()

  return allTags.filter((tag) => tag.toLowerCase().includes(lowerInput) && tag.toLowerCase() !== lowerInput).slice(0, 5)
}

// Sammelt alle einzigartigen Tags aus allen Einträgen
export function getAllUniqueTags(entries: XPEintrag[]): string[] {
  const tags = new Set<string>()

  entries.forEach((entry) => {
    if (entry.tags) {
      entry.tags.forEach((tag) => tags.add(tag))
    }
  })

  return Array.from(tags)
}

// Gibt die beliebtesten Tags zurück
export function getPopularTags(limit = 10): Array<{ tag: string; anzahl: number }> {
  const tagCounts: Record<string, number> = {}

  mockXPEintraege.forEach((entry) => {
    if (entry.tags) {
      entry.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    }
  })

  return Object.entries(tagCounts)
    .map(([tag, anzahl]) => ({ tag, anzahl }))
    .sort((a, b) => b.anzahl - a.anzahl)
    .slice(0, limit)
}

// Liste von vordefinierten Tags für Vorschläge
export const predefinedTags = [
  // Emotionen und Stimmungen
  "Glück",
  "Freude",
  "Trauer",
  "Wut",
  "Angst",
  "Überraschung",
  "Liebe",
  "Dankbarkeit",
  "Zufriedenheit",
  "Frustration",
  "Melancholie",
  "Euphorie",
  "Gelassenheit",

  // Persönliches Wachstum
  "Erkenntnis",
  "Lernen",
  "Wachstum",
  "Entwicklung",
  "Veränderung",
  "Fortschritt",
  "Herausforderung",
  "Erfolg",
  "Misserfolg",
  "Selbstreflexion",
  "Achtsamkeit",
  "Bewusstsein",
  "Transformation",

  // Beziehungen
  "Freundschaft",
  "Familie",
  "Partnerschaft",
  "Begegnung",
  "Verbindung",
  "Trennung",
  "Konflikt",
  "Versöhnung",
  "Vertrauen",
  "Kommunikation",
  "Empathie",
  "Mitgefühl",

  // Natur und Umwelt
  "Natur",
  "Wald",
  "Meer",
  "Berg",
  "Himmel",
  "Sterne",
  "Sonnenaufgang",
  "Sonnenuntergang",
  "Jahreszeit",
  "Wetter",
  "Tiere",
  "Pflanzen",
  "Umwelt",
  "Nachhaltigkeit",

  // Kreativität und Kunst
  "Kunst",
  "Musik",
  "Literatur",
  "Film",
  "Theater",
  "Tanz",
  "Fotografie",
  "Malerei",
  "Kreativität",
  "Inspiration",
  "Idee",
  "Vision",
  "Fantasie",
  "Traum",

  // Gesundheit und Wohlbefinden
  "Gesundheit",
  "Ernährung",
  "Sport",
  "Bewegung",
  "Entspannung",
  "Schlaf",
  "Meditation",
  "Yoga",
  "Balance",
  "Energie",
  "Vitalität",
  "Heilung",
  "Selbstfürsorge",

  // Spiritualität und Philosophie
  "Spiritualität",
  "Philosophie",
  "Religion",
  "Glaube",
  "Sinn",
  "Bedeutung",
  "Werte",
  "Ethik",
  "Moral",
  "Weisheit",
  "Intuition",
  "Bewusstsein",
  "Seele",
  "Geist",

  // Alltag und Lebensstil
  "Alltag",
  "Routine",
  "Arbeit",
  "Freizeit",
  "Hobby",
  "Reisen",
  "Abenteuer",
  "Erlebnis",
  "Essen",
  "Kochen",
  "Wohnen",
  "Mode",
  "Technologie",
  "Finanzen",
  "Zeit",

  // Besondere Ereignisse
  "Geburtstag",
  "Hochzeit",
  "Jubiläum",
  "Feiertag",
  "Fest",
  "Urlaub",
  "Reise",
  "Umzug",
  "Abschluss",
  "Beförderung",
  "Ruhestand",
  "Neuanfang",
  "Abschied",
  "Wiedersehen",

  // Metaphysisches und Außergewöhnliches
  "Synchronizität",
  "Zufall",
  "Schicksal",
  "Bestimmung",
  "Wunder",
  "Mysterium",
  "Rätsel",
  "Paranormal",
  "Übersinnlich",
  "Déjà-vu",
  "Vorahnung",
  "Zeichen",
  "Symbol",
]
