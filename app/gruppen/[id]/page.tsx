import { GruppeDetail } from "@/components/gruppen/gruppe-detail"

export default function GruppeDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8 px-4">
      <GruppeDetail groupId={params.id} />
    </div>
  )
}
