import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { BenutzerProfil } from "@/components/profil/benutzer-profil"

export default function ProfilPage({ params }: { params: { username: string } }) {
  const username = decodeURIComponent(params.username)

  return (
    <DashboardLayout activeTab="profil">
      <BenutzerProfil username={username} />
    </DashboardLayout>
  )
}
