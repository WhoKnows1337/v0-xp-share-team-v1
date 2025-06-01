import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: Request) {
  try {
    // Pfad zur Dokumentationsdatei
    const docsPath = path.join(process.cwd(), "docs", "TECHNICAL_DOCUMENTATION.md")

    // Prüfen, ob die Datei existiert
    if (!fs.existsSync(docsPath)) {
      return NextResponse.json({ error: "Dokumentation nicht gefunden" }, { status: 404 })
    }

    // Datei lesen
    const content = fs.readFileSync(docsPath, "utf-8")

    // Antwort mit Markdown-Inhalt
    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/markdown",
      },
    })
  } catch (error) {
    console.error("Fehler beim Lesen der Dokumentation:", error)
    return NextResponse.json({ error: "Fehler beim Lesen der Dokumentation" }, { status: 500 })
  }
}
