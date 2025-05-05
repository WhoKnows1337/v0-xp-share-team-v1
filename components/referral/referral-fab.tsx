"use client"

import { Button } from "@/components/ui/button"
import { PartyPopper } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export function ReferralFAB() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  // Zeige den FAB erst nach einem kurzen Delay an
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <Button
      onClick={() => router.push("/referrals")}
      className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 md:hidden"
      size="icon"
    >
      <PartyPopper className="h-6 w-6" />
      <span className="sr-only">Freunde einladen</span>
    </Button>
  )
}
