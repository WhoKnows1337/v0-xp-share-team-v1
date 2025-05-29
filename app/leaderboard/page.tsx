"use client"

import { useState } from "react"
import { Leaderboard } from "@/components/xp/leaderboard"
import { mockUsers } from "@/lib/mock-users"
import { getCurrentUser } from "@/lib/mock-users"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Medal, Award, TrendingUp, Calendar } from "lucide-react"

// Konvertiere Mock-Benutzer in Leaderboard-Benutzer
const leaderboardUsers = mockUsers.map((user, index) => ({
  id: user.id,
  username: user.username,
  avatarUrl: user.avatar,
  level: user.statistiken?.xpLevel || 1,
  xp: user.statistiken?.xpPunkte || 0,
  rank: index + 1,
  achievements: user.achievements?.filter((a) => a.unlocked).length || 0,
  streak: user.statistiken?.streak || 0,
}))

// Sortiere nach XP
const sortedUsers = [...leaderboardUsers].sort((a, b) => b.xp - a.xp)

// Mock-Daten für verschiedene Kategorien
const weeklyLeaders = [...sortedUsers].slice(0, 10)
const monthlyLeaders = [...sortedUsers].slice(0, 15)
const allTimeLeaders = [...sortedUsers]

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("gesamt")
  const currentUser = getCurrentUser()

  const currentUserRank = sortedUsers.findIndex((user) => user.id === currentUser.id) + 1

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bestenliste</h1>
        <p className="text-muted-foreground">Entdecke die aktivsten Mitglieder der XP-Share Community</p>
      </div>

      {/* Aktuelle Position */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Deine Position
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">#{currentUserRank}</div>
                <div className="text-sm text-muted-foreground">Rang</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{currentUser.statistiken?.xpPunkte || 0}</div>
                <div className="text-sm text-muted-foreground">XP</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{currentUser.statistiken?.xpLevel || 1}</div>
                <div className="text-sm text-muted-foreground">Level</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-2">Bis zum nächsten Rang</div>
              <Progress value={65} className="w-32" />
              <div className="text-xs text-muted-foreground mt-1">350 XP fehlen</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="gesamt" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Gesamt
          </TabsTrigger>
          <TabsTrigger value="monat" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Dieser Monat
          </TabsTrigger>
          <TabsTrigger value="woche" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Diese Woche
          </TabsTrigger>
          <TabsTrigger value="kategorien" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Kategorien
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gesamt" className="space-y-6">
          <Leaderboard
            users={allTimeLeaders}
            currentUserId={currentUser.id}
            title="Gesamt-Bestenliste"
            description="Die aktivsten Mitglieder aller Zeiten"
          />
        </TabsContent>

        <TabsContent value="monat" className="space-y-6">
          <Leaderboard
            users={monthlyLeaders}
            currentUserId={currentUser.id}
            title="Monatliche Bestenliste"
            description="Top-Performer dieses Monats"
          />
        </TabsContent>

        <TabsContent value="woche" className="space-y-6">
          <Leaderboard
            users={weeklyLeaders}
            currentUserId={currentUser.id}
            title="Wöchentliche Bestenliste"
            description="Die aktivsten Nutzer dieser Woche"
          />
        </TabsContent>

        <TabsContent value="kategorien" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Medal className="h-5 w-5 text-yellow-500" />
                  Erlebnisse geteilt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sortedUsers.slice(0, 5).map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={index === 0 ? "default" : "secondary"}>#{index + 1}</Badge>
                        <span className="font-medium">{user.username}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {Math.floor(Math.random() * 50) + 10} Erlebnisse
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-500" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sortedUsers.slice(0, 5).map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={index === 0 ? "default" : "secondary"}>#{index + 1}</Badge>
                        <span className="font-medium">{user.username}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{user.achievements} Erfolge</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Streak-Champions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sortedUsers.slice(0, 5).map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={index === 0 ? "default" : "secondary"}>#{index + 1}</Badge>
                        <span className="font-medium">{user.username}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{user.streak} Tage</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Statistiken */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Aktive Nutzer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUsers.length}</div>
            <p className="text-xs text-muted-foreground">+12% seit letztem Monat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Gesamt XP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sortedUsers.reduce((sum, user) => sum + user.xp, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Community-weit gesammelt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Durchschnittslevel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(sortedUsers.reduce((sum, user) => sum + user.level, 0) / sortedUsers.length)}
            </div>
            <p className="text-xs text-muted-foreground">Aller Community-Mitglieder</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
