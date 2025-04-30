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

export function openErlebnisWizard() {
  console.log("openErlebnisWizard wurde aufgerufen, Listener:", wizardEventListeners.length)
  wizardEventListeners.forEach((listener) => listener())
}

export function ErlebnisWizardModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Registriere einen Listener für das Öffnen des Wizards
    const removeListener = addWizardOpenListener(() => {
      console.log("Wizard wird geöffnet")
      setIsOpen(true)
    })

    // Cleanup beim Unmount
    return removeListener
  }, [])

  const handleComplete = () => {
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
