"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, ImageIcon, Video, Music, X, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { mediaUploadService, type MediaFile, type UploadProgress } from "@/lib/media-upload-service"
import { cn } from "@/lib/utils"

interface MediaUploaderProps {
  onFilesUploaded: (files: MediaFile[]) => void
  maxFiles?: number
  allowedTypes?: ("image" | "video" | "audio")[]
  className?: string
}

export function MediaUploader({
  onFilesUploaded,
  maxFiles = 10,
  allowedTypes = ["image", "video", "audio"],
  className,
}: MediaUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<MediaFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<number, UploadProgress>>({})
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFiles = useCallback(
    async (files: FileList) => {
      if (files.length === 0) return

      const fileArray = Array.from(files)

      // Validierung der Anzahl
      if (uploadedFiles.length + fileArray.length > maxFiles) {
        toast({
          title: "Zu viele Dateien",
          description: `Maximal ${maxFiles} Dateien erlaubt`,
          variant: "destructive",
        })
        return
      }

      setUploading(true)
      const newFiles: MediaFile[] = []

      try {
        for (let i = 0; i < fileArray.length; i++) {
          const file = fileArray[i]

          // Typ-Validierung
          const fileType = file.type.startsWith("image/")
            ? "image"
            : file.type.startsWith("video/")
              ? "video"
              : file.type.startsWith("audio/")
                ? "audio"
                : null

          if (!fileType || !allowedTypes.includes(fileType)) {
            toast({
              title: "Dateityp nicht unterstützt",
              description: `${file.name} wird übersprungen`,
              variant: "destructive",
            })
            continue
          }

          const mediaFile = await mediaUploadService.uploadFile(file, "experiences", (progress) => {
            setUploadProgress((prev) => ({
              ...prev,
              [i]: progress,
            }))
          })

          newFiles.push(mediaFile)
        }

        const allFiles = [...uploadedFiles, ...newFiles]
        setUploadedFiles(allFiles)
        onFilesUploaded(allFiles)

        toast({
          title: "Upload erfolgreich",
          description: `${newFiles.length} Datei(en) hochgeladen`,
        })
      } catch (error) {
        toast({
          title: "Upload fehlgeschlagen",
          description: error instanceof Error ? error.message : "Unbekannter Fehler",
          variant: "destructive",
        })
      } finally {
        setUploading(false)
        setUploadProgress({})
      }
    },
    [uploadedFiles, maxFiles, allowedTypes, onFilesUploaded, toast],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragActive(false)

      if (e.dataTransfer.files) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }, [])

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    onFilesUploaded(newFiles)
  }

  const getFileIcon = (type: MediaFile["type"]) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-5 w-5" />
      case "video":
        return <Video className="h-5 w-5" />
      case "audio":
        return <Music className="h-5 w-5" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload-Bereich */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          uploading && "pointer-events-none opacity-50",
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Upload className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">Dateien hier ablegen oder klicken zum Auswählen</p>
          <p className="text-sm text-muted-foreground text-center">
            Unterstützte Formate: {allowedTypes.join(", ")} • Max. {maxFiles} Dateien • Max. 50MB pro Datei
          </p>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={allowedTypes
              .map((type) => {
                switch (type) {
                  case "image":
                    return "image/*"
                  case "video":
                    return "video/*"
                  case "audio":
                    return "audio/*"
                }
              })
              .join(",")}
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Upload-Fortschritt */}
      {uploading && Object.keys(uploadProgress).length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Upload läuft...</h4>
            {Object.entries(uploadProgress).map(([index, progress]) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Datei {Number.parseInt(index) + 1}</span>
                  <span>{progress.percentage}%</span>
                </div>
                <Progress value={progress.percentage} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Hochgeladene Dateien */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Hochgeladene Dateien ({uploadedFiles.length})</h4>
          <div className="grid gap-2">
            {uploadedFiles.map((file, index) => (
              <Card key={file.id}>
                <CardContent className="flex items-center justify-between p-3">
                  <div className="flex items-center space-x-3">
                    {file.thumbnail ? (
                      <img
                        src={file.thumbnail || "/placeholder.svg"}
                        alt={file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                        {getFileIcon(file.type)}
                      </div>
                    )}

                    <div>
                      <p className="font-medium text-sm truncate max-w-[200px]">{file.name}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {file.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => window.open(file.url, "_blank")}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
