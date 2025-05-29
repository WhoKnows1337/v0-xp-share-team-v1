import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { aiCache } from "@/lib/ai/ai-cache"

export async function POST(request: NextRequest) {
  try {
    const { userId, experienceId, type = "similar" } = await request.json()

    const cacheKey = `recommendations:${userId}:${type}:${experienceId || "all"}`
    let recommendations = await aiCache.get(cacheKey)

    if (recommendations) {
      return NextResponse.json({ recommendations })
    }

    if (type === "similar" && experienceId) {
      // Finde ähnliche Erlebnisse
      // In Produktion würde hier die echte Datenbank abgefragt
      recommendations = {
        type: "similar",
        items: [
          {
            id: "1",
            title: "Ähnliches Erlebnis 1",
            similarity: 0.92,
            reason: "Ähnliche Themen und Emotionen",
          },
          {
            id: "2",
            title: "Ähnliches Erlebnis 2",
            similarity: 0.87,
            reason: "Gleiche Kategorie und Zeitraum",
          },
        ],
      }
    } else if (type === "personalized") {
      // Generiere personalisierte Empfehlungen
      const prompt = `
        Generiere 5 personalisierte Empfehlungen für einen Nutzer basierend auf seinen Interessen.
        
        Format als JSON:
        {
          "recommendations": [
            {
              "title": "Empfehlungstitel",
              "description": "Kurze Beschreibung",
              "reason": "Warum diese Empfehlung",
              "category": "Kategorie"
            }
          ]
        }
      `

      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        prompt,
        temperature: 0.8,
      })

      recommendations = JSON.parse(text)
    }

    await aiCache.set(cacheKey, recommendations, 120) // 2 Stunden Cache
    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Fehler bei Empfehlungen:", error)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}
