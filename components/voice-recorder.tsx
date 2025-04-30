"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Pause, Play, Square, Save, Plus, Trash2, Headphones } from "lucide-react"
import { useAudioRecorder, formatRecordingTime } from "@/hooks/use-audio-recorder"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void
  maxDurationSeconds?: number
  maxFileSizeMB?: number
}

export function VoiceRecorder({
  onTranscriptionComplete,
  maxDurationSeconds = 300, // 5 Minuten
  maxFileSizeMB = 10, // 10 MB
}: VoiceRecorderProps) {
  const {
    isRecording,
    isPaused,
    recordingTime,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
    appendRecording,
  } = useAudioRecorder(maxDurationSeconds)

  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcriptionProgress, setTranscriptionProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [savedSegments, setSavedSegments] = useState<{ url: string; duration: number }[]>([])

  // Pulsierender Effekt für den Mikrofon-Button
  const [isPulsing, setIsPulsing] = useState(false)

  useEffect(() => {
    if (isRecording && !isPaused) {
      const interval = setInterval(() => {
        setIsPulsing((prev) => !prev)
      }, 500)
      return () => clearInterval(interval)
    }
    setIsPulsing(false)
  }, [isRecording, isPaused])

  // Simuliere die Transkription
  const transcribeAudio = async () => {
    if (!audioBlob) return

    // Prüfe die Dateigröße
    const fileSizeInMB = audioBlob.size / (1024 * 1024)
    if (fileSizeInMB > maxFileSizeMB) {
      setError(`Die Audiodatei ist zu groß (${fileSizeInMB.toFixed(2)} MB). Maximale Größe: ${maxFileSizeMB} MB.`)
      return
    }

    setIsTranscribing(true)
    setTranscriptionProgress(0)

    try {
      // Simuliere API-Aufruf mit Fortschritt
      const simulateProgress = () => {
        let progress = 0
        const interval = setInterval(() => {
          progress += 10
          setTranscriptionProgress(progress)
          if (progress >= 100) {
            clearInterval(interval)

            // Simuliere eine Transkription
            const transcribedText = `[Transkribierte Aufnahme vom ${new Date().toLocaleDateString()} um ${new Date().toLocaleTimeString(
              [],
              { hour: "2-digit", minute: "2-digit" },
            )}, Länge: ${formatRecordingTime(recordingTime)}]\n\nIch hatte ein außergewöhnliches Erlebnis, das ich gerne teilen möchte. Es begann, als ich einen ungewöhnlichen Lichtschein am Himmel bemerkte. Die Lichter bewegten sich in einer Weise, die ich noch nie zuvor gesehen hatte. Es war faszinierend und gleichzeitig etwas beunruhigend. Ich konnte nicht glauben, was ich da sah, und fragte mich, ob andere Menschen es auch beobachtet hatten.`

            onTranscriptionComplete(transcribedText)
            setIsTranscribing(false)
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

  // Speichere das aktuelle Segment
  const saveCurrentSegment = () => {
    if (!audioBlob || !audioUrl) return

    setSavedSegments((prev) => [...prev, { url: audioUrl, duration: recordingTime }])

    // Stoppe die aktuelle Aufnahme, falls sie läuft
    if (isRecording) {
      stopRecording()
    }
  }

  return (
    <div className="space-y-4 mt-4">
      {error && (
        <Alert variant="destructive" className="bg-red-900/50 border-red-800 text-white">
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

      {/* Gespeicherte Segmente */}
      {savedSegments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Gespeicherte Segmente</h4>
          <div className="space-y-2">
            {savedSegments.map((segment, index) => (
              <div key={index} className="bg-slate-800 p-2 rounded-md border border-slate-700 flex items-center">
                <span className="text-xs text-gray-400 mr-2">
                  Segment {index + 1} ({formatRecordingTime(segment.duration)})
                </span>
                <audio src={segment.url} controls className="h-8 flex-1" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aktuelle Aufnahme */}
      {audioUrl && !isRecording && !isTranscribing && (
        <div className="bg-slate-800 p-3 rounded-md border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Aktuelle Aufnahme ({formatRecordingTime(recordingTime)})</span>
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
          <audio src={audioUrl} controls className="w-full h-8" />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {!isRecording && !isTranscribing && !audioBlob && (
          <Button onClick={startRecording} className="bg-primary hover:bg-primary/80 text-white font-medium">
            <Mic className="h-4 w-4 mr-2" />
            Aufnahme starten
          </Button>
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
              className={`relative ${
                isPulsing
                  ? "bg-gradient-to-r from-red-600 to-red-400 border-red-500"
                  : "bg-red-600/70 border-red-500/70"
              } hover:bg-red-500 text-white`}
            >
              <Square className="h-4 w-4 mr-2" />
              Stoppen
              <span className="ml-2 text-xs">({formatRecordingTime(recordingTime)})</span>
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-400 animate-pulse"></span>
            </Button>
          </>
        )}

        {/* Zeige den Speichern-Button während der Pause an */}
        {isRecording && isPaused && (
          <Button
            onClick={saveCurrentSegment}
            variant="outline"
            className="bg-blue-600/50 border-blue-500/50 hover:bg-blue-500/70 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Segment speichern
          </Button>
        )}

        {audioBlob && !isRecording && !isTranscribing && (
          <>
            <Button onClick={transcribeAudio} className="bg-green-600 hover:bg-green-700 text-white font-medium">
              <Save className="h-4 w-4 mr-2" />
              Transkribieren und einfügen
            </Button>

            <Button
              onClick={saveCurrentSegment}
              variant="outline"
              className="bg-blue-600/50 border-blue-500/50 hover:bg-blue-500/70 text-white"
            >
              <Headphones className="h-4 w-4 mr-2" />
              Als Segment speichern
            </Button>

            <Button
              onClick={appendRecording}
              variant="outline"
              className="bg-white/5 border-white/20 hover:bg-primary/20"
            >
              <Plus className="h-4 w-4 mr-2" />
              Aufnahme fortsetzen
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

      <div className="text-xs text-gray-400">
        Max. Aufnahmedauer: {Math.floor(maxDurationSeconds / 60)} Minuten • Max. Dateigröße: {maxFileSizeMB} MB
      </div>
    </div>
  )
}
