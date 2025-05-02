"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ErlebnisFilter } from "./erlebnis-filter"
import { ErlebnisListe } from "./erlebnis-liste"
import { InteractiveMap } from "../map/interactive-map"
import { ZeitStrahl } from "./zeit-strahl"
import { mockErlebnisse } from "@/lib/mock-data"
import type { Erlebnis } from "@/types/erlebnis"
import { Container } from "@/components/ui/container"
import { useRouter, useSearchParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

export function EntdeckenPageRedesigned() {
  const [erlebnisse, setErlebnisse] = useState<Erlebnis[]>([])
  const [filteredErlebnisse, setFilteredErlebnisse] = useState<Erlebnis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [ansicht, setAnsicht] = useState("liste")
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [radius, setRadius] = useState(50) // Radius in km
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [selectedKategorien, setSelectedKategorien] = useState<string[]>([])
  const [selectedTags2, setSelectedTags2] = useState<string[]>([])
  const [zeitraumFilter, setZeitraumFilter] = useState<string>("alle")
  const [ortFilter, setOrtFilter] = useState<string>("")
  const [sortierung, setSortierung] = useState<string>("neueste")
  const [anzeigeLimit, setAnzeigeLimit] = useState<number>(12)
  const [hasMore, setHasMore] = useState<boolean>(false)
  const [gefilterteErlebnisse, setGefilterteErlebnisse] = useState<any[]>([])
  const [suchbegriff, setSuchbegriff] = useState<string>("")

  useEffect(() => {
    // Simuliere API-Aufruf
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Simuliere Netzwerklatenz
        await new Promise((resolve) => setTimeout(resolve, 800))
        setErlebnisse(mockErlebnisse)
        setFilteredErlebnisse(mockErlebnisse)
      } catch (error) {
        console.error("Fehler beim Laden der Erlebnisse:", error)
      } finally {
        setIsLoading(false)
        setIsInitialLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleFilterChange = (filtered: Erlebnis[]) => {
    setFilteredErlebnisse(filtered)
  }

  const handleYearSelect = (year: number) => {
    setSelectedYear(year)
    const filtered = erlebnisse.filter((erlebnis) => {
      const erlebnisJahr = new Date(erlebnis.datum).getFullYear()
      return erlebnisJahr === year
    })
    setFilteredErlebnisse(filtered)
  }

  const handleViewChange = (view: string) => {
    console.log("Ansicht geändert zu:", view)
    setAnsicht(view)
  }

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

  if (isInitialLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-10 w-[200px]" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <Skeleton className="h-[200px] w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Container className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Erlebnisse entdecken</h1>
          <p className="text-muted-foreground">
            Entdecke außergewöhnliche Erlebnisse von anderen Nutzern und lasse dich inspirieren.
          </p>
        </div>

        <ErlebnisFilter erlebnisse={erlebnisse} onFilterChange={handleFilterChange} />

        <Tabs defaultValue="liste" value={ansicht} onValueChange={handleViewChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="liste">Liste</TabsTrigger>
            <TabsTrigger value="karte">Karte</TabsTrigger>
            <TabsTrigger value="zeitstrahl">Zeitstrahl</TabsTrigger>
          </TabsList>

          <TabsContent value="liste" className="mt-0">
            <ErlebnisListe erlebnisse={filteredErlebnisse} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="karte" className="mt-0">
            <div className="rounded-lg border bg-card">
              <InteractiveMap erlebnisse={filteredErlebnisse} />
            </div>
          </TabsContent>

          <TabsContent value="zeitstrahl" className="mt-0">
            <div className="rounded-lg border bg-card p-6">
              <ZeitStrahl erlebnisse={erlebnisse} onYearSelect={handleYearSelect} selectedYear={selectedYear} />
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">
                  {selectedYear ? `Erlebnisse aus dem Jahr ${selectedYear}` : "Alle Erlebnisse"}
                </h3>
                <ErlebnisListe erlebnisse={filteredErlebnisse} isLoading={isLoading} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  )
}
