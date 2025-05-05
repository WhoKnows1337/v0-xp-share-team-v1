import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ErlebnisWizardModal, ErlebnisWizardProvider } from "@/components/erlebnis-wizard-modal"
import { XPAssistantProvider } from "@/components/xp-assistant-provider"
import { ProfileProvider } from "@/contexts/profile-context"
import { SubscriptionProvider } from "@/contexts/subscription-context"
import { SidebarProvider } from "@/contexts/sidebar-context"
import { Navbar } from "@/components/navbar"

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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SubscriptionProvider>
            <ProfileProvider>
              <SidebarProvider>
                <XPAssistantProvider>
                  <ErlebnisWizardProvider>
                    <div className="flex flex-col min-h-screen">
                      <Navbar />
                      <div className="flex-1 pt-16">{children}</div>
                    </div>
                    <Toaster />
                    <ErlebnisWizardModal />
                  </ErlebnisWizardProvider>
                </XPAssistantProvider>
              </SidebarProvider>
            </ProfileProvider>
          </SubscriptionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
