"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Users,
  Bell,
  BellOff,
  Flag,
  LogOut,
  Hash,
  Bookmark,
  Share2,
  Info,
} from "lucide-react"
import { mockChatChannels, mockUsers, getCurrentUser } from "@/lib/mock-messages"
import { toast } from "@/hooks/use-toast"

interface ChannelDetailProps {
  channelId: string
}

export function ChannelDetail({ channelId }: ChannelDetailProps) {
  const [channel, setChannel] = useState(mockChatChannels.find((c) => c.id === channelId))
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isMemberListOpen, setIsMemberListOpen] = useState(false)
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentUser = getCurrentUser()

  // Generiere Mock-Nachrichten beim ersten Laden
  useEffect(() => {
    if (!channel) return

    // Generiere zufällige Nachrichten für den Channel
    const mockMessages = Array.from({ length: 20 }, (_, i) => {
      const randomUserIndex = Math.floor(Math.random() * mockUsers.length)
      const user = mockUsers[randomUserIndex]
      const timestamp = new Date(Date.now() - (20 - i) * 1000 * 60 * 30) // Letzte 10 Stunden
      const isCurrentUser = user.username === currentUser

      return {
        id: `msg-${channelId}-${i}`,
        text: `Das ist eine Beispielnachricht im Channel "${channel.name}" (${i + 1})`,
        timestamp,
        user: {
          username: user.username,
          avatar: user.avatar,
          isVerifiziert: user.isVerifiziert,
        },
        isCurrentUser,
      }
    })

    setMessages(mockMessages)
  }, [channelId, channel, currentUser])

  // Scrolle zum Ende der Nachrichten, wenn neue Nachrichten hinzugefügt werden
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (!channel) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-medium">Channel nicht gefunden</h3>
          <p className="text-muted-foreground">Der angeforderte Channel existiert nicht oder wurde gelöscht.</p>
        </div>
      </div>
    )
  }

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const newMsg = {
      id: `msg-${channelId}-${Date.now()}`,
      text: newMessage,
      timestamp: new Date(),
      user: {
        username: currentUser,
        avatar: mockUsers.find((u) => u.username === currentUser)?.avatar,
        isVerifiziert: mockUsers.find((u) => u.username === currentUser)?.isVerifiziert,
      },
      isCurrentUser: true,
    }

    setMessages([...messages, newMsg])
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatMessageDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Heute"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Gestern"
    } else {
      return date.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    }
  }

  // Gruppiere Nachrichten nach Datum
  const groupMessagesByDate = () => {
    const groups: Record<string, typeof messages> = {}

    messages.forEach((message) => {
      const date = formatMessageDate(new Date(message.timestamp))
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })

    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages,
    }))
  }

  const messageGroups = groupMessagesByDate()

  const toggleNotifications = () => {
    setIsNotificationsEnabled(!isNotificationsEnabled)
    toast({
      title: isNotificationsEnabled ? "Benachrichtigungen deaktiviert" : "Benachrichtigungen aktiviert",
      description: isNotificationsEnabled
        ? `Du erhältst keine Benachrichtigungen mehr für "${channel.name}"`
        : `Du erhältst jetzt Benachrichtigungen für "${channel.name}"`,
    })
  }

  const leaveChannel = () => {
    toast({
      title: "Channel verlassen",
      description: `Du hast den Channel "${channel.name}" verlassen.`,
    })
    // In einer echten App würde hier eine API-Anfrage gesendet werden
    // und dann zur Channel-Übersicht navigiert werden
  }

  const reportChannel = () => {
    toast({
      title: "Channel gemeldet",
      description: "Vielen Dank für deine Meldung. Wir werden den Channel überprüfen.",
    })
  }

  // Mock-Mitglieder für den Channel
  const channelMembers = mockUsers.slice(0, channel.memberCount)

  return (
    <div className="flex flex-col h-full">
      {/* Channel-Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary/10 mr-3">
            {channel.avatar ? (
              <Avatar className="h-10 w-10">
                <AvatarImage src={channel.avatar || "/placeholder.svg"} alt={channel.name} />
                <AvatarFallback>
                  <Hash className="h-5 w-5 text-primary" />
                </AvatarFallback>
              </Avatar>
            ) : (
              <Hash className="h-5 w-5 text-primary" />
            )}
          </div>
          <div>
            <h3 className="font-medium">{channel.name}</h3>
            <div className="flex items-center text-xs text-muted-foreground">
              <Users className="h-3 w-3 mr-1" />
              <span>{channel.memberCount} Mitglieder</span>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setIsMemberListOpen(true)}>
            <Users className="h-5 w-5" />
            <span className="sr-only">Mitglieder</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsInfoOpen(true)}>
            <Info className="h-5 w-5" />
            <span className="sr-only">Info</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">Mehr</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={toggleNotifications}>
                {isNotificationsEnabled ? (
                  <>
                    <BellOff className="h-4 w-4 mr-2" />
                    Benachrichtigungen deaktivieren
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4 mr-2" />
                    Benachrichtigungen aktivieren
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bookmark className="h-4 w-4 mr-2" />
                Als Favorit markieren
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                Channel teilen
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={reportChannel}>
                <Flag className="h-4 w-4 mr-2" />
                Channel melden
              </DropdownMenuItem>
              <DropdownMenuItem onClick={leaveChannel} className="text-red-500">
                <LogOut className="h-4 w-4 mr-2" />
                Channel verlassen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Channel-Nachrichten */}
      <ScrollArea className="flex-1 p-4">
        {messageGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">{group.date}</div>
            </div>
            {group.messages.map((message, index) => (
              <div key={message.id} className={`flex mb-4 ${message.isCurrentUser ? "justify-end" : "justify-start"}`}>
                {!message.isCurrentUser && (
                  <Avatar className="h-8 w-8 mr-2 mt-1">
                    <AvatarImage src={message.user.avatar || "/placeholder.svg"} alt={message.user.username} />
                    <AvatarFallback>{message.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {!message.isCurrentUser && (
                    <p className="text-xs font-medium mb-1 flex items-center">
                      {message.user.username}
                      {message.user.isVerifiziert && (
                        <svg
                          className="h-3 w-3 ml-1 text-blue-500 fill-blue-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                      )}
                    </p>
                  )}
                  <p>{message.text}</p>
                  <p className="text-xs mt-1 text-right opacity-70">{formatMessageTime(new Date(message.timestamp))}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Nachrichteneingabe */}
      <div className="p-4 border-t">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-1">
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Anhang</span>
          </Button>
          <Button variant="ghost" size="icon" className="mr-2">
            <Smile className="h-5 w-5" />
            <span className="sr-only">Emoji</span>
          </Button>
          <Input
            placeholder={`Nachricht an #${channel.name}`}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            onClick={handleSendMessage}
            disabled={newMessage.trim() === ""}
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Senden</span>
          </Button>
        </div>
      </div>

      {/* Mitgliederliste Dialog */}
      <Dialog open={isMemberListOpen} onOpenChange={setIsMemberListOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mitglieder von #{channel.name}</DialogTitle>
            <DialogDescription>{channel.memberCount} Mitglieder in diesem Channel</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px] mt-4">
            {channelMembers.map((member) => (
              <div key={member.username} className="flex items-center p-2 hover:bg-accent rounded-md">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.username} />
                  <AvatarFallback>{member.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="font-medium">{member.username}</p>
                    {member.isVerifiziert && (
                      <svg
                        className="h-3 w-3 ml-1 text-blue-500 fill-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    )}
                  </div>
                  {member.username === "TraumReisender" && (
                    <Badge variant="outline" className="text-xs">
                      Moderator
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Channel-Info Dialog */}
      <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Über #{channel.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <h4 className="text-sm font-semibold">Beschreibung</h4>
              <p className="text-sm text-muted-foreground">{channel.description}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Kategorie</h4>
              <p className="text-sm text-muted-foreground">{channel.category}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Erstellt am</h4>
              <p className="text-sm text-muted-foreground">
                {channel.createdAt.toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Mitglieder</h4>
              <p className="text-sm text-muted-foreground">{channel.memberCount} Mitglieder</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Sichtbarkeit</h4>
              <p className="text-sm text-muted-foreground">{channel.isPublic ? "Öffentlich" : "Privat"}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInfoOpen(false)}>
              Schließen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
