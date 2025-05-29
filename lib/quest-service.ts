import { getSupabaseClient } from "./supabase-client"
import { config } from "./config"

export interface Quest {
  id: string
  title: string
  description: string
  type: "daily" | "weekly" | "achievement" | "special"
  category: string
  difficulty: "easy" | "medium" | "hard"
  xp_reward: number
  requirements: QuestRequirement[]
  progress_current: number
  progress_target: number
  is_completed: boolean
  is_claimed: boolean
  expires_at?: string
  created_at: string
  updated_at: string
}

export interface QuestRequirement {
  type: "create_experience" | "add_tags" | "upload_media" | "share_experience" | "comment" | "like"
  target: number
  current: number
  metadata?: Record<string, any>
}

export interface QuestProgress {
  quest_id: string
  user_id: string
  progress: number
  completed_at?: string
  claimed_at?: string
}

// Mock-Daten für Quests
const mockQuests: Quest[] = [
  {
    id: "quest-1",
    title: "Erste Schritte",
    description: "Erstelle dein erstes Erlebnis",
    type: "achievement",
    category: "onboarding",
    difficulty: "easy",
    xp_reward: 100,
    requirements: [
      {
        type: "create_experience",
        target: 1,
        current: 0,
      },
    ],
    progress_current: 0,
    progress_target: 1,
    is_completed: false,
    is_claimed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "quest-2",
    title: "Täglicher Schreiber",
    description: "Erstelle heute ein Erlebnis",
    type: "daily",
    category: "writing",
    difficulty: "easy",
    xp_reward: 50,
    requirements: [
      {
        type: "create_experience",
        target: 1,
        current: 0,
      },
    ],
    progress_current: 0,
    progress_target: 1,
    is_completed: false,
    is_claimed: false,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "quest-3",
    title: "Wöchentlicher Explorer",
    description: "Erstelle 5 Erlebnisse diese Woche",
    type: "weekly",
    category: "exploration",
    difficulty: "medium",
    xp_reward: 250,
    requirements: [
      {
        type: "create_experience",
        target: 5,
        current: 0,
      },
    ],
    progress_current: 0,
    progress_target: 5,
    is_completed: false,
    is_claimed: false,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

class QuestService {
  async getUserQuests(userId: string): Promise<Quest[]> {
    if (config.useMockData) {
      return mockQuests
    }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("user_quests")
        .select(`
          *,
          quest:quests(*)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error

      return (
        data?.map((item) => ({
          ...item.quest,
          progress_current: item.progress,
          is_completed: item.completed_at !== null,
          is_claimed: item.claimed_at !== null,
        })) || []
      )
    } catch (error) {
      console.error("Fehler beim Abrufen der Benutzer-Quests:", error)
      return []
    }
  }

  async getAvailableQuests(): Promise<Quest[]> {
    if (config.useMockData) {
      return mockQuests.filter((quest) => !quest.is_completed)
    }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("quests")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Fehler beim Abrufen verfügbarer Quests:", error)
      return []
    }
  }

  async updateQuestProgress(userId: string, questId: string, progress: number): Promise<void> {
    if (config.useMockData) {
      const quest = mockQuests.find((q) => q.id === questId)
      if (quest) {
        quest.progress_current = Math.min(progress, quest.progress_target)
        quest.is_completed = quest.progress_current >= quest.progress_target
        quest.updated_at = new Date().toISOString()
      }
      return
    }

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("user_quests").upsert({
        user_id: userId,
        quest_id: questId,
        progress: progress,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Quest-Fortschritts:", error)
      throw error
    }
  }

  async completeQuest(userId: string, questId: string): Promise<Quest | null> {
    if (config.useMockData) {
      const quest = mockQuests.find((q) => q.id === questId)
      if (quest) {
        quest.is_completed = true
        quest.updated_at = new Date().toISOString()
        return quest
      }
      return null
    }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("user_quests")
        .update({
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("quest_id", questId)
        .select(`
          *,
          quest:quests(*)
        `)
        .single()

      if (error) throw error

      return data
        ? {
            ...data.quest,
            progress_current: data.progress,
            is_completed: true,
            is_claimed: data.claimed_at !== null,
          }
        : null
    } catch (error) {
      console.error("Fehler beim Abschließen der Quest:", error)
      return null
    }
  }

  async claimQuestReward(userId: string, questId: string): Promise<number> {
    if (config.useMockData) {
      const quest = mockQuests.find((q) => q.id === questId)
      if (quest && quest.is_completed && !quest.is_claimed) {
        quest.is_claimed = true
        quest.updated_at = new Date().toISOString()
        return quest.xp_reward
      }
      return 0
    }

    try {
      const supabase = getSupabaseClient()

      // Quest als beansprucht markieren
      const { data, error } = await supabase
        .from("user_quests")
        .update({
          claimed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("quest_id", questId)
        .select(`
          quest:quests(xp_reward)
        `)
        .single()

      if (error) throw error

      const xpReward = data?.quest?.xp_reward || 0

      // XP zum Benutzer hinzufügen
      if (xpReward > 0) {
        await supabase.rpc("add_user_xp", {
          user_id: userId,
          xp_amount: xpReward,
        })
      }

      return xpReward
    } catch (error) {
      console.error("Fehler beim Beanspruchen der Quest-Belohnung:", error)
      return 0
    }
  }

  async createQuest(quest: Omit<Quest, "id" | "created_at" | "updated_at">): Promise<Quest> {
    if (config.useMockData) {
      const newQuest: Quest = {
        ...quest,
        id: `quest-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockQuests.push(newQuest)
      return newQuest
    }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("quests")
        .insert({
          ...quest,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Fehler beim Erstellen der Quest:", error)
      throw error
    }
  }

  async deleteQuest(questId: string): Promise<void> {
    if (config.useMockData) {
      const index = mockQuests.findIndex((q) => q.id === questId)
      if (index > -1) {
        mockQuests.splice(index, 1)
      }
      return
    }

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("quests").delete().eq("id", questId)

      if (error) throw error
    } catch (error) {
      console.error("Fehler beim Löschen der Quest:", error)
      throw error
    }
  }

  // Automatische Quest-Generierung
  async generateDailyQuests(): Promise<Quest[]> {
    const dailyQuestTemplates = [
      {
        title: "Täglicher Schreiber",
        description: "Erstelle heute ein Erlebnis",
        category: "writing",
        difficulty: "easy" as const,
        xp_reward: 50,
        requirements: [{ type: "create_experience" as const, target: 1, current: 0 }],
      },
      {
        title: "Tag-Meister",
        description: "Füge 5 Tags zu deinen Erlebnissen hinzu",
        category: "organization",
        difficulty: "easy" as const,
        xp_reward: 30,
        requirements: [{ type: "add_tags" as const, target: 5, current: 0 }],
      },
      {
        title: "Medien-Sammler",
        description: "Lade 3 Bilder oder Videos hoch",
        category: "media",
        difficulty: "medium" as const,
        xp_reward: 75,
        requirements: [{ type: "upload_media" as const, target: 3, current: 0 }],
      },
    ]

    const selectedTemplate = dailyQuestTemplates[Math.floor(Math.random() * dailyQuestTemplates.length)]

    const quest: Omit<Quest, "id" | "created_at" | "updated_at"> = {
      ...selectedTemplate,
      type: "daily",
      progress_current: 0,
      progress_target: selectedTemplate.requirements[0].target,
      is_completed: false,
      is_claimed: false,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }

    return [await this.createQuest(quest)]
  }

  async generateWeeklyQuests(): Promise<Quest[]> {
    const weeklyQuestTemplates = [
      {
        title: "Wöchentlicher Explorer",
        description: "Erstelle 5 Erlebnisse diese Woche",
        category: "exploration",
        difficulty: "medium" as const,
        xp_reward: 250,
        requirements: [{ type: "create_experience" as const, target: 5, current: 0 }],
      },
      {
        title: "Soziale Verbindung",
        description: "Kommentiere 10 Erlebnisse anderer Nutzer",
        category: "social",
        difficulty: "medium" as const,
        xp_reward: 200,
        requirements: [{ type: "comment" as const, target: 10, current: 0 }],
      },
      {
        title: "Teilen ist Kümmern",
        description: "Teile 3 Erlebnisse mit der Community",
        category: "sharing",
        difficulty: "hard" as const,
        xp_reward: 300,
        requirements: [{ type: "share_experience" as const, target: 3, current: 0 }],
      },
    ]

    const selectedTemplate = weeklyQuestTemplates[Math.floor(Math.random() * weeklyQuestTemplates.length)]

    const quest: Omit<Quest, "id" | "created_at" | "updated_at"> = {
      ...selectedTemplate,
      type: "weekly",
      progress_current: 0,
      progress_target: selectedTemplate.requirements[0].target,
      is_completed: false,
      is_claimed: false,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }

    return [await this.createQuest(quest)]
  }
}

export const questService = new QuestService()

// Einzelne Funktionen für externe Verwendung
export const getUserQuests = (userId: string) => questService.getUserQuests(userId)
export const getAvailableQuests = () => questService.getAvailableQuests()
export const updateQuestProgress = (userId: string, questId: string, progress: number) =>
  questService.updateQuestProgress(userId, questId, progress)
export const completeQuest = (userId: string, questId: string) => questService.completeQuest(userId, questId)
export const claimQuestReward = (userId: string, questId: string) => questService.claimQuestReward(userId, questId)
export const createQuest = (quest: Omit<Quest, "id" | "created_at" | "updated_at">) => questService.createQuest(quest)
export const deleteQuest = (questId: string) => questService.deleteQuest(questId)
export const generateDailyQuests = () => questService.generateDailyQuests()
export const generateWeeklyQuests = () => questService.generateWeeklyQuests()
