import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { useMock } = await request.json()

    // In einer echten Anwendung würde man hier die Umgebungsvariable setzen
    // Da wir in Next.js sind, können wir nur einen Erfolg simulieren

    return NextResponse.json({
      success: true,
      message: `Mock-Daten wurden ${useMock ? "aktiviert" : "deaktiviert"}`,
      useMock,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Fehler beim Umschalten der Mock-Daten" }, { status: 500 })
  }
}
