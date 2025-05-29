"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Bell, AlertTriangle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function MonitoringDashboard() {
  const [activeTab, setActiveTab] = useState("performance")

  // Beispiel-Daten für die Performance-Metriken
  const performanceData = [
    { time: "00:00", responseTime: 120, serverLoad: 25, errorRate: 0.2 },
    { time: "02:00", responseTime: 132, serverLoad: 28, errorRate: 0.3 },
    { time: "04:00", responseTime: 125, serverLoad: 30, errorRate: 0.1 },
    { time: "06:00", responseTime: 140, serverLoad: 35, errorRate: 0.4 },
    { time: "08:00", responseTime: 160, serverLoad: 45, errorRate: 0.6 },
    { time: "10:00", responseTime: 170, serverLoad: 50, errorRate: 0.5 },
    { time: "12:00", responseTime: 180, serverLoad: 55, errorRate: 0.7 },
    { time: "14:00", responseTime: 175, serverLoad: 52, errorRate: 0.6 },
    { time: "16:00", responseTime: 165, serverLoad: 48, errorRate: 0.5 },
    { time: "18:00", responseTime: 150, serverLoad: 40, errorRate: 0.4 },
    { time: "20:00", responseTime: 140, serverLoad: 35, errorRate: 0.3 },
    { time: "22:00", responseTime: 130, serverLoad: 30, errorRate: 0.2 },
  ]

  // Beispiel-Daten für die Benutzeraktivität
  const userActivityData = [
    { time: "00:00", activeUsers: 25, newUsers: 2, sessions: 30 },
    { time: "02:00", activeUsers: 20, newUsers: 1, sessions: 25 },
    { time: "04:00", activeUsers: 15, newUsers: 0, sessions: 18 },
    { time: "06:00", activeUsers: 30, newUsers: 3, sessions: 35 },
    { time: "08:00", activeUsers: 80, newUsers: 8, sessions: 95 },
    { time: "10:00", activeUsers: 120, newUsers: 12, sessions: 140 },
    { time: "12:00", activeUsers: 150, newUsers: 15, sessions: 180 },
    { time: "14:00", activeUsers: 140, newUsers: 10, sessions: 165 },
    { time: "16:00", activeUsers: 130, newUsers: 8, sessions: 150 },
    { time: "18:00", activeUsers: 100, newUsers: 5, sessions: 120 },
    { time: "20:00", activeUsers: 70, newUsers: 4, sessions: 85 },
    { time: "22:00", activeUsers: 40, newUsers: 3, sessions: 50 },
  ]

  // Beispiel-Fehler
  const errors = [
    {
      id: "1",
      message: "Fehler beim Laden der Benutzerdaten",
      count: 5,
      lastOccurred: "vor 15 Minuten",
      status: "active",
    },
    {
      id: "2",
      message: "Datenbankverbindung fehlgeschlagen",
      count: 2,
      lastOccurred: "vor 1 Stunde",
      status: "resolved",
    },
    {
      id: "3",
      message: "API-Anfrage-Timeout",
      count: 8,
      lastOccurred: "vor 30 Minuten",
      status: "active",
    },
    {
      id: "4",
      message: "Fehler beim Hochladen von Bildern",
      count: 3,
      lastOccurred: "vor 2 Stunden",
      status: "investigating",
    },
  ]

  // Beispiel-Benachrichtigungen
  const alerts = [
    {
      id: "1",
      message: "Hohe CPU-Auslastung",
      level: "warning",
      time: "vor 10 Minuten",
    },
    {
      id: "2",
      message: "Speichernutzung über 80%",
      level: "warning",
      time: "vor 25 Minuten",
    },
    {
      id: "3",
      message: "Datenbank-Verbindungspool fast erschöpft",
      level: "critical",
      time: "vor 5 Minuten",
    },
    {
      id: "4",
      message: "API-Antwortzeit über Schwellenwert",
      level: "info",
      time: "vor 1 Stunde",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Monitoring-Dashboard</h2>
          <p className="text-muted-foreground">Überwache die Leistung und Aktivität deiner Anwendung</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Benachrichtigungen
          </Button>
          <Button>
            <Activity className="h-4 w-4 mr-2" />
            Live-Monitoring
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Antwortzeit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142ms</div>
            <p className="text-xs text-muted-foreground">Durchschnittliche Antwortzeit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fehlerrate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.4%</div>
            <p className="text-xs text-muted-foreground">Durchschnittliche Fehlerrate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aktive Benutzer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">Aktive Benutzer in den letzten 24 Stunden</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Server-Auslastung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42%</div>
            <p className="text-xs text-muted-foreground">Durchschnittliche CPU-Auslastung</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="users">Benutzeraktivität</TabsTrigger>
          <TabsTrigger value="errors">Fehler</TabsTrigger>
          <TabsTrigger value="alerts">Warnungen</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance-Metriken</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded">
                <p className="text-muted-foreground">Performance-Diagramm (Platzhalter)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Benutzeraktivität</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded">
                <p className="text-muted-foreground">Benutzeraktivitäts-Diagramm (Platzhalter)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fehlerübersicht</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {errors.map((error) => (
                  <div key={error.id} className="flex items-center justify-between p-4 border rounded">
                    <div className="flex items-center gap-4">
                      <AlertTriangle
                        className={`h-5 w-5 ${error.status === "active" ? "text-red-500" : error.status === "investigating" ? "text-amber-500" : "text-green-500"}`}
                      />
                      <div>
                        <p className="font-medium">{error.message}</p>
                        <p className="text-sm text-muted-foreground">Zuletzt aufgetreten: {error.lastOccurred}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{error.count}x</p>
                      <p className="text-sm text-muted-foreground">{error.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Warnungen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border rounded">
                    <div className="flex items-center gap-4">
                      <AlertTriangle
                        className={`h-5 w-5 ${alert.level === "critical" ? "text-red-500" : alert.level === "warning" ? "text-amber-500" : "text-blue-500"}`}
                      />
                      <div>
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-sm text-muted-foreground">{alert.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium uppercase">{alert.level}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
