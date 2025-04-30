"use client"

import { useState } from "react"
import { ProfileHeader } from "./profile-header"
import { ProfileTabs } from "./profile-tabs"
import { ExperiencesTab } from "./experiences-tab"
import { CommentsTab } from "./comments-tab"
import { BookmarksTab } from "./bookmarks-tab"
import { StatsTab } from "./stats-tab"
import { getCurrentUser } from "@/lib/user-utils"

interface UserProfileProps {
  user: any // Verwende any, um Typprobleme zu vermeiden
}

export function UserProfile({ user }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState("experiences")

  // Prüfen, ob der aktuelle Benutzer der Profilbesitzer ist
  const currentUser = getCurrentUser()
  const isOwner = currentUser.username === user.username

  return (
    <div className="container py-8">
      <ProfileHeader user={user} isOwner={isOwner} />

      <div className="mt-8">
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-6">
          {activeTab === "experiences" && <ExperiencesTab user={user} isOwner={isOwner} />}
          {activeTab === "comments" && <CommentsTab user={user} />}
          {activeTab === "bookmarks" && <BookmarksTab user={user} />}
          {activeTab === "stats" && <StatsTab user={user} />}
        </div>
      </div>
    </div>
  )
}
