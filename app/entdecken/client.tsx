"use client"

import { useState, useEffect } from "react"
import { EntdeckenPageRedesigned } from "@/components/entdecken/entdecken-page-redesigned"
import { mockErlebnisse } from "@/lib/mock-data"
import { config } from "@/lib/config"

export function EntdeckenPageClient() {
  const [erlebnisse, setErlebnisse] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadErlebnisse = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (config.useMockData) {
          // Verwende Mock-Daten
          setErlebnisse(mockErlebnisse)
        } else {
          // Lade echte Daten von der API
          const response = await fetch("/api/experiences")
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const data = await response.json()
          setErlebnisse(data.experiences || [])
        }
      } catch (err) {
        console.error("Fehler beim Laden der Erlebnisse:", err)
        setError(err instanceof Error ? err.message : "Ein unbekannter Fehler ist aufgetreten")
        // Fallback zu Mock-Daten bei Fehler
        setErlebnisse(mockErlebnisse)
      } finally {
        setIsLoading(false)
      }
    }

    loadErlebnisse()
  }, [])

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Fehler beim Laden</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Verwende Mock-Daten als Fallback...</p>
        </div>
        <EntdeckenPageRedesigned erlebnisse={mockErlebnisse} isLoading={false} />
      </div>
    )
  }

  return <EntdeckenPageRedesigned erlebnisse={erlebnisse} isLoading={isLoading} />
}
