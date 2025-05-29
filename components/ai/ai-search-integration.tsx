"use client"

import { useState, useCallback, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Sparkles, Loader2, X } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"

interface SearchResult {
  id: string
  title: string
  content: string
  similarity: number
  type: "erlebnis" | "xp_eintrag" | "kommentar"
  highlights: string[]
}

interface AISearchIntegrationProps {
  onResultClick?: (result: SearchResult) => void
  className?: string
  placeholder?: string
}

export function AISearchIntegration({
  onResultClick,
  className,
  placeholder = "Suche mit KI...",
}: AISearchIntegrationProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [filters, setFilters] = useState({
    type: "all",
    minSimilarity: 0.5,
  })

  const debouncedQuery = useDebounce(query, 300)

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        return
      }

      setIsSearching(true)
      try {
        const response = await fetch("/api/ai/embeddings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: searchQuery,
            action: "search",
          }),
        })

        if (!response.ok) throw new Error("Suche fehlgeschlagen")

        const data = await response.json()

        // Filtere Ergebnisse
        const filteredResults = data.results
          .filter((r: any) => r.similarity >= filters.minSimilarity)
          .filter((r: any) => filters.type === "all" || r.type === filters.type)

        setResults(filteredResults)
        setShowResults(true)
      } catch (error) {
        console.error("Suchfehler:", error)
        setResults([])
      } finally {
        setIsSearching(false)
      }
    },
    [filters],
  )

  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery)
    } else {
      setResults([])
      setShowResults(false)
    }
  }, [debouncedQuery, performSearch])

  const handleResultClick = (result: SearchResult) => {
    onResultClick?.(result)
    setShowResults(false)
    setQuery("")
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "erlebnis":
        return "bg-blue-500"
      case "xp_eintrag":
        return "bg-purple-500"
      case "kommentar":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "erlebnis":
        return "Erlebnis"
      case "xp_eintrag":
        return "XP-Eintrag"
      case "kommentar":
        return "Kommentar"
      default:
        return type
    }
  }

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10"
          onFocus={() => query && setShowResults(true)}
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin" />
        )}
        {!isSearching && query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
            onClick={() => {
              setQuery("")
              setResults([])
              setShowResults(false)
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showResults && results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-auto">
          <CardContent className="p-2">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                {results.length} Ergebnisse (KI-powered)
              </span>
              <Button variant="ghost" size="sm" onClick={() => setShowResults(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-1">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-sm line-clamp-1">{result.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {Math.round(result.similarity * 100)}%
                      </Badge>
                      <div className={cn("h-2 w-2 rounded-full", getTypeColor(result.type))} />
                    </div>
                  </div>

                  {result.highlights.length > 0 && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{result.highlights[0]}</p>
                  )}

                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {getTypeLabel(result.type)}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
