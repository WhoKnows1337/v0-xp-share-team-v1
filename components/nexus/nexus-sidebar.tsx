"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Zap, Filter, Bot, Play, Pause, Trash2, Save, Clock, MapPin, Sliders } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { NexusAgentDialog } from "./nexus-agent-dialog"
import { useToast } from "@/components/ui/use-toast"

interface NexusSidebarProps {
  activeFilters: string[]
  onAddFilter: (filter: string) => void
  onRemoveFilter: (filter: string) => void
  onApplyAdvancedFilters?: (filters: any) => void
  onSaveSearch?: (search: any) => void
}

export function NexusSidebar({
  activeFilters,
  onAddFilter,
  onRemoveFilter,
  onApplyAdvancedFilters,
  onSaveSearch,
}: NexusSidebarProps) {
  const [radarActive, setRadarActive] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [agents, setAgents] = useState<
    Array<{
      id: string
      name: string
      color: string
      active: boolean
      schedule: string
      lastRun?: string
      results?: number
    }>
  >([
    {
      id: "1",
      name: "Traum-Agent",
      color: "cyan",
      active: true,
      schedule: "Täglich",
      lastRun: "Heute, 08:30",
      results: 3,
    },
    { id: "2", name: "Berlin-Events", color: "magenta", active: false, schedule: "Stündlich" },
  ])
  const [savedSearches, setSavedSearches] = useState<
    Array<{ id: string; name: string; query: string; filters: string[]; date: string }>
  >([
    {
      id: "1",
      name: "Luzide Träume in Tokyo",
      query: "luzide träume tokyo",
      filters: ["verifiziert"],
      date: "15.05.2023",
    },
    { id: "2", name: "Synchronizitäten 2023", query: "synchronizität", filters: ["2023"], date: "22.06.2023" },
  ])

  // Neue Zustände für erweiterte Filter
  const [intensity, setIntensity] = useState([5])
  const [mood, setMood] = useState("")
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [category, setCategory] = useState("")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [geoRadius, setGeoRadius] = useState("50")
  const [newAgentName, setNewAgentName] = useState("")
  const [newAgentQuery, setNewAgentQuery] = useState("")
  const [newAgentSchedule, setNewAgentSchedule] = useState("Täglich")
  const [newSearchName, setNewSearchName] = useState("")
  const [showSavedSearches, setShowSavedSearches] = useState(false)
  const [activeAccordion, setActiveAccordion] = useState<string | undefined>("basics")
  const [agentDialogOpen, setAgentDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleAiPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (aiPrompt.trim()) {
      onAddFilter(aiPrompt.trim())
      setAiPrompt("")
    }
  }

  const toggleAgent = (id: string) => {
    setAgents(agents.map((agent) => (agent.id === id ? { ...agent, active: !agent.active } : agent)))
  }

  const deleteAgent = (id: string) => {
    setAgents(agents.filter((agent) => agent.id !== id))
  }

  const createNewAgent = () => {
    if (newAgentName && newAgentQuery) {
      const newAgent = {
        id: `agent-${Date.now()}`,
        name: newAgentName,
        query: newAgentQuery,
        color: Math.random() > 0.5 ? "cyan" : "magenta",
        active: true,
        schedule: newAgentSchedule,
      }
      setAgents([...agents, newAgent])
      setNewAgentName("")
      setNewAgentQuery("")
    }
  }

  const saveSearch = () => {
    if (newSearchName) {
      const newSearch = {
        id: `search-${Date.now()}`,
        name: newSearchName,
        query: activeFilters.join(" "),
        filters: [...activeFilters],
        date: new Date().toLocaleDateString("de-DE"),
      }
      setSavedSearches([...savedSearches, newSearch])
      setNewSearchName("")
      toast({
        title: "Suche gespeichert",
        description: `Die Suche "${newSearchName}" wurde erfolgreich gespeichert.`,
      })
      if (onSaveSearch) {
        onSaveSearch(newSearch)
      }
    }
  }

  const applyAdvancedFilters = () => {
    const filters = {
      intensity: intensity[0],
      mood,
      verifiedOnly,
      category,
      dateRange,
      geoRadius: Number.parseInt(geoRadius),
    }

    if (onApplyAdvancedFilters) {
      onApplyAdvancedFilters(filters)
    }

    // Füge relevante Filter zur aktiven Filterliste hinzu
    if (category) onAddFilter(`kategorie:${category}`)
    if (verifiedOnly) onAddFilter("verifiziert:true")
    if (mood) onAddFilter(`stimmung:${mood}`)
    if (dateRange.start) onAddFilter(`von:${dateRange.start}`)
    if (dateRange.end) onAddFilter(`bis:${dateRange.end}`)
  }

  const loadSavedSearch = (search: (typeof savedSearches)[0]) => {
    // Entferne zuerst alle aktiven Filter
    activeFilters.forEach((filter) => onRemoveFilter(filter))

    // Füge dann die gespeicherten Filter hinzu
    search.filters.forEach((filter) => onAddFilter(filter))
  }

  const handleSaveAgent = (agent: any) => {
    setAgents([...agents, agent])
    toast({
      title: "Agent erstellt",
      description: `Der Agent "${agent.name}" wurde erfolgreich erstellt und ist jetzt aktiv.`,
    })
  }

  return (
    <div className="w-[300px] border-r border-gray-800 flex flex-col h-full overflow-hidden">
      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        {/* Builder / Advanced Query */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Builder</h3>
            <Badge variant="outline" className="text-xs bg-gray-800">
              37 Treffer • 4 Mana/Scan
            </Badge>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 cursor-pointer">AND</Badge>
              <Badge className="bg-pink-500/20 text-pink-400 hover:bg-pink-500/30 cursor-pointer">OR</Badge>
              <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 cursor-pointer">NOT</Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <Badge
                  key={filter}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => onRemoveFilter(filter)}
                >
                  {filter} ×
                </Badge>
              ))}
            </div>
          </div>

          <form onSubmit={handleAiPromptSubmit} className="mb-4">
            <div className="relative">
              <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="AI-Prompt eingeben..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700"
              />
            </div>
          </form>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch id="radar-mode" checked={radarActive} onCheckedChange={setRadarActive} />
              <Label htmlFor="radar-mode">Radar-Modus</Label>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-1" />
                  Speichern
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Suche speichern</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="search-name">Name der Suche</Label>
                    <Input
                      id="search-name"
                      value={newSearchName}
                      onChange={(e) => setNewSearchName(e.target.value)}
                      placeholder="z.B. Luzide Träume in Berlin"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Aktive Filter</Label>
                    <div className="p-2 border rounded-md bg-gray-800">
                      {activeFilters.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {activeFilters.map((filter) => (
                            <Badge key={filter} variant="secondary">
                              {filter}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">Keine Filter aktiv</p>
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={saveSearch} disabled={!newSearchName}>
                    Speichern
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Separator />

        {/* Gespeicherte Suchen */}
        <div>
          <div
            className="flex items-center justify-between mb-2 cursor-pointer"
            onClick={() => setShowSavedSearches(!showSavedSearches)}
          >
            <h3 className="text-sm font-medium flex items-center">
              <Save className="h-4 w-4 mr-2" />
              Gespeicherte Suchen
            </h3>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              {showSavedSearches ? "-" : "+"}
            </Button>
          </div>

          {showSavedSearches && (
            <div className="space-y-2 mb-4">
              {savedSearches.map((search) => (
                <div
                  key={search.id}
                  className="p-2 bg-gray-800 rounded-md cursor-pointer hover:bg-gray-700"
                  onClick={() => loadSavedSearch(search)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{search.name}</span>
                    <span className="text-xs text-gray-400">{search.date}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-1">{search.query}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Filter Drawer */}
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={activeAccordion}
          onValueChange={setActiveAccordion}
        >
          <AccordionItem value="basics">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Basis-Filter
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategorie</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category" className="bg-gray-900 border-gray-700">
                      <SelectValue placeholder="Kategorie wählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="traum">Traum</SelectItem>
                      <SelectItem value="synchronizitaet">Synchronizität</SelectItem>
                      <SelectItem value="meditation">Meditation</SelectItem>
                      <SelectItem value="deja-vu">Déjà-vu</SelectItem>
                      <SelectItem value="intuition">Intuition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-start">Von</Label>
                  <Input
                    id="date-start"
                    type="date"
                    className="bg-gray-900 border-gray-700"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-end">Bis</Label>
                  <Input
                    id="date-end"
                    type="date"
                    className="bg-gray-900 border-gray-700"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="geo">GEO-Radius (km)</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="geo"
                      type="number"
                      placeholder="50"
                      className="bg-gray-900 border-gray-700"
                      value={geoRadius}
                      onChange={(e) => setGeoRadius(e.target.value)}
                    />
                    <MapPin className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="advanced">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center">
                <Sliders className="mr-2 h-4 w-4" />
                Erweiterte Filter
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="intensity">Intensität</Label>
                    <span className="text-sm text-gray-400">{intensity[0]}/10</span>
                  </div>
                  <Slider
                    id="intensity"
                    min={1}
                    max={10}
                    step={1}
                    value={intensity}
                    onValueChange={setIntensity}
                    className="py-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mood">Stimmung</Label>
                  <Select value={mood} onValueChange={setMood}>
                    <SelectTrigger id="mood" className="bg-gray-900 border-gray-700">
                      <SelectValue placeholder="Stimmung wählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="positiv">Positiv</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="negativ">Negativ</SelectItem>
                      <SelectItem value="ehrfuerchtig">Ehrfürchtig</SelectItem>
                      <SelectItem value="verwirrend">Verwirrend</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="verified"
                    checked={verifiedOnly}
                    onCheckedChange={(checked) => setVerifiedOnly(checked as boolean)}
                  />
                  <Label htmlFor="verified">Nur verifizierte XPs</Label>
                </div>

                <Button onClick={applyAdvancedFilters} className="w-full mt-2">
                  Filter anwenden
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Separator />

        {/* Agents Manager */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium flex items-center">
              <Bot className="mr-2 h-4 w-4" />
              Agenten
            </h3>

            <NexusAgentDialog open={agentDialogOpen} onOpenChange={setAgentDialogOpen} onSave={handleSaveAgent} />
            <Button variant="outline" size="sm" className="h-8 px-2" onClick={() => setAgentDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              <span className="ml-1">Neu</span>
            </Button>
          </div>

          <div className="space-y-2">
            {agents.map((agent) => (
              <div key={agent.id} className="p-2 bg-gray-800 rounded-md">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div
                      className={`h-3 w-3 rounded-full mr-2 ${
                        agent.color === "cyan"
                          ? "bg-cyan-400"
                          : agent.color === "magenta"
                            ? "bg-pink-400"
                            : "bg-yellow-400"
                      }`}
                    />
                    <span>{agent.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleAgent(agent.id)}>
                      {agent.active ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-400"
                      onClick={() => deleteAgent(agent.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Erweiterte Agent-Informationen */}
                <div className="text-xs text-gray-400 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{agent.schedule}</span>

                  {agent.lastRun && (
                    <>
                      <span className="mx-1">•</span>
                      <span>Letzter Lauf: {agent.lastRun}</span>
                    </>
                  )}

                  {agent.results !== undefined && (
                    <>
                      <span className="mx-1">•</span>
                      <Badge variant="outline" className="text-[10px] h-4 px-1">
                        {agent.results} neue
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
