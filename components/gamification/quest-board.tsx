"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Target, Clock, Star, Gift, Zap } from "lucide-react"
import { useQuests } from "@/hooks/use-quests"

interface Quest {
  id: string
  title: string
  description: string
  type: "daily" | "weekly" | "monthly" | "special"
  difficulty: "easy" | "medium" | "hard" | "legendary"
  xpReward: number
  progress: number
  maxProgress: number
  completed: boolean
  expiresAt?: Date
  requirements: string[]
  category: string
}

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
    id: "monthly-1",
    title: "Community Champion",
    description: "Erhalte 50 Likes auf deine Erlebnisse",
    type: "monthly",
    difficulty: "hard",
    xpReward: 500,
    progress: 23,
    maxProgress: 50,
    completed: false,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    requirements: ["50 Likes sammeln"],
    category: "Social",
  },
  {
    id: "special-1",
    title: "Zeitreisender",
    description: "Erstelle Erlebnisse aus 5 verschiedenen Jahrzehnten",
    type: "special",
    difficulty: "legendary",
    xpReward: 1000,
    progress: 2,
    maxProgress: 5,
    completed: false,
    requirements: ["Erlebnisse aus verschiedenen Epochen"],
    category: "Kreativität",
  },
]

export function QuestBoard() {
  const [quests, setQuests] = useState<Quest[]>(mockQuests)
  const [activeTab, setActiveTab] = useState("daily")
  const { completeQuest, claimReward } = useQuests()

  const getDifficultyColor = (difficulty: Quest["difficulty"]) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "hard":
        return "bg-red-500"
      case "legendary":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getDifficultyIcon = (difficulty: Quest["difficulty"]) => {
    switch (difficulty) {
      case "easy":
        return <Target className="h-4 w-4" />
      case "medium":
        return <Star className="h-4 w-4" />
      case "hard":
        return <Trophy className="h-4 w-4" />
      case "legendary":
        return <Zap className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
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

  const handleClaimReward = async (questId: string) => {
    const quest = quests.find((q) => q.id === questId)
    if (quest && quest.completed) {
      await claimReward(questId, quest.xpReward)
      setQuests((prev) => prev.filter((q) => q.id !== questId))
    }
  }

  const filteredQuests = quests.filter((quest) => quest.type === activeTab)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Quest Board</h2>
        <p className="text-muted-foreground">Vervollständige Quests und sammle XP-Belohnungen</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Täglich
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Wöchentlich
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Monatlich
          </TabsTrigger>
          <TabsTrigger value="special" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Spezial
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredQuests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Keine Quests verfügbar</h3>
                <p className="text-muted-foreground text-center">
                  Alle{" "}
                  {activeTab === "daily"
                    ? "täglichen"
                    : activeTab === "weekly"
                      ? "wöchentlichen"
                      : activeTab === "monthly"
                        ? "monatlichen"
                        : "speziellen"}{" "}
                  Quests wurden abgeschlossen!
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredQuests.map((quest) => (
              <Card
                key={quest.id}
                className={`transition-all duration-200 ${quest.completed ? "border-green-500 bg-green-50 dark:bg-green-950" : "hover:shadow-md"}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{quest.title}</CardTitle>
                        <Badge variant="secondary" className={`${getDifficultyColor(quest.difficulty)} text-white`}>
                          <span className="flex items-center gap-1">
                            {getDifficultyIcon(quest.difficulty)}
                            {quest.difficulty}
                          </span>
                        </Badge>
                      </div>
                      <CardDescription>{quest.description}</CardDescription>
                      <Badge variant="outline">{quest.category}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm font-medium text-yellow-600">
                        <Star className="h-4 w-4" />
                        {quest.xpReward} XP
                      </div>
                      {quest.expiresAt && (
                        <div className="text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {getTimeRemaining(quest.expiresAt)}
                        </div>
                      )}
                    </div>
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
                      <Progress value={(quest.progress / quest.maxProgress) * 100} className="h-2" />
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Anforderungen:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {quest.requirements.map((req, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {quest.completed ? (
                      <Button
                        onClick={() => handleClaimReward(quest.id)}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Gift className="h-4 w-4 mr-2" />
                        Belohnung einlösen
                      </Button>
                    ) : (
                      <div className="text-center text-sm text-muted-foreground py-2">
                        {quest.progress === 0 ? "Quest starten" : "In Bearbeitung..."}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
