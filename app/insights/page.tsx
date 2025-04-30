"use client"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { EinblickeTrends } from "@/components/dashboard/einblicke-trends"
import { useRouter } from "next/navigation"

export default function InsightsPage() {
  const router = useRouter()

  // Funktion zum Umgang mit Tab-Änderungen
  const handleTabChange = (tab: string) => {
    if (tab === "home") {
      router.push("/dashboard")
    } else if (tab === "insights-trends") {
      // Bereits auf der Insights-Seite, nichts tun
    } else if (tab === "meine-erlebnisse") {
      router.push("/dashboard?tab=meine-erlebnisse")
    } else if (tab === "aktivitäten") {
      router.push("/dashboard?tab=aktivitäten")
    } else if (tab === "entdecken") {
      router.push("/entdecken")
    } else if (tab === "channels") {
      router.push("/channels")
    } else if (tab === "profil") {
      const currentUser = { username: "mein-profil" } // Hier sollten Sie den aktuellen Benutzer abrufen
      router.push(`/profil/${currentUser.username}`)
    }
  }

  return (
    <DashboardLayout activeTab="insights-trends" onTabChange={handleTabChange}>
      <div className="container mx-auto py-4">
        <EinblickeTrends />
      </div>
    </DashboardLayout>
  )
}
