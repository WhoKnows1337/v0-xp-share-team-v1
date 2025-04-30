"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, MapPin } from "lucide-react"

export function WorldMapHeatmap() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null)

  // Simulierte Daten für die Heatmap
  const regions = [
    { id: "europe", name: "Europa", count: 845, x: 48, y: 25, radius: 18 },
    { id: "namerica", name: "Nordamerika", count: 720, x: 22, y: 28, radius: 16 },
    { id: "asia", name: "Asien", count: 580, x: 70, y: 30, radius: 14 },
    { id: "samerica", name: "Südamerika", count: 320, x: 30, y: 55, radius: 12 },
    { id: "africa", name: "Afrika", count: 210, x: 50, y: 45, radius: 10 },
    { id: "australia", name: "Australien", count: 170, x: 82, y: 60, radius: 8 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="mr-2 h-5 w-5 text-blue-500" />
          Weltweite Erlebnisverteilung
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-[2/1] bg-muted rounded-md overflow-hidden">
          {/* Vereinfachte Weltkarte als Hintergrund */}
          <div className="absolute inset-0 bg-[url('/placeholder.svg?key=j8nm7')] bg-cover bg-center opacity-20"></div>

          {/* Heatmap-Punkte */}
          {regions.map((region) => (
            <div
              key={region.id}
              className="absolute rounded-full bg-blue-500 opacity-70 hover:opacity-100 transition-all cursor-pointer"
              style={{
                left: `${region.x}%`,
                top: `${region.y}%`,
                width: `${region.radius * 2}px`,
                height: `${region.radius * 2}px`,
                transform: "translate(-50%, -50%)",
              }}
              onMouseEnter={() => setActiveRegion(region.id)}
              onMouseLeave={() => setActiveRegion(null)}
            ></div>
          ))}

          {/* Tooltip für aktive Region */}
          {activeRegion && (
            <div
              className="absolute bg-background border rounded-md shadow-md p-2 z-10 text-sm"
              style={{
                left: `${regions.find((r) => r.id === activeRegion)?.x}%`,
                top: `${(regions.find((r) => r.id === activeRegion)?.y || 0) - 10}%`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <div className="font-medium">{regions.find((r) => r.id === activeRegion)?.name}</div>
              <div className="text-muted-foreground">
                {regions.find((r) => r.id === activeRegion)?.count} Erlebnisse
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {regions.map((region) => (
            <div key={region.id} className="flex items-center">
              <MapPin className="h-3 w-3 mr-1 text-blue-500" />
              <span>
                {region.name}: {region.count}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
