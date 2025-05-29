"use client"

import { useState } from "react"
import { Leaderboard } from "@/components/xp/leaderboard"
import { mockUsers } from "@/lib/mock-users"
import { getCurrentUser } from "@/lib/mock-users"

// Konvertiere Mock-Benutzer in Leaderboard-Benutzer
const leaderboardUsers = mockUsers.map((user, index) => ({
  id: user.id,
  username: user.username,
  avatarUrl: user.avatar,
  level: user.statistiken?.xpLevel || 1,
  xp: user.statistiken?.xpPunkte || 0,
  rank: index + 1,
  achievements: user.achievements?.filter((a) => a.unlocked).length || 0,
  streak: user.statistiken?.streak || 0,
}))

// Sortiere nach XP
const sortedUsers = [...leaderboardUsers].sort((a, b) => b.xp - a.xp)

// Mock-Daten für den Fortschritt
const progressData = [
  {
    label: "Beiträge",
    current: 12,
    total: 50,
    percentage: (12 / 50) * 100,
  },
  {
    label: "Kommentare",
    current: 35,
    total: 100,
    percentage: (35 / 100) * 100,
  },
  {
    label: "Likes erhalten",
    current: 87,
    total: 200,
    percentage: (87 / 200) * 100,
  },
  {
    label: "Tägliche Logins",
    current: 14,
    total: 30,
    percentage: (14 / 30) * 100,
  },
]

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("leaderboard")
  const currentUser = getCurrentUser()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Bestenliste</h1>
      <Leaderboard
        users={sortedUsers}
        currentUserId={currentUser.id}
        title="Bestenliste"
        description="Entdecke die aktivsten Mitglieder der Community"
      />
    </div>
  )
}
