import { createServerSupabaseClient } from "@/lib/server/supabase-server"
import type { User } from "@/lib/mock-users" // Ensure this type includes potential count fields
import UserProfileClientPage from "./client-profile-page"
import { notFound } from "next/navigation"
import { config } from "@/lib/config"

// Extended User type for profile page, including counts
interface ProfileUser extends User {
  experiences_count?: number
  followers_count?: number
  following_count?: number
}

async function fetchUserProfileServerSide(username: string): Promise<ProfileUser | null> {
  const supabase = createServerSupabaseClient()

  // The createServerSupabaseClient now handles the mock logic internally.
  // So, we write the query as if it's for a real Supabase instance.
  try {
    // Adjust the table name to 'users' if your public user table is named 'users'
    // and ensure the select query matches your actual/mocked table structure.
    const query = supabase
      .from("users") // Assuming your table is 'users' not 'profiles'
      .select(
        `
        id, username, display_name, avatar_url, bio, email, experience_points, level, is_premium, is_admin, created_at,
        experiences:experiences(count),
        followers:user_follows!following_user_id(count),
        following:user_follows!follower_user_id(count)
      `,
      )
      .eq("username", username)
      .single()

    const { data, error } = await query

    if (error) {
      // Log error only if not using mock data, or if it's an unexpected mock error
      if (!config.useMockData || (config.useMockData && error.message !== "User not found")) {
        // PGRST116 is "User not found"
        console.error(`Error fetching user profile for ${username} on server:`, error.message)
      }
      if (error.code === "PGRST116" || (config.useMockData && error.message === "User not found")) {
        return null // User not found
      }
      if (!config.useMockData) throw error // Re-throw other errors if not using mock
      return null // For other mock errors, return null
    }

    // Transform data to include counts correctly
    if (data) {
      const profileUser: ProfileUser = {
        ...(data as unknown as User), // Cast to User first
        experiences_count: (data.experiences as any)?.[0]?.count ?? data.experiences?.count ?? 0, // Supabase might return count in an array
        followers_count: (data.followers as any)?.[0]?.count ?? data.followers?.count ?? 0,
        following_count: (data.following as any)?.[0]?.count ?? data.following?.count ?? 0,
      }
      return profileUser
    }
    return null
  } catch (err: any) {
    if (!config.useMockData) {
      // Only log catch block errors if not using mock data, as mocks might throw simulated errors
      console.error(`Catch block: Error fetching user profile for ${username} on server:`, err.message)
    }
    return null
  }
}

export default async function ProfilPage({ params }: { params: { username: string } }) {
  const user = await fetchUserProfileServerSide(params.username)

  if (!user) {
    notFound() // Renders the nearest not-found.tsx
  }

  return <UserProfileClientPage initialUser={user} />
}
