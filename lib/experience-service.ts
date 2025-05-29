import { getSupabaseClient } from "./supabase-client"
import { config } from "./config"
import type { Experience } from "@/types/erlebnis"

// Mock-Daten für Erlebnisse
const mockExperiences: Experience[] = [
  {
    id: "1",
    title: "Meditation im Schwarzwald",
    description: "Eine tiefe Meditationserfahrung in der Natur des Schwarzwaldes.",
    content: "Heute habe ich eine wunderbare Meditation im Schwarzwald erlebt...",
    author_id: "user1",
    author_name: "Anna Schmidt",
    author_avatar: "/serene-meditation.png",
    category: "Spiritualität",
    tags: ["meditation", "natur", "schwarzwald"],
    location: "Schwarzwald, Deutschland",
    date: "2024-01-15",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    is_public: true,
    likes_count: 24,
    comments_count: 8,
    shares_count: 3,
    media_urls: ["/serene-meditation.png"],
    emotions: ["peaceful", "grateful"],
    experience_rating: 5,
    weather: "sonnig",
    mood_before: 6,
    mood_after: 9,
    insights: ["Die Natur hilft beim Loslassen", "Stille ist kraftvoll"],
    similar_experiences: [],
    privacy_level: "public",
  },
  {
    id: "2",
    title: "Pasta-Kochkurs in Italien",
    description: "Authentischer Pasta-Kochkurs bei einer italienischen Familie.",
    content: "Ein unvergesslicher Tag in der Küche einer italienischen Nonna...",
    author_id: "user2",
    author_name: "Marco Rossi",
    author_avatar: "/italian-feast.png",
    category: "Kulinarik",
    tags: ["kochen", "italien", "pasta", "kultur"],
    location: "Toskana, Italien",
    date: "2024-01-10",
    created_at: "2024-01-10T14:00:00Z",
    updated_at: "2024-01-10T14:00:00Z",
    is_public: true,
    likes_count: 42,
    comments_count: 15,
    shares_count: 7,
    media_urls: ["/italian-feast.png", "/pasta-making-class.png"],
    emotions: ["joyful", "curious"],
    experience_rating: 5,
    weather: "sonnig",
    mood_before: 7,
    mood_after: 9,
    insights: ["Kochen verbindet Menschen", "Tradition ist wertvoll"],
    similar_experiences: [],
    privacy_level: "public",
  },
]

// Erlebnis-Service mit Hybrid-Modus (Mock + Supabase)
class ExperienceService {
  // Holt Erlebnisse aus der Datenbank oder Mock-Daten
  async getAll(options?: { limit?: number; offset?: number; category?: string; search?: string }) {
    // Wenn Mock-Daten verwendet werden sollen
    if (config.useMockData) {
      let filtered = [...mockExperiences]

      if (options?.category) {
        filtered = filtered.filter((exp) => exp.category === options.category)
      }

      if (options?.search) {
        const search = options.search.toLowerCase()
        filtered = filtered.filter(
          (exp) =>
            exp.title.toLowerCase().includes(search) ||
            exp.description.toLowerCase().includes(search) ||
            exp.tags.some((tag) => tag.toLowerCase().includes(search)),
        )
      }

      const start = options?.offset || 0
      const end = start + (options?.limit || filtered.length)

      return filtered.slice(start, end)
    }

    // Sonst Supabase verwenden
    try {
      const supabase = getSupabaseClient()
      let query = supabase
        .from("experiences")
        .select(
          `
          *,
          users (username, display_name, avatar_url)
        `,
        )
        .order("created_at", { ascending: false })

      if (options?.limit) {
        query = query.limit(options.limit)
      }

      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
      }

      if (options?.category) {
        query = query.eq("category", options.category)
      }

      if (options?.search) {
        query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`)
      }

      const { data, error } = await query

      if (error) throw error

      // Daten in das Frontend-Format konvertieren
      return data.map((item) => this.mapDatabaseToFrontend(item))
    } catch (error) {
      console.error("Fehler beim Abrufen der Erlebnisse:", error)
      throw error
    }
  }

  // Holt ein einzelnes Erlebnis nach ID
  async getById(id: string) {
    // Wenn Mock-Daten verwendet werden sollen
    if (config.useMockData) {
      return mockExperiences.find((exp) => exp.id === id) || null
    }

    // Sonst Supabase verwenden
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("experiences")
        .select(
          `
          *,
          users (username, display_name, avatar_url)
        `,
        )
        .eq("id", id)
        .single()

      if (error) throw error

      return this.mapDatabaseToFrontend(data)
    } catch (error) {
      console.error(`Fehler beim Abrufen des Erlebnisses mit ID ${id}:`, error)
      throw error
    }
  }

  // Erstellt ein neues Erlebnis
  async create(experience: Omit<Experience, "id" | "created_at" | "updated_at">) {
    // Wenn Mock-Daten verwendet werden sollen
    if (config.useMockData) {
      const newExperience: Experience = {
        ...experience,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockExperiences.unshift(newExperience)
      return newExperience
    }

    // Sonst Supabase verwenden
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("experiences")
        .insert(this.mapFrontendToDatabase(experience))
        .select()
        .single()

      if (error) throw error

      return this.mapDatabaseToFrontend(data)
    } catch (error) {
      console.error("Fehler beim Erstellen des Erlebnisses:", error)
      throw error
    }
  }

  // Aktualisiert ein bestehendes Erlebnis
  async update(id: string, updates: Partial<Experience>) {
    // Wenn Mock-Daten verwendet werden sollen
    if (config.useMockData) {
      const index = mockExperiences.findIndex((exp) => exp.id === id)
      if (index === -1) return null

      mockExperiences[index] = {
        ...mockExperiences[index],
        ...updates,
        updated_at: new Date().toISOString(),
      }
      return mockExperiences[index]
    }

    // Sonst Supabase verwenden
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("experiences")
        .update({
          ...this.mapFrontendToDatabase(updates),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error

      return this.mapDatabaseToFrontend(data)
    } catch (error) {
      console.error(`Fehler beim Aktualisieren des Erlebnisses mit ID ${id}:`, error)
      throw error
    }
  }

  // Löscht ein Erlebnis
  async delete(id: string) {
    // Wenn Mock-Daten verwendet werden sollen
    if (config.useMockData) {
      const index = mockExperiences.findIndex((exp) => exp.id === id)
      if (index === -1) return false

      mockExperiences.splice(index, 1)
      return true
    }

    // Sonst Supabase verwenden
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("experiences").delete().eq("id", id)

      if (error) throw error

      return true
    } catch (error) {
      console.error(`Fehler beim Löschen des Erlebnisses mit ID ${id}:`, error)
      throw error
    }
  }

  // Sucht nach Erlebnissen
  async search(query: string, filters?: any) {
    return this.getAll({ search: query, ...filters })
  }

  // Hilfsmethode: Konvertiert Datenbank-Format in Frontend-Format
  private mapDatabaseToFrontend(dbExperience: any): Experience {
    return {
      id: dbExperience.id,
      title: dbExperience.title,
      description: dbExperience.description,
      content: dbExperience.content,
      author_id: dbExperience.author_id,
      author_name: dbExperience.users?.display_name || dbExperience.users?.username || "Unbekannt",
      author_avatar: dbExperience.users?.avatar_url || null,
      category: dbExperience.category,
      tags: dbExperience.tags || [],
      location: dbExperience.location,
      date: dbExperience.date,
      created_at: dbExperience.created_at,
      updated_at: dbExperience.updated_at,
      is_public: dbExperience.is_public,
      likes_count: dbExperience.likes_count || 0,
      comments_count: dbExperience.comments_count || 0,
      shares_count: dbExperience.shares_count || 0,
      media_urls: dbExperience.media_urls || [],
      emotions: dbExperience.emotions || [],
      experience_rating: dbExperience.experience_rating || 0,
      weather: dbExperience.weather || null,
      mood_before: dbExperience.mood_before || 0,
      mood_after: dbExperience.mood_after || 0,
      insights: dbExperience.insights || [],
      similar_experiences: dbExperience.similar_experiences || [],
      privacy_level: dbExperience.privacy_level || "public",
    }
  }

  // Hilfsmethode: Konvertiert Frontend-Format in Datenbank-Format
  private mapFrontendToDatabase(frontendExperience: Partial<Experience>): any {
    const dbExperience: any = {}

    if (frontendExperience.title !== undefined) dbExperience.title = frontendExperience.title
    if (frontendExperience.description !== undefined) dbExperience.description = frontendExperience.description
    if (frontendExperience.content !== undefined) dbExperience.content = frontendExperience.content
    if (frontendExperience.author_id !== undefined) dbExperience.author_id = frontendExperience.author_id
    if (frontendExperience.category !== undefined) dbExperience.category = frontendExperience.category
    if (frontendExperience.tags !== undefined) dbExperience.tags = frontendExperience.tags
    if (frontendExperience.location !== undefined) dbExperience.location = frontendExperience.location
    if (frontendExperience.date !== undefined) dbExperience.date = frontendExperience.date
    if (frontendExperience.is_public !== undefined) dbExperience.is_public = frontendExperience.is_public
    if (frontendExperience.media_urls !== undefined) dbExperience.media_urls = frontendExperience.media_urls
    if (frontendExperience.emotions !== undefined) dbExperience.emotions = frontendExperience.emotions
    if (frontendExperience.experience_rating !== undefined)
      dbExperience.experience_rating = frontendExperience.experience_rating
    if (frontendExperience.weather !== undefined) dbExperience.weather = frontendExperience.weather
    if (frontendExperience.mood_before !== undefined) dbExperience.mood_before = frontendExperience.mood_before
    if (frontendExperience.mood_after !== undefined) dbExperience.mood_after = frontendExperience.mood_after
    if (frontendExperience.insights !== undefined) dbExperience.insights = frontendExperience.insights
    if (frontendExperience.privacy_level !== undefined) dbExperience.privacy_level = frontendExperience.privacy_level

    return dbExperience
  }
}

export const experienceService = new ExperienceService()

// Einzelne Funktionen für externe Verwendung exportieren
export const createExperience = (experience: Omit<Experience, "id" | "created_at" | "updated_at">) =>
  experienceService.create(experience)

export const getExperiences = (options?: { limit?: number; offset?: number; category?: string; search?: string }) =>
  experienceService.getAll(options)

export const getExperienceById = (id: string) => experienceService.getById(id)

export const updateExperience = (id: string, updates: Partial<Experience>) => experienceService.update(id, updates)

export const deleteExperience = (id: string) => experienceService.delete(id)
