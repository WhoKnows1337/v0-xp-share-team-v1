"use client"

import { useState } from "react"
import type { User } from "@/lib/mock-users"
import { Button } from "@/components/ui/button"
import { Pencil, CheckCircle, Settings, UserPlus, UserMinus, MessageSquare } from "lucide-react"
import { Achievements } from "./achievements"
import { ProfilBearbeitenDialog } from "./profil-bearbeiten-dialog"
import { EinstellungenDialog } from "./einstellungen-dialog"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { LevelChip } from "@/components/xp/level-chip" // Importiere LevelChip
import { StreakMeter } from "@/components/xp/streak-meter" // Importiere StreakMeter

interface ProfilHeaderProps {
  benutzer: User
  isCurrentUser: boolean
}

export function ProfilHeader({ benutzer, isCurrentUser }: ProfilHeaderProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const router = useRouter()

  const handleFollow = () => {
    setIsFollowing(true)
    toast({
      title: `Du folgst jetzt ${benutzer.username}`,
      description: "Du wirst über neue Erlebnisse informiert.",
    })
  }

  const handleUnfollow = () => {
    setIsFollowing(false)
    toast({
      title: `Du folgst ${benutzer.username} nicht mehr`,
      description: "Du wirst keine Benachrichtigungen mehr erhalten.",
    })
  }

  const handleSendMessage = () => {
    // Erstelle eine neue Konversation mit diesem Benutzer
    router.push(`/nachrichten?newChat=${benutzer.username}`)
  }

  // Mock-Streak für die Anzeige
  const mockStreak = {
    current: 7,
    max: 14,
    lastActivity: new Date().toISOString(),
  }

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
                src={benutzer.avatar || "/placeholder.svg?height=96&width=96&query=user"}
                alt={benutzer.username}
                className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 object-cover"
              />
              {benutzer.isVerifiziert && (
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
                  {benutzer.username}
                  {benutzer.isVerifiziert && (
                    <span className="text-blue-500">
                      <CheckCircle className="h-5 w-5" />
                    </span>
                  )}
                </h1>

                {/* LevelChip-Komponente */}
                <LevelChip
                  level={benutzer.statistiken?.xpLevel || 1}
                  levelInfo={{
                    range:
                      benutzer.statistiken?.xpLevel >= 26
                        ? "Adept"
                        : benutzer.statistiken?.xpLevel >= 11
                          ? "Explorer"
                          : "Novice",
                    currentXP: benutzer.statistiken?.xpPunkte || 0,
                    nextLevelXP: (benutzer.statistiken?.xpLevel || 1) * 1000,
                    unlocks: [],
                  }}
                />

                {/* StreakMeter-Komponente */}
                <StreakMeter streak={mockStreak} />
              </div>

              <div className="flex gap-2">
                {isCurrentUser ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Profil bearbeiten
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIsSettingsDialogOpen(true)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Einstellungen
                    </Button>
                  </>
                ) : (
                  <>
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
                    <Button variant="outline" size="sm" onClick={handleSendMessage}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Nachricht senden
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm">{benutzer.bio}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-4">
              <div>
                <span className="text-lg font-semibold">{benutzer.statistiken?.erlebnisse || 0}</span>
                <span className="text-sm text-muted-foreground ml-1">Erlebnisse</span>
              </div>
              <div>
                <span className="text-lg font-semibold">{benutzer.statistiken?.kommentare || 0}</span>
                <span className="text-sm text-muted-foreground ml-1">Kommentare</span>
              </div>
              <div>
                <span className="text-lg font-semibold">{benutzer.statistiken?.erhalteneVotes || 0}</span>
                <span className="text-sm text-muted-foreground ml-1">Likes</span>
              </div>
              <div>
                <span className="text-lg font-semibold">Lvl {benutzer.statistiken?.xpLevel || 1}</span>
                <span className="text-sm text-muted-foreground ml-1">XP: {benutzer.statistiken?.xpPunkte || 0}</span>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Errungenschaften</h3>
              <Achievements achievements={benutzer.achievements || []} />
            </div>
          </div>
        </div>
      </div>

      {/* Dialoge */}
      <ProfilBearbeitenDialog benutzer={benutzer} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
      <EinstellungenDialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen} />
    </div>
  )
}
