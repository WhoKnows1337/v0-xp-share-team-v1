"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { OnboardingModal } from "@/components/onboarding/onboarding-modal"
import { FeedbackDialog } from "@/components/feedback/feedback-dialog"

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      {children}
      <OnboardingModal />
      <div className="fixed bottom-4 right-4">
        <FeedbackDialog />
      </div>
    </>
  )
}
