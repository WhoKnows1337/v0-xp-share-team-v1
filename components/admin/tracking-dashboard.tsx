"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { trackingService, type TrackingEvent } from "@/lib/tracking-service"
import {
  BarChart,
  LineChart,
  PieChart,
  Pie,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  Cell,
  ResponsiveContainer,
} from "recharts"

// Mock-Daten für Charts
const pageViewData = [
  { name: "Startseite", views: 1245 },
  { name: "Dashboard", views: 987 },
  { name: "Entdecken", views: 1432 },
  { name: "Erlebnis-Details", views: 2341 },
  { name: "Profil", views: 654 },
  { name: "XP-Buch", views: 432 },
]

const userActivityData = [
  { name: "Mo", aktiveNutzer: 120, neueNutzer: 15 },
  { name: "Di", aktiveNutzer: 132, neueNutzer: 12 },
  { name: "Mi", aktiveNutzer: 145, neueNutzer: 18 },
  { name: "Do", aktiveNutzer: 132, neueNutzer: 14 },
  { name: "Fr", aktiveNutzer: 165, neueNutzer: 21 },
  { name: "Sa", aktiveNutzer: 187, neueNutzer: 25 },
  { name: "So", aktiveNutzer: 172, neueNutzer: 17 },
]

const categoryData = [
  { name: "Träume", value: 35 },
  { name: "Meditation", value: 25 },
  { name: "Synchronizität", value: 15 },
  { name: "Déjà-vu", value: 10 },
  { name: "Außerkörperlich", value: 8 },
  { name: "Andere", value: 7 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

export function TrackingDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [recentEvents, setRecentEvents] = useState<TrackingEvent[]>([])

  // Lade die letzten Events
  useEffect(() => {
    // In einer echten Implementierung würden wir hier Daten vom Server laden
    // Für die Demo verwenden wir die lokalen Events
    setRecentEvents(trackingService.getEvents().slice(-10).reverse())

    // Aktualisiere die Events alle 5 Sekunden
    const interval = setInterval(() => {
      setRecentEvents(trackingService.getEvents().slice(-10).reverse())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tracking & Metriken</h1>
        <div className="flex gap-2">
          <Button variant="outline">Exportieren</Button>
          <Button>Zeitraum: Letzte 7 Tage</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="users">Nutzer</TabsTrigger>
          <TabsTrigger value="content">Inhalte</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI-Karten */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Seitenaufrufe</CardTitle>
                <CardDescription>Letzte 7 Tage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,543</div>
                <p className="text-xs text-muted-foreground">+15.3% im Vergleich zur Vorwoche</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Aktive Nutzer</CardTitle>
                <CardDescription>Letzte 7 Tage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,432</div>
                <p className="text-xs text-muted-foreground">+8.2% im Vergleich zur Vorwoche</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Neue Erlebnisse</CardTitle>
                <CardDescription>Letzte 7 Tage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">287</div>
                <p className="text-xs text-muted-foreground">+12.7% im Vergleich zur Vorwoche</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Engagement-Rate</CardTitle>
                <CardDescription>Likes, Kommentare, Shares</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24.8%</div>
                <p className="text-xs text-muted-foreground">+3.1% im Vergleich zur Vorwoche</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Seitenaufrufe nach Seite</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pageViewData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="views" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nutzeraktivität</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="aktiveNutzer" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="neueNutzer" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Erlebnisse nach Kategorie</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Letzte Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-80 overflow-auto">
                  {recentEvents.map((event, index) => (
                    <div key={index} className="p-2 bg-muted rounded-md text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">{event.type}</span>
                        <span className="text-muted-foreground">{new Date(event.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {event.userId ? `User: ${event.userId}` : "Anonym"} | Session: {event.sessionId.substring(0, 8)}
                        ...
                      </div>
                      {event.data && (
                        <pre className="text-xs mt-1 bg-background p-1 rounded overflow-x-auto">
                          {JSON.stringify(event.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}

                  {recentEvents.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">Keine Events vorhanden</div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Alle Events anzeigen
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Nutzer-Metriken</CardTitle>
              <CardDescription>Detaillierte Informationen über Nutzeraktivitäten</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Dieser Bereich würde detaillierte Nutzermetriken enthalten, wie z.B. Demografie, Geräte, Verweildauer,
                Konversionsraten, etc.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Inhalts-Metriken</CardTitle>
              <CardDescription>Detaillierte Informationen über Inhaltsperformance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Dieser Bereich würde detaillierte Inhaltsmetriken enthalten, wie z.B. beliebteste Erlebnisse,
                Engagement-Raten, Verweildauer pro Erlebnis, etc.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Event-Log</CardTitle>
              <CardDescription>Detaillierte Aufzeichnung aller Tracking-Events</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Dieser Bereich würde ein vollständiges Log aller Tracking-Events enthalten, mit Filtermöglichkeiten und
                Exportfunktionen.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
