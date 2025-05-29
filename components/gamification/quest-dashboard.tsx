"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QuestCard } from "./quest-card"
import { QuestRewardDialog } from "./quest-reward-dialog"
import { QuestDetailDialog } from "./quest-detail-dialog"
import { useToast } from "@/hooks/use-toast"
import { Calendar, CheckCircle, Clock, Filter, Flame, Star } from "lucide-react"
import type { Quest } from "@/types/gamification"
import { getUserGameStats } from "@/lib/mock-gamification"

interface QuestDashboardProps {
  quests: Quest[]
  activeTab?: string
  onQuestStart?: (questId: string) => void
  onQuestClaim?: (questId: string) => void
}

export function QuestDashboard({ quests, activeTab = "active", onQuestStart, onQuestClaim }: QuestDashboardProps) {
  const { toast } = useToast()
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null)
  const [showRewardDialog, setShowRewardDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [currentTab, setCurrentTab] = useState(activeTab)

  // Benutzerstatistiken abrufen
  const userStats = getUserGameStats("u1")

  // Quests nach Typ filtern
  const dailyQuests = quests.filter((q) => q.type === "daily")
  const weeklyQuests = quests.filter((q) => q.type === "weekly")
  const monthlyQuests = quests.filter((q) => q.type === "monthly")
  const seasonalQuests = quests.filter((q) => q.type === "seasonal")
  const achievementQuests = quests.filter((q) => q.type === "achievement")

  // Aktive Quests (nicht abgeschlossen)
  const activeQuests = quests.filter((q) => !q.completed)

  // Abgeschlossene Quests
  const completedQuests = quests.filter((q) => q.completed)

  // Empfohlene Quests
  const recommendedQuests = quests.filter((q) => q.isRecommended)

  // Quest starten
  const handleQuestStart = (questId: string) => {
    const quest = quests.find((q) => q.id === questId)
    if (quest) {
      setSelectedQuest(quest)
      setShowDetailDialog(true)

      if (onQuestStart) {
        onQuestStart(questId)
      }
    }
  }

  // Belohnung abholen
  const handleQuestClaim = (questId: string) => {
    const quest = quests.find((q) => q.id === questId)
    if (quest) {
      setSelectedQuest(quest)
      setShowRewardDialog(true)

      if (onQuestClaim) {
        onQuestClaim(questId)
      }
    }
  }

  // Quest-Detail anzeigen
  const handleQuestDetail = (quest: Quest) => {
    setSelectedQuest(quest)
    setShowDetailDialog(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quests</h2>
          <p className="text-muted-foreground">Entdecke und schließe Quests ab, um Belohnungen zu erhalten.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="font-medium">{userStats.streak.current} Tage Streak</span>
          </div>

          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            <span className="font-medium">{userStats.questsCompleted} Quests abgeschlossen</span>
          </div>

          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <Tabs defaultValue={currentTab} onValueChange={setCurrentTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            <Clock className="h-4 w-4 mr-2" />
            Aktiv
          </TabsTrigger>
          <TabsTrigger value="daily">
            <Calendar className="h-4 w-4 mr-2" />
            Täglich
          </TabsTrigger>
          <TabsTrigger value="weekly">Wöchentlich</TabsTrigger>
          <TabsTrigger value="achievements">Erfolge</TabsTrigger>
          <TabsTrigger value="seasonal">Saisonal</TabsTrigger>
          <TabsTrigger value="completed">
            <CheckCircle className="h-4 w-4 mr-2" />
            Abgeschlossen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {recommendedQuests.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Empfohlene Quests</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedQuests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    onStart={handleQuestStart}
                    onClaim={handleQuestClaim}
                    compact
                  />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Aktive Quests</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeQuests.length > 0 ? (
                activeQuests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    onStart={handleQuestStart}
                    onClaim={handleQuestClaim}
                    compact
                  />
                ))
              ) : (
                <Card className="col-span-full">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <p className="text-muted-foreground mb-4">Keine aktiven Quests vorhanden.</p>
                    <Button onClick={() => setCurrentTab("daily")}>Tägliche Quests anzeigen</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="daily" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyQuests.length > 0 ? (
              dailyQuests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} onStart={handleQuestStart} onClaim={handleQuestClaim} />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground">Keine täglichen Quests verfügbar.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weeklyQuests.length > 0 ? (
              weeklyQuests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} onStart={handleQuestStart} onClaim={handleQuestClaim} />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground">Keine wöchentlichen Quests verfügbar.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievementQuests.length > 0 ? (
              achievementQuests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} onStart={handleQuestStart} onClaim={handleQuestClaim} />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground">Keine Erfolge verfügbar.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="seasonal" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {seasonalQuests.length > 0 ? (
              seasonalQuests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} onStart={handleQuestStart} onClaim={handleQuestClaim} />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground">Keine saisonalen Quests verfügbar.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedQuests.length > 0 ? (
              completedQuests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} onStart={handleQuestStart} onClaim={handleQuestClaim} />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground">Keine abgeschlossenen Quests vorhanden.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quest-Belohnungs-Dialog */}
      {selectedQuest && (
        <QuestRewardDialog quest={selectedQuest} open={showRewardDialog} onOpenChange={setShowRewardDialog} />
      )}

      {/* Quest-Detail-Dialog */}
      {selectedQuest && (
        <QuestDetailDialog
          quest={selectedQuest}
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
          onStart={() => {
            setShowDetailDialog(false)
            toast({
              title: "Quest gestartet",
              description: `Du hast die Quest "${selectedQuest.title}" gestartet.`,
            })
          }}
        />
      )}
    </div>
  )
}
