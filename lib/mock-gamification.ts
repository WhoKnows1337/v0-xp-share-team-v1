import type { Quest, Season, Leaderboard, UserGameStats, GamificationEvent } from "@/types/gamification"

// Mock-Quests
export const mockQuests: Quest[] = [
  {
    id: "q1",
    title: "Willkommen bei XP Share",
    description: "Schließe die Einführung ab und lerne die Grundfunktionen kennen.",
    type: "achievement",
    category: "exploration",
    difficulty: "easy",
    rewards: [
      { type: "xp", value: 100 },
      { type: "badge", value: "Entdecker", icon: "Compass" },
    ],
    steps: [
      { id: "s1", description: "Profil vervollständigen", completed: true },
      { id: "s2", description: "Erste Erfahrung teilen", completed: false },
      { id: "s3", description: "Einem anderen Benutzer folgen", completed: false },
    ],
    progress: 33,
    completed: false,
    isNew: true,
  },
  {
    id: "q2",
    title: "Tägliche Reflexion",
    description: "Teile eine persönliche Erfahrung oder Reflexion.",
    type: "daily",
    category: "personal",
    difficulty: "easy",
    rewards: [
      { type: "xp", value: 50 },
      { type: "currency", value: 5, icon: "Mana" },
    ],
    progress: 0,
    completed: false,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "q3",
    title: "Soziale Verbindungen",
    description: "Kommentiere 3 Erfahrungen anderer Benutzer.",
    type: "weekly",
    category: "social",
    difficulty: "medium",
    rewards: [
      { type: "xp", value: 150 },
      { type: "badge", value: "Sozialschmetterling", icon: "Users" },
    ],
    steps: [{ id: "s1", description: "Kommentare schreiben", completed: false, requiredCount: 3, currentCount: 1 }],
    progress: 33,
    completed: false,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "q4",
    title: "Traumforscher",
    description: "Dokumentiere 5 Träume in deinem XP-Buch.",
    type: "monthly",
    category: "personal",
    difficulty: "medium",
    rewards: [
      { type: "xp", value: 300 },
      { type: "badge", value: "Traumwandler", icon: "Moon" },
      { type: "feature", value: "Traumanalyse-Tool" },
    ],
    steps: [{ id: "s1", description: "Träume dokumentieren", completed: false, requiredCount: 5, currentCount: 2 }],
    progress: 40,
    completed: false,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "q5",
    title: "Synchronizitäts-Sammler",
    description: "Dokumentiere 3 Synchronizitäten, die du erlebt hast.",
    type: "seasonal",
    category: "exploration",
    difficulty: "hard",
    rewards: [
      { type: "xp", value: 500 },
      { type: "badge", value: "Synchronizitäts-Meister", icon: "Sparkles", rarity: "rare" },
      { type: "currency", value: 50, icon: "Stardust" },
    ],
    steps: [
      { id: "s1", description: "Synchronizitäten dokumentieren", completed: false, requiredCount: 3, currentCount: 1 },
    ],
    progress: 33,
    completed: false,
    isRecommended: true,
  },
  {
    id: "q6",
    title: "Gemeinschafts-Beitragender",
    description: "Nimm an einer Gruppendiskussion teil und teile deine Erkenntnisse.",
    type: "weekly",
    category: "community",
    difficulty: "medium",
    rewards: [
      { type: "xp", value: 200 },
      { type: "currency", value: 15, icon: "Mana" },
    ],
    progress: 0,
    completed: false,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "q7",
    title: "7-Tage-Streak",
    description: "Logge dich 7 Tage in Folge ein und führe eine Aktivität durch.",
    type: "achievement",
    category: "personal",
    difficulty: "medium",
    rewards: [
      { type: "xp", value: 250 },
      { type: "badge", value: "Beständigkeit", icon: "Flame" },
      { type: "currency", value: 25, icon: "Mana" },
    ],
    steps: [{ id: "s1", description: "Tägliche Aktivität", completed: false, requiredCount: 7, currentCount: 5 }],
    progress: 71,
    completed: false,
  },
  {
    id: "q8",
    title: "Meditationsmeister",
    description: "Dokumentiere 10 Meditationserfahrungen.",
    type: "achievement",
    category: "personal",
    difficulty: "hard",
    rewards: [
      { type: "xp", value: 400 },
      { type: "badge", value: "Zen-Meister", icon: "Lotus", rarity: "epic" },
      { type: "title", value: "Erleuchteter" },
    ],
    steps: [
      { id: "s1", description: "Meditationen dokumentieren", completed: false, requiredCount: 10, currentCount: 3 },
    ],
    progress: 30,
    completed: false,
    requiredLevel: 5,
  },
]

// Mock-Seasons
export const mockSeasons: Season[] = [
  {
    id: "s1",
    name: "Innere Reisen",
    description: "Erkunde die Tiefen deines Bewusstseins und teile deine Erkenntnisse.",
    theme: "Bewusstseinserweiterung",
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    rewards: [
      { type: "badge", value: "Innerer Entdecker", icon: "Map", rarity: "epic" },
      { type: "title", value: "Bewusstseinsreisender" },
      { type: "feature", value: "Erweiterte Traumanalyse" },
    ],
    quests: mockQuests.filter((q) => q.type === "seasonal").slice(0, 3),
    isActive: true,
    progress: 25,
    level: 3,
    maxLevel: 50,
  },
  {
    id: "s2",
    name: "Kosmische Verbindungen",
    description: "Entdecke die Verbindungen zwischen dir und dem Universum.",
    theme: "Synchronizität",
    startDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    rewards: [
      { type: "badge", value: "Kosmischer Wanderer", icon: "Star", rarity: "legendary" },
      { type: "title", value: "Sternenwanderer" },
      { type: "feature", value: "Synchronizitäts-Tracker" },
    ],
    quests: [],
    isActive: false,
    progress: 0,
    level: 0,
    maxLevel: 50,
  },
]

// Mock-Leaderboards
export const mockLeaderboards: Leaderboard[] = [
  {
    id: "l1",
    name: "XP-Rangliste",
    description: "Die Benutzer mit der höchsten XP-Punktzahl.",
    type: "xp",
    timeframe: "all-time",
    entries: [
      { userId: "u1", username: "AstralExplorer", avatar: "/diverse-avatars.png", rank: 1, score: 12500, change: 0 },
      { userId: "u2", username: "MeditationsMeister", avatar: "/serene-spirit.png", rank: 2, score: 10800, change: 1 },
      {
        userId: "u3",
        username: "KosmischerWanderer",
        avatar: "/elemental-convergence.png",
        rank: 3,
        score: 9200,
        change: -1,
      },
      {
        userId: "u4",
        username: "SynchronizitätsForscherin",
        avatar: "/thoughtful-gaze.png",
        rank: 4,
        score: 8500,
        change: 0,
      },
      { userId: "u5", username: "TraumDeuter", avatar: "/contemplative-figure.png", rank: 5, score: 7800, change: 2 },
    ],
  },
  {
    id: "l2",
    name: "Quest-Champions",
    description: "Die Benutzer, die die meisten Quests abgeschlossen haben.",
    type: "quests",
    timeframe: "monthly",
    entries: [
      { userId: "u2", username: "MeditationsMeister", avatar: "/serene-spirit.png", rank: 1, score: 45, change: 1 },
      { userId: "u1", username: "AstralExplorer", avatar: "/diverse-avatars.png", rank: 2, score: 42, change: -1 },
      { userId: "u5", username: "TraumDeuter", avatar: "/contemplative-figure.png", rank: 3, score: 38, change: 0 },
      { userId: "u7", username: "TraumReisender", avatar: "/dream-traveler.png", rank: 4, score: 35, change: 3 },
      {
        userId: "u3",
        username: "KosmischerWanderer",
        avatar: "/elemental-convergence.png",
        rank: 5,
        score: 32,
        change: -1,
      },
    ],
  },
  {
    id: "l3",
    name: "Saison: Innere Reisen",
    description: "Die Bestenliste für die aktuelle Saison.",
    type: "season",
    timeframe: "seasonal",
    entries: [
      { userId: "u1", username: "AstralExplorer", avatar: "/diverse-avatars.png", rank: 1, score: 28, change: 0 },
      {
        userId: "u9",
        username: "MeditationsGuide",
        avatar: "/peaceful-meditation-guide.png",
        rank: 2,
        score: 25,
        change: 2,
      },
      { userId: "u2", username: "MeditationsMeister", avatar: "/serene-spirit.png", rank: 3, score: 23, change: -1 },
      { userId: "u11", username: "SeelenWanderer", avatar: "/serene-gaze.png", rank: 4, score: 21, change: 1 },
      { userId: "u5", username: "TraumDeuter", avatar: "/contemplative-figure.png", rank: 5, score: 19, change: -2 },
    ],
  },
]

// Mock-Benutzerstatistiken
export const mockUserGameStats: UserGameStats = {
  userId: "u1",
  level: 8,
  xp: 2450,
  xpToNextLevel: 3000,
  totalXp: 12500,
  questsCompleted: 42,
  badgesEarned: 15,
  streak: {
    current: 7,
    longest: 14,
    lastActivity: new Date().toISOString(),
  },
  seasonProgress: {
    seasonId: "s1",
    level: 3,
    xp: 1250,
    questsCompleted: 8,
  },
  currency: {
    mana: 350,
    stardust: 75,
  },
}

// Mock-Gamification-Events
export const mockGamificationEvents: GamificationEvent[] = [
  {
    id: "e1",
    type: "quest_completed",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    data: {
      questId: "q2",
      questTitle: "Tägliche Reflexion",
      rewards: [
        { type: "xp", value: 50 },
        { type: "currency", value: 5, icon: "Mana" },
      ],
    },
    seen: false,
  },
  {
    id: "e2",
    type: "level_up",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    data: {
      previousLevel: 7,
      newLevel: 8,
      rewards: [
        { type: "feature", value: "Erweiterte Traumanalyse" },
        { type: "currency", value: 50, icon: "Mana" },
      ],
    },
    seen: true,
  },
  {
    id: "e3",
    type: "badge_earned",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    data: {
      badgeId: "b1",
      badgeName: "Traumwandler",
      badgeIcon: "Moon",
      badgeRarity: "rare",
    },
    seen: true,
  },
  {
    id: "e4",
    type: "streak_milestone",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    data: {
      streak: 7,
      rewards: [
        { type: "xp", value: 100 },
        { type: "currency", value: 10, icon: "Mana" },
      ],
    },
    seen: false,
  },
]

// Hilfsfunktionen
export function getActiveQuests(): Quest[] {
  return mockQuests.filter(
    (q) => !q.completed && (q.type === "daily" || q.type === "weekly" || q.type === "monthly" || q.isRecommended),
  )
}

export function getActiveSeason(): Season | undefined {
  return mockSeasons.find((s) => s.isActive)
}

export function getUserQuests(userId: string): Quest[] {
  // In einer echten Anwendung würden wir hier die Quests für den spezifischen Benutzer abrufen
  return mockQuests
}

export function getUserGameStats(userId: string): UserGameStats {
  // In einer echten Anwendung würden wir hier die Statistiken für den spezifischen Benutzer abrufen
  return mockUserGameStats
}

export function getLeaderboard(id: string): Leaderboard | undefined {
  return mockLeaderboards.find((l) => l.id === id)
}

export function getUnseenEvents(userId: string): GamificationEvent[] {
  // In einer echten Anwendung würden wir hier die ungesehenen Ereignisse für den spezifischen Benutzer abrufen
  return mockGamificationEvents.filter((e) => !e.seen)
}

export function calculateXpForLevel(level: number): number {
  // Einfache Formel für die benötigte XP pro Level
  return level * 1000
}

export function calculateLevelFromXp(xp: number): number {
  // Berechne das Level basierend auf der XP
  return Math.floor(xp / 1000) + 1
}
