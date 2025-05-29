"use client"

import { useState, useEffect } from "react"
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleComplete = () => {
    // Weiterleitung zum Dashboard nach Abschluss
    router.push("/dashboard")
  }

  if (!isMounted) {
    return (
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center py-8">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-muted rounded mb-8"></div>
          <div className="h-96 w-full max-w-3xl bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">XP-Share Onboarding</h1>
      <OnboardingFlow onComplete={handleComplete} />
      <div className="mt-8">
        <Button asChild variant="outline">
          <Link href="/dashboard">Zum Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
