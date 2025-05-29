import { generateText, generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import type { Erlebnis } from "@/types/erlebnis"
import type { XPEintrag } from "@/types/xp-eintrag"

/**
 * Generiert eine intelligente Zusammenfassung eines Erlebnisses
 */
export async function generateErlebnisSummary(erlebnis: Erlebnis): Promise<{
  summary: string
  keyPoints: string[]
  emotions: Array<{ emotion: string; intensity: number }>
  themes: string[]
  actionableInsights: string[]
}> {
  const prompt = `
    Analysiere das folgende Erlebnis und erstelle eine umfassende Zusammenfassung:

    Titel: ${erlebnis.titel}
    Kategorie: ${erlebnis.kategorie.name}
    Beschreibung: ${erlebnis.beschreibung}
    Tags: ${erlebnis.tags.join(", ")}
    Datum: ${erlebnis.datum}
    ${erlebnis.ort ? `Ort: ${erlebnis.ort.name}` : ""}

    Erstelle:
    1. Eine prägnante Zusammenfassung (2-3 Sätze)
    2. Die wichtigsten Erkenntnisse (3-5 Punkte)
    3. Identifizierte Emotionen mit Intensität (0-1)
    4. Zentrale Themen
    5. Handlungsempfehlungen basierend auf dem Erlebnis
  `

  const schema = z.object({
    summary: z.string(),
    keyPoints: z.array(z.string()),
    emotions: z.array(
      z.object({
        emotion: z.string(),
        intensity: z.number().min(0).max(1),
      }),
    ),
    themes: z.array(z.string()),
    actionableInsights: z.array(z.string()),
  })

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      prompt,
      schema,
    })

    return object
  } catch (error) {
    console.error("Fehler bei der Zusammenfassung:", error)
    return {
      summary: erlebnis.kurzfassung,
      keyPoints: [],
      emotions: [],
      themes: erlebnis.tags,
      actionableInsights: [],
    }
  }
}

/**
 * Generiert eine Zusammenfassung mehrerer XP-Einträge
 */
export async function generateMultiEntrySummary(
  entries: XPEintrag[],
  timeframe: string,
): Promise<{
  overview: string
  trends: Array<{ trend: string; description: string }>
  dominantMoods: Array<{ mood: string; percentage: number }>
  growthAreas: string[]
  recommendations: string[]
}> {
  const entrySummaries = entries.map((entry) => ({
    titel: entry.titel,
    datum: entry.datum,
    mood: entry.mood,
    tags: entry.tags || [],
    preview: entry.inhalt.substring(0, 150),
  }))

  const prompt = `
    Analysiere die folgenden Tagebucheinträge aus dem Zeitraum ${timeframe}:

    ${JSON.stringify(entrySummaries, null, 2)}

    Erstelle:
    1. Eine Übersicht über den Zeitraum
    2. Identifizierte Trends
    3. Vorherrschende Stimmungen mit Prozentangaben
    4. Bereiche persönlichen Wachstums
    5. Empfehlungen für die Zukunft
  `

  const schema = z.object({
    overview: z.string(),
    trends: z.array(
      z.object({
        trend: z.string(),
        description: z.string(),
      }),
    ),
    dominantMoods: z.array(
      z.object({
        mood: z.string(),
        percentage: z.number().min(0).max(100),
      }),
    ),
    growthAreas: z.array(z.string()),
    recommendations: z.array(z.string()),
  })

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      prompt,
      schema,
    })

    return object
  } catch (error) {
    console.error("Fehler bei der Mehrfach-Zusammenfassung:", error)
    return {
      overview: `Zusammenfassung von ${entries.length} Einträgen im Zeitraum ${timeframe}`,
      trends: [],
      dominantMoods: [],
      growthAreas: [],
      recommendations: [],
    }
  }
}

/**
 * Generiert eine emotionale Analyse eines Textes
 */
export async function analyzeEmotionalContent(text: string): Promise<{
  primaryEmotion: string
  emotionSpectrum: Array<{ emotion: string; score: number }>
  sentiment: "positiv" | "neutral" | "negativ"
  emotionalJourney: string
}> {
  const prompt = `
    Analysiere den emotionalen Gehalt des folgenden Textes:

    "${text}"

    Identifiziere:
    1. Die primäre Emotion
    2. Das Spektrum aller vorhandenen Emotionen (mit Scores 0-1)
    3. Die allgemeine Stimmung (positiv/neutral/negativ)
    4. Die emotionale Reise/Entwicklung im Text
  `

  const schema = z.object({
    primaryEmotion: z.string(),
    emotionSpectrum: z.array(
      z.object({
        emotion: z.string(),
        score: z.number().min(0).max(1),
      }),
    ),
    sentiment: z.enum(["positiv", "neutral", "negativ"]),
    emotionalJourney: z.string(),
  })

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      prompt,
      schema,
    })

    return object
  } catch (error) {
    console.error("Fehler bei der emotionalen Analyse:", error)
    return {
      primaryEmotion: "unbekannt",
      emotionSpectrum: [],
      sentiment: "neutral",
      emotionalJourney: "Keine emotionale Analyse verfügbar",
    }
  }
}

/**
 * Generiert Reflexionsfragen basierend auf einem Erlebnis
 */
export async function generateReflectionQuestions(
  content: string,
  context: { tags?: string[]; mood?: string },
): Promise<string[]> {
  const prompt = `
    Basierend auf dem folgenden Inhalt, generiere 5 tiefgründige Reflexionsfragen:

    Inhalt: "${content}"
    ${context.tags ? `Tags: ${context.tags.join(", ")}` : ""}
    ${context.mood ? `Stimmung: ${context.mood}` : ""}

    Die Fragen sollten:
    - Zum Nachdenken anregen
    - Persönliches Wachstum fördern
    - Neue Perspektiven eröffnen
    - Konkret und relevant sein

    Gib die Fragen als JSON-Array zurück.
  `

  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      temperature: 0.8,
    })

    return JSON.parse(text)
  } catch (error) {
    console.error("Fehler beim Generieren von Reflexionsfragen:", error)
    return [
      "Was hat dieses Erlebnis für dich bedeutet?",
      "Welche Erkenntnisse nimmst du daraus mit?",
      "Wie hat es deine Perspektive verändert?",
      "Was würdest du beim nächsten Mal anders machen?",
      "Welche Emotionen wurden ausgelöst und warum?",
    ]
  }
}
