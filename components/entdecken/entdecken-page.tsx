"use client"

export type Erlebnis = {
  id: string
  titel: string
  kurzfassung: string
  beschreibung?: string
  datum: string
  kategorie: {
    name: string
    icon: string
    farbe: string
  }
  tags: string[]
  ort?: {
    name: string
    koordinaten: {
      lat: number
      lng: number
    }
  }
  autor: {
    name: string
    avatar?: string
  }
  medien: {
    typ: "bild" | "video" | "audio"
    url: string
  }[]
  verifiziert: boolean
  statistik: {
    likes: number
    kommentare: number
    ansichten: number
  }
}
