"use client"
import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import { XPAssistantProvider } from "@/components/xp-assistant-provider"
import { SidebarProvider } from "@/contexts/sidebar-context"
import { SkipLink } from "@/components/ui/skip-link"
import { ErlebnisWizardProvider, ErlebnisWizardModal } from "@/components/erlebnis-wizard-modal"
import { Startseite } from "@/components/startseite/startseite"

const inter = Inter({ subsets: ["latin"] })

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SidebarProvider>
            <XPAssistantProvider>
              <ErlebnisWizardProvider>
                <SkipLink />
                <Navbar />
                {children}
                <WizardModalWrapper />
                <Toaster />
              </ErlebnisWizardProvider>
            </XPAssistantProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

// Client-Komponente für das Modal, um Hydration-Fehler zu vermeiden
function WizardModalWrapper() {
  return <ClientWizardModal />
}

// Diese Komponente wird client-seitig gerendert
import { useErlebnisWizard } from "@/components/erlebnis-wizard-modal"

function ClientWizardModal() {
  const { isOpen, closeWizard } = useErlebnisWizard()
  return <ErlebnisWizardModal isOpen={isOpen} onClose={closeWizard} />
}

export default function Home() {
  return <Startseite />
}
