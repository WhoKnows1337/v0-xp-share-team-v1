import { ErlebnisDetail } from "@/components/erlebnis/erlebnis-detail"
import { useExperience } from "@/hooks/use-experiences"

export default function ErlebnisDetailPage({ params }: { params: { id: string } }) {
  const { experience, loading, error } = useExperience(params.id)

  if (loading) {
    return <div>Wird geladen...</div>
  }

  if (error || !experience) {
    return <div>Fehler beim Laden des Erlebnisses</div>
  }

  return <ErlebnisDetail id={params.id} erlebnis={experience} />
}
