import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { XPEintrag } from "@/types/xp-eintrag"
import type { Erlebnis } from "@/types/erlebnis"

/**
 * Analysiert Muster in einer Sammlung von Einträgen
 */
export async function analyzePatterns(entries: XPEintrag[]): Promise<{
  patterns: Array<{
    type: string
    description: string
    confidence: number
    examples: string[]
  }>
  insights: string[]
  recommendations: string[]
}> {
  if (entries.length === 0) {
    return { patterns: [], insights: [], recommendations: [] }
  }

  // Bereite Daten für die Analyse vor
  const entrySummaries = entries.map((entry) => ({
    titel: entry.titel,
    datum: entry.datum,
    tags: entry.tags || [],
    mood: entry.mood || "neutral",
    preview: entry.inhalt.substring(0, 200),
  }))

  const prompt = `
    Analysiere die folgenden Tagebucheinträge und identifiziere Muster:

    ${JSON.stringify(entrySummaries, null, 2)}

    Identifiziere:
    1. Wiederkehrende Themen oder Muster
    2. Emotionale Trends
    3. Zeitliche Muster (z.B. bestimmte Tage/Zeiten)
    4. Zusammenhänge zwischen Tags und Stimmungen

    Gib die Analyse im folgenden JSON-Format zurück:
    {
      "patterns": [
        {
          "type": "Thematisch|Emotional|Zeitlich|Zusammenhang",
          "description": "Beschreibung des Musters",
          "confidence": 0.0-1.0,
          "examples": ["Beispiel 1", "Beispiel 2"]
        }
      ],
      "insights": ["Einblick 1", "Einblick 2"],
      "recommendations": ["Empfehlung 1", "Empfehlung 2"]
    }
  `

  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      temperature: 0.7,
    })

    // Parse die JSON-Antwort
    const analysis = JSON.parse(text)
    return analysis
  } catch (error) {
    console.error("Fehler bei der Musteranalyse:", error)
    return {
      patterns: [],
      insights: ["Musteranalyse konnte nicht durchgeführt werden"],
      recommendations: ["Versuche es später erneut"],
    }
  }
}

/**
 * Erkennt Anomalien in Einträgen
 */
export async function detectAnomalies(
  entries: XPEintrag[],
  newEntry: XPEintrag,
): Promise<{
  isAnomaly: boolean
  confidence: number
  reasons: string[]
}> {
  if (entries.length < 5) {
    return {
      isAnomaly: false,
      confidence: 0,
      reasons: ["Nicht genügend Daten für Anomalieerkennung"],
    }
  }

  const prompt = `
    Analysiere, ob der neue Eintrag eine Anomalie im Vergleich zu den bisherigen Einträgen darstellt:

    Bisherige Einträge (Zusammenfassung):
    - Durchschnittliche Länge: ${Math.round(entries.reduce((sum, e) => sum + e.inhalt.length, 0) / entries.length)} Zeichen
    - Häufigste Tags: ${getTopItems(
      entries.flatMap((e) => e.tags || []),
      5,
    ).join(", ")}
    - Häufigste Stimmungen: ${getTopItems(
      entries.map((e) => e.mood || "neutral"),
      3,
    ).join(", ")}

    Neuer Eintrag:
    - Titel: ${newEntry.titel}
    - Länge: ${newEntry.inhalt.length} Zeichen
    - Tags: ${(newEntry.tags || []).join(", ")}
    - Stimmung: ${newEntry.mood || "neutral"}
    - Vorschau: ${newEntry.inhalt.substring(0, 200)}

    Bewerte, ob dies eine Anomalie ist (ungewöhnlich im Vergleich zum bisherigen Muster).
    
    Antworte im JSON-Format:
    {
      "isAnomaly": true/false,
      "confidence": 0.0-1.0,
      "reasons": ["Grund 1", "Grund 2"]
    }
  `

  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      temperature: 0.3,
    })

    return JSON.parse(text)
  } catch (error) {
    console.error("Fehler bei der Anomalieerkennung:", error)
    return {
      isAnomaly: false,
      confidence: 0,
      reasons: ["Anomalieerkennung fehlgeschlagen"],
    }
  }
}

/**
 * Generiert intelligente Vorschläge basierend auf Mustern
 */
export async function generateSmartSuggestions(
  entries: XPEintrag[],
  context: "tags" | "titel" | "inhalt",
): Promise<string[]> {
  if (entries.length === 0) {
    return []
  }

  const recentEntries = entries.slice(-10) // Letzte 10 Einträge

  const prompt = `
    Basierend auf den letzten Einträgen, generiere ${context === "tags" ? "Tag-Vorschläge" : context === "titel" ? "Titel-Vorschläge" : "Themen-Vorschläge"}:

    Letzte Einträge:
    ${recentEntries
      .map(
        (e) => `
      - Titel: ${e.titel}
      - Tags: ${(e.tags || []).join(", ")}
      - Stimmung: ${e.mood || "neutral"}
    `,
      )
      .join("\n")}

    Generiere 5 passende ${context === "tags" ? "Tags" : context === "titel" ? "Titel" : "Themen"}, die gut zu den bisherigen Einträgen passen würden.
    
    Antworte als JSON-Array: ["Vorschlag 1", "Vorschlag 2", ...]
  `

  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      temperature: 0.8,
    })

    return JSON.parse(text)
  } catch (error) {
    console.error("Fehler beim Generieren von Vorschlägen:", error)
    return []
  }
}

/**
 * Hilfsfunktion: Gibt die häufigsten Elemente zurück
 */
function getTopItems(items: string[], count: number): string[] {
  const frequency: Record<string, number> = {}
  items.forEach((item) => {
    frequency[item] = (frequency[item] || 0) + 1
  })

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([item]) => item)
}

/**
 * Clustert Erlebnisse basierend auf semantischer Ähnlichkeit
 */
export async function clusterExperiences(
  experiences: Erlebnis[],
  numClusters = 5,
): Promise<{
  clusters: Array<{
    id: number
    name: string
    description: string
    experiences: string[]
  }>
}> {
  if (experiences.length < numClusters) {
    return { clusters: [] }
  }

  const experienceSummaries = experiences.map((exp) => ({
    id: exp.id,
    summary: `${exp.titel}: ${exp.kurzfassung}. Tags: ${exp.tags.join(", ")}`,
  }))

  const prompt = `
    Clustere die folgenden Erlebnisse in ${numClusters} thematische Gruppen:

    ${experienceSummaries.map((e) => `ID ${e.id}: ${e.summary}`).join("\n")}

    Erstelle sinnvolle Cluster basierend auf Themen, Emotionen oder Erfahrungstypen.
    
    Antworte im JSON-Format:
    {
      "clusters": [
        {
          "id": 1,
          "name": "Cluster-Name",
          "description": "Beschreibung des Clusters",
          "experiences": ["id1", "id2", ...]
        }
      ]
    }
  `

  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      temperature: 0.6,
    })

    return JSON.parse(text)
  } catch (error) {
    console.error("Fehler beim Clustering:", error)
    return { clusters: [] }
  }
}
