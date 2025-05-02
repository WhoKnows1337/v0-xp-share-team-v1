import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import { XPAssistantProvider } from "@/components/xp-assistant-provider"
import { SidebarProvider } from "@/contexts/sidebar-context"
import { SkipLink } from "@/components/ui/skip-link"
import { WizardModalWrapper } from "@/components/wizard-modal-wrapper"
import { ErlebnisWizardProvider } from "@/components/erlebnis-wizard-modal"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "XP Share - Teile deine Erlebnisse",
  description: "Eine Plattform zum Teilen und Entdecken von Erlebnissen",
    generator: 'v0.dev'
}

export default function RootLayout({
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
