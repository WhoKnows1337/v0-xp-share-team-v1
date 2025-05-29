"use server"

import { getSupabaseAdmin } from "../supabase-client"

// Server-only Supabase Client
export async function createServerSupabaseClient() {
  return getSupabaseAdmin()
}

export async function getServerSession() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    console.error("Fehler beim Abrufen der Server-Session:", error)
    return null
  }

  return session
}

export async function getServerUser() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error("Fehler beim Abrufen des Server-Users:", error)
    return null
  }

  return user
}
