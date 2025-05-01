"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { SkipLink } from "@/components/ui/skip-link"
import { XPAssistant } from "@/components/xp-assistant/xp-assistant"
import { ErlebnisWizardModal } from "@/components/erlebnis-wizard-modal"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main-content" className="min-h-screen">
        <div className="container mx-auto px-4 py-6">{children}</div>
      </main>
      <XPAssistant />
      <ErlebnisWizardModal />
    </>
  )
}
