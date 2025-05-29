import { getSupabaseClient } from "./supabase-client"
import { config } from "./config"
import { aiService } from "./ai-service"

export interface SearchFilters {
  category?: string
  tags?: string[]
  location?: string
  dateRange?: {
    start: string
    end: string
  }
  author?: string
  emotions?: string[]
  rating?: {
    min: number
    max: number
  }
  sortBy?: "relevance" | "date" | "rating" | "popularity"
  sortOrder?: "asc" | "desc"
}

export interface SearchResult {
  id: string
  title: string
  description: string
  author_name: string
  category: string
  tags: string[]
  relevance: number
  snippet: string
  created_at: string
}

class SearchService {
  private searchHistory: string[] = []
  private readonly HISTORY_KEY = "xp_share_search_history"

  // Hauptsuchfunktion
  async search(query: string, filters?: SearchFilters, useAI = false): Promise<SearchResult[]> {
    // Füge zur Suchhistorie hinzu
    this.addToHistory(query)

    if (useAI) {
      return this.semanticSearch(query, filters)
    } else {
      return this.textSearch(query, filters)
    }
  }

  // Textbasierte Suche
  private async textSearch(query: string, filters?: SearchFilters): Promise<SearchResult[]> {
    if (config.useMockData) {
      return this.mockTextSearch(query, filters)
    }

    try {
      const supabase = getSupabaseClient()
      let queryBuilder = supabase
        .from("experiences")
        .select(
          `
          id,
          title,
          description,
          category,
          tags,
          created_at,
          users(username, display_name)
        `,
        )
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%`)

      // Filter anwenden
      if (filters?.category) {
        queryBuilder = queryBuilder.eq("category", filters.category)
      }

      if (filters?.tags && filters.tags.length > 0) {
        queryBuilder = queryBuilder.contains("tags", filters.tags)
      }

      if (filters?.location) {
        queryBuilder = queryBuilder.ilike("location", `%${filters.location}%`)
      }

      if (filters?.dateRange) {
        queryBuilder = queryBuilder.gte("date", filters.dateRange.start).lte("date", filters.dateRange.end)
      }

      if (filters?.author) {
        queryBuilder = queryBuilder.eq("author_id", filters.author)
      }

      // Sortierung
      const sortBy = filters?.sortBy || "relevance"
      const sortOrder = filters?.sortOrder || "desc"

      if (sortBy === "date") {
        queryBuilder = queryBuilder.order("created_at", { ascending: sortOrder === "asc" })
      } else if (sortBy === "rating") {
        queryBuilder = queryBuilder.order("rating_average", { ascending: sortOrder === "asc" })
      }

      const { data, error } = await queryBuilder.limit(50)

      if (error) throw error

      return this.formatSearchResults(data || [], query)
    } catch (error) {
      console.error("Fehler bei der Textsuche:", error)
      throw error
    }
  }

  // Semantische Suche mit KI
  private async semanticSearch(query: string, filters?: SearchFilters): Promise<SearchResult[]> {
    try {
      const results = await aiService.semanticSearch(query, filters)
      return results.map((result) => ({
        id: result.id,
        title: result.title,
        description: result.snippet,
        author_name: result.author_name || "Unbekannt",
        category: result.category || "Allgemein",
        tags: result.tags || [],
        relevance: result.relevance,
        snippet: result.snippet,
        created_at: result.created_at,
      }))
    } catch (error) {
      console.error("Fehler bei der semantischen Suche:", error)
      // Fallback auf Textsuche
      return this.textSearch(query, filters)
    }
  }

  // Mock-Textsuche für Entwicklung
  private mockTextSearch(query: string, filters?: SearchFilters): SearchResult[] {
    const mockResults: SearchResult[] = [
      {
        id: "1",
        title: "Meditation im Schwarzwald",
        description: "Eine tiefe Meditationserfahrung in der Natur des Schwarzwaldes.",
        author_name: "Anna Schmidt",
        category: "Spiritualität",
        tags: ["meditation", "natur", "schwarzwald"],
        relevance: 0.95,
        snippet: "Heute habe ich eine wunderbare Meditation im Schwarzwald erlebt...",
        created_at: "2024-01-15T10:00:00Z",
      },
      {
        id: "2",
        title: "Pasta-Kochkurs in Italien",
        description: "Authentischer Pasta-Kochkurs bei einer italienischen Familie.",
        author_name: "Marco Rossi",
        category: "Kulinarik",
        tags: ["kochen", "italien", "pasta"],
        relevance: 0.78,
        snippet: "Ein unvergesslicher Tag in der Küche einer italienischen Nonna...",
        created_at: "2024-01-10T14:00:00Z",
      },
    ]

    // Filtere basierend auf der Suchanfrage
    const filtered = mockResults.filter(
      (result) =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase()) ||
        result.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
    )

    // Wende Filter an
    if (filters?.category) {
      return filtered.filter((result) => result.category === filters.category)
    }

    if (filters?.tags && filters.tags.length > 0) {
      return filtered.filter((result) => filters.tags!.some((tag) => result.tags.includes(tag)))
    }

    return filtered
  }

  // Formatiert Suchergebnisse
  private formatSearchResults(data: any[], query: string): SearchResult[] {
    return data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      author_name: item.users?.display_name || item.users?.username || "Unbekannt",
      category: item.category,
      tags: item.tags || [],
      relevance: this.calculateRelevance(item, query),
      snippet: this.generateSnippet(item.description || item.content, query),
      created_at: item.created_at,
    }))
  }

  // Berechnet Relevanz-Score
  private calculateRelevance(item: any, query: string): number {
    const queryLower = query.toLowerCase()
    let score = 0

    // Titel-Match (höchste Gewichtung)
    if (item.title.toLowerCase().includes(queryLower)) {
      score += 0.5
    }

    // Beschreibungs-Match
    if (item.description?.toLowerCase().includes(queryLower)) {
      score += 0.3
    }

    // Tag-Match
    if (item.tags?.some((tag: string) => tag.toLowerCase().includes(queryLower))) {
      score += 0.2
    }

    return Math.min(score, 1.0)
  }

  // Generiert Snippet mit Hervorhebung
  private generateSnippet(text: string, query: string, maxLength = 150): string {
    if (!text) return ""

    const queryLower = query.toLowerCase()
    const textLower = text.toLowerCase()
    const queryIndex = textLower.indexOf(queryLower)

    if (queryIndex === -1) {
      return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
    }

    // Erstelle Snippet um den gefundenen Begriff
    const start = Math.max(0, queryIndex - 50)
    const end = Math.min(text.length, queryIndex + query.length + 50)
    let snippet = text.substring(start, end)

    if (start > 0) snippet = "..." + snippet
    if (end < text.length) snippet = snippet + "..."

    return snippet
  }

  // Suchvorschläge basierend auf Historie und Popularität
  async getSuggestions(partialQuery: string): Promise<string[]> {
    const suggestions: string[] = []

    // Aus Suchhistorie
    const historySuggestions = this.getSearchHistory()
      .filter((term) => term.toLowerCase().includes(partialQuery.toLowerCase()))
      .slice(0, 3)

    suggestions.push(...historySuggestions)

    // Beliebte Suchbegriffe (Mock)
    const popularTerms = ["meditation", "kochen", "reisen", "natur", "sport", "kunst", "musik"]
    const popularSuggestions = popularTerms
      .filter((term) => term.toLowerCase().includes(partialQuery.toLowerCase()))
      .slice(0, 3)

    suggestions.push(...popularSuggestions)

    // Entferne Duplikate und limitiere
    return [...new Set(suggestions)].slice(0, 5)
  }

  // Erweiterte Filter-Optionen
  getFilterOptions() {
    return {
      categories: ["Spiritualität", "Kulinarik", "Reisen", "Sport", "Kunst", "Natur", "Technologie"],
      emotions: ["peaceful", "joyful", "excited", "grateful", "inspired", "relaxed", "energetic"],
      sortOptions: [
        { value: "relevance", label: "Relevanz" },
        { value: "date", label: "Datum" },
        { value: "rating", label: "Bewertung" },
        { value: "popularity", label: "Beliebtheit" },
      ],
    }
  }

  // Suchhistorie verwalten
  private addToHistory(query: string) {
    if (!query.trim()) return

    this.searchHistory = this.searchHistory.filter((term) => term !== query)
    this.searchHistory.unshift(query)
    this.searchHistory = this.searchHistory.slice(0, 10) // Limitiere auf 10 Einträge

    // Speichere in localStorage
    try {
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(this.searchHistory))
    } catch (error) {
      console.error("Fehler beim Speichern der Suchhistorie:", error)
    }
  }

  // Holt Suchhistorie
  getSearchHistory(): string[] {
    if (this.searchHistory.length === 0) {
      try {
        const stored = localStorage.getItem(this.HISTORY_KEY)
        this.searchHistory = stored ? JSON.parse(stored) : []
      } catch (error) {
        console.error("Fehler beim Laden der Suchhistorie:", error)
        this.searchHistory = []
      }
    }
    return this.searchHistory
  }

  // Löscht Suchhistorie
  clearHistory() {
    this.searchHistory = []
    localStorage.removeItem(this.HISTORY_KEY)
  }

  // Entfernt einen Eintrag aus der Historie
  removeFromHistory(query: string) {
    this.searchHistory = this.searchHistory.filter((term) => term !== query)
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(this.searchHistory))
  }

  // Sucht nach ähnlichen Erlebnissen
  async findSimilar(experienceId: string): Promise<SearchResult[]> {
    if (config.useMockData) {
      // Mock ähnliche Erlebnisse
      return [
        {
          id: "similar-1",
          title: "Waldspaziergang bei Sonnenaufgang",
          description: "Ein ruhiger Spaziergang durch den Wald bei Sonnenaufgang",
          author_name: "Lisa Müller",
          category: "Natur",
          tags: ["wald", "sonnenaufgang", "ruhe"],
          relevance: 0.85,
          snippet: "Die Stille des Waldes am frühen Morgen...",
          created_at: "2024-01-12T06:00:00Z",
        },
      ]
    }

    try {
      const supabase = getSupabaseClient()
      const { data: experience } = await supabase
        .from("experiences")
        .select("title, description, tags, category")
        .eq("id", experienceId)
        .single()

      if (!experience) return []

      // Suche nach ähnlichen Erlebnissen basierend auf Tags und Kategorie
      const { data, error } = await supabase
        .from("experiences")
        .select(
          `
          id,
          title,
          description,
          category,
          tags,
          created_at,
          users(username, display_name)
        `,
        )
        .neq("id", experienceId)
        .or(`category.eq.${experience.category},tags.cs.{${experience.tags?.join(",") || ""}}`)
        .limit(10)

      if (error) throw error

      return this.formatSearchResults(data || [], experience.title)
    } catch (error) {
      console.error("Fehler beim Finden ähnlicher Erlebnisse:", error)
      return []
    }
  }

  // Trending-Suchen
  async getTrendingSearches(): Promise<string[]> {
    // Mock trending searches
    return ["meditation", "kochen", "reisen", "natur", "fotografie", "sport", "musik", "kunst"]
  }

  // Suchstatistiken
  getSearchStats() {
    const history = this.getSearchHistory()
    const termCounts: Record<string, number> = {}

    history.forEach((term) => {
      termCounts[term] = (termCounts[term] || 0) + 1
    })

    const mostSearched = Object.entries(termCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([term, count]) => ({ term, count }))

    return {
      totalSearches: history.length,
      uniqueTerms: Object.keys(termCounts).length,
      mostSearched,
    }
  }
}

export const searchService = new SearchService()
