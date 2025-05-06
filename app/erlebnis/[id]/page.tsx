"use client"

import { useEffect, useState } from "react"
import { ErlebnisDetail } from "@/components/erlebnis/erlebnis-detail"
import { mockErlebnisse } from "@/lib/mock-data"
import type { Erlebnis } from "@/types/erlebnis"
import { Skeleton } from "@/components/ui/skeleton"

export default function ErlebnisPage({ params }: { params: { id: string } }) {
  const [erlebnis, setErlebnis] = useState<Erlebnis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simuliere einen API-Aufruf mit einer kurzen Verzögerung
    const fetchErlebnis = async () => {
      setLoading(true)
      try {
        // In einer echten Anwendung würde hier ein API-Aufruf stehen
        // Für jetzt verwenden wir die Mock-Daten
        setTimeout(() => {
          const foundErlebnis = mockErlebnisse.find((e) => e.id === params.id)
          setErlebnis(foundErlebnis || null)
          setLoading(false)
        }, 500)
      } catch (error) {
        console.error("Fehler beim Laden des Erlebnisses:", error)
        setLoading(false)
      }
    }

    fetchErlebnis()
  }, [params.id])

  if (loading) {
    return (
      <div className="py-6 px-4">
        <Skeleton className="h-8 w-32 mb-4" />
        <Skeleton className="h-[400px] w-full mb-6 rounded-lg" />
        <Skeleton className="h-12 w-full mb-6" />
        <Skeleton className="h-40 w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-60 w-full" />
      </div>
    )
  }

  if (!erlebnis) {
    return (
      <div className="py-6 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Erlebnis nicht gefunden</h1>
        <p>Das gesuchte Erlebnis mit der ID {params.id} konnte nicht gefunden werden.</p>
      </div>
    )
  }

  return <ErlebnisDetail id={params.id} erlebnis={erlebnis} />
}
