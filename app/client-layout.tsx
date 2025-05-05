"use client"

import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import { ErlebnisWizardModal } from "@/components/erlebnis-wizard-modal"
import { ErlebnisWizardProvider } from "@/components/erlebnis-wizard-modal"

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ErlebnisWizardProvider>
      <>
        <main>{children}</main>
        <Toaster />
        <ErlebnisWizardModal />
      </>
    </ErlebnisWizardProvider>
  )
}
