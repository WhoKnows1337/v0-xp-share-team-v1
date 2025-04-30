"use client"

import { useState, useMemo, useEffect } from "react"
import { Filter, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ErlebnisKarte } from "@/components/entdecken/erlebnis-karte"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { Erlebnis } from "@/types/erlebnis"
import type { User } from "@/lib/mock-users"
import { ErlebnisWizardModal } from "@/components/erlebnis-wizard-modal"
import { mockErlebnisse } from "@/lib/mock-data"

interface ErlebnisseTabProps {
  benutzer: User
  isCurrentUser: boolean
}

export function ErlebnisseTab({ benutzer, isCurrentUser }: ErlebnisseTabProps) {
  const [filter, setFilter] = useState("alle")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("datum-neu")
  const [showFilterDialog, setShowFilterDialog] = useState(false)
  const [showNotesDialog, setShowNotesDialog] = useState(false)
  const [selectedErlebnis, setSelectedErlebnis] = useState<any>(null)
  const [erlebnisse, setErlebnisse] = useState<Erlebnis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [allKategorien, setAllKategorien] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [allOrte, setAllOrte] = useState<string[]>([])
  const [suchbegriff, setSuchbegriff] = useState("")
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("alle")

  // Erweiterte Filter
  const [filterOptions, setFilterOptions] = useState({
    kategorien: [] as string[],
    tags: [] as string[],
    orte: [] as string[],
    zeitraum: {
      von: "",
      bis: "",
    },
  })

  // Direkt die Erlebnisse aus den Mock-Daten laden
  useEffect(() => {
    if (!benutzer) return

    // Hier filtern wir die Erlebnisse nach dem Benutzernamen
    const userErlebnisse = mockErlebnisse.filter((erlebnis) => {
      if (typeof erlebnis.autor === "string") {
        return erlebnis.autor === benutzer.username
      } else if (typeof erlebnis.autor === "object" && erlebnis.autor !== null) {
        return erlebnis.autor.name === benutzer.username
      }
      return false
    })

    // Extrahiere eindeutige Kategorien, Tags und Orte
    const kategorien = Array.from(new Set(userErlebnisse.map((e) => e.kategorie.name)))
    const tags = Array.from(new Set(userErlebnisse.flatMap((e) => e.tags)))
    const orte = Array.from(new Set(userErlebnisse.filter((e) => e.ort).map((e) => e.ort!.name)))

    setErlebnisse(userErlebnisse)
    setAllKategorien(kategorien)
    setAllTags(tags)
    setAllOrte(orte)
    setIsLoading(false)
  }, [benutzer])

  // Gefilterte Erlebnisse basierend auf dem aktiven Tab und Suchbegriff
  const filteredErlebnisse = useMemo(() => {
    if (!erlebnisse) return []

    return erlebnisse.filter((erlebnis) => {
      // Status-Filter (veröffentlicht/entwurf)
      if (activeTab === "veröffentlicht" && erlebnis.status !== "veröffentlicht") return false
      if (activeTab === "entwürfe" && erlebnis.status !== "entwurf") return false

      // Suchbegriff
      if (suchbegriff) {
        const searchLower = suchbegriff.toLowerCase()
        const inTitle = erlebnis.titel.toLowerCase().includes(searchLower)
        const inSummary = erlebnis.kurzfassung.toLowerCase().includes(searchLower)
        const inTags = erlebnis.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        const inLocation = erlebnis.ort?.name.toLowerCase().includes(searchLower) || false

        if (!(inTitle || inSummary || inTags || inLocation)) return false
      }

      return true
    })
  }, [erlebnisse, activeTab, suchbegriff])

  // Sortiere die gefilterten Erlebnisse
  const sortedErlebnisse = useMemo(() => {
    if (!filteredErlebnisse) return []

    return [...filteredErlebnisse].sort((a, b) => {
      switch (sortBy) {
        case "datum-neu":
          return (
            new Date(typeof b.datum === "string" ? b.datum.split(".").reverse().join("-") : b.datum).getTime() -
            new Date(typeof a.datum === "string" ? a.datum.split(".").reverse().join("-") : a.datum).getTime()
          )
        case "datum-alt":
          return (
            new Date(typeof a.datum === "string" ? a.datum.split(".").reverse().join("-") : a.datum).getTime() -
            new Date(typeof b.datum === "string" ? b.datum.split(".").reverse().join("-") : b.datum).getTime()
          )
        case "titel-az":
          return a.titel.localeCompare(b.titel)
        case "titel-za":
          return b.titel.localeCompare(a.titel)
        case "beliebtheit":
          return (b.statistik?.likes || 0) - (a.statistik?.likes || 0)
        case "ansichten":
          return (b.statistik?.ansichten || 0) - (a.statistik?.ansichten || 0)
        default:
          return 0
      }
    })
  }, [filteredErlebnisse, sortBy])

  // Filter zurücksetzen
  const resetFilters = () => {
    setFilterOptions({
      kategorien: [],
      tags: [],
      orte: [],
      zeitraum: { von: "", bis: "" },
    })
    setSearchTerm("")
  }

  if (!benutzer) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Benutzer konnte nicht geladen werden.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <div className="relative w-full sm:w-64">
          <Input
            type="search"
            placeholder="Suche in Erlebnissen..."
            value={suchbegriff}
            onChange={(e) => setSuchbegriff(e.target.value)}
            className="pl-8"
          />
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
            className="absolute left-2.5 top-2.5 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={() => setShowFilterDialog(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Sortieren
          </Button>
          {isCurrentUser && (
            <Button size="sm" onClick={() => setIsWizardOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Neues Erlebnis
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="alle" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alle">Alle</TabsTrigger>
          <TabsTrigger value="veröffentlicht">Veröffentlicht</TabsTrigger>
          <TabsTrigger value="entwürfe">Entwürfe</TabsTrigger>
        </TabsList>
        <TabsContent value="alle">
          {sortedErlebnisse.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {sortedErlebnisse.map((erlebnis) => (
                <ErlebnisKarte key={erlebnis.id} erlebnis={erlebnis} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Keine Erlebnisse gefunden.</p>
              {isCurrentUser && (
                <Button onClick={() => setIsWizardOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Neues Erlebnis erstellen
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        <TabsContent value="veröffentlicht">
          {sortedErlebnisse.filter((e) => e.status === "veröffentlicht").length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {sortedErlebnisse
                .filter((e) => e.status === "veröffentlicht")
                .map((erlebnis) => (
                  <ErlebnisKarte key={erlebnis.id} erlebnis={erlebnis} />
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Keine veröffentlichten Erlebnisse gefunden.</p>
              {isCurrentUser && (
                <Button onClick={() => setIsWizardOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Neues Erlebnis erstellen
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        <TabsContent value="entwürfe">
          {sortedErlebnisse.filter((e) => e.status === "entwurf").length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {sortedErlebnisse
                .filter((e) => e.status === "entwurf")
                .map((erlebnis) => (
                  <ErlebnisKarte key={erlebnis.id} erlebnis={erlebnis} />
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Keine Entwürfe gefunden.</p>
              {isCurrentUser && (
                <Button onClick={() => setIsWizardOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Neuen Entwurf erstellen
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ErlebnisWizardModal isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />

      {/* Filter Dialog */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Erlebnisse sortieren</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Sortierung</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sort-datum-neu"
                    checked={sortBy === "datum-neu"}
                    onCheckedChange={() => setSortBy("datum-neu")}
                  />
                  <Label htmlFor="sort-datum-neu">Neueste zuerst</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sort-datum-alt"
                    checked={sortBy === "datum-alt"}
                    onCheckedChange={() => setSortBy("datum-alt")}
                  />
                  <Label htmlFor="sort-datum-alt">Älteste zuerst</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sort-titel-az"
                    checked={sortBy === "titel-az"}
                    onCheckedChange={() => setSortBy("titel-az")}
                  />
                  <Label htmlFor="sort-titel-az">Titel A-Z</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sort-titel-za"
                    checked={sortBy === "titel-za"}
                    onCheckedChange={() => setSortBy("titel-za")}
                  />
                  <Label htmlFor="sort-titel-za">Titel Z-A</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sort-beliebtheit"
                    checked={sortBy === "beliebtheit"}
                    onCheckedChange={() => setSortBy("beliebtheit")}
                  />
                  <Label htmlFor="sort-beliebtheit">Beliebtheit</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sort-ansichten"
                    checked={sortBy === "ansichten"}
                    onCheckedChange={() => setSortBy("ansichten")}
                  />
                  <Label htmlFor="sort-ansichten">Ansichten</Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowFilterDialog(false)}>Anwenden</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
