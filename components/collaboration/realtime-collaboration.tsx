"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRealtimeChannel, useBroadcast } from "@/hooks/use-realtime"
import { getCurrentUser } from "@/lib/mock-users"
import { Edit, Save, Users } from "lucide-react"

interface CollaborationUser {
  id: string
  username: string
  avatar?: string
  cursor?: { x: number; y: number }
  selection?: { start: number; end: number }
  lastActive: string
}

interface CollaborationData {
  content: string
  users: CollaborationUser[]
}

interface RealtimeCollaborationProps {
  documentId: string
  initialContent?: string
}

export function RealtimeCollaboration({ documentId, initialContent = "" }: RealtimeCollaborationProps) {
  const [content, setContent] = useState(initialContent)
  const [activeUsers, setActiveUsers] = useState<CollaborationUser[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const currentUser = getCurrentUser()
  const { broadcast } = useBroadcast()

  // Abonniere den Kollaborationskanal
  useRealtimeChannel<CollaborationData>(`collaboration:${documentId}`, "update", {
    onData: (data) => {
      setContent(data.content)
      setActiveUsers(data.users)
    },
  })

  // Abonniere den Benutzeraktivitätskanal
  useRealtimeChannel<CollaborationUser>(`collaboration:${documentId}:users`, "user-activity", {
    onData: (user) => {
      setActiveUsers((prev) => {
        const existingUserIndex = prev.findIndex((u) => u.id === user.id)

        if (existingUserIndex >= 0) {
          const newUsers = [...prev]
          newUsers[existingUserIndex] = user
          return newUsers
        } else {
          return [...prev, user]
        }
      })
    },
  })

  // Sende Benutzeraktivität beim Laden der Komponente
  useEffect(() => {
    const user: CollaborationUser = {
      id: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      lastActive: new Date().toISOString(),
    }

    broadcast(`collaboration:${documentId}:users`, "user-activity", user)

    // Sende regelmäßig Aktivitätsupdates
    const interval = setInterval(() => {
      broadcast(`collaboration:${documentId}:users`, "user-activity", {
        ...user,
        lastActive: new Date().toISOString(),
      })
    }, 30000) // Alle 30 Sekunden

    return () => {
      clearInterval(interval)
    }
  }, [documentId, currentUser, broadcast])

  // Behandle Änderungen am Inhalt
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  // Speichere Änderungen
  const saveChanges = () => {
    broadcast(`collaboration:${documentId}`, "update", {
      content,
      users: activeUsers,
    })

    setIsEditing(false)
  }

  // Formatiere den Zeitstempel
  const formatLastActive = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)

    if (diffSecs < 60) return "gerade aktiv"
    if (diffSecs < 120) return "vor 1 Minute"
    if (diffSecs < 3600) return `vor ${Math.floor(diffSecs / 60)} Minuten`
    if (diffSecs < 7200) return "vor 1 Stunde"

    return `vor ${Math.floor(diffSecs / 3600)} Stunden`
  }

  // Filtere inaktive Benutzer (älter als 5 Minuten)
  const activeUsersList = activeUsers.filter((user) => {
    const lastActive = new Date(user.lastActive)
    const now = new Date()
    const diffMs = now.getTime() - lastActive.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))

    return diffMins < 5
  })

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Kollaboratives Dokument</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              {activeUsersList.length} aktiv
            </Badge>
            {isEditing ? (
              <Button size="sm" onClick={saveChanges}>
                <Save className="h-4 w-4 mr-2" />
                Speichern
              </Button>
            ) : (
              <Button size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Bearbeiten
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {activeUsersList.map((user) => (
            <div key={user.id} className="flex items-center space-x-1">
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-xs">{user.username}</span>
              <span className="text-xs text-muted-foreground">({formatLastActive(user.lastActive)})</span>
            </div>
          ))}
        </div>

        {isEditing ? (
          <Textarea
            value={content}
            onChange={handleContentChange}
            className="min-h-[200px]"
            placeholder="Beginne mit der Bearbeitung des Dokuments..."
          />
        ) : (
          <div className="border rounded-md p-4 min-h-[200px] whitespace-pre-wrap">
            {content || "Dieses Dokument ist leer. Klicke auf 'Bearbeiten', um Inhalte hinzuzufügen."}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
