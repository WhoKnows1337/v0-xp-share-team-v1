"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { QuestCard } from "./quest-card"
import { Calendar, Clock, Star, Trophy } from "lucide-react"
import type { Season } from "@/types/gamification"

interface SeasonOverviewProps {
  season: Season
  onQuestStart?: (questId: string) => void
  onQuestClaim?: (questId: string) => void
}

export function SeasonOverview({ season, onQuestStart, onQuestClaim }: SeasonOverviewProps) {
  // Berechne die verbleibende Zeit
  const getTimeRemaining = () => {
    const now = new Date()
    const endDate = new Date(season.endDate)
    const diffMs = endDate.getTime() - now.getTime()

    if (diffMs <= 0) return "Beendet"

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    return `${diffDays} Tag${diffDays !== 1 ? "e" : ""}, ${diffHours} Stunde${diffHours !== 1 ? "n" : ""}`
  }

  // Formatiere das Datum
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-32 relative">
          <div className="absolute inset-0 bg-black/20 flex items-end p-6">
            <div>
              <h2 className="text-2xl font-bold text-white">{season.name}</h2>
              <p className="text-white/80">{season.theme}</p>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Beschreibung</h3>
              <p className="text-muted-foreground">{season.description}</p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {formatDate(season.startDate)} - {formatDate(season.endDate)}
                </span>
              </div>

              <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                <Clock className="h-3 w-3 mr-1" />
                {getTimeRemaining()} verbleibend
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Dein Fortschritt</h3>

              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Level {season.level}</span>
                    <span>Level {season.level + 1}</span>
                  </div>
                  <Progress value={season.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{season.progress}% abgeschlossen</span>
                    <span>Level {season.maxLevel} max</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Saison-Belohnungen</h3>

              <div className="grid grid-cols-2 gap-2">
                {season.rewards.map((reward, index) => (
                  <div key={index} className="flex items-center p-2 rounded-lg border">
                    <div className="bg-primary/10 rounded-full p-2 mr-2">
                      {reward.type === "badge" && <Trophy className="h-4 w-4 text-amber-500" />}
                      {reward.type === "title" && <Star className="h-4 w-4 text-blue-500" />}
                      {reward.type === "feature" && <Star className="h-4 w-4 text-purple-500" />}
                    </div>

                    <div className="text-sm">
                      <p className="font-medium">{reward.value}</p>
                      <p className="text-xs text-muted-foreground">
                        {reward.rarity === "common"
                          ? "Gewöhnlich"
                          : reward.rarity === "uncommon"
                            ? "Ungewöhnlich"
                            : reward.rarity === "rare"
                              ? "Selten"
                              : reward.rarity === "epic"
                                ? "Episch"
                                : "Legendär"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Saison-Quests</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {season.quests.length > 0 ? (
                season.quests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} onStart={onQuestStart} onClaim={onQuestClaim} compact />
                ))
              ) : (
                <div className="col-span-full text-center py-8 border rounded-lg">
                  <p className="text-muted-foreground">Keine Quests für diese Saison verfügbar.</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-6 py-4 bg-muted/50 flex justify-between">
          <Button variant="outline">Bestenliste anzeigen</Button>
          <Button>Alle Saison-Quests anzeigen</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
