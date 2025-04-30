"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ErlebnisData } from "../erlebnis-wizard"
import { MapPin } from "lucide-react"
import { InteractiveMap } from "../map/interactive-map"

interface OrtSchrittProps {
  data: ErlebnisData
  updateData: (data: Partial<ErlebnisData>) => void
}

export function OrtSchritt({ data, updateData }: OrtSchrittProps) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)

  // Funktion zum Verarbeiten der Standortauswahl
  const handleLocationSelect = (location: { coordinates: { lat: number; lng: number }; address: string }) => {
    // Prüfe, ob sich die Adresse tatsächlich geändert hat, um unnötige Updates zu vermeiden
    if (data.ort !== location.address) {
      // Aktualisiere den Ort im Formular
      updateData({ ort: location.address })

      // Speichere die Koordinaten (in einer echten Implementierung)
      // updateData({ koordinaten: location.coordinates });

      // Zeige Erfolgsmeldung
      setSelectedAddress(location.address)
      setShowSuccessMessage(true)

      // Blende die Erfolgsmeldung nach 3 Sekunden aus
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold mb-2">Wo fand dein Erlebnis statt?</h3>
        <p className="text-gray-300 mb-4">
          Gib den Ort an, an dem du diese Erfahrung gemacht hast. Falls der Ort nicht relevant ist (z.B. bei Träumen)
          oder du ihn nicht angeben möchtest, kannst du dieses Feld leer lassen.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ort">Ort (optional)</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="ort"
            placeholder="z.B. Berlin, Deutschland oder 'zu Hause'"
            value={data.ort}
            onChange={(e) => updateData({ ort: e.target.value })}
            className="pl-10 bg-white/5 border-white/20 text-white"
            aria-describedby="ort-hint"
          />
        </div>
        <p id="ort-hint" className="text-xs text-gray-400">
          Du kannst eine Adresse eingeben oder einen Ort auf der Karte auswählen.
        </p>
      </div>

      {/* Erfolgsmeldung bei Standortauswahl */}
      {showSuccessMessage && selectedAddress && (
        <div className="bg-green-900/30 border border-green-800/50 rounded-md p-3 flex items-center animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="bg-green-500/20 rounded-full p-1 mr-3">
            <MapPin className="h-4 w-4 text-green-400" />
          </div>
          <div>
            <p className="text-green-300 font-medium">Standort ausgewählt!</p>
            <p className="text-sm text-green-200/80">{selectedAddress}</p>
          </div>
        </div>
      )}

      <div className="mt-6 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        <div className="p-4 bg-slate-700 text-white">
          <h4 className="font-medium">Kartenansicht</h4>
          <p className="text-sm text-gray-300">
            Wähle einen Punkt auf der Karte aus oder nutze deinen aktuellen Standort.
          </p>
        </div>
        <div className="p-4">
          <InteractiveMap onLocationSelect={handleLocationSelect} height="350px" />
        </div>
      </div>

      <div className="bg-blue-900/30 p-4 rounded-md border border-blue-800/50 mt-6">
        <h4 className="font-medium mb-2">Tipp</h4>
        <p className="text-sm text-gray-300">
          Der Ort kann helfen, geografische Muster in ähnlichen Erlebnissen zu erkennen. Du kannst eine Stadt, ein Land
          oder eine allgemeine Beschreibung wie "im Wald" angeben.
        </p>
      </div>
    </div>
  )
}
