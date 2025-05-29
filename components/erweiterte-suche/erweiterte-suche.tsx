"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Search, Save, Clock, X, Filter, Star, StarOff } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

// Typdefinitionen
interface SavedSearch {
  id: string
  user_id: string
  name: string
  query: string
  filters: Record<string, any>
  created_at: string
}

interface SearchHistoryItem {
  id: string
  user_id: string
  query: string
  filters: Record<string, any>
  created_at: string
}

// Mock-Daten für die Anzeige
const mockSavedSearches: SavedSearch[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440100",
    user_id: "550e8400-e29b-41d4-a716-446655440020",
    name: "Flugträume mit positiver Stimmung",
    query: "fliegen schweben",
    filters: {
      categories: ["Flugtraum", "Klartraum"],
      sentiment: "positiv",
      date_range: { from: "2023-01-01", to: "2023-12-31" },
    },
    created_at: "2023-04-10T15:30:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440101",
    user_id: "550e8400-e29b-41d4-a716-446655440020",
    name: "Wasserbezogene Erlebnisse",
    query: "wasser meer ozean",
    filters: {
      tags: ["wasser", "schwimmen", "tauchen"],
      date_range: { from: "2022-01-01", to: "2023-12-31" },
    },
    created_at: "2023-03-22T09:45:00Z",
  },
]

const mockSearchHistory: SearchHistoryItem[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440200",
    user_id: "550e8400-e29b-41d4-a716-446655440020",
    query: "fliegen über berge",
    filters: {
      categories: ["Flugtraum"],
    },
    created_at: "2023-05-18T10:15:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440201",
    user_id: "550e8400-e29b-41d4-a716-446655440020",
    query: "begegnung mit tieren",
    filters: {
      tags: ["tiere", "kommunikation"],
    },
    created_at: "2023-05-17T14:30:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440202",
    user_id: "550e8400-e29b-41d4-a716-446655440020",
    query: "unterwasser",
    filters: {},
    created_at: "2023-05-16T09:20:00Z",
  },
]

// Kategorien und Tags für Filter
const availableCategories = [
  "Klartraum",
  "Flugtraum",
  "Tiertraum",
  "Nahtoderfahrung",
  "Außerkörperliche Erfahrung",
  "UFO-Sichtung",
  "Déjà-vu",
]

const availableTags = [
  "fliegen",
  "schweben",
  "wasser",
  "licht",
  "dunkelheit",
  "angst",
  "freude",
  "tiere",
  "kommunikation",
  "transformation",
  "zeit",
]

export function ErweiterteSuche({ userId }: { userId: string }) {
  // Suchzustand
  const [query, setQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Record<string, any>>({
    categories: [],
    tags: [],
    sentiment: "alle",
    date_range: { from: "", to: "" },
    rating: [0, 5],
  })

  // Gespeicherte Suchen und Suchverlauf
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([])
  const [savedSearchName, setSavedSearchName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSavedSearchesAndHistory = async () => {
      try {
        setLoading(true)
        // In einer echten Implementierung würden wir hier Supabase verwenden
        // const supabase = getSupabaseClient()
        // const { data: savedData } = await supabase
        //   .from('saved_searches')
        //   .select('*')
        //   .eq('user_id', userId)
        //   .order('created_at', { ascending: false })

        // const { data: historyData } = await supabase
        //   .from('search_history')
        //   .select('*')
        //   .eq('user_id', userId)
        //   .order('created_at', { ascending: false })
        //   .limit(10)

        // Für Demo-Zwecke verwenden wir Mock-Daten
        setTimeout(() => {
          setSavedSearches(mockSavedSearches)
          setSearchHistory(mockSearchHistory)
          setLoading(false)
        }, 800)
      } catch (err) {
        console.error("Fehler beim Laden der Suchdaten:", err)
        setLoading(false)
      }
    }

    fetchSavedSearchesAndHistory()
  }, [userId])

  const handleSearch = () => {
    console.log("Suche ausgeführt:", { query, filters })
    // Hier würde die Suche ausgeführt und der Suchverlauf aktualisiert werden

    // Suchverlauf aktualisieren (Mock)
    const newHistoryItem: SearchHistoryItem = {
      id: `history-${Date.now()}`,
      user_id: userId,
      query,
      filters: { ...filters },
      created_at: new Date().toISOString(),
    }

    setSearchHistory([newHistoryItem, ...searchHistory.slice(0, 9)])
  }

  const handleSaveSearch = () => {
    if (!savedSearchName.trim()) return

    // Neue gespeicherte Suche erstellen (Mock)
    const newSavedSearch: SavedSearch = {
      id: `saved-${Date.now()}`,
      user_id: userId,
      name: savedSearchName,
      query,
      filters: { ...filters },
      created_at: new Date().toISOString(),
    }

    setSavedSearches([newSavedSearch, ...savedSearches])
    setSavedSearchName("")
  }

  const handleLoadSavedSearch = (savedSearch: SavedSearch) => {
    setQuery(savedSearch.query)
    setFilters(savedSearch.filters)
    if (!showFilters && Object.keys(savedSearch.filters).length > 0) {
      setShowFilters(true)
    }
  }

  const handleDeleteSavedSearch = (id: string) => {
    setSavedSearches(savedSearches.filter((search) => search.id !== id))
  }

  const handleClearHistory = () => {
    setSearchHistory([])
  }

  const handleDeleteHistoryItem = (id: string) => {
    setSearchHistory(searchHistory.filter((item) => item.id !== id))
  }

  const handleToggleCategory = (category: string) => {
    setFilters((prev) => {
      const categories = prev.categories || []
      return {
        ...prev,
        categories: categories.includes(category)
          ? categories.filter((c) => c !== category)
          : [...categories, category],
      }
    })
  }

  const handleToggleTag = (tag: string) => {
    setFilters((prev) => {
      const tags = prev.tags || []
      return {
        ...prev,
        tags: tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag],
      }
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Erweiterte Suche
          </CardTitle>
          <CardDescription>Durchsuche alle Erlebnisse mit präzisen Filtern</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Suche nach Schlüsselwörtern, Titeln oder Inhalten..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Suchen
              </Button>
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {showFilters && (
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-medium">Filter</h3>

                <div>
                  <h4 className="text-sm font-medium mb-2">Kategorien</h4>
                  <div className="flex flex-wrap gap-2">
                    {availableCategories.map((category) => (
                      <Badge
                        key={category}
                        variant={filters.categories?.includes(category) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleToggleCategory(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={filters.tags?.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleToggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Stimmung</h4>
                  <Select
                    value={filters.sentiment}
                    onValueChange={(value) => setFilters({ ...filters, sentiment: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wähle eine Stimmung" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alle">Alle Stimmungen</SelectItem>
                      <SelectItem value="positiv">Positiv</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="negativ">Negativ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Zeitraum</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date-from">Von</Label>
                      <Input
                        id="date-from"
                        type="date"
                        value={filters.date_range?.from || ""}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            date_range: { ...filters.date_range, from: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="date-to">Bis</Label>
                      <Input
                        id="date-to"
                        type="date"
                        value={filters.date_range?.to || ""}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            date_range: { ...filters.date_range, to: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <h4 className="text-sm font-medium">Bewertung</h4>
                    <span className="text-sm text-muted-foreground">
                      {filters.rating[0]} - {filters.rating[1]} Sterne
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <StarOff className="h-4 w-4 text-muted-foreground" />
                    <Slider
                      value={filters.rating}
                      min={0}
                      max={5}
                      step={1}
                      onValueChange={(value) => setFilters({ ...filters, rating: value })}
                      className="flex-1"
                    />
                    <Star className="h-4 w-4 text-amber-500" />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFilters({
                        categories: [],
                        tags: [],
                        sentiment: "alle",
                        date_range: { from: "", to: "" },
                        rating: [0, 5],
                      })
                    }
                  >
                    Zurücksetzen
                  </Button>
                  <Button size="sm" onClick={handleSearch}>
                    Filter anwenden
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Input
                placeholder="Name für gespeicherte Suche"
                value={savedSearchName}
                onChange={(e) => setSavedSearchName(e.target.value)}
              />
              <Button variant="outline" onClick={handleSaveSearch} disabled={!query.trim() || !savedSearchName.trim()}>
                <Save className="h-4 w-4 mr-2" />
                Speichern
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="saved">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="saved">Gespeicherte Suchen</TabsTrigger>
          <TabsTrigger value="history">Suchverlauf</TabsTrigger>
        </TabsList>

        <TabsContent value="saved" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Deine gespeicherten Suchen</CardTitle>
              <CardDescription>Schneller Zugriff auf häufig verwendete Suchanfragen</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {savedSearches.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Keine gespeicherten Suchen vorhanden. Speichere eine Suche, um sie hier zu sehen.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedSearches.map((savedSearch) => (
                      <div key={savedSearch.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{savedSearch.name}</h3>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteSavedSearch(savedSearch.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Suche: "{savedSearch.query}"</p>
                        {Object.keys(savedSearch.filters).length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground">Filter:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {savedSearch.filters.categories?.map((category: string) => (
                                <Badge key={category} variant="secondary" className="text-xs">
                                  {category}
                                </Badge>
                              ))}
                              {savedSearch.filters.tags?.map((tag: string) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {savedSearch.filters.sentiment && savedSearch.filters.sentiment !== "alle" && (
                                <Badge variant="secondary" className="text-xs">
                                  {savedSearch.filters.sentiment}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            Gespeichert am {new Date(savedSearch.created_at).toLocaleDateString("de-DE")}
                          </span>
                          <Button size="sm" onClick={() => handleLoadSavedSearch(savedSearch)}>
                            Laden
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Dein Suchverlauf</CardTitle>
                {searchHistory.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleClearHistory}>
                    Verlauf löschen
                  </Button>
                )}
              </div>
              <CardDescription>Deine letzten Suchanfragen</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {searchHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Kein Suchverlauf vorhanden. Starte eine Suche, um deinen Verlauf zu sehen.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {searchHistory.map((historyItem) => (
                      <div
                        key={historyItem.id}
                        className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{historyItem.query}</p>
                            {Object.keys(historyItem.filters).length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {historyItem.filters.categories?.map((category: string) => (
                                  <Badge key={category} variant="secondary" className="text-xs">
                                    {category}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(historyItem.created_at).toLocaleString("de-DE", {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteHistoryItem(historyItem.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setQuery(historyItem.query)
                              setFilters(historyItem.filters)
                              if (Object.keys(historyItem.filters).length > 0) {
                                setShowFilters(true)
                              }
                            }}
                          >
                            Laden
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
