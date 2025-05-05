"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExperiencesTab } from "./experiences-tab"
import { CommentsTab } from "./comments-tab"
import { BookmarksTab } from "./bookmarks-tab"
import { StatsTab } from "./stats-tab"
import { AchievementsTab } from "./achievements-tab"
import type { User } from "@/lib/mock-users"

interface ProfileTabsProps {
  user: User
  isOwner: boolean
}

export function ProfileTabsExtended({ user, isOwner }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("experiences")

  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-6">
      <TabsList className="grid grid-cols-5 mb-8">
        <TabsTrigger value="experiences">Erlebnisse</TabsTrigger>
        <TabsTrigger value="comments">Kommentare</TabsTrigger>
        <TabsTrigger value="bookmarks">Lesezeichen</TabsTrigger>
        <TabsTrigger value="stats">Statistiken</TabsTrigger>
        <TabsTrigger value="achievements">Achievements</TabsTrigger>
      </TabsList>

      <TabsContent value="experiences">
        <ExperiencesTab user={user} isOwner={isOwner} />
      </TabsContent>

      <TabsContent value="comments">
        <CommentsTab user={user} />
      </TabsContent>

      <TabsContent value="bookmarks">
        <BookmarksTab user={user} isOwner={isOwner} />
      </TabsContent>

      <TabsContent value="stats">
        <StatsTab user={user} />
      </TabsContent>

      <TabsContent value="achievements">
        <AchievementsTab achievements={user.achievements || []} isOwner={isOwner} />
      </TabsContent>
    </Tabs>
  )
}
