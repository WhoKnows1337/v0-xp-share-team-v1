import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export class AICache {
  /**
   * Speichert ein Ergebnis im Cache
   */
  async set(key: string, value: any, ttlMinutes = 60) {
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000)

    const { error } = await supabaseAdmin.from("ai_cache").upsert(
      {
        cache_key: key,
        cache_value: value,
        expires_at: expiresAt.toISOString(),
      },
      {
        onConflict: "cache_key",
      },
    )

    if (error) {
      console.error("Cache-Fehler beim Speichern:", error)
      throw error
    }
  }

  /**
   * Holt ein Ergebnis aus dem Cache
   */
  async get<T = any>(key: string): Promise<T | null> {
    const { data, error } = await supabaseAdmin
      .from("ai_cache")
      .select("cache_value, expires_at")
      .eq("cache_key", key)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // Kein Eintrag gefunden
        return null
      }
      console.error("Cache-Fehler beim Abrufen:", error)
      return null
    }

    // Prüfe Ablaufzeit
    if (new Date(data.expires_at) < new Date()) {
      // Abgelaufen - lösche Eintrag
      await this.delete(key)
      return null
    }

    return data.cache_value as T
  }

  /**
   * Löscht einen Cache-Eintrag
   */
  async delete(key: string) {
    const { error } = await supabaseAdmin.from("ai_cache").delete().eq("cache_key", key)

    if (error) {
      console.error("Cache-Fehler beim Löschen:", error)
    }
  }

  /**
   * Löscht abgelaufene Cache-Einträge
   */
  async cleanup() {
    const { error } = await supabaseAdmin.from("ai_cache").delete().lt("expires_at", new Date().toISOString())

    if (error) {
      console.error("Cache-Cleanup-Fehler:", error)
    } else {
      console.log("✅ Cache-Cleanup abgeschlossen")
    }
  }

  /**
   * Generiert einen Cache-Key für Embeddings
   */
  embeddingKey(text: string, model = "text-embedding-3-small"): string {
    const hash = this.simpleHash(text)
    return `embedding:${model}:${hash}`
  }

  /**
   * Generiert einen Cache-Key für Analysen
   */
  analysisKey(userId: string, type: string, dataHash: string): string {
    return `analysis:${type}:${userId}:${dataHash}`
  }

  /**
   * Generiert einen Cache-Key für Suchen
   */
  searchKey(query: string, filters: any = {}): string {
    const filterHash = this.simpleHash(JSON.stringify(filters))
    const queryHash = this.simpleHash(query)
    return `search:${queryHash}:${filterHash}`
  }

  /**
   * Einfache Hash-Funktion für Cache-Keys
   */
  private simpleHash(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36)
  }
}

export const aiCache = new AICache()

/**
 * Decorator für automatisches Caching von AI-Funktionen
 */
export function cached(ttlMinutes = 60) {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${target.constructor.name}:${propertyName}:${aiCache.simpleHash(JSON.stringify(args))}`

      // Versuche aus Cache zu laden
      const cached = await aiCache.get(cacheKey)
      if (cached !== null) {
        console.log(`📦 Cache-Hit für ${propertyName}`)
        return cached
      }

      // Führe Funktion aus
      console.log(`🔄 Cache-Miss für ${propertyName} - führe aus...`)
      const result = await method.apply(this, args)

      // Speichere im Cache
      await aiCache.set(cacheKey, result, ttlMinutes)

      return result
    }
  }
}
