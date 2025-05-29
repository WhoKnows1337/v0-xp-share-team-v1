"use client"

import { useState, useEffect } from "react"
import { Search, Filter, List, MapPin, Calendar, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ErlebnisListe } from "./erlebnis-liste"
import { ErlebnisKarteMitZeitstrahl } from "./erlebnis-karte-mit-zeitstrahl"
import { ErlebnisFilter } from "./erlebnis-filter"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface EntdeckenPageRedesignedProps {
  erlebnisse: any[]
  isLoading?: boolean
}

export function EntdeckenPageRedesigned({ erlebnisse = [], isLoading = false }: EntdeckenPageRedesignedProps) {
  const [suchbegriff, setSuchbegriff] = useState("")
  const [selectedKategorien, setSelectedKategorien] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [zeitraum, setZeitraum] = useState<string>("")
  const [ansicht, setAnsicht] = useState<"liste" | "karte" | "zeitstrahl">("liste")
  const [gefilterte, setGefilterte] = useState<any[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Sichere Verarbeitung der Erlebnisse
  const safeErlebnisse = Array.isArray(erlebnisse) ? erlebnisse : []

  // Filter-Logik
  useEffect(() => {
    try {
      let filtered = [...safeErlebnisse]

      // Suchbegriff-Filter
      if (suchbegriff.trim()) {
        filtered = filtered.filter((erlebnis) => {
          const titel = typeof erlebnis.titel === "string" ? erlebnis.titel : ""
          const beschreibung = typeof erlebnis.beschreibung === "string" ? erlebnis.beschreibung : ""
          const kurzfassung = typeof erlebnis.kurzfassung === "string" ? erlebnis.kurzfassung : ""

          const searchText = `${titel} ${beschreibung} ${kurzfassung}`.toLowerCase()
          return searchText.includes(suchbegriff.toLowerCase())
        })
      }

      // Kategorie-Filter
      if (selectedKategorien.length > 0) {
        filtered = filtered.filter((erlebnis) => {
          const kategorie = typeof erlebnis.kategorie === "string" ? erlebnis.kategorie : erlebnis.kategorie?.name || ""
          return selectedKategorien.includes(kategorie)
        })
      }

      // Tag-Filter
      if (selectedTags.length > 0) {
        filtered = filtered.filter((erlebnis) => {
          const tags = Array.isArray(erlebnis.tags) ? erlebnis.tags : []
          return selectedTags.some((tag) => tags.includes(tag))
        })
      }

      setGefilterte(filtered)
    } catch (error) {
      console.error("Fehler beim Filtern der Erlebnisse:", error)
      setGefilterte(safeErlebnisse)
    }
  }, [safeErlebnisse, suchbegriff, selectedKategorien, selectedTags, zeitraum])

  // Alle verfügbaren Tags sammeln
  const alleTags = Array.from(
    new Set(
      safeErlebnisse
        .flatMap((erlebnis) => (Array.isArray(erlebnis.tags) ? erlebnis.tags : []))
        .filter((tag) => typeof tag === "string" && tag.trim() !== ""),
    ),
  )

  // Alle verfügbaren Kategorien sammeln
  const alleKategorien = Array.from(
    new Set(
      safeErlebnisse
        .map((erlebnis) => {
          if (typeof erlebnis.kategorie === "string") {
            return erlebnis.kategorie
          }
          return erlebnis.kategorie?.name || ""
        })
        .filter((kategorie) => typeof kategorie === "string" && kategorie.trim() !== ""),
    ),
  )

  const handleFilterChange = (filter: any) => {
    try {
      if (filter.kategorien) setSelectedKategorien(filter.kategorien)
      if (filter.tags) setSelectedTags(filter.tags)
      if (filter.zeitraum) setZeitraum(filter.zeitraum)
    } catch (error) {
      console.error("Fehler beim Anwenden der Filter:", error)
    }
  }

  const resetFilter = () => {
    setSuchbegriff("")
    setSelectedKategorien([])
    setSelectedTags([])
    setZeitraum("")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Erlebnisse entdecken</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Tauche ein in eine Welt voller faszinierender Geschichten und Erfahrungen. Entdecke, was andere erlebt haben
          und lass dich inspirieren.
        </p>
      </div>

      {/* Suchbereich */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Suche nach Erlebnissen, Orten, Emotionen..."
                value={suchbegriff}
                onChange={(e) => setSuchbegriff(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                    {(selectedKategorien.length > 0 || selectedTags.length > 0) && (
                      <Badge variant="secondary" className="ml-1">
                        {selectedKategorien.length + selectedTags.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <ErlebnisFilter
                    onFilterChange={handleFilterChange}
                    verfuegbareKategorien={alleKategorien}
                    verfuegbareTags={alleTags}
                  />
                </SheetContent>
              </Sheet>

              {(selectedKategorien.length > 0 || selectedTags.length > 0 || suchbegriff) && (
                <Button variant="ghost" onClick={resetFilter}>
                  Filter zurücksetzen
                </Button>
              )}
            </div>
          </div>

          {/* Aktive Filter anzeigen */}
          {(selectedKategorien.length > 0 || selectedTags.length > 0) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedKategorien.map((kategorie) => (
                <Badge key={kategorie} variant="secondary" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {kategorie}
                  <button
                    onClick={() => setSelectedKategorien((prev) => prev.filter((k) => k !== kategorie))}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="outline" className="flex items-center gap-1">
                  #{tag}
                  <button
                    onClick={() => setSelectedTags((prev) => prev.filter((t) => t !== tag))}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistiken */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{safeErlebnisse.length}</div>
            <div className="text-sm text-muted-foreground">Gesamt Erlebnisse</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{gefilterte.length}</div>
            <div className="text-sm text-muted-foreground">Gefilterte Ergebnisse</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{alleKategorien.length}</div>
            <div className="text-sm text-muted-foreground">Kategorien</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{alleTags.length}</div>
            <div className="text-sm text-muted-foreground">Tags</div>
          </CardContent>
        </Card>
      </div>

      {/* Ansicht-Tabs */}
      <Tabs value={ansicht} onValueChange={(value) => setAnsicht(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="liste" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Liste
          </TabsTrigger>
          <TabsTrigger value="karte" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Karte
          </TabsTrigger>
          <TabsTrigger value="zeitstrahl" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Zeitstrahl
          </TabsTrigger>
        </TabsList>

        <TabsContent value="liste" className="mt-6">
          <ErlebnisListe
            erlebnisse={gefilterte}
            onResetFilter={resetFilter}
            filterValues={{
              suchbegriff,
              kategorien: selectedKategorien,
              tags: selectedTags,
              zeitraum,
            }}
          />
        </TabsContent>

        <TabsContent value="karte" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Erlebnisse auf der Karte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Kartenansicht wird geladen...</p>
                  <p className="text-sm text-muted-foreground mt-2">{gefilterte.length} Erlebnisse gefunden</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zeitstrahl" className="mt-6">
          <ErlebnisKarteMitZeitstrahl erlebnisse={gefilterte} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
