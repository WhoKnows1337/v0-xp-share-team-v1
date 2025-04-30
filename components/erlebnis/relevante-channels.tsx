"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Erlebnis } from "@/types/erlebnis"

interface RelevanteChannelsProps {
  erlebnisId?: string
  tags?: string[]
  kategorie?: string
  erlebnis?: Erlebnis
}

export function RelevanteChannels({ erlebnisId, tags, kategorie, erlebnis }: RelevanteChannelsProps) {
  const router = useRouter()

  // Unterstützt beide Prop-Strukturen für Abwärtskompatibilität
  const relevantTags = tags || erlebnis?.tags || []
  const relevantKategorie = kategorie || erlebnis?.kategorie?.name

  // Simulierte Channels basierend auf Tags und Kategorie
  const channels = [
    ...(relevantKategorie ? [{ id: "cat-1", name: relevantKategorie, members: 128 }] : []),
    ...relevantTags
      .slice(0, 3)
      .map((tag, index) => ({ id: `tag-${index}`, name: tag, members: Math.floor(Math.random() * 100) + 20 })),
  ]

  if (channels.length === 0) {
    return null
  }

  const handleChannelClick = (channelId: string) => {
    router.push(`/channels/${channelId}`)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Relevante Channels</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {channels.map((channel) => (
          <Button
            key={channel.id}
            variant="outline"
            className="w-full justify-between"
            onClick={() => handleChannelClick(channel.id)}
          >
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span>{channel.name}</span>
            </div>
            <Badge variant="secondary" className="ml-2">
              {channel.members}
            </Badge>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
