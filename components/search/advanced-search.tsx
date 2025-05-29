"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Filter, MapPin, CalendarIcon, User, Star, Clock, X } from "lucide-react"
import { format } from "date-fns"
import { de } from "date-fns/locale"

interface SearchFilters {
  query: string
  categories: string[]
  tags: string[]
  locations: string[]
  authors: string[]
  dateRange: {
    from?: Date
    to?: Date
  }
  rating: [number, number]
  sortBy: "relevance" | "date" | "rating" | "popularity"
  sortOrder: "asc" | "desc"
}

interface SearchResult {
  id: string
  title: string
  description: string
  author: string
  category: string
  tags: string[]
  location: string
  date: Date
  rating: number
  likes: number
  comments: number
  thumbnail?: string
}

const mockCategories = [
  "Reisen",
  "Kulinarik",
  "Sport",
  "Kultur",
  "Natur",
  "Technologie",
  "Musik",
  "Kunst",
  "Bildung",
  "Familie",
  "Freunde",
  "Arbeit",
]

const mockTags = [
  "abenteuer",
  "entspannung",
  "lernen",
  "spaß",
  "herausforderung",
  "kreativität",
  "gemeinschaft",
  "solo",
  "outdoor",
  "indoor",
]

const mockLocations = [
  "Berlin",
  "München",
  "Hamburg",
  "Köln",
  "Frankfurt",
  "Stuttgart",
  "Düsseldorf",
  "Dortmund",
  "Essen",
  "Leipzig",
  "Bremen",
  "Dresden",
]

const mockResults: SearchResult[] = [
  {
    id: "1",
    title: "Sonnenuntergang am Brandenburger Tor",
    description: "Ein magischer Moment in der Hauptstadt",
    author: "Max Mustermann",
    category: "Reisen",
    tags: ["entspannung", "outdoor", "solo"],
    location: "Berlin",
    date: new Date(2024, 0, 15),
    rating: 4.8,
    likes: 42,
    comments: 8,
  },
  {
    id: "2",
    title: "Kochkurs in der Toskana",
    description: "Authentische italienische Küche lernen",
    author: "Anna Schmidt",
    category: "Kulinarik",
    tags: ["lernen", "kreativität", "gemeinschaft"],
    location: "Italien",
    date: new Date(2024, 1, 20),
    rating: 4.9,
    likes: 67,
    comments: 15,
  },
]

export function AdvancedSearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    categories: [],
    tags: [],
    locations: [],
    authors: [],
    dateRange: {},
    rating: [0, 5],
    sortBy: "relevance",
    sortOrder: "desc",
  })

  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Simuliere Suche
  const performSearch = async () => {
    setIsSearching(true)

    // Simuliere API-Aufruf
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Filtere Mock-Daten basierend auf Filtern
    const filteredResults = mockResults.filter((result) => {
      // Text-Suche
      if (
        filters.query &&
        !result.title.toLowerCase().includes(filters.query.toLowerCase()) &&
        !result.description.toLowerCase().includes(filters.query.toLowerCase())
      ) {
        return false
      }

      // Kategorie-Filter
      if (filters.categories.length > 0 && !filters.categories.includes(result.category)) {
        return false
      }

      // Tag-Filter
      if (filters.tags.length > 0 && !filters.tags.some((tag) => result.tags.includes(tag))) {
        return false
      }

      // Standort-Filter
      if (filters.locations.length > 0 && !filters.locations.includes(result.location)) {
        return false
      }

      // Bewertungs-Filter
      if (result.rating < filters.rating[0] || result.rating > filters.rating[1]) {
        return false
      }

      // Datum-Filter
      if (filters.dateRange.from && result.date < filters.dateRange.from) {
        return false
      }
      if (filters.dateRange.to && result.date > filters.dateRange.to) {
        return false
      }

      return true
    })

    // Sortierung
    filteredResults.sort((a, b) => {
      let comparison = 0

      switch (filters.sortBy) {
        case "date":
          comparison = a.date.getTime() - b.date.getTime()
          break
        case "rating":
          comparison = a.rating - b.rating
          break
        case "popularity":
          comparison = a.likes + a.comments - (b.likes + b.comments)
          break
        default: // relevance
          comparison = 0
      }

      return filters.sortOrder === "desc" ? -comparison : comparison
    })

    setResults(filteredResults)
    setIsSearching(false)
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (
        filters.query ||
        Object.values(filters).some((v) => (Array.isArray(v) ? v.length > 0 : v !== "" && v !== undefined))
      ) {
        performSearch()
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [filters])

  const clearFilters = () => {
    setFilters({
      query: "",
      categories: [],
      tags: [],
      locations: [],
      authors: [],
      dateRange: {},
      rating: [0, 5],
      sortBy: "relevance",
      sortOrder: "desc",
    })
  }

  const removeFilter = (type: keyof SearchFilters, value: string) => {
    if (Array.isArray(filters[type])) {
      setFilters((prev) => ({
        ...prev,
        [type]: (prev[type] as string[]).filter((item) => item !== value),
      }))
    }
  }

  const activeFiltersCount = useMemo(() => {
    return (
      filters.categories.length +
      filters.tags.length +
      filters.locations.length +
      (filters.dateRange.from || filters.dateRange.to ? 1 : 0) +
      (filters.rating[0] > 0 || filters.rating[1] < 5 ? 1 : 0)
    )
  }, [filters])

  return (
    <div className="space-y-6">
      {/* Suchleiste */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Suche nach Erlebnissen, Orten, Personen..."
                value={filters.query}
                onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            {activeFiltersCount > 0 && (
              <Button variant="outline" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Zurücksetzen
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Aktive Filter */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.categories.map((category) => (
            <Badge key={category} variant="secondary" className="flex items-center gap-1">
              {category}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("categories", category)} />
            </Badge>
          ))}
          {filters.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              #{tag}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("tags", tag)} />
            </Badge>
          ))}
          {filters.locations.map((location) => (
            <Badge key={location} variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {location}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("locations", location)} />
            </Badge>
          ))}
        </div>
      )}

      {/* Erweiterte Filter */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Erweiterte Filter
            </CardTitle>
            <CardDescription>Verfeinere deine Suche mit detaillierten Filtern</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content">Inhalt</TabsTrigger>
                <TabsTrigger value="location">Ort & Zeit</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="sort">Sortierung</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                {/* Kategorien */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Kategorien</label>
                  <div className="grid grid-cols-3 gap-2">
                    {mockCategories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={filters.categories.includes(category)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters((prev) => ({
                                ...prev,
                                categories: [...prev.categories, category],
                              }))
                            } else {
                              setFilters((prev) => ({
                                ...prev,
                                categories: prev.categories.filter((c) => c !== category),
                              }))
                            }
                          }}
                        />
                        <label htmlFor={`category-${category}`} className="text-sm">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Tags</label>
                  <div className="grid grid-cols-3 gap-2">
                    {mockTags.map((tag) => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag}`}
                          checked={filters.tags.includes(tag)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters((prev) => ({
                                ...prev,
                                tags: [...prev.tags, tag],
                              }))
                            } else {
                              setFilters((prev) => ({
                                ...prev,
                                tags: prev.tags.filter((t) => t !== tag),
                              }))
                            }
                          }}
                        />
                        <label htmlFor={`tag-${tag}`} className="text-sm">
                          #{tag}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="location" className="space-y-4">
                {/* Standorte */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Standorte</label>
                  <div className="grid grid-cols-3 gap-2">
                    {mockLocations.map((location) => (
                      <div key={location} className="flex items-center space-x-2">
                        <Checkbox
                          id={`location-${location}`}
                          checked={filters.locations.includes(location)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters((prev) => ({
                                ...prev,
                                locations: [...prev.locations, location],
                              }))
                            } else {
                              setFilters((prev) => ({
                                ...prev,
                                locations: prev.locations.filter((l) => l !== location),
                              }))
                            }
                          }}
                        />
                        <label htmlFor={`location-${location}`} className="text-sm">
                          {location}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Datumsbereich */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Zeitraum</label>
                  <div className="flex gap-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dateRange.from ? format(filters.dateRange.from, "PPP", { locale: de }) : "Von Datum"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.dateRange.from}
                          onSelect={(date) =>
                            setFilters((prev) => ({
                              ...prev,
                              dateRange: { ...prev.dateRange, from: date },
                            }))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dateRange.to ? format(filters.dateRange.to, "PPP", { locale: de }) : "Bis Datum"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.dateRange.to}
                          onSelect={(date) =>
                            setFilters((prev) => ({
                              ...prev,
                              dateRange: { ...prev.dateRange, to: date },
                            }))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="social" className="space-y-4">
                {/* Bewertung */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Bewertung: {filters.rating[0]} - {filters.rating[1]} Sterne
                  </label>
                  <Slider
                    value={filters.rating}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, rating: value as [number, number] }))}
                    max={5}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </TabsContent>

              <TabsContent value="sort" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Sortieren nach</label>
                    <Select
                      value={filters.sortBy}
                      onValueChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          sortBy: value as SearchFilters["sortBy"],
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevanz</SelectItem>
                        <SelectItem value="date">Datum</SelectItem>
                        <SelectItem value="rating">Bewertung</SelectItem>
                        <SelectItem value="popularity">Beliebtheit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Reihenfolge</label>
                    <Select
                      value={filters.sortOrder}
                      onValueChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          sortOrder: value as SearchFilters["sortOrder"],
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">Absteigend</SelectItem>
                        <SelectItem value="asc">Aufsteigend</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Suchergebnisse */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Suchergebnisse</span>
            <Badge variant="secondary">
              {results.length} {results.length === 1 ? "Ergebnis" : "Ergebnisse"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isSearching ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Suche läuft...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Keine Ergebnisse gefunden</h3>
              <p className="text-muted-foreground">Versuche andere Suchbegriffe oder passe deine Filter an.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <Card key={result.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📝</span>
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{result.title}</h3>
                            <p className="text-muted-foreground">{result.description}</p>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {result.rating}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {result.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {result.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {format(result.date, "dd.MM.yyyy", { locale: de })}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline">{result.category}</Badge>
                            {result.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                            {result.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{result.tags.length - 3}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{result.likes} Likes</span>
                            <span>{result.comments} Kommentare</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
