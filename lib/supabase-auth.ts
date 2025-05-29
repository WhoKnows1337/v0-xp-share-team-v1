import { createClient } from "@supabase/supabase-js"
import type { User, Session } from "@supabase/supabase-js"

// Typen für die Authentifizierung
export type AuthUser = User
export type AuthSession = Session

// Typen für die Benutzerprofile
export interface UserProfile {
  id: string
  username: string
  full_name?: string
  avatar_url?: string
  bio?: string
  website?: string
  email: string
  created_at: string
  updated_at: string
  last_seen_at?: string
  experience_points: number
  level: number
  is_premium: boolean
  preferences?: UserPreferences
}

export interface UserPreferences {
  theme: "light" | "dark" | "system"
  email_notifications: boolean
  push_notifications: boolean
  language: string
  privacy_level: "public" | "friends" | "private"
}

// Erstelle einen Supabase-Client für die Authentifizierung
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Singleton-Pattern für den Client
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const getSupabaseAuthClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }
  return supabaseInstance
}

// Authentifizierungsfunktionen
export async function signUp(email: string, password: string, username: string) {
  const supabase = getSupabaseAuthClient()

  // Registriere den Benutzer
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) throw authError

  // Erstelle das Benutzerprofil
  if (authData.user) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      username,
      email,
      full_name: "",
      experience_points: 0,
      level: 1,
      is_premium: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      preferences: {
        theme: "system",
        email_notifications: true,
        push_notifications: true,
        language: "de",
        privacy_level: "public",
      },
    })

    if (profileError) throw profileError
  }

  return authData
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabaseAuthClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const supabase = getSupabaseAuthClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function resetPassword(email: string) {
  const supabase = getSupabaseAuthClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  if (error) throw error
}

export async function updatePassword(password: string) {
  const supabase = getSupabaseAuthClient()
  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) throw error
}

export async function getCurrentUser() {
  const supabase = getSupabaseAuthClient()
  const { data, error } = await supabase.auth.getUser()

  if (error) throw error
  return data.user
}

export async function getCurrentSession() {
  const supabase = getSupabaseAuthClient()
  const { data, error } = await supabase.auth.getSession()

  if (error) throw error
  return data.session
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const supabase = getSupabaseAuthClient()
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) throw error
  return data as UserProfile
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  const supabase = getSupabaseAuthClient()
  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single()

  if (error) throw error
  return data as UserProfile
}

export async function updateUserPreferences(userId: string, preferences: Partial<UserPreferences>) {
  const supabase = getSupabaseAuthClient()

  // Zuerst holen wir das aktuelle Profil
  const { data: currentProfile, error: fetchError } = await supabase
    .from("profiles")
    .select("preferences")
    .eq("id", userId)
    .single()

  if (fetchError) throw fetchError

  // Aktualisiere die Präferenzen
  const updatedPreferences = {
    ...(currentProfile.preferences || {}),
    ...preferences,
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      preferences: updatedPreferences,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single()

  if (error) throw error
  return data as UserProfile
}
