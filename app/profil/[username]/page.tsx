import { Dashboard } from "@/components/dashboard/dashboard"

export default function ProfilPage({ params }: { params: { username: string } }) {
  const username = decodeURIComponent(params.username)

  // Wir verwenden die Dashboard-Komponente, um die Sidebar konsistent anzuzeigen
  return <Dashboard initialTab="profil" username={username} />
}
