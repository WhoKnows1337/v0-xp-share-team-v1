"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import { XPAssistantProvider } from "@/components/xp-assistant-provider"
import { SidebarProvider } from "@/contexts/sidebar-context"
import { SkipLink } from "@/components/ui/skip-link"
import { WizardModalWrapper } from "@/components/wizard-modal-wrapper"
import { ErlebnisWizardProvider } from "@/components/erlebnis-wizard-modal"
import { SubscriptionProvider } from "@/contexts/subscription-context"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <SidebarProvider>
        <SubscriptionProvider>
          <XPAssistantProvider>
            <ErlebnisWizardProvider>
              <SkipLink />
              <Navbar />
              {children}
              <WizardModalWrapper />
              <Toaster />
            </ErlebnisWizardProvider>
          </XPAssistantProvider>
        </SubscriptionProvider>
      </SidebarProvider>
    </ThemeProvider>
  )
}
