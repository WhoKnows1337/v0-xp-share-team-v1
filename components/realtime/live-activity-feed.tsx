"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRealtime } from "@/hooks/use-realtime"
import { Heart, MessageCircle, Star, Users, Trophy, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface LiveActivity {
  id: string
  type: "like" | "comment" | "achievement" | "join" | "experience" | "level_up"
  user: {
    username: string
    avatar?: string
    level: number
  }
  content: string
  timestamp: Date
  metadata?: any
}

export function LiveActivityFeed() {
  const [activities, setActivities] = useState<LiveActivity[]>([])
  const { messages, isConnected } = useRealtime("global_activity")

  // Mock-Aktivitäten für Demo
  useEffect(() => {
    const mockActivities: LiveActivity[] = [
      {
        id: "1",
        type: "experience",
        user: { username: "TraumReisender", avatar: "/philosophical-wanderer.png", level: 12 },
        content: "hat ein neues Erlebnis geteilt: 'Meditation im Schwarzwald'",
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
      },
      {
        id: "2",
        type: "achievement",
        user: { username: "NaturLiebhaber", avatar: "/forest-explorer.png", level: 8 },
        content: "hat das Achievement 'Naturverbunden' freigeschaltet",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
      },
      {
        id: "3",
        type: "level_up",
        user: { username: "StadtEntdecker", avatar: "/confident-leader.png", level: 15 },
        content: "ist auf Level 15 aufgestiegen!",
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
      },
      {
        id: "4",
        type: "like",
        user: { username: "KulturFan", avatar: "/contemplative-woman.png", level: 6 },
        content: "hat 'Pasta-Kochkurs in Rom' geliked",
        timestamp: new Date(Date.now() - 12 * 60 * 1000),
      },
      {
        id: "5",
        type: "comment",
        user: { username: "ReiseGuru", avatar: "/temporal-tourist.png", level: 20 },
        content: "hat einen Kommentar zu 'Segeln an der Adria' hinterlassen",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
      },
    ]

    setActivities(mockActivities)

    // Simuliere neue Aktivitäten alle 30 Sekunden
    const interval = setInterval(() => {
      const newActivity: LiveActivity = {
        id: Date.now().toString(),
        type: ["like", "comment", "experience", "achievement"][Math.floor(Math.random() * 4)] as any,
        user: {
          username: ["NeuerUser", "AktiveMitglied", "ErlebnisJäger"][Math.floor(Math.random() * 3)],
          avatar: "/serene-spirit.png",
          level: Math.floor(Math.random() * 20) + 1,
        },
        content: "hat eine neue Aktivität durchgeführt",
        timestamp: new Date(),
      }

      setActivities((prev) => [newActivity, ...prev.slice(0, 19)]) // Behalte nur die letzten 20
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getActivityIcon = (type: LiveActivity["type"]) => {
    switch (type) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />
      case "comment":
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case "achievement":
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case "join":
        return <Users className="h-4 w-4 text-green-500" />
      case "experience":
        return <Star className="h-4 w-4 text-purple-500" />
      case "level_up":
        return <Zap className="h-4 w-4 text-orange-500" />
      default:
        return <Star className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: LiveActivity["type"]) => {
    switch (type) {
      case "like":
        return "border-l-red-500"
      case "comment":
        return "border-l-blue-500"
      case "achievement":
        return "border-l-yellow-500"
      case "join":
        return "border-l-green-500"
      case "experience":
        return "border-l-purple-500"
      case "level_up":
        return "border-l-orange-500"
      default:
        return "border-l-gray-500"
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Gerade eben"
    if (diffInMinutes < 60) return `vor ${diffInMinutes} Min`
    if (diffInMinutes < 1440) return `vor ${Math.floor(diffInMinutes / 60)} Std`
    return `vor ${Math.floor(diffInMinutes / 1440)} Tag(en)`
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <div className={cn("h-2 w-2 rounded-full", isConnected ? "bg-green-500" : "bg-red-500")} />
          Live-Aktivitäten
          {isConnected && (
            <Badge variant="outline" className="text-xs">
              Live
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-1 p-4 pt-0">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border-l-2 bg-muted/30 hover:bg-muted/50 transition-colors",
                  getActivityColor(activity.type),
                )}
              >
                <Avatar className="h-8 w-8 mt-0.5">
                  <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.username} />
                  <AvatarFallback>{activity.user.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getActivityIcon(activity.type)}
                    <span className="font-medium text-sm">{activity.user.username}</span>
                    <Badge variant="secondary" className="text-xs">
                      Lvl {activity.user.level}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{activity.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatTimeAgo(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
