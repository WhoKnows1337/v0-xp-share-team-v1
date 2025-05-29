import { NextResponse, type NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/server/supabase-server"
import { createExperience, getExperiences } from "@/lib/experience-service"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: session } = await supabase.auth.getSession()

    const url = new URL(request.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")
    const userId = url.searchParams.get("userId") || undefined
    const categoryId = url.searchParams.get("categoryId")
      ? Number.parseInt(url.searchParams.get("categoryId") as string)
      : undefined
    const tags = url.searchParams.get("tags") ? url.searchParams.get("tags")?.split(",") : undefined
    const visibility = url.searchParams.get("visibility") || undefined
    const status = url.searchParams.get("status") || "published"
    const searchQuery = url.searchParams.get("q") || undefined
    const orderBy = url.searchParams.get("orderBy") || "created_at"
    const orderDirection = (url.searchParams.get("orderDirection") as "asc" | "desc") || "desc"

    const { experiences, count } = await getExperiences({
      limit,
      offset,
      userId,
      categoryId,
      tags,
      visibility,
      status,
      searchQuery,
      orderBy,
      orderDirection,
    })

    return NextResponse.json({ experiences, count })
  } catch (error) {
    console.error("Fehler beim Abrufen der Erlebnisse:", error)
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
    const experience = await createExperience({
      ...body,
      author_id: session.session.user.id,
    })

    return NextResponse.json({ experience })
  } catch (error) {
    console.error("Fehler beim Erstellen des Erlebnisses:", error)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}
