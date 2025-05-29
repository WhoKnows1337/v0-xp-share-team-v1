"use server"

import { createServerSupabaseClient } from "@/lib/supabase-client"
import { revalidatePath } from "next/cache"

export async function createXPEntryAction(formData: FormData) {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Nicht authentifiziert")
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const mood = formData.get("mood") as string
  const date = formData.get("date") as string
  const tags = JSON.parse((formData.get("tags") as string) || "[]")
  const isPrivate = formData.get("private") === "true"
  const isDraft = formData.get("draft") === "true"

  const { data, error } = await supabase
    .from("xp_entries")
    .insert({
      title,
      content,
      mood,
      date,
      tags,
      private: isPrivate,
      draft: isDraft,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/xp-buch")
  return data
}

export async function updateXPEntryAction(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Nicht authentifiziert")
  }

  // Prüfe Berechtigung
  const { data: entry } = await supabase.from("xp_entries").select("user_id").eq("id", id).single()

  if (!entry || entry.user_id !== user.id) {
    throw new Error("Nicht berechtigt")
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const mood = formData.get("mood") as string
  const date = formData.get("date") as string
  const tags = JSON.parse((formData.get("tags") as string) || "[]")
  const isPrivate = formData.get("private") === "true"
  const isDraft = formData.get("draft") === "true"

  const { error } = await supabase
    .from("xp_entries")
    .update({
      title,
      content,
      mood,
      date,
      tags,
      private: isPrivate,
      draft: isDraft,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/xp-buch")
}

export async function deleteXPEntryAction(id: string) {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Nicht authentifiziert")
  }

  // Prüfe Berechtigung
  const { data: entry } = await supabase.from("xp_entries").select("user_id").eq("id", id).single()

  if (!entry || entry.user_id !== user.id) {
    throw new Error("Nicht berechtigt")
  }

  const { error } = await supabase.from("xp_entries").delete().eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/xp-buch")
}
