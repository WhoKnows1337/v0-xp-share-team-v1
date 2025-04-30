"use client"

import { useEffect, useState } from "react"
import { MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  getCurrentUser,
  getTotalUnreadMessages,
  getUserConversations,
  getConversationTitle,
  getConversationAvatar,
} from "@/lib/mock-messages"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { de } from "date-fns/locale"

export function NachrichtenButton() {
  const [unreadCount, setUnreadCount] = useState(0)
  const router = useRouter()
  const currentUser = getCurrentUser()
  const conversations = getUserConversations(currentUser)

  // Sortiere Konversationen nach dem letzten Update (neueste zuerst)
  const sortedConversations = [...conversations].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

  // Nehme die 5 neuesten Konversationen
  const recentConversations = sortedConversations.slice(0, 5)

  useEffect(() => {
    // Aktualisiere den Zähler für ungelesene Nachrichten
    const count = getTotalUnreadMessages(currentUser)
    setUnreadCount(count)

    // In einer echten Anwendung würde hier ein Echtzeit-Update über WebSockets erfolgen
    const interval = setInterval(() => {
      const newCount = getTotalUnreadMessages(currentUser)
      setUnreadCount(newCount)
    }, 30000) // Alle 30 Sekunden aktualisieren

    return () => clearInterval(interval)
  }, [currentUser])

  const handleOpenConversation = (conversationId: string) => {
    router.push(`/nachrichten?id=${conversationId}`)
  }

  const handleOpenAllMessages = () => {
    router.push("/nachrichten")
  }

  // Formatiere die Zeit relativ zum aktuellen Zeitpunkt
  const formatMessageTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: de })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Nachrichten">
          <MessageSquare className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Nachrichten</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Private Nachrichten</span>
          {unreadCount > 0 && (
            <Badge variant="outline" className="ml-2">
              {unreadCount} ungelesen
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {recentConversations.length > 0 ? (
          <>
            {recentConversations.map((conversation) => {
              const title = getConversationTitle(conversation, currentUser)
              const avatar = getConversationAvatar(conversation, currentUser)
              const hasUnread = conversation.unreadCount > 0

              return (
                <DropdownMenuItem
                  key={conversation.id}
                  className="flex items-center p-3 cursor-pointer"
                  onClick={() => handleOpenConversation(conversation.id)}
                >
                  <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                    <AvatarImage src={avatar || "/placeholder.svg"} alt={title} />
                    <AvatarFallback>{title.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className={`font-medium truncate ${hasUnread ? "font-semibold" : ""}`}>{title}</p>
                      {hasUnread && (
                        <Badge variant="default" className="ml-2 flex-shrink-0">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      {conversation.lastMessage && (
                        <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                          {conversation.lastMessage.senderId === currentUser ? "Du: " : ""}
                          {conversation.lastMessage.content}
                        </p>
                      )}
                      {conversation.lastMessage && (
                        <span className="text-xs text-muted-foreground ml-1 flex-shrink-0">
                          {formatMessageTime(conversation.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex justify-center text-center cursor-pointer"
              onClick={handleOpenAllMessages}
            >
              Alle Nachrichten anzeigen
            </DropdownMenuItem>
          </>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-20" />
            <p>Keine Nachrichten vorhanden</p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
