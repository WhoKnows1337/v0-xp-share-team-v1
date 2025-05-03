"use client"

import { useEffect, useState } from "react"
import { ErlebnisWizardModal, useErlebnisWizard } from "@/components/erlebnis-wizard-modal"

export function WizardModalWrapper() {
  const [isMounted, setIsMounted] = useState(false)
  const { isOpen, closeWizard } = useErlebnisWizard()

  useEffect(() => {
    setIsMounted(true)

    // Event-Listener für das benutzerdefinierte Event
    const handleOpenWizard = () => {
      console.log("WizardModalWrapper: Event 'openErlebnisWizard' empfangen")
    }

    window.addEventListener("openErlebnisWizard", handleOpenWizard)

    return () => {
      window.removeEventListener("openErlebnisWizard", handleOpenWizard)
    }
  }, [])

  if (!isMounted) return null

  return <ErlebnisWizardModal isOpen={isOpen} onClose={closeWizard} />
}
