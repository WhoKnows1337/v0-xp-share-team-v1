"use client"

import { User, Calendar, MapPin, Brain, Activity, Lightbulb, Users, Layers } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface KIAnalyseProps {
  erlebnis: any
}

export function KIAnalyse({ erlebnis }: KIAnalyseProps) {
  // Extrahiere Daten aus dem Erlebnis-Objekt
  const autor = typeof erlebnis.autor === "object" ? erlebnis.autor.name || erlebnis.autor.username : erlebnis.autor
  const datum = typeof erlebnis.datum === "string" ? erlebnis.datum : "Unbekannt"
  const ort = typeof erlebnis.ort === "object" ? erlebnis.ort.name : erlebnis.ort || "Unbekannt"
  const tags = Array.isArray(erlebnis.tags) ? erlebnis.tags.slice(0, 4) : []

  // Emotionale Signatur (Beispieldaten, falls nicht vorhanden)
  const emotionen = erlebnis.emotionen || [
    { name: "Ruhe", wert: 85 },
    { name: "Ehrfurcht", wert: 72 },
    { name: "Neugier", wert: 65 },
    { name: "Freude", wert: 58 },
  ]

  // Bewusstseinszustand
  const bewusstseinszustand = erlebnis.bewusstseinszustand || {
    zustand: "Erweitert",
    transformationspotenzial: "Hoch",
    beschreibung: "Jenseits des normalen Wachbewusstseins, mit erhöhter Wahrnehmung und reduzierter Ich-Grenze",
  }

  // Erkannte Muster
  const muster = erlebnis.muster || [
    { name: "Meditation als Auslöser", übereinstimmung: 78 },
    { name: "Gefühl des Schwebens", übereinstimmung: 65 },
    { name: "Zeitlosigkeit", übereinstimmung: 52 },
  ]

  // Ähnlichkeitscluster
  const ähnlichkeitscluster = erlebnis.ähnlichkeitscluster || {
    name: "Außerkörperliche Erfahrungen während Meditation",
    anzahlErlebnisse: 124,
    resonanz: "Stark",
  }

  // Hauptthemen
  const hauptthemen = erlebnis.hauptthemen || [
    "Bewusstseinserweiterung",
    "Spirituelle Verbindung",
    "Selbsttransformation",
  ]

  // Empfehlungen
  const empfehlungen = erlebnis.empfehlungen || [
    "Geführte Meditationen zur Vertiefung der Erfahrung",
    "Journaling zur Integration der Erfahrung",
    "Austausch mit ähnlich Erfahrenen",
  ]

  return (
    <div className="bg-gray-900 rounded-lg p-4 text-white">
      <div className="flex items-center mb-4">
        <div className="bg-blue-500 rounded-full p-1 mr-2">
          <Brain className="h-4 w-4 text-white" />
        </div>
        <h3 className="text-lg font-semibold">KI-Analyse</h3>
      </div>

      {/* Grundlegende Informationen */}
      <div className="mb-6">
        <h4 className="text-sm text-gray-400 mb-3">Grundlegende Informationen</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 opacity-70" />
            <span>{autor}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 opacity-70" />
            <span>{datum}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 opacity-70" />
            <span>{ort}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-gray-800 border-gray-700 text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Emotionale Signatur */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Activity className="h-4 w-4 mr-2 text-blue-400" />
          <h4 className="text-sm text-gray-400">Emotionale Signatur</h4>
        </div>
        <div className="space-y-3">
          {emotionen.map((emotion, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{emotion.name}</span>
                <span>{emotion.wert}%</span>
              </div>
              <Progress value={emotion.wert} className="h-1.5" indicatorClassName="bg-blue-500" />
            </div>
          ))}
        </div>
      </div>

      {/* Bewusstseinszustand */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Lightbulb className="h-4 w-4 mr-2 text-blue-400" />
          <h4 className="text-sm text-gray-400">Bewusstseinszustand</h4>
        </div>
        <div className="bg-gray-800 rounded p-3">
          <div className="flex justify-between mb-2">
            <span className="font-medium">{bewusstseinszustand.zustand}</span>
            <span className="text-xs text-blue-300">
              Transformationspotenzial: {bewusstseinszustand.transformationspotenzial}
            </span>
          </div>
          <p className="text-xs text-gray-400">{bewusstseinszustand.beschreibung}</p>
        </div>
      </div>

      {/* Erkannte Muster */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Layers className="h-4 w-4 mr-2 text-blue-400" />
          <h4 className="text-sm text-gray-400">Erkannte Muster</h4>
        </div>
        <div className="space-y-3">
          {muster.map((m, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{m.name}</span>
                <span>{m.übereinstimmung}% Übereinstimmung</span>
              </div>
              <Progress value={m.übereinstimmung} className="h-1.5" indicatorClassName="bg-blue-500" />
            </div>
          ))}
        </div>
      </div>

      {/* Ähnlichkeitscluster */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Users className="h-4 w-4 mr-2 text-blue-400" />
          <h4 className="text-sm text-gray-400">Ähnlichkeitscluster</h4>
        </div>
        <div className="bg-gray-800 rounded p-3">
          <div className="flex justify-between mb-1">
            <span className="text-sm">{ähnlichkeitscluster.name}</span>
            <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full">
              {ähnlichkeitscluster.anzahlErlebnisse} Erlebnisse
            </span>
          </div>
          <div className="text-xs text-gray-400">Kollektive Resonanz: {ähnlichkeitscluster.resonanz}</div>
        </div>
      </div>

      {/* Hauptthemen */}
      <div className="mb-6">
        <h4 className="text-sm text-gray-400 mb-2">Hauptthemen</h4>
        <div className="flex flex-wrap gap-2">
          {hauptthemen.map((thema, index) => (
            <Badge key={index} className="bg-gray-800 hover:bg-gray-700">
              {thema}
            </Badge>
          ))}
        </div>
      </div>

      {/* Empfehlungen */}
      <div>
        <h4 className="text-sm text-gray-400 mb-2">Empfehlungen</h4>
        <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
          {empfehlungen.map((empfehlung, index) => (
            <li key={index}>{empfehlung}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
