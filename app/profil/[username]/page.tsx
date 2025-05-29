import { useUserProfile } from "@/hooks/use-user-profile"

export default function ProfilPage({ params }: { params: { username: string } }) {
  const { user, loading, error } = useUserProfile(params.username)

  if (loading) {
    return <div>Wird geladen...</div>
  }

  if (error || !user) {
    return <div>Fehler beim Laden des Profils</div>
  }

  return <UserProfile user={user} />
}
