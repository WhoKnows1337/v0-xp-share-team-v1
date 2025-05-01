"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, TrendingUp, Zap } from "lucide-react"

interface MusterTrendsProps {
  erlebnisId: string
  muster?: string[]
  trends?: string[]
  einsichten?: string[]
}

export function MusterTrends({ erlebnisId, muster = [], trends = [], einsichten = [] }: MusterTrendsProps) {
  // Fallback-Daten, falls keine übergeben wurden
  const fallbackMuster = ["Bewusstseinserweiterung", "Spirituelle Transformation", "Außerkörperliche Erfahrung"]

  const fallbackTrends = [
    "Zunehmende Berichte über Astralreisen",
    "Verbindung zu Meditation und Achtsamkeit",
    "Interesse an transpersonaler Psychologie",
  ]

  const fallbackEinsichten = [
    "Verbindung zwischen Traumzuständen und Bewusstseinserweiterung",
    "Ähnlichkeiten zu schamanischen Reisen",
    "Potenzial für persönliches Wachstum",
  ]

  // Verwende übergebene Daten oder Fallbacks
  const anzuzeigendeMuster = muster?.length > 0 ? muster : fallbackMuster
  const anzuzeigendeTrends = trends?.length > 0 ? trends : fallbackTrends
  const anzuzeigendeEinsichten = einsichten?.length > 0 ? einsichten : fallbackEinsichten

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Zap className="h-5 w-5 mr-2 text-yellow-500" />
          KI-Muster & Trends
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium flex items-center mb-2">
            <Lightbulb className="h-4 w-4 mr-1.5 text-yellow-500" />
            Erkannte Muster
          </h3>
          <div className="flex flex-wrap gap-2">
            {anzuzeigendeMuster.map((muster, index) => (
              <Badge key={index} variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                {muster}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium flex items-center mb-2">
            <TrendingUp className="h-4 w-4 mr-1.5 text-blue-500" />
            Aktuelle Trends
          </h3>
          <div className="flex flex-wrap gap-2">
            {anzuzeigendeTrends.map((trend, index) => (
              <Badge key={index} variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">
                {trend}
              </Badge>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <h3 className="text-sm font-medium mb-2">KI-Einsichten</h3>
          <ul className="text-xs text-gray-500 space-y-1 list-disc pl-4">
            {anzuzeigendeEinsichten.map((einsicht, index) => (
              <li key={index}>{einsicht}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
