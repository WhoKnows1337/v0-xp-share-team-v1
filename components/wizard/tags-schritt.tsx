"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ErlebnisData } from "../erlebnis-wizard"
import { Badge } from "@/components/ui/badge"
import { X, Hash, Sparkles } from "lucide-react"

interface TagsSchrittProps {
  data: ErlebnisData
  updateData: (data: Partial<ErlebnisData>) => void
}

// Beispiel-Tags für Autovervollständigung
const suggestedTags = [
  "luzid",
  "fliegend",
  "lichtwesen",
  "angst",
  "freude",
  "tunnel",
  "licht",
  "ausserkoerperlich",
  "zeitreise",
  "begegnung",
  "stimmen",
  "musik",
  "paralysiert",
  "schweben",
  "fallen",
  "verfolgung",
  "wasser",
  "feuer",
  "familie",
  "verstorbene",
  "tiere",
  "natur",
  "stadt",
  "technologie",
]

export function TagsSchritt({ data, updateData }: TagsSchrittProps) {
  const [inputValue, setInputValue] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    if (value.trim()) {
      // Filtere Vorschläge basierend auf Eingabe
      const filtered = suggestedTags.filter(
        (tag) => tag.toLowerCase().includes(value.toLowerCase()) && !data.tags.includes(tag),
      )
      setSuggestions(filtered.slice(0, 5)) // Begrenze auf 5 Vorschläge
    } else {
      setSuggestions([])
    }
  }

  const addTag = (tag: string) => {
    if (tag.trim() && !data.tags.includes(tag.trim())) {
      updateData({ tags: [...data.tags, tag.trim()] })
    }
    setInputValue("")
    setSuggestions([])
  }

  const removeTag = (tagToRemove: string) => {
    updateData({ tags: data.tags.filter((tag) => tag !== tagToRemove) })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag(inputValue)
    }
  }

  // Simuliere KI-Analyse basierend auf Beschreibung und Titel
  useEffect(() => {
    if (data.beschreibung && data.beschreibung.length > 20) {
      setIsAnalyzing(true)

      // Simuliere API-Aufruf mit Verzögerung
      const timer = setTimeout(() => {
        // Einfache Simulation der KI-Tag-Erkennung
        const text = (data.titel + " " + data.beschreibung).toLowerCase()
        const kiTags: string[] = []

        // Einfache Keyword-Erkennung
        if (text.includes("traum") || text.includes("schlaf") || text.includes("bett")) {
          kiTags.push("traumzustand")
        }
        if (text.includes("licht") || text.includes("hell") || text.includes("strahlen")) {
          kiTags.push("lichtphänomen")
        }
        if (text.includes("angst") || text.includes("furcht") || text.includes("panik")) {
          kiTags.push("angsterfahrung")
        }
        if (text.includes("schweben") || text.includes("fliegen") || text.includes("leicht")) {
          kiTags.push("schwebeerlebnis")
        }
        if (text.includes("stimme") || text.includes("sprach") || text.includes("hören")) {
          kiTags.push("auditive-wahrnehmung")
        }

        // Füge zufällige Tags hinzu, wenn keine gefunden wurden
        if (kiTags.length === 0) {
          const randomTags = ["bewusstseinsveränderung", "zeitanomalie", "energiewahrnehmung", "symbolische-begegnung"]
          kiTags.push(...randomTags.slice(0, 2))
        }

        updateData({ kiTags })
        setIsAnalyzing(false)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [data.beschreibung, data.titel])

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold mb-2">Füge Tags hinzu</h3>
        <p className="text-gray-300 mb-4">
          Tags sind Schlagwörter, die dein Erlebnis charakterisieren und anderen helfen, ähnliche Erfahrungen zu finden.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (Schlagwörter)</Label>
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="tags"
            placeholder="Tag eingeben und Enter drücken (z.B. luzid, lichtwesen, angst)"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="pl-10 bg-white/5 border-white/20 text-white"
          />
        </div>

        {/* Tag-Vorschläge */}
        {suggestions.length > 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-md mt-1 p-2">
            <p className="text-xs text-gray-400 mb-1">Vorschläge:</p>
            <div className="flex flex-wrap gap-1">
              {suggestions.map((suggestion) => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className="cursor-pointer bg-primary/10 hover:bg-primary/20 text-white border-primary/30 flex items-center"
                  onClick={() => addTag(suggestion)}
                >
                  {suggestion}
                  <X
                    className="ml-1 h-3 w-3 hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSuggestions(suggestions.filter((s) => s !== suggestion))
                    }}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Anzeige der hinzugefügten Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {data.tags.length === 0 ? (
            <p className="text-sm text-gray-400">Noch keine Tags hinzugefügt</p>
          ) : (
            data.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-primary/20 hover:bg-primary/30 text-white">
                {tag}
                <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
              </Badge>
            ))
          )}
        </div>
      </div>

      {/* KI-erkannte Tags */}
      <div className="space-y-2 mt-6">
        <div className="flex items-center">
          <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
          <Label className="text-purple-300">KI-erkannte Tags</Label>
        </div>

        <div className="flex flex-wrap gap-2 mt-2 p-3 bg-purple-900/20 border border-purple-800/30 rounded-md">
          {isAnalyzing ? (
            <div className="flex items-center text-sm text-purple-300">
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
              KI analysiert deine Beschreibung...
            </div>
          ) : data.kiTags && data.kiTags.length > 0 ? (
            data.kiTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-purple-900/40 text-purple-200 border-purple-700/50">
                {tag}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-purple-300">
              {data.beschreibung && data.beschreibung.length > 0
                ? "Füge eine längere Beschreibung hinzu, damit die KI Tags erkennen kann"
                : "Füge eine Beschreibung hinzu, damit die KI Tags erkennen kann"}
            </p>
          )}
        </div>
        <p className="text-xs text-purple-300/70">
          Diese Tags werden automatisch aus deiner Beschreibung erkannt und helfen bei der Kategorisierung.
        </p>
      </div>

      <div className="bg-blue-900/30 p-4 rounded-md border border-blue-800/50 mt-6">
        <h4 className="font-medium mb-2">Tipp</h4>
        <p className="text-sm text-gray-300">
          Gute Tags sind kurz und präzise. Füge Tags hinzu, die die wichtigsten Aspekte deines Erlebnisses beschreiben,
          wie Gefühle, Symbole oder Phänomene. Beispiele: #luzid, #lichtwesen, #angst, #schweben
        </p>
      </div>
    </div>
  )
}
