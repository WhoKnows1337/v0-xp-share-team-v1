"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function NavWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const isJoinPage = pathname?.startsWith("/join")
  const [activeTab, setActiveTab] = useState("")
  const [mounted, setMounted] = useState(false)

  // Bestimme den aktiven Tab basierend auf dem Pfadnamen
  useEffect(() => {
    if (pathname === "/dashboard") setActiveTab("home")
    else if (pathname === "/insights") setActiveTab("insights-trends")
    else if (pathname === "/entdecken") setActiveTab("entdecken")
    else if (pathname === "/nachrichten") setActiveTab("nachrichten")
    else if (pathname === "/channels") setActiveTab("channels")
    else if (pathname === "/xp-buch") setActiveTab("xp-buch")
    else if (pathname === "/community") setActiveTab("community")
    else if (pathname === "/achievements") setActiveTab("achievements")
    else if (pathname === "/leaderboard") setActiveTab("leaderboard")
    else if (pathname === "/referrals") setActiveTab("referrals")
    else if (pathname?.startsWith("/profil")) setActiveTab("profil")
    else if (pathname === "/einstellungen") setActiveTab("einstellungen")
    else if (pathname === "/admin/tracking") setActiveTab("admin-tracking")
    else setActiveTab("")

    setMounted(true)
  }, [pathname])

  // Während der Hydration nichts rendern, um Unterschiede zu vermeiden
  if (!mounted) {
    return <>{children}</>
  }

  // Nur die Startseite und Join-Seite haben keine Navbar und Sidebar
  const shouldShowNavigation = !isHomePage && !isJoinPage

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar nur anzeigen, wenn nicht auf der Startseite oder Join-Seite */}
      {shouldShowNavigation && <Navbar />}

      <div className="flex flex-1">
        {/* Nur die Dashboard-Sidebar anzeigen, wenn nicht auf der Startseite oder Join-Seite */}
        {shouldShowNavigation && (
          <aside className="w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] border-r bg-background z-40">
            <ScrollArea className="h-full">
              <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
            </ScrollArea>
          </aside>
        )}

        {/* Hauptinhalt mit Abstand für die Sidebar */}
        <main className={`flex-1 ${shouldShowNavigation ? "ml-64" : ""} ${shouldShowNavigation ? "pt-16" : ""}`}>
          {children}
        </main>
      </div>
    </div>
  )
}
