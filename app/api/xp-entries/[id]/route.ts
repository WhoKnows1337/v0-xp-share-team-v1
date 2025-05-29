import { NextResponse, type NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/server/supabase-server"
import { getXPEntryById, updateXPEntry, deleteXPEntry } from "@/lib/xp-entry-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: session } = await supabase.auth.getSession()

    if (!session?.session) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
    }

    const entry = await getXPEntryById(params.id)

    // Prüfe, ob der Benutzer der Autor ist oder der Eintrag öffentlich ist
    if (entry.user_id !== session.session.user.id && (entry.private || entry.draft)) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 })
    }

    return NextResponse.json({ entry })
  } catch (error) {
    console.error("Fehler beim Abrufen des XP-Eintrags:", error)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: session } = await supabase.auth.getSession()

    if (!session?.session) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
    }

    const entry = await getXPEntryById(params.id)

    // Prüfe, ob der Benutzer der Autor ist
    if (entry.user_id !== session.session.user.id) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 })
    }

    const body = await request.json()
    const updatedEntry = await updateXPEntry(params.id, body)

    return NextResponse.json({ entry: updatedEntry })
  } catch (error) {
    console.error("Fehler beim Aktualisieren des XP-Eintrags:", error)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: session } = await supabase.auth.getSession()

    if (!session?.session) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
    }

    const entry = await getXPEntryById(params.id)

    // Prüfe, ob der Benutzer der Autor ist
    if (entry.user_id !== session.session.user.id) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 })
    }

    await deleteXPEntry(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Fehler beim Löschen des XP-Eintrags:", error)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}
