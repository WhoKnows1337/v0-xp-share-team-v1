"use client"

import { useState } from "react"
import { type User, getCurrentUser } from "@/lib/mock-users"
import { Button } from "@/components/ui/button"
import {
  Edit,
  CheckCircle,
  Settings,
  UserPlus,
  UserMinus,
  MessageSquare,
  MoreHorizontal,
  Flag,
  UserX,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ProfilBearbeitenDialog } from "@/components/profil/profil-bearbeiten-dialog"
import { EinstellungenDialog } from "@/components/profil/einstellungen-dialog"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { DialogDescription } from "@/components/ui/dialog"
import { ProfileReferralBanner } from "@/components/referral/profile-referral-banner"
import { LevelChip } from "@/components/xp/level-chip"
import { XPProgressBar } from "@/components/xp/xp-progress-bar"
import { StreakMeter } from "@/components/xp/streak-meter"

interface ProfileHeaderProps {
  user: User
  isOwner: boolean
}

export function ProfileHeaderExtended({ user, isOwner }: ProfileHeaderProps) {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const currentUser = getCurrentUser()
  const router = useRouter()

  // Mock-Daten für Level und Streak
  const userLevel = {
    level: user.statistiken?.xpLevel || 1,
    range: getLevelRange(user.statistiken?.xpLevel || 1),
    symbol: getLevelSymbol(user.statistiken?.xpLevel || 1),
    symbolColor: getLevelColor(user.statistiken?.xpLevel || 1),
    currentXP: user.statistiken?.xpPunkte || 0,
    nextLevelXP: getNextLevelXP(user.statistiken?.xpLevel || 1),
    totalXP: user.statistiken?.xpPunkte || 0,
    unlocks: getLevelUnlocks(user.statistiken?.xpLevel || 1),
  }

  const userStreak = {
    current: 5, // Mock-Wert
    max: 14, // Mock-Wert
    lastActivity: new Date().toISOString(),
  }

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
    if (level >= 50) {
      // √curve nach Level 50
      return Math.floor(1000 * Math.sqrt(level) * 10)
    }
    return level * 1000
  }

  function getLevelUnlocks(level: number): string[] {
    if (level >= 76) return ["Infinity badge", "Beta-tester fast lane"]
    if (level >= 51) return ["Host public Quests", "VR-Space slots"]
    if (level >= 26) return ["Advanced analytics", "Create Groups"]
    if (level >= 11) return ["Access to Community Chat", "Mood-Filters"]
    return ["Basis-Wizard", "Feed"]
  }

  const handleFollow = () => {
    setIsFollowing(true)
    toast({
      title: `Du folgst jetzt ${user.username}`,
      description: "Du wirst über neue Erlebnisse informiert.",
    })
  }

  const handleUnfollow = () => {
    setIsFollowing(false)
    toast({
      title: `Du folgst ${user.username} nicht mehr`,
      description: "Du wirst keine Benachrichtigungen mehr erhalten.",
    })
  }

  const handleSendMessage = () => {
    // Erstelle eine neue Konversation mit diesem Benutzer
    router.push(`/nachrichten?newChat=${user.username}`)
  }

  const handleReport = () => {
    toast({
      title: "Benutzer gemeldet",
      description: "Danke für deine Meldung. Wir werden sie überprüfen.",
    })
  }

  const handleBlock = () => {
    toast({
      title: "Benutzer blockiert",
      description: `Du siehst keine Inhalte mehr von ${user.username}.`,
    })
  }

  // Gemeinsame Gruppen (Mock-Daten)
  const sharedGroups = [
    { id: "g1", name: "Klartraum-Forscher" },
    { id: "g2", name: "Meditation & Achtsamkeit" },
  ]

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
      {/* Banner */}
      <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500"></div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative -mt-16">
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={user.username}
                className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 object-cover"
              />
              {user.isVerifiziert && (
                <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Benutzerinfo */}
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  {user.username}
                  {user.isVerifiziert && (
                    <span className="text-blue-500">
                      <CheckCircle className="h-5 w-5" />
                    </span>
                  )}
                </h1>

                {/* Level-Chip */}
                <LevelChip level={userLevel.level} levelInfo={userLevel} />

                {/* Streak-Meter */}
                <StreakMeter streak={userStreak} />
              </div>

              {/* Aktionsbuttons */}
              {isOwner ? (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditProfileOpen(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Profil bearbeiten
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsSettingsDialogOpen(true)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Einstellungen
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isFollowing ? "outline" : "default"}
                          size="sm"
                          onClick={isFollowing ? handleUnfollow : handleFollow}
                        >
                          {isFollowing ? (
                            <>
                              <UserMinus className="h-4 w-4 mr-2" />
                              Entfolgen
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Folgen
                            </>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isFollowing
                          ? `Du folgst ${user.username}. Klicke, um zu entfolgen.`
                          : `Folge ${user.username}, um über neue Erlebnisse informiert zu werden.`}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button variant="outline" size="sm" onClick={handleSendMessage}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Nachricht senden
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Mehr Optionen</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleReport}>
                        <Flag className="h-4 w-4 mr-2" />
                        Benutzer melden
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleBlock}>
                        <UserX className="h-4 w-4 mr-2" />
                        Benutzer blockieren
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            <div className="mt-4">
              <p className="text-sm">{user.bio}</p>
            </div>

            {/* XP Progress Bar */}
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Level {userLevel.level}</span>
                <span>
                  {userLevel.currentXP} / {userLevel.nextLevelXP} XP
                </span>
              </div>
              <XPProgressBar currentXP={userLevel.currentXP} nextLevelXP={userLevel.nextLevelXP} className="h-1.5" />
            </div>

            {/* Referral Banner (nur für eigenes Profil) */}
            {isOwner && <ProfileReferralBanner className="mt-4" />}

            <div className="mt-4 flex flex-wrap gap-4">
              <div>
                <span className="text-lg font-semibold">
                  {user.statistiken?.erlebnisse || user.erlebnisseCount || 0}
                </span>
                <span className="text-sm text-muted-foreground ml-1">Erlebnisse</span>
              </div>
              <div>
                <span className="text-lg font-semibold">
                  {user.statistiken?.kommentare || user.kommentareCount || 0}
                </span>
                <span className="text-sm text-muted-foreground ml-1">Kommentare</span>
              </div>
              <div>
                <span className="text-lg font-semibold">{user.statistiken?.erhalteneVotes || 0}</span>
                <span className="text-sm text-muted-foreground ml-1">Likes</span>
              </div>
              <div>
                <span className="text-lg font-semibold">
                  {user.statistiken ? `Lvl ${user.statistiken.xpLevel}` : "Lvl 1"}
                </span>
                <span className="text-sm text-muted-foreground ml-1">
                  {user.statistiken ? `XP: ${user.statistiken.xpPunkte}` : "XP: 0"}
                </span>
              </div>
            </div>

            {/* Badges */}
            {user.badges && user.badges.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Badges</h3>
                <div className="flex flex-wrap gap-2">
                  {user.badges.map((badge) => (
                    <Badge key={badge.id} style={{ backgroundColor: badge.farbe }} className="text-white">
                      {badge.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Gemeinsame Gruppen (nur anzeigen, wenn nicht der eigene Profil und wenn gemeinsame Gruppen existieren) */}
            {!isOwner && sharedGroups.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Gemeinsame Gruppen</h3>
                <div className="flex flex-wrap gap-2">
                  {sharedGroups.map((group) => (
                    <Badge key={group.id} variant="outline">
                      {group.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialoge */}
      <ProfilBearbeitenDialog benutzer={user} open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen} />
      <EinstellungenDialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
        <DialogDescription>Verwalte deine Kontoeinstellungen und Präferenzen.</DialogDescription>
      </EinstellungenDialog>
    </div>
  )
}
