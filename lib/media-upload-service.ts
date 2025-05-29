import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export interface MediaFile {
  id: string
  url: string
  type: "image" | "video" | "audio"
  size: number
  name: string
  mimeType: string
  thumbnail?: string
}

export class MediaUploadService {
  private maxFileSize = 50 * 1024 * 1024 // 50MB
  private allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
  private allowedVideoTypes = ["video/mp4", "video/webm", "video/quicktime"]
  private allowedAudioTypes = ["audio/mp3", "audio/wav", "audio/ogg", "audio/m4a"]

  // Datei validieren
  validateFile(file: File): { valid: boolean; error?: string } {
    if (file.size > this.maxFileSize) {
      return { valid: false, error: "Datei ist zu groß (max. 50MB)" }
    }

    const isImage = this.allowedImageTypes.includes(file.type)
    const isVideo = this.allowedVideoTypes.includes(file.type)
    const isAudio = this.allowedAudioTypes.includes(file.type)

    if (!isImage && !isVideo && !isAudio) {
      return { valid: false, error: "Dateityp nicht unterstützt" }
    }

    return { valid: true }
  }

  // Bild komprimieren
  async compressImage(file: File, maxWidth = 1920, quality = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      const img = new Image()

      img.onload = () => {
        // Proportionen berechnen
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio

        // Bild zeichnen
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        // Als Blob konvertieren
        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob!], file.name, {
              type: file.type,
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          },
          file.type,
          quality,
        )
      }

      img.src = URL.createObjectURL(file)
    })
  }

  // Thumbnail generieren
  async generateThumbnail(file: File): Promise<string> {
    if (file.type.startsWith("image/")) {
      return this.generateImageThumbnail(file)
    } else if (file.type.startsWith("video/")) {
      return this.generateVideoThumbnail(file)
    }
    return ""
  }

  private async generateImageThumbnail(file: File): Promise<string> {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      const img = new Image()

      img.onload = () => {
        canvas.width = 200
        canvas.height = 200

        // Zentriert zuschneiden
        const size = Math.min(img.width, img.height)
        const x = (img.width - size) / 2
        const y = (img.height - size) / 2

        ctx.drawImage(img, x, y, size, size, 0, 0, 200, 200)
        resolve(canvas.toDataURL("image/jpeg", 0.7))
      }

      img.src = URL.createObjectURL(file)
    })
  }

  private async generateVideoThumbnail(file: File): Promise<string> {
    return new Promise((resolve) => {
      const video = document.createElement("video")
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!

      video.onloadedmetadata = () => {
        video.currentTime = Math.min(1, video.duration / 2) // Mitte des Videos
      }

      video.onseeked = () => {
        canvas.width = 200
        canvas.height = 200

        const aspectRatio = video.videoWidth / video.videoHeight
        let drawWidth = 200
        let drawHeight = 200
        let offsetX = 0
        let offsetY = 0

        if (aspectRatio > 1) {
          drawHeight = 200 / aspectRatio
          offsetY = (200 - drawHeight) / 2
        } else {
          drawWidth = 200 * aspectRatio
          offsetX = (200 - drawWidth) / 2
        }

        ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight)
        resolve(canvas.toDataURL("image/jpeg", 0.7))
      }

      video.src = URL.createObjectURL(file)
    })
  }

  // Datei hochladen
  async uploadFile(file: File, folder = "media", onProgress?: (progress: UploadProgress) => void): Promise<MediaFile> {
    // Validierung
    const validation = this.validateFile(file)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    // Komprimierung für Bilder
    let processedFile = file
    if (file.type.startsWith("image/")) {
      processedFile = await this.compressImage(file)
    }

    // Eindeutigen Dateinamen generieren
    const fileExt = file.name.split(".").pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // Upload zu Supabase Storage
    const { data, error } = await supabase.storage.from("media").upload(filePath, processedFile, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      throw new Error(`Upload fehlgeschlagen: ${error.message}`)
    }

    // Öffentliche URL abrufen
    const { data: urlData } = supabase.storage.from("media").getPublicUrl(filePath)

    // Thumbnail generieren
    const thumbnail = await this.generateThumbnail(file)

    // MediaFile-Objekt erstellen
    const mediaFile: MediaFile = {
      id: crypto.randomUUID(),
      url: urlData.publicUrl,
      type: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "audio",
      size: processedFile.size,
      name: file.name,
      mimeType: file.type,
      thumbnail: thumbnail || undefined,
    }

    return mediaFile
  }

  // Mehrere Dateien hochladen
  async uploadMultipleFiles(
    files: File[],
    folder = "media",
    onProgress?: (fileIndex: number, progress: UploadProgress) => void,
  ): Promise<MediaFile[]> {
    const results: MediaFile[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        const mediaFile = await this.uploadFile(
          file,
          folder,
          onProgress ? (progress) => onProgress(i, progress) : undefined,
        )
        results.push(mediaFile)
      } catch (error) {
        console.error(`Fehler beim Upload von ${file.name}:`, error)
        throw error
      }
    }

    return results
  }

  // Datei löschen
  async deleteFile(filePath: string): Promise<void> {
    const { error } = await supabase.storage.from("media").remove([filePath])

    if (error) {
      throw new Error(`Löschen fehlgeschlagen: ${error.message}`)
    }
  }
}

export const mediaUploadService = new MediaUploadService()
