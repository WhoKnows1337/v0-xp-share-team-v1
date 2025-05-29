"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Star, Clock, Gift, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Quest {
  id: string
  title: string
  description: string
  type: "daily" | "weekly" | "monthly" | "achievement"
  difficulty: "easy" | "medium" | "hard"
  progress: number
  maxProgress: number
  reward: {
    xp: number
    coins?: number
    badge?: string
    item?: string
  }
  isCompleted: boolean
  expiresAt?: Date
  category: string
}

interface Reward {
  id: string
  name: string
  description: string
  type: "badge" | "title" | "avatar" | "theme" | "feature"
  cost: number
  isUnlocked: boolean
  rarity: "common" | "rare" | "epic" | "legendary"
}

export function QuestSystem() {
  const [quests, setQuests] = useState<Quest[]>([])
  const [rewards, setRewards] = useState<Reward[]>([])
  const [userCoins, setUserCoins] = useState(250)
  const { toast } = useToast()

  useEffect(() => {
    // Mock-Daten laden
    setQuests([
      {
        id: "daily-1",
        title: "Erstes Erlebnis des Tages",
        description: "Teile dein erstes Erlebnis heute",
        type: "daily",
        difficulty: "easy",
        progress: 0,
        maxProgress: 1,
        reward: { xp: 50, coins: 10 },
        isCompleted: false,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        category: "Erlebnisse",
      },
      {
        id: "weekly-1",
        title: "Wöchentlicher Explorer",
        description: "Teile 7 Erlebnisse in dieser Woche",
        type: "weekly",
        difficulty: "medium",
        progress: 3,
        maxProgress: 7,
        reward: { xp: 200, coins: 50, badge: "Weekly Explorer" },
        isCompleted: false,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        category: "Erlebnisse",
      },
      {
        id: "social-1",
        title: "Community Helfer",
        description: "Kommentiere 5 Erlebnisse von anderen",
        type: "daily",
        difficulty: "easy",
        progress: 2,
        maxProgress: 5,
        reward: { xp: 75, coins: 15 },
        isCompleted: false,
        category: "Community",
      },
      {
        id: "achievement-1",
        title: "Erster Meilenstein",
        description: "Erreiche Level 5",
        type: "achievement",
        difficulty: "medium",
        progress: 4,
        maxProgress: 5,
        reward: { xp: 500, coins: 100, badge: "Rising Star" },
        isCompleted: false,
        category: "Fortschritt",
      },
    ])

    setRewards([
      {
        id: "badge-1",
        name: "Goldener Explorer",
        description: "Ein prestigeträchtiges Abzeichen für erfahrene Entdecker",
        type: "badge",
        cost: 100,
        isUnlocked: false,
        rarity: "epic",
      },
      {
        id: "theme-1",
        name: "Nacht-Thema",
        description: "Ein elegantes dunkles Design für die App",
        type: "theme",
        cost: 50,
        isUnlocked: false,
        rarity: "rare",
      },
      {
        id: "title-1",
        name: "Erlebnis-Meister",
        description: "Ein spezieller Titel für dein Profil",
        type: "title",
        cost: 75,
        isUnlocked: false,
        rarity: "rare",
      },
      {
        id: "feature-1",
        name: "Erweiterte Statistiken",
        description: "Zugang zu detaillierten Analysen deiner Erlebnisse",
        type: "feature",
        cost: 200,
        isUnlocked: false,
        rarity: "legendary",
      },
    ])
  }, [])

  const completeQuest = (questId: string) => {
    setQuests(
      quests.map((quest) => {
        if (quest.id === questId && !quest.isCompleted) {
          const updatedQuest = { ...quest, isCompleted: true, progress: quest.maxProgress }

          // Belohnung gewähren
          setUserCoins((prev) => prev + (quest.reward.coins || 0))

          toast({
            title: "Quest abgeschlossen!",
            description: `Du hast ${quest.reward.xp} XP und ${quest.reward.coins || 0} Münzen erhalten!`,
          })

          return updatedQuest
        }
        return quest
      }),
    )
  }

  const purchaseReward = (rewardId: string) => {
    const reward = rewards.find((r) => r.id === rewardId)
    if (!reward || reward.isUnlocked || userCoins < reward.cost) return

    setUserCoins((prev) => prev - reward.cost)
    setRewards(rewards.map((r) => (r.id === rewardId ? { ...r, isUnlocked: true } : r)))

    toast({
      title: "Belohnung freigeschaltet!",
      description: `Du hast "${reward.name}" für ${reward.cost} Münzen erhalten.`,
    })
  }

  const getDifficultyColor = (difficulty: Quest["difficulty"]) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "hard":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRarityColor = (rarity: Reward["rarity"]) => {
    switch (rarity) {
      case "common":
        return "border-gray-300"
      case "rare":
        return "border-blue-400"
      case "epic":
        return "border-purple-400"
      case "legendary":
        return "border-yellow-400"
      default:
        return "border-gray-300"
    }
  }

  const getTimeRemaining = (expiresAt?: Date) => {
    if (!expiresAt) return null

    const now = new Date()
    const diff = expiresAt.getTime() - now.getTime()

    if (diff <= 0) return "Abgelaufen"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days}d ${hours % 24}h`
    }

    return `${hours}h ${minutes}m`
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quests & Belohnungen</h2>
        <div className="flex items-center space-x-2">
          <Gift className="h-5 w-5 text-yellow-500" />
          <span className="font-semibold">{userCoins} Münzen</span>
        </div>
      </div>

      <Tabs defaultValue="quests" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quests">Aktive Quests</TabsTrigger>
          <TabsTrigger value="rewards">Belohnungen</TabsTrigger>
        </TabsList>

        <TabsContent value="quests" className="space-y-4">
          <div className="grid gap-4">
            {quests.map((quest) => (
              <Card key={quest.id} className={quest.isCompleted ? "opacity-75" : ""}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {quest.isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {quest.title}
                        <Badge variant="outline" className={getDifficultyColor(quest.difficulty)}>
                          {quest.difficulty}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{quest.description}</p>
                    </div>
                    {quest.expiresAt && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {getTimeRemaining(quest.expiresAt)}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Fortschritt</span>
                        <span>
                          {quest.progress}/{quest.maxProgress}
                        </span>
                      </div>
                      <Progress value={(quest.progress / quest.maxProgress) * 100} />
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          {quest.reward.xp} XP
                        </div>
                        {quest.reward.coins && (
                          <div className="flex items-center">
                            <Gift className="h-4 w-4 text-yellow-500 mr-1" />
                            {quest.reward.coins} Münzen
                          </div>
                        )}
                        {quest.reward.badge && <Badge variant="secondary">{quest.reward.badge}</Badge>}
                      </div>

                      {quest.progress >= quest.maxProgress && !quest.isCompleted && (
                        <Button onClick={() => completeQuest(quest.id)}>
                          <Trophy className="h-4 w-4 mr-2" />
                          Einlösen
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <Card key={reward.id} className={`${getRarityColor(reward.rarity)} border-2`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{reward.name}</span>
                    <Badge variant="outline" className={getRarityColor(reward.rarity)}>
                      {reward.rarity}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{reward.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Gift className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-semibold">{reward.cost} Münzen</span>
                    </div>
                    <Button
                      disabled={reward.isUnlocked || userCoins < reward.cost}
                      onClick={() => purchaseReward(reward.id)}
                      variant={reward.isUnlocked ? "secondary" : "default"}
                    >
                      {reward.isUnlocked ? "Freigeschaltet" : "Kaufen"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
