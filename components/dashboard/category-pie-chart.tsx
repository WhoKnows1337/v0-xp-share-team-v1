"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PieChart } from "lucide-react"

interface CategoryData {
  id: string
  name: string
  count: number
  percentage: number
  color: string
}

export function CategoryPieChart() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Simulierte Daten für das Tortendiagramm
  const categories: CategoryData[] = [
    { id: "dream", name: "Traum", count: 912, percentage: 32, color: "bg-purple-500" },
    { id: "dejavu", name: "Déjà-vu", count: 684, percentage: 24, color: "bg-blue-500" },
    { id: "meditation", name: "Meditation", count: 513, percentage: 18, color: "bg-green-500" },
    { id: "nde", name: "Nahtoderfahrung", count: 285, percentage: 10, color: "bg-amber-500" },
    { id: "ufo", name: "UFO-Sichtung", count: 228, percentage: 8, color: "bg-red-500" },
    { id: "other", name: "Andere", count: 228, percentage: 8, color: "bg-gray-500" },
  ]

  // Berechne die Startwinkel für jede Kategorie
  const calculateRotation = (index: number): number => {
    let rotation = 0
    for (let i = 0; i < index; i++) {
      rotation += categories[i].percentage * 3.6 // 3.6 Grad pro Prozent (360 / 100)
    }
    return rotation
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PieChart className="mr-2 h-5 w-5 text-purple-500" />
          Erlebnisse nach Kategorie
        </CardTitle>
        <CardDescription>Verteilung aller Erlebnisse nach Kategorie</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <div className="relative w-64 h-64">
            {/* Tortendiagramm-Segmente */}
            {categories.map((category, index) => (
              <div
                key={category.id}
                className={`absolute inset-0 ${category.color} ${activeCategory === category.id ? "opacity-100 scale-105" : "opacity-80"} transition-all duration-200`}
                style={{
                  clipPath: `conic-gradient(from ${calculateRotation(index)}deg, currentColor ${category.percentage * 3.6}deg, transparent 0)`,
                }}
                onMouseEnter={() => setActiveCategory(category.id)}
                onMouseLeave={() => setActiveCategory(null)}
              ></div>
            ))}

            {/* Innerer Kreis für Gesamtzahl */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-background rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">2,845</div>
                <div className="text-xs text-muted-foreground">Erlebnisse</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`flex items-center ${activeCategory === category.id ? "font-medium" : ""}`}
              onMouseEnter={() => setActiveCategory(category.id)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <div className={`w-3 h-3 rounded-full ${category.color} mr-2`}></div>
              <span className="text-sm">
                {category.name} ({category.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
