import { realtimeService } from "@/lib/realtime-service"
import { addToEmbeddingQueue, autoProcessNewExperience } from "./batch-processor"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

/**
 * Service für Real-time AI-Updates
 */
export class RealtimeAIService {
  private isListening = false

  /**
   * Startet das Listening für Real-time Updates
   */
  start() {
    if (this.isListening) {
      console.log("Real-time AI Service läuft bereits")
      return
    }

    this.isListening = true
    console.log("🚀 Real-time AI Service gestartet")

    // Höre auf neue Erlebnisse
    this.listenToExperiences()

    // Höre auf neue XP-Einträge
    this.listenToXPEntries()

    // Höre auf neue Kommentare
    this.listenToComments()

    // Höre auf Bewertungen
    this.listenToRatings()
  }

  /**
   * Stoppt das Real-time Listening
   */
  stop() {
    this.isListening = false
    console.log("⏹️ Real-time AI Service gestoppt")
  }

  /**
   * Höre auf neue Erlebnisse
   */
  private listenToExperiences() {
    const channel = supabaseAdmin
      .channel("experiences_ai")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "experiences",
        },
        async (payload) => {
          console.log("🆕 Neues Erlebnis erkannt:", payload.new.id)
          await this.handleNewExperience(payload.new)
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "experiences",
        },
        async (payload) => {
          console.log("📝 Erlebnis aktualisiert:", payload.new.id)
          await this.handleUpdatedExperience(payload.new, payload.old)
        },
      )
      .subscribe()

    console.log("👂 Listening für Experience-Updates")
  }

  /**
   * Höre auf neue XP-Einträge
   */
  private listenToXPEntries() {
    // Implementierung für XP-Einträge (falls Tabelle existiert)
    console.log("👂 Listening für XP-Entry-Updates")
  }

  /**
   * Höre auf neue Kommentare
   */
  private listenToComments() {
    const channel = supabaseAdmin
      .channel("comments_ai")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
        },
        async (payload) => {
          console.log("💬 Neuer Kommentar erkannt:", payload.new.id)
          await this.handleNewComment(payload.new)
        },
      )
      .subscribe()

    console.log("👂 Listening für Comment-Updates")
  }

  /**
   * Höre auf neue Bewertungen
   */
  private listenToRatings() {
    const channel = supabaseAdmin
      .channel("ratings_ai")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ratings",
        },
        async (payload) => {
          console.log("⭐ Neue Bewertung erkannt:", payload.new.id)
          await this.handleNewRating(payload.new)
        },
      )
      .subscribe()

    console.log("👂 Listening für Rating-Updates")
  }

  /**
   * Verarbeitet neue Erlebnisse
   */
  private async handleNewExperience(experience: any) {
    try {
      // Automatische Embedding-Erstellung
      const combinedText = `${experience.title} ${experience.summary || ""} ${experience.content || ""}`
      await autoProcessNewExperience(experience.id, experience.title, combinedText, [])

      // Invalidiere relevante Caches
      await this.invalidateSearchCaches()

      // Sende Real-time Benachrichtigung
      await realtimeService.broadcast("ai_updates", "new_experience_processed", {
        experienceId: experience.id,
        title: experience.title,
      })

      // Trigger Clustering-Update (asynchron)
      setTimeout(() => {
        this.triggerClusteringUpdate().catch(console.error)
      }, 5000)

      console.log("✅ Neues Erlebnis verarbeitet:", experience.id)
    } catch (error) {
      console.error("❌ Fehler bei der Verarbeitung des neuen Erlebnisses:", error)
    }
  }

  /**
   * Verarbeitet aktualisierte Erlebnisse
   */
  private async handleUpdatedExperience(newExperience: any, oldExperience: any) {
    try {
      // Prüfe ob relevante Felder geändert wurden
      const relevantFields = ["title", "summary", "content"]
      const hasRelevantChanges = relevantFields.some((field) => newExperience[field] !== oldExperience[field])

      if (hasRelevantChanges) {
        // Aktualisiere Embedding
        const combinedText = `${newExperience.title} ${newExperience.summary || ""} ${newExperience.content || ""}`
        await addToEmbeddingQueue("experience", newExperience.id, combinedText)

        // Invalidiere Caches
        await this.invalidateExperienceCaches(newExperience.id)

        console.log("✅ Erlebnis-Update verarbeitet:", newExperience.id)
      }
    } catch (error) {
      console.error("❌ Fehler bei der Verarbeitung des Erlebnis-Updates:", error)
    }
  }

  /**
   * Verarbeitet neue Kommentare
   */
  private async handleNewComment(comment: any) {
    try {
      // Füge Kommentar zur Embedding-Queue hinzu
      await addToEmbeddingQueue("comment", comment.id, comment.content)

      // Aktualisiere Erlebnis-Statistiken
      await this.updateExperienceStats(comment.experience_id)

      console.log("✅ Neuer Kommentar verarbeitet:", comment.id)
    } catch (error) {
      console.error("❌ Fehler bei der Kommentar-Verarbeitung:", error)
    }
  }

  /**
   * Verarbeitet neue Bewertungen
   */
  private async handleNewRating(rating: any) {
    try {
      // Aktualisiere Erlebnis-Statistiken
      await this.updateExperienceStats(rating.experience_id)

      // Trigger Empfehlungs-Update
      setTimeout(() => {
        this.updateRecommendations(rating.user_id).catch(console.error)
      }, 1000)

      console.log("✅ Neue Bewertung verarbeitet:", rating.id)
    } catch (error) {
      console.error("❌ Fehler bei der Bewertungs-Verarbeitung:", error)
    }
  }

  /**
   * Invalidiert Such-Caches
   */
  private async invalidateSearchCaches() {
    // Lösche alle Such-Caches
    const { error } = await supabaseAdmin.from("ai_cache").delete().like("cache_key", "search:%")

    if (error) {
      console.error("Fehler beim Invalidieren der Such-Caches:", error)
    } else {
      console.log("🗑️ Such-Caches invalidiert")
    }
  }

  /**
   * Invalidiert Caches für ein spezifisches Erlebnis
   */
  private async invalidateExperienceCaches(experienceId: string) {
    const patterns = [`%${experienceId}%`, "clustering:%", "analysis:%"]

    for (const pattern of patterns) {
      await supabaseAdmin.from("ai_cache").delete().like("cache_key", pattern)
    }

    console.log("🗑️ Erlebnis-Caches invalidiert:", experienceId)
  }

  /**
   * Aktualisiert Erlebnis-Statistiken
   */
  private async updateExperienceStats(experienceId: string) {
    // Hole aktuelle Statistiken
    const { data: comments } = await supabaseAdmin.from("comments").select("id").eq("experience_id", experienceId)

    const { data: ratings } = await supabaseAdmin.from("ratings").select("value").eq("experience_id", experienceId)

    // Berechne Durchschnittsbewertung
    const avgRating = ratings && ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length : 0

    // Aktualisiere Erlebnis
    await supabaseAdmin
      .from("experiences")
      .update({
        comment_count: comments?.length || 0,
        rating_average: avgRating,
        rating_count: ratings?.length || 0,
      })
      .eq("id", experienceId)

    console.log("📊 Statistiken aktualisiert für Erlebnis:", experienceId)
  }

  /**
   * Trigger Clustering-Update
   */
  private async triggerClusteringUpdate() {
    // Invalidiere Clustering-Caches
    await supabaseAdmin.from("ai_cache").delete().like("cache_key", "clustering:%")

    console.log("🔄 Clustering-Update getriggert")
  }

  /**
   * Aktualisiert Empfehlungen für einen Benutzer
   */
  private async updateRecommendations(userId: string) {
    // Invalidiere Empfehlungs-Caches für den Benutzer
    await supabaseAdmin.from("ai_cache").delete().like("cache_key", `recommendations:${userId}:%`)

    console.log("🎯 Empfehlungen-Update für Benutzer:", userId)
  }
}

export const realtimeAIService = new RealtimeAIService()
