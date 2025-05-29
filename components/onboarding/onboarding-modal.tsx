"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { OnboardingFlow } from "./onboarding-flow"
import { useLocalStorage } from "@/hooks/use-local-storage"

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage("hasCompletedOnboarding", false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    // Zeige das Onboarding nur an, wenn es noch nicht abgeschlossen wurde
    if (!hasCompletedOnboarding) {
      // Verzögere das Öffnen des Modals um 1 Sekunde, damit die Seite zuerst geladen wird
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [hasCompletedOnboarding, isMounted])

  const handleComplete = () => {
    setHasCompletedOnboarding(true)
    setIsOpen(false)
  }

  if (!isMounted) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl p-0" hideClose>
        <OnboardingFlow onComplete={handleComplete} />
      </DialogContent>
    </Dialog>
  )
}
