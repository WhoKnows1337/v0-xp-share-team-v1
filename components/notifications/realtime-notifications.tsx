"use client"

import { useState } from "react"
import { useRealtimeChannel } from "@/hooks/use-realtime"
import { Bell, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser } from "@/lib/mock-users"
import { toast } from "@/hooks/use-toast"

interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  timestamp: string
}

export function RealtimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const currentUser = getCurrentUser()

  // Abonniere den Benachrichtigungskanal für den aktuellen Benutzer
  useRealtimeChannel<Notification>(`notifications:${currentUser.id}`, "new-notification", {
    onData: (notification) => {
      // Füge die neue Benachrichtigung hinzu
      setNotifications((prev) => [notification, ...prev])

      // Zeige einen Toast an
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.type === "error" ? "destructive" : "default",
      })
    },
  })

  // Formatiere den Zeitstempel
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return (
      date.toLocaleDateString([], { day: "2-digit", month: "2-digit", year: "numeric" }) +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    )
  }

  // Markiere eine Benachrichtigung als gelesen
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // Markiere alle Benachrichtigungen als gelesen
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  // Lösche eine Benachrichtigung
  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  // Zähle ungelesene Benachrichtigungen
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
            variant="destructive"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {showNotifications && (
        <Card className="absolute right-0 mt-2 w-80 z-50">
          <CardContent className="p-0">
            <div className="p-2 border-b flex items-center justify-between">
              <h3 className="font-medium">Benachrichtigungen</h3>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Alle lesen
                </Button>
              )}
            </div>

            <div className="max-h-80 overflow-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">Keine Benachrichtigungen</div>
              ) : (
                <div>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b last:border-b-0 ${!notification.read ? "bg-muted/50" : ""}`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <div className="flex items-center space-x-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatTimestamp(notification.timestamp)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
