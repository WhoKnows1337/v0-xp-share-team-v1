import { getSupabaseClient } from "./supabase-client"
import { config } from "./config"

export interface MediaFile {
  id: string
  filename: string
  url: string
  type: "image" | "video" | "audio" | "document"
  size: number
  mimeType: string
  created_at: string
  metadata?: {
    width?: number
    height?: number
    duration?: number
    thumbnail?: string
  }
}

class MediaService {
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  private readonly ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
  private readonly ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/mov"]
  private readonly ALLOWED_AUDIO_TYPES = ["audio/mp3", "audio/wav", "audio/ogg"]

  // Upload einer Datei
  async uploadFile(file: File, folder = "uploads"): Promise<MediaFile> {
    // Validierung
    this.validateFile(file)

    if (config.useMockData) {
      return this.mockUpload(file, folder)
    }

    try {
      const supabase = getSupabaseClient()
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      // Upload zu Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage.from("media").upload(filePath, file)

      if (uploadError) throw uploadError

      // Öffentliche URL generieren
      const { data: urlData } = supabase.storage.from("media").getPublicUrl(filePath)

      // Metadaten extrahieren
      const metadata = await this.extractMetadata(file)

      // Datei-Info in Datenbank speichern
      const mediaFile: Omit<MediaFile, "id"> = {
        filename: file.name,
        url: urlData.publicUrl,
        type: this.getFileType(file.type),
        size: file.size,
        mimeType: file.type,
        created_at: new Date().toISOString(),
        metadata,
      }

      const { data: dbData, error: dbError } = await supabase.from("media_files").insert(mediaFile).select().single()

      if (dbError) throw dbError

      return dbData
    } catch (error) {
      console.error("Fehler beim Upload:", error)
      throw error
    }
  }

  // Mock-Upload für Entwicklung
  private mockUpload(file: File, folder: string): MediaFile {
    return {
      id: Date.now().toString(),
      filename: file.name,
      url: URL.createObjectURL(file),
      type: this.getFileType(file.type),
      size: file.size,
      mimeType: file.type,
      created_at: new Date().toISOString(),
      metadata: {
        width: 800,
        height: 600,
      },
    }
  }

  // Validiert eine Datei
  private validateFile(file: File) {
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(`Datei ist zu groß. Maximum: ${this.MAX_FILE_SIZE / 1024 / 1024}MB`)
    }

    const allowedTypes = [...this.ALLOWED_IMAGE_TYPES, ...this.ALLOWED_VIDEO_TYPES, ...this.ALLOWED_AUDIO_TYPES]

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Dateityp nicht unterstützt: ${file.type}`)
    }
  }

  // Bestimmt den Dateityp
  private getFileType(mimeType: string): MediaFile["type"] {
    if (this.ALLOWED_IMAGE_TYPES.includes(mimeType)) return "image"
    if (this.ALLOWED_VIDEO_TYPES.includes(mimeType)) return "video"
    if (this.ALLOWED_AUDIO_TYPES.includes(mimeType)) return "audio"
    return "document"
  }

  // Extrahiert Metadaten aus einer Datei
  private async extractMetadata(file: File): Promise<MediaFile["metadata"]> {
    const metadata: MediaFile["metadata"] = {}

    if (file.type.startsWith("image/")) {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
          resolve({
            width: img.width,
            height: img.height,
          })
        }
        img.onerror = () => resolve({})
        img.src = URL.createObjectURL(file)
      })
    }

    if (file.type.startsWith("video/")) {
      return new Promise((resolve) => {
        const video = document.createElement("video")
        video.onloadedmetadata = () => {
          resolve({
            width: video.videoWidth,
            height: video.videoHeight,
            duration: video.duration,
          })
        }
        video.onerror = () => resolve({})
        video.src = URL.createObjectURL(file)
      })
    }

    if (file.type.startsWith("audio/")) {
      return new Promise((resolve) => {
        const audio = document.createElement("audio")
        audio.onloadedmetadata = () => {
          resolve({
            duration: audio.duration,
          })
        }
        audio.onerror = () => resolve({})
        audio.src = URL.createObjectURL(file)
      })
    }

    return metadata
  }

  // Generiert Thumbnail für Videos
  async generateVideoThumbnail(videoFile: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video")
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        video.currentTime = 1 // 1 Sekunde ins Video
      }

      video.onseeked = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0)
          const thumbnail = canvas.toDataURL("image/jpeg", 0.8)
          resolve(thumbnail)
        } else {
          reject(new Error("Canvas-Kontext nicht verfügbar"))
        }
      }

      video.onerror = () => reject(new Error("Fehler beim Laden des Videos"))
      video.src = URL.createObjectURL(videoFile)
    })
  }

  // Komprimiert ein Bild
  async compressImage(file: File, maxWidth = 1920, quality = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        // Berechne neue Dimensionen
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio

        // Zeichne komprimiertes Bild
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                })
                resolve(compressedFile)
              } else {
                reject(new Error("Komprimierung fehlgeschlagen"))
              }
            },
            "image/jpeg",
            quality,
          )
        } else {
          reject(new Error("Canvas-Kontext nicht verfügbar"))
        }
      }

      img.onerror = () => reject(new Error("Fehler beim Laden des Bildes"))
      img.src = URL.createObjectURL(file)
    })
  }

  // Löscht eine Datei
  async deleteFile(id: string): Promise<boolean> {
    if (config.useMockData) {
      return true
    }

    try {
      const supabase = getSupabaseClient()

      // Hole Datei-Info
      const { data: fileData, error: fetchError } = await supabase
        .from("media_files")
        .select("url")
        .eq("id", id)
        .single()

      if (fetchError) throw fetchError

      // Extrahiere Pfad aus URL
      const url = new URL(fileData.url)
      const path = url.pathname.split("/").slice(-2).join("/") // folder/filename

      // Lösche aus Storage
      const { error: storageError } = await supabase.storage.from("media").remove([path])

      if (storageError) throw storageError

      // Lösche aus Datenbank
      const { error: dbError } = await supabase.from("media_files").delete().eq("id", id)

      if (dbError) throw dbError

      return true
    } catch (error) {
      console.error("Fehler beim Löschen der Datei:", error)
      throw error
    }
  }

  // Holt Datei-Informationen
  async getFile(id: string): Promise<MediaFile | null> {
    if (config.useMockData) {
      return {
        id,
        filename: "mock-file.jpg",
        url: "/placeholder.svg?height=400&width=600",
        type: "image",
        size: 1024000,
        mimeType: "image/jpeg",
        created_at: new Date().toISOString(),
        metadata: { width: 600, height: 400 },
      }
    }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from("media_files").select("*").eq("id", id).single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Fehler beim Abrufen der Datei:", error)
      return null
    }
  }

  // Holt alle Dateien eines Benutzers
  async getUserFiles(userId: string, type?: MediaFile["type"]): Promise<MediaFile[]> {
    if (config.useMockData) {
      return [
        {
          id: "1",
          filename: "meditation.jpg",
          url: "/serene-meditation.png",
          type: "image",
          size: 1024000,
          mimeType: "image/jpeg",
          created_at: "2024-01-15T10:00:00Z",
          metadata: { width: 800, height: 600 },
        },
      ]
    }

    try {
      const supabase = getSupabaseClient()
      let query = supabase
        .from("media_files")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (type) {
        query = query.eq("type", type)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Fehler beim Abrufen der Benutzerdateien:", error)
      throw error
    }
  }

  // Optimiert Bild-URLs für verschiedene Größen
  getOptimizedImageUrl(url: string, width?: number, height?: number, quality?: number): string {
    if (config.useMockData) {
      return `/placeholder.svg?height=${height || 400}&width=${width || 600}`
    }

    // Hier würde normalerweise ein Bildoptimierungsservice verwendet
    const params = new URLSearchParams()
    if (width) params.append("w", width.toString())
    if (height) params.append("h", height.toString())
    if (quality) params.append("q", quality.toString())

    return params.toString() ? `${url}?${params.toString()}` : url
  }

  // Erstellt verschiedene Bildgrößen
  async createImageVariants(file: File): Promise<{ original: File; medium: File; thumbnail: File }> {
    const [medium, thumbnail] = await Promise.all([
      this.compressImage(file, 800, 0.8),
      this.compressImage(file, 300, 0.7),
    ])

    return {
      original: file,
      medium,
      thumbnail,
    }
  }
}

export const mediaService = new MediaService()
