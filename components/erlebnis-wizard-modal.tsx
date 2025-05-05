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

  // Event-Listener für das benutzerdefinierte Event
  useEffect(() => {
    const handleOpenWizard = () => {
      openWizard()
    }

    window.addEventListener("openErlebnisWizard", handleOpenWizard)
    return () => {
      window.removeEventListener("openErlebnisWizard", handleOpenWizard)
    }
  }, [])

  return (
    <ErlebnisWizardContext.Provider value={{ isOpen, openWizard, closeWizard }}>
      {children}
      <ErlebnisWizardModal isOpen={isOpen} onClose={closeWizard} />
    </ErlebnisWizardContext.Provider>
  )
}

export function useErlebnisWizard() {
  const context = useContext(ErlebnisWizardContext)
  if (context === undefined) {
    throw new Error("useErlebnisWizard must be used within a ErlebnisWizardProvider")
  }
  return context
}

interface ErlebnisWizardModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ErlebnisWizardModal({ isOpen, onClose }: ErlebnisWizardModalProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleComplete = () => {
    console.log("ErlebnisWizard: Abgeschlossen")
    onClose()
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Neues Erlebnis erstellen</DialogTitle>
          <DialogDescription>
            Teile dein Erlebnis mit der Community. Fülle die folgenden Schritte aus, um dein Erlebnis zu erstellen.
          </DialogDescription>
        </DialogHeader>
        {isMounted && <ErlebnisWizard onComplete={handleComplete} />}
      </DialogContent>
    </Dialog>
  )
}

// Für Abwärtskompatibilität mit bestehendem Code
export function openErlebnisWizard() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("openErlebnisWizard"))
  }
}
