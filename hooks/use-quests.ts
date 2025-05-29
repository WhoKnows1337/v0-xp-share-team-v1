"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export interface Quest {
  id: string
  title: string
  description: string
  type: "daily" | "weekly" | "monthly" | "achievement"
  difficulty: "easy" | "medium" | "hard" | "legendary"
  xpReward: number
  progress: number
  maxProgress: number
  completed: boolean
  expiresAt?: Date
  requirements: string[]
  category: string
}

export function useQuests() {
  const [quests, setQuests] = useState<Quest[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadQuests()
  }, [])

  const loadQuests = async () => {
    setLoading(true)
    try {
      // Mock-Daten für Quests
      const mockQuests: Quest[] = [
        {
          id: "daily-1",
          title: "Erstes Erlebnis des Tages",
          description: "Teile dein erstes Erlebnis heute",
          type: "daily",
          difficulty: "easy",
          xpReward: 50,
          progress: 0,
          maxProgress: 1,
          completed: false,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          requirements: ["Erlebnis erstellen"],
          category: "Aktivität",
        },
        {
          id: "weekly-1",
          title: "Wöchentlicher Explorer",
          description: "Entdecke 10 neue Erlebnisse diese Woche",
          type: "weekly",
          difficulty: "medium",
          xpReward: 200,
          progress: 3,
          maxProgress: 10,
          completed: false,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          requirements: ["10 Erlebnisse ansehen"],
          category: "Entdeckung",
        },
        {
          id: "achievement-1",
          title: "Community Champion",
          description: "Erhalte 50 Likes auf deine Erlebnisse",
          type: "achievement",
          difficulty: "hard",
          xpReward: 500,
          progress: 23,
          maxProgress: 50,
          completed: false,
          requirements: ["50 Likes sammeln"],
          category: "Social",
        },
      ]

      setQuests(mockQuests)
    } catch (error) {
      console.error("Fehler beim Laden der Quests:", error)
    } finally {
      setLoading(false)
    }
  }

  const completeQuest = async (questId: string) => {
    const quest = quests.find((q) => q.id === questId)
    if (!quest || quest.completed) return

    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId
          ? {
              ...q,
              completed: true,
              progress: q.maxProgress,
            }
          : q,
      ),
    )

    toast({
      title: "Quest abgeschlossen!",
      description: `Du hast ${quest.xpReward} XP erhalten!`,
    })
  }

  const claimReward = async (questId: string, xpAmount: number) => {
    // Hier würde normalerweise die XP dem Benutzer gutgeschrieben
    setQuests((prev) => prev.filter((q) => q.id !== questId))

    toast({
      title: "Belohnung erhalten!",
      description: `${xpAmount} XP wurden deinem Konto gutgeschrieben.`,
    })
  }

  const updateQuestProgress = (questId: string, progress: number) => {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId
          ? {
              ...q,
              progress: Math.min(progress, q.maxProgress),
              completed: progress >= q.maxProgress,
            }
          : q,
      ),
    )
  }

  return {
    quests,
    loading,
    completeQuest,
    claimReward,
    updateQuestProgress,
    refreshQuests: loadQuests,
  }
}
