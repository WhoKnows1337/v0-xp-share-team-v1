"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Users,
  Plus,
  Settings,
  Crown,
  Shield,
  UserPlus,
  UserMinus,
  Calendar,
  MapPin,
  Lock,
  Globe,
  Eye,
} from "lucide-react"

interface Group {
  id: string
  name: string
  description: string
  memberCount: number
  isPrivate: boolean
  category: string
  location?: string
  createdAt: Date
  avatar?: string
  role: "owner" | "admin" | "moderator" | "member"
  tags: string[]
}

interface GroupMember {
  id: string
  name: string
  username: string
  avatar?: string
  role: "owner" | "admin" | "moderator" | "member"
  joinedAt: Date
  lastActive: Date
  xpContributed: number
}

const mockGroups: Group[] = [
  {
    id: "1",
    name: "Bergwanderer Hamburg",
    description: "Gemeinsame Wanderungen und Outdoor-Erlebnisse in und um Hamburg",
    memberCount: 127,
    isPrivate: false,
    category: "Outdoor",
    location: "Hamburg",
    createdAt: new Date(2024, 0, 15),
    role: "admin",
    tags: ["Wandern", "Natur", "Hamburg", "Outdoor"],
  },
  {
    id: "2",
    name: "Fotografie Enthusiasten",
    description: "Teile deine besten Foto-Erlebnisse und lerne von anderen",
    memberCount: 89,
    isPrivate: true,
    category: "Kreativ",
    createdAt: new Date(2024, 1, 3),
    role: "member",
    tags: ["Fotografie", "Kunst", "Kreativ"],
  },
  {
    id: "3",
    name: "Kulinarische Entdeckungen",
    description: "Restaurants, Rezepte und Food-Erlebnisse",
    memberCount: 203,
    isPrivate: false,
    category: "Kulinarik",
    createdAt: new Date(2023, 11, 20),
    role: "owner",
    tags: ["Essen", "Restaurants", "Kochen"],
  },
]

const mockMembers: GroupMember[] = [
  {
    id: "1",
    name: "Max Mustermann",
    username: "max_wanderer",
    role: "owner",
    joinedAt: new Date(2024, 0, 15),
    lastActive: new Date(),
    xpContributed: 2450,
  },
  {
    id: "2",
    name: "Anna Schmidt",
    username: "anna_explorer",
    role: "admin",
    joinedAt: new Date(2024, 0, 20),
    lastActive: new Date(Date.now() - 1000 * 60 * 30),
    xpContributed: 1890,
  },
  {
    id: "3",
    name: "Tom Weber",
    username: "tom_hiker",
    role: "moderator",
    joinedAt: new Date(2024, 1, 5),
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
    xpContributed: 1234,
  },
]

export function GroupManagement() {
  const [groups, setGroups] = useState<Group[]>(mockGroups)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [members, setMembers] = useState<GroupMember[]>(mockMembers)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    category: "",
    isPrivate: false,
    location: "",
    tags: "",
  })

  const getRoleIcon = (role: GroupMember["role"]) => {
    switch (role) {
      case "owner":
        return <Crown className="h-4 w-4 text-yellow-500" />
      case "admin":
        return <Shield className="h-4 w-4 text-red-500" />
      case "moderator":
        return <Eye className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const getRoleBadgeColor = (role: GroupMember["role"]) => {
    switch (role) {
      case "owner":
        return "bg-yellow-500"
      case "admin":
        return "bg-red-500"
      case "moderator":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatLastActive = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "Gerade aktiv"
    if (minutes < 60) return `vor ${minutes} Min`
    if (hours < 24) return `vor ${hours} Std`
    return `vor ${days} Tag${days > 1 ? "en" : ""}`
  }

  const createGroup = () => {
    const group: Group = {
      id: Date.now().toString(),
      name: newGroup.name,
      description: newGroup.description,
      memberCount: 1,
      isPrivate: newGroup.isPrivate,
      category: newGroup.category,
      location: newGroup.location || undefined,
      createdAt: new Date(),
      role: "owner",
      tags: newGroup.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    }

    setGroups((prev) => [group, ...prev])
    setNewGroup({
      name: "",
      description: "",
      category: "",
      isPrivate: false,
      location: "",
      tags: "",
    })
    setShowCreateDialog(false)
  }

  const leaveGroup = (groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId))
  }

  const promoteUser = (userId: string, newRole: GroupMember["role"]) => {
    setMembers((prev) => prev.map((m) => (m.id === userId ? { ...m, role: newRole } : m)))
  }

  const removeMember = (userId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== userId))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Meine Gruppen
          </h2>
          <p className="text-muted-foreground">Verwalte deine Community-Gruppen und Mitgliedschaften</p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Neue Gruppe erstellen
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Neue Gruppe erstellen</DialogTitle>
              <DialogDescription>Erstelle eine neue Community-Gruppe für gemeinsame Interessen</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Gruppenname</Label>
                <Input
                  id="name"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="z.B. Hamburger Wanderfreunde"
                />
              </div>

              <div>
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Beschreibe worum es in deiner Gruppe geht..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="category">Kategorie</Label>
                <Select
                  value={newGroup.category}
                  onValueChange={(value) => setNewGroup((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wähle eine Kategorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="outdoor">Outdoor & Natur</SelectItem>
                    <SelectItem value="kreativ">Kreativ & Kunst</SelectItem>
                    <SelectItem value="kulinarik">Kulinarik</SelectItem>
                    <SelectItem value="sport">Sport & Fitness</SelectItem>
                    <SelectItem value="reisen">Reisen</SelectItem>
                    <SelectItem value="technologie">Technologie</SelectItem>
                    <SelectItem value="musik">Musik</SelectItem>
                    <SelectItem value="literatur">Literatur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Standort (optional)</Label>
                <Input
                  id="location"
                  value={newGroup.location}
                  onChange={(e) => setNewGroup((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="z.B. Hamburg, Berlin..."
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (kommagetrennt)</Label>
                <Input
                  id="tags"
                  value={newGroup.tags}
                  onChange={(e) => setNewGroup((prev) => ({ ...prev, tags: e.target.value }))}
                  placeholder="z.B. Wandern, Natur, Hamburg"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="private">Private Gruppe</Label>
                  <p className="text-sm text-muted-foreground">Nur auf Einladung beitreten</p>
                </div>
                <Switch
                  id="private"
                  checked={newGroup.isPrivate}
                  onCheckedChange={(checked) => setNewGroup((prev) => ({ ...prev, isPrivate: checked }))}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={createGroup} className="flex-1" disabled={!newGroup.name || !newGroup.category}>
                  Gruppe erstellen
                </Button>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Abbrechen
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card
            key={group.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedGroup(group)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={group.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{group.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {group.memberCount} Mitglieder
                      {group.isPrivate ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className={getRoleBadgeColor(group.role)}>
                  {group.role === "owner"
                    ? "Besitzer"
                    : group.role === "admin"
                      ? "Admin"
                      : group.role === "moderator"
                        ? "Moderator"
                        : "Mitglied"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{group.description}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">{group.category}</Badge>
                  {group.location && (
                    <>
                      <MapPin className="h-3 w-3" />
                      {group.location}
                    </>
                  )}
                </div>

                <div className="flex flex-wrap gap-1">
                  {group.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {group.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{group.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gruppen-Detail Dialog */}
      {selectedGroup && (
        <Dialog open={!!selectedGroup} onOpenChange={() => setSelectedGroup(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedGroup.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{selectedGroup.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-xl">{selectedGroup.name}</DialogTitle>
                  <DialogDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {selectedGroup.memberCount} Mitglieder
                    </span>
                    <span className="flex items-center gap-1">
                      {selectedGroup.isPrivate ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                      {selectedGroup.isPrivate ? "Private Gruppe" : "Öffentliche Gruppe"}
                    </span>
                    <Badge variant="secondary">{selectedGroup.category}</Badge>
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Übersicht</TabsTrigger>
                <TabsTrigger value="members">Mitglieder</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="settings">Einstellungen</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Beschreibung</h4>
                  <p className="text-muted-foreground">{selectedGroup.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedGroup.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Erstellt am</h4>
                    <p className="text-muted-foreground">{selectedGroup.createdAt.toLocaleDateString("de-DE")}</p>
                  </div>
                  {selectedGroup.location && (
                    <div>
                      <h4 className="font-semibold mb-2">Standort</h4>
                      <p className="text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {selectedGroup.location}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="members" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Mitglieder ({members.length})</h4>
                  {(selectedGroup.role === "owner" || selectedGroup.role === "admin") && (
                    <Button size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Mitglied einladen
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{member.name}</span>
                            {getRoleIcon(member.role)}
                            <Badge variant="outline" className={getRoleBadgeColor(member.role)}>
                              {member.role === "owner"
                                ? "Besitzer"
                                : member.role === "admin"
                                  ? "Admin"
                                  : member.role === "moderator"
                                    ? "Moderator"
                                    : "Mitglied"}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            @{member.username} • {member.xpContributed} XP beigetragen
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Beigetreten: {member.joinedAt.toLocaleDateString("de-DE")} • Zuletzt aktiv:{" "}
                            {formatLastActive(member.lastActive)}
                          </div>
                        </div>
                      </div>

                      {(selectedGroup.role === "owner" || selectedGroup.role === "admin") &&
                        member.role !== "owner" && (
                          <div className="flex items-center gap-2">
                            <Select
                              value={member.role}
                              onValueChange={(value) => promoteUser(member.id, value as GroupMember["role"])}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="member">Mitglied</SelectItem>
                                <SelectItem value="moderator">Moderator</SelectItem>
                                {selectedGroup.role === "owner" && <SelectItem value="admin">Admin</SelectItem>}
                              </SelectContent>
                            </Select>
                            <Button variant="outline" size="sm" onClick={() => removeMember(member.id)}>
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="events" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Gruppen-Events</h4>
                  <Button size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Event erstellen
                  </Button>
                </div>

                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Keine Events geplant</h3>
                  <p className="text-muted-foreground">Erstelle das erste Event für deine Gruppe!</p>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                {selectedGroup.role === "owner" || selectedGroup.role === "admin" ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-4">Gruppen-Einstellungen</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Private Gruppe</Label>
                            <p className="text-sm text-muted-foreground">Nur auf Einladung beitreten</p>
                          </div>
                          <Switch checked={selectedGroup.isPrivate} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Mitglieder können einladen</Label>
                            <p className="text-sm text-muted-foreground">
                              Alle Mitglieder können neue Personen einladen
                            </p>
                          </div>
                          <Switch />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Automatische Moderation</Label>
                            <p className="text-sm text-muted-foreground">KI-gestützte Inhaltsmoderation aktivieren</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-4 text-red-600">Gefahrenzone</h4>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full">
                          <Settings className="h-4 w-4 mr-2" />
                          Erweiterte Einstellungen
                        </Button>
                        {selectedGroup.role === "owner" && (
                          <Button variant="destructive" className="w-full">
                            Gruppe löschen
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-4">Mitgliedschaft</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Benachrichtigungen</Label>
                            <p className="text-sm text-muted-foreground">Erhalte Updates von dieser Gruppe</p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>E-Mail Digest</Label>
                            <p className="text-sm text-muted-foreground">Wöchentliche Zusammenfassung per E-Mail</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <Button variant="destructive" className="w-full" onClick={() => leaveGroup(selectedGroup.id)}>
                        Gruppe verlassen
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
