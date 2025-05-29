import { type NextRequest, NextResponse } from "next/server"
import { createEmbedding } from "@/lib/ai/embedding-service"
import { vectorSearch } from "@/lib/ai/vector-database"
import { aiCache } from "@/lib/ai/ai-cache"

export async function POST(request: NextRequest) {
  try {
    const { text, action } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text ist erforderlich" }, { status: 400 })
    }

    if (action === "create") {
      // Erstelle Embedding
      const cacheKey = aiCache.embeddingKey(text)
      let embedding = await aiCache.get(cacheKey)

      if (!embedding) {
        embedding = await createEmbedding(text)
        await aiCache.set(cacheKey, embedding, 1440) // 24 Stunden Cache
      }

      return NextResponse.json({ embedding })
    } else if (action === "search") {
      // Führe semantische Suche durch
      const embedding = await createEmbedding(text)
      const results = await vectorSearch(embedding.embedding)

      return NextResponse.json({ results })
    }

    return NextResponse.json({ error: "Ungültige Aktion" }, { status: 400 })
  } catch (error) {
    console.error("Fehler in Embeddings API:", error)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}
