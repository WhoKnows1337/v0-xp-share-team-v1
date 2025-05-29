"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import { getContentPrivacySettings, updateContentPrivacy } from "@/lib/mock-privacy"
import type { ContentPrivacySettings, PrivacyLevel } from "@/types/privacy"
import { Lock, Users, User, UserPlus, Globe, Eye, EyeOff } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { mockUsers } from "@/lib/mock-users"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { mockGroups } from "@/lib/mock-groups"

interface ZugriffskontrolleProps {
  contentId: string
  contentType: "erlebnis" | "kommentar" | "diskussion" | "xp-eintrag"
  onSave?: (settings: ContentPrivacySettings) => void
}

export function Zugriffskontrolle({ contentId, contentType, onSave }: ZugriffskontrolleProps) {
  const [settings, setSettings] = useState<ContentPrivacySettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Lade die Privatsphäre-Einstellungen für den Inhalt
    const contentSettings = getContentPrivacySettings(contentId)

    if (contentSettings) {
      setSettings(contentSettings)
      setSelectedUsers(contentSettings.allowedUsers || [])
      setSelectedGroups(contentSettings.allowedGroups || [])
    } else {
      // Erstelle neue Einstellungen, wenn keine vorhanden sind
      setSettings({
        id: `content-privacy-${Date.now()}`,
        contentId,
        contentType,
        visibility: "public",
        updatedAt: new Date().toISOString(),
      })
    }

    setLoading(false)
  }, [contentId, contentType])

  const handleVisibilityChange = (visibility: PrivacyLevel) => {
    if (!settings) return

    setSettings({
      ...settings,
      visibility,
    })
  }

  const handleUserToggle = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  const handleGroupToggle = (groupId: string) => {
    if (selectedGroups.includes(groupId)) {
      setSelectedGroups(selectedGroups.filter((id) => id !== groupId))
    } else {
      setSelectedGroups([...selectedGroups, groupId])
    }
  }

  const handleSave = async () => {
    if (!settings) return

    setSaving(true)

    try {
      // Aktualisiere die Einstellungen
      const updatedSettings = updateContentPrivacy(contentId, {
        ...settings,
        visibility: settings.visibility,
        allowedUsers: settings.visibility === "custom" ? selectedUsers : undefined,
        allowedGroups: settings.visibility === "custom" ? selectedGroups : undefined,
      })

      setSettings(updatedSettings)

      if (onSave) {
        onSave(updatedSettings)
      }

      toast({
        title: "Zugriffseinstellungen gespeichert",
        description: "Die Zugriffseinstellungen wurden erfolgreich aktualisiert.",
      })
    } catch (error) {
      console.error("Fehler beim Speichern der Zugriffseinstellungen:", error)

      toast({
        title: "Fehler",
        description: "Beim Speichern der Zugriffseinstellungen ist ein Fehler aufgetreten. Bitte versuche es erneut.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getVisibilityIcon = (visibility: PrivacyLevel) => {
    switch (visibility) {
      case "public":
        return <Globe className="h-4 w-4" />
      case "followers":
        return <Users className="h-4 w-4" />
      case "private":
        return <Lock className="h-4 w-4" />
      case "custom":
        return <User className="h-4 w-4" />
      default:
        return <Eye className="h-4 w-4" />
    }
  }

  const getVisibilityLabel = (visibility: PrivacyLevel) => {
    switch (visibility) {
      case "public":
        return "Öffentlich"
      case "followers":
        return "Nur Follower"
      case "private":
        return "Privat (Nur ich)"
      case "custom":
        return "Benutzerdefiniert"
      default:
        return "Unbekannt"
    }
  }

  const getContentTypeLabel = (type: "erlebnis" | "kommentar" | "diskussion" | "xp-eintrag") => {
    switch (type) {
      case "erlebnis":
        return "Erlebnis"
      case "kommentar":
        return "Kommentar"
      case "diskussion":
        return "Diskussion"
      case "xp-eintrag":
        return "XP-Eintrag"
      default:
        return "Inhalt"
    }
  }

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const filteredGroups = mockGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.beschreibung.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading || !settings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Zugriffseinstellungen</CardTitle>
          <CardDescription>Lade Einstellungen...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          <CardTitle>Zugriffseinstellungen</CardTitle>
        </div>
        <CardDescription>
          Lege fest, wer auf {getContentTypeLabel(contentType).toLowerCase()} "{contentId}" zugreifen kann.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="visibility">Sichtbarkeit</Label>
            <Select
              value={settings.visibility}
              onValueChange={(value) => handleVisibilityChange(value as PrivacyLevel)}
            >
              <SelectTrigger id="visibility" className="w-full">
                <SelectValue placeholder="Wähle eine Option">
                  <div className="flex items-center gap-2">
                    {getVisibilityIcon(settings.visibility)}
                    <span>{getVisibilityLabel(settings.visibility)}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="public" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>Öffentlich (Alle können sehen)</span>
                </SelectItem>
                <SelectItem value="followers" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Nur Follower</span>
                </SelectItem>
                <SelectItem value="private" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>Privat (Nur ich)</span>
                </SelectItem>
                <SelectItem value="custom" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Benutzerdefiniert</span>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {settings.visibility === "public" && "Jeder kann diesen Inhalt sehen."}
              {settings.visibility === "followers" && "Nur deine Follower können diesen Inhalt sehen."}
              {settings.visibility === "private" && "Nur du kannst diesen Inhalt sehen."}
              {settings.visibility === "custom" && "Nur ausgewählte Benutzer und Gruppen können diesen Inhalt sehen."}
            </p>
          </div>

          {settings.visibility === "custom" && (
            <div className="space-y-4 mt-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="search">Benutzer oder Gruppen suchen</Label>
                <div className="flex gap-2">
                  <Input
                    id="search"
                    placeholder="Name eingeben..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button variant="outline" size="icon" onClick={() => setSearchTerm("")}>
                    <EyeOff className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Benutzer
                  </h4>
                  <ScrollArea className="h-60 border rounded-md p-2">
                    <div className="space-y-2">
                      {filteredUsers.length === 0 ? (
                        <p className="text-sm text-muted-foreground p-2">Keine Benutzer gefunden</p>
                      ) : (
                        filteredUsers.map((user) => (
                          <div key={user.id} className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md">
                            <Checkbox
                              id={`user-${user.id}`}
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={() => handleUserToggle(user.id)}
                            />
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                              <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <Label htmlFor={`user-${user.id}`} className="flex-1 cursor-pointer text-sm">
                              {user.username}
                              {user.isVerifiziert && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  Verifiziert
                                </Badge>
                              )}
                            </Label>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                  <p className="text-xs text-muted-foreground">{selectedUsers.length} Benutzer ausgewählt</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Gruppen
                  </h4>
                  <ScrollArea className="h-60 border rounded-md p-2">
                    <div className="space-y-2">
                      {filteredGroups.length === 0 ? (
                        <p className="text-sm text-muted-foreground p-2">Keine Gruppen gefunden</p>
                      ) : (
                        filteredGroups.map((group) => (
                          <div key={group.id} className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md">
                            <Checkbox
                              id={`group-${group.id}`}
                              checked={selectedGroups.includes(group.id)}
                              onCheckedChange={() => handleGroupToggle(group.id)}
                            />
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={group.bild || "/placeholder.svg"} alt={group.name} />
                              <AvatarFallback>{group.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <Label htmlFor={`group-${group.id}`} className="flex-1 cursor-pointer text-sm">
                              {group.name}
                              <Badge variant="outline" className="ml-2 text-xs">
                                {group.mitglieder.length} Mitglieder
                              </Badge>
                            </Label>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                  <p className="text-xs text-muted-foreground">{selectedGroups.length} Gruppen ausgewählt</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserPlus className="h-4 w-4" />
                <p>
                  Tipp: Du kannst auch temporäre Links erstellen, um Inhalte mit Personen zu teilen, die nicht auf der
                  Plattform sind.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Speichern..." : "Zugriffseinstellungen speichern"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
