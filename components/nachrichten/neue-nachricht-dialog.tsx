"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { mockUsers } from "@/lib/mock-users"
import { mockChatChannels, createNewConversation, getCurrentUser } from "@/lib/mock-messages"
import { Checkbox } from "@/components/ui/checkbox"

interface NeueNachrichtDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConversationCreated: (conversationId: string) => void
}

export function NeueNachrichtDialog({ open, onOpenChange, onConversationCreated }: NeueNachrichtDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("direktnachricht")
  const currentUser = getCurrentUser()

  // Filtere Benutzer basierend auf der Suchanfrage
  const filteredUsers = mockUsers.filter((user) => {
    if (user.username === currentUser) return false

    const fullName = `${user.vorname} ${user.nachname}`.toLowerCase()
    const username = user.username.toLowerCase()
    const query = searchQuery.toLowerCase()

    return fullName.includes(query) || username.includes(query)
  })

  // Filtere Channels basierend auf der Suchanfrage
  const filteredChannels = mockChatChannels.filter((channel) => {
    const name = channel.name.toLowerCase()
    const description = channel.description.toLowerCase()
    const query = searchQuery.toLowerCase()

    return name.includes(query) || description.includes(query)
  })

  // Zurücksetzen der Auswahl, wenn der Dialog geschlossen wird
  useEffect(() => {
    if (!open) {
      setSearchQuery("")
      setSelectedUsers([])
      setSelectedChannel(null)
    }
  }, [open])

  const handleUserToggle = (username: string) => {
    setSelectedUsers((prev) => {
      if (prev.includes(username)) {
        return prev.filter((u) => u !== username)
      } else {
        return [...prev, username]
      }
    })
  }

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannel(channelId)
  }

  const handleCreateConversation = () => {
    if (activeTab === "direktnachricht" && selectedUsers.length > 0) {
      // Erstelle eine Direktnachricht oder Gruppenkonversation
      const isGroup = selectedUsers.length > 1
      const participants = [...selectedUsers, currentUser]

      const newConversation = createNewConversation(
        participants,
        isGroup ? "group" : "direct",
        isGroup
          ? `Gruppe mit ${selectedUsers
              .map((u) => {
                const user = mockUsers.find((mu) => mu.username === u)
                return user ? user.vorname || user.username : u
              })
              .join(", ")}`
          : undefined,
      )

      onConversationCreated(newConversation.id)
      onOpenChange(false)
    } else if (activeTab === "channel" && selectedChannel) {
      // In einer echten Anwendung würde hier der Benutzer dem Channel beitreten
      // Für diese Demo simulieren wir das Beitreten, indem wir eine neue Gruppenkonversation erstellen
      const channel = mockChatChannels.find((c) => c.id === selectedChannel)
      if (channel) {
        const newConversation = createNewConversation(
          [currentUser, "TraumReisender", "SeelenWanderer", "MeditationsGuide"], // Simulierte Teilnehmer
          "group",
          channel.name,
          channel.description,
          channel.avatar,
        )

        onConversationCreated(newConversation.id)
        onOpenChange(false)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Neue Nachricht</DialogTitle>
          <DialogDescription>Starte eine neue Konversation oder tritt einem Channel bei.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="direktnachricht">Direktnachricht</TabsTrigger>
            <TabsTrigger value="channel">Channel</TabsTrigger>
          </TabsList>

          <div className="relative mt-4 mb-4">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={activeTab === "direktnachricht" ? "Benutzer suchen..." : "Channel suchen..."}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <TabsContent value="direktnachricht" className="mt-0">
            <ScrollArea className="h-[300px]">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.username}
                    className="flex items-center p-3 hover:bg-accent rounded-lg cursor-pointer"
                    onClick={() => handleUserToggle(user.username)}
                  >
                    <Checkbox
                      checked={selectedUsers.includes(user.username)}
                      onCheckedChange={() => handleUserToggle(user.username)}
                      className="mr-3"
                    />
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                      <AvatarFallback>{user.vorname?.charAt(0) || user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {user.vorname ? `${user.vorname} ${user.nachname || ""}` : user.username}
                      </p>
                      <p className="text-sm text-muted-foreground">@{user.username}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">Keine Benutzer gefunden</div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="channel" className="mt-0">
            <ScrollArea className="h-[300px]">
              {filteredChannels.length > 0 ? (
                filteredChannels.map((channel) => (
                  <div
                    key={channel.id}
                    className={`flex items-center p-3 hover:bg-accent rounded-lg cursor-pointer ${
                      selectedChannel === channel.id ? "bg-accent" : ""
                    }`}
                    onClick={() => handleChannelSelect(channel.id)}
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={channel.avatar || "/placeholder.svg"} alt={channel.name} />
                      <AvatarFallback>{channel.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">{channel.name}</p>
                        <p className="text-xs text-muted-foreground">{channel.memberCount} Mitglieder</p>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{channel.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">Keine Channels gefunden</div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            onClick={handleCreateConversation}
            disabled={
              (activeTab === "direktnachricht" && selectedUsers.length === 0) ||
              (activeTab === "channel" && !selectedChannel)
            }
          >
            {activeTab === "direktnachricht"
              ? selectedUsers.length > 1
                ? "Gruppe erstellen"
                : "Konversation starten"
              : "Channel beitreten"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
