"use client"
import { format, isValid } from "date-fns"

interface ErlebnisMetadatenProps {
  kategorie: string
  unterkategorie?: string
  datum?: Date | string
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

    try {
      const hours = date.getHours()
      const minutes = date.getMinutes()

      // Prüfe, ob eine Uhrzeit gesetzt wurde (nicht 00:00)
      if (hours === 0 && minutes === 0) return null

      return format(date, "HH:mm")
    } catch (e) {
      console.error("Error formatting time:", e)
      return null
    }
  }

  // Formatierte Uhrzeit
  const formattedTime = formatTimeIfAvailable(validDate)

  return null
}
