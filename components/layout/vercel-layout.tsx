"use client"

import type React from "react"

import { VercelNavbar } from "./vercel-navbar"
import { VercelSidebar } from "./vercel-sidebar"
import { cn } from "@/lib/utils"

interface VercelLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
  className?: string
}

export function VercelLayout({ children, showSidebar = true, className }: VercelLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <VercelNavbar />
      <div className="flex">
        {showSidebar && <VercelSidebar />}
        <main className={cn("flex-1 pt-16", showSidebar ? "pl-64" : "", className)}>
          <div className="container mx-auto px-4 py-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
