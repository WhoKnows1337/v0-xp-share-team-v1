import { BenutzerProfil } from "@/components/profil/benutzer-profil"

export default function ProfilPage({ params }: { params: { username: string } }) {
  const username = decodeURIComponent(params.username)

  return <BenutzerProfil username={username} />
}
