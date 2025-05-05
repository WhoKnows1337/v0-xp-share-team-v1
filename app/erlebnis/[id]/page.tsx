import { ErlebnisDetail } from "@/components/erlebnis/erlebnis-detail"

export default function ErlebnisPage({ params }: { params: { id: string } }) {
  return <ErlebnisDetail id={params.id} />
}
