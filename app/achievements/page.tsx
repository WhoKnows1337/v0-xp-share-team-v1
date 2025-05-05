"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { LevelChip } from "@/components/xp/level-chip"
import { XPProgressBar } from "@/components/xp/xp-progress-bar"
import { BadgeCard } from "@/components/xp/badge-card"
import { StreakMeter } from "@/components/xp/streak-meter"
import { DetailedProgress } from "@/components/xp/detailed-progress"
import { AchievementShare } from "@/components/xp/achievement-share"
import { RealTimeUpdates } from "@/components/xp/real-time-updates"
import type { Badge } from "@/types/xp-level"
import { Award, Clock, Filter, Share2 } from "lucide-react"
import { getCurrentUser } from "@/lib/mock-users"

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [badgeFilter, setBadgeFilter] = useState("all")
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState<any>(null)

  // Hole den aktuellen Benutzer
  const currentUser = getCurrentUser()

  // Mock-Daten für die Achievements-Seite
  const mockUserLevel = {
    level: currentUser.statistiken?.xpLevel || 1,
    range: getLevelRange(currentUser.statistiken?.xpLevel || 1),
    symbol: getLevelSymbol(currentUser.statistiken?.xpLevel || 1),
    symbolColor: getLevelColor(currentUser.statistiken?.xpLevel || 1),
    currentXP: currentUser.statistiken?.xpPunkte || 0,
    nextLevelXP: getNextLevelXP(currentUser.statistiken?.xpLevel || 1),
    totalXP: currentUser.statistiken?.xpPunkte || 0,
    unlocks: getLevelUnlocks(currentUser.statistiken?.xpLevel || 1),
  }

  const mockStreak = {
    current: 7, // Beispielwert
    max: 14, // Beispielwert
    lastActivity: new Date().toISOString(),
  }

  // Konvertiere Achievements in Badges
  const mockBadges: Badge[] = (currentUser.achievements || []).map((achievement) => ({
    id: achievement.id,
    name: achievement.name,
    description: achievement.beschreibung,
    type: getBadgeType(achievement),
    color: getBadgeColor(achievement),
    icon: achievement.icon,
    earned: achievement.unlocked || false,
    progress: achievement.progress,
    earnedDate: achievement.unlocked ? new Date().toISOString() : undefined,
  }))

  // Mock-Daten für den detaillierten Fortschritt
  const progressData = mockBadges
    .filter((badge) => !badge.earned && badge.progress)
    .map((badge) => ({
      label: badge.name,
      current: badge.progress?.current || 0,
      total: badge.progress?.total || 1,
      percentage: ((badge.progress?.current || 0) / (badge.progress?.total || 1)) * 100,
    }))

  // Hilfsfunktionen für Level-Informationen
  function getLevelRange(level: number): "Novice" | "Explorer" | "Adept" | "Sage" | "Luminary" {
    if (level >= 76) return "Luminary"
    if (level >= 51) return "Sage"
    if (level >= 26) return "Adept"
    if (level >= 11) return "Explorer"
    return "Novice"
  }

  function getLevelSymbol(level: number): string {
    if (level >= 76) return "✦"
    if (level >= 51) return "★"
    if (level >= 26) return "◆"
    if (level >= 11) return "◼"
    return "▲"
  }

  function getLevelColor(level: number): string {
    if (level >= 76) return "bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-600"
    if (level >= 51) return "bg-amber-400"
    if (level >= 26) return "bg-violet-500"
    if (level >= 11) return "bg-teal-500"
    return "bg-gray-400"
  }

  function getNextLevelXP(level: number): number {
    // Einfache Formel für die nächste Level-XP
    return level * 1000
  }

  function getLevelUnlocks(level: number): string[] {
    if (level >= 76) return ["Infinity badge", "Beta-tester fast lane"]
    if (level >= 51) return ["Host public Quests", "VR-Space slots"]
    if (level >= 26) return ["Advanced analytics", "Create Groups"]
    if (level >= 11) return ["Access to Community Chat", "Mood-Filters"]
    return ["Basis-Wizard", "Feed"]
  }

  // Hilfsfunktionen für Badge-Typen und -Farben
  function getBadgeType(achievement: any): "Milestone" | "Streak" | "Community" | "Event" | "Secret" {
    if (achievement.icon === "Flame" || achievement.icon === "Clock") return "Streak"
    if (achievement.icon === "Users" || achievement.icon === "Heart" || achievement.icon === "MessageSquare")
      return "Community"
    if (achievement.icon === "Calendar" || achievement.icon === "Star") return "Event"
    if (achievement.icon === "Sparkles" || achievement.icon === "Zap") return "Secret"
    return "Milestone"
  }

  function getBadgeColor(achievement: any): string {
    const type = getBadgeType(achievement)
    switch (type) {
      case "Milestone":
        return "#FACC15" // Gold
      case "Streak":
        return "#60A5FA" // Cyan
      case "Community":
        return "#818CF8" // Indigo
      case "Event":
        return "#FBBF24" // Amber
      case "Secret":
        return "#EC4899" // Pink
      default:
        return "#9CA3AF" // Gray
    }
  }

  // Achievements-Historie
  const mockAchievementHistory = [
    {
      id: "1",
      type: "badge_unlocked",
      badgeId: "2",
      date: "2023-11-20T12:00:00Z",
      xpGained: 100,
    },
    {
      id: "2",
      type: "level_up",
      level: mockUserLevel.level,
      date: "2023-11-15T14:30:00Z",
      xpGained: 0,
    },
    {
      id: "3",
      type: "badge_unlocked",
      badgeId: "4",
      date: "2023-09-01T12:00:00Z",
      xpGained: 250,
    },
  ]

  // Filtere Badges basierend auf dem ausgewählten Filter
  const filteredBadges = mockBadges.filter((badge) => {
    if (badgeFilter === "all") return true
    if (badgeFilter === "earned") return badge.earned
    if (badgeFilter === "unearned") return !badge.earned
    return badge.type.toLowerCase() === badgeFilter.toLowerCase()
  })

  // Funktion zum Teilen eines Badges
  const handleShareBadge = (badge: Badge) => {
    setSelectedBadge(badge)
    setShareDialogOpen(true)
  }

  return (
    <div className="container py-8">
      {/* Echtzeit-Updates-Komponente */}
      <RealTimeUpdates />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
          <p className="text-muted-foreground">Verfolge deinen Fortschritt und sammle Badges</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="history">Verlauf</TabsTrigger>
          <TabsTrigger value="progress">Fortschritt</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Dein Level</CardTitle>
              <CardDescription>Dein aktueller Fortschritt</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex flex-col items-center">
                  <LevelChip level={mockUserLevel.level} size="lg" className="h-20 w-20 text-2xl" />
                  <div className="mt-2 text-sm text-muted-foreground">{mockUserLevel.range}</div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Level {mockUserLevel.level}</span>
                    <span>Level {mockUserLevel.level + 1}</span>
                  </div>
                  <XPProgressBar currentXP={mockUserLevel.currentXP} nextLevelXP={mockUserLevel.nextLevelXP} />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{mockUserLevel.currentXP.toLocaleString()} XP</span>
                    <span>{mockUserLevel.nextLevelXP.toLocaleString()} XP</span>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Freigeschaltete Features</h4>
                    <ul className="text-sm text-muted-foreground list-disc list-inside">
                      {mockUserLevel.unlocks.map((unlock, index) => (
                        <li key={index}>{unlock}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Deine Streak</CardTitle>
                <CardDescription>Halte deine Serie am Leben</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <StreakMeter streak={mockStreak} className="h-16 w-16 text-xl justify-center" />
                  <div>
                    <p className="text-sm">Du hast eine {mockStreak.current}-Tage-Serie!</p>
                    <p className="text-xs text-muted-foreground mt-1">Längste Serie: {mockStreak.max} Tage</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>XP Zusammenfassung</CardTitle>
                <CardDescription>Deine XP-Statistiken</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Gesamt-XP:</span>
                    <span className="font-medium">{mockUserLevel.totalXP.toLocaleString()} XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Durchschnitt pro Tag:</span>
                    <span className="font-medium">120 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Diese Woche verdient:</span>
                    <span className="font-medium">850 XP</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div>
                  <CardTitle>Kürzlich freigeschaltet</CardTitle>
                  <CardDescription>Deine neuesten Errungenschaften</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="/leaderboard">Bestenliste anzeigen</a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockBadges
                  .filter((badge) => badge.earned)
                  .slice(0, 4)
                  .map((badge) => (
                    <div key={badge.id} className="relative group">
                      <BadgeCard badge={badge} />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleShareBadge(badge)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Alle Badges</h2>
            <Select value={badgeFilter} onValueChange={setBadgeFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle anzeigen</SelectItem>
                <SelectItem value="earned">Freigeschaltet</SelectItem>
                <SelectItem value="unearned">Noch nicht freigeschaltet</SelectItem>
                <SelectItem value="milestone">Meilensteine</SelectItem>
                <SelectItem value="streak">Streak</SelectItem>
                <SelectItem value="community">Community</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="secret">Geheim</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredBadges.map((badge) => (
              <div key={badge.id} className="relative group">
                <BadgeCard badge={badge} />
                {badge.earned && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleShareBadge(badge)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Achievements-Verlauf</CardTitle>
              <CardDescription>Deine Erfolge im Zeitverlauf</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockAchievementHistory.map((item) => {
                  const badge = item.type === "badge_unlocked" ? mockBadges.find((b) => b.id === item.badgeId) : null

                  return (
                    <div key={item.id} className="flex items-start gap-4">
                      <div className="bg-muted rounded-full p-2">
                        {item.type === "badge_unlocked" ? <Award className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">
                            {item.type === "badge_unlocked"
                              ? `Badge freigeschaltet: ${badge?.name}`
                              : `Level ${item.level} erreicht!`}
                          </h4>
                          <span className="text-sm text-muted-foreground">
                            {new Date(item.date).toLocaleDateString("de-DE")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.type === "badge_unlocked"
                            ? badge?.description
                            : `Du hast Level ${item.level} erreicht und neue Features freigeschaltet.`}
                        </p>
                        {item.xpGained > 0 && (
                          <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">
                            +{item.xpGained} XP
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <DetailedProgress
            data={progressData}
            title="Achievement-Fortschritt"
            description="Dein Fortschritt bei noch nicht freigeschalteten Achievements"
          />
        </TabsContent>
      </Tabs>

      {/* Achievement-Share-Dialog */}
      {selectedBadge && (
        <AchievementShare
          achievement={{
            id: selectedBadge.id,
            name: selectedBadge.name,
            description: selectedBadge.description,
          }}
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
        />
      )}
    </div>
  )
}
