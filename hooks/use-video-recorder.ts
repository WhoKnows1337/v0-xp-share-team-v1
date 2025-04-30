"use client"

import { useState, useRef, useEffect } from "react"

interface VideoRecorderState {
  isRecording: boolean
  isPaused: boolean
  recordingTime: number
  videoBlob: Blob | null
  videoUrl: string | null
  stream: MediaStream | null
  error: string | null
  permissionStatus: "prompt" | "granted" | "denied" | "unsupported" | "checking"
}

interface UseVideoRecorderReturn extends VideoRecorderState {
  startRecording: () => Promise<void>
  stopRecording: () => void
  pauseRecording: () => void
  resumeRecording: () => void
  resetRecording: () => void
  checkPermissions: () => Promise<boolean>
}

export function useVideoRecorder(maxDurationSeconds = 300): UseVideoRecorderReturn {
  const [state, setState] = useState<VideoRecorderState>({
    isRecording: false,
    isPaused: false,
    recordingTime: 0,
    videoBlob: null,
    videoUrl: null,
    stream: null,
    error: null,
    permissionStatus: "checking",
  })

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const videoChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Prüfe, ob MediaRecorder und getUserMedia unterstützt werden
  useEffect(() => {
    const checkSupport = async () => {
      // Prüfe, ob MediaRecorder und getUserMedia unterstützt werden
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
        setState((prev) => ({
          ...prev,
          error: "Dein Browser unterstützt keine Videoaufnahme.",
          permissionStatus: "unsupported",
        }))
        return
      }

      setState((prev) => ({ ...prev, permissionStatus: "prompt" }))
    }

    checkSupport()
  }, [])

  // Bereinige Ressourcen beim Unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (state.videoUrl) {
        URL.revokeObjectURL(state.videoUrl)
      }
    }
  }, [state.videoUrl])

  // Prüfe Berechtigungen
  const checkPermissions = async (): Promise<boolean> => {
    try {
      // Prüfe, ob MediaRecorder und getUserMedia unterstützt werden
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
        setState((prev) => ({
          ...prev,
          error: "Dein Browser unterstützt keine Videoaufnahme.",
          permissionStatus: "unsupported",
        }))
        return false
      }

      // Versuche, Berechtigungen zu erhalten
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

      // Wenn erfolgreich, stoppe den Stream sofort wieder
      stream.getTracks().forEach((track) => track.stop())

      setState((prev) => ({ ...prev, permissionStatus: "granted", error: null }))
      return true
    } catch (error) {
      console.error("Fehler beim Prüfen der Berechtigungen:", error)

      // Unterscheide zwischen verschiedenen Fehlertypen
      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
          setState((prev) => ({
            ...prev,
            error:
              "Zugriff auf Kamera und Mikrofon wurde verweigert. Bitte erlaube den Zugriff in deinen Browsereinstellungen.",
            permissionStatus: "denied",
          }))
        } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
          setState((prev) => ({
            ...prev,
            error: "Keine Kamera oder Mikrofon gefunden. Bitte stelle sicher, dass die Geräte angeschlossen sind.",
            permissionStatus: "unsupported",
          }))
        } else {
          setState((prev) => ({
            ...prev,
            error: `Fehler beim Zugriff auf Kamera und Mikrofon: ${error.message}`,
            permissionStatus: "denied",
          }))
        }
      } else {
        setState((prev) => ({
          ...prev,
          error: "Ein unbekannter Fehler ist aufgetreten.",
          permissionStatus: "denied",
        }))
      }

      return false
    }
  }

  // Starte die Aufnahme
  const startRecording = async () => {
    try {
      // Setze Fehler zurück
      setState((prev) => ({ ...prev, error: null }))

      // Prüfe Berechtigungen
      const hasPermission = await checkPermissions()
      if (!hasPermission) {
        return
      }

      // Stoppe vorherige Aufnahme, falls vorhanden
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      // Fordere Kamera- und Mikrofon-Zugriff an
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      streamRef.current = stream

      // Erstelle neuen MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" })
      mediaRecorderRef.current = mediaRecorder

      // Leere die Chunks
      videoChunksRef.current = []

      // Event-Handler für Daten
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data)
        }
      }

      // Event-Handler für Stop
      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(videoChunksRef.current, { type: "video/webm" })
        const videoUrl = URL.createObjectURL(videoBlob)

        setState((prev) => ({
          ...prev,
          isRecording: false,
          isPaused: false,
          videoBlob,
          videoUrl,
        }))
      }

      // Starte die Aufnahme
      mediaRecorder.start(1000) // Sammle Daten alle 1 Sekunde

      // Starte den Timer
      let recordingTime = 0
      timerRef.current = setInterval(() => {
        recordingTime += 1
        setState((prev) => ({ ...prev, recordingTime }))

        // Stoppe automatisch, wenn die maximale Dauer erreicht ist
        if (recordingTime >= maxDurationSeconds) {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop()
          }
          if (timerRef.current) {
            clearInterval(timerRef.current)
          }
        }
      }, 1000)

      setState((prev) => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        recordingTime: 0,
        stream,
      }))
    } catch (error) {
      console.error("Fehler beim Starten der Videoaufnahme:", error)

      // Detaillierte Fehlermeldung basierend auf dem Fehlertyp
      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
          setState((prev) => ({
            ...prev,
            error:
              "Zugriff auf Kamera und Mikrofon wurde verweigert. Bitte erlaube den Zugriff in deinen Browsereinstellungen.",
            permissionStatus: "denied",
          }))
        } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
          setState((prev) => ({
            ...prev,
            error: "Keine Kamera oder Mikrofon gefunden. Bitte stelle sicher, dass die Geräte angeschlossen sind.",
            permissionStatus: "unsupported",
          }))
        } else {
          setState((prev) => ({
            ...prev,
            error: `Fehler beim Zugriff auf Kamera und Mikrofon: ${error.message}`,
          }))
        }
      } else {
        setState((prev) => ({
          ...prev,
          error: "Ein unbekannter Fehler ist aufgetreten beim Starten der Aufnahme.",
        }))
      }
    }
  }

  // Stoppe die Aufnahme
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    setState((prev) => ({ ...prev, stream: null }))
  }

  // Pausiere die Aufnahme
  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause()

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      setState((prev) => ({ ...prev, isPaused: true }))
    }
  }

  // Setze die Aufnahme fort
  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume()

      // Starte den Timer wieder
      timerRef.current = setInterval(() => {
        setState((prev) => ({ ...prev, recordingTime: prev.recordingTime + 1 }))

        // Stoppe automatisch, wenn die maximale Dauer erreicht ist
        if (state.recordingTime >= maxDurationSeconds) {
          stopRecording()
        }
      }, 1000)

      setState((prev) => ({ ...prev, isPaused: false }))
    }
  }

  // Setze die Aufnahme zurück
  const resetRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    if (state.videoUrl) {
      URL.revokeObjectURL(state.videoUrl)
    }

    setState({
      isRecording: false,
      isPaused: false,
      recordingTime: 0,
      videoBlob: null,
      videoUrl: null,
      stream: null,
      error: null,
      permissionStatus: "prompt",
    })
  }

  return {
    ...state,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
    checkPermissions,
  }
}

// Hilfsfunktion zur Formatierung der Aufnahmezeit
export function formatRecordingTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
}
