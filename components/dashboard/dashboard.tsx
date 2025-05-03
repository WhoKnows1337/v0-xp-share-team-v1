"use client"

import { useState, useEffect } from "react"
import { DashboardHome } from "./dashboard-home"
import { DashboardOverview } from "./dashboard-overview"
import { MeineErlebnisse } from "./meine-erlebnisse"
import { AktivitaetsFeed } from "./aktivitaets-feed"
import { EntdeckenPageUpdated } from "../entdecken/entdecken-page-updated"
import { GeteilteErlebnisse } from "./geteilte-erlebnisse"
import { ProfileProvider } from "@/contexts/profile-context"
import { BenutzerProfil } from "@/components/profil/benutzer-profil"
import { findUserByUsername } from "@/lib/user-utils"
import { toast } from "@/components/ui/use-toast"
import { EinblickeTrends } from "./einblicke-trends"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { ErlebnisWizardProvider } from "@/components/erlebnis-wizard-modal"

type DashboardTab =
  | "home"
  | "übersicht"
  | "meine-erlebnisse"
  | "geteilte-erlebnisse"
  | "aktivitäten"
  | "entdecken"
  | "profil"
  | "insights-trends"

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
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
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
          {activeTab === "insights-trends" && <EinblickeTrends />}
          {activeTab === "übersicht" && <DashboardOverview />}
          {activeTab === "meine-erlebnisse" && <MeineErlebnisse />}
          {activeTab === "geteilte-erlebnisse" && <GeteilteErlebnisse />}
          {activeTab === "aktivitäten" && <AktivitaetsFeed />}
          {activeTab === "entdecken" && <EntdeckenPageUpdated />}
        </>
      )}
    </DashboardLayout>
  )
}

export function Dashboard(props: DashboardProps) {
  return (
    <ProfileProvider>
      <ErlebnisWizardProvider>
        <DashboardContent {...props} />
      </ErlebnisWizardProvider>
    </ProfileProvider>
  )
}
