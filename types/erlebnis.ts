export interface Erlebnis {
  id: string
  titel: string
  beschreibung: string
  datum: Date
  ort: {
    name: string
    koordinaten: {
      lat: number
      lng: number
    }
  }
  kategorie: {
    name: string
    icon: string
    farbe: string
  }
  tags: string[]
  medien: Array<{
    typ: "bild" | "video" | "audio" | "dokument"
    url: string
    beschreibung?: string
  }>
  autor: string
  status: "entwurf" | "veröffentlicht" | "archiviert"
  sichtbarkeit: "öffentlich" | "freunde" | "privat"
  bewertungen: number
  kommentare: number
  erstelltAm: Date
  bearbeitetAm: Date
  zeitstrahl?: Array<{
    zeit: Date
    titel: string
    beschreibung: string
  }>
}
