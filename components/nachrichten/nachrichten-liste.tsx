"use client"

import { useState } from "react"
import type { Conversation } from "@/types/message"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "lucide-react"
import { getCurrentUser, getConversationTitle, getConversationAvatar } from "@/lib/mock-messages"
import { cn } from "@/lib/utils"

interface NachrichtenListeProps {
  conversations: Conversation[]
  activeConversationId: string | null
  onSelectConversation: (conversationId: string) => void
  onNewConversation: () => void
}

export function NachrichtenListe({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
}: NachrichtenListeProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const currentUser = getCurrentUser()

  // Sortiere Konversationen nach dem letzten Update (neueste zuerst)
  const sortedConversations = [...conversations].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

  // Filtere Konversationen basierend auf der Suchanfrage
  const filteredConversations = sortedConversations.filter((conv) => {
    const title = getConversationTitle(conv, currentUser).toLowerCase()
    return title.includes(searchQuery.toLowerCase())
  })

  // Formatiere das Datum für die Anzeige
  const formatDate = (date: Date) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date >= today) {
      return date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })
    } else if (date >= yesterday) {
      return "Gestern"
    } else {
      return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })
    }
  }

  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Nachrichten</h2>
          <Button onClick={onNewConversation} size="sm">
            Neu
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Suchen..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => {
              const title = getConversationTitle(conversation, currentUser)
              const avatar = getConversationAvatar(conversation, currentUser)
              const lastMessage = conversation.lastMessage

              return (
                <div
                  key={conversation.id}
                  className={cn(
                    "flex items-center p-3 rounded-lg cursor-pointer hover:bg-accent mb-1",
                    activeConversationId === conversation.id && "bg-accent",
                  )}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <Avatar className="h-12 w-12 mr-3">
                    <AvatarImage src={avatar || "/placeholder.svg"} alt={title} />
                    <AvatarFallback>{title.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium truncate">{title}</h3>
                      {lastMessage && (
                        <span className="text-xs text-muted-foreground">{formatDate(lastMessage.timestamp)}</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      {lastMessage ? (
                        <p className="text-sm text-muted-foreground truncate">
                          {lastMessage.senderId === currentUser ? "Du: " : ""}
                          {lastMessage.content}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">Keine Nachrichten</p>
                      )}
                      {conversation.unreadCount > 0 && (
                        <Badge variant="default" className="ml-2">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="p-4 text-center text-muted-foreground">Keine Konversationen gefunden</div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
