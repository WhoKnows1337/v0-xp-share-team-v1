"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaderboard } from "@/components/xp/leaderboard"
import { DetailedProgress } from "@/components/xp/detailed-progress"
import { mockUsers } from "@/lib/mock-users"
import { getCurrentUser } from "@/lib/mock-users"

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

// Mock-Daten für den Fortschritt
const progressData = [
  {
    label: "Beiträge",
    current: 12,
    total: 50,
    percentage: (12 / 50) * 100,
  },
  {
    label: "Kommentare",
    current: 35,
    total: 100,
    percentage: (35 / 100) * 100,
  },
  {
    label: "Likes erhalten",
    current: 87,
    total: 200,
    percentage: (87 / 200) * 100,
  },
  {
    label: "Tägliche Logins",
    current: 14,
    total: 30,
    percentage: (14 / 30) * 100,
  },
]

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("leaderboard")
  const currentUser = getCurrentUser()

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bestenliste</h1>
          <p className="text-muted-foreground">Vergleiche deinen Fortschritt mit anderen Nutzern</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="leaderboard">Bestenliste</TabsTrigger>
          <TabsTrigger value="progress">Mein Fortschritt</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="space-y-4">
          <Leaderboard
            users={sortedUsers}
            currentUserId={currentUser.id}
            title="XP-Share Bestenliste"
            description="Die aktivsten Nutzer auf der Plattform"
          />
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailedProgress
              data={progressData}
              title="Mein Fortschritt"
              description="Dein Fortschritt in verschiedenen Kategorien"
            />

            <Card>
              <CardHeader>
                <CardTitle>Meine Statistiken</CardTitle>
                <CardDescription>Deine persönlichen Leistungen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Gesamte XP:</span>
                    <span className="font-medium">{currentUser.statistiken?.xpPunkte || 0} XP</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Aktuelle Streak:</span>
                    <span className="font-medium">{currentUser.statistiken?.streak || 0} Tage</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Freigeschaltete Achievements:</span>
                    <span className="font-medium">
                      {currentUser.achievements?.filter((a) => a.unlocked).length || 0} /{" "}
                      {currentUser.achievements?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Rang in der Bestenliste:</span>
                    <span className="font-medium">
                      {sortedUsers.findIndex((u) => u.id === currentUser.id) + 1} / {sortedUsers.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
