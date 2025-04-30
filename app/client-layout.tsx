"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ErlebnisWizardModal } from "@/components/erlebnis-wizard-modal"
import { Navbar } from "@/components/navbar"
import { SkipLink } from "@/components/ui/skip-link"
import { XPAssistant } from "@/components/xp-assistant/xp-assistant"
import { usePathname } from "next/navigation"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="relative flex min-h-screen flex-col">
        <SkipLink />
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
      <Toaster />
      <ErlebnisWizardModal />

      {/* Füge den XP-Assistant direkt ein, aber nur auf bestimmten Seiten */}
      <XPAssistantWrapper />
    </ThemeProvider>
  )
}

// Komponente, die den XP-Assistant nur auf bestimmten Seiten rendert
function XPAssistantWrapper() {
  const pathname = usePathname()

  // Nicht auf der Startseite anzeigen
  if (pathname === "/") {
    return null
  }

  // Auf dem Dashboard automatisch öffnen
  const initialOpen = pathname.includes("/dashboard")

  return <XPAssistant initialOpen={initialOpen} />
}
