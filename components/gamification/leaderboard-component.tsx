"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, Medal, Minus, Trophy, Users } from "lucide-react"
import type { Leaderboard } from "@/types/gamification"

interface LeaderboardComponentProps {
  leaderboards: Leaderboard[]
  currentUserId?: string
}

export function LeaderboardComponent({ leaderboards, currentUserId }: LeaderboardComponentProps) {
  const [activeTab, setActiveTab] = useState(leaderboards[0]?.id || "")

  // Finde die aktive Bestenliste
  const activeLeaderboard = leaderboards.find((l) => l.id === activeTab) || leaderboards[0]

  // Rendere das Änderungssymbol
  const renderChangeIcon = (change: number | undefined) => {
    if (!change) return <Minus className="h-3 w-3 text-muted-foreground" />
    if (change > 0) return <ArrowUp className="h-3 w-3 text-green-500" />
    if (change < 0) return <ArrowDown className="h-3 w-3 text-red-500" />
    return <Minus className="h-3 w-3 text-muted-foreground" />
  }

  // Rendere das Rang-Symbol
  const renderRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
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
        <CardTitle>Bestenliste</CardTitle>
        <CardDescription>Vergleiche deine Leistung mit anderen Benutzern</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${leaderboards.length}, 1fr)` }}>
            {leaderboards.map((leaderboard) => (
              <TabsTrigger key={leaderboard.id} value={leaderboard.id}>
                {leaderboard.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeLeaderboard.id} className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">{activeLeaderboard.description}</h3>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {activeLeaderboard.timeframe === "daily"
                  ? "Täglich"
                  : activeLeaderboard.timeframe === "weekly"
                    ? "Wöchentlich"
                    : activeLeaderboard.timeframe === "monthly"
                      ? "Monatlich"
                      : activeLeaderboard.timeframe === "seasonal"
                        ? "Saisonal"
                        : "Allzeit"}
              </Badge>
            </div>

            <div className="space-y-2">
              {activeLeaderboard.entries.map((entry, index) => (
                <div
                  key={entry.userId}
                  className={`flex items-center p-3 rounded-lg ${
                    entry.userId === currentUserId ? "bg-primary/10" : "hover:bg-muted"
                  }`}
                >
                  <div className="w-8 flex justify-center">{renderRankIcon(entry.rank)}</div>
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={entry.avatar || "/placeholder.svg"} alt={entry.username} />
                    <AvatarFallback>{entry.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{entry.username}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      {renderChangeIcon(entry.change)}
                      <span className="text-xs ml-1">{entry.change ? Math.abs(entry.change) : "-"}</span>
                    </div>
                    <div className="text-sm font-medium">
                      {activeLeaderboard.type === "xp"
                        ? `${entry.score.toLocaleString()} XP`
                        : activeLeaderboard.type === "quests"
                          ? `${entry.score} Quests`
                          : activeLeaderboard.type === "badges"
                            ? `${entry.score} Badges`
                            : activeLeaderboard.type === "season"
                              ? `Level ${entry.score}`
                              : `${entry.score} Punkte`}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Freunde anzeigen
              </Button>
              <Button size="sm">Vollständige Bestenliste</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
