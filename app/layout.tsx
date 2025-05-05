import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SubscriptionProvider } from "@/contexts/subscription-context"
import { ErlebnisWizardProvider } from "@/components/erlebnis-wizard-modal"
import { ProfileProvider } from "@/contexts/profile-context"
import { XPAssistantProvider } from "@/components/xp-assistant-provider"
import { SidebarProvider } from "@/contexts/sidebar-context"
import { Toaster } from "@/components/ui/toaster"
import { ErlebnisWizardModal } from "@/components/erlebnis-wizard-modal"
import { PaywallModal } from "@/components/subscription/paywall-modal"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "XP Share",
  description: "Teile deine Erlebnisse mit der Welt",
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SubscriptionProvider>
            <ProfileProvider>
              <XPAssistantProvider>
                <SidebarProvider>
                  <ErlebnisWizardProvider>
                    {children}
                    <Toaster />
                    <ErlebnisWizardModal />
                    <PaywallModal />
                  </ErlebnisWizardProvider>
                </SidebarProvider>
              </XPAssistantProvider>
            </ProfileProvider>
          </SubscriptionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
