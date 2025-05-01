"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { mockErlebnisse } from "@/lib/mock-data"
import { ErlebnisDetail } from "@/components/erlebnis/erlebnis-detail"
import { RelevanteChannels } from "@/components/erlebnis/relevante-channels"
import { AehnlicheErlebnisse } from "@/components/erlebnis/aehnliche-erlebnisse"
import { ErlebnisAktionen } from "@/components/erlebnis/erlebnis-aktionen"
import { ErlebnisMetadaten } from "@/components/erlebnis/erlebnis-metadaten"
import { KIAnalyse } from "@/components/erlebnis/ki-analyse"
import { MusterTrends } from "@/components/erlebnis/muster-trends"
import { Loading } from "@/components/loading"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { SkipLink } from "@/components/ui/skip-link"

export default function ErlebnisPage() {
  const params = useParams()
  const id = params?.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [erlebnis, setErlebnis] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("entdecken")

  useEffect(() => {
    // Simuliere Ladezeit für bessere UX-Demo
    const timer = setTimeout(() => {
      if (!id) {
        setError("Keine Erlebnis-ID gefunden")
        setIsLoading(false)
        return
      }

      console.log("Suche Erlebnis mit ID:", id)
      // Direkt aus den Mock-Daten laden
      const gefundenesErlebnis = mockErlebnisse.find((e) => e.id === id)

      if (!gefundenesErlebnis) {
        console.error(
          `Erlebnis mit ID ${id} nicht gefunden. Verfügbare IDs:`,
          mockErlebnisse.map((e) => e.id),
        )
        setError(`Erlebnis mit ID ${id} nicht gefunden`)
        setIsLoading(false)
        return
      }

      // Erlebnis gefunden
      setErlebnis(gefundenesErlebnis)
      setIsLoading(false)
    }, 800) // Kurze Verzögerung für bessere UX-Demo

    return () => clearTimeout(timer)
  }, [id])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  if (isLoading) {
    return <Loading message="Erlebnis wird geladen..." />
  }

  if (error || !erlebnis) {
    return (
      <div className="flex flex-col flex-1 md:pl-64">
        <main className="flex-1 overflow-y-auto p-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Fehler: </strong>
            <span className="block sm:inline">{error || "Erlebnis nicht gefunden"}</span>
            <p className="mt-2">Verfügbare Erlebnis-IDs: {mockErlebnisse.map((e) => e.id).join(", ")}</p>
          </div>
        </main>
      </div>
    )
  }

  // Extrahiere die benötigten Metadaten aus dem Erlebnis-Objekt
  const kategorie = typeof erlebnis.kategorie === "object" ? erlebnis.kategorie.name : erlebnis.kategorie
  const autor = typeof erlebnis.autor === "object" ? erlebnis.autor.name || erlebnis.autor.username : erlebnis.autor
  const autorId = typeof erlebnis.autor === "object" ? erlebnis.autor.id : "unbekannt"
  const tags = Array.isArray(erlebnis.tags) ? erlebnis.tags : []
  const aufrufe = erlebnis.statistik?.ansichten || erlebnis.aufrufe || 0

  // Extrahiere den Ortsnamen aus dem Ortsobjekt
  const ortName = typeof erlebnis.ort === "object" ? erlebnis.ort.name : erlebnis.ort

  return (
    <>
      <SkipLink href="#erlebnis-content">Zum Erlebnis-Inhalt springen</SkipLink>
      <div className="flex h-screen overflow-hidden">
        {/* Linke Spalte - Dashboard Sidebar - Fixiert */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <DashboardSidebar activeTab={activeTab} onTabChange={handleTabChange} className="border-r px-3 py-4" />
        </div>

        {/* Hauptinhalt mit Padding für die fixierte Sidebar */}
        <div className="flex flex-col flex-1 md:pl-64">
          <main id="erlebnis-content" className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Mittlere Spalte - Erlebnis Detail */}
              <div className="lg:col-span-3">
                <ErlebnisDetail id={erlebnis.id} erlebnis={erlebnis} />
              </div>

              {/* Rechte Spalte - Metadaten und Aktionen */}
              <div className="lg:col-span-1 space-y-6">
                <ErlebnisAktionen erlebnis={erlebnis} />
                <ErlebnisMetadaten
                  kategorie={kategorie}
                  unterkategorie={erlebnis.unterkategorie}
                  datum={erlebnis.datum}
                  ort={ortName}
                  autor={autor}
                  autorId={autorId}
                  tags={tags}
                  aufrufe={aufrufe}
                />
                {/* KI-Analyse hinzugefügt */}
                <KIAnalyse erlebnis={erlebnis} />
                <MusterTrends
                  erlebnisId={erlebnis.id}
                  muster={erlebnis.muster}
                  trends={erlebnis.trends}
                  einsichten={erlebnis.einsichten}
                />
                <RelevanteChannels tags={erlebnis.tags} kategorie={kategorie} />
                <AehnlicheErlebnisse erlebnisse={erlebnis.aehnlicheErlebnisse || []} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
