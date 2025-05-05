"use client"

import { useEffect, useState } from "react"
import { ErlebnisWizardModal, useErlebnisWizard } from "@/components/erlebnis-wizard-modal"

export function WizardModalWrapper() {
  const [isMounted, setIsMounted] = useState(false)
  const { isOpen, openWizard, closeWizard } = useErlebnisWizard()

  useEffect(() => {
    setIsMounted(true)

    // Event-Listener für das benutzerdefinierte Event
    const handleOpenWizard = () => {
      console.log("WizardModalWrapper: Event 'openErlebnisWizard' empfangen")
      openWizard()
    }

    window.addEventListener("openErlebnisWizard", handleOpenWizard)

    return () => {
      window.removeEventListener("openErlebnisWizard", handleOpenWizard)
    }
  }, [openWizard])

  if (!isMounted) return null

  return <ErlebnisWizardModal isOpen={isOpen} onClose={closeWizard} />
}
