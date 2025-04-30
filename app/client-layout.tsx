"use client"

import type React from "react"

import { SidebarProvider } from "@/contexts/sidebar-context"
import { Navbar } from "@/components/navbar"
import { XPAssistantProvider } from "@/components/xp-assistant-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { useEffect } from "react"
import { initMockData } from "@/lib/mock-init"
import { ErlebnisWizardModal } from "@/components/erlebnis-wizard-modal"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Initialisiere Mock-Daten beim ersten Laden
  useEffect(() => {
    initMockData()
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider>
        <XPAssistantProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1">{children}</div>
          </div>
          <ErlebnisWizardModal />
        </XPAssistantProvider>
      </SidebarProvider>
    </ThemeProvider>
  )
}
