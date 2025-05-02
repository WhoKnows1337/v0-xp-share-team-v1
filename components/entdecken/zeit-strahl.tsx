"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Erlebnis } from "@/types/erlebnis"

interface ZeitStrahlProps {
  erlebnisse: Erlebnis[]
  onYearSelect?: (year: number) => void
  selectedYear: number | null
}

export function ZeitStrahl({ erlebnisse, onYearSelect = () => {}, selectedYear }: ZeitStrahlProps) {
  const [years, setYears] = useState<number[]>([])
  const [counts, setCounts] = useState<Record<number, number>>({})
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (erlebnisse.length === 0) return

    // Extrahiere alle Jahre aus den Erlebnissen
    const erlebnisYears = erlebnisse.map((e) => new Date(e.datum).getFullYear())

    // Finde das minimale und maximale Jahr
    const minYear = Math.min(...erlebnisYears)
    const maxYear = Math.max(...erlebnisYears)

    // Erstelle ein Array mit allen Jahren im Bereich
    const allYears = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i)

    // Zähle die Anzahl der Erlebnisse pro Jahr
    const yearCounts: Record<number, number> = {}
    erlebnisYears.forEach((year) => {
      yearCounts[year] = (yearCounts[year] || 0) + 1
    })

    setYears(allYears)
    setCounts(yearCounts)
  }, [erlebnisse])

  useEffect(() => {
    // Scrolle zum ausgewählten Jahr, wenn eines ausgewählt ist
    if (selectedYear && containerRef.current) {
      const yearElement = document.getElementById(`year-${selectedYear}`)
      if (yearElement) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const yearRect = yearElement.getBoundingClientRect()

        containerRef.current.scrollLeft = yearElement.offsetLeft - containerRect.width / 2 + yearRect.width / 2
      }
    }
  }, [selectedYear])

  const handleYearClick = (year: number) => {
    if (onYearSelect) {
      onYearSelect(year)
    }
  }

  const getBarHeight = (count: number) => {
    const maxCount = Math.max(...Object.values(counts))
    const minHeight = 20 // Minimale Höhe in Pixeln
    const maxHeight = 100 // Maximale Höhe in Pixeln

    if (maxCount === 0) return minHeight

    return minHeight + (count / maxCount) * (maxHeight - minHeight)
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4">Zeitstrahl der Erlebnisse</h3>

      <div
        ref={containerRef}
        className="relative w-full overflow-x-auto pb-6 pt-2 px-4"
        style={{ scrollbarWidth: "thin" }}
      >
        <div className="flex items-end space-x-2 min-w-max">
          {years.map((year) => {
            const count = counts[year] || 0
            const height = getBarHeight(count)

            return (
              <div key={year} id={`year-${year}`} className="flex flex-col items-center">
                <Button
                  variant={selectedYear === year ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "px-3 py-1 text-xs rounded-md transition-all",
                    selectedYear === year ? "bg-primary text-primary-foreground" : "hover:bg-accent",
                  )}
                  onClick={() => handleYearClick(year)}
                >
                  {year}
                  {count > 0 && <span className="ml-1">({count})</span>}
                </Button>

                <div
                  className={cn(
                    "w-6 mt-1 rounded-t-sm transition-all",
                    selectedYear === year ? "bg-primary" : "bg-muted-foreground/30",
                  )}
                  style={{ height: `${height}px` }}
                />
              </div>
            )
          })}
        </div>

        {/* Horizontale Linie */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-border" />
      </div>
    </div>
  )
}
