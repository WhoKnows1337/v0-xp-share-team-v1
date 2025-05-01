"use client"

import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Tag, User, Eye } from "lucide-react"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ErlebnisMetadatenProps {
  kategorie: string
  unterkategorie?: string
  datum?: Date
  ort?: string
  autor: string
  autorId: string
  tags: string[]
  aufrufe: number
  onTagClick?: (tag: string) => void
  onAutorClick?: () => void
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

export function ErlebnisMetadaten({
  kategorie,
  unterkategorie,
  datum,
  ort,
  autor,
  autorId,
  tags,
  aufrufe,
  onTagClick,
  onAutorClick,
}: ErlebnisMetadatenProps) {
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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="bg-primary/20 border-primary/30 text-white">
          {kategorienMap[kategorie] || kategorie}
          {unterkategorie && (
            <span className="ml-1">
              {" • "}
              {unterkategorie}
            </span>
          )}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-300">
        {/* Kombinierte Datum/Zeit-Anzeige */}
        {datum && (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
            <span>{format(datum, "PPP", { locale: de })}</span>
            {formattedTime && (
              <>
                <Clock className="h-4 w-4 mx-1.5 text-gray-400" />
                <span>{formattedTime} Uhr</span>
              </>
            )}
          </div>
        )}

        {/* Ort-Anzeige */}
        {ort && (
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
            <span>{ort}</span>
          </div>
        )}

        {/* Autor-Anzeige */}
        <div
          className="flex items-center cursor-pointer hover:text-white transition-colors"
          onClick={onAutorClick}
          role="button"
          tabIndex={0}
          aria-label={`Zum Profil von ${autor}`}
        >
          <User className="h-4 w-4 mr-1.5 text-gray-400" />
          <span>{autor}</span>
        </div>

        {/* Aufrufe-Anzeige */}
        <div className="flex items-center">
          <Eye className="h-4 w-4 mr-1.5 text-gray-400" />
          <span>{aufrufe} Aufrufe</span>
        </div>
      </div>

      {/* Tags-Anzeige */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <Tag className="h-4 w-4 text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <TooltipProvider key={tag}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="secondary"
                      className="bg-gray-800/60 hover:bg-gray-700/60 cursor-pointer transition-colors"
                      onClick={() => onTagClick && onTagClick(tag)}
                    >
                      {tag}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ähnliche Erlebnisse mit diesem Tag anzeigen</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
