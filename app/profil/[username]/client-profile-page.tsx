"use client"

import UserProfileComponent from "@/components/profile/user-profile"
import type { User } from "@/lib/mock-users"

// Extended User type for profile page, including counts
interface ProfileUser extends User {
  experiences_count?: number
  followers_count?: number
  following_count?: number
}

export default function UserProfileClientPage({ initialUser }: { initialUser: ProfileUser }) {
  if (!initialUser) {
    return <div>Benutzerdaten nicht vorhanden.</div>
  }
  return <UserProfileComponent user={initialUser} />
}
