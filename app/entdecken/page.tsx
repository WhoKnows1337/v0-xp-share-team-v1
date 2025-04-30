import { Dashboard } from "@/components/dashboard/dashboard"

export default function EntdeckenPage() {
  // Wir leiten zur Dashboard-Seite mit dem "entdecken"-Tab weiter
  return <Dashboard initialTab="entdecken" />
}
