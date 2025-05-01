"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ErlebnisListe } from "./erlebnis-liste"
import { ErlebnisFilter } from "./erlebnis-filter"
import { ZeitFilter } from "./zeit-filter"
import { OrtFilter } from "./ort-filter"
import { SearchAutocomplete } from "./search-autocomplete"
import { InteractiveMap } from "../map/interactive-map"
import { Plus } from "lucide-react"
import { openErlebnisWizard } from "../erlebnis-wizard-modal"
import { mockErlebnisse } from "@/lib/mock-data"
import { ErlebnisKarteMitZeitstrahl } from "./erlebnis-karte-mit-zeitstrahl"
import { simulateGeocode, calculateDistance } from "@/lib/geo-utils"
import { ErrorBoundary } from "@/components/error-boundary"

export function EntdeckenPage() {
  // Sichere Initialisierung mit leeren Arrays für den Fall, dass mockErlebnisse noch nicht geladen ist
  const [erlebnisse, setErlebnisse] = useState([])
  const [activeTab, setActiveTab] = useState("kacheln")
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredData, setFilteredData] = useState([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [yearRange, setYearRange] = useState<[number, number]>([2000, new Date().getFullYear()])
  const [isLoading, setIsLoading] = useState(false)

  // Neue Zustände für den Ortsfilter
  const [selectedOrt, setSelectedOrt] = useState<string | null>(null)
  const [selectedUmkreis, setSelectedUmkreis] = useState<number>(50)
  const [ortKoordinaten, setOrtKoordinaten] = useState<{ lat: number; lng: number } | null>(null)

  // Lade die Erlebnisse, wenn die Komponente gemountet wird
  useEffect(() => {
    // Sichere Initialisierung der Daten
    if (mockErlebnisse && Array.isArray(mockErlebnisse)) {
      setErlebnisse(mockErlebnisse)
      setFilteredData(mockErlebnisse)
    } else {
      console.error("mockErlebnisse ist nicht verfügbar oder kein Array")
      setErlebnisse([])
      setFilteredData([])
    }
  }, [])

  // Effekt zum Umwandeln des ausgewählten Ortes in Koordinaten
  useEffect(() => {
    if (selectedOrt) {
      const koordinaten = simulateGeocode(selectedOrt)
      setOrtKoordinaten(koordinaten)
    } else {
      setOrtKoordinaten(null)
    }
  }, [selectedOrt])

  // Effekt zum Filtern der Daten basierend auf den ausgewählten Filtern
  useEffect(() => {
    // Sicherstellen, dass erlebnisse ein Array ist
    if (!Array.isArray(erlebnisse)) {
      setFilteredData([])
      return
    }

    let filtered = [...erlebnisse]

    // Suche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.titel.toLowerCase().includes(searchLower) ||
          item.kurzfassung.toLowerCase().includes(searchLower) ||
          (item.beschreibung && item.beschreibung.toLowerCase().includes(searchLower)) ||
          (Array.isArray(item.tags) && item.tags.some((tag) => tag.toLowerCase().includes(searchLower))),
      )
    }

    // Kategorien
    if (selectedCategories && selectedCategories.length > 0) {
      filtered = filtered.filter((item) => selectedCategories.includes(item.kategorie.name))
    }

    // Tags
    if (selectedTags && selectedTags.length > 0) {
      filtered = filtered.filter(
        (item) => Array.isArray(item.tags) && selectedTags.some((tag) => item.tags.includes(tag)),
      )
    }

    // Datumsbereich
    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.datum.split(".").reverse().join("-"))
        return itemDate >= dateRange.from! && itemDate <= dateRange.to!
      })
    }

    // Jahresbereich
    if (yearRange[0] !== 2000 || yearRange[1] !== new Date().getFullYear()) {
      filtered = filtered.filter((item) => {
        const itemYear = Number.parseInt(item.datum.split(".")[2])
        return itemYear >= yearRange[0] && itemYear <= yearRange[1]
      })
    }

    // Ortsfilter
    if (ortKoordinaten) {
      filtered = filtered.filter((item) => {
        // Prüfe, ob das Erlebnis einen Ort hat
        if (!item.ort || !item.ort.koordinaten) return false

        // Berechne die Entfernung zwischen dem ausgewählten Ort und dem Ort des Erlebnisses
        const entfernung = calculateDistance(
          ortKoordinaten.lat,
          ortKoordinaten.lng,
          item.ort.koordinaten.lat,
          item.ort.koordinaten.lng,
        )

        // Prüfe, ob die Entfernung innerhalb des ausgewählten Umkreises liegt
        return entfernung <= selectedUmkreis
      })
    }

    setFilteredData(filtered)
  }, [erlebnisse, searchTerm, selectedCategories, selectedTags, dateRange, yearRange, ortKoordinaten, selectedUmkreis])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleNewExperience = () => {
    openErlebnisWizard()
  }

  const handleLoadMore = () => {
    setIsLoading(true)
    // Simuliere das Laden weiterer Daten
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const resetFilter = () => {
    setSearchTerm("")
    setSelectedCategories([])
    setSelectedTags([])
    setDateRange({ from: undefined, to: undefined })
    setYearRange([2000, new Date().getFullYear()])
    setSelectedOrt(null)
    setSelectedUmkreis(50)
    setOrtKoordinaten(null)
  }

  const handleOrtFilterChange = (ort: string | null, umkreis: number) => {
    setSelectedOrt(ort)
    setSelectedUmkreis(umkreis)
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Entdecken</h1>
            <p className="text-slate-400">Finde und erkunde außergewöhnliche Erfahrungen</p>
          </div>
          <Button
            className="mt-4 md:mt-0 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            onClick={handleNewExperience}
          >
            <Plus className="mr-2 h-4 w-4" />
            Neues Erlebnis
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Linke Spalte - Filter */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <h2 className="text-xl font-semibold mb-4">Suche</h2>
              <SearchAutocomplete
                placeholder="Suche nach Erlebnissen..."
                onSearch={handleSearch}
                suggestions={[
                  "Luzider Traum",
                  "Meditation",
                  "Nahtoderfahrung",
                  "Déjà-vu",
                  "Synchronizität",
                  "Außerkörperliche Erfahrung",
                ]}
              />
            </div>

            {/* Neuer Ortsfilter */}
            <OrtFilter onOrtFilterChange={handleOrtFilterChange} />

            <ErlebnisFilter
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />

            <ZeitFilter
              dateRange={dateRange}
              setDateRange={setDateRange}
              yearRange={yearRange}
              setYearRange={setYearRange}
            />
          </div>

          {/* Rechte Spalte - Erlebnisse */}
          <div className="lg:col-span-3">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4 bg-slate-800/50 border border-slate-700">
                <TabsTrigger value="kacheln" className="data-[state=active]:bg-slate-700">
                  Kacheln
                </TabsTrigger>
                <TabsTrigger value="liste" className="data-[state=active]:bg-slate-700">
                  Liste
                </TabsTrigger>
                <TabsTrigger value="karte" className="data-[state=active]:bg-slate-700">
                  Karte
                </TabsTrigger>
                <TabsTrigger value="zeitstrahl" className="data-[state=active]:bg-slate-700">
                  Zeitstrahl
                </TabsTrigger>
              </TabsList>

              <TabsContent value="kacheln" className="mt-0">
                <ErlebnisListe
                  erlebnisse={filteredData}
                  ansicht="karten"
                  onLoadMore={handleLoadMore}
                  isLoading={isLoading}
                  hasMore={false}
                  onResetFilter={resetFilter}
                  filterValues={{
                    suchbegriff: searchTerm,
                    kategorien: selectedCategories,
                    zeitraum: "alle",
                    tags: selectedTags,
                    nurVerifiziert: false,
                  }}
                />
              </TabsContent>

              <TabsContent value="liste" className="mt-0">
                <ErlebnisListe
                  erlebnisse={filteredData}
                  ansicht="kompakt"
                  onLoadMore={handleLoadMore}
                  isLoading={isLoading}
                  hasMore={false}
                  onResetFilter={resetFilter}
                  filterValues={{
                    suchbegriff: searchTerm,
                    kategorien: selectedCategories,
                    zeitraum: "alle",
                    tags: selectedTags,
                    nurVerifiziert: false,
                  }}
                />
              </TabsContent>

              <TabsContent value="karte" className="mt-0">
                <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden h-[600px]">
                  <InteractiveMap erlebnisse={filteredData} initialCoordinates={ortKoordinaten || undefined} />
                </div>
              </TabsContent>

              <TabsContent value="zeitstrahl" className="mt-0">
                <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden h-[600px]">
                  <h3 className="text-xl font-semibold p-4">Zeitstrahl</h3>
                  {filteredData.length > 0 ? (
                    <ErlebnisKarteMitZeitstrahl erlebnisse={filteredData} />
                  ) : (
                    <div className="flex justify-center items-center h-[500px]">
                      <p>Keine Erlebnisse gefunden. Bitte passe deine Filter an.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
