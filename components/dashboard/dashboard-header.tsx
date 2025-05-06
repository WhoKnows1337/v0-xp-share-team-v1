"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, Bell, Plus } from "lucide-react"
import { useState } from "react"
import { DashboardSidebar } from "./dashboard-sidebar"
import { useRouter } from "next/navigation"
import { ErlebnisWizardModal } from "../erlebnis-wizard-modal"
import { ReferralButton } from "@/components/referral/referral-button"

interface DashboardHeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function DashboardHeader({ activeTab, onTabChange }: DashboardHeaderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const router = useRouter()

  return (
    <header className="hidden">
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Navigation öffnen</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[280px] pr-0">
          <DashboardSidebar
            activeTab={activeTab}
            onTabChange={(tab) => {
              onTabChange(tab)
              setIsSidebarOpen(false)
            }}
          />
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-2 md:ml-auto md:gap-4">
        <form className="hidden md:flex-1 md:flex max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Suchen..."
              className="w-full bg-background pl-8 h-9 rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </form>

        <ReferralButton variant="outline" size="sm" className="hidden md:flex" />

        <Button variant="outline" size="icon" onClick={() => router.push("/nachrichten")}>
          <Bell className="h-5 w-5" />
          <span className="sr-only">Benachrichtigungen</span>
        </Button>

        <Button onClick={() => setIsWizardOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Neues Erlebnis
        </Button>
      </div>

      <ErlebnisWizardModal open={isWizardOpen} onOpenChange={setIsWizardOpen} />
    </header>
  )
}
