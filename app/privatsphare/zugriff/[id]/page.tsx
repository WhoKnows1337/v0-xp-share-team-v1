import { Zugriffskontrolle } from "@/components/privatsphare/zugriffskontrolle"
import { TemporareFreigabe } from "@/components/privatsphare/temporare-freigabe"

interface ZugriffsPageProps {
  params: {
    id: string
  }
}

export default function ZugriffsPage({ params }: ZugriffsPageProps) {
  const { id } = params

  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Zugriffseinstellungen</h1>

      <div className="grid grid-cols-1 gap-8">
        <Zugriffskontrolle contentId={id} contentType="erlebnis" />
        <TemporareFreigabe contentId={id} contentType="erlebnis" />
      </div>
    </div>
  )
}
