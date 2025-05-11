"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TitelSchritt } from "./wizard/titel-schritt"
import { KategorieSchritt } from "./wizard/kategorie-schritt"
import { BeschreibungSchritt } from "./wizard/beschreibung-schritt"
import { DatumOrtSchritt } from "./wizard/datum-ort-schritt"
import { TagsSchritt } from "./wizard/tags-schritt"
import { MedienSchritt } from "./wizard/medien-schritt"
import { PrivatsphareSchritt } from "./wizard/privatsphare-schritt"
import { Zusammenfassung } from "./wizard/zusammenfassung"
import { Progress } from "@/components/ui/progress"
import { Loader2, Save, WifiOff, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { WhiteboardImage } from "./whiteboard/whiteboard"
import { AehnlicheFindenButton } from "./wizard/aehnliche-finden-button"
import { EmotionenSchritt } from "./wizard/emotionen-schritt"

// Scrollbar-Stile für Firefox
const scrollbarStyles = `
  .scrollbar-thin {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
  }
`

// Konstante für localStorage-Keys
const STORAGE_KEY_DATA = "erlebnis-wizard-data"
const STORAGE_KEY_STEP = "erlebnis-wizard-schritt"

export type MediaComment = {
  fileId: string
  comment: string
  timestamp: number
}

// Füge 'emotionen' zur ErlebnisData-Schnittstelle hinzu
export type ErlebnisData = {
  titel: string
  kategorie: string
  unterkategorie?: string // Neue Eigenschaft für Unterkategorien
  beschreibung: string
  datum: Date | undefined
  ort: string
  tags: string[]
  kiTags: string[]
  emotionen: string[] // Neue Eigenschaft für Emotionen
  medien: File[]
  whiteboardImages?: WhiteboardImage[]
  mediaComments?: MediaComment[] // Neue Eigenschaft für Medienkommentare
  privatsphare: "privat" | "link" | "offentlich" | "gruppe"
  gruppenId?: string
  lastUpdated?: number
  autoErkannteKategorie?: string // Neue Eigenschaft für automatisch erkannte Kategorie
}

// Aktualisiere die initialData mit leeren Emotionen
const initialData: ErlebnisData = {
  titel: "",
  kategorie: "automatisch", // Automatisch erkennen als Standard
  unterkategorie: undefined,
  beschreibung: "",
  datum: new Date(), // Aktuelles Datum als Standard
  ort: "",
  tags: [],
  kiTags: [],
  emotionen: [], // Initialisiere leeres Array für Emotionen
  medien: [],
  whiteboardImages: [],
  mediaComments: [], // Initialisiere leeres Array für Kommentare
  privatsphare: "offentlich", // Öffentlich als Standard
  autoErkannteKategorie: undefined, // Wird später durch KI gefüllt
}

interface ErlebnisWizardProps {
  onComplete?: () => void
}

export function ErlebnisWizard({ onComplete }: ErlebnisWizardProps) {
  // Verwende normalen useState für bessere Kontrolle
  const [data, setData] = useState<ErlebnisData>(initialData)
  const [schritt, setSchritt] = useState<number>(0)
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const { toast } = useToast()
  const isOnline = useOnlineStatus()

  // Lade gespeicherte Daten beim ersten Rendern
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      // Lade gespeicherten Schritt
      const savedStep = localStorage.getItem(STORAGE_KEY_STEP)
      if (savedStep) {
        setSchritt(Number.parseInt(savedStep, 10))
      }

      // Lade gespeicherte Daten
      const savedData = localStorage.getItem(STORAGE_KEY_DATA)
      if (savedData) {
        const parsedData = JSON.parse(savedData)

        // Konvertiere das Datum zurück in ein Date-Objekt, falls vorhanden
        if (parsedData.datum) {
          parsedData.datum = new Date(parsedData.datum)
        }

        // Konvertiere die Whiteboard-Daten zurück
        if (parsedData.whiteboardImages) {
          parsedData.whiteboardImages = parsedData.whiteboardImages.map((img: any) => ({
            ...img,
            createdAt: new Date(img.createdAt),
          }))
        }

        // Medien können nicht gespeichert werden, daher behalten wir ein leeres Array
        parsedData.medien = []

        setData(parsedData)
      }
    } catch (error) {
      console.error("Fehler beim Laden der gespeicherten Daten:", error)
    }
  }, [])

  // Automatisches Speichern alle 30 Sekunden
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (data.titel || data.beschreibung || data.kategorie) {
        setAutoSaveStatus("saving")
        const success = saveData()
        if (success) {
          setAutoSaveStatus("saved")
          setTimeout(() => setAutoSaveStatus("idle"), 2000)
        }
      }
    }, 30000)

    return () => clearInterval(autoSaveInterval)
  }, [data])

  // Aktualisierte Schritte mit Emotionen-Schritt nach Beschreibung
  const schritte = [
    { name: "Titel", component: TitelSchritt },
    { name: "Beschreibung", component: BeschreibungSchritt },
    { name: "Emotionen", component: EmotionenSchritt },
    { name: "Kategorie", component: KategorieSchritt },
    { name: "Datum & Ort", component: DatumOrtSchritt },
    { name: "Tags", component: TagsSchritt },
    { name: "Medien", component: MedienSchritt },
    { name: "Privatsphäre", component: PrivatsphareSchritt },
    { name: "Zusammenfassung", component: Zusammenfassung },
  ]

  const CurrentComponent = schritte[schritt].component
  const fortschritt = ((schritt + 1) / schritte.length) * 100

  // Funktion zum manuellen Speichern der Daten
  const saveData = () => {
    if (typeof window === "undefined") return

    try {
      // Speichere den aktuellen Schritt
      localStorage.setItem(STORAGE_KEY_STEP, schritt.toString())

      // Bereite Daten für die Speicherung vor
      const dataToSave = {
        ...data,
        lastUpdated: Date.now(),
        // Medien können nicht gespeichert werden, daher speichern wir nur die Anzahl
        medienCount: data.medien.length,
        // Speichere Whiteboard-Bilder
        whiteboardImages: data.whiteboardImages || [],
      }

      // Speichere die Daten
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(dataToSave))

      return true
    } catch (error) {
      console.error("Fehler beim Speichern der Daten:", error)
      return false
    }
  }

  const updateData = (newData: Partial<ErlebnisData>) => {
    setData((prev) => ({ ...prev, ...newData }))
  }

  const nextStep = () => {
    if (schritt < schritte.length - 1) {
      // Speichere den aktuellen Fortschritt
      const success = saveData()

      if (success) {
        setSchritt(schritt + 1)
        window.scrollTo(0, 0)
      }
    }
  }

  const prevStep = () => {
    if (schritt > 0) {
      // Speichere den aktuellen Fortschritt
      saveData()

      setSchritt(schritt - 1)
      window.scrollTo(0, 0)
    }
  }

  const saveAsDraft = async () => {
    setIsSaving(true)
    setAutoSaveStatus("saving")

    // Speichere die Daten
    const success = saveData()

    // Simuliere API-Aufruf
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSaving(false)

    if (success) {
      setAutoSaveStatus("saved")
      setTimeout(() => setAutoSaveStatus("idle"), 2000)

      toast({
        title: "Entwurf gespeichert",
        description: "Dein Erlebnis wurde als Entwurf gespeichert.",
      })
    } else {
      setAutoSaveStatus("idle")

      toast({
        title: "Fehler beim Speichern",
        description: "Dein Erlebnis konnte nicht gespeichert werden.",
        variant: "destructive",
      })
    }
  }

  const publish = async () => {
    setIsPublishing(true)
    // Simuliere API-Aufruf
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsPublishing(false)

    toast({
      title: "Erlebnis veröffentlicht",
      description: "Dein Erlebnis wurde erfolgreich veröffentlicht!",
      variant: "success",
    })

    // Lösche die gespeicherten Daten aus dem localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY_DATA)
      localStorage.removeItem(STORAGE_KEY_STEP)
    }

    // Zurücksetzen der Daten und des Schritts
    setData(initialData)
    setSchritt(0)

    // Schließe das Modal, wenn ein onComplete-Handler übergeben wurde
    if (onComplete) {
      console.log("ErlebnisWizard: Rufe onComplete-Handler auf")
      onComplete()
    }
  }

  // Funktion zum Zurücksetzen des Formulars
  const resetForm = () => {
    if (confirm("Möchtest du wirklich alle Eingaben löschen und von vorne beginnen?")) {
      // Lösche die gespeicherten Daten aus dem localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY_DATA)
        localStorage.removeItem(STORAGE_KEY_STEP)
      }

      // Dann setze die States zurück
      setSchritt(0)
      setData(initialData)

      toast({
        title: "Formular zurückgesetzt",
        description: "Alle Eingaben wurden gelöscht.",
      })
    }
  }

  return (
    <>
      {/* Scrollbar-Stile für Webkit-Browser */}
      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
      `}</style>
      <Card className="bg-white/10 backdrop-blur-sm border-none text-white max-h-[90vh] flex flex-col">
        <CardContent className="p-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {/* Fortschrittsanzeige mit mehr Abstand nach oben */}
          <div className="mb-6 mt-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                {schritt > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevStep}
                    className="h-6 w-6 mr-2 rounded-full bg-slate-800/60 hover:bg-primary/60 text-white border border-slate-700/50 shadow-sm transition-all duration-200"
                    aria-label="Zurück zum vorherigen Schritt"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </Button>
                )}
                <span className="text-sm font-medium">
                  Schritt {schritt + 1} von {schritte.length}: {schritte[schritt].name}
                </span>
                {schritt < schritte.length - 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextStep}
                    className="h-6 w-6 ml-2 rounded-full bg-slate-800/60 hover:bg-primary/60 text-white border border-slate-700/50 shadow-sm transition-all duration-200"
                    aria-label="Weiter zum nächsten Schritt"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                {autoSaveStatus === "saving" && <span className="text-sm text-gray-400">Speichern...</span>}
                {autoSaveStatus === "saved" && (
                  <span className="text-sm text-green-400 flex items-center">
                    <Check className="h-3 w-3 mr-1" /> Gespeichert
                  </span>
                )}
                {data.lastUpdated && autoSaveStatus === "idle" && (
                  <span className="text-sm text-gray-400">
                    Zuletzt gespeichert: {new Date(data.lastUpdated).toLocaleTimeString()}
                  </span>
                )}
                <span className="text-sm">{Math.round(fortschritt)}%</span>
              </div>
            </div>
            <Progress
              value={fortschritt}
              className="h-2 bg-white/10"
              indicatorStyle={{
                background: "linear-gradient(90deg, #1e40af, #00ff7f)",
                boxShadow: "0 0 10px rgba(0, 255, 127, 0.5)",
              }}
            />
          </div>

          {!isOnline && (
            <Alert className="mb-4 bg-yellow-900/30 border-yellow-800 text-white">
              <WifiOff className="h-4 w-4 mr-2" />
              <AlertDescription>
                Du bist offline. Deine Änderungen werden lokal gespeichert und automatisch synchronisiert, sobald du
                wieder online bist.
              </AlertDescription>
            </Alert>
          )}

          {/* Aria-live Region für Screenreader-Ankündigungen */}
          <div className="sr-only" aria-live="polite">
            Schritt {schritt + 1} von {schritte.length}: {schritte[schritt].name}
          </div>

          <div role="form" aria-label={`Erlebnis erstellen: ${schritte[schritt].name}`} className="mb-20">
            <CurrentComponent data={data} updateData={updateData} />
          </div>
        </CardContent>

        <div className="flex justify-between p-4 border-t border-white/10 bg-black/20 sticky bottom-0">
          <div className="flex items-center flex-wrap gap-2">
            {schritt > 0 && (
              <Button
                variant="ghost"
                onClick={prevStep}
                className="border border-white text-white hover:bg-white/20"
                aria-label="Zurück zum vorherigen Schritt"
              >
                Zurück
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={saveAsDraft}
              disabled={isSaving}
              className="border border-white text-white hover:bg-white/20"
              aria-label="Als Entwurf speichern"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Speichern...</span>
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  <span>Als Entwurf speichern</span>
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={resetForm}
              className="border border-red-500 text-red-400 hover:bg-red-900/20"
              aria-label="Formular zurücksetzen"
            >
              Zurücksetzen
            </Button>

            {/* Füge den "Ähnliche finden"-Button hinzu, aber nur im Zusammenfassungs-Schritt */}
            {schritt === schritte.length - 1 && (
              <div className="ml-0 sm:ml-2 mt-2 sm:mt-0">
                <AehnlicheFindenButton data={data} />
              </div>
            )}
          </div>
          <div>
            {schritt < schritte.length - 1 ? (
              <Button
                onClick={nextStep}
                className="bg-primary hover:bg-primary/80 text-white"
                variant="default"
                aria-label="Weiter zum nächsten Schritt"
              >
                Weiter
              </Button>
            ) : (
              <Button
                onClick={publish}
                disabled={isPublishing || !isOnline}
                className="bg-green-600 hover:bg-green-700 text-white"
                variant="default"
                aria-label="Erlebnis veröffentlichen"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Veröffentlichen...</span>
                  </>
                ) : (
                  <>
                    {isOnline ? (
                      <span>Veröffentlichen</span>
                    ) : (
                      <>
                        <WifiOff className="mr-2 h-4 w-4" />
                        <span>Offline (nicht verfügbar)</span>
                      </>
                    )}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </>
  )
}
