"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Users, Settings, Crown, Shield, UserMinus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GroupMember {
  id: string
  name: string
  username: string
  avatar?: string
  role: "owner" | "admin" | "moderator" | "member"
  joinedAt: Date
}

interface Group {
  id: string
  name: string
  description: string
  category: string
  isPrivate: boolean
  memberCount: number
  members: GroupMember[]
  rules: string[]
  tags: string[]
}

export function GroupManagement() {
  const [groups, setGroups] = useState<Group[]>([])
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { toast } = useToast()

  const createGroup = (groupData: Partial<Group>) => {
    const newGroup: Group = {
      id: Date.now().toString(),
      name: groupData.name || "",
      description: groupData.description || "",
      category: groupData.category || "Allgemein",
      isPrivate: groupData.isPrivate || false,
      memberCount: 1,
      members: [
        {
          id: "current-user",
          name: "Du",
          username: "current-user",
          role: "owner",
          joinedAt: new Date(),
        },
      ],
      rules: [],
      tags: [],
    }

    setGroups([...groups, newGroup])
    setIsCreateDialogOpen(false)
    toast({
      title: "Gruppe erstellt",
      description: `Die Gruppe "${newGroup.name}" wurde erfolgreich erstellt.`,
    })
  }

  const joinGroup = (groupId: string) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              memberCount: group.memberCount + 1,
              members: [
                ...group.members,
                {
                  id: "current-user",
                  name: "Du",
                  username: "current-user",
                  role: "member",
                  joinedAt: new Date(),
                },
              ],
            }
          : group,
      ),
    )

    toast({
      title: "Gruppe beigetreten",
      description: "Du bist der Gruppe erfolgreich beigetreten.",
    })
  }

  const leaveGroup = (groupId: string) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              memberCount: Math.max(0, group.memberCount - 1),
              members: group.members.filter((member) => member.id !== "current-user"),
            }
          : group,
      ),
    )

    toast({
      title: "Gruppe verlassen",
      description: "Du hast die Gruppe verlassen.",
    })
  }

  const getRoleIcon = (role: GroupMember["role"]) => {
    switch (role) {
      case "owner":
        return <Crown className="h-4 w-4 text-yellow-500" />
      case "admin":
        return <Shield className="h-4 w-4 text-blue-500" />
      case "moderator":
        return <Shield className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Meine Gruppen</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Neue Gruppe
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neue Gruppe erstellen</DialogTitle>
            </DialogHeader>
            <CreateGroupForm onSubmit={createGroup} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <Card key={group.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{group.name}</CardTitle>
                <Badge variant={group.isPrivate ? "secondary" : "default"}>
                  {group.isPrivate ? "Privat" : "Öffentlich"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  {group.memberCount} Mitglieder
                </div>
                <Button
                  size="sm"
                  onClick={() => setSelectedGroup(group)}
                  variant={group.members.some((m) => m.id === "current-user") ? "outline" : "default"}
                >
                  {group.members.some((m) => m.id === "current-user") ? "Verwalten" : "Beitreten"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedGroup && (
        <Dialog open={!!selectedGroup} onOpenChange={() => setSelectedGroup(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedGroup.name}</DialogTitle>
            </DialogHeader>
            <GroupDetailTabs
              group={selectedGroup}
              onJoin={() => joinGroup(selectedGroup.id)}
              onLeave={() => leaveGroup(selectedGroup.id)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function CreateGroupForm({ onSubmit }: { onSubmit: (data: Partial<Group>) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Allgemein",
    isPrivate: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Gruppenname</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Gib einen Namen für deine Gruppe ein"
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Beschreibung</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Beschreibe deine Gruppe"
          rows={3}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Kategorie</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full p-2 border rounded-md"
        >
          <option value="Allgemein">Allgemein</option>
          <option value="Reisen">Reisen</option>
          <option value="Wellness">Wellness</option>
          <option value="Essen">Essen</option>
          <option value="Natur">Natur</option>
          <option value="Kunst">Kunst</option>
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPrivate"
          checked={formData.isPrivate}
          onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
        />
        <label htmlFor="isPrivate" className="text-sm">
          Private Gruppe (nur auf Einladung)
        </label>
      </div>
      <Button type="submit" className="w-full">
        Gruppe erstellen
      </Button>
    </form>
  )
}

function GroupDetailTabs({
  group,
  onJoin,
  onLeave,
}: {
  group: Group
  onJoin: () => void
  onLeave: () => void
}) {
  const isMember = group.members.some((m) => m.id === "current-user")
  const currentUserRole = group.members.find((m) => m.id === "current-user")?.role

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Übersicht</TabsTrigger>
        <TabsTrigger value="members">Mitglieder</TabsTrigger>
        <TabsTrigger value="rules">Regeln</TabsTrigger>
        {(currentUserRole === "owner" || currentUserRole === "admin") && (
          <TabsTrigger value="settings">Einstellungen</TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Beschreibung</h3>
          <p className="text-muted-foreground">{group.description}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Statistiken</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{group.memberCount}</div>
              <div className="text-sm text-muted-foreground">Mitglieder</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">42</div>
              <div className="text-sm text-muted-foreground">Beiträge</div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {isMember ? (
            <Button variant="destructive" onClick={onLeave}>
              <UserMinus className="h-4 w-4 mr-2" />
              Gruppe verlassen
            </Button>
          ) : (
            <Button onClick={onJoin}>
              <Plus className="h-4 w-4 mr-2" />
              Gruppe beitreten
            </Button>
          )}
        </div>
      </TabsContent>

      <TabsContent value="members" className="space-y-4">
        <h3 className="text-lg font-semibold">Mitglieder ({group.memberCount})</h3>
        <div className="space-y-2">
          {group.members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={member.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{member.name}</span>
                    {getRoleIcon(member.role)}
                  </div>
                  <span className="text-sm text-muted-foreground">@{member.username}</span>
                </div>
              </div>
              <Badge variant="outline">{member.role}</Badge>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="rules" className="space-y-4">
        <h3 className="text-lg font-semibold">Gruppenregeln</h3>
        {group.rules.length > 0 ? (
          <ol className="list-decimal list-inside space-y-2">
            {group.rules.map((rule, index) => (
              <li key={index} className="text-sm">
                {rule}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-muted-foreground">Noch keine Regeln definiert.</p>
        )}
      </TabsContent>

      {(currentUserRole === "owner" || currentUserRole === "admin") && (
        <TabsContent value="settings" className="space-y-4">
          <h3 className="text-lg font-semibold">Gruppeneinstellungen</h3>
          <div className="space-y-4">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Gruppe bearbeiten
            </Button>
            <Button variant="outline">Mitglieder verwalten</Button>
            <Button variant="outline">Regeln bearbeiten</Button>
            {currentUserRole === "owner" && <Button variant="destructive">Gruppe löschen</Button>}
          </div>
        </TabsContent>
      )}
    </Tabs>
  )

  function getRoleIcon(role: GroupMember["role"]) {
    switch (role) {
      case "owner":
        return <Crown className="h-4 w-4 text-yellow-500" />
      case "admin":
        return <Shield className="h-4 w-4 text-blue-500" />
      case "moderator":
        return <Shield className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }
}
