"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Settings, Trash2, BookMarkedIcon as MarkAsRead, Filter } from "lucide-react"
import { usePushNotifications } from "@/lib/notifications/push-service"

interface Notification {
  id: string
  title: string
  body: string
  type: "experience" | "comment" | "like" | "achievement" | "quest" | "system"
  timestamp: Date
  read: boolean
  data?: any
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Neues Erlebnis geteilt",
    body: "Max Mustermann hat 'Sonnenuntergang am Strand' geteilt",
    type: "experience",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
  },
  {
    id: "2",
    title: "Achievement freigeschaltet!",
    body: "Du hast 'Erster Kommentar' erreicht und 50 XP erhalten!",
    type: "achievement",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
  },
  {
    id: "3",
    title: "Neuer Kommentar",
    body: "Anna Schmidt hat dein Erlebnis 'Bergwanderung' kommentiert",
    type: "comment",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    read: true,
  },
]

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<"all" | "unread">("all")
  const [settings, setSettings] = useState({
    experiences: true,
    comments: true,
    likes: true,
    achievements: true,
    quests: true,
    system: true,
  })

  const { isSupported, permission, isSubscribed, requestPermission, subscribe, unsubscribe } = usePushNotifications()

  const unreadCount = notifications.filter((n) => !n.read).length
  const filteredNotifications = filter === "unread" ? notifications.filter((n) => !n.read) : notifications

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "experience":
        return "📝"
      case "comment":
        return "💬"
      case "like":
        return "❤️"
      case "achievement":
        return "🏆"
      case "quest":
        return "⚔️"
      case "system":
        return "⚙️"
      default:
        return "📢"
    }
  }

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "experience":
        return "bg-blue-500"
      case "comment":
        return "bg-green-500"
      case "like":
        return "bg-red-500"
      case "achievement":
        return "bg-yellow-500"
      case "quest":
        return "bg-purple-500"
      case "system":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) return `vor ${minutes} Min`
    if (hours < 24) return `vor ${hours} Std`
    return `vor ${days} Tag${days > 1 ? "en" : ""}`
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handlePushToggle = async () => {
    if (isSubscribed) {
      await unsubscribe()
    } else {
      if (permission !== "granted") {
        const granted = await requestPermission()
        if (!granted) return
      }
      await subscribe()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Benachrichtigungen
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground">Verwalte deine Benachrichtigungen und Einstellungen</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setFilter(filter === "all" ? "unread" : "all")}>
            <Filter className="h-4 w-4 mr-2" />
            {filter === "all" ? "Alle" : "Ungelesen"}
          </Button>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <MarkAsRead className="h-4 w-4 mr-2" />
              Alle als gelesen markieren
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList>
          <TabsTrigger value="notifications">Benachrichtigungen</TabsTrigger>
          <TabsTrigger value="settings">Einstellungen</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {filter === "unread" ? "Keine ungelesenen Benachrichtigungen" : "Keine Benachrichtigungen"}
                </h3>
                <p className="text-muted-foreground text-center">
                  {filter === "unread"
                    ? "Alle Benachrichtigungen wurden gelesen."
                    : "Du hast noch keine Benachrichtigungen erhalten."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all duration-200 ${!notification.read ? "border-primary bg-primary/5" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">{getNotificationIcon(notification.type)}</div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground">{notification.body}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={`${getTypeColor(notification.type)} text-white`}>
                            {notification.type}
                          </Badge>
                          {!notification.read && <div className="h-2 w-2 bg-primary rounded-full" />}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{formatTimestamp(notification.timestamp)}</span>

                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                              Als gelesen markieren
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Push-Benachrichtigungen
              </CardTitle>
              <CardDescription>Erhalte Benachrichtigungen auch wenn die App geschlossen ist</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isSupported ? (
                <div className="text-sm text-muted-foreground">
                  Push-Benachrichtigungen werden von deinem Browser nicht unterstützt.
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Push-Benachrichtigungen</div>
                    <div className="text-sm text-muted-foreground">
                      Status:{" "}
                      {permission === "granted"
                        ? "Erlaubt"
                        : permission === "denied"
                          ? "Blockiert"
                          : "Nicht festgelegt"}
                    </div>
                  </div>
                  <Switch
                    checked={isSubscribed}
                    onCheckedChange={handlePushToggle}
                    disabled={permission === "denied"}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Benachrichtigungstypen</CardTitle>
              <CardDescription>Wähle aus, welche Arten von Benachrichtigungen du erhalten möchtest</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium capitalize">
                      {key === "experiences"
                        ? "Neue Erlebnisse"
                        : key === "comments"
                          ? "Kommentare"
                          : key === "likes"
                            ? "Likes"
                            : key === "achievements"
                              ? "Achievements"
                              : key === "quests"
                                ? "Quests"
                                : "System"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getNotificationIcon(key as any)} Benachrichtigungen für {key}
                    </div>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, [key]: checked }))}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
