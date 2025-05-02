"use client"

import { useEffect } from "react"
import { ErlebnisWizardModal, useErlebnisWizard } from "@/components/erlebnis-wizard-modal"

export function WizardModalWrapper() {
  const { isOpen, openWizard, closeWizard } = useErlebnisWizard()

  useEffect(() => {
    // Event-Listener für das Öffnen des Wizards
    const handleOpenWizard = () => {
      openWizard()
    }

    window.addEventListener("openErlebnisWizard", handleOpenWizard)

    return () => {
      window.removeEventListener("openErlebnisWizard", handleOpenWizard)
    }
  }, [openWizard])

  return <ErlebnisWizardModal open={isOpen} onOpenChange={(open) => (open ? openWizard() : closeWizard())} />
}
