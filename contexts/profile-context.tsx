"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { User } from "@/lib/mock-users"

interface ProfileContextType {
  activeProfile: User | null
  setActiveProfile: (profile: User | null) => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [activeProfile, setActiveProfile] = useState<User | null>(null)

  return <ProfileContext.Provider value={{ activeProfile, setActiveProfile }}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider")
  }
  return context
}

// Hilfsfunktion, um zu prüfen, ob der ProfileContext verfügbar ist
export function useOptionalProfile() {
  const context = useContext(ProfileContext)
  return { context, isAvailable: context !== undefined }
}
