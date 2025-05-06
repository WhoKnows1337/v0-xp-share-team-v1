"use client"

import { useState } from "react"
import { Bot, Clock, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

interface NexusAgentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (agent: any) => void
  existingAgent?: any
}

export function NexusAgentDialog({ open, onOpenChange, onSave, existingAgent }: NexusAgentDialogProps) {
  const { toast } = useToast()
  const [name, setName] = useState(existingAgent?.name || "")
  const [description, setDescription] = useState(existingAgent?.description || "")
  const [query, setQuery] = useState(existingAgent?.query || "")
  const [schedule, setSchedule] = useState(existingAgent?.schedule || "täglich")
  const [notifyOnResults, setNotifyOnResults] = useState(existingAgent?.notifyOnResults || true)
  const [activeFilters, setActiveFilters] = useState<string[]>(existingAgent?.filters || [])
  const [newFilter, setNewFilter] = useState("")

  const handleAddFilter = () => {
    if (newFilter && !activeFilters.includes(newFilter)) {
      setActiveFilters([...activeFilters, newFilter])
      setNewFilter("")
    }
  }

  const handleRemoveFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))
  }

  const handleSave = () => {
    if (!name) {
      toast({
        title: "Fehler",
        description: "Bitte gib einen Namen für den Agenten ein.",
        variant: "destructive",
      })
      return
    }

    if (!query && activeFilters.length === 0) {
      toast({
        title: "Fehler",
        description: "Bitte gib eine Suchabfrage oder mindestens einen Filter ein.",
        variant: "destructive",
      })
      return
    }

    const agent = {
      id: existingAgent?.id || `agent-${Date.now()}`,
      name,
      description,
      query,
      filters: activeFilters,
      schedule,
      notifyOnResults,
      color: existingAgent?.color || (Math.random() > 0.5 ? "cyan" : "magenta"),
      active: existingAgent?.active !== undefined ? existingAgent.active : true,
      createdAt: existingAgent?.createdAt || new Date().toISOString(),
      lastRun: existingAgent?.lastRun,
      results: existingAgent?.results,
    }

    onSave(agent)
    onOpenChange(false)

    toast({
      title: existingAgent ? "Agent aktualisiert" : "Agent erstellt",
      description: existingAgent
        ? `Der Agent "${name}" wurde erfolgreich aktualisiert.`
        : `Der Agent "${name}" wurde erfolgreich erstellt.`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Bot className="mr-2 h-5 w-5" />
            {existingAgent ? "Agent bearbeiten" : "Neuen Agenten erstellen"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="agent-name">Name</Label>
            <Input
              id="agent-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Traum-Monitor"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="agent-description">Beschreibung (optional)</Label>
            <Textarea
              id="agent-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beschreibe den Zweck dieses Agenten..."
              rows={2}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="agent-query">Suchabfrage</Label>
            <Input
              id="agent-query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="z.B. luzide träume berlin"
            />
          </div>

          <div className="grid gap-2">
            <Label>Filter</Label>
            <div className="flex gap-2">
              <Input
                value={newFilter}
                onChange={(e) => setNewFilter(e.target.value)}
                placeholder="Filter hinzufügen..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddFilter()
                  }
                }}
              />
              <Button type="button" onClick={handleAddFilter} variant="outline">
                +
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {activeFilters.map((filter) => (
                <Badge key={filter} variant="secondary" className="cursor-pointer">
                  {filter}
                  <X
                    className="ml-1 h-3 w-3"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFilter(filter)
                    }}
                  />
                </Badge>
              ))}
              {activeFilters.length === 0 && (
                <span className="text-sm text-muted-foreground">Keine Filter ausgewählt</span>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="agent-schedule">Zeitplan</Label>
            <Select value={schedule} onValueChange={setSchedule}>
              <SelectTrigger id="agent-schedule" className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Zeitplan wählen..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stündlich">Stündlich</SelectItem>
                <SelectItem value="täglich">Täglich</SelectItem>
                <SelectItem value="wöchentlich">Wöchentlich</SelectItem>
                <SelectItem value="monatlich">Monatlich</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="notify-on-results" checked={notifyOnResults} onCheckedChange={setNotifyOnResults} />
            <Label htmlFor="notify-on-results">Bei neuen Ergebnissen benachrichtigen</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSave} className="flex items-center">
            <Save className="mr-2 h-4 w-4" />
            {existingAgent ? "Aktualisieren" : "Erstellen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
