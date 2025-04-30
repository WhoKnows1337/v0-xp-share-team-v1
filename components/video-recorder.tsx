"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Video, Pause, Play, Square, Save, Trash2, Upload, AlertCircle } from "lucide-react"
import { useVideoRecorder, formatRecordingTime } from "@/hooks/use-video-recorder"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface VideoRecorderProps {
  onRecordingComplete: (videoBlob: Blob, duration: number) => void
  maxDurationSeconds?: number
  maxFileSizeMB?: number
}

export function VideoRecorder({
  onRecordingComplete,
  maxDurationSeconds = 300, // 5 Minuten
  maxFileSizeMB = 50, // 50 MB
}: VideoRecorderProps) {
  const {
    isRecording,
    isPaused,
    recordingTime,
    videoBlob,
    videoUrl,
    stream,
    error: recorderError,
    permissionStatus,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
    checkPermissions,
  } = useVideoRecorder(maxDurationSeconds)

  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcriptionProgress, setTranscriptionProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(false)
  const videoPreviewRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Aktualisiere die Videovorschau, wenn sich die Stream ändert
  useEffect(() => {
    if (videoPreviewRef.current && stream) {
      videoPreviewRef.current.srcObject = stream
    }
  }, [stream])

  // Zeige Recorder-Fehler an
  useEffect(() => {
    if (recorderError) {
      setError(recorderError)
    }
  }, [recorderError])

  // Prüfe Berechtigungen, bevor die Aufnahme gestartet wird
  const handleStartRecording = async () => {
    setIsCheckingPermissions(true)
    setError(null)

    try {
      const hasPermission = await checkPermissions()
      if (hasPermission) {
        await startRecording()
      }
    } catch (err) {
      console.error("Fehler beim Prüfen der Berechtigungen:", err)
      setError("Fehler beim Prüfen der Berechtigungen. Bitte versuche es erneut.")
    } finally {
      setIsCheckingPermissions(false)
    }
  }

  // Simuliere die Transkription
  const transcribeVideo = async () => {
    if (!videoBlob) return

    // Prüfe die Dateigröße
    const fileSizeInMB = videoBlob.size / (1024 * 1024)
    if (fileSizeInMB > maxFileSizeMB) {
      setError(`Die Videodatei ist zu groß (${fileSizeInMB.toFixed(2)} MB). Maximale Größe: ${maxFileSizeMB} MB.`)
      return
    }

    setIsTranscribing(true)
    setTranscriptionProgress(0)

    try {
      // Simuliere API-Aufruf mit Fortschritt
      const simulateProgress = () => {
        let progress = 0
        const interval = setInterval(() => {
          progress += 5
          setTranscriptionProgress(progress)
          if (progress >= 100) {
            clearInterval(interval)
            setIsTranscribing(false)

            // Übergebe das Video an die übergeordnete Komponente
            onRecordingComplete(videoBlob, recordingTime)
          }
        }, 300)
      }

      simulateProgress()
    } catch (error) {
      console.error("Fehler bei der Transkription:", error)
      setError("Bei der Transkription ist ein Fehler aufgetreten. Bitte versuche es erneut.")
      setIsTranscribing(false)
    }
  }

  // Datei-Upload als Fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      // Prüfe, ob es sich um ein Video handelt
      if (!file.type.startsWith("video/")) {
        setError("Bitte wähle eine Videodatei aus.")
        return
      }

      // Prüfe die Dateigröße
      const fileSizeInMB = file.size / (1024 * 1024)
      if (fileSizeInMB > maxFileSizeMB) {
        setError(`Die Videodatei ist zu groß (${fileSizeInMB.toFixed(2)} MB). Maximale Größe: ${maxFileSizeMB} MB.`)
        return
      }

      // Erstelle einen Blob aus der Datei
      const blob = new Blob([file], { type: file.type })

      // Simuliere eine Aufnahmedauer basierend auf der Dateigröße (sehr grobe Schätzung)
      const estimatedDuration = Math.min(Math.floor(fileSizeInMB * 10), maxDurationSeconds)

      // Übergebe das Video an die übergeordnete Komponente
      onRecordingComplete(blob, estimatedDuration)
    }
  }

  return (
    <div className="space-y-4 mt-4">
      {error && (
        <Alert variant="destructive" className="bg-red-900/50 border-red-800 text-white">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-1 right-1 text-white hover:bg-red-800/50"
            onClick={() => setError(null)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </Alert>
      )}

      {/* Videovorschau während der Aufnahme */}
      {isRecording && (
        <div className="relative bg-black rounded-md overflow-hidden aspect-video">
          <video ref={videoPreviewRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center">
            <div className="h-2 w-2 rounded-full bg-white animate-pulse mr-1"></div>
            {formatRecordingTime(recordingTime)}
          </div>
        </div>
      )}

      {/* Aufgenommenes Video */}
      {videoUrl && !isRecording && !isTranscribing && (
        <div className="bg-slate-800 p-3 rounded-md border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Videoaufnahme ({formatRecordingTime(recordingTime)})</span>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                onClick={resetRecording}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <video src={videoUrl} controls className="w-full rounded-md" />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {!isRecording && !isTranscribing && !videoBlob && (
          <>
            <Button
              onClick={handleStartRecording}
              className="bg-primary hover:bg-primary/80 text-white font-medium"
              disabled={isCheckingPermissions || permissionStatus === "unsupported" || permissionStatus === "denied"}
            >
              {isCheckingPermissions ? (
                <>
                  <div className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  Berechtigungen prüfen...
                </>
              ) : (
                <>
                  <Video className="h-4 w-4 mr-2" />
                  Videoaufnahme starten
                </>
              )}
            </Button>

            {/* Fallback für Datei-Upload */}
            <div className="relative">
              <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="bg-white/5 border-white/20 hover:bg-white/10"
              >
                <Upload className="h-4 w-4 mr-2" />
                Video hochladen
              </Button>
            </div>
          </>
        )}

        {isRecording && (
          <>
            <Button
              onClick={isPaused ? resumeRecording : pauseRecording}
              variant="outline"
              className="bg-white/5 border-white/20 hover:bg-white/10"
            >
              {isPaused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
              {isPaused ? "Fortsetzen" : "Pausieren"}
            </Button>

            <Button
              onClick={stopRecording}
              variant="outline"
              className={`relative bg-red-600/70 border-red-500/70 hover:bg-red-500 text-white`}
            >
              <Square className="h-4 w-4 mr-2" />
              Stoppen
              <span className="ml-2 text-xs">({formatRecordingTime(recordingTime)})</span>
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-400 animate-pulse"></span>
            </Button>
          </>
        )}

        {videoBlob && !isRecording && !isTranscribing && (
          <>
            <Button onClick={transcribeVideo} className="bg-green-600 hover:bg-green-700 text-white font-medium">
              <Save className="h-4 w-4 mr-2" />
              Video speichern und transkribieren
            </Button>

            <Button
              onClick={handleStartRecording}
              variant="outline"
              className="bg-white/5 border-white/20 hover:bg-primary/20"
              disabled={permissionStatus === "unsupported" || permissionStatus === "denied"}
            >
              <Video className="h-4 w-4 mr-2" />
              Neue Aufnahme starten
            </Button>
          </>
        )}
      </div>

      {isTranscribing && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Transkription wird erstellt...</span>
            <span>{transcriptionProgress}%</span>
          </div>
          <Progress
            value={transcriptionProgress}
            className="h-2 bg-slate-700"
            indicatorStyle={{
              background: "linear-gradient(90deg, #1e40af, #00ff7f)",
              boxShadow: "0 0 10px rgba(0, 255, 127, 0.5)",
            }}
          />
        </div>
      )}

      {/* Hinweise zu Berechtigungen */}
      {permissionStatus === "denied" && (
        <Alert className="bg-yellow-900/30 border-yellow-800 text-white mt-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Der Zugriff auf Kamera und Mikrofon wurde verweigert. Bitte erlaube den Zugriff in deinen
            Browsereinstellungen, um die Videoaufnahme zu nutzen. Alternativ kannst du ein Video hochladen.
          </AlertDescription>
        </Alert>
      )}

      {permissionStatus === "unsupported" && (
        <Alert className="bg-yellow-900/30 border-yellow-800 text-white mt-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Dein Browser oder Gerät unterstützt keine Videoaufnahme. Bitte verwende einen aktuellen Browser oder lade
            ein Video direkt hoch.
          </AlertDescription>
        </Alert>
      )}

      <div className="text-xs text-gray-400">
        Max. Aufnahmedauer: {Math.floor(maxDurationSeconds / 60)} Minuten • Max. Dateigröße: {maxFileSizeMB} MB
      </div>
    </div>
  )
}
