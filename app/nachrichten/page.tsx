// Aktualisiere die Nachrichten-Seite, um die neue Übersichtskomponente zu verwenden
import type { Metadata } from "next"
import { NachrichtenUebersicht } from "@/components/nachrichten/nachrichten-uebersicht"

export const metadata: Metadata = {
  title: "Nachrichten | XP-Share",
  description: "Deine Konversationen und Themen-Channels auf XP-Share",
}

export default function NachrichtenPage() {
  return (
    <div className="container mx-auto py-6 h-[calc(100vh-4rem)]">
      <NachrichtenUebersicht />
    </div>
  )
}
