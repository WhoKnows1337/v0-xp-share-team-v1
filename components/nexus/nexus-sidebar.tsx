"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Search, Zap, Filter, Bot, Play, Pause, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface NexusSidebarProps {
  activeFilters: string[]
  onAddFilter: (filter: string) => void
  onRemoveFilter: (filter: string) => void
}

export function NexusSidebar({ activeFilters, onAddFilter, onRemoveFilter }: NexusSidebarProps) {
  const [radarActive, setRadarActive] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [agents, setAgents] = useState<Array<{ id: string; name: string; color: string; active: boolean }>>([
    { id: "1", name: "Traum-Agent", color: "cyan", active: true },
    { id: "2", name: "Berlin-Events", color: "magenta", active: false },
  ])

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
                  {filter}
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
          </div>
        </div>

        <Separator />

        {/* Filter Drawer */}
        <Accordion type="single" collapsible className="w-full">
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
                  <Input id="category" placeholder="Kategorie wählen..." className="bg-gray-900 border-gray-700" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Datum</Label>
                  <Input id="date" type="date" className="bg-gray-900 border-gray-700" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="geo">GEO-Radius (km)</Label>
                  <Input id="geo" type="number" placeholder="50" className="bg-gray-900 border-gray-700" />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="advanced">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center">
                <Search className="mr-2 h-4 w-4" />
                Erweiterte Filter
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="intensity">Intensität</Label>
                  <Input id="intensity" type="range" min="1" max="10" className="bg-gray-900 border-gray-700" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mood">Stimmung</Label>
                  <Input id="mood" placeholder="Stimmung wählen..." className="bg-gray-900 border-gray-700" />
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="verified" />
                  <Label htmlFor="verified">Nur verifizierte XPs</Label>
                </div>
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
              Agents
            </h3>
            <Button variant="outline" size="sm" className="h-8 px-2">
              <Plus className="h-4 w-4" />
              <span className="ml-1">Neu</span>
            </Button>
          </div>

          <div className="space-y-2">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between p-2 bg-gray-800 rounded-md">
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
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
