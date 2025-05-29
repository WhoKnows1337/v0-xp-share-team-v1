import { getSupabaseClient } from "./supabase-client"
import type { Database } from "@/types/supabase-types"

export type XPEntry = Database["public"]["Tables"]["xp_entries"]["Row"]
export type NewXPEntry = Database["public"]["Tables"]["xp_entries"]["Insert"]
export type XPEntryUpdate = Database["public"]["Tables"]["xp_entries"]["Update"]

export interface XPEntryWithUser extends XPEntry {
  user: {
    username: string
    display_name: string | null
    avatar_url: string | null
  }
}

export interface XPEntryMedia {
  id: string
  xp_entry_id: string
  type: "image" | "video" | "audio"
  url: string
  created_at: string
}

export async function getXPEntries(
  options: {
    limit?: number
    offset?: number
    userId?: string
    tags?: string[]
    mood?: string
    private?: boolean
    draft?: boolean
    searchQuery?: string
    orderBy?: string
    orderDirection?: "asc" | "desc"
  } = {},
) {
  const {
    limit = 10,
    offset = 0,
    userId,
    tags,
    mood,
    private: isPrivate,
    draft,
    searchQuery,
    orderBy = "date",
    orderDirection = "desc",
  } = options

  const supabase = getSupabaseClient()

  let query = supabase
    .from("xp_entries")
    .select(
      `
      *,
      user:users(username, display_name, avatar_url)
    `,
    )
    .order(orderBy, { ascending: orderDirection === "asc" })
    .range(offset, offset + limit - 1)

  if (userId) {
    query = query.eq("user_id", userId)
  }

  if (tags && tags.length > 0) {
    query = query.contains("tags", tags)
  }

  if (mood) {
    query = query.eq("mood", mood)
  }

  if (isPrivate !== undefined) {
    query = query.eq("private", isPrivate)
  }

  if (draft !== undefined) {
    query = query.eq("draft", draft)
  }

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%, content.ilike.%${searchQuery}%`)
  }

  const { data, error, count } = await query

  if (error) throw error

  return {
    entries: data as XPEntryWithUser[],
    count,
  }
}

export async function getXPEntryById(id: string): Promise<XPEntryWithUser> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from("xp_entries")
    .select(
      `
      *,
      user:users(username, display_name, avatar_url)
    `,
    )
    .eq("id", id)
    .single()

  if (error) throw error
  return data as XPEntryWithUser
}

export async function createXPEntry(entry: NewXPEntry): Promise<XPEntry> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from("xp_entries")
    .insert({
      ...entry,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateXPEntry(id: string, updates: XPEntryUpdate): Promise<XPEntry> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from("xp_entries")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteXPEntry(id: string): Promise<void> {
  const supabase = getSupabaseClient()

  const { error } = await supabase.from("xp_entries").delete().eq("id", id)

  if (error) throw error
}

export async function getXPEntryMedia(entryId: string): Promise<XPEntryMedia[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from("xp_entry_media")
    .select("*")
    .eq("xp_entry_id", entryId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function addXPEntryMedia(
  entryId: string,
  type: "image" | "video" | "audio",
  url: string,
): Promise<XPEntryMedia> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from("xp_entry_media")
    .insert({
      xp_entry_id: entryId,
      type,
      url,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteXPEntryMedia(id: string): Promise<void> {
  const supabase = getSupabaseClient()

  const { error } = await supabase.from("xp_entry_media").delete().eq("id", id)

  if (error) throw error
}

export async function getXPEntryStatistics(userId: string) {
  const supabase = getSupabaseClient()

  // Gesamtzahl der Einträge
  const { count: totalEntries, error: countError } = await supabase
    .from("xp_entries")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  if (countError) throw countError

  // Einträge pro Monat (letztes Jahr)
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

  const { data: monthlyData, error: monthlyError } = await supabase
    .from("xp_entries")
    .select("date")
    .eq("user_id", userId)
    .gte("date", oneYearAgo.toISOString())
    .order("date", { ascending: true })

  if (monthlyError) throw monthlyError

  // Gruppiere nach Monat
  const monthlyEntries: Record<string, number> = {}
  monthlyData?.forEach((entry) => {
    const month = entry.date.substring(0, 7) // YYYY-MM Format
    monthlyEntries[month] = (monthlyEntries[month] || 0) + 1
  })

  // Stimmungsverteilung
  const { data: moodData, error: moodError } = await supabase
    .from("xp_entries")
    .select("mood")
    .eq("user_id", userId)
    .not("mood", "is", null)

  if (moodError) throw moodError

  const moodDistribution: Record<string, number> = {}
  moodData?.forEach((entry) => {
    if (entry.mood) {
      moodDistribution[entry.mood] = (moodDistribution[entry.mood] || 0) + 1
    }
  })

  // Häufige Tags
  const { data: tagData, error: tagError } = await supabase
    .from("xp_entries")
    .select("tags")
    .eq("user_id", userId)
    .not("tags", "is", null)

  if (tagError) throw tagError

  const tagCounts: Record<string, number> = {}
  tagData?.forEach((entry) => {
    if (entry.tags) {
      entry.tags.forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    }
  })

  // Sortiere Tags nach Häufigkeit
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }))

  return {
    totalEntries,
    monthlyEntries,
    moodDistribution,
    topTags,
  }
}

// Service-Instanz für externe Verwendung
export const xpEntryService = {
  getXPEntries,
  getXPEntryById,
  createXPEntry,
  updateXPEntry,
  deleteXPEntry,
  getXPEntryMedia,
  addXPEntryMedia,
  deleteXPEntryMedia,
  getXPEntryStatistics,
}
