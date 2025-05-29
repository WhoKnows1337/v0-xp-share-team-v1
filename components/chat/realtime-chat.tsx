"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRealtimeChannel, useBroadcast } from "@/hooks/use-realtime"
import { getCurrentUser } from "@/lib/mock-users"
import { Send } from "lucide-react"

interface Message {
  id: string
  userId: string
  username: string
  avatar?: string
  content: string
  timestamp: string
}

interface RealtimeChatProps {
  channelId: string
  title?: string
}

export function RealtimeChat({ channelId, title = "Chat" }: RealtimeChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const currentUser = getCurrentUser()
  const { broadcast } = useBroadcast()

  // Abonniere den Chat-Kanal
  useRealtimeChannel<Message>(`chat:${channelId}`, "new-message", {
    onData: (message) => {
      setMessages((prev) => [...prev, message])
    },
  })

  // Scrolle automatisch nach unten, wenn neue Nachrichten ankommen
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Sende eine neue Nachricht
  const sendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      content: inputValue,
      timestamp: new Date().toISOString(),
    }

    // Sende die Nachricht an den Kanal
    broadcast(`chat:${channelId}`, "new-message", newMessage)

    // Setze das Eingabefeld zurück
    setInputValue("")
  }

  // Behandle die Eingabetaste
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Formatiere den Zeitstempel
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className="w-full h-[500px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-[350px] px-4" ref={scrollAreaRef}>
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Noch keine Nachrichten. Starte die Unterhaltung!
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-2 ${message.userId === currentUser.id ? "justify-end" : ""}`}
                >
                  {message.userId !== currentUser.id && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.username} />
                      <AvatarFallback>{message.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`rounded-lg px-3 py-2 max-w-[80%] ${
                      message.userId === currentUser.id ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {message.userId !== currentUser.id && (
                      <p className="text-xs font-medium mb-1">{message.username}</p>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 text-right mt-1">{formatTimestamp(message.timestamp)}</p>
                  </div>

                  {message.userId === currentUser.id && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.username} />
                      <AvatarFallback>{message.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Nachricht eingeben..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button size="icon" onClick={sendMessage} disabled={!inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
