"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LevelChip } from "./level-chip"
import { Button } from "@/components/ui/button"
import { Trophy, Medal, Crown } from "lucide-react"

interface LeaderboardUser {
  id: string
  username: string
  avatarUrl?: string
  level: number
  xp: number
  rank: number
  achievements?: number
  streak?: number
}

interface LeaderboardProps {
  users: LeaderboardUser[]
  currentUserId?: string
  title?: string
  description?: string
}

export function Leaderboard({ users, currentUserId, title = "Bestenliste", description }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState("all-time")
  const [category, setCategory] = useState("xp")

  // Sortiere Benutzer nach XP oder Achievements
  const sortedUsers = [...users].sort((a, b) => {
    if (category === "xp") {
      return b.xp - a.xp
    } else if (category === "achievements") {
      return (b.achievements || 0) - (a.achievements || 0)
    } else {
      return (b.streak || 0) - (a.streak || 0)
    }
  })

  // Finde den aktuellen Benutzer
  const currentUser = sortedUsers.find((user) => user.id === currentUserId)
  const currentUserRank = currentUser ? sortedUsers.findIndex((user) => user.id === currentUserId) + 1 : null

  // Hilfsfunktion für Rang-Icon
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-400" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-medium">{rank}</span>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex space-x-1">
            <Button variant={category === "xp" ? "default" : "outline"} size="sm" onClick={() => setCategory("xp")}>
              XP
            </Button>
            <Button
              variant={category === "achievements" ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory("achievements")}
            >
              <Trophy className="h-4 w-4 mr-1" />
              Badges
            </Button>
            <Button
              variant={category === "streak" ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory("streak")}
            >
              🔥 Streak
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all-time">Allzeit</TabsTrigger>
            <TabsTrigger value="monthly">Monatlich</TabsTrigger>
            <TabsTrigger value="weekly">Wöchentlich</TabsTrigger>
            <TabsTrigger value="daily">Täglich</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <div className="space-y-2">
              {sortedUsers.slice(0, 10).map((user, index) => (
                <div
                  key={user.id}
                  className={`flex items-center p-3 rounded-lg ${
                    user.id === currentUserId ? "bg-primary/10" : "hover:bg-muted"
                  }`}
                >
                  <div className="w-8 flex justify-center">{getRankIcon(index + 1)}</div>
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.username} />
                    <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.username}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <LevelChip level={user.level} size="sm" />
                    <div className="text-sm font-medium">
                      {category === "xp"
                        ? `${user.xp.toLocaleString()} XP`
                        : category === "achievements"
                          ? `${user.achievements || 0} Badges`
                          : `${user.streak || 0} Tage`}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {currentUser && currentUserRank && currentUserRank > 10 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center p-3 rounded-lg bg-primary/10">
                  <div className="w-8 flex justify-center">{currentUserRank}</div>
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={currentUser.avatarUrl || "/placeholder.svg"} alt={currentUser.username} />
                    <AvatarFallback>{currentUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{currentUser.username}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <LevelChip level={currentUser.level} size="sm" />
                    <div className="text-sm font-medium">
                      {category === "xp"
                        ? `${currentUser.xp.toLocaleString()} XP`
                        : category === "achievements"
                          ? `${currentUser.achievements || 0} Badges`
                          : `${currentUser.streak || 0} Tage`}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
