"use client"

import { useState, useEffect } from "react"
import { mockErlebnisse } from "@/lib/mock-data"
import { ErlebnisListe } from "./erlebnis-liste"
import { ErlebnisFilter } from "./erlebnis-filter"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InteractiveMap } from "../map/interactive-map"
import { OrtFilter } from "./ort-filter"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { MapPin, List, Grid, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ZeitStrahl } from "./zeit-strahl"
import { SearchAutocomplete } from "./search-autocomplete"
import { useRouter, useSearchParams } from "next/navigation"

export function EntdeckenPageRedesigned() {
  // Ensure we have a default array of erlebnisse
  const [erlebnisse, setErlebnisse] = useState<any[]>([])
  const [filteredErlebnisse, setFilteredErlebnisse] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [ansicht, setAnsicht] = useState<"karten" | "liste" | "karte" | "zeitstrahl">("karten")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [radius, setRadius] = useState(50) // Radius in km
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  // Lade Erlebnisse beim ersten Rendern
  useEffect(() => {
    // Simuliere API-Aufruf
    setTimeout(() => {
      setErlebnisse(mockErlebnisse || [])
      setFilteredErlebnisse(mockErlebnisse || [])
      setIsLoading(false)
    }, 1000)

    // Prüfe URL-Parameter
    const query = searchParams?.get("q")
    const kategorie = searchParams?.get("kategorie")
    const tag = searchParams?.get("tag")

    if (query) {
      setSearchQuery(query)
    }

    if (kategorie) {
      setSelectedCategories([kategorie])
    }

    if (tag) {
      setSelectedTags([tag])
    }
  }, [searchParams])

  // Filtere Erlebnisse basierend auf Suchbegriff, Kategorien und Tags
  useEffect(() => {
    if (!erlebnisse || erlebnisse.length === 0) {
      setFilteredErlebnisse([])
      return
    }

    let filtered = [...erlebnisse]

    // Filtere nach Suchbegriff
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (erlebnis) =>
          erlebnis.titel.toLowerCase().includes(query) ||
          (erlebnis.beschreibung && erlebnis.beschreibung.toLowerCase().includes(query)) ||
          (erlebnis.kurzfassung && erlebnis.kurzfassung.toLowerCase().includes(query)) ||
          (erlebnis.tags && erlebnis.tags.some((tag: string) => tag.toLowerCase().includes(query))),
      )
    }

    // Filtere nach Kategorien
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((erlebnis) => {
        const kategorieNamen =
          typeof erlebnis.kategorie === "string" ? erlebnis.kategorie : erlebnis.kategorie?.name || ""

        return selectedCategories.some((cat) => kategorieNamen.toLowerCase() === cat.toLowerCase())
      })
    }

    // Filtere nach Tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(
        (erlebnis) => erlebnis.tags && erlebnis.tags.some((tag: string) => selectedTags.includes(tag)),
      )
    }

    // Filtere nach Standort
    if (selectedLocation) {
      filtered = filtered.filter((erlebnis) => {
        if (!erlebnis.ort || !erlebnis.ort.koordinaten) return false

        // Berechne Entfernung zwischen zwei Punkten (Haversine-Formel)
        const R = 6371 // Erdradius in km
        const lat1 = selectedLocation.lat
        const lon1 = selectedLocation.lng
        const lat2 = erlebnis.ort.koordinaten.lat
        const lon2 = erlebnis.ort.koordinaten.lng

        const dLat = ((lat2 - lat1) * Math.PI) / 180
        const dLon = ((lon2 - lon1) * Math.PI) / 180

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const distance = R * c

        return distance <= radius
      })
    }

    setFilteredErlebnisse(filtered)
  }, [erlebnisse, searchQuery, selectedCategories, selectedTags, selectedLocation, radius])

  // Funktion zum Zurücksetzen aller Filter
  const resetAllFilters = () => {
    setSearchQuery("")
    setSelectedCategories([])
    setSelectedTags([])
    setSelectedLocation(null)
    setRadius(50)
    setFilteredErlebnisse(erlebnisse)
  }

  // Funktion zum Aktualisieren der URL mit Suchparametern
  const updateUrlWithParams = (params: { q?: string; kategorie?: string; tag?: string }) => {
    const url = new URL(window.location.href)

    if (params.q) {
      url.searchParams.set("q", params.q)
    } else {
      url.searchParams.delete("q")
    }

    if (params.kategorie) {
      url.searchParams.set("kategorie", params.kategorie)
    } else {
      url.searchParams.delete("kategorie")
    }

    if (params.tag) {
      url.searchParams.set("tag", params.tag)
    } else {
      url.searchParams.delete("tag")
    }

    router.push(url.pathname + url.search)
  }

  return (
    <Container className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Erlebnisse entdecken</h1>

          <div className="w-full md:w-auto">
            <SearchAutocomplete
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={(query) => {
                setSearchQuery(query)
                updateUrlWithParams({ q: query, kategorie: selectedCategories[0], tag: selectedTags[0] })
              }}
            />
          </div>
        </div>

        <Tabs defaultValue="karten" onValueChange={(value) => setAnsicht(value as any)}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="karten">
                <Grid className="h-4 w-4 mr-2" />
                Karten
              </TabsTrigger>
              <TabsTrigger value="liste">
                <List className="h-4 w-4 mr-2" />
                Liste
              </TabsTrigger>
              <TabsTrigger value="karte">
                <MapPin className="h-4 w-4 mr-2" />
                Karte
              </TabsTrigger>
              <TabsTrigger value="zeitstrahl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 mr-2"
                >
                  <line x1="12" y1="2" x2="12" y2="22"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                Zeitstrahl
              </TabsTrigger>
            </TabsList>

            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent>
                <ErlebnisFilter
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  selectedTags={selectedTags}
                  setSelectedTags={setSelectedTags}
                  onFilterChange={() => {
                    updateUrlWithParams({
                      q: searchQuery,
                      kategorie: selectedCategories[0],
                      tag: selectedTags[0],
                    })
                    setIsFilterOpen(false)
                  }}
                  onReset={resetAllFilters}
                />
              </SheetContent>
            </Sheet>
          </div>

          <TabsContent value="karten" className="mt-0">
            <ErlebnisListe
              erlebnisse={filteredErlebnisse}
              ansicht="karten"
              isLoading={isLoading}
              hasMore={false}
              onResetFilter={resetAllFilters}
              filterValues={{
                suchbegriff: searchQuery,
                kategorien: selectedCategories,
                tags: selectedTags,
              }}
            />
          </TabsContent>

          <TabsContent value="liste" className="mt-0">
            <ErlebnisListe
              erlebnisse={filteredErlebnisse}
              ansicht="kompakt"
              isLoading={isLoading}
              hasMore={false}
              onResetFilter={resetAllFilters}
              filterValues={{
                suchbegriff: searchQuery,
                kategorien: selectedCategories,
                tags: selectedTags,
              }}
            />
          </TabsContent>

          <TabsContent value="karte" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <OrtFilter
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                  radius={radius}
                  setRadius={setRadius}
                />
              </div>
              <div className="md:col-span-2">
                <InteractiveMap
                  erlebnisse={filteredErlebnisse}
                  selectedLocation={selectedLocation}
                  radius={radius}
                  onLocationSelect={setSelectedLocation}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="zeitstrahl" className="mt-0">
            <ZeitStrahl erlebnisse={filteredErlebnisse} />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  )
}
