"use client"

import { useState, useRef, useEffect } from "react"

interface AudioRecorderState {
  isRecording: boolean
  isPaused: boolean
  recordingTime: number
  audioBlob: Blob | null
  audioUrl: string | null
}

interface UseAudioRecorderReturn extends AudioRecorderState {
  startRecording: () => Promise<void>
  stopRecording: () => void
  pauseRecording: () => void
  resumeRecording: () => void
  resetRecording: () => void
  appendRecording: () => Promise<void>
}

export function useAudioRecorder(maxDurationSeconds = 300): UseAudioRecorderReturn {
  const [state, setState] = useState<AudioRecorderState>({
    isRecording: false,
    isPaused: false,
    recordingTime: 0,
    audioBlob: null,
    audioUrl: null,
  })

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const previousAudioBlobRef = useRef<Blob | null>(null)

  // Bereinige Ressourcen beim Unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (state.audioUrl) {
        URL.revokeObjectURL(state.audioUrl)
      }
    }
  }, [state.audioUrl])

  // Starte die Aufnahme
  const startRecording = async () => {
    try {
      // Stoppe vorherige Aufnahme, falls vorhanden
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      // Fordere Mikrofon-Zugriff an
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Erstelle neuen MediaRecorder
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      // Leere die Chunks, es sei denn, wir fügen an eine bestehende Aufnahme an
      if (!previousAudioBlobRef.current) {
        audioChunksRef.current = []
      }

      // Event-Handler für Daten
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      // Event-Handler für Stop
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        const audioUrl = URL.createObjectURL(audioBlob)

        setState((prev) => ({
          ...prev,
          isRecording: false,
          isPaused: false,
          audioBlob,
          audioUrl,
        }))

        // Speichere die aktuelle Aufnahme für mögliches Anhängen
        previousAudioBlobRef.current = audioBlob
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
      }))
    } catch (error) {
      console.error("Fehler beim Starten der Aufnahme:", error)
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

    if (state.audioUrl) {
      URL.revokeObjectURL(state.audioUrl)
    }

    setState({
      isRecording: false,
      isPaused: false,
      recordingTime: 0,
      audioBlob: null,
      audioUrl: null,
    })

    previousAudioBlobRef.current = null
    audioChunksRef.current = []
  }

  // Füge eine neue Aufnahme an die bestehende an
  const appendRecording = async () => {
    if (!previousAudioBlobRef.current) {
      // Wenn keine vorherige Aufnahme existiert, starte eine neue
      await startRecording()
      return
    }

    // Stoppe die aktuelle Aufnahme, falls sie läuft
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      stopRecording()
    }

    // Starte eine neue Aufnahme, ohne die Chunks zurückzusetzen
    await startRecording()
  }

  return {
    ...state,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
    appendRecording,
  }
}

// Hilfsfunktion zur Formatierung der Aufnahmezeit
export function formatRecordingTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
}
