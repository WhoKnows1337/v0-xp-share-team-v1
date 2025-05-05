"use client"

import { Button } from "@/components/ui/button"
import { PartyPopper } from "lucide-react"
import { useRouter } from "next/navigation"
import { getUserReferralStats } from "@/lib/mock-referrals"

interface ProfileReferralBannerProps {
  className?: string
  minReferrals?: number
}

export function ProfileReferralBanner({ className, minReferrals = 5 }: ProfileReferralBannerProps) {
  const router = useRouter()
  const stats = getUserReferralStats()

  // Zeige Banner nur an, wenn der Benutzer weniger als die Mindestanzahl an Referrals hat
  if (stats.accepted >= minReferrals) {
    return null
  }

  return (
    <div
      className={`bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-4 flex items-center justify-between ${className}`}
    >
      <div className="flex items-center">
        <PartyPopper className="h-5 w-5 text-yellow-500 mr-3" />
        <span className="font-medium">Verdiene Mana – lade Freund:innen ein</span>
      </div>
      <Button size="sm" onClick={() => router.push("/referrals")}>
        Jetzt einladen
      </Button>
    </div>
  )
}
