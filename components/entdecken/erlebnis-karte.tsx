"use client"

import type React from "react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, MessageSquare, Bookmark } from "lucide-react"
import { format } from "date-fns"
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
  datum?: Date
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
}

// Kategorien-Map
const kategorienMap: Record<string, string> = {
  traum: "Traum",
  nahtoderfahrung: "Nahtoderfahrung",
  intuition: "Intuition",
  ufo: "UFO-Sichtung",
  paranormal: "Paranormales",
  synchronizitat: "Synchronizität",
  spirituell: "Spirituelle Erfahrung",
  psychodelisch: "Psychodelische Reisen",
  sonstiges: "Sonstiges",
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
}: ErlebnisKarteProps) {
  const [lesezeichen, setLesezeichen] = useState(initialLesezeichen)

  // Formatiere die Uhrzeit, falls vorhanden
  const formatTimeIfAvailable = (date?: Date) => {
    if (!date) return null

    const hours = date.getHours()
    const minutes = date.getMinutes()

    // Prüfe, ob eine Uhrzeit gesetzt wurde (nicht 00:00)
    if (hours === 0 && minutes === 0) return null

    return format(date, "HH:mm")
  }

  // Formatierte Uhrzeit
  const formattedTime = formatTimeIfAvailable(datum)

  // Kürze die Beschreibung für die Kartenansicht
  const kurzeBeschreibung = kiZusammenfassung || beschreibung
  const maxLength = compact ? 80 : 150
  const displayBeschreibung =
    kurzeBeschreibung.length > maxLength ? `${kurzeBeschreibung.substring(0, maxLength)}...` : kurzeBeschreibung

  // Toggle Lesezeichen
  const toggleLesezeichen = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLesezeichen(!lesezeichen)
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
              {kategorienMap[kategorie] || kategorie}
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
            {datum && (
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{format(datum, "dd.MM.yyyy", { locale: de })}</span>
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
              href={`/profil/${autor.id}`}
              className="flex items-center hover:text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={autor.avatar || "/placeholder.svg"} alt={autor.name} />
                <AvatarFallback className="text-xs bg-primary/20">
                  {autor.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs">{autor.name}</span>
            </Link>

            {/* Tags (nur anzeigen, wenn nicht kompakt) */}
            {!compact && tags.length > 0 && (
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
