"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RealtimeChat } from "@/components/chat/realtime-chat"
import { RealtimeNotifications } from "@/components/notifications/realtime-notifications"
import { RealtimeActivityFeed } from "@/components/activity/realtime-activity-feed"
import { RealtimeCollaboration } from "@/components/collaboration/realtime-collaboration"
import { Button } from "@/components/ui/button"
import { useBroadcast } from "@/hooks/use-realtime"
import { getCurrentUser } from "@/lib/mock-users"
import { Bell, MessageSquare, Users, FileEdit } from "lucide-react"

export default function RealtimeDemoPage() {
  const [activeTab, setActiveTab] = useState("chat")
  const { broadcast } = useBroadcast()
  const currentUser = getCurrentUser()

  // Sende eine Test-Benachrichtigung
  const sendTestNotification = () => {
    const notification = {
      id: `notification-${Date.now()}`,
      userId: currentUser.id,
      title: "Test-Benachrichtigung",
      message: "Dies ist eine Test-Benachrichtigung, die über Supabase Realtime gesendet wurde.",
      type: "info",
      read: false,
      timestamp: new Date().toISOString(),
    }

    broadcast(`notifications:${currentUser.id}`, "new-notification", notification)
  }

  // Sende eine Test-Aktivität
  const sendTestActivity = () => {
    const activity = {
      id: `activity-${Date.now()}`,
      userId: currentUser.id,
      type: "create",
      targetId: `target-${Date.now()}`,
      targetType: "erlebnis",
      targetTitle: "Test-Erlebnis",
      timestamp: new Date().toISOString(),
    }

    broadcast("activities", "INSERT", { new: activity })
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Echtzeit-Funktionalität Demo</h1>
      <p className="text-muted-foreground mb-8">
        Diese Seite demonstriert die Echtzeit-Funktionalität mit Supabase Realtime.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="chat">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Users className="h-4 w-4 mr-2" />
                Aktivitäten
              </TabsTrigger>
              <TabsTrigger value="collaboration">
                <FileEdit className="h-4 w-4 mr-2" />
                Kollaboration
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Benachrichtigungen
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-4">
              <RealtimeChat channelId="demo-channel" title="Demo-Chat" />
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Aktivitäten-Demo</CardTitle>
                  <CardDescription>
                    Hier kannst du Test-Aktivitäten senden, um den Echtzeit-Aktivitätsfeed zu testen.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={sendTestActivity}>Test-Aktivität senden</Button>
                </CardContent>
              </Card>

              <RealtimeActivityFeed />
            </TabsContent>

            <TabsContent value="collaboration" className="space-y-4">
              <RealtimeCollaboration
                documentId="demo-document"
                initialContent="Dies ist ein kollaboratives Dokument. Mehrere Benutzer können gleichzeitig daran arbeiten."
              />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Benachrichtigungen-Demo</CardTitle>
                  <CardDescription>
                    Hier kannst du Test-Benachrichtigungen senden, um die Echtzeit-Benachrichtigungen zu testen.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={sendTestNotification}>Test-Benachrichtigung senden</Button>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <RealtimeNotifications />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Echtzeit-Features</CardTitle>
              <CardDescription>Übersicht der implementierten Echtzeit-Funktionen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Chat</h3>
                <p className="text-sm text-muted-foreground">Echtzeit-Chat mit Supabase Realtime Channels</p>
              </div>

              <div>
                <h3 className="font-medium">Aktivitätsfeed</h3>
                <p className="text-sm text-muted-foreground">Echtzeit-Updates für Benutzeraktivitäten</p>
              </div>

              <div>
                <h3 className="font-medium">Kollaboration</h3>
                <p className="text-sm text-muted-foreground">Kollaboratives Bearbeiten von Dokumenten</p>
              </div>

              <div>
                <h3 className="font-medium">Benachrichtigungen</h3>
                <p className="text-sm text-muted-foreground">Echtzeit-Benachrichtigungen für Benutzer</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
