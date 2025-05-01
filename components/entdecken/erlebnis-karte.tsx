"use client"

import type React from "react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, MessageSquare, Bookmark } from "lucide-react"
import { format, isValid } from "date-fns"
import { de } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ErlebnisKarteProps {
  id: string
  titel: string
  beschreibung: string
  kategorie: string
  unterkategorie?: string
  datum?: Date | string
  ort?: string
  autor: {
    id: string
    name: string
    avatar?: string
  }
  kommentare: number
  lesezeichen: boolean
  tags: string[]
  bild?: string
  kiZusammenfassung?: string
  className?: string
  compact?: boolean
  erlebnis?: any // For backward compatibility
}

// Kategorien-Map
const kategorienMap: Record<string, string> = {
  traum: "Traum",
  nahtoderfahrung: "Nahtoderfahrung",
  intuition: "Intuition",
  ufo: "UFO-Sichtung",
  himmelsphänomen: "Himmelsphänomen",
  paranormal: "Paranormales",
  synchronizitat: "Synchronizität",
  spirituell: "Spirituelle Erfahrung",
  psychodelisch: "Psychodelische Reisen",
  sonstiges: "Sonstiges",
  gesundheit: "Gesundheit",
  natur: "Natur",
  automatisch: "Automatisch erkannt",
}

export function ErlebnisKarte({
  id,
  titel,
  beschreibung,
  kategorie,
  unterkategorie,
  datum,
  ort,
  autor,
  kommentare,
  lesezeichen: initialLesezeichen,
  tags,
  bild,
  kiZusammenfassung,
  className,
  compact = false,
  erlebnis,
}: ErlebnisKarteProps) {
  // If erlebnis is provided, extract properties from it (for backward compatibility)
  if (erlebnis) {
    id = erlebnis.id || id
    titel = erlebnis.titel || titel
    beschreibung = erlebnis.beschreibung || erlebnis.kurzfassung || beschreibung
    kategorie = typeof erlebnis.kategorie === "string" ? erlebnis.kategorie : erlebnis.kategorie?.name || kategorie
    unterkategorie = erlebnis.unterkategorie || unterkategorie

    // Handle date conversion more carefully
    if (erlebnis.datum) {
      try {
        datum = erlebnis.datum instanceof Date ? erlebnis.datum : new Date(erlebnis.datum)
      } catch (e) {
        console.error("Invalid date format:", erlebnis.datum)
        datum = undefined
      }
    }

    ort = typeof erlebnis.ort === "string" ? erlebnis.ort : erlebnis.ort?.name || ort
    autor =
      typeof erlebnis.autor === "string"
        ? { id: erlebnis.autor, name: erlebnis.autor, avatar: undefined }
        : erlebnis.autor?.name
          ? { id: erlebnis.autor.id || "unknown", name: erlebnis.autor.name, avatar: erlebnis.autor.avatar }
          : autor
    kommentare = erlebnis.kommentare || erlebnis.statistik?.kommentare || kommentare || 0
    tags = erlebnis.tags || tags || []
    bild = erlebnis.medien?.[0]?.url || bild
    kiZusammenfassung = erlebnis.kiZusammenfassung || kiZusammenfassung
  }

  const [lesezeichen, setLesezeichen] = useState(initialLesezeichen)

  // Ensure datum is a valid Date object
  const ensureValidDate = (dateInput?: Date | string): Date | undefined => {
    if (!dateInput) return undefined

    try {
      const dateObj = dateInput instanceof Date ? dateInput : new Date(dateInput)
      return isValid(dateObj) ? dateObj : undefined
    } catch (e) {
      console.error("Error parsing date:", e)
      return undefined
    }
  }

  const validDate = ensureValidDate(datum)

  // Formatiere die Uhrzeit, falls vorhanden
  const formatTimeIfAvailable = (date?: Date) => {
    if (!date || !isValid(date)) return null

    const hours = date.getHours()
    const minutes = date.getMinutes()

    // Prüfe, ob eine Uhrzeit gesetzt wurde (nicht 00:00)
    if (hours === 0 && minutes === 0) return null

    try {
      return format(date, "HH:mm")
    } catch (e) {
      console.error("Error formatting time:", e)
      return null
    }
  }

  // Formatierte Uhrzeit
  const formattedTime = formatTimeIfAvailable(validDate)

  // Kürze die Beschreibung für die Kartenansicht
  const kurzeBeschreibung = kiZusammenfassung || beschreibung || ""
  const maxLength = compact ? 80 : 150
  const displayBeschreibung =
    kurzeBeschreibung.length > maxLength ? `${kurzeBeschreibung.substring(0, maxLength)}...` : kurzeBeschreibung

  // Toggle Lesezeichen
  const toggleLesezeichen = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLesezeichen(!lesezeichen)
  }

  // Ensure we have valid data to display
  if (!id || !titel) {
    return null
  }

  return (
    <Link href={`/erlebnis/${id}`} passHref>
      <Card
        className={cn(
          "h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 cursor-pointer bg-white/5 border-white/10 text-white",
          className,
        )}
      >
        {bild && !compact && (
          <div className="relative w-full h-40 overflow-hidden">
            <img
              src={bild || "/placeholder.svg"}
              alt={titel}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <CardHeader className={cn("pb-2", compact && "p-3")}>
          <div className="flex justify-between items-start">
            <Badge variant="outline" className="mb-2 bg-primary/20 border-primary/30">
              {kategorienMap[kategorie?.toLowerCase?.()] || kategorie}
              {unterkategorie && (
                <span className="ml-1">
                  {" • "}
                  {unterkategorie}
                </span>
              )}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full",
                lesezeichen ? "text-yellow-400 hover:text-yellow-500" : "text-gray-400 hover:text-gray-300",
              )}
              onClick={toggleLesezeichen}
              aria-label={lesezeichen ? "Von Lesezeichen entfernen" : "Zu Lesezeichen hinzufügen"}
            >
              <Bookmark className={cn("h-5 w-5", lesezeichen && "fill-current")} />
            </Button>
          </div>
          <h3 className={cn("font-semibold leading-tight", compact ? "text-base" : "text-lg")}>{titel}</h3>
        </CardHeader>

        <CardContent className={cn("py-2", compact && "p-3 pt-0")}>
          <p className={cn("text-gray-300 line-clamp-3", compact && "text-sm line-clamp-2")}>{displayBeschreibung}</p>
        </CardContent>

        <CardFooter className={cn("flex flex-col items-start pt-0", compact && "p-3")}>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 mb-2 w-full">
            {/* Kombinierte Datum/Zeit-Anzeige */}
            {validDate && (
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>
                  {(() => {
                    try {
                      return format(validDate, "dd.MM.yyyy", { locale: de })
                    } catch (e) {
                      console.error("Error formatting date:", e)
                      return "Datum unbekannt"
                    }
                  })()}
                </span>
                {formattedTime && (
                  <>
                    <Clock className="h-3 w-3 mx-1" />
                    <span>{formattedTime}</span>
                  </>
                )}
              </div>
            )}

            {/* Ort-Anzeige */}
            {ort && (
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="truncate max-w-[150px]">{ort}</span>
              </div>
            )}

            {/* Kommentare-Anzeige */}
            <div className="flex items-center ml-auto">
              <MessageSquare className="h-3 w-3 mr-1" />
              <span>{kommentare}</span>
            </div>
          </div>

          <div className="flex items-center w-full">
            <Link
              href={`/profil/${autor?.id || "unknown"}`}
              className="flex items-center hover:text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={autor?.avatar || "/placeholder.svg"} alt={autor?.name || "Unbekannt"} />
                <AvatarFallback className="text-xs bg-primary/20">
                  {autor?.name ? autor.name.substring(0, 2).toUpperCase() : "UN"}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs">{autor?.name || "Unbekannt"}</span>
            </Link>

            {/* Tags (nur anzeigen, wenn nicht kompakt) */}
            {!compact && tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1 ml-auto">
                {tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs py-0 h-5 bg-white/5 border-white/10">
                    {tag}
                  </Badge>
                ))}
                {tags.length > 2 && (
                  <Badge variant="outline" className="text-xs py-0 h-5 bg-white/5 border-white/10">
                    +{tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
