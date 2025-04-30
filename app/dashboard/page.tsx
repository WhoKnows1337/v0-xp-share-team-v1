"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { DashboardHome } from "@/components/dashboard/dashboard-home"
import { MeineErlebnisse } from "@/components/dashboard/meine-erlebnisse"
import { AktivitaetsFeed } from "@/components/dashboard/aktivitaets-feed"
import { mockAktivitaeten } from "@/lib/mock-aktivitaeten"

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(tabParam || "home")

  // Aktualisiere den aktiven Tab, wenn sich die URL-Parameter ändern
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {activeTab === "home" && <DashboardHome />}
      {activeTab === "meine-erlebnisse" && <MeineErlebnisse />}
      {activeTab === "aktivitäten" && <AktivitaetsFeed aktivitaeten={mockAktivitaeten} />}
    </DashboardLayout>
  )
}
