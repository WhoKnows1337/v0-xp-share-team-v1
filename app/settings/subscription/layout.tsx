"use client"

import type React from "react"

import { SubscriptionProvider } from "@/contexts/subscription-context"

export default function SubscriptionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SubscriptionProvider>{children}</SubscriptionProvider>
}
