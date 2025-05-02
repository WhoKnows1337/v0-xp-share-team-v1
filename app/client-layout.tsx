"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname()

  // Bestimme den aktiven Tab basierend auf dem Pfadnamen
  let activeTab = ""
  if (pathname?.includes("/dashboard")) activeTab = "dashboard"
  else if (pathname?.includes("/insights")) activeTab = "insights"
  else if (pathname?.includes("/entdecken")) activeTab = "entdecken"
  else if (pathname?.includes("/nachrichten")) activeTab = "nachrichten"
  else if (pathname?.includes("/xp-buch")) activeTab = "xp-buch"
  else if (pathname?.includes("/community")) activeTab = "community"
  else if (pathname?.includes("/einstellungen")) activeTab = "einstellungen"

  // Verwende das Dashboard-Layout für alle Seiten außer der Startseite
  if (pathname === "/") {
    return <>{children}</>
  }

  return <DashboardLayout activeTab={activeTab}>{children}</DashboardLayout>
}
