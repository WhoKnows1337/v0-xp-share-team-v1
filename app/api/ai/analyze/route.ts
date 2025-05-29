import { type NextRequest, NextResponse } from "next/server"
import { analyzePatterns, generateSmartSuggestions } from "@/lib/ai/pattern-recognition"
import { generateMultiEntrySummary, analyzeEmotionalContent } from "@/lib/ai/intelligent-summary"
import { aiCache } from "@/lib/ai/ai-cache"

export async function POST(request: NextRequest) {
  try {
    const { type, data, userId } = await request.json()

    switch (type) {
      case "patterns": {
        const cacheKey = aiCache.analysisKey(userId, "patterns", JSON.stringify(data))
        let analysis = await aiCache.get(cacheKey)

        if (!analysis) {
          analysis = await analyzePatterns(data)
          await aiCache.set(cacheKey, analysis, 240) // 4 Stunden Cache
        }

        return NextResponse.json({ analysis })
      }

      case "summary": {
        const { entries, timeframe } = data
        const summary = await generateMultiEntrySummary(entries, timeframe)
        return NextResponse.json({ summary })
      }

      case "emotions": {
        const { text } = data
        const emotions = await analyzeEmotionalContent(text)
        return NextResponse.json({ emotions })
      }

      case "suggestions": {
        const { entries, context } = data
        const suggestions = await generateSmartSuggestions(entries, context)
        return NextResponse.json({ suggestions })
      }

      default:
        return NextResponse.json({ error: "Ungültiger Analysetyp" }, { status: 400 })
    }
  } catch (error) {
    console.error("Fehler in Analyse API:", error)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}
