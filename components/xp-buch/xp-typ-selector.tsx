"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Moon, Zap, Infinity } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export type XPTyp = "erfahrung" | "traum" | "intuition" | "synchronizitaet"

interface XPTypSelectorProps {
  selectedType: XPTyp
  onTypeChange: (type: XPTyp) => void
}

export function XPTypSelector({ selectedType, onTypeChange }: XPTypSelectorProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const getTypeIcon = (type: XPTyp) => {
    switch (type) {
      case "erfahrung":
        return <Sparkles className="h-4 w-4" />
      case "traum":
        return <Moon className="h-4 w-4" />
      case "intuition":
        return <Zap className="h-4 w-4" />
      case "synchronizitaet":
        return <Infinity className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: XPTyp) => {
    switch (type) {
      case "erfahrung":
        return "#6366f1" // indigo-500
      case "traum":
        return "#8b5cf6" // violet-500
      case "intuition":
        return "#ec4899" // pink-500
      case "synchronizitaet":
        return "#14b8a6" // teal-500
    }
  }

  const getTypeDescription = (type: XPTyp) => {
    switch (type) {
      case "erfahrung":
        return "Dokumentiere alltägliche oder besondere Erlebnisse und Erfahrungen."
      case "traum":
        return "Halte deine Träume fest, um Muster und Bedeutungen zu erkennen."
      case "intuition":
        return "Notiere intuitive Eingebungen, Ahnungen oder Bauchgefühle."
      case "synchronizitaet":
        return "Erfasse bedeutungsvolle Zufälle und synchronistische Ereignisse."
    }
  }

  return (
    <div className="mb-6">
      <TooltipProvider>
        <Tabs value={selectedType} onValueChange={(value) => onTypeChange(value as XPTyp)} className="w-full">
          <TabsList className="grid grid-cols-4 mb-2">
            {(["erfahrung", "traum", "intuition", "synchronizitaet"] as const).map((type) => (
              <Tooltip key={type} open={selectedType === type && showTooltip}>
                <TooltipTrigger asChild>
                  <TabsTrigger
                    value={type}
                    className="flex items-center gap-2 relative"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    {getTypeIcon(type)}
                    <span className="capitalize">{type}</span>
                    <div
                      className="w-3 h-3 rounded-full absolute top-1 right-1"
                      style={{ backgroundColor: getTypeColor(type) }}
                    />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="max-w-xs">{getTypeDescription(type)}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TabsList>
        </Tabs>
      </TooltipProvider>
      <p className="text-sm text-muted-foreground">{getTypeDescription(selectedType)}</p>
    </div>
  )
}
