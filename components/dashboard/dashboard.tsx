"use client"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "./dashboard-sidebar"
import { DashboardOverview } from "./dashboard-overview"
import { DashboardHome } from "./dashboard-home"
import { MeineErlebnisse } from "./meine-erlebnisse"
import { AktivitaetsFeed } from "./aktivitaets-feed"
import { SkipLink } from "../ui/skip-link"
import { EntdeckenPageUpdated } from "../entdecken/entdecken-page-updated"
import { GeteilteErlebnisse } from "./geteilte-erlebnisse"
import { ProfileProvider } from "@/contexts/profile-context"
import { BenutzerProfil } from "@/components/profil/benutzer-profil"
import { findUserByUsername } from "@/lib/user-utils"
import { toast } from "@/components/ui/use-toast"

type DashboardTab =
  | "home"
  | "übersicht"
  | "meine-erlebnisse"
  | "geteilte-erlebnisse"
  | "aktivitäten"
  | "entdecken"
  | "profil"

interface DashboardProps {
  initialTab?: DashboardTab
  username?: string // Neuer Parameter für die Profilansicht
}

function DashboardContent({ initialTab = "home", username }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab)
  const [activeProfile, setActiveProfile] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Wenn ein Benutzername übergeben wird, laden wir das Profil
  useEffect(() => {
    if (username && initialTab === "profil") {
      const user = findUserByUsername(username)
      if (user) {
        setActiveProfile(user)
        setError(null)
      } else {
        setError(`Benutzer "${username}" wurde nicht gefunden.`)
        toast({
          title: "Benutzer nicht gefunden",
          description: `Der Benutzer "${username}" konnte nicht gefunden werden.`,
          variant: "destructive",
        })
      }
    }
  }, [username, initialTab])

  // Zurück-Button-Handler
  const handleBackClick = () => {
    setActiveProfile(null)
    setError(null)
    setActiveTab("home")
  }

  return (
    <>
      <SkipLink href="#dashboard-content">Zum Dashboard-Inhalt springen</SkipLink>
      <div className="flex h-screen overflow-hidden">
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} className="border-r px-3 py-4" />
        </div>
        <div className="flex flex-col flex-1 md:pl-64">
          <main id="dashboard-content" className="flex-1 overflow-y-auto p-4">
            {error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                <p>{error}</p>
                <button onClick={handleBackClick} className="mt-2 text-sm underline hover:text-red-800">
                  Zurück zum Dashboard
                </button>
              </div>
            ) : activeProfile ? (
              <div>
                <button
                  onClick={handleBackClick}
                  className="mb-4 flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  Zurück
                </button>
                <BenutzerProfil benutzer={activeProfile} />
              </div>
            ) : (
              <>
                {activeTab === "home" && <DashboardHome />}
                {activeTab === "übersicht" && <DashboardOverview />}
                {activeTab === "meine-erlebnisse" && <MeineErlebnisse />}
                {activeTab === "geteilte-erlebnisse" && <GeteilteErlebnisse />}
                {activeTab === "aktivitäten" && <AktivitaetsFeed />}
                {activeTab === "entdecken" && <EntdeckenPageUpdated />}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  )
}

export function Dashboard(props: DashboardProps) {
  return (
    <ProfileProvider>
      <DashboardContent {...props} />
    </ProfileProvider>
  )
}
