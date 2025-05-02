"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ErlebnisWizard } from "@/components/erlebnis-wizard"

interface ErlebnisWizardContextType {
  isOpen: boolean
  openWizard: () => void
  closeWizard: () => void
}

const ErlebnisWizardContext = createContext<ErlebnisWizardContextType | undefined>(undefined)

export function ErlebnisWizardProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openWizard = () => {
    setIsOpen(true)
  }

  const closeWizard = () => {
    setIsOpen(false)
  }

  return (
    <ErlebnisWizardContext.Provider value={{ isOpen, openWizard, closeWizard }}>
      {children}
    </ErlebnisWizardContext.Provider>
  )
}

export function useErlebnisWizard() {
  const context = useContext(ErlebnisWizardContext)
  if (!context) {
    throw new Error("useErlebnisWizard must be used within a ErlebnisWizardProvider")
  }
  return context
}

// Hier ist die fehlende ErlebnisWizardModal-Komponente
interface ErlebnisWizardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ErlebnisWizardModal({ open, onOpenChange }: ErlebnisWizardModalProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleComplete = () => {
    console.log("ErlebnisWizard: Abgeschlossen")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Neues Erlebnis erstellen</DialogTitle>
          <DialogDescription>
            Teile dein Erlebnis mit der Community. Fülle die folgenden Schritte aus, um dein Erlebnis zu erstellen.
          </DialogDescription>
        </DialogHeader>
        {isMounted && open && <ErlebnisWizard onComplete={handleComplete} />}
      </DialogContent>
    </Dialog>
  )
}

// Für Abwärtskompatibilität mit bestehendem Code
export function openErlebnisWizard() {
  console.log("openErlebnisWizard wurde aufgerufen")

  // Verwende das benutzerdefinierte Event
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("openErlebnisWizard"))
  }
}
