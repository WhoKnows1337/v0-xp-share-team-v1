"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Trophy, Star, Crown, Gift, TrendingUp } from "lucide-react"
import { useXPSystem } from "@/hooks/use-xp-system"

interface Level {
  level: number
  title: string
  xpRequired: number
  xpTotal: number
  rewards: string[]
  icon: string
  color: string
  description: string
}

const levelData: Level[] = [
  {
    level: 1,
    title: "Neuling",
    xpRequired: 100,
    xpTotal: 100,
    rewards: ["Profil-Badge", "Basis-Features"],
    icon: "🌱",
    color: "bg-green-500",
    description: "Willkommen bei XP-Share! Deine Reise beginnt hier.",
  },
  {
    level: 2,
    title: "Entdecker",
    xpRequired: 150,
    xpTotal: 250,
    rewards: ["Erweiterte Filter", "Kommentar-Feature"],
    icon: "🔍",
    color: "bg-blue-500",
    description: "Du beginnst, die Welt der Erlebnisse zu erkunden.",
  },
  {
    level: 3,
    title: "Abenteurer",
    xpRequired: 200,
    xpTotal: 450,
    rewards: ["Private Gruppen", "Medien-Upload"],
    icon: "🎒",
    color: "bg-purple-500",
    description: "Deine Abenteuerlust wächst stetig.",
  },
  {
    level: 4,
    title: "Geschichtenerzähler",
    xpRequired: 300,
    xpTotal: 750,
    rewards: ["Story-Templates", "Erweiterte Medien"],
    icon: "📖",
    color: "bg-orange-500",
    description: "Du weißt, wie man Erlebnisse zum Leben erweckt.",
  },
  {
    level: 5,
    title: "Community-Held",
    xpRequired: 500,
    xpTotal: 1250,
    rewards: ["Moderator-Tools", "Exklusive Events"],
    icon: "🦸",
    color: "bg-red-500",
    description: "Die Community schätzt deine Beiträge sehr.",
  },
  {
    level: 6,
    title: "Weiser",
    xpRequired: 750,
    xpTotal: 2000,
    rewards: ["KI-Insights", "Premium-Analytics"],
    icon: "🧙",
    color: "bg-indigo-500",
    description: "Deine Weisheit hilft anderen bei ihren Erlebnissen.",
  },
  {
    level: 7,
    title: "Legende",
    xpRequired: 1000,
    xpTotal: 3000,
    rewards: ["Legendärer Status", "Alle Features"],
    icon: "👑",
    color: "bg-yellow-500",
    description: "Du bist eine wahre Legende in der XP-Share Community.",
  },
]

export function LevelSystem() {
  const { currentXP, currentLevel, getNextLevel, getLevelProgress } = useXPSystem()
  const [showRewards, setShowRewards] = useState(false)

  const currentLevelData = levelData.find((l) => l.level === currentLevel) || levelData[0]
  const nextLevelData = levelData.find((l) => l.level === currentLevel + 1)
  const progress = getLevelProgress()

  const xpToNext = nextLevelData ? nextLevelData.xpTotal - currentXP : 0

  return (
    <div className="space-y-6">
      {/* Aktueller Level */}
      <Card className="relative overflow-hidden">
        <div className={`absolute inset-0 ${currentLevelData.color} opacity-10`} />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{currentLevelData.icon}</div>
              <div>
                <CardTitle className="text-2xl">
                  Level {currentLevelData.level}: {currentLevelData.title}
                </CardTitle>
                <CardDescription className="text-base">{currentLevelData.description}</CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {currentXP.toLocaleString()} XP
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="relative">
          {nextLevelData ? (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Fortschritt zum nächsten Level</span>
                  <span>{xpToNext.toLocaleString()} XP verbleibend</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Nächster Level: {nextLevelData.title}</div>
                <Button variant="outline" size="sm" onClick={() => setShowRewards(!showRewards)}>
                  <Gift className="h-4 w-4 mr-2" />
                  Belohnungen anzeigen
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Maximaler Level erreicht!</h3>
              <p className="text-muted-foreground">Du hast den höchsten Level erreicht. Gratulation!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Level-Übersicht */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Level-Übersicht
          </CardTitle>
          <CardDescription>Dein Fortschritt durch alle verfügbaren Level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {levelData.map((level) => {
              const isCompleted = currentLevel > level.level
              const isCurrent = currentLevel === level.level
              const isLocked = currentLevel < level.level

              return (
                <div
                  key={level.level}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                    isCurrent
                      ? "border-primary bg-primary/5"
                      : isCompleted
                        ? "border-green-500 bg-green-50 dark:bg-green-950"
                        : "border-muted bg-muted/30"
                  }`}
                >
                  <div className="text-2xl">{level.icon}</div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">
                        Level {level.level}: {level.title}
                      </h4>
                      {isCompleted && (
                        <Badge variant="secondary" className="bg-green-500 text-white">
                          <Trophy className="h-3 w-3 mr-1" />
                          Abgeschlossen
                        </Badge>
                      )}
                      {isCurrent && (
                        <Badge variant="default">
                          <Star className="h-3 w-3 mr-1" />
                          Aktuell
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{level.description}</p>

                    {(showRewards || isCurrent || isCompleted) && (
                      <div className="flex flex-wrap gap-1">
                        {level.rewards.map((reward, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {reward}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-medium">{level.xpTotal.toLocaleString()} XP</div>
                    {isCurrent && nextLevelData && (
                      <div className="text-xs text-muted-foreground">{xpToNext.toLocaleString()} verbleibend</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
