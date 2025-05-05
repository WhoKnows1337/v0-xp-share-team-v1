export interface LevelInfo {
  level: number
  range: "Novice" | "Explorer" | "Adept" | "Sage" | "Luminary"
  symbol: string
  symbolColor: string
  currentXP: number
  nextLevelXP: number
  totalXP: number
  unlocks: string[]
}

export interface Badge {
  id: string
  name: string
  description: string
  type: "Milestone" | "Streak" | "Community" | "Event" | "Secret"
  color: string
  icon: string
  earned: boolean
  progress?: {
    current: number
    total: number
  }
  earnedDate?: string
  reward?: {
    type: "XP" | "Mana" | "Stardust" | "Feature"
    value: number | string
  }
}
