"use client"

import { useState, useCallback, useEffect } from "react"
import { createClient } from "@/lib/supabase-client"
import { useDebounce } from "@/hooks/use-debounce"
import type { Erlebnis } from "@/types/erlebnis"

interface SearchFilters {
  kategorie?: string
  tags?: string[]
  ort?: string
  zeitraum?: {
    von: Date
    bis: Date
  }
}

export function useSearch(initialQuery = "", initialFilters: SearchFilters = {}) {
  const [query, setQuery] = useState(initialQuery)
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)
  const [results, setResults] = useState<Erlebnis[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const debouncedQuery = useDebounce(query, 300)
  const supabase = createClient()

  const search = useCallback(async () => {
    if (!debouncedQuery && Object.keys(filters).length === 0) {
      setResults([])
      return
    }

    try {
      setLoading(true)
      setError(null)

      let searchQuery = supabase.from("experiences").select(`
          *,
          author:profiles!author_id(*),
          media:experience_media(*),
          comments:experience_comments(count),
          likes:experience_likes(count)
        `)

      // Textsuche
      if (debouncedQuery) {
        searchQuery = searchQuery.or(`title.ilike.%${debouncedQuery}%,description.ilike.%${debouncedQuery}%`)
      }

      // Kategoriefilter
      if (filters.kategorie) {
        searchQuery = searchQuery.eq("category", filters.kategorie)
      }

      // Tags-Filter
      if (filters.tags && filters.tags.length > 0) {
        searchQuery = searchQuery.contains("tags", filters.tags)
      }

      // Ortsfilter
      if (filters.ort) {
        searchQuery = searchQuery.ilike("location", `%${filters.ort}%`)
      }

      // Zeitraumfilter
      if (filters.zeitraum) {
        searchQuery = searchQuery
          .gte("created_at", filters.zeitraum.von.toISOString())
          .lte("created_at", filters.zeitraum.bis.toISOString())
      }

      const { data, error } = await searchQuery.order("created_at", { ascending: false }).limit(50)

      if (error) throw error

      setResults((data as any) || [])
    } catch (err) {
      setError(err as Error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [debouncedQuery, filters, supabase])

  useEffect(() => {
    search()
  }, [search])

  return {
    query,
    setQuery,
    filters,
    setFilters,
    results,
    loading,
    error,
    search,
  }
}
