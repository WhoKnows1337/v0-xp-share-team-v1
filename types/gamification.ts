export interface Quest {
  id: string
  title: string
  description: string
  type: "daily" | "weekly" | "monthly" | "seasonal" | "achievement"
  category: "content" | "social" | "exploration" | "personal" | "community"
  difficulty: "easy" | "medium" | "hard" | "expert"
  rewards: Reward[]
  steps?: QuestStep[]
  progress: number // 0-100
  completed: boolean
  expiresAt?: string
  startedAt?: string
  completedAt?: string
  isNew?: boolean
  isRecommended?: boolean
  requiredLevel?: number
}

export interface QuestStep {
  id: string
  description: string
  completed: boolean
  requiredCount?: number
  currentCount?: number
}

export interface Reward {
  type: "xp" | "badge" | "item" | "feature" | "title" | "currency"
  value: number | string
  icon?: string
  rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary"
}

export interface Season {
  id: string
  name: string
  description: string
  theme: string
  startDate: string
  endDate: string
  rewards: Reward[]
  quests: Quest[]
  isActive: boolean
  progress: number // 0-100
  level: number
  maxLevel: number
}

export interface Leaderboard {
  id: string
  name: string
  description: string
  type: "xp" | "quests" | "badges" | "season" | "custom"
  timeframe: "daily" | "weekly" | "monthly" | "seasonal" | "all-time"
  entries: LeaderboardEntry[]
}

export interface LeaderboardEntry {
  userId: string
  username: string
  avatar?: string
  rank: number
  score: number
  change?: number // Änderung im Vergleich zum vorherigen Zeitraum
}

export interface UserGameStats {
  userId: string
  level: number
  xp: number
  xpToNextLevel: number
  totalXp: number
  questsCompleted: number
  badgesEarned: number
  streak: {
    current: number
    longest: number
    lastActivity: string
  }
  seasonProgress?: {
    seasonId: string
    level: number
    xp: number
    questsCompleted: number
  }
  currency: {
    mana: number
    stardust: number
  }
}

export interface GamificationEvent {
  id: string
  type: "quest_completed" | "level_up" | "badge_earned" | "streak_milestone" | "season_level_up"
  timestamp: string
  data: any
  seen: boolean
}
