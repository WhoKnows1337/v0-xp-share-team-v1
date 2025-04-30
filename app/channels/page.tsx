"use client"

import { ThemenChannels } from "@/components/nachrichten/themen-channels"

export default function ChannelsPage() {
  return (
    <div className="container mx-auto p-4 h-[calc(100vh-4rem)]">
      <div className="h-full rounded-lg border overflow-hidden">
        <ThemenChannels />
      </div>
    </div>
  )
}
