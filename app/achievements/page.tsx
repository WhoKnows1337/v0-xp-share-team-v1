"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Trophy, Star, Target, Zap, Users, Calendar, Award, CheckCircle } from "lucide-react"

export default function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState("alle")

  const achievements = [
    {
      id: "first_experience",
      title: "Erste Schritte",
      description: "Teile dein erstes Erlebnis",
      icon: "🌟",
      category: "beginner",
      unlocked: true,
      progress: 100,
      maxProgress: 1,
      xpReward: 100,
      unlockedAt: "2024-01-15",
    },
    {
      id: "social_butterfly",
      title: "Sozialer Schmetterling",
      description: "Kommentiere 10 Erlebnisse anderer",
      icon: "🦋",
      category: "social",
      unlocked: true,
      progress: 10,
      maxProgress: 10,
      xpReward: 200,
      unlockedAt: "2024-01-20",
    },
    {
      id: "explorer",
      title: "Entdecker",
      description: "Besuche 5 verschiedene Städte",
      icon: "🗺️",
      category: "travel",
      unlocked: false,
      progress: 3,
      maxProgress: 5,
      xpReward: 300,
    },
    {
      id: "storyteller",
      title: "Geschichtenerzähler",
      description: "Schreibe 25 Erlebnisse",
      icon: "📖",
      category: "content",
      unlocked: false,
      progress: 12,
      maxProgress: 25,
      xpReward: 500,
    },
    {
      id: "community_leader",
      title: "Community-Leader",
      description: "Erhalte 100 Likes auf deine Erlebnisse",
      icon: "👑",
      category: "social",
      unlocked: false,
      progress: 67,
      maxProgress: 100,
      xpReward: 750,
    },
    {
      id: "streak_master",
      title: "Streak-Meister",
      description: "Logge dich 30 Tage in Folge ein",
      icon: "🔥",
      category: "engagement",
      unlocked: false,
      progress: 14,
      maxProgress: 30,
      xpReward: 400,
    },
    {
      id: "photographer",
      title: "Fotograf",
      description: "Lade 50 Fotos hoch",
      icon: "📸",
      category: "content",
      unlocked: true,
      progress: 50,
      maxProgress: 50,
      xpReward: 300,
      unlockedAt: "2024-02-01",
    },
    {
      id: "mentor",
      title: "Mentor",
      description: "Hilf 5 neuen Benutzern",
      icon: "🎓",
      category: "social",
      unlocked: false,
      progress: 2,
      maxProgress: 5,
      xpReward: 600,
    },
  ]

  const categories = [
    { id: "alle", name: "Alle", icon: Trophy },
    { id: "beginner", name: "Anfänger", icon: Star },
    { id: "social", name: "Sozial", icon: Users },
    { id: "travel", name: "Reisen", icon: Target },
    { id: "content", name: "Inhalte", icon: Award },
    { id: "engagement", name: "Engagement", icon: Zap },
  ]

  const filteredAchievements =
    selectedCategory === "alle" ? achievements : achievements.filter((a) => a.category === selectedCategory)

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalXP = achievements.filter((a) => a.unlocked).reduce((sum, a) => sum + a.xpReward, 0)

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Achievements</h1>
        <p className="text-muted-foreground">Sammle Erfolge und verdiene XP durch verschiedene Aktivitäten</p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              Freigeschaltet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unlockedCount}</div>
            <p className="text-xs text-muted-foreground">von {achievements.length} Achievements</p>
            <Progress value={(unlockedCount / achievements.length) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4 text-blue-500" />
              Verdiente XP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalXP.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Durch Achievements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              Nächstes Ziel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Community-Leader</div>
            <p className="text-xs text-muted-foreground">33 Likes fehlen</p>
            <Progress value={67} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {category.name}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`transition-all hover:shadow-md ${
              achievement.unlocked ? "border-green-200 bg-green-50/50" : "border-gray-200"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`text-2xl ${!achievement.unlocked && "grayscale opacity-50"}`}>
                    {achievement.unlocked ? achievement.icon : "🔒"}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    <CardDescription className="text-sm">{achievement.description}</CardDescription>
                  </div>
                </div>
                {achievement.unlocked && <CheckCircle className="h-5 w-5 text-green-500" />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Fortschritt</span>
                    <span>
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                  <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                </div>

                {/* Reward */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">{achievement.xpReward} XP</span>
                  </div>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <Badge variant="secondary" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(achievement.unlockedAt).toLocaleDateString("de-DE")}
                    </Badge>
                  )}
                </div>

                {/* Category Badge */}
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-xs">
                    {categories.find((c) => c.id === achievement.category)?.name}
                  </Badge>
                  {!achievement.unlocked && (
                    <span className="text-xs text-muted-foreground">
                      {Math.round((achievement.progress / achievement.maxProgress) * 100)}% abgeschlossen
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Achievements */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Kürzlich freigeschaltet
          </CardTitle>
          <CardDescription>Deine neuesten Erfolge</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {achievements
              .filter((a) => a.unlocked)
              .sort((a, b) => new Date(b.unlockedAt || "").getTime() - new Date(a.unlockedAt || "").getTime())
              .slice(0, 3)
              .map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="text-xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium">{achievement.title}</p>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Star className="h-3 w-3 text-yellow-500" />
                      {achievement.xpReward} XP
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {achievement.unlockedAt && new Date(achievement.unlockedAt).toLocaleDateString("de-DE")}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
