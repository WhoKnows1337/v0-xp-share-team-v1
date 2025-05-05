"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Award, BookOpen, Heart, MessageSquare, Star, Trophy, Users } from "lucide-react"
import type { Achievement } from "@/lib/mock-users"
import { StreakMeter } from "@/components/xp/streak-meter"
import { getCurrentUser } from "@/lib/mock-users"

interface AchievementsTabProps {
  achievements?: Achievement[]
  isOwner?: boolean
  streak?: {
    current: number
    max: number
    lastActivity: string
  }
}

export function AchievementsTab({
  achievements: propAchievements,
  isOwner = true,
  streak: propStreak,
}: AchievementsTabProps) {
  const [activeTab, setActiveTab] = useState("alle")

  // Fallback auf den aktuellen Benutzer, wenn keine Achievements übergeben wurden
  const currentUser = getCurrentUser()
  const achievements = propAchievements || currentUser.achievements || []

  // Mock-Streak, wenn keine übergeben wurde
  const streak = propStreak || {
    current: 7,
    max: 14,
    lastActivity: new Date().toISOString(),
  }

  // Filtere Achievements basierend auf dem aktiven Tab
  const filteredAchievements =
    activeTab === "alle"
      ? achievements
      : activeTab === "freigeschaltet"
        ? achievements.filter((a) => a.unlocked)
        : achievements.filter((a) => !a.unlocked)

  // Funktion zum Rendern des passenden Icons
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "BookOpen":
        return <BookOpen className="h-5 w-5" />
      case "MessageSquare":
        return <MessageSquare className="h-5 w-5" />
      case "Heart":
        return <Heart className="h-5 w-5" />
      case "Award":
        return <Award className="h-5 w-5" />
      case "Trophy":
        return <Trophy className="h-5 w-5" />
      case "Users":
        return <Users className="h-5 w-5" />
      default:
        return <Star className="h-5 w-5" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
        <CardDescription>
          {isOwner
            ? "Deine freigeschalteten und noch zu erreichenden Achievements"
            : "Freigeschaltete und noch zu erreichende Achievements"}
        </CardDescription>
      </CardHeader>
      {isOwner && streak && (
        <div className="px-6 pb-4">
          <div className="flex items-center gap-4 p-4 rounded-lg border">
            <StreakMeter streak={streak} className="h-12 w-12 text-lg" />
            <div>
              <h3 className="font-medium">Aktuelle Streak</h3>
              <p className="text-sm text-muted-foreground">
                {streak.current} Tage in Folge aktiv (Rekord: {streak.max} Tage)
              </p>
            </div>
          </div>
        </div>
      )}
      <CardContent>
        <Tabs defaultValue="alle" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="alle">Alle</TabsTrigger>
            <TabsTrigger value="freigeschaltet">Freigeschaltet</TabsTrigger>
            <TabsTrigger value="ausstehend">Ausstehend</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredAchievements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {activeTab === "freigeschaltet"
                  ? "Noch keine Achievements freigeschaltet."
                  : activeTab === "ausstehend"
                    ? "Keine ausstehenden Achievements."
                    : "Keine Achievements gefunden."}
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-start gap-4 p-4 rounded-lg border">
                    <div
                      className={`p-2 rounded-full ${achievement.unlocked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                    >
                      {renderIcon(achievement.icon)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{achievement.name}</h3>
                        {achievement.unlocked && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            Freigeschaltet
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{achievement.beschreibung}</p>

                      {achievement.progress && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>Fortschritt</span>
                            <span>
                              {achievement.progress.current} / {achievement.progress.total}
                            </span>
                          </div>
                          <Progress value={(achievement.progress.current / achievement.progress.total) * 100} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
