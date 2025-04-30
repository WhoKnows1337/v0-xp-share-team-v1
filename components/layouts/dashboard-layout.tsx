"use client"

import { useEffect, type ReactNode } from "react"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { SkipLink } from "@/components/ui/skip-link"
import { useSidebar } from "@/contexts/sidebar-context"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: ReactNode
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export function DashboardLayout({ children, activeTab = "home", onTabChange = () => {} }: DashboardLayoutProps) {
  const { sidebarVisible } = useSidebar()

  // Debug-Ausgabe, um zu sehen, ob der Zustand sich ändert
  useEffect(() => {
    console.log("Sidebar visible:", sidebarVisible)

    // Stellen Sie sicher, dass die Sidebar beim Seitenwechsel sichtbar bleibt
    const handleRouteChange = () => {
      if (!sidebarVisible) {
        onTabChange(activeTab)
      }
    }

    window.addEventListener("popstate", handleRouteChange)
    return () => {
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [sidebarVisible, activeTab, onTabChange])

  return (
    <>
      <SkipLink href="#dashboard-content">Zum Dashboard-Inhalt springen</SkipLink>
      <div className="flex min-h-[calc(100vh-4rem)] overflow-hidden">
        {/* Sidebar mit verbesserter Transition */}
        <aside
          className={cn(
            "fixed inset-y-16 left-0 z-30 bg-background border-r transition-all duration-300 ease-in-out",
            sidebarVisible ? "w-64 translate-x-0" : "w-0 -translate-x-full opacity-0 pointer-events-none",
          )}
          aria-hidden={!sidebarVisible}
        >
          <DashboardSidebar activeTab={activeTab} onTabChange={onTabChange} className="h-full overflow-y-auto p-4" />
        </aside>

        {/* Hauptinhalt mit Transition */}
        <main
          id="dashboard-content"
          className={cn("flex-1 transition-all duration-300 ease-in-out p-4", sidebarVisible ? "ml-64" : "ml-0")}
        >
          {children}
        </main>
      </div>
    </>
  )
}
