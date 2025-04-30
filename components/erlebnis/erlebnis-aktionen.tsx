// Diese Komponente wird nicht mehr verwendet, da die Funktionalität direkt in die ErlebnisDetail-Komponente integriert wurde.
// Die Aktionen (Like, Kommentare, Bookmark, Teilen) sind bereits unter dem Bild in der Detailansicht implementiert.

"use client"
import type { Erlebnis } from "@/types/erlebnis"

interface ErlebnisAktionenProps {
  erlebnis: Erlebnis
}

export function ErlebnisAktionen({ erlebnis }: ErlebnisAktionenProps) {
  // Diese Komponente ist veraltet und wird nicht mehr verwendet
  return null
}
