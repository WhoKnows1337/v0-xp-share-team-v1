"use client"

import type React from "react"
import { useSubscription } from "@/contexts/subscription-context"
import type { SubscriptionTier } from "@/types/subscription"

interface FeatureGateProps {
  /**
   * Die minimale Abostufe, die für den Zugriff auf die Funktion erforderlich ist
   */
  minimumTier: SubscriptionTier

  /**
   * Der Kontext, in dem die Funktion verwendet wird (für Tracking)
   */
  featureContext?: string

  /**
   * Die Komponente, die angezeigt wird, wenn der Benutzer Zugriff hat
   */
  children: React.ReactNode

  /**
   * Optional: Eine alternative Komponente, die angezeigt wird, wenn der Benutzer keinen Zugriff hat
   */
  fallback?: React.ReactNode
}

const tierLevels: Record<SubscriptionTier, number> = {
  free: 0,
  explorer: 1,
  creator: 2,
}

export function FeatureGate({ minimumTier, featureContext = "feature", children, fallback }: FeatureGateProps) {
  const { userSubscription, openPaywall } = useSubscription()

  const hasAccess = tierLevels[userSubscription.tier] >= tierLevels[minimumTier]

  if (hasAccess) {
    return <>{children}</>
  }

  if (fallback) {
    return (
      <div onClick={() => openPaywall("soft", featureContext)} className="cursor-pointer">
        {fallback}
      </div>
    )
  }

  return (
    <div
      onClick={() => openPaywall("soft", featureContext)}
      className="relative overflow-hidden rounded-md border border-dashed p-4 flex flex-col items-center justify-center min-h-[100px] cursor-pointer hover:bg-muted/50 transition-colors"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent skeleton-pulse" />
      <p className="font-medium text-center">Premium-Funktion</p>
      <p className="text-sm text-muted-foreground text-center">
        Upgrade auf {minimumTier === "explorer" ? "Explorer" : "Creator"} für Zugriff
      </p>
    </div>
  )
}
