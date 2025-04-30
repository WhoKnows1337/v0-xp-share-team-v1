"use client"

import { useState, useEffect } from "react"
import { ZeitStrahlSlider } from "./zeit-strahl-slider"
import { ErlebnisKarte } from "./erlebnis-karte"
import type { Erlebnis } from "@/lib/mock-data"

interface ErlebnisKarteMitZeitstrahlProps {
  erlebnisse: Erlebnis[] | Erlebnis
  einzelneModus?: boolean
}

export function ErlebnisKarteMitZeitstrahl({ erlebnisse, einzelneModus = false }: ErlebnisKarteMitZeitstrahlProps) {
  console.log("ErlebnisKarteMitZeitstrahl - erlebnisse:", erlebnisse)

  // Konvertiere einzelnes Erlebnis zu einem Array, wenn nötig
  const erlebnisseArray = Array.isArray(erlebnisse) ? erlebnisse : [erlebnisse]
  console.log("ErlebnisKarteMitZeitstrahl - erlebnisseArray:", erlebnisseArray)

  const [filteredErlebnisse, setFilteredErlebnisse] = useState<Erlebnis[]>(erlebnisseArray)
  const [aktuellesJahr, setAktuellesJahr] = useState<number>(new Date().getFullYear())

  // Bestimme das minimale und maximale Jahr aus den Erlebnissen
  const minJahr =
    erlebnisseArray.length > 0
      ? Math.min(
          ...erlebnisseArray.map((e) => {
            try {
              // Versuche, das Jahr aus dem Datum zu extrahieren
              const datumTeile = e.datum.split(".")
              if (datumTeile.length >= 3) {
                return Number.parseInt(datumTeile[2], 10)
              }
              return new Date().getFullYear() - 10
            } catch (error) {
              console.error("Fehler beim Parsen des Datums:", e.datum, error)
              return new Date().getFullYear() - 10
            }
          }),
        )
      : new Date().getFullYear() - 10

  const maxJahr =
    erlebnisseArray.length > 0
      ? Math.max(
          ...erlebnisseArray.map((e) => {
            try {
              // Versuche, das Jahr aus dem Datum zu extrahieren
              const datumTeile = e.datum.split(".")
              if (datumTeile.length >= 3) {
                return Number.parseInt(datumTeile[2], 10)
              }
              return new Date().getFullYear()
            } catch (error) {
              console.error("Fehler beim Parsen des Datums:", e.datum, error)
              return new Date().getFullYear()
            }
          }),
        )
      : new Date().getFullYear()

  console.log("ErlebnisKarteMitZeitstrahl - minJahr:", minJahr, "maxJahr:", maxJahr)

  useEffect(() => {
    // Aktualisiere das erlebnisseArray, wenn sich die erlebnisse-Prop ändert
    const neuesArray = Array.isArray(erlebnisse) ? erlebnisse : [erlebnisse]
    console.log("ErlebnisKarteMitZeitstrahl - useEffect - neuesArray:", neuesArray)

    // Filtere Erlebnisse basierend auf dem aktuellen Jahr
    const filtered = neuesArray.filter((erlebnis) => {
      try {
        // Versuche, das Jahr aus dem Datum zu extrahieren
        const datumTeile = erlebnis.datum.split(".")
        if (datumTeile.length >= 3) {
          const erlebnisJahr = Number.parseInt(datumTeile[2], 10)
          return erlebnisJahr <= aktuellesJahr
        }
        return true // Wenn das Datum nicht geparst werden kann, zeige das Erlebnis trotzdem an
      } catch (error) {
        console.error("Fehler beim Filtern nach Jahr:", erlebnis.datum, error)
        return true // Bei Fehlern zeige das Erlebnis trotzdem an
      }
    })

    console.log("ErlebnisKarteMitZeitstrahl - useEffect - filtered:", filtered)
    setFilteredErlebnisse(filtered)
  }, [aktuellesJahr, erlebnisse])

  const handleJahrChange = (jahr: number) => {
    console.log("ErlebnisKarteMitZeitstrahl - handleJahrChange:", jahr)
    setAktuellesJahr(jahr)
  }

  return (
    <div className="relative w-full h-full">
      <div className="h-[450px]">
        <ErlebnisKarte erlebnisse={filteredErlebnisse} />
      </div>
      {!einzelneModus && (
        <div className="absolute bottom-0 left-0 right-0 bg-slate-800/80 p-4">
          <ZeitStrahlSlider minJahr={minJahr} maxJahr={maxJahr} onChange={handleJahrChange} />
        </div>
      )}
    </div>
  )
}
