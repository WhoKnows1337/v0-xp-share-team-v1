"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  getCurrentUser,
  getTotalUnreadMessages,
  getUserConversations,
  getConversationTitle,
  getConversationAvatar,
} from "@/lib/mock-messages"
import { useRouter } from "next/navigation"

export function Benachrichtigungen() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [activeTab, setActiveTab] = useState("nachrichten")
  const router = useRouter()
  const currentUser = getCurrentUser()
  const conversations = getUserConversations(currentUser)

  // Filtere Konversationen mit ungelesenen Nachrichten
  const unreadConversations = conversations.filter((conv) => conv.unreadCount > 0)

  // Mock-Benachrichtigungen für Channels
  const channelNotifications = [
    {
      id: "channel-notif-1",
      channelId: "channel_1",
      channelName: "Traumdeutung & Luzides Träumen",
      avatar: "/serene-meditation.png",
      message: "Neuer Beitrag: 'Meine Erfahrung mit luziden Träumen'",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isRead: false,
    },
    {
      id: "channel-notif-2",
      channelId: "channel_2",
      channelName: "Wandern & Outdoor-Abenteuer",
      avatar: "/black-forest-valley.png",
      message: "TraumReisender hat ein neues Foto geteilt",
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      isRead: false,
    },
    {
      id: "channel-notif-3",
      channelId: "channel_3",
      channelName: "Kunst & Kultur",
      avatar: "/Elbphilharmonie-modern-maritime.png",
      message: "Neue Umfrage: 'Welches Museum sollten wir als nächstes besuchen?'",
      timestamp: new Date(Date.now() - 1000 * 60 * 240),
      isRead: true,
    },
  ]

  // Allgemeine Benachrichtigungen
  const generalNotifications = [
    {
      id: "general-notif-1",
      type: "like",
      avatar: "/serene-gaze.png",
      message: "SeelenWanderer hat dein Erlebnis 'Meditation im Schwarzwald' geliked",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      isRead: false,
      link: "/erlebnis/1",
    },
    {
      id: "general-notif-2",
      type: "comment",
      avatar: "/thoughtful-gaze.png",
      message: "PhilosophischerWanderer hat dein Erlebnis 'Synchronizität im Alltag' kommentiert",
      timestamp: new Date(Date.now() - 1000 * 60 * 180),
      isRead: false,
      link: "/erlebnis/2",
    },
    {
      id: "general-notif-3",
      type: "follow",
      avatar: "/confident-leader.png",
      message: "KunstLiebhaber folgt dir jetzt",
      timestamp: new Date(Date.now() - 1000 * 60 * 300),
      isRead: true,
      link: "/profil/KunstLiebhaber",
    },
  ]

  // Zähle ungelesene Benachrichtigungen
  const unreadChannelNotifications = channelNotifications.filter((notif) => !notif.isRead).length
  const unreadGeneralNotifications = generalNotifications.filter((notif) => !notif.isRead).length
  const totalUnreadNotifications = unreadCount + unreadChannelNotifications + unreadGeneralNotifications

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

  const handleOpenChannel = (channelId: string) => {
    router.push(`/channels/${channelId}`)
  }

  const handleOpenNotification = (link: string) => {
    router.push(link)
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / 60000)
    const diffHours = Math.round(diffMs / 3600000)
    const diffDays = Math.round(diffMs / 86400000)

    if (diffMins < 60) {
      return `vor ${diffMins} ${diffMins === 1 ? "Minute" : "Minuten"}`
    } else if (diffHours < 24) {
      return `vor ${diffHours} ${diffHours === 1 ? "Stunde" : "Stunden"}`
    } else {
      return `vor ${diffDays} ${diffDays === 1 ? "Tag" : "Tagen"}`
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {totalUnreadNotifications > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {totalUnreadNotifications > 9 ? "9+" : totalUnreadNotifications}
            </Badge>
          )}
          <span className="sr-only">Benachrichtigungen</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Benachrichtigungen</DropdownMenuLabel>
        <Tabs defaultValue="nachrichten" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="nachrichten" className="relative">
              Nachrichten
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="channels" className="relative">
              Channels
              {unreadChannelNotifications > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
                >
                  {unreadChannelNotifications > 9 ? "9+" : unreadChannelNotifications}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="allgemein" className="relative">
              Allgemein
              {unreadGeneralNotifications > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
                >
                  {unreadGeneralNotifications > 9 ? "9+" : unreadGeneralNotifications}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="nachrichten">
            <ScrollArea className="h-[300px]">
              {unreadConversations.length > 0 ? (
                <>
                  {unreadConversations.slice(0, 5).map((conversation) => {
                    const title = getConversationTitle(conversation, currentUser)
                    const avatar = getConversationAvatar(conversation, currentUser)

                    return (
                      <DropdownMenuItem
                        key={conversation.id}
                        className="flex items-center p-3 cursor-pointer"
                        onClick={() => handleOpenConversation(conversation.id)}
                      >
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={avatar || "/placeholder.svg"} alt={title} />
                          <AvatarFallback>{title.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <p className="font-medium truncate">{title}</p>
                            <Badge variant="default" className="ml-2">
                              {conversation.unreadCount}
                            </Badge>
                          </div>
                          {conversation.lastMessage && (
                            <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage.content}</p>
                          )}
                        </div>
                      </DropdownMenuItem>
                    )
                  })}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex justify-center text-center cursor-pointer"
                    onClick={() => router.push("/nachrichten")}
                  >
                    Alle Nachrichten anzeigen
                  </DropdownMenuItem>
                </>
              ) : (
                <div className="p-4 text-center text-muted-foreground">Keine ungelesenen Nachrichten</div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="channels">
            <ScrollArea className="h-[300px]">
              {channelNotifications.length > 0 ? (
                <>
                  {channelNotifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`flex items-center p-3 cursor-pointer ${!notification.isRead ? "bg-accent/50" : ""}`}
                      onClick={() => handleOpenChannel(notification.channelId)}
                    >
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={notification.avatar || "/placeholder.svg"} alt={notification.channelName} />
                        <AvatarFallback>{notification.channelName.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-medium truncate">{notification.channelName}</p>
                          <p className="text-xs text-muted-foreground">{formatTime(notification.timestamp)}</p>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{notification.message}</p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex justify-center text-center cursor-pointer"
                    onClick={() => router.push("/channels")}
                  >
                    Alle Channels anzeigen
                  </DropdownMenuItem>
                </>
              ) : (
                <div className="p-4 text-center text-muted-foreground">Keine Channel-Benachrichtigungen</div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="allgemein">
            <ScrollArea className="h-[300px]">
              {generalNotifications.length > 0 ? (
                <>
                  {generalNotifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`flex items-center p-3 cursor-pointer ${!notification.isRead ? "bg-accent/50" : ""}`}
                      onClick={() => handleOpenNotification(notification.link)}
                    >
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={notification.avatar || "/placeholder.svg"} alt="Benutzer" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-medium truncate">
                            {notification.type === "like"
                              ? "Like"
                              : notification.type === "comment"
                                ? "Kommentar"
                                : "Neuer Follower"}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatTime(notification.timestamp)}</p>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{notification.message}</p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex justify-center text-center cursor-pointer"
                    onClick={() => router.push("/benachrichtigungen")}
                  >
                    Alle Benachrichtigungen anzeigen
                  </DropdownMenuItem>
                </>
              ) : (
                <div className="p-4 text-center text-muted-foreground">Keine Benachrichtigungen</div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
