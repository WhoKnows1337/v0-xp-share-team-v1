import { NextResponse, type NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/server/supabase-server"
import { createXPEntry, getXPEntries } from "@/lib/xp-entry-service"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: session } = await supabase.auth.getSession()

    if (!session?.session) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
    }

    const url = new URL(request.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")
    const userId = url.searchParams.get("userId") || session.session.user.id
    const tags = url.searchParams.get("tags") ? url.searchParams.get("tags")?.split(",") : undefined
    const mood = url.searchParams.get("mood") || undefined
    const isPrivate = url.searchParams.get("private") ? url.searchParams.get("private") === "true" : undefined
    const draft = url.searchParams.get("draft") ? url.searchParams.get("draft") === "true" : undefined
    const searchQuery = url.searchParams.get("q") || undefined
    const orderBy = url.searchParams.get("orderBy") || "date"
    const orderDirection = (url.searchParams.get("orderDirection") as "asc" | "desc") || "desc"

    // Nur eigene Einträge oder öffentliche Einträge anderer Benutzer anzeigen
    const options: any = {
      limit,
      offset,
      tags,
      mood,
      searchQuery,
      orderBy,
      orderDirection,
    }

    if (userId !== session.session.user.id) {
      // Wenn nicht der eigene Benutzer, nur öffentliche Einträge anzeigen
      options.userId = userId
      options.private = false
      options.draft = false
    } else {
      // Eigene Einträge
      options.userId = userId
      if (isPrivate !== undefined) options.private = isPrivate
      if (draft !== undefined) options.draft = draft
    }

    const { entries, count } = await getXPEntries(options)

    return NextResponse.json({ entries, count })
  } catch (error) {
    console.error("Fehler beim Abrufen der XP-Einträge:", error)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: session } = await supabase.auth.getSession()

    if (!session?.session) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
    }

    const body = await request.json()
    const entry = await createXPEntry({
      ...body,
      user_id: session.session.user.id,
    })

    return NextResponse.json({ entry })
  } catch (error) {
    console.error("Fehler beim Erstellen des XP-Eintrags:", error)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}
