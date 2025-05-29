import { config } from "./config"

export interface AIAnalysis {
  sentiment: "positive" | "neutral" | "negative"
  emotions: string[]
  keywords: string[]
  categories: string[]
  summary: string
  insights: string[]
  confidence: number
}

export interface SimilarityResult {
  id: string
  title: string
  similarity: number
  reason: string
}

export interface PatternAnalysis {
  patterns: {
    temporal: string[]
    emotional: string[]
    location: string[]
    activity: string[]
  }
  trends: {
    mood_trend: "improving" | "declining" | "stable"
    activity_trend: "increasing" | "decreasing" | "stable"
    social_trend: "more_social" | "less_social" | "stable"
  }
  recommendations: string[]
}

class AIService {
  // Analysiert ein Erlebnis mit KI
  async analyzeExperience(content: string, metadata?: any): Promise<AIAnalysis> {
    if (config.useMockData) {
      // Mock-KI-Analyse
      return {
        sentiment: "positive",
        emotions: ["peaceful", "grateful", "inspired"],
        keywords: ["meditation", "natur", "ruhe", "achtsamkeit"],
        categories: ["Spiritualität", "Natur", "Wellness"],
        summary: "Ein positives Erlebnis in der Natur mit Fokus auf Meditation und Achtsamkeit.",
        insights: [
          "Naturerlebnisse fördern das Wohlbefinden",
          "Meditation hilft beim Stressabbau",
          "Regelmäßige Auszeiten sind wichtig",
        ],
        confidence: 0.87,
      }
    }

    try {
      // Hier würde normalerweise ein API-Call zu einem KI-Service gemacht
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, metadata }),
      })

      if (!response.ok) throw new Error("KI-Analyse fehlgeschlagen")

      return await response.json()
    } catch (error) {
      console.error("Fehler bei der KI-Analyse:", error)
      throw error
    }
  }

  // Findet ähnliche Erlebnisse
  async findSimilarExperiences(experienceId: string, content: string): Promise<SimilarityResult[]> {
    if (config.useMockData) {
      return [
        {
          id: "2",
          title: "Waldspaziergang bei Sonnenaufgang",
          similarity: 0.85,
          reason: "Ähnliche Naturerfahrung und meditative Elemente",
        },
        {
          id: "3",
          title: "Yoga im Park",
          similarity: 0.72,
          reason: "Gemeinsame Themen: Achtsamkeit und Outdoor-Aktivität",
        },
        {
          id: "4",
          title: "Stille Wanderung in den Bergen",
          similarity: 0.68,
          reason: "Ähnliche emotionale Resonanz und Naturverbindung",
        },
      ]
    }

    try {
      const response = await fetch("/api/ai/similarity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experienceId, content }),
      })

      if (!response.ok) throw new Error("Ähnlichkeitsanalyse fehlgeschlagen")

      return await response.json()
    } catch (error) {
      console.error("Fehler bei der Ähnlichkeitsanalyse:", error)
      throw error
    }
  }

  // Analysiert Muster in Erlebnissen
  async analyzePatterns(userId: string, timeframe: "week" | "month" | "year"): Promise<PatternAnalysis> {
    if (config.useMockData) {
      return {
        patterns: {
          temporal: ["Wochenenden sind aktiver", "Abends mehr reflektive Erlebnisse"],
          emotional: ["Positive Stimmung bei Naturerlebnissen", "Stress bei Arbeitserlebnissen"],
          location: ["Häufige Besuche in Parks", "Seltene Reisen ins Ausland"],
          activity: ["Meditation wird regelmäßiger", "Sport nimmt ab"],
        },
        trends: {
          mood_trend: "improving",
          activity_trend: "stable",
          social_trend: "more_social",
        },
        recommendations: [
          "Mehr Outdoor-Aktivitäten einplanen",
          "Regelmäßige Meditation beibehalten",
          "Soziale Kontakte weiter ausbauen",
          "Work-Life-Balance verbessern",
        ],
      }
    }

    try {
      const response = await fetch("/api/ai/patterns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, timeframe }),
      })

      if (!response.ok) throw new Error("Musteranalyse fehlgeschlagen")

      return await response.json()
    } catch (error) {
      console.error("Fehler bei der Musteranalyse:", error)
      throw error
    }
  }

  // Generiert automatische Tags
  async generateTags(content: string): Promise<string[]> {
    if (config.useMockData) {
      const words = content.toLowerCase().split(" ")
      const commonTags = ["meditation", "natur", "ruhe", "achtsamkeit", "entspannung", "wellness"]
      return commonTags.filter((tag) => words.some((word) => word.includes(tag.substring(0, 4))))
    }

    try {
      const response = await fetch("/api/ai/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) throw new Error("Tag-Generierung fehlgeschlagen")

      return await response.json()
    } catch (error) {
      console.error("Fehler bei der Tag-Generierung:", error)
      throw error
    }
  }

  // Erstellt eine automatische Zusammenfassung
  async generateSummary(content: string, maxLength = 150): Promise<string> {
    if (config.useMockData) {
      const sentences = content.split(".").filter((s) => s.trim().length > 0)
      const summary = sentences.slice(0, 2).join(". ") + "."
      return summary.length > maxLength ? summary.substring(0, maxLength) + "..." : summary
    }

    try {
      const response = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, maxLength }),
      })

      if (!response.ok) throw new Error("Zusammenfassung fehlgeschlagen")

      const data = await response.json()
      return data.summary
    } catch (error) {
      console.error("Fehler bei der Zusammenfassung:", error)
      throw error
    }
  }

  // Semantische Suche
  async semanticSearch(query: string, filters?: any): Promise<any[]> {
    if (config.useMockData) {
      // Mock-Suchergebnisse basierend auf der Anfrage
      const mockResults = [
        {
          id: "1",
          title: "Meditation im Schwarzwald",
          relevance: 0.95,
          snippet: "Eine tiefe Meditationserfahrung in der Natur...",
        },
        {
          id: "2",
          title: "Achtsamkeit im Alltag",
          relevance: 0.78,
          snippet: "Wie man Achtsamkeit in den Alltag integriert...",
        },
      ]

      return mockResults.filter(
        (result) =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.snippet.toLowerCase().includes(query.toLowerCase()),
      )
    }

    try {
      const response = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, filters }),
      })

      if (!response.ok) throw new Error("Semantische Suche fehlgeschlagen")

      return await response.json()
    } catch (error) {
      console.error("Fehler bei der semantischen Suche:", error)
      throw error
    }
  }

  // Emotionsanalyse
  async analyzeEmotion(content: string): Promise<{ emotion: string; confidence: number }[]> {
    if (config.useMockData) {
      return [
        { emotion: "joy", confidence: 0.85 },
        { emotion: "peace", confidence: 0.78 },
        { emotion: "gratitude", confidence: 0.65 },
      ]
    }

    try {
      const response = await fetch("/api/ai/emotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) throw new Error("Emotionsanalyse fehlgeschlagen")

      return await response.json()
    } catch (error) {
      console.error("Fehler bei der Emotionsanalyse:", error)
      throw error
    }
  }
}

export const aiService = new AIService()
