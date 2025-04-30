"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Users, Hash } from "lucide-react"
import { mockChatChannels } from "@/lib/mock-messages"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

export function ThemenChannels() {
  const [searchQuery, setSearchQuery] = useState("")
  const [channels, setChannels] = useState(mockChatChannels)
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false)
  const [newChannelData, setNewChannelData] = useState({
    name: "",
    description: "",
    category: "Persönliche Entwicklung",
    isPublic: true,
  })
  const router = useRouter()

  // Filtere Channels basierend auf der Suchanfrage
  const filteredChannels = channels.filter((channel) => {
    const name = channel.name.toLowerCase()
    const description = channel.description.toLowerCase()
    const category = channel.category.toLowerCase()
    const query = searchQuery.toLowerCase()

    return name.includes(query) || description.includes(query) || category.includes(query)
  })

  // Gruppiere Channels nach Kategorie
  const groupedChannels = filteredChannels.reduce(
    (groups, channel) => {
      const category = channel.category
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(channel)
      return groups
    },
    {} as Record<string, typeof mockChatChannels>,
  )

  const handleChannelClick = (channelId: string) => {
    router.push(`/channels/${channelId}`)
  }

  const handleCreateChannel = () => {
    // Validierung
    if (!newChannelData.name.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib einen Namen für den Channel ein.",
        variant: "destructive",
      })
      return
    }

    if (!newChannelData.description.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib eine Beschreibung für den Channel ein.",
        variant: "destructive",
      })
      return
    }

    // Erstelle neuen Channel (in einer echten App würde dies an einen Server gesendet)
    const newChannel = {
      id: `channel_${Date.now()}`,
      name: newChannelData.name,
      description: newChannelData.description,
      avatar: "/serene-meditation.png", // Standard-Avatar
      memberCount: 1, // Der Ersteller ist das erste Mitglied
      category: newChannelData.category,
      isPublic: newChannelData.isPublic,
      createdAt: new Date(),
    }

    setChannels((prev) => [...prev, newChannel])
    setIsCreateChannelOpen(false)
    setNewChannelData({
      name: "",
      description: "",
      category: "Persönliche Entwicklung",
      isPublic: true,
    })

    toast({
      title: "Channel erstellt",
      description: `Der Channel "${newChannelData.name}" wurde erfolgreich erstellt.`,
    })

    // Navigiere zum neuen Channel
    router.push(`/channels/${newChannel.id}`)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Themen-Channels</h2>
          <Button onClick={() => setIsCreateChannelOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Neuer Channel
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Channels durchsuchen..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {Object.entries(groupedChannels).length > 0 ? (
            Object.entries(groupedChannels).map(([category, categoryChannels]) => (
              <div key={category} className="mb-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-2">{category}</h3>
                {categoryChannels.map((channel) => (
                  <div
                    key={channel.id}
                    className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-accent mb-1"
                    onClick={() => handleChannelClick(channel.id)}
                  >
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
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium truncate">{channel.name}</h4>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="text-xs text-muted-foreground">{channel.memberCount}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{channel.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              Keine Channels gefunden. Erstelle einen neuen Channel oder ändere deine Suchanfrage.
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Dialog zum Erstellen eines neuen Channels */}
      <Dialog open={isCreateChannelOpen} onOpenChange={setIsCreateChannelOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Neuen Channel erstellen</DialogTitle>
            <DialogDescription>
              Erstelle einen neuen Themen-Channel für den Austausch mit anderen Nutzern.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="channel-name">Name des Channels</Label>
              <Input
                id="channel-name"
                placeholder="z.B. Traumdeutung Tipps"
                value={newChannelData.name}
                onChange={(e) => setNewChannelData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="channel-description">Beschreibung</Label>
              <Textarea
                id="channel-description"
                placeholder="Worum geht es in diesem Channel?"
                value={newChannelData.description}
                onChange={(e) => setNewChannelData((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="channel-category">Kategorie</Label>
              <Select
                value={newChannelData.category}
                onValueChange={(value) => setNewChannelData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger id="channel-category">
                  <SelectValue placeholder="Kategorie auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Persönliche Entwicklung">Persönliche Entwicklung</SelectItem>
                  <SelectItem value="Spiritualität">Spiritualität</SelectItem>
                  <SelectItem value="Paranormales">Paranormales</SelectItem>
                  <SelectItem value="Kunst & Kultur">Kunst & Kultur</SelectItem>
                  <SelectItem value="Freizeit & Hobby">Freizeit & Hobby</SelectItem>
                  <SelectItem value="Reisen & Abenteuer">Reisen & Abenteuer</SelectItem>
                  <SelectItem value="Wissenschaft & Technik">Wissenschaft & Technik</SelectItem>
                  <SelectItem value="Sonstiges">Sonstiges</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="channel-public"
                className="rounded border-gray-300"
                checked={newChannelData.isPublic}
                onChange={(e) => setNewChannelData((prev) => ({ ...prev, isPublic: e.target.checked }))}
              />
              <Label htmlFor="channel-public">Öffentlicher Channel</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateChannelOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleCreateChannel}>Channel erstellen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
