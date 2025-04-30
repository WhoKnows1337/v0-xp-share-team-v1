"use client"

import { useParams } from "next/navigation"
import { ChannelDetail } from "@/components/nachrichten/channel-detail"

export default function ChannelPage() {
  const params = useParams()
  const channelId = params.id as string

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-4rem)]">
      <div className="h-full rounded-lg border overflow-hidden">
        <ChannelDetail channelId={channelId} />
      </div>
    </div>
  )
}
