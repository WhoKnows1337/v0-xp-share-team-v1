"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ErlebnisListe } from "./erlebnis-liste"
import { SearchAutocomplete } from "./search-autocomplete"
import { InteractiveMap } from "../map/interactive-map"
import { Plus, Filter, MapPin, Calendar, Tag, X, Search, Grid, List, Map, Clock } from "lucide-react"
import { openErlebnisWizard } from "../erlebnis-wizard-modal"
import { mockErlebnisse } from "@/lib/mock-data"
import { ErlebnisKarteMitZeitstrahl } from "./erlebnis-karte-mit-zeitstrahl"
import { simulateGeocode, calculateDistance } from "@/lib/geo-utils"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { DatePicker } from "@/components/ui/date-picker"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"

// Beispiel-Kategorien
const kategorien = [
  { name: "UFO-Sichtung", icon: "👽", farbe: "#6366f1" },
  { name: "Traum", icon: "💤", farbe: "#8b5cf6" },
  { name: "Außerkörperliche Erfahrung", icon: "🧘", farbe: "#10b981" },
  { name: "Synchronizität", icon: "⚡", farbe: "#f59e0b" },
  { name: "Nahtoderfahrung", icon: "✨", farbe: "#ec4899" },
  { name: "Spirituelle Erfahrung", icon: "🌟", farbe: "#0ea5e9" },
  { name: "Déjà-vu", icon: "🔄", farbe: "#14b8a6" },
  { name: "Paranormale Begegnung", icon: "👻", farbe: "#6b7280" },
]

// Beispiel-Tags
const alleTags = [
  "Nacht",
  "Lichter",
  "Formation",
  "Verstorbene",
  "Botschaft",
  "Familie",
  "Meditation",
  "Schweben",
  "Freiheit",
  "Karriere",
  "Zufall",
  "Gedanken",
  "Luzid",
  "Unterwasser",
  "Kommunikation",
  "Unfall",
  "Tunnel",
  "Licht",
  "Frieden",
  "Einheit",
  "Zen",
  "Transformation",
]

// Simulierte Ortsvorschläge
const ortsSuggestions = [
  "Berlin, Deutschland",
  "Hamburg, Deutschland",
  "München, Deutschland",
  "Köln, Deutschland",
  "Frankfurt, Deutschland",
  "Stuttgart, Deutschland",
  "Düsseldorf, Deutschland",
  "Leipzig, Deutschland",
  "Dresden, Deutschland",
  "Hannover, Deutschland",
]

export function EntdeckenPageRedesigned() {
  const [activeTab, setActiveTab] = useState("kacheln")
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredData, setFilteredData] = useState(mockErlebnisse)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [yearRange, setYearRange] = useState<[number, number]>([2000, new Date().getFullYear()])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedOrt, setSelectedOrt] = useState<string | null>(null)
  const [selectedUmkreis, setSelectedUmkreis] = useState<number>(50)
  const [ortKoordinaten, setOrtKoordinaten] = useState<{ lat: number; lng: number } | null>(null)
  const [ortInput, setOrtInput] = useState("")
  const [showOrtSuggestions, setShowOrtSuggestions] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [showFilterBadges, setShowFilterBadges] = useState(true)

  // Effekt zum Umwandeln des ausgewählten Ortes in Koordinaten
  useEffect(() => {
    if (selectedOrt) {
      const koordinaten = simulateGeocode(selectedOrt)
      setOrtKoordinaten(koordinaten)

      // Füge Ort zu aktiven Filtern hinzu
      if (!activeFilters.includes("ort")) {
        setActiveFilters([...activeFilters, "ort"])
      }
    } else {
      setOrtKoordinaten(null)
      setActiveFilters(activeFilters.filter((f) => f !== "ort"))
    }
  }, [selectedOrt])

  // Effekt zum Aktualisieren der aktiven Filter
  useEffect(() => {
    const newActiveFilters = []

    if (selectedCategories.length > 0) newActiveFilters.push("kategorien")
    if (selectedTags.length > 0) newActiveFilters.push("tags")
    if (dateRange.from && dateRange.to) newActiveFilters.push("datum")
    if (yearRange[0] !== 2000 || yearRange[1] !== new Date().getFullYear()) newActiveFilters.push("jahr")
    if (selectedOrt) newActiveFilters.push("ort")

    setActiveFilters(newActiveFilters)
  }, [selectedCategories, selectedTags, dateRange, yearRange, selectedOrt])

  // Effekt zum Filtern der Daten basierend auf den ausgewählten Filtern
  useEffect(() => {
    let filtered = [...mockErlebnisse]

    // Suche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.titel.toLowerCase().includes(searchLower) ||
          item.kurzfassung.toLowerCase().includes(searchLower) ||
          (item.beschreibung && item.beschreibung.toLowerCase().includes(searchLower)) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      )
    }

    // Kategorien
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) => selectedCategories.includes(item.kategorie.name))
    }

    // Tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((item) => selectedTags.some((tag) => item.tags.includes(tag)))
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
        if (!item.ort || !item.ort.koordinaten) return false
        const entfernung = calculateDistance(
          ortKoordinaten.lat,
          ortKoordinaten.lng,
          item.ort.koordinaten.lat,
          item.ort.koordinaten.lng,
        )
        return entfernung <= selectedUmkreis
      })
    }

    setFilteredData(filtered)
  }, [searchTerm, selectedCategories, selectedTags, dateRange, yearRange, ortKoordinaten, selectedUmkreis])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleNewExperience = () => {
    console.log("Entdecken-Seite: Öffne ErlebnisWizard")
    // Füge einen kleinen Timeout hinzu, um sicherzustellen, dass der Event-Handler registriert wurde
    setTimeout(() => {
      openErlebnisWizard()
    }, 0)
  }

  const handleLoadMore = () => {
    setIsLoading(true)
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
    setActiveFilters([])
  }

  const handleSelectOrt = (ort: string) => {
    setSelectedOrt(ort)
    setOrtInput("")
    setShowOrtSuggestions(false)
  }

  const handleResetOrt = () => {
    setSelectedOrt(null)
    setOrtInput("")
    setSelectedUmkreis(50)
    setActiveFilters(activeFilters.filter((f) => f !== "ort"))
  }

  const handleUmkreisChange = (value: number[]) => {
    setSelectedUmkreis(value[0])
  }

  const handleRemoveFilter = (filterType: string) => {
    switch (filterType) {
      case "kategorien":
        setSelectedCategories([])
        break
      case "tags":
        setSelectedTags([])
        break
      case "datum":
        setDateRange({ from: undefined, to: undefined })
        break
      case "jahr":
        setYearRange([2000, new Date().getFullYear()])
        break
      case "ort":
        setSelectedOrt(null)
        setOrtInput("")
        setSelectedUmkreis(50)
        break
    }
    setActiveFilters(activeFilters.filter((f) => f !== filterType))
  }

  // Filtere Ortsvorschläge basierend auf der Eingabe
  const filteredOrtsSuggestions =
    ortInput.length > 0 ? ortsSuggestions.filter((ort) => ort.toLowerCase().includes(ortInput.toLowerCase())) : []

  return (
    <div className="container mx-auto p-4">
      {/* Header mit Suchleiste und Buttons */}
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Entdecken</h1>
            <p className="text-slate-400">Finde und erkunde außergewöhnliche Erfahrungen</p>
          </div>
          <Button
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            onClick={handleNewExperience}
          >
            <Plus className="mr-2 h-4 w-4" />
            Erlebnis teilen
          </Button>
        </div>

        {/* Suchleiste und Filter-Buttons in einer Zeile */}
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <div className="relative flex-grow">
            <SearchAutocomplete
              placeholder="Suche nach Erlebnissen..."
              onSearch={handleSearch}
              className="w-full"
              kategorien={kategorien.map((k) => k.name)}
              tags={alleTags}
              orte={ortsSuggestions}
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {/* Kategorien-Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Kategorien</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b">
                  <h3 className="font-medium">Kategorien</h3>
                  <p className="text-sm text-muted-foreground">Wähle eine oder mehrere Kategorien aus</p>
                </div>
                <ScrollArea className="h-72 p-4">
                  <div className="space-y-2">
                    {kategorien.map((kategorie) => (
                      <div
                        key={kategorie.name}
                        className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                          selectedCategories.includes(kategorie.name) ? "bg-muted" : "hover:bg-muted/50"
                        }`}
                        onClick={() => {
                          const newSelected = selectedCategories.includes(kategorie.name)
                            ? selectedCategories.filter((k) => k !== kategorie.name)
                            : [...selectedCategories, kategorie.name]
                          setSelectedCategories(newSelected)
                        }}
                      >
                        <div
                          className="flex items-center justify-center h-8 w-8 rounded-full text-white"
                          style={{ backgroundColor: kategorie.farbe }}
                        >
                          <span>{kategorie.icon}</span>
                        </div>
                        <span className="flex-grow">{kategorie.name}</span>
                        <Checkbox
                          checked={selectedCategories.includes(kategorie.name)}
                          onCheckedChange={() => {
                            const newSelected = selectedCategories.includes(kategorie.name)
                              ? selectedCategories.filter((k) => k !== kategorie.name)
                              : [...selectedCategories, kategorie.name]
                            setSelectedCategories(newSelected)
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex items-center justify-between p-4 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCategories([])}
                    disabled={selectedCategories.length === 0}
                  >
                    Zurücksetzen
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => document.body.click()} // Schließt das Popover
                  >
                    Anwenden ({selectedCategories.length})
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Tags-Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  <span className="hidden sm:inline">Tags</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b">
                  <h3 className="font-medium">Tags</h3>
                  <p className="text-sm text-muted-foreground">Wähle relevante Tags aus</p>
                </div>
                <ScrollArea className="h-72 p-4">
                  <div className="flex flex-wrap gap-1">
                    {alleTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer m-1"
                        onClick={() => {
                          const newSelected = selectedTags.includes(tag)
                            ? selectedTags.filter((t) => t !== tag)
                            : [...selectedTags, tag]
                          setSelectedTags(newSelected)
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex items-center justify-between p-4 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTags([])}
                    disabled={selectedTags.length === 0}
                  >
                    Zurücksetzen
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => document.body.click()} // Schließt das Popover
                  >
                    Anwenden ({selectedTags.length})
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Ort-Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="hidden sm:inline">Ort</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b">
                  <h3 className="font-medium">Ortsfilter</h3>
                  <p className="text-sm text-muted-foreground">Suche nach Erlebnissen in deiner Nähe</p>
                </div>
                <div className="p-4 space-y-4">
                  {selectedOrt ? (
                    <div className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-blue-400" />
                        <span>{selectedOrt}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleResetOrt}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="flex items-center">
                        <Input
                          type="text"
                          placeholder="Ort eingeben..."
                          value={ortInput}
                          onChange={(e) => {
                            setOrtInput(e.target.value)
                            setShowOrtSuggestions(e.target.value.length > 0)
                          }}
                          className="pr-8"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-0"
                          onClick={() => {
                            if (ortInput.trim()) {
                              handleSelectOrt(ortInput)
                            }
                          }}
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                      {showOrtSuggestions && filteredOrtsSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredOrtsSuggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center"
                              onClick={() => handleSelectOrt(suggestion)}
                            >
                              <MapPin className="h-4 w-4 mr-2 text-blue-400" />
                              {suggestion}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Umkreis: {selectedUmkreis} km</span>
                    </div>
                    <Slider
                      defaultValue={[50]}
                      min={5}
                      max={200}
                      step={5}
                      value={[selectedUmkreis]}
                      onValueChange={handleUmkreisChange}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>5 km</span>
                      <span>200 km</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border-t">
                  <Button variant="ghost" size="sm" onClick={handleResetOrt} disabled={!selectedOrt}>
                    Zurücksetzen
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => document.body.click()} // Schließt das Popover
                    disabled={!selectedOrt && !ortInput.trim()}
                  >
                    Anwenden
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Datum-Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Datum</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="p-4 border-b">
                  <h3 className="font-medium">Zeitraum</h3>
                  <p className="text-sm text-muted-foreground">Wähle einen Datumsbereich aus</p>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Von</Label>
                      <DatePicker
                        date={dateRange.from}
                        setDate={(date) => setDateRange({ ...dateRange, from: date })}
                        placeholder="Startdatum"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Bis</Label>
                      <DatePicker
                        date={dateRange.to}
                        setDate={(date) => setDateRange({ ...dateRange, to: date })}
                        placeholder="Enddatum"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Jahresbereich</Label>
                    <div className="pt-4">
                      <Slider
                        defaultValue={yearRange}
                        min={1900}
                        max={new Date().getFullYear()}
                        step={1}
                        value={yearRange}
                        onValueChange={(value) => setYearRange([value[0], value[1]])}
                        className="py-4"
                      />
                      <div className="flex justify-between text-sm">
                        <span>{yearRange[0]}</span>
                        <span>{yearRange[1]}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDateRange({ from: undefined, to: undefined })
                      setYearRange([2000, new Date().getFullYear()])
                    }}
                    disabled={
                      !dateRange.from &&
                      !dateRange.to &&
                      yearRange[0] === 2000 &&
                      yearRange[1] === new Date().getFullYear()
                    }
                  >
                    Zurücksetzen
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => document.body.click()} // Schließt das Popover
                  >
                    Anwenden
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Alle Filter zurücksetzen */}
            {activeFilters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilter}
                className="text-red-500 hover:text-red-600 hover:bg-red-100/10"
              >
                <X className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Alle Filter zurücksetzen</span>
                <span className="sm:hidden">Zurücksetzen</span>
              </Button>
            )}
          </div>
        </div>

        {/* Aktive Filter als Badges */}
        {activeFilters.length > 0 && showFilterBadges && (
          <div className="flex flex-wrap gap-2 mt-2">
            {activeFilters.includes("kategorien") && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <span>Kategorien: {selectedCategories.length}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => handleRemoveFilter("kategorien")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {activeFilters.includes("tags") && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <span>Tags: {selectedTags.length}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => handleRemoveFilter("tags")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {activeFilters.includes("ort") && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <span>Ort: {selectedOrt?.split(",")[0]}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => handleRemoveFilter("ort")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {activeFilters.includes("datum") && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <span>
                  Datum: {dateRange.from?.toLocaleDateString()} - {dateRange.to?.toLocaleDateString()}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => handleRemoveFilter("datum")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {activeFilters.includes("jahr") && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <span>
                  Jahr: {yearRange[0]} - {yearRange[1]}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => handleRemoveFilter("jahr")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Tabs für verschiedene Ansichten */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 bg-slate-800/50 border border-slate-700 grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="kacheln" className="data-[state=active]:bg-slate-700 flex items-center gap-1">
            <Grid className="h-4 w-4" />
            <span className="hidden sm:inline">Kacheln</span>
          </TabsTrigger>
          <TabsTrigger value="liste" className="data-[state=active]:bg-slate-700 flex items-center gap-1">
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Liste</span>
          </TabsTrigger>
          <TabsTrigger value="karte" className="data-[state=active]:bg-slate-700 flex items-center gap-1">
            <Map className="h-4 w-4" />
            <span className="hidden sm:inline">Karte</span>
          </TabsTrigger>
          <TabsTrigger value="zeitstrahl" className="data-[state=active]:bg-slate-700 flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Zeitstrahl</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kacheln" className="mt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key="kacheln"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center mb-4">
                <p className="text-muted-foreground">{filteredData.length} Erlebnisse gefunden</p>
              </div>
              <ErlebnisListe
                erlebnisse={filteredData}
                ansicht="karten"
                onLoadMore={handleLoadMore}
                isLoading={isLoading}
                hasMore={false}
                onResetFilter={resetFilter}
              />
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="liste" className="mt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key="liste"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center mb-4">
                <p className="text-muted-foreground">{filteredData.length} Erlebnisse gefunden</p>
              </div>
              <ErlebnisListe
                erlebnisse={filteredData}
                ansicht="kompakt"
                onLoadMore={handleLoadMore}
                isLoading={isLoading}
                hasMore={false}
                onResetFilter={resetFilter}
              />
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="karte" className="mt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key="karte"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden h-[600px]">
                <InteractiveMap erlebnisse={filteredData} initialCoordinates={ortKoordinaten || undefined} />
              </div>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="zeitstrahl" className="mt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key="zeitstrahl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
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
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  )
}
