"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import { ErlebnisWizardModal } from "@/components/erlebnis-wizard-modal"

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  return (
    <>
      {!isHomePage && <Navbar />}
      <main className={!isHomePage ? "pt-16" : ""}>{children}</main>
      <Toaster />
      <ErlebnisWizardModal />
    </>
  )
}
