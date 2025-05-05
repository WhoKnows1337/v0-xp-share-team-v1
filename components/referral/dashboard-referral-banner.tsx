"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PartyPopper, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUserReferralStats } from "@/lib/mock-referrals"

export function DashboardReferralBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  const stats = getUserReferralStats()

  // Zeige das Banner nur an, wenn der Benutzer weniger als 3 erfolgreiche Referrals hat
  const shouldShow = stats.accepted < 3

  useEffect(() => {
    // Zeige das Banner erst nach einem kurzen Delay an
    if (shouldShow) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [shouldShow])

  if (!isVisible || !shouldShow) return null

  return (
    <Card className="relative overflow-hidden mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
      <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => setIsVisible(false)}>
        <X className="h-4 w-4" />
        <span className="sr-only">Schließen</span>
      </Button>

      <div className="p-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
            <PartyPopper className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Verdiene 100 Mana pro Freund</h3>
            <p className="text-sm text-muted-foreground">Lade Freunde ein und erhaltet beide Belohnungen!</p>
          </div>
        </div>
        <Button
          onClick={() => router.push("/referrals")}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
        >
          Freunde einladen
        </Button>
      </div>
    </Card>
  )
}
