import { Startseite } from "@/components/startseite/startseite"
import { initMockData } from "@/lib/mock-init"

// Initialisiere Mock-Daten beim ersten Laden
initMockData()

export default function Home() {
  return <Startseite />
}
