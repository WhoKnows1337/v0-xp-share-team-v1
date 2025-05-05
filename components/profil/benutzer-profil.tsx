"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { findUserByUsername } from "@/lib/user-utils"
import { mockUsers } from "@/lib/mock-users"
import { ProfilHeader } from "./profil-header"
import { ProfilTabs } from "./profil-tabs"
import { ErlebnisseTab } from "./erlebnisse-tab"
import { KommentareTab } from "./kommentare-tab"
import { LesezeichenTab } from "./lesezeichen-tab"
import { StatistikenTab } from "./statistiken-tab"
import { isCurrentUser } from "@/lib/user-utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Home, User } from "lucide-react"
import type { User as UserType } from "@/lib/mock-users"
import { AchievementsTab } from "@/components/profile/achievements-tab" // Importiere den AchievementsTab

interface BenutzerProfilProps {
  username?: string
  benutzer?: UserType
  user?: UserType // Alternative Prop für Kompatibilität
}

export function BenutzerProfil({ username, benutzer, user }: BenutzerProfilProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("erlebnisse")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Verwende entweder den übergebenen Benutzer oder suche nach dem Benutzernamen
  const [userToDisplay, setUserToDisplay] = useState<UserType | null>(benutzer || user || null)

  useEffect(() => {
    if (userToDisplay) {
      setLoading(false)
      return
    }

    if (username) {
      // Simuliere eine Datenbankabfrage
      setLoading(true)
      setTimeout(() => {
        const foundUser = findUserByUsername(username)
        console.log("BenutzerProfil: Suche nach Benutzer:", username)
        console.log("BenutzerProfil: Gefundener Benutzer:", foundUser)

        if (foundUser) {
          setUserToDisplay(foundUser)
          setError(null)
        } else {
          setUserToDisplay(null)
          setError(`Der Benutzer "${username}" wurde nicht gefunden.`)

          // Fallback: Verwende den ersten verfügbaren Benutzer
          if (mockUsers.length > 0) {
            console.log("BenutzerProfil: Verwende Fallback-Benutzer:", mockUsers[0].username)
            setUserToDisplay(mockUsers[0])
          }
        }
        setLoading(false)
      }, 500)
    }
  }, [username, benutzer, user, userToDisplay])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Wenn kein Benutzer gefunden wurde und kein Fallback verfügbar ist
  if (!userToDisplay) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Benutzer nicht gefunden</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <div className="flex gap-4 mt-6">
          <Button onClick={() => router.push("/dashboard")} className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Zum Dashboard
          </Button>

          {mockUsers.length > 0 && (
            <Button
              variant="outline"
              onClick={() => router.push(`/profil/${encodeURIComponent(mockUsers[0].username)}`)}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Zum Beispielprofil
            </Button>
          )}
        </div>
      </div>
    )
  }

  const isUserCurrentUser = isCurrentUser(userToDisplay.username)

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <Alert variant="warning" className="mb-6">
          <AlertTitle>Hinweis</AlertTitle>
          <AlertDescription>{error} Es wird stattdessen ein Beispielprofil angezeigt.</AlertDescription>
        </Alert>
      )}

      <ProfilHeader benutzer={userToDisplay} isCurrentUser={isUserCurrentUser} />

      <div className="mt-8">
        <ProfilTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCurrentUser={isUserCurrentUser}
          benutzer={userToDisplay}
        />

        <div className="mt-6">
          {activeTab === "erlebnisse" && <ErlebnisseTab benutzer={userToDisplay} isCurrentUser={isUserCurrentUser} />}
          {activeTab === "kommentare" && <KommentareTab benutzer={userToDisplay} />}
          {activeTab === "lesezeichen" && isUserCurrentUser && <LesezeichenTab />}
          {activeTab === "statistiken" && <StatistikenTab benutzer={userToDisplay} />}
          {activeTab === "achievements" && (
            <AchievementsTab
              achievements={userToDisplay.achievements || []}
              isOwner={isUserCurrentUser}
              streak={{
                current: userToDisplay.statistiken?.streak || 0,
                max: userToDisplay.statistiken?.maxStreak || 0,
                lastActivity: userToDisplay.lastActivity || new Date().toISOString(),
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
