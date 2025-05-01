"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { ErlebnisData } from "../erlebnis-wizard"
import { de } from "date-fns/locale"
import { format, set } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CalendarIcon, Clock, MapPin } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InteractiveMap } from "../map/interactive-map"

interface DatumOrtSchrittProps {
  data: ErlebnisData
  updateData: (data: Partial<ErlebnisData>) => void
}

export function DatumOrtSchritt({ data, updateData }: DatumOrtSchrittProps) {
  // Datum-bezogene States
  const [date, setDate] = useState<Date | undefined>(data.datum)
  const [isTimeSelected, setIsTimeSelected] = useState<boolean>(false)
  const [open, setOpen] = useState(false)

  // Ort-bezogene States
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)

  // Generiere Stunden- und Minutenoptionen
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"))

  // Extrahiere Stunden und Minuten aus dem Datum oder verwende Standardwerte
  const hour = date ? format(date, "HH") : "12"
  const minute = date ? format(date, "mm") : "00"

  // Setze das Datum mit der ausgewählten Zeit
  const setDateWithTime = (newDate: Date | undefined, newHour?: string, newMinute?: string) => {
    if (!newDate) {
      setDate(undefined)
      updateData({ datum: undefined })
      return
    }

    const updatedDate = set(new Date(newDate), {
      hours: newHour ? Number.parseInt(newHour, 10) : date ? date.getHours() : 0,
      minutes: newMinute ? Number.parseInt(newMinute, 10) : date ? date.getMinutes() : 0,
      seconds: 0,
      milliseconds: 0,
    })

    setDate(updatedDate)
    updateData({ datum: updatedDate })
  }

  // Behandle Datumsauswahl
  const handleSelectDate = (selectedDate: Date | undefined) => {
    setDateWithTime(selectedDate)
  }

  // Behandle Zeitauswahl
  const handleTimeChange = (type: "hour" | "minute", value: string) => {
    if (!date) {
      // Wenn kein Datum gesetzt ist, verwende das heutige Datum
      const today = new Date()
      setDateWithTime(today, type === "hour" ? value : undefined, type === "minute" ? value : undefined)
    } else {
      // Aktualisiere die bestehende Zeit
      setDateWithTime(date, type === "hour" ? value : undefined, type === "minute" ? value : undefined)
    }
    setIsTimeSelected(true)
  }

  // Formatiere das Datum für die Anzeige
  const formatDisplayDate = () => {
    if (!date) return "Datum und Uhrzeit auswählen"

    const dateStr = format(date, "PPP", { locale: de })

    if (isTimeSelected) {
      return `${dateStr} um ${format(date, "HH:mm")} Uhr`
    }

    return dateStr
  }

  // Setze den Tab-Status basierend auf der Zeitauswahl
  const [activeTab, setActiveTab] = useState<string>("date")

  useEffect(() => {
    if (isTimeSelected) {
      setActiveTab("time")
    } else {
      setActiveTab("date")
    }
  }, [isTimeSelected])

  // Funktion zum Verarbeiten der Standortauswahl
  const handleLocationSelect = (location: { coordinates: { lat: number; lng: number }; address: string }) => {
    // Prüfe, ob sich die Adresse tatsächlich geändert hat, um unnötige Updates zu vermeiden
    if (data.ort !== location.address) {
      // Aktualisiere den Ort im Formular
      updateData({ ort: location.address })

      // Zeige Erfolgsmeldung
      setSelectedAddress(location.address)
      setShowSuccessMessage(true)

      // Blende die Erfolgsmeldung nach 3 Sekunden aus
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Wann und wo fand dein Erlebnis statt?</h3>
        <p className="text-gray-300 mb-4">
          Gib an, wann und wo du diese Erfahrung gemacht hast. Falls der Ort nicht relevant ist oder du ihn nicht
          angeben möchtest, kannst du das Ort-Feld leer lassen.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Datum-Sektion */}
        <div className="space-y-2">
          <Label>Datum und Uhrzeit des Erlebnisses</Label>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-white/5 border-white/20 text-white hover:bg-white/10",
                  !date && "text-gray-400",
                )}
                aria-label="Datum und Uhrzeit auswählen"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDisplayDate()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
              <Tabs defaultValue="date" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700">
                  <TabsList className="bg-slate-700">
                    <TabsTrigger value="date" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                      Datum
                    </TabsTrigger>
                    <TabsTrigger value="time" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                      Uhrzeit
                    </TabsTrigger>
                  </TabsList>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    Fertig
                  </Button>
                </div>

                <TabsContent value="date" className="p-0 m-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelectDate}
                    locale={de}
                    className="bg-slate-800 text-white"
                    classNames={{
                      day_selected: "bg-primary text-primary-foreground",
                      day_today: "bg-slate-700 text-white",
                      day: "text-white hover:bg-slate-700",
                      day_outside: "text-slate-500 opacity-50",
                      head_cell: "text-slate-400",
                      nav_button: "text-slate-400 hover:bg-slate-700",
                      table: "border-slate-700",
                    }}
                  />
                </TabsContent>

                <TabsContent value="time" className="p-0 m-0">
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-slate-400" />
                        <Label className="text-sm font-medium">Uhrzeit auswählen (optional)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="space-y-1 flex-1">
                          <Label className="text-xs text-slate-400">Stunde</Label>
                          <Select value={hour} onValueChange={(value) => handleTimeChange("hour", value)}>
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue placeholder="Stunde" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-[200px]">
                              {hours.map((h) => (
                                <SelectItem key={h} value={h}>
                                  {h}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center self-end pb-2">
                          <span className="text-white text-xl">:</span>
                        </div>
                        <div className="space-y-1 flex-1">
                          <Label className="text-xs text-slate-400">Minute</Label>
                          <Select value={minute} onValueChange={(value) => handleTimeChange("minute", value)}>
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue placeholder="Minute" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-[200px]">
                              {minutes.map((m) => (
                                <SelectItem key={m} value={m}>
                                  {m}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-700">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsTimeSelected(false)
                          if (date) {
                            const resetTimeDate = set(new Date(date), {
                              hours: 0,
                              minutes: 0,
                              seconds: 0,
                              milliseconds: 0,
                            })
                            setDate(resetTimeDate)
                            updateData({ datum: resetTimeDate })
                          }
                          setActiveTab("date")
                        }}
                        className="text-slate-400 hover:text-white"
                      >
                        Uhrzeit zurücksetzen
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </PopoverContent>
          </Popover>
          <p className="text-xs text-gray-400 mt-1">
            Du kannst optional auch eine Uhrzeit angeben, wenn du dich daran erinnerst.
          </p>
        </div>

        {/* Ort-Sektion */}
        <div className="space-y-2">
          <Label htmlFor="ort">Ort (optional)</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="ort"
              placeholder="z.B. Berlin, Deutschland oder 'zu Hause'"
              value={data.ort}
              onChange={(e) => updateData({ ort: e.target.value })}
              className="pl-10 bg-white/5 border-white/20 text-white"
              aria-describedby="ort-hint"
            />
          </div>
          <p id="ort-hint" className="text-xs text-gray-400">
            Du kannst eine Adresse eingeben oder einen Ort auf der Karte auswählen.
          </p>
        </div>
      </div>

      {/* Erfolgsmeldung bei Standortauswahl */}
      {showSuccessMessage && selectedAddress && (
        <div className="bg-green-900/30 border border-green-800/50 rounded-md p-3 flex items-center animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="bg-green-500/20 rounded-full p-1 mr-3">
            <MapPin className="h-4 w-4 text-green-400" />
          </div>
          <div>
            <p className="text-green-300 font-medium">Standort ausgewählt!</p>
            <p className="text-sm text-green-200/80">{selectedAddress}</p>
          </div>
        </div>
      )}

      {/* Kartenansicht */}
      <div className="mt-4 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        <div className="p-3 bg-slate-700 text-white">
          <h4 className="font-medium">Kartenansicht</h4>
          <p className="text-sm text-gray-300">
            Wähle einen Punkt auf der Karte aus oder nutze deinen aktuellen Standort.
          </p>
        </div>
        <div className="p-4">
          <InteractiveMap onLocationSelect={handleLocationSelect} height="300px" />
        </div>
      </div>

      <div className="bg-blue-900/30 p-4 rounded-md border border-blue-800/50 mt-4">
        <h4 className="font-medium mb-2">Tipp</h4>
        <p className="text-sm text-gray-300">
          Datum und Ort helfen uns, zeitliche und geografische Muster in ähnlichen Erlebnissen zu erkennen. Wenn du das
          genaue Datum nicht kennst, wähle einen ungefähren Zeitpunkt.
        </p>
      </div>
    </div>
  )
}
