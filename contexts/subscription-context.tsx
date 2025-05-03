"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { SubscriptionTier, UserSubscription } from "@/types/subscription"
import { useToast } from "@/hooks/use-toast"
import { PaywallModal } from "@/components/subscription/paywall-modal"

interface SubscriptionContextType {
  userSubscription: UserSubscription
  isLoading: boolean
  openPaywall: (variant?: "soft" | "hard", triggerContext?: string) => void
  startTrial: (tier: SubscriptionTier) => Promise<boolean>
  upgradePlan: (tier: SubscriptionTier) => Promise<boolean>
  cancelSubscription: () => Promise<boolean>
  useMana: (amount: number) => boolean
}

const defaultSubscription: UserSubscription = {
  tier: "free",
  manaRemaining: 50,
  trialEndsAt: null,
  renewsAt: null,
  cancelledAt: null,
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [userSubscription, setUserSubscription] = useState<UserSubscription>(defaultSubscription)
  const [isLoading, setIsLoading] = useState(true)
  const [paywallOpen, setPaywallOpen] = useState(false)
  const [paywallVariant, setPaywallVariant] = useState<"soft" | "hard">("soft")
  const [paywallTrigger, setPaywallTrigger] = useState<string>("feature")
  const { toast } = useToast()

  // Simuliere das Laden der Abodaten
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const openPaywall = (variant: "soft" | "hard" = "soft", triggerContext = "feature") => {
    setPaywallVariant(variant)
    setPaywallTrigger(triggerContext)
    setPaywallOpen(true)
  }

  const startTrial = async (tier: SubscriptionTier): Promise<boolean> => {
    try {
      // Simuliere API-Aufruf
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const trialEndDate = new Date()
      trialEndDate.setDate(trialEndDate.getDate() + 7)

      setUserSubscription({
        ...userSubscription,
        tier,
        trialEndsAt: trialEndDate,
        manaRemaining: tier === "explorer" ? 300 : tier === "creator" ? 1000 : 50,
      })

      toast({
        title: "Testphase gestartet",
        description: `Deine 7-tägige Testphase für ${tier} hat begonnen.`,
      })

      return true
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Die Testphase konnte nicht gestartet werden. Bitte versuche es später erneut.",
        variant: "destructive",
      })
      return false
    }
  }

  const upgradePlan = async (tier: SubscriptionTier): Promise<boolean> => {
    try {
      // Simuliere API-Aufruf
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const renewDate = new Date()
      renewDate.setMonth(renewDate.getMonth() + 1)

      setUserSubscription({
        ...userSubscription,
        tier,
        trialEndsAt: null,
        renewsAt: renewDate,
        manaRemaining: tier === "explorer" ? 300 : tier === "creator" ? 1000 : 50,
      })

      toast({
        title: "Upgrade erfolgreich",
        description: `Dein Abonnement wurde auf ${tier} aktualisiert.`,
      })

      return true
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Das Upgrade konnte nicht durchgeführt werden. Bitte versuche es später erneut.",
        variant: "destructive",
      })
      return false
    }
  }

  const cancelSubscription = async (): Promise<boolean> => {
    try {
      // Simuliere API-Aufruf
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const cancelDate = new Date()

      setUserSubscription({
        ...userSubscription,
        cancelledAt: cancelDate,
      })

      toast({
        title: "Kündigung erfolgreich",
        description: "Dein Abonnement wurde gekündigt und läuft bis zum Ende der aktuellen Abrechnungsperiode weiter.",
      })

      return true
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Die Kündigung konnte nicht durchgeführt werden. Bitte versuche es später erneut.",
        variant: "destructive",
      })
      return false
    }
  }

  const useMana = (amount: number): boolean => {
    if (userSubscription.manaRemaining < amount) {
      openPaywall("soft", "mana_depleted")
      return false
    }

    setUserSubscription({
      ...userSubscription,
      manaRemaining: userSubscription.manaRemaining - amount,
    })

    return true
  }

  return (
    <SubscriptionContext.Provider
      value={{
        userSubscription,
        isLoading,
        openPaywall,
        startTrial,
        upgradePlan,
        cancelSubscription,
        useMana,
      }}
    >
      {children}
      <PaywallModal
        open={paywallOpen}
        onOpenChange={setPaywallOpen}
        variant={paywallVariant}
        triggerContext={paywallTrigger}
      />
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider")
  }
  return context
}
