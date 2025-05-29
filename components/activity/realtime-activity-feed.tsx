"use client"

import { useState } from "react"
import { useRealtimeTable } from "@/hooks/use-realtime"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserLink } from "@/components/user-link"
import { mockUsers } from "@/lib/mock-users"
import { Activity, Clock, MessageSquare, Share2, Star, ThumbsUp, Users } from "lucide-react"

interface ActivityItem {
  id: string
  userId: string
  type: "like" | "comment" | "share" | "follow" | "create" | "update" | "favorite"
  targetId: string
  targetType: "erlebnis" | "kommentar" | "benutzer" | "gruppe"
  targetTitle?: string
  timestamp: string
}

export function RealtimeActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [activeTab, setActiveTab] = useState<string>("all")

  // Abonniere die Aktivitätstabelle
  useRealtimeTable<ActivityItem>("activities", {
    event: "INSERT",
    onData: (payload) => {
      // Füge die neue Aktivität hinzu
      setActivities((prev) => [payload.new, ...prev])
    },
  })

  // Filtere Aktivitäten basierend auf dem aktiven Tab
  const filteredActivities =
    activeTab === "all" ? activities : activities.filter((activity) => activity.type === activeTab)

  // Formatiere den Zeitstempel
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSecs < 60) return "gerade eben"
    if (diffMins < 60) return `vor ${diffMins} Minute${diffMins !== 1 ? "n" : ""}`
    if (diffHours < 24) return `vor ${diffHours} Stunde${diffHours !== 1 ? "n" : ""}`
    if (diffDays < 7) return `vor ${diffDays} Tag${diffDays !== 1 ? "en" : ""}`

    return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  // Finde den Benutzer anhand der ID
  const getUserById = (userId: string) => {
    return (
      mockUsers.find((user) => user.id === userId) || {
        id: userId,
        username: "Unbekannter Benutzer",
        avatar: "",
      }
    )
  }

  // Rendere das Aktivitätssymbol
  const renderActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "like":
        return <ThumbsUp className="h-4 w-4 text-blue-500" />
      case "comment":
        return <MessageSquare className="h-4 w-4 text-green-500" />
      case "share":
        return <Share2 className="h-4 w-4 text-purple-500" />
      case "follow":
        return <Users className="h-4 w-4 text-indigo-500" />
      case "create":
        return <Activity className="h-4 w-4 text-amber-500" />
      case "update":
        return <Clock className="h-4 w-4 text-orange-500" />
      case "favorite":
        return <Star className="h-4 w-4 text-yellow-500" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  // Rendere die Aktivitätsbeschreibung
  const renderActivityDescription = (activity: ActivityItem) => {
    const user = getUserById(activity.userId)

    switch (activity.type) {
      case "like":
        return (
          <>
            <UserLink userId={user.id} username={user.username} /> hat{" "}
            <span className="font-medium">{activity.targetTitle || "einen Beitrag"}</span> geliked
          </>
        )
      case "comment":
        return (
          <>
            <UserLink userId={user.id} username={user.username} /> hat{" "}
            <span className="font-medium">{activity.targetTitle || "einen Beitrag"}</span> kommentiert
          </>
        )
      case "share":
        return (
          <>
            <UserLink userId={user.id} username={user.username} /> hat{" "}
            <span className="font-medium">{activity.targetTitle || "einen Beitrag"}</span> geteilt
          </>
        )
      case "follow":
        return (
          <>
            <UserLink userId={user.id} username={user.username} /> folgt jetzt{" "}
            <span className="font-medium">{activity.targetTitle || "einem Benutzer"}</span>
          </>
        )
      case "create":
        return (
          <>
            <UserLink userId={user.id} username={user.username} /> hat{" "}
            <span className="font-medium">{activity.targetTitle || "einen neuen Beitrag"}</span> erstellt
          </>
        )
      case "update":
        return (
          <>
            <UserLink userId={user.id} username={user.username} /> hat{" "}
            <span className="font-medium">{activity.targetTitle || "einen Beitrag"}</span> aktualisiert
          </>
        )
      case "favorite":
        return (
          <>
            <UserLink userId={user.id} username={user.username} /> hat{" "}
            <span className="font-medium">{activity.targetTitle || "einen Beitrag"}</span> zu Favoriten hinzugefügt
          </>
        )
      default:
        return (
          <>
            <UserLink userId={user.id} username={user.username} /> hat eine Aktion ausgeführt
          </>
        )
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle>Aktivitätsfeed</CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="all">Alle</TabsTrigger>
            <TabsTrigger value="like">Likes</TabsTrigger>
            <TabsTrigger value="comment">Kommentare</TabsTrigger>
            <TabsTrigger value="create">Neu</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <ScrollArea className="h-[400px]">
              {filteredActivities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Keine Aktivitäten gefunden</div>
              ) : (
                <div className="space-y-4">
                  {filteredActivities.map((activity) => {
                    const user = getUserById(activity.userId)

                    return (
                      <div key={activity.id} className="flex items-start space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                          <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center">
                            <Badge variant="outline" className="mr-2">
                              {renderActivityIcon(activity.type)}
                              <span className="ml-1 capitalize">
                                {activity.type === "like"
                                  ? "Like"
                                  : activity.type === "comment"
                                    ? "Kommentar"
                                    : activity.type === "share"
                                      ? "Geteilt"
                                      : activity.type === "follow"
                                        ? "Folgt"
                                        : activity.type === "create"
                                          ? "Neu"
                                          : activity.type === "update"
                                            ? "Update"
                                            : activity.type === "favorite"
                                              ? "Favorit"
                                              : activity.type}
                              </span>
                            </Badge>
                            <span className="text-xs text-muted-foreground">{formatTimestamp(activity.timestamp)}</span>
                          </div>

                          <p className="text-sm">{renderActivityDescription(activity)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
