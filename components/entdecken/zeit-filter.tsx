"use client"

import { useState, useEffect, useRef } from "react"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type ZeitFilterTyp = "benutzerdefiniert" | "vordefiniert" | "jahresbereich"
export type VordefinierterZeitraum = "heute" | "letzte7Tage" | "letzterMonat" | "letztesJahr" | "alleZeit"

interface ZeitFilterProps {
  onFilterChange: (filter: {
    von?: Date
    bis?: Date
    zeitraumTyp: ZeitFilterTyp
    vordefinierterZeitraum?: VordefinierterZeitraum
    jahresBereich?: [number, number]
  }) => void
}

export function ZeitFilter({ onFilterChange }: ZeitFilterProps) {
  const aktuellesJahr = new Date().getFullYear()
  const [zeitraumTyp, setZeitraumTyp] = useState<ZeitFilterTyp>("vordefiniert")
  const [vordefinierterZeitraum, setVordefinierterZeitraum] = useState<VordefinierterZeitraum>("alleZeit")
  const [vonDatum, setVonDatum] = useState<Date | undefined>(undefined)
  const [bisDatum, setBisDatum] = useState<Date | undefined>(undefined)
  const [jahresBereich, setJahresBereich] = useState<[number, number]>([aktuellesJahr - 10, aktuellesJahr])

  // Verwende useRef, um zu verfolgen, ob sich die Werte geändert haben
  const isInitialMount = useRef(true)

  // Nur bei Änderungen der Werte den Filter aktualisieren, nicht bei jedem Render
  useEffect(() => {
    // Überspringe den ersten Render
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    // Verzögere die Aktualisierung, um mehrere schnelle Änderungen zu bündeln
    const timeoutId = setTimeout(() => {
      onFilterChange({
        von: vonDatum,
        bis: bisDatum,
        zeitraumTyp,
        vordefinierterZeitraum,
        jahresBereich,
      })
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [zeitraumTyp, vordefinierterZeitraum, vonDatum, bisDatum, jahresBereich])

  const handleVordefiniertenZeitraumChange = (wert: VordefinierterZeitraum) => {
    setVordefinierterZeitraum(wert)

    const heute = new Date()
    let von: Date | undefined = undefined
    let bis: Date | undefined = undefined

    switch (wert) {
      case "heute":
        von = new Date(heute)
        von.setHours(0, 0, 0, 0)
        bis = new Date(heute)
        bis.setHours(23, 59, 59, 999)
        break
      case "letzte7Tage":
        von = new Date(heute)
        von.setDate(heute.getDate() - 7)
        bis = new Date(heute)
        break
      case "letzterMonat":
        von = new Date(heute)
        von.setMonth(heute.getMonth() - 1)
        bis = new Date(heute)
        break
      case "letztesJahr":
        von = new Date(heute)
        von.setFullYear(heute.getFullYear() - 1)
        bis = new Date(heute)
        break
      case "alleZeit":
        von = undefined
        bis = undefined
        break
    }

    setVonDatum(von)
    setBisDatum(bis)
  }

  const handleJahresBereichChange = (werte: number[]) => {
    setJahresBereich([werte[0], werte[1]])
  }

  // Manuelles Anwenden des Filters
  const applyFilter = () => {
    onFilterChange({
      von: vonDatum,
      bis: bisDatum,
      zeitraumTyp,
      vordefinierterZeitraum,
      jahresBereich,
    })
  }

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Zeitfilter</h3>
        <Button size="sm" variant="outline" onClick={applyFilter}>
          Anwenden
        </Button>
      </div>

      <RadioGroup
        value={zeitraumTyp}
        onValueChange={(value) => setZeitraumTyp(value as ZeitFilterTyp)}
        className="space-y-3"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="vordefiniert" id="vordefiniert" />
          <Label htmlFor="vordefiniert">Vordefinierte Zeiträume</Label>
        </div>

        {zeitraumTyp === "vordefiniert" && (
          <div className="ml-6 space-y-2">
            <RadioGroup
              value={vordefinierterZeitraum}
              onValueChange={(value) => handleVordefiniertenZeitraumChange(value as VordefinierterZeitraum)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="heute" id="heute" />
                <Label htmlFor="heute">Heute</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="letzte7Tage" id="letzte7Tage" />
                <Label htmlFor="letzte7Tage">Letzte 7 Tage</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="letzterMonat" id="letzterMonat" />
                <Label htmlFor="letzterMonat">Letzter Monat</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="letztesJahr" id="letztesJahr" />
                <Label htmlFor="letztesJahr">Letztes Jahr</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="alleZeit" id="alleZeit" />
                <Label htmlFor="alleZeit">Alle Zeit</Label>
              </div>
            </RadioGroup>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <RadioGroupItem value="benutzerdefiniert" id="benutzerdefiniert" />
          <Label htmlFor="benutzerdefiniert">Benutzerdefinierter Zeitraum</Label>
        </div>

        {zeitraumTyp === "benutzerdefiniert" && (
          <div className="ml-6 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="von">Von</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="von"
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !vonDatum && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {vonDatum ? format(vonDatum, "PPP", { locale: de }) : <span>Datum wählen</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={vonDatum} onSelect={setVonDatum} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bis">Bis</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="bis"
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !bisDatum && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {bisDatum ? format(bisDatum, "PPP", { locale: de }) : <span>Datum wählen</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={bisDatum}
                    onSelect={setBisDatum}
                    initialFocus
                    disabled={(date) => (vonDatum ? date < vonDatum : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <RadioGroupItem value="jahresbereich" id="jahresbereich" />
          <Label htmlFor="jahresbereich">Jahresbereich</Label>
        </div>

        {zeitraumTyp === "jahresbereich" && (
          <div className="ml-6 space-y-6">
            <div className="pt-4">
              <Slider
                defaultValue={[jahresBereich[0], jahresBereich[1]]}
                min={1900}
                max={aktuellesJahr}
                step={1}
                onValueChange={handleJahresBereichChange}
                className="w-full"
              />
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{jahresBereich[0]}</span>
              <span className="font-medium">{jahresBereich[1]}</span>
            </div>
          </div>
        )}
      </RadioGroup>
    </div>
  )
}
