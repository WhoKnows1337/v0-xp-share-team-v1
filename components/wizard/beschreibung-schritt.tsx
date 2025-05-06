"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { ErlebnisData } from "../erlebnis-wizard"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Mic, Video, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VoiceRecorder } from "@/components/voice-recorder"
import { VideoRecorder } from "@/components/video-recorder"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BeschreibungSchrittProps {
  data: ErlebnisData
  updateData: (data: Partial<ErlebnisData>) => void
}

export function BeschreibungSchritt({ data, updateData }: BeschreibungSchrittProps) {
  const [error, setError] = useState("")
  const [touched, setTouched] = useState(false)
  const [showMediaRecorder, setShowMediaRecorder] = useState(false)
  const [activeTab, setActiveTab] = useState<"audio" | "video">("audio")
  const [charCount, setCharCount] = useState(data.beschreibung.length)
  const [isValid, setIsValid] = useState(data.beschreibung.length >= 50)

  const validateDescription = (description: string): string => {
    if (description.trim().length === 0) {
      return "Bitte beschreibe dein Erlebnis."
    }
    if (description.trim().length < 50) {
      return "Die Beschreibung sollte mindestens 50 Zeichen lang sein."
    }
    if (description.trim().length > 10000) {
      return "Die Beschreibung darf maximal 10.000 Zeichen lang sein."
    }
    return ""
  }

  useEffect(() => {
    if (touched) {
      const validationError = validateDescription(data.beschreibung)
      setError(validationError)
      setIsValid(!validationError)
    }
    setCharCount(data.beschreibung.length)
  }, [data.beschreibung, touched])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    updateData({ beschreibung: newValue })

    if (!touched && newValue.length > 0) {
      setTouched(true)
    }
  }

  const handleTranscriptionComplete = (text: string) => {
    // Füge die Transkription zur bestehenden Beschreibung hinzu oder ersetze sie
    const newText = data.beschreibung ? `${data.beschreibung}\n\n${text}` : text
    updateData({ beschreibung: newText })
    setTouched(true)
    setShowMediaRecorder(false)
  }

  const handleVideoRecordingComplete = (videoBlob: Blob, duration: number) => {
    // Erstelle einen Dateinamen für das Video
    const fileName = `Videoaufnahme_${new Date().toISOString().replace(/[:.]/g, "-")}.webm`

    // Erstelle eine File aus dem Blob
    const videoFile = new File([videoBlob], fileName, {
      type: "video/webm",
      lastModified: Date.now(),
    })

    // Füge das Video zu den Medien hinzu
    updateData({
      medien: [...data.medien, videoFile],
      // Füge einen Hinweis in die Beschreibung ein
      beschreibung:
        data.beschreibung +
        `\n\n[Video aufgenommen: ${fileName}, Dauer: ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, "0")} Minuten]`,
    })

    // Schließe den Recorder
    setShowMediaRecorder(false)

    // Zeige eine Erfolgsmeldung
    alert("Video wurde aufgenommen und wird in den Medien gespeichert. Die Transkription wird später verfügbar sein.")
  }

  // Funktion zur Bestimmung der erkannten Kategorie basierend auf der Beschreibung
  const getErkannteKategorie = () => {
    const text = data.beschreibung.toLowerCase()
    if (text.includes("traum")) {
      return "Traum - Luzider Traum"
    } else if (text.includes("meditation")) {
      return "Meditation - Tiefenmeditation"
    } else if (text.includes("licht")) {
      return "UFO-Sichtung - Lichtphänomene"
    } else {
      return "Spirituelle Erfahrung - Bewusstseinserweiterung"
    }
  }

  // Berechne die Qualität der Beschreibung basierend auf der Länge und Schlüsselwörtern
  const getDescriptionQuality = (): { quality: "basic" | "good" | "excellent"; message: string } => {
    const text = data.beschreibung.toLowerCase()
    const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length

    if (wordCount < 30) {
      return {
        quality: "basic",
        message: "Grundlegende Beschreibung. Füge mehr Details hinzu, um dein Erlebnis besser zu vermitteln.",
      }
    } else if (wordCount < 100) {
      return {
        quality: "good",
        message: "Gute Beschreibung. Überlege, ob du noch emotionale oder sensorische Details hinzufügen möchtest.",
      }
    } else {
      return {
        quality: "excellent",
        message:
          "Ausgezeichnete Beschreibung! Deine detaillierte Schilderung wird anderen helfen, dein Erlebnis nachzuvollziehen.",
      }
    }
  }

  const descriptionQuality = getDescriptionQuality()

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold mb-2">Beschreibe dein Erlebnis</h3>
        <p className="text-gray-300 mb-4">
          Teile deine Erfahrung so detailliert wie möglich. Was ist passiert? Wie hast du dich gefühlt? Was war
          besonders bemerkenswert?
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="beschreibung" className="flex items-center">
            Beschreibung
            <span className="text-red-400 ml-1" aria-hidden="true">
              *
            </span>
            <span className="sr-only">Pflichtfeld</span>
          </Label>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white"
              onClick={() => setShowMediaRecorder(!showMediaRecorder)}
            >
              {showMediaRecorder ? "Aufnahme ausblenden" : "Per Sprache/Video beschreiben"}
            </Button>
          </div>
        </div>

        <div className="relative">
          <Textarea
            id="beschreibung"
            placeholder="Beschreibe dein Erlebnis ausführlich. Je mehr Details du teilst, desto wertvoller ist dein Beitrag für die Community."
            value={data.beschreibung}
            onChange={handleChange}
            onBlur={() => setTouched(true)}
            className={`min-h-[200px] bg-white/5 border-white/20 text-white pr-24 ${error ? "border-red-500 focus:border-red-500" : ""}`}
            rows={10}
            aria-invalid={!!error}
            aria-describedby={error ? "beschreibung-error" : "beschreibung-hint"}
          />

          {/* Aufnahme-Buttons innerhalb des Textfeldes */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                setShowMediaRecorder(!showMediaRecorder)
                setActiveTab("audio")
              }}
              className={`flex items-center justify-center w-8 h-8 rounded-full shadow-md transition-all 
                ${showMediaRecorder && activeTab === "audio" ? "bg-red-600 hover:bg-red-700" : "bg-red-600 hover:bg-red-500"}
                focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-800`}
              aria-label="Sprachaufnahme"
            >
              <Mic className="h-4 w-4 text-white" />
            </button>

            <button
              type="button"
              onClick={() => {
                setShowMediaRecorder(!showMediaRecorder)
                setActiveTab("video")
              }}
              className={`flex items-center justify-center w-8 h-8 rounded-full shadow-md transition-all 
                ${showMediaRecorder && activeTab === "video" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-500"}
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800`}
              aria-label="Videoaufnahme"
            >
              <Video className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <span
            id="beschreibung-hint"
            className={`${
              charCount === 0
                ? "text-gray-400"
                : charCount < 50
                  ? "text-red-400"
                  : charCount > 9000
                    ? "text-amber-400"
                    : "text-green-400"
            }`}
          >
            {charCount} Zeichen
          </span>
          <span className="text-gray-400">
            {charCount < 50 ? `Noch ${50 - charCount} Zeichen bis zum Minimum` : ""}
          </span>
        </div>

        {/* Qualitätsindikator für die Beschreibung */}
        {data.beschreibung.length > 0 && (
          <div
            className={`mt-2 p-2 rounded-md text-sm flex items-start ${
              descriptionQuality.quality === "basic"
                ? "bg-amber-900/20 border border-amber-800/30 text-amber-300"
                : descriptionQuality.quality === "good"
                  ? "bg-blue-900/20 border border-blue-800/30 text-blue-300"
                  : "bg-green-900/20 border border-green-800/30 text-green-300"
            }`}
          >
            <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>{descriptionQuality.message}</span>
          </div>
        )}
      </div>

      {/* Automatisch erkannte Kategorie anzeigen, wenn Beschreibung länger als 50 Zeichen ist */}
      {data.beschreibung.length >= 50 && (
        <div className="mt-4 p-4 bg-green-900/20 border border-green-700/30 rounded-md animate-fadeIn">
          <h4 className="text-green-400 font-medium flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Automatisch erkannte Kategorie
          </h4>
          <div className="mt-2 flex items-center">
            <span className="text-white font-medium">Erkannt:</span>
            <span className="ml-2 text-green-400 font-medium">{getErkannteKategorie()}</span>
          </div>
          <p className="mt-2 text-sm text-green-300/80">
            Diese Kategorie wurde basierend auf deiner Beschreibung automatisch erkannt. Du kannst sie im
            Kategorie-Schritt anpassen.
          </p>
        </div>
      )}

      {showMediaRecorder && (
        <div className="mt-2 p-3 bg-slate-800/50 border border-slate-700/50 rounded-md">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "audio" | "video")}>
            <TabsList className="bg-slate-700 mb-4">
              <TabsTrigger value="audio" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Mic className="h-4 w-4 mr-2" />
                Sprachaufnahme
              </TabsTrigger>
              <TabsTrigger value="video" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Video className="h-4 w-4 mr-2" />
                Videoaufnahme
              </TabsTrigger>
            </TabsList>

            <TabsContent value="audio">
              <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />
            </TabsContent>

            <TabsContent value="video">
              <VideoRecorder onRecordingComplete={handleVideoRecordingComplete} />
            </TabsContent>
          </Tabs>
        </div>
      )}

      {error && touched && (
        <Alert variant="destructive" className="bg-red-900/50 border-red-800 text-white" id="beschreibung-error">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-blue-900/30 p-4 rounded-md border border-blue-800/50 mt-6">
        <h4 className="font-medium mb-2">Tipp</h4>
        <p className="text-sm text-gray-300">
          Versuche, dein Erlebnis chronologisch zu beschreiben. Was geschah vorher, während und nachher? Welche
          Emotionen, Gedanken oder körperlichen Empfindungen hattest du? Gab es Zeugen oder ähnliche Erlebnisse, die du
          bereits hattest?
        </p>
      </div>
    </div>
  )
}
