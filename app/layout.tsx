import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ProfileProvider } from "@/contexts/profile-context"
import { SubscriptionProvider } from "@/contexts/subscription-context"
import { SidebarProvider } from "@/contexts/sidebar-context"
import { ErlebnisWizardProvider } from "@/components/erlebnis-wizard-modal"
import { XPAssistantProvider } from "@/components/xp-assistant-provider"
import { XPBuchProvider } from "@/contexts/xp-buch-context"
import { Toaster } from "@/components/ui/toaster"
import NavWrapper from "./nav-wrapper"
import { AuthProvider } from "@/contexts/auth-context"

// Importiere die MonacoEnvironmentSetup-Komponente
import { MonacoEnvironmentSetup } from "@/components/monaco-environment"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "XP Share - Teile deine Erlebnisse",
  description: "Eine Plattform zum Teilen und Entdecken von Erlebnissen",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className={inter.className}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <SubscriptionProvider>
              <ProfileProvider>
                <SidebarProvider>
                  <XPBuchProvider>
                    <ErlebnisWizardProvider>
                      <XPAssistantProvider>
                        {/* Füge die MonacoEnvironmentSetup-Komponente hier ein */}
                        <MonacoEnvironmentSetup />
                        <NavWrapper>{children}</NavWrapper>
                        <Toaster />
                      </XPAssistantProvider>
                    </ErlebnisWizardProvider>
                  </XPBuchProvider>
                </SidebarProvider>
              </ProfileProvider>
            </SubscriptionProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
