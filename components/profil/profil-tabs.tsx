"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProfilTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  isCurrentUser: boolean
}

export function ProfilTabs({ activeTab, setActiveTab, isCurrentUser }: ProfilTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-4 gap-2">
        <TabsTrigger value="erlebnisse">Erlebnisse</TabsTrigger>
        <TabsTrigger value="kommentare">Kommentare</TabsTrigger>
        {isCurrentUser && <TabsTrigger value="lesezeichen">Lesezeichen</TabsTrigger>}
        <TabsTrigger value="statistiken">Statistiken</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
