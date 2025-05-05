"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const isJoinPage = pathname?.startsWith("/join")

  // Keine Sidebar auf der Startseite oder Join-Seite
  if (isHomePage || isJoinPage) {
    return <>{children}</>
  }

  return <DashboardLayout>{children}</DashboardLayout>
}
