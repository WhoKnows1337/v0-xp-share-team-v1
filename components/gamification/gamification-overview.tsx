"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { QuestDashboard } from "./quest-dashboard"
import { SeasonOverview } from "./season-overview"
import { LeaderboardComponent } from "./leaderboard-component"
import { QuestRewardDialog } from "./quest-reward-dialog"
import { useToast } from "@/hooks/use-toast"
import { Award, Calendar, Flame, Star, Trophy } from "lucide-react"
import {
  mockQuests,
  mockLeaderboards,
  mockUserGameStats,
  getActiveQuests,
  getActiveSeason,
} from "@/lib/mock-gamification"
import { LevelChip } from "@/components/xp/level-chip"
import { QuestCard } from "./quest-card"

export function GamificationOverview() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedQuest, setSelectedQuest] = useState<any>(null)
  const [showRewardDialog, setShowRewardDialog] = useState(false)

  // Hole aktive Quests und Saison
  const activeQuests = getActiveQuests()
  const activeSeason = getActiveSeason()
  const userStats = mockUserGameStats

  // Quest starten
  const handleQuestStart = (questId: string) => {
    toast({
      title: "Quest gestartet",
      description: "Du hast die Quest erfolgreich gestartet.",
    })
  }

  // Belohnung abholen
  const handleQuestClaim = (questId: string) => {
    const quest = mockQuests.find((q) => q.id === questId)
    if (quest) {
      setSelectedQuest(quest)
      setShowRewardDialog(true)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gamification</h2>
          <p className="text-muted-foreground">Entdecke Quests, Belohnungen und Bestenlisten</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <LevelChip level={userStats.level} size="sm" />
            <div className="text-sm">
              <div className="font-medium">Level {userStats.level}</div>
              <div className="text-xs text-muted-foreground">
                {userStats.xp}/{userStats.xpToNextLevel} XP
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-blue-500/10 rounded-full p-1.5">
              <Star className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-sm">
              <div className="font-medium">{userStats.currency.mana} Mana</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-purple-500/10 rounded-full p-1.5">
              <Star className="h-4 w-4 text-purple-500" />
            </div>
            <div className="text-sm">
              <div className="font-medium">{userStats.currency.stardust} Stardust</div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <Star className="h-4 w-4 mr-2" />
            Übersicht
          </TabsTrigger>
          <TabsTrigger value="quests">
            <Trophy className="h-4 w-4 mr-2" />
            Quests
          </TabsTrigger>
          <TabsTrigger value="season">
            <Calendar className="h-4 w-4 mr-2" />
            Saison
          </TabsTrigger>
          <TabsTrigger value="leaderboard">
            <Award className="h-4 w-4 mr-2" />
            Bestenliste
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Fortschrittsübersicht */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Dein Level</CardTitle>
                <CardDescription>Fortschritt und Belohnungen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <LevelChip level={userStats.level} size="lg" className="h-16 w-16 text-xl" />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Level {userStats.level}</span>
                      <span>Level {userStats.level + 1}</span>
                    </div>
                    <Progress value={(userStats.xp / userStats.xpToNextLevel) * 100} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{userStats.xp} XP</span>
                      <span>{userStats.xpToNextLevel} XP</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Gesamt-XP:</span>
                  <span className="font-medium">{userStats.totalXp.toLocaleString()} XP</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Streak</CardTitle>
                <CardDescription>Tägliche Aktivität</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="bg-orange-500/10 rounded-full p-4">
                    <Flame className="h-8 w-8 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{userStats.streak.current} Tage</div>
                    <div className="text-sm text-muted-foreground">Längste Streak: {userStats.streak.longest} Tage</div>
                  </div>
                </div>
                <div className="mt-4 text-sm">
                  <div className="flex justify-between">
                    <span>Nächstes Ziel:</span>
                    <span>10 Tage</span>
                  </div>
                  <Progress value={(userStats.streak.current / 10) * 100} className="h-2 mt-1" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Saison: {activeSeason?.name}</CardTitle>
                <CardDescription>Saisonaler Fortschritt</CardDescription>
              </CardHeader>
              <CardContent>
                {activeSeason ? (
                  <>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-emerald-500/10 rounded-full p-4">
                        <Trophy className="h-8 w-8 text-emerald-500" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">Level {activeSeason.level}</div>
                        <div className="text-sm text-muted-foreground">{activeSeason.progress}% zum nächsten Level</div>
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => setActiveTab("season")}>
                      Saison anzeigen
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-24">
                    <p className="text-muted-foreground mb-2">Keine aktive Saison</p>
                    <Button variant="outline" size="sm">
                      Kommende Saisons
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Aktive Quests */}
          <Card>
            <CardHeader>
              <CardTitle>Aktive Quests</CardTitle>
              <CardDescription>Deine aktuellen Quests und Fortschritte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeQuests.slice(0, 3).map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    onStart={handleQuestStart}
                    onClaim={handleQuestClaim}
                    compact
                  />
                ))}
              </div>

              {activeQuests.length > 3 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" onClick={() => setActiveTab("quests")}>
                    Alle Quests anzeigen ({activeQuests.length})
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bestenlisten */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LeaderboardComponent leaderboards={[mockLeaderboards[0]]} currentUserId="u1" />

            <LeaderboardComponent leaderboards={[mockLeaderboards[2]]} currentUserId="u1" />
          </div>
        </TabsContent>

        <TabsContent value="quests">
          <QuestDashboard quests={mockQuests} onQuestStart={handleQuestStart} onQuestClaim={handleQuestClaim} />
        </TabsContent>

        <TabsContent value="season">
          {activeSeason ? (
            <SeasonOverview season={activeSeason} onQuestStart={handleQuestStart} onQuestClaim={handleQuestClaim} />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Keine aktive Saison</h3>
                <p className="text-muted-foreground mb-6">Derzeit läuft keine Saison. Schau später wieder vorbei!</p>
                <Button>Kommende Saisons anzeigen</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="leaderboard">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockLeaderboards.map((leaderboard) => (
              <LeaderboardComponent key={leaderboard.id} leaderboards={[leaderboard]} currentUserId="u1" />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quest-Belohnungs-Dialog */}
      {selectedQuest && (
        <QuestRewardDialog quest={selectedQuest} open={showRewardDialog} onOpenChange={setShowRewardDialog} />
      )}
    </div>
  )
}
