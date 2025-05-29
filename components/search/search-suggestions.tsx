"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, Clock, Hash, MapPin, User } from "lucide-react"

interface SearchSuggestion {
  id: string
  text: string
  type: "query" | "tag" | "location" | "user" | "category"
  count?: number
  trending?: boolean
}

const mockSuggestions: SearchSuggestion[] = [
  { id: "1", text: "Sonnenuntergang", type: "query", count: 156, trending: true },
  { id: "2", text: "Berlin", type: "location", count: 89 },
  { id: "3", text: "abenteuer", type: "tag", count: 234 },
  { id: "4", text: "Max Mustermann", type: "user", count: 12 },
  { id: "5", text: "Reisen", type: "category", count: 445 },
  { id: "6", text: "Kochkurs", type: "query", count: 67, trending: true },
  { id: "7", text: "entspannung", type: "tag", count: 123 },
  { id: "8", text: "München", type: "location", count: 78 },
]

const recentSearches = ["Wanderung Alpen", "Kochkurs Italien", "Meditation", "Konzert Hamburg"]

export function SearchSuggestions({
  query,
  onSuggestionClick,
}: {
  query: string
  onSuggestionClick: (suggestion: string) => void
}) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showRecent, setShowRecent] = useState(false)

  useEffect(() => {
    if (query.length === 0) {
      setShowRecent(true)
      setSuggestions([])
      return
    }

    setShowRecent(false)

    // Filtere Vorschläge basierend auf der Eingabe
    const filtered = mockSuggestions
      .filter((suggestion) => suggestion.text.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 8)

    setSuggestions(filtered)
  }, [query])

  const getSuggestionIcon = (type: SearchSuggestion["type"]) => {
    switch (type) {
      case "query":
        return <Search className="h-4 w-4" />
      case "tag":
        return <Hash className="h-4 w-4" />
      case "location":
        return <MapPin className="h-4 w-4" />
      case "user":
        return <User className="h-4 w-4" />
      case "category":
        return <Search className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  const getSuggestionTypeLabel = (type: SearchSuggestion["type"]) => {
    switch (type) {
      case "query":
        return "Suche"
      case "tag":
        return "Tag"
      case "location":
        return "Ort"
      case "user":
        return "Benutzer"
      case "category":
        return "Kategorie"
      default:
        return ""
    }
  }

  if (showRecent && recentSearches.length > 0) {
    return (
      <Card className="absolute top-full left-0 right-0 z-50 mt-1">
        <CardContent className="p-2">
          <div className="text-sm font-medium text-muted-foreground mb-2 px-2">Letzte Suchen</div>
          {recentSearches.map((search, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
              onClick={() => onSuggestionClick(search)}
            >
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1">{search}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (suggestions.length === 0) {
    return null
  }

  return (
    <Card className="absolute top-full left-0 right-0 z-50 mt-1">
      <CardContent className="p-2">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
            onClick={() => onSuggestionClick(suggestion.text)}
          >
            {getSuggestionIcon(suggestion.type)}
            <span className="flex-1">{suggestion.text}</span>
            <div className="flex items-center gap-2">
              {suggestion.trending && (
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
              {suggestion.count && <span className="text-xs text-muted-foreground">{suggestion.count}</span>}
              <Badge variant="outline" className="text-xs">
                {getSuggestionTypeLabel(suggestion.type)}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
