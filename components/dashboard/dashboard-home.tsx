"use client"

import { useState, useEffect } from "react"
import { openErlebnisWizard } from "@/components/erlebnis-wizard-modal"
import { useRouter } from "next/navigation"
import { DashboardOverview } from "./dashboard-overview"
import { MeineErlebnisse } from "./meine-erlebnisse"
import { AktivitaetsFeed } from "./aktivitaets-feed"
import { GeteilteErlebnisse } from "./geteilte-erlebnisse"
import { DashboardHeader } from "./dashboard-header"
import { DashboardReferralBanner } from "../referral/dashboard-referral-banner"
import { Loading } from "@/components/loading"

interface DashboardHomeProps {
  initialTab?: "overview" | "my-experiences" | "shared-experiences" | "activity"
}

export function DashboardHome({ initialTab = "overview" }: DashboardHomeProps) {
  const [userName, setUserName] = useState("Alice")
  const [feedType, setFeedType] = useState("empfehlungen")
  const [lastActivity, setLastActivity] = useState("vor 3 Tagen")
  const [hasSharedExperiences, setHasSharedExperiences] = useState(true)
  const [daysSinceLastExperience, setDaysSinceLastExperience] = useState(30)
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(initialTab)
  const [isLoading, setIsLoading] = useState(true)

  // Simuliere Ladezeit für bessere UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Verwende die openErlebnisWizard-Funktion statt des Hooks
  const handleNewExperience = () => {
    console.log("Dashboard: Öffne ErlebnisWizard")

    // Rufe die Funktion direkt auf
    openErlebnisWizard()

    // Alternativ, löse das Event direkt aus
    if (typeof window !== "undefined") {
      console.log("Dashboard: Löse Event 'openErlebnisWizard' aus")
      const event = new CustomEvent("openErlebnisWizard")
      window.dispatchEvent(event)
    }
  }

  const handleErlebnisClick = (item: any) => {
    // Navigiere zur Erlebnis-Detailseite
    if (item.erlebnisId) {
      router.push(`/erlebnis/${item.erlebnisId}`)
    } else if (item.id) {
      // Fallback, falls erlebnisId nicht vorhanden ist
      router.push(`/erlebnis/${item.id}`)
    }
  }

  if (isLoading) {
    return <Loading message="Dashboard wird geladen..." />
  }

  return (
    <div className="space-y-6">
      <DashboardReferralBanner />
      <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "overview" && <DashboardOverview />}
      {activeTab === "my-experiences" && <MeineErlebnisse />}
      {activeTab === "shared-experiences" && <GeteilteErlebnisse />}
      {activeTab === "activity" && <AktivitaetsFeed />}
    </div>
  )
}
