"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { User } from "@/lib/mock-users"

interface ProfilTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  isCurrentUser: boolean
  benutzer?: User
}

export function ProfilTabs({ activeTab, setActiveTab, isCurrentUser, benutzer }: ProfilTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-5 gap-2">
        <TabsTrigger value="erlebnisse">Erlebnisse</TabsTrigger>
        <TabsTrigger value="kommentare">Kommentare</TabsTrigger>
        {isCurrentUser && <TabsTrigger value="lesezeichen">Lesezeichen</TabsTrigger>}
        <TabsTrigger value="statistiken">Statistiken</TabsTrigger>
        <TabsTrigger value="achievements">Achievements</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
