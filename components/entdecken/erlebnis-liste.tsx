"use client"

import { useState, useEffect, useRef } from "react"
import { Grid, List, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ErlebnisFilter } from "./erlebnis-filter"
import { motion, AnimatePresence } from "framer-motion"
import { ErlebnisKarte } from "./erlebnis-karte"

interface ErlebnisListeProps {
  erlebnisse: any[] // Verwenden Sie any[] für Flexibilität mit verschiedenen Datenstrukturen
  ansicht?: "karten" | "kompakt"
  onLoadMore?: () => void
  isLoading?: boolean
  hasMore?: boolean
  onResetFilter?: () => void
  filterValues?: {
    suchbegriff?: string
    kategorien?: string[]
    zeitraum?: string
    tags?: string[]
    nurVerifiziert?: boolean
  }
  onFilterChange?: (filter: any) => void
}

export function ErlebnisListe({
  erlebnisse = [], // Provide default empty array to prevent undefined errors
  ansicht,
  onLoadMore,
  isLoading,
  hasMore,
  onResetFilter,
  filterValues,
  onFilterChange,
}: ErlebnisListeProps) {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Debug-Ausgabe
  console.log("ErlebnisListe - erlebnisse:", erlebnisse)
  console.log("ErlebnisListe - ansicht:", ansicht)

  // Funktion zum Navigieren zur Detailseite
  const navigateToDetail = (id: string) => {
    console.log(`Navigiere zu Erlebnis ${id}`)
    router.push(`/erlebnis/${id}`)
  }

  // Scroll-nach-oben-Button anzeigen/verstecken
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Infinite Scrolling mit Intersection Observer
  useEffect(() => {
    if (loadingRef.current && hasMore && onLoadMore) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !isLoading) {
            onLoadMore()
          }
        },
        { threshold: 0.5 },
      )

      observerRef.current.observe(loadingRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [isLoading, hasMore, onLoadMore])

  // Scroll nach oben
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Wenn keine Erlebnisse vorhanden sind
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="space-y-4 w-full max-w-md">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[150px] w-full rounded-md" />
          ))}
        </div>
      </div>
    )
  }

  if (!erlebnisse || erlebnisse.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-8 relative w-48 h-48">
          <EmptyStateIllustration />
        </div>
        <h3 className="mb-2 text-xl font-semibold">Keine passenden Erlebnisse gefunden</h3>
        <p className="mb-6 max-w-md text-muted-foreground">
          Leider konnten wir keine Erlebnisse finden, die deinen Filterkriterien entsprechen. Hier sind einige Tipps:
        </p>
        <div className="mb-8 text-sm text-left max-w-md">
          <ul className="space-y-2 list-disc pl-5">
            <li>Verwende weniger oder allgemeinere Suchbegriffe</li>
            <li>Erweitere den Zeitraum in deinen Filtereinstellungen</li>
            <li>Wähle mehr oder andere Kategorien aus</li>
            <li>Entferne spezifische Tags, die zu einschränkend sein könnten</li>
          </ul>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {onResetFilter && (
            <Button onClick={onResetFilter} variant="default">
              Filter zurücksetzen
            </Button>
          )}
          <Button onClick={() => window.location.reload()} variant="outline">
            Seite neu laden
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div ref={listRef} className="relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Erlebnisse entdecken</h2>
        <div className="flex items-center gap-2">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <ErlebnisFilter
                onFilterChange={(filter) => {
                  if (onFilterChange) onFilterChange(filter)
                  setIsFilterOpen(false)
                }}
              />
            </SheetContent>
          </Sheet>
          <div className="border rounded-md flex">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-none"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {erlebnisse.map((erlebnis) => (
                <ErlebnisKarte
                  key={erlebnis.id}
                  erlebnis={erlebnis}
                  // Add default props to prevent errors
                  id={erlebnis.id || ""}
                  titel={erlebnis.titel || ""}
                  beschreibung={erlebnis.beschreibung || erlebnis.kurzfassung || ""}
                  kategorie={
                    typeof erlebnis.kategorie === "string" ? erlebnis.kategorie : erlebnis.kategorie?.name || ""
                  }
                  unterkategorie={erlebnis.unterkategorie}
                  datum={erlebnis.datum ? new Date(erlebnis.datum) : undefined}
                  ort={typeof erlebnis.ort === "string" ? erlebnis.ort : erlebnis.ort?.name}
                  autor={
                    typeof erlebnis.autor === "string"
                      ? { id: erlebnis.autor, name: erlebnis.autor, avatar: undefined }
                      : {
                          id: erlebnis.autor?.id || "unknown",
                          name: erlebnis.autor?.name || "Unbekannt",
                          avatar: erlebnis.autor?.avatar,
                        }
                  }
                  kommentare={erlebnis.kommentare || erlebnis.statistik?.kommentare || 0}
                  lesezeichen={false}
                  tags={erlebnis.tags || []}
                  bild={erlebnis.medien?.[0]?.url}
                  kiZusammenfassung={erlebnis.kiZusammenfassung}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {erlebnisse.map((erlebnis) => (
                <ErlebnisKarte
                  key={erlebnis.id}
                  erlebnis={erlebnis}
                  compact
                  // Add default props to prevent errors
                  id={erlebnis.id || ""}
                  titel={erlebnis.titel || ""}
                  beschreibung={erlebnis.beschreibung || erlebnis.kurzfassung || ""}
                  kategorie={
                    typeof erlebnis.kategorie === "string" ? erlebnis.kategorie : erlebnis.kategorie?.name || ""
                  }
                  unterkategorie={erlebnis.unterkategorie}
                  datum={erlebnis.datum ? new Date(erlebnis.datum) : undefined}
                  ort={typeof erlebnis.ort === "string" ? erlebnis.ort : erlebnis.ort?.name}
                  autor={
                    typeof erlebnis.autor === "string"
                      ? { id: erlebnis.autor, name: erlebnis.autor, avatar: undefined }
                      : {
                          id: erlebnis.autor?.id || "unknown",
                          name: erlebnis.autor?.name || "Unbekannt",
                          avatar: erlebnis.autor?.avatar,
                        }
                  }
                  kommentare={erlebnis.kommentare || erlebnis.statistik?.kommentare || 0}
                  lesezeichen={false}
                  tags={erlebnis.tags || []}
                  bild={erlebnis.medien?.[0]?.url}
                  kiZusammenfassung={erlebnis.kiZusammenfassung}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Lade-Indikator für Infinite Scrolling */}
      {hasMore && onLoadMore && (
        <div ref={loadingRef} className="mt-6 flex justify-center">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
          ) : (
            <Button variant="outline" onClick={onLoadMore}>
              Mehr laden
            </Button>
          )}
        </div>
      )}

      {/* Scroll-nach-oben-Button */}
      {showScrollTop && (
        <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-6 right-6 z-50 rounded-full shadow-md"
          onClick={scrollToTop}
        >
          <ArrowUp className="h-5 w-5" />
          <span className="sr-only">Nach oben scrollen</span>
        </Button>
      )}
    </div>
  )
}

// Komponente für die Illustration des leeren Zustands
function EmptyStateIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Hintergrund mit Sternen */}
        <circle cx="100" cy="100" r="80" fill="#f1f5f9" />
        <circle cx="30" cy="40" r="2" fill="#94a3b8" />
        <circle cx="50" cy="30" r="1" fill="#94a3b8" />
        <circle cx="70" cy="20" r="2" fill="#94a3b8" />
        <circle cx="170" cy="30" r="2" fill="#94a3b8" />
        <circle cx="150" cy="50" r="1" fill="#94a3b8" />
        <circle cx="180" cy="70" r="2" fill="#94a3b8" />
        <circle cx="20" cy="150" r="2" fill="#94a3b8" />
        <circle cx="40" cy="170" r="1" fill="#94a3b8" />
        <circle cx="170" cy="160" r="2" fill="#94a3b8" />
        <circle cx="150" cy="180" r="1" fill="#94a3b8" />

        {/* Planet */}
        <circle cx="160" cy="40" r="15" fill="#cbd5e1" />
        <circle cx="155" cy="35" r="5" fill="#94a3b8" />
        <circle cx="165" cy="45" r="3" fill="#94a3b8" />

        {/* Astronaut */}
        <g transform="translate(80, 90)">
          {/* Körper */}
          <ellipse cx="0" cy="0" rx="20" ry="25" fill="#e2e8f0" />

          {/* Helm */}
          <circle cx="0" cy="-20" r="15" fill="#e2e8f0" />
          <circle cx="0" cy="-20" r="12" fill="#cbd5e1" />
          <circle cx="-5" cy="-23" r="3" fill="#f8fafc" opacity="0.6" />

          {/* Arme */}
          <rect x="-25" y="-10" width="20" height="8" rx="4" fill="#e2e8f0" transform="rotate(-20)" />
          <rect x="5" y="-10" width="30" height="8" rx="4" fill="#e2e8f0" transform="rotate(30)" />

          {/* Beine */}
          <rect x="-10" y="20" width="8" height="20" rx="4" fill="#e2e8f0" transform="rotate(10)" />
          <rect x="2" y="20" width="8" height="20" rx="4" fill="#e2e8f0" transform="rotate(-10)" />

          {/* Lupe */}
          <circle cx="25" cy="5" r="10" stroke="#64748b" strokeWidth="2" fill="transparent" />
          <rect x="32" y="12" width="15" height="4" rx="2" fill="#64748b" transform="rotate(45)" />
        </g>

        {/* Suchsymbol */}
        <circle cx="120" cy="110" r="30" stroke="#64748b" strokeWidth="3" fill="transparent" strokeDasharray="5 5" />
        <path d="M110 110 L130 110 M120 100 L120 120" stroke="#64748b" strokeWidth="3" />
      </svg>
    </div>
  )
}

// Funktion zum Hervorheben von Suchbegriffen im Text
function HighlightText({ text, searchTerm }: { text: string; searchTerm?: string }) {
  if (!searchTerm || searchTerm.trim() === "") {
    return <>{text}</>
  }

  const parts = text.split(new RegExp(`(${searchTerm})`, "gi"))

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <span key={i} className="bg-yellow-100 dark:bg-yellow-900/50">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  )
}
