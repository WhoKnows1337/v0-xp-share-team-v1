"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, MessageSquare, Bookmark, BarChart2 } from "lucide-react"

interface ProfileTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="experiences" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Erlebnisse</span>
        </TabsTrigger>
        <TabsTrigger value="comments" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Kommentare</span>
        </TabsTrigger>
        <TabsTrigger value="bookmarks" className="flex items-center gap-2">
          <Bookmark className="h-4 w-4" />
          <span className="hidden sm:inline">Lesezeichen</span>
        </TabsTrigger>
        <TabsTrigger value="stats" className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4" />
          <span className="hidden sm:inline">Statistiken</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
