"use client"

import type React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import type { ErlebnisData, MediaComment } from "../erlebnis-wizard"
import { Button } from "@/components/ui/button"
import { Upload, X, FileAudio, FileVideo, ImageIcon, PenTool, Download, MessageSquare } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Whiteboard, type WhiteboardImage } from "../whiteboard/whiteboard"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface MedienSchrittProps {
  data: ErlebnisData
  updateData: (data: Partial<ErlebnisData>) => void
}

export function MedienSchritt({ data, updateData }: MedienSchrittProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [viewImage, setViewImage] = useState<WhiteboardImage | null>(null)
  const [viewVideo, setViewVideo] = useState<File | null>(null)
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)
  const [currentFileId, setCurrentFileId] = useState<string>("")
  const [commentText, setCommentText] = useState<string>("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Simuliere Upload
      setUploading(true)
      setUploadProgress(0)

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setUploading(false)
            return 100
          }
          return prev + 10
        })
      }, 300)

      // Füge Dateien zum State hinzu
      const newFiles = Array.from(e.target.files)
      updateData({ medien: [...data.medien, ...newFiles] })
    }
  }

  const removeFile = (index: number) => {
    const updatedFiles = [...data.medien]
    const removedFile = updatedFiles[index]
    updatedFiles.splice(index, 1)
    updateData({ medien: updatedFiles })

    // Entferne auch das entsprechende Whiteboard-Bild, falls vorhanden
    if (data.whiteboardImages && data.whiteboardImages[index]) {
      const updatedWhiteboardImages = [...data.whiteboardImages]
      updatedWhiteboardImages.splice(index, 1)
      updateData({ whiteboardImages: updatedWhiteboardImages })
    }

    // Entferne zugehörige Kommentare
    if (data.mediaComments && data.mediaComments.length > 0) {
      const fileId = getFileId(removedFile)
      const updatedComments = data.mediaComments.filter((comment) => comment.fileId !== fileId)
      updateData({ mediaComments: updatedComments })
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="h-5 w-5" />
    if (file.type.startsWith("audio/")) return <FileAudio className="h-5 w-5" />
    if (file.type.startsWith("video/")) return <FileVideo className="h-5 w-5" />
    return null
  }

  // Whiteboard-Funktionalität
  const handleSaveWhiteboard = (image: WhiteboardImage) => {
    // Speichere das Whiteboard-Bild
    const updatedWhiteboardImages = [...(data.whiteboardImages || []), image]
    updateData({ whiteboardImages: updatedWhiteboardImages })

    // Konvertiere das Whiteboard-Bild in eine File-Instanz
    fetch(image.dataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        // Übergebe lastModified als Teil des Options-Objekts bei der Erstellung
        const file = new File([blob], `${image.name}.png`, {
          type: "image/png",
          lastModified: image.createdAt.getTime(),
        })

        // Füge die Datei zu den Medien hinzu
        updateData({ medien: [...data.medien, file] })
      })
      .catch((err) => console.error("Fehler beim Konvertieren des Whiteboard-Bildes:", err))
  }

  // Finde das Whiteboard-Bild für eine bestimmte Datei
  const findWhiteboardImage = (file: File): WhiteboardImage | undefined => {
    if (!data.whiteboardImages) return undefined

    // Versuche, das passende Whiteboard-Bild anhand des Namens zu finden
    return data.whiteboardImages.find((img) => file.name === `${img.name}.png` || file.name.includes(img.id))
  }

  // Formatiere das Datum ohne Sekunden
  const formatTime = (date: Date): string => {
    return `${date.toLocaleDateString()} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
  }

  // Generiere eine eindeutige ID für eine Datei
  const getFileId = (file: File): string => {
    return `${file.name}-${file.lastModified}`
  }

  // Finde den Kommentar für eine bestimmte Datei
  const findComment = (file: File): MediaComment | undefined => {
    if (!data.mediaComments) return undefined
    const fileId = getFileId(file)
    return data.mediaComments.find((comment) => comment.fileId === fileId)
  }

  // Öffne den Kommentar-Dialog für eine Datei
  const openCommentDialog = (file: File) => {
    const fileId = getFileId(file)
    setCurrentFileId(fileId)

    // Lade vorhandenen Kommentar, falls vorhanden
    const existingComment = findComment(file)
    setCommentText(existingComment?.comment || "")

    setCommentDialogOpen(true)
  }

  // Speichere den Kommentar
  const saveComment = () => {
    if (!currentFileId || !commentText.trim()) {
      setCommentDialogOpen(false)
      return
    }

    const newComment: MediaComment = {
      fileId: currentFileId,
      comment: commentText.trim(),
      timestamp: Date.now(),
    }

    // Aktualisiere bestehenden Kommentar oder füge neuen hinzu
    const existingComments = data.mediaComments || []
    const commentIndex = existingComments.findIndex((c) => c.fileId === currentFileId)

    if (commentIndex >= 0) {
      // Aktualisiere bestehenden Kommentar
      const updatedComments = [...existingComments]
      updatedComments[commentIndex] = newComment
      updateData({ mediaComments: updatedComments })
    } else {
      // Füge neuen Kommentar hinzu
      updateData({ mediaComments: [...existingComments, newComment] })
    }

    setCommentDialogOpen(false)
    setCommentText("")
    setCurrentFileId("")
  }

  // Prüfe, ob eine Datei ein Video ist
  const isVideo = (file: File): boolean => {
    return file.type.startsWith("video/")
  }

  // Öffne die Videovorschau
  const openVideoPreview = (file: File) => {
    setViewVideo(file)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold mb-2">Füge Medien hinzu (optional)</h3>
        <p className="text-gray-300 mb-4">
          Du kannst Bilder, Audio, Videos oder Zeichnungen hochladen, die dein Erlebnis dokumentieren oder illustrieren.
        </p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="bg-slate-700 mb-4">
          <TabsTrigger value="upload" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Dateien hochladen
          </TabsTrigger>
          <TabsTrigger value="whiteboard" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <PenTool className="h-4 w-4 mr-2" />
            Whiteboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="medien">Medien hochladen</Label>

            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center bg-white/5">
              <input
                id="medien"
                type="file"
                multiple
                accept="image/*,audio/*,video/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
              <Label htmlFor="medien" className="cursor-pointer block">
                <Upload className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                <p className="mb-1 font-medium">Dateien hier ablegen oder klicken zum Auswählen</p>
                <p className="text-sm text-gray-400">Unterstützte Formate: JPG, PNG, GIF, MP3, MP4, WEBM (max. 50MB)</p>
              </Label>
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Wird hochgeladen...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2 bg-gray-700" />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="whiteboard" className="space-y-4">
          <Whiteboard onSave={handleSaveWhiteboard} />
        </TabsContent>
      </Tabs>

      {data.medien.length > 0 && (
        <div className="space-y-2 mt-6">
          <Label>Hochgeladene Dateien</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.medien.map((file, index) => {
              const whiteboardImage = findWhiteboardImage(file)
              const isWhiteboardImage = !!whiteboardImage
              const isVideoFile = isVideo(file)
              const fileComment = findComment(file)

              return (
                <div key={index} className="bg-slate-800 rounded-md border border-slate-700 overflow-hidden relative">
                  {isWhiteboardImage ? (
                    // Whiteboard-Vorschau
                    <div className="flex flex-col">
                      <div className="cursor-pointer" onClick={() => setViewImage(whiteboardImage)}>
                        <div className="bg-white w-full h-[120px] flex items-center justify-center">
                          <img
                            src={whiteboardImage.thumbnail || "/placeholder.svg"}
                            alt={whiteboardImage.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="p-3 bg-slate-800">
                          <h4 className="font-medium truncate">{whiteboardImage.name}</h4>
                          <p className="text-xs text-gray-400 truncate">{formatTime(whiteboardImage.createdAt)}</p>
                          {whiteboardImage.note && (
                            <p className="text-sm text-gray-300 mt-1 line-clamp-1">{whiteboardImage.note}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : isVideoFile ? (
                    // Video-Vorschau
                    <div className="flex flex-col">
                      <div className="cursor-pointer" onClick={() => openVideoPreview(file)}>
                        <div className="bg-black w-full h-[120px] flex items-center justify-center relative">
                          <FileVideo className="h-10 w-10 text-gray-400" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center">
                              <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[16px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-slate-800">
                          <h4 className="font-medium truncate">{file.name}</h4>
                          <p className="text-xs text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB •{" "}
                            {new Date(file.lastModified).toLocaleDateString()}
                          </p>
                          {fileComment && (
                            <p className="text-sm text-gray-300 mt-1 line-clamp-1">{fileComment.comment}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Standard-Datei-Ansicht
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center">
                        {getFileIcon(file)}
                        <span className="ml-2 text-sm truncate max-w-[200px] md:max-w-md">{file.name}</span>
                        <span className="ml-2 text-xs text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-2 right-2 flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openCommentDialog(file)}
                      className="text-gray-400 hover:text-white hover:bg-blue-900/30"
                      title="Kommentar hinzufügen"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-white hover:bg-red-900/30"
                      title="Datei entfernen"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Kommentar-Anzeige */}
                  {fileComment && (
                    <div className="px-3 pb-2 pt-1">
                      <div className="text-xs text-gray-400 flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        <span className="line-clamp-1">{fileComment.comment}</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Dialog für Vollbild-Ansicht von Whiteboard-Bildern */}
      <Dialog open={!!viewImage} onOpenChange={(open) => !open && setViewImage(null)}>
        <DialogContent className="max-w-4xl bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle>{viewImage?.name}</DialogTitle>
            <DialogDescription>Vollbildansicht des Whiteboard-Bildes</DialogDescription>
          </DialogHeader>

          <div className="bg-white rounded-md overflow-hidden">
            <img
              src={viewImage?.dataUrl || "/placeholder.svg"}
              alt={viewImage?.name}
              className="w-full object-contain"
              style={{ maxHeight: "70vh" }}
            />
          </div>

          {viewImage?.note && (
            <div className="mt-2 p-3 bg-slate-700 rounded-md">
              <h4 className="text-sm font-medium text-gray-300 mb-1">Notiz:</h4>
              <p className="text-white">{viewImage.note}</p>
            </div>
          )}

          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                if (!viewImage) return
                const link = document.createElement("a")
                link.download = `${viewImage.name}.png`
                link.href = viewImage.dataUrl
                link.click()
              }}
              className="bg-white/5 border-white/20"
            >
              <Download className="h-4 w-4 mr-2" />
              Herunterladen
            </Button>
            <Button variant="default" onClick={() => setViewImage(null)}>
              Schließen
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog für Videovorschau */}
      <Dialog open={!!viewVideo} onOpenChange={(open) => !open && setViewVideo(null)}>
        <DialogContent className="max-w-4xl bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle>{viewVideo?.name}</DialogTitle>
            <DialogDescription>Videovorschau</DialogDescription>
          </DialogHeader>

          <div className="bg-black rounded-md overflow-hidden">
            {viewVideo && (
              <video src={URL.createObjectURL(viewVideo)} controls className="w-full" style={{ maxHeight: "70vh" }} />
            )}
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="default" onClick={() => setViewVideo(null)}>
              Schließen
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog für Kommentare */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle>Kommentar hinzufügen</DialogTitle>
            <DialogDescription>Füge einen Kommentar zu dieser Datei hinzu</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="comment">Kommentar zur Datei</Label>
              <Textarea
                id="comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Füge einen Kommentar oder Kontext zu dieser Datei hinzu..."
                className="bg-white/5 border-white/20 text-white"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCommentDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={saveComment}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="bg-blue-900/30 p-4 rounded-md border border-blue-800/50 mt-6">
        <h4 className="font-medium mb-2">Tipp</h4>
        <p className="text-sm text-gray-300">
          Bilder, Videos und Audioaufnahmen können helfen, dein Erlebnis zu veranschaulichen. Du könntest z.B. eine
          Skizze hochladen, wenn du etwas Ungewöhnliches gesehen hast, oder ein Video aufnehmen, um deine Erfahrung
          lebendiger zu beschreiben. Mit dem Whiteboard kannst du direkt eine Zeichnung erstellen, ohne ein externes
          Programm zu verwenden.
        </p>
      </div>
    </div>
  )
}
