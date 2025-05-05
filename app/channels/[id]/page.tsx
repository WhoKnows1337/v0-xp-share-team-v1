import { ChannelDetail } from "@/components/nachrichten/channel-detail"

export default function ChannelDetailPage({ params }: { params: { id: string } }) {
  return <ChannelDetail id={params.id} />
}
