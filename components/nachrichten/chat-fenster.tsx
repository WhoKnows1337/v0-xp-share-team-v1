"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { Message, Conversation, Attachment } from "@/types/message"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip, Smile, ImageIcon, File, X } from "lucide-react"
import {
  getCurrentUser,
  getConversationTitle,
  getConversationAvatar,
  sendMessage as sendMessageUtil,
  markConversationAsRead,
} from "@/lib/mock-messages"
import { findUserByUsername } from "@/lib/user-utils" // Geändert von getUserByUsername zu findUserByUsername
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ChatFensterProps {
  conversation: Conversation
  messages: Message[]
  onBack?: () => void
}

export function ChatFenster({ conversation, messages, onBack }: ChatFensterProps) {
  const [newMessage, setNewMessage] = useState("")
  const [localMessages, setLocalMessages] = useState<Message[]>(messages)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentUser = getCurrentUser()
  const conversationTitle = getConversationTitle(conversation, currentUser)
  const conversationAvatar = getConversationAvatar(conversation, currentUser)
  const [attachment, setAttachment] = useState<Attachment | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Markiere die Konversation als gelesen, wenn sie geöffnet wird
  useEffect(() => {
    markConversationAsRead(conversation.id)
    setLocalMessages(messages)
  }, [conversation.id, messages])

  // Scrolle zum Ende der Nachrichten, wenn neue Nachrichten hinzugefügt werden
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [localMessages])

  const handleAttachment = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In einer echten Anwendung würde die Datei hochgeladen werden
      setAttachment({
        id: `attachment-${Date.now()}`,
        type: file.type.startsWith("image/") ? "image" : "file",
        url: URL.createObjectURL(file),
        name: file.name,
      })
    }
  }

  const removeAttachment = () => {
    if (attachment?.url.startsWith("blob:")) {
      URL.revokeObjectURL(attachment.url)
    }
    setAttachment(null)
  }

  const handleSendMessage = () => {
    if (newMessage.trim() === "" && !attachment) return

    const sentMessage = sendMessageUtil(conversation.id, newMessage, currentUser, attachment ? [attachment] : undefined)
    setLocalMessages([...localMessages, sentMessage])
    setNewMessage("")
    removeAttachment()
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const addEmoji = (emoji: string) => {
    setNewMessage((prev) => prev + emoji)
  }

  // Formatiere das Datum für die Anzeige
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Gruppiere Nachrichten nach Datum
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {}

    messages.forEach((message) => {
      const date = message.timestamp.toLocaleDateString("de-DE")
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

  const messageGroups = groupMessagesByDate(localMessages)

  // Finde den Benutzer anhand der Sender-ID
  const getUserByUsername = (username: string) => {
    return findUserByUsername(username)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat-Header */}
      <div className="flex items-center p-4 border-b">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chevron-left"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span className="sr-only">Zurück</span>
          </Button>
        )}
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={conversationAvatar || "/placeholder.svg"} alt={conversationTitle} />
          <AvatarFallback>{conversationTitle.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{conversationTitle}</h3>
          {conversation.type === "group" && (
            <p className="text-xs text-muted-foreground">{conversation.participants.length} Teilnehmer</p>
          )}
        </div>
      </div>

      {/* Chat-Nachrichten */}
      <ScrollArea className="flex-1 p-4">
        {messageGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                {group.date === new Date().toLocaleDateString("de-DE")
                  ? "Heute"
                  : group.date === new Date(Date.now() - 86400000).toLocaleDateString("de-DE")
                    ? "Gestern"
                    : group.date}
              </div>
            </div>
            {group.messages.map((message, index) => {
              const isCurrentUser = message.senderId === currentUser
              const sender = getUserByUsername(message.senderId)

              return (
                <div key={message.id} className={cn("flex mb-4", isCurrentUser ? "justify-end" : "justify-start")}>
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarImage src={sender?.avatar || "/placeholder.svg"} alt={sender?.username} />
                      <AvatarFallback>
                        {sender?.vorname?.charAt(0) || sender?.username?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[70%] rounded-lg p-3",
                      isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted",
                    )}
                  >
                    {conversation.type === "group" && !isCurrentUser && (
                      <p className="text-xs font-medium mb-1">
                        {sender?.vorname || sender?.username || "Unbekannt"}
                        {sender?.nachname ? ` ${sender.nachname}` : ""}
                      </p>
                    )}
                    <p>{message.content}</p>
                    {message.attachments?.map((attachment) => (
                      <div key={attachment.id} className="mt-2">
                        {attachment.type === "image" ? (
                          <div className="relative rounded-md overflow-hidden">
                            <img
                              src={attachment.url || "/placeholder.svg"}
                              alt={attachment.name}
                              className="max-w-full max-h-60 object-contain"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 p-2 bg-background/50 rounded-md">
                            <File className="h-4 w-4" />
                            <span className="text-sm truncate">{attachment.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    <p className="text-xs mt-1 text-right opacity-70">{formatMessageTime(message.timestamp)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>

      {attachment && (
        <div className="p-2 border-t">
          <div className="flex items-center justify-between bg-muted/30 p-2 rounded-md">
            {attachment.type === "image" ? (
              <div className="flex items-center">
                <ImageIcon className="h-4 w-4 mr-2" />
                <span className="text-sm truncate max-w-[200px]">{attachment.name}</span>
              </div>
            ) : (
              <div className="flex items-center">
                <File className="h-4 w-4 mr-2" />
                <span className="text-sm truncate max-w-[200px]">{attachment.name}</span>
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={removeAttachment} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Nachrichteneingabe */}
      <div className="p-4 border-t">
        <div className="flex items-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-1" onClick={handleAttachment}>
                  <Paperclip className="h-5 w-5" />
                  <span className="sr-only">Anhang</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Datei anhängen</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Smile className="h-5 w-5" />
                <span className="sr-only">Emoji</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <div className="grid grid-cols-8 gap-1">
                {["😊", "😂", "❤️", "👍", "🎉", "🙏", "🤔", "😎", "😍", "🥰", "😢", "😭", "😡", "🤯", "🤩", "👋"].map(
                  (emoji) => (
                    <button
                      key={emoji}
                      className="p-1 hover:bg-accent rounded-md text-lg"
                      onClick={() => {
                        addEmoji(emoji)
                        setShowEmojiPicker(false)
                      }}
                    >
                      {emoji}
                    </button>
                  ),
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Input
            placeholder="Nachricht schreiben..."
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
            disabled={newMessage.trim() === "" && !attachment}
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Senden</span>
          </Button>
        </div>
        <div className="text-xs text-center text-muted-foreground mt-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="inline-block mr-1"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Ende-zu-Ende verschlüsselt
        </div>
      </div>
    </div>
  )
}
