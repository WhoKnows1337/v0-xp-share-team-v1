"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ErlebnisWizard } from "./erlebnis-wizard"

// Globaler Event-Emitter für das Öffnen des Wizards
let wizardEventListeners: (() => void)[] = []

export function addWizardOpenListener(listener: () => void) {
  wizardEventListeners.push(listener)
  return () => {
    wizardEventListeners = wizardEventListeners.filter((l) => l !== listener)
  }
}

// Verbessere die Logging-Ausgaben für bessere Fehlerdiagnose
export function openErlebnisWizard() {
  console.log("openErlebnisWizard wurde aufgerufen, aktive Listener:", wizardEventListeners.length)
  if (wizardEventListeners.length === 0) {
    console.warn("Keine aktiven Listener für den ErlebnisWizard gefunden!")
  }
  wizardEventListeners.forEach((listener) => listener())
}

export function ErlebnisWizardModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Registriere einen Listener für das Öffnen des Wizards
    console.log("ErlebnisWizardModal: Registriere Listener")
    const removeListener = addWizardOpenListener(() => {
      console.log("ErlebnisWizard wird geöffnet")
      setIsOpen(true)
    })

    // Cleanup beim Unmount
    return () => {
      console.log("ErlebnisWizardModal: Entferne Listener")
      removeListener()
    }
  }, [])

  const handleComplete = () => {
    console.log("ErlebnisWizard: Abgeschlossen")
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Neues Erlebnis erstellen</DialogTitle>
          <DialogDescription>
            Teile dein Erlebnis mit der Community. Fülle die folgenden Schritte aus, um dein Erlebnis zu erstellen.
          </DialogDescription>
        </DialogHeader>
        {isOpen && <ErlebnisWizard onComplete={handleComplete} />}
      </DialogContent>
    </Dialog>
  )
}
