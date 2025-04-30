"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { ZeitSlider } from "./zeit-slider"
import { CheckCircle2, Search } from "lucide-react"

interface ErlebnisFilterProps {
  onFilterChange?: (filterValues: {
    kategorien: string[]
    zeitraum: string
    zeitraumTyp: "vordefiniert" | "datumsbereich" | "jahresbereich"
    datumVon?: Date
    datumBis?: Date
    jahrVon?: number
    jahrBis?: number
    tags: string[]
    nurVerifiziert: boolean
    suchbegriff: string
  }) => void
  initialValues?: {
    kategorien: string[]
    zeitraum: string
    zeitraumTyp: "vordefiniert" | "datumsbereich" | "jahresbereich"
    datumVon?: Date
    datumBis?: Date
    jahrVon?: number
    jahrBis?: number
    tags: string[]
    nurVerifiziert: boolean
    suchbegriff: string
  }
  onReset?: () => void
  // Neue Props für die aktualisierte EntdeckenPageUpdated-Komponente
  selectedCategories?: string[]
  setSelectedCategories?: (categories: string[]) => void
  selectedTags?: string[]
  setSelectedTags?: (tags: string[]) => void
}

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

// Aktuelle Jahr für Zeitfilter
const aktuellesJahr = new Date().getFullYear()
const minJahr = 1900
const maxJahr = aktuellesJahr

export function ErlebnisFilter({
  onFilterChange,
  initialValues,
  onReset,
  selectedCategories,
  setSelectedCategories,
  selectedTags,
  setSelectedTags,
}: ErlebnisFilterProps) {
  // Verwende entweder die neuen Props oder die alten Props
  const [selectedKategorien, setSelectedKategorien] = useState<string[]>(
    selectedCategories || initialValues?.kategorien || [],
  )
  const [localSelectedTags, setLocalSelectedTags] = useState<string[]>(selectedTags || initialValues?.tags || [])
  const [zeitraum, setZeitraum] = useState<string>(initialValues?.zeitraum || "alle")
  const [zeitraumTyp, setZeitraumTyp] = useState<"vordefiniert" | "datumsbereich" | "jahresbereich">(
    initialValues?.zeitraumTyp || "vordefiniert",
  )
  const [datumVon, setDatumVon] = useState<Date | undefined>(initialValues?.datumVon)
  const [datumBis, setDatumBis] = useState<Date | undefined>(initialValues?.datumBis)
  const [jahrVon, setJahrVon] = useState<number>(initialValues?.jahrVon || minJahr)
  const [jahrBis, setJahrBis] = useState<number>(initialValues?.jahrBis || maxJahr)
  const [nurVerifiziert, setNurVerifiziert] = useState<boolean>(initialValues?.nurVerifiziert || false)
  const [suchbegriff, setSuchbegriff] = useState<string>(initialValues?.suchbegriff || "")

  // Füge einen useEffect hinzu, um auf Änderungen der initialValues zu reagieren
  useEffect(() => {
    if (initialValues) {
      setSelectedKategorien(initialValues.kategorien)
      setLocalSelectedTags(initialValues.tags)
      setZeitraum(initialValues.zeitraum)
      setZeitraumTyp(initialValues.zeitraumTyp)
      setDatumVon(initialValues.datumVon)
      setDatumBis(initialValues.datumBis)
      setJahrVon(initialValues.jahrVon || minJahr)
      setJahrBis(initialValues.jahrBis || maxJahr)
      setNurVerifiziert(initialValues.nurVerifiziert)
      setSuchbegriff(initialValues.suchbegriff)
    }
  }, [initialValues])

  // Synchronisiere lokale Zustände mit den Props, wenn sie sich ändern
  useEffect(() => {
    if (selectedCategories) {
      setSelectedKategorien(selectedCategories)
    }
  }, [selectedCategories])

  useEffect(() => {
    if (selectedTags) {
      setLocalSelectedTags(selectedTags)
    }
  }, [selectedTags])

  // Kategorie auswählen/abwählen
  const toggleKategorie = (kategorie: string) => {
    const newSelectedKategorien = selectedKategorien.includes(kategorie)
      ? selectedKategorien.filter((k) => k !== kategorie)
      : [...selectedKategorien, kategorie]

    setSelectedKategorien(newSelectedKategorien)

    // Wenn die neue Props vorhanden sind, verwende sie
    if (setSelectedCategories) {
      setSelectedCategories(newSelectedKategorien)
    }
  }

  // Tag auswählen/abwählen
  const toggleTag = (tag: string) => {
    const newSelectedTags = localSelectedTags.includes(tag)
      ? localSelectedTags.filter((t) => t !== tag)
      : [...localSelectedTags, tag]

    setLocalSelectedTags(newSelectedTags)

    // Wenn die neue Props vorhanden sind, verwende sie
    if (setSelectedTags) {
      setSelectedTags(newSelectedTags)
    }
  }

  // Jahresbereich ändern
  const handleJahresbereichChange = (min: number, max: number) => {
    setJahrVon(min)
    setJahrBis(max)
  }

  // Filter zurücksetzen
  const resetFilter = () => {
    const emptyKategorien: string[] = []
    const emptyTags: string[] = []

    setSelectedKategorien(emptyKategorien)
    setLocalSelectedTags(emptyTags)
    setZeitraum("alle")
    setZeitraumTyp("vordefiniert")
    setDatumVon(undefined)
    setDatumBis(undefined)
    setJahrVon(minJahr)
    setJahrBis(maxJahr)
    setNurVerifiziert(false)
    setSuchbegriff("")

    // Wenn die neue Props vorhanden sind, verwende sie
    if (setSelectedCategories) {
      setSelectedCategories(emptyKategorien)
    }

    if (setSelectedTags) {
      setSelectedTags(emptyTags)
    }

    if (onReset) {
      onReset()
    } else if (onFilterChange) {
      onFilterChange({
        kategorien: [],
        zeitraum: "alle",
        zeitraumTyp: "vordefiniert",
        tags: [],
        nurVerifiziert: false,
        suchbegriff: "",
      })
    }
  }

  // Filter anwenden
  const applyFilter = () => {
    if (onFilterChange) {
      onFilterChange({
        kategorien: selectedKategorien,
        zeitraum,
        zeitraumTyp,
        datumVon,
        datumBis,
        jahrVon,
        jahrBis,
        tags: localSelectedTags,
        nurVerifiziert,
        suchbegriff,
      })
    }
  }

  // Füge die Suchleiste zur Filterkomponente hinzu
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Filter</h3>
        <div className="flex justify-between">
          <Button variant="outline" size="sm" onClick={resetFilter} className="text-xs">
            Zurücksetzen
          </Button>
          <Button size="sm" onClick={applyFilter} className="text-xs">
            Filter anwenden
          </Button>
        </div>
      </div>

      {/* Suchfeld im Filter-Panel */}
      <div>
        <h4 className="font-medium mb-2">Suchbegriff</h4>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Suche nach Erlebnissen..."
            className="pl-10"
            value={suchbegriff}
            onChange={(e) => setSuchbegriff(e.target.value)}
          />
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Kategorien</h4>
        <div className="space-y-2">
          {kategorien.map((kategorie) => (
            <div
              key={kategorie.name}
              className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                selectedKategorien.includes(kategorie.name) ? "bg-muted" : "hover:bg-muted/50"
              }`}
              onClick={() => toggleKategorie(kategorie.name)}
            >
              <div
                className="flex items-center justify-center h-8 w-8 rounded-full text-white"
                style={{ backgroundColor: kategorie.farbe }}
              >
                <span>{kategorie.icon}</span>
              </div>
              <span className="flex-grow">{kategorie.name}</span>
              <Checkbox
                checked={selectedKategorien.includes(kategorie.name)}
                onCheckedChange={() => toggleKategorie(kategorie.name)}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Zeitraum</h4>

        <Tabs value={zeitraumTyp} onValueChange={(value) => setZeitraumTyp(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vordefiniert">Vordefiniert</TabsTrigger>
            <TabsTrigger value="datumsbereich">Datumsbereich</TabsTrigger>
            <TabsTrigger value="jahresbereich">Jahresbereich</TabsTrigger>
          </TabsList>

          <TabsContent value="vordefiniert" className="space-y-2 mt-2">
            <RadioGroup value={zeitraum} onValueChange={setZeitraum}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="alle" id="alle-zeit" />
                <Label htmlFor="alle-zeit">Alle Zeiten</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="letzte-7-tage" id="letzte-7-tage" />
                <Label htmlFor="letzte-7-tage">Letzte 7 Tage</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="letzte-woche" id="letzte-woche" />
                <Label htmlFor="letzte-woche">Letzte Woche</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="letzter-monat" id="letzter-monat" />
                <Label htmlFor="letzter-monat">Letzter Monat</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="letzte-drei-monate" id="letzte-drei-monate" />
                <Label htmlFor="letzte-drei-monate">Letzte drei Monate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="letztes-jahr" id="letztes-jahr" />
                <Label htmlFor="letztes-jahr">Letztes Jahr</Label>
              </div>
            </RadioGroup>
          </TabsContent>

          <TabsContent value="datumsbereich" className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Von</Label>
              <DatePicker date={datumVon} setDate={setDatumVon} placeholder="Startdatum" />
            </div>
            <div className="space-y-2">
              <Label>Bis</Label>
              <DatePicker date={datumBis} setDate={setDatumBis} placeholder="Enddatum" />
            </div>
          </TabsContent>

          <TabsContent value="jahresbereich" className="mt-2">
            <ZeitSlider
              minJahr={minJahr}
              maxJahr={maxJahr}
              onChange={handleJahresbereichChange}
              initialMin={jahrVon}
              initialMax={jahrBis}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <h4 className="font-medium mb-2">Tags</h4>
        <div className="flex flex-wrap gap-1">
          {alleTags.map((tag) => (
            <Badge
              key={tag}
              variant={localSelectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="verifiziert"
            checked={nurVerifiziert}
            onCheckedChange={(checked) => setNurVerifiziert(checked === true)}
          />
          <label
            htmlFor="verifiziert"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
          >
            Nur verifizierte Erlebnisse
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </label>
        </div>
      </div>
    </div>
  )
}
