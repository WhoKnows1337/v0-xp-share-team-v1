"use server"

import { createServerSupabaseClient } from "@/lib/supabase-client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createExperienceAction(formData: FormData) {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Nicht authentifiziert")
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const content = formData.get("content") as string
  const category = formData.get("category") as string
  const location = formData.get("location") as string
  const date = formData.get("date") as string
  const tags = JSON.parse((formData.get("tags") as string) || "[]")
  const emotions = JSON.parse((formData.get("emotions") as string) || "[]")
  const privacy_level = formData.get("privacy_level") as string

  const { data, error } = await supabase
    .from("experiences")
    .insert({
      title,
      description,
      content,
      author_id: user.id,
      category,
      location,
      date,
      tags,
      emotions,
      privacy_level,
      is_public: privacy_level === "public",
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard")
  revalidatePath("/entdecken")
  redirect(`/erlebnis/${data.id}`)
}

export async function updateExperienceAction(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Nicht authentifiziert")
  }

  // Prüfe Berechtigung
  const { data: experience } = await supabase.from("experiences").select("author_id").eq("id", id).single()

  if (!experience || experience.author_id !== user.id) {
    throw new Error("Nicht berechtigt")
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const content = formData.get("content") as string
  const category = formData.get("category") as string
  const location = formData.get("location") as string
  const date = formData.get("date") as string
  const tags = JSON.parse((formData.get("tags") as string) || "[]")
  const emotions = JSON.parse((formData.get("emotions") as string) || "[]")
  const privacy_level = formData.get("privacy_level") as string

  const { error } = await supabase
    .from("experiences")
    .update({
      title,
      description,
      content,
      category,
      location,
      date,
      tags,
      emotions,
      privacy_level,
      is_public: privacy_level === "public",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard")
  revalidatePath("/entdecken")
  revalidatePath(`/erlebnis/${id}`)
}

export async function deleteExperienceAction(id: string) {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Nicht authentifiziert")
  }

  // Prüfe Berechtigung
  const { data: experience } = await supabase.from("experiences").select("author_id").eq("id", id).single()

  if (!experience || experience.author_id !== user.id) {
    throw new Error("Nicht berechtigt")
  }

  const { error } = await supabase.from("experiences").delete().eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard")
  revalidatePath("/entdecken")
  redirect("/dashboard")
}
