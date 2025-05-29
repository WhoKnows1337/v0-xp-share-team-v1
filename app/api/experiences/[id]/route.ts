import { NextResponse, type NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/server/supabase-server"
import { getExperienceById, updateExperience, deleteExperience } from "@/lib/experience-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const experience = await getExperienceById(params.id)
    return NextResponse.json({ experience })
  } catch (error) {
    console.error("Fehler beim Abrufen des Erlebnisses:", error)
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

    const experience = await getExperienceById(params.id)

    // Prüfe, ob der Benutzer der Autor ist
    if (experience.author_id !== session.session.user.id) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 })
    }

    const body = await request.json()
    const updatedExperience = await updateExperience(params.id, body)

    return NextResponse.json({ experience: updatedExperience })
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Erlebnisses:", error)
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

    const experience = await getExperienceById(params.id)

    // Prüfe, ob der Benutzer der Autor ist
    if (experience.author_id !== session.session.user.id) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 })
    }

    await deleteExperience(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Fehler beim Löschen des Erlebnisses:", error)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}
