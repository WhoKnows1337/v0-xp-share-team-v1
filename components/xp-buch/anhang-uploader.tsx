"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImageIcon, Mic, X, Play, Pause } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AnhangUploaderProps {
  onImageUpload: (imageUrl: string) => void
  onAudioRecord: (audioUrl: string) => void
  existingImages?: string[]
  existingAudios?: string[]
  onRemoveImage?: (index: number) => void
  onRemoveAudio?: (index: number) => void
}

export function AnhangUploader({
  onImageUpload,
  onAudioRecord,
  existingImages = [],
  existingAudios = [],
  onRemoveImage,
  onRemoveAudio,
}: AnhangUploaderProps) {
  const { toast } = useToast()
  const [isRecording, setIsRecording] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Simuliere Bildupload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // In einer echten Anwendung würde hier der tatsächliche Upload stattfinden
    // Für diese Demo verwenden wir eine lokale URL
    const file = files[0]
    const imageUrl = URL.createObjectURL(file)

    onImageUpload(imageUrl)

    toast({
      title: "Bild hinzugefügt",
      description: "Das Bild wurde erfolgreich hinzugefügt.",
      duration: 3000,
    })

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Simuliere Audioaufnahme
  const handleAudioRecord = () => {
    if (isRecording) {
      // Stoppe Aufnahme
      setIsRecording(false)

      // In einer echten Anwendung würde hier die tatsächliche Aufnahme gestoppt werden
      // Für diese Demo verwenden wir eine Beispiel-Audio-URL
      const audioUrl = "/audio-sample.mp3" // Beispiel-URL

      onAudioRecord(audioUrl)

      toast({
        title: "Aufnahme gespeichert",
        description: "Die Audioaufnahme wurde erfolgreich gespeichert.",
        duration: 3000,
      })
    } else {
      // Starte Aufnahme
      setIsRecording(true)

      toast({
        title: "Aufnahme gestartet",
        description: "Die Audioaufnahme wurde gestartet. Klicke erneut zum Beenden.",
        duration: 3000,
      })
    }
  }

  // Audio abspielen/pausieren
  const toggleAudioPlayback = (index: number, audioUrl: string) => {
    if (audioPlaying === index) {
      // Pausiere aktuelle Wiedergabe
      if (audioRef.current) {
        audioRef.current.pause()
      }
      setAudioPlaying(null)
    } else {
      // Starte neue Wiedergabe
      if (audioRef.current) {
        audioRef.current.pause()
      }

      audioRef.current = new Audio(audioUrl)
      audioRef.current.play()
      audioRef.current.onended = () => setAudioPlaying(null)

      setAudioPlaying(index)
    }
  }

  return (
    <div className="space-y-4">
      {/* Bild-Upload */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <ImageIcon className="h-4 w-4 mr-2" />
            Bild hinzufügen
          </Button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

          <Button type="button" variant={isRecording ? "destructive" : "outline"} size="sm" onClick={handleAudioRecord}>
            <Mic className="h-4 w-4 mr-2" />
            {isRecording ? "Aufnahme beenden" : "Audio aufnehmen"}
          </Button>
        </div>

        {/* Vorhandene Bilder */}
        {existingImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
            {existingImages.map((imageUrl, index) => (
              <div key={`img-${index}`} className="relative group">
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt={`Anhang ${index + 1}`}
                  className="h-24 w-full object-cover rounded-md"
                />
                {onRemoveImage && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onRemoveImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Vorhandene Audioaufnahmen */}
        {existingAudios.length > 0 && (
          <div className="space-y-2 mt-4">
            {existingAudios.map((audioUrl, index) => (
              <Card key={`audio-${index}`}>
                <CardContent className="p-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleAudioPlayback(index, audioUrl)}
                    >
                      {audioPlaying === index ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <span className="text-sm ml-2">Audioaufnahme {index + 1}</span>
                  </div>

                  {onRemoveAudio && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive"
                      onClick={() => onRemoveAudio(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
