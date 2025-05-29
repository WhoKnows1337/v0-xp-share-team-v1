import { getSupabaseClient } from "./supabase-client"
import type { User as AuthUser, Session as AuthSession, SignUpWithPasswordCredentials } from "@supabase/supabase-js"
import { config } from "./config"
import { getMockUserById, addMockUser, updateMockUser } from "./mock-users" // Assuming mock user utilities

// This should match the structure of your 'users' table in Supabase / mock data
export interface UserProfile {
  id: string
  username: string
  display_name?: string
  avatar_url?: string
  bio?: string
  email?: string // Usually from auth.users, but can be on profile
  experience_points?: number
  level?: number
  is_premium?: boolean
  is_admin?: boolean
  created_at?: string
  updated_at?: string
  preferences?: any // Define more strictly if possible
  // Add other fields from your 'users' table
}

export async function getCurrentSession(): Promise<AuthSession | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    console.error("Error getting session:", error.message)
    if (!config.useMockData) throw error
    return null
  }
  return data.session
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    console.error("Error getting user:", error.message)
    if (!config.useMockData) throw error
    return null
  }
  return data.user
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = getSupabaseClient()
  // In Supabase, profiles are often in a separate 'profiles' or 'users' table.
  // We've been using 'users' as the public table name.
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching user profile:", error.message)
    // For mock data, if user not found, it's a valid scenario, not an error to throw
    if (
      !config.useMockData ||
      (config.useMockData &&
        error.code !== "PGRST116" &&
        error.message !== "User not found" &&
        error.message !== "Mock user not found")
    ) {
      // PGRST116 is "No rows found"
      // "User not found" is a custom mock error
      if (!config.useMockData) throw error
    }
    return null
  }
  return data as UserProfile
}

export async function signUpUser(
  email: string,
  password: string,
  username: string,
): Promise<{ user: AuthUser | null; session: AuthSession | null; error?: any }> {
  const supabase = getSupabaseClient()

  const credentials: SignUpWithPasswordCredentials = { email, password, options: { data: { username } } }
  const { data, error } = await supabase.auth.signUp(credentials)

  if (error) {
    console.error("Error signing up:", error.message)
    if (!config.useMockData) throw error
    return { user: null, session: null, error }
  }

  // For mock data, we might need to manually create the profile entry
  if (config.useMockData && data.user) {
    const existingProfile = getMockUserById(data.user.id)
    if (!existingProfile) {
      const newUserProfile: UserProfile = {
        id: data.user.id,
        email: data.user.email!,
        username: username,
        display_name: username,
        avatar_url: `/placeholder.svg?width=96&height=96&text=${username.substring(0, 2).toUpperCase()}`,
        experience_points: 0,
        level: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      addMockUser(newUserProfile) // Add to our mock user list
    }
  }
  // In real Supabase, a trigger (handle_new_user) would create the public.users entry.

  return { user: data.user, session: data.session, error: null }
}

export async function signInWithEmailPassword(
  email: string,
  password: string,
): Promise<{ user: AuthUser | null; session: AuthSession | null; error?: any }> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    console.error("Error signing in:", error.message)
    if (!config.useMockData) throw error
    return { user: null, session: null, error }
  }
  return { user: data.user, session: data.session, error: null }
}

export async function signOutUser(): Promise<{ error?: any }> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error("Error signing out:", error.message)
    if (!config.useMockData) throw error
    return { error }
  }
  return { error: null }
}

export async function updateUserProfileDetails(
  userId: string,
  updates: Partial<UserProfile>,
): Promise<UserProfile | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()

  if (error) {
    console.error("Error updating user profile:", error.message)
    if (!config.useMockData) throw error
    return null
  }

  if (config.useMockData && data) {
    updateMockUser(data as UserProfile) // Update in our mock user list
  }
  return data as UserProfile
}

export async function updateUserPreferencesDetails(userId: string, preferences: any): Promise<UserProfile | null> {
  // This assumes 'preferences' is a JSONB column on the 'users' table
  // Or handle as a separate table if needed
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("users")
    .update({ preferences } as any) // Cast to any if preferences is not directly on UserProfile type for Supabase client
    .eq("id", userId)
    .select()
    .single()

  if (error) {
    console.error("Error updating user preferences:", error.message)
    if (!config.useMockData) throw error
    return null
  }

  if (config.useMockData && data) {
    updateMockUser(data as UserProfile) // Update in our mock user list
  }
  return data as UserProfile
}

export async function updateUserPassword(newPassword: string): Promise<{ error?: any }> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) {
    console.error("Error updating password:", error.message)
    if (!config.useMockData) throw error
    return { error }
  }
  return { error: null }
}
