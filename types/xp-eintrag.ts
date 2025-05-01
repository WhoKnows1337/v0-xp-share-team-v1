export type MoodType =
  | "glücklich"
  | "zufrieden"
  | "neutral"
  | "nachdenklich"
  | "traurig"
  | "frustriert"
  | "inspiriert"
  | "energiegeladen"
  | "erschöpft"
  | "ängstlich"

export interface XPEintrag {
  id: string
  titel: string
  inhalt: string
  datum: string
  tags?: string[]
  mood?: MoodType | MoodType[]
  privat?: boolean
  entwurf?: boolean
  erstellt: string
  benutzer: {
    id: string
    name: string
    avatar: string
  }
  ort?: {
    name: string
    koordinaten?: [number, number]
  }
  bilder?: string[]
  audio?: string[]
  kommentare?: {
    id: string
    text: string
    datum: string
    benutzer: {
      id: string
      name: string
      avatar: string
    }
  }[]
}

export interface XPStatistik {
  streak: number
  längsteStreak: number
  gesamtEinträge: number
  einträgeProWoche: number
  moodVerteilung: Record<MoodType, number>
  häufigeSymbole: string[]
  häufigeTags: Array<{ tag: string; anzahl: number }>
  täglichesZiel: number
  täglichesZielErreicht: boolean
}
