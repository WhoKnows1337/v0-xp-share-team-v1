"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { MapPin, X } from "lucide-react"

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

interface OrtFilterProps {
  onOrtFilterChange: (ort: string | null, umkreis: number) => void
}

export function OrtFilter({ onOrtFilterChange }: OrtFilterProps) {
  const [ortInput, setOrtInput] = useState("")
  const [selectedOrt, setSelectedOrt] = useState<string | null>(null)
  const [umkreis, setUmkreis] = useState<number>(50)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])

  // Filtern der Vorschläge basierend auf der Eingabe
  useEffect(() => {
    if (ortInput.length > 0) {
      const filtered = ortsSuggestions.filter((ort) => ort.toLowerCase().includes(ortInput.toLowerCase()))
      setFilteredSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setFilteredSuggestions([])
      setShowSuggestions(false)
    }
  }, [ortInput])

  // Ort auswählen
  const handleSelectOrt = (ort: string) => {
    setSelectedOrt(ort)
    setOrtInput("")
    setShowSuggestions(false)
    onOrtFilterChange(ort, umkreis)
  }

  // Ort zurücksetzen
  const handleResetOrt = () => {
    setSelectedOrt(null)
    setOrtInput("")
    setUmkreis(50)
    onOrtFilterChange(null, 50)
  }

  // Umkreis ändern
  const handleUmkreisChange = (value: number[]) => {
    const newUmkreis = value[0]
    setUmkreis(newUmkreis)
    if (selectedOrt) {
      onOrtFilterChange(selectedOrt, newUmkreis)
    }
  }

  // Filter anwenden
  const handleApplyFilter = () => {
    if (ortInput.trim()) {
      setSelectedOrt(ortInput)
      onOrtFilterChange(ortInput, umkreis)
      setShowSuggestions(false)
    }
  }

  return (
    <Card className="bg-slate-800/50 rounded-lg border border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Ortsfilter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedOrt ? (
          <div className="flex items-center justify-between bg-slate-700 p-2 rounded-md">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-blue-400" />
              <span>{selectedOrt}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleResetOrt}>
              <X className="h-4 w-4" />
              <span className="sr-only">Ort zurücksetzen</span>
            </Button>
          </div>
        ) : (
          <div className="relative">
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="Ort eingeben..."
                value={ortInput}
                onChange={(e) => setOrtInput(e.target.value)}
                className="bg-slate-700 border-slate-600"
              />
              <Button variant="outline" size="sm" className="ml-2 whitespace-nowrap" onClick={handleApplyFilter}>
                Anwenden
              </Button>
            </div>
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-slate-600 cursor-pointer flex items-center"
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
            <span className="text-sm">Umkreis: {umkreis} km</span>
          </div>
          <Slider
            defaultValue={[50]}
            min={5}
            max={200}
            step={5}
            value={[umkreis]}
            onValueChange={handleUmkreisChange}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>5 km</span>
            <span>200 km</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
