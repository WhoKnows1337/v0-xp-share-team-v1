"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Download, Calendar, BarChart3, PieChartIcon, Activity } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

// Typdefinitionen
interface UserActivity {
  id: string
  user_id: string
  activity_type: string
  resource_type: string
  resource_id: string
  created_at: string
  metadata: Record<string, any>
}

// Mock-Daten für die Anzeige
const mockActivityData = {
  byType: [
    { name: "Ansicht", value: 145 },
    { name: "Erstellung", value: 32 },
    { name: "Kommentar", value: 78 },
    { name: "Like", value: 96 },
    { name: "Suche", value: 53 },
  ],
  byCategory: [
    { name: "Klartraum", value: 85 },
    { name: "Flugtraum", value: 65 },
    { name: "Nahtoderfahrung", value: 20 },
    { name: "Außerkörperliche Erfahrung", value: 35 },
    { name: "UFO-Sichtung", value: 15 },
    { name: "Déjà-vu", value: 30 },
  ],
  byTime: [
    { name: "00:00", value: 12 },
    { name: "03:00", value: 5 },
    { name: "06:00", value: 8 },
    { name: "09:00", value: 25 },
    { name: "12:00", value: 30 },
    { name: "15:00", value: 45 },
    { name: "18:00", value: 50 },
    { name: "21:00", value: 35 },
  ],
  byDay: [
    { name: "Mo", value: 45 },
    { name: "Di", value: 52 },
    { name: "Mi", value: 38 },
    { name: "Do", value: 41 },
    { name: "Fr", value: 55 },
    { name: "Sa", value: 70 },
    { name: "So", value: 60 },
  ],
}

// Farben für die Charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FF6B6B", "#6B66FF"]

export function ErweiterteAnalytics({ userId }: { userId: string }) {
  const [timeframe, setTimeframe] = useState("7d")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activityData, setActivityData] = useState<typeof mockActivityData | null>(null)

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true)
        // In einer echten Implementierung würden wir hier Supabase verwenden
        // const supabase = getSupabaseClient()
        // const { data, error } = await supabase
        //   .from('user_activity')
        //   .select('*')
        //   .eq('user_id', userId)
        //   .gte('created_at', getTimeframeDate(timeframe))
        //   .order('created_at', { ascending: false })

        // Dann würden wir die Daten für die Charts aufbereiten

        // Für Demo-Zwecke verwenden wir Mock-Daten
        setTimeout(() => {
          setActivityData(mockActivityData)
          setLoading(false)
        }, 1200)
      } catch (err) {
        setError("Fehler beim Laden der Analytics-Daten")
        setLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [userId, timeframe])

  // Hilfsfunktion, um das Datum für den Timeframe zu berechnen
  const getTimeframeDate = (timeframe: string) => {
    const now = new Date()
    switch (timeframe) {
      case "24h":
        return new Date(now.setDate(now.getDate() - 1)).toISOString()
      case "7d":
        return new Date(now.setDate(now.getDate() - 7)).toISOString()
      case "30d":
        return new Date(now.setDate(now.getDate() - 30)).toISOString()
      case "90d":
        return new Date(now.setDate(now.getDate() - 90)).toISOString()
      case "1y":
        return new Date(now.setFullYear(now.getFullYear() - 1)).toISOString()
      default:
        return new Date(now.setDate(now.getDate() - 7)).toISOString()
    }
  }

  const handleExportData = () => {
    // In einer echten Implementierung würden wir hier die Daten exportieren
    console.log("Daten exportieren")
    alert("Die Daten wurden exportiert.")
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Fehler</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Erweiterte Analytics
            </CardTitle>
            <CardDescription>Detaillierte Einblicke in deine Aktivitäten und Interaktionen</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Zeitraum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Letzte 24 Stunden</SelectItem>
                <SelectItem value="7d">Letzte 7 Tage</SelectItem>
                <SelectItem value="30d">Letzte 30 Tage</SelectItem>
                <SelectItem value="90d">Letzte 90 Tage</SelectItem>
                <SelectItem value="1y">Letztes Jahr</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Exportieren
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="aktivitaetstypen">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="aktivitaetstypen" className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Aktivitätstypen</span>
            </TabsTrigger>
            <TabsTrigger value="kategorien" className="flex items-center gap-1">
              <PieChartIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Kategorien</span>
            </TabsTrigger>
            <TabsTrigger value="tageszeit" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Tageszeit</span>
            </TabsTrigger>
            <TabsTrigger value="wochentag" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Wochentag</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="aktivitaetstypen" className="mt-4">
            <div className="h-[400px]">
              <ChartContainer
                config={{
                  value: {
                    label: "Anzahl",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData?.byType} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="value" name="Anzahl" fill="var(--color-value)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Diese Grafik zeigt die Verteilung deiner Aktivitäten nach Typ. Ansichten sind am häufigsten, gefolgt von
              Likes und Kommentaren.
            </p>
          </TabsContent>

          <TabsContent value="kategorien" className="mt-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityData?.byCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {activityData?.byCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} Aktivitäten`, "Anzahl"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Diese Grafik zeigt die Verteilung deiner Aktivitäten nach Kategorien. Klarträume und Flugträume sind die
              beliebtesten Kategorien.
            </p>
          </TabsContent>

          <TabsContent value="tageszeit" className="mt-4">
            <div className="h-[400px]">
              <ChartContainer
                config={{
                  value: {
                    label: "Aktivitäten",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData?.byTime} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="value" name="Aktivitäten" fill="var(--color-value)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Diese Grafik zeigt deine Aktivitäten nach Tageszeit. Du bist am aktivsten am Abend zwischen 18:00 und
              21:00 Uhr.
            </p>
          </TabsContent>

          <TabsContent value="wochentag" className="mt-4">
            <div className="h-[400px]">
              <ChartContainer
                config={{
                  value: {
                    label: "Aktivitäten",
                    color: "hsl(var(--chart-3))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData?.byDay} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="value" name="Aktivitäten" fill="var(--color-value)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Diese Grafik zeigt deine Aktivitäten nach Wochentag. Du bist am aktivsten am Wochenende, besonders am
              Samstag.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Daten für den Zeitraum: {getTimeframeLabel(timeframe)}</span>
        <span>Letzte Aktualisierung: {new Date().toLocaleString("de-DE")}</span>
      </CardFooter>
    </Card>
  )
}

// Hilfsfunktion für Clock-Icon
function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

// Hilfsfunktion für Timeframe-Label
function getTimeframeLabel(timeframe: string) {
  switch (timeframe) {
    case "24h":
      return "Letzte 24 Stunden"
    case "7d":
      return "Letzte 7 Tage"
    case "30d":
      return "Letzte 30 Tage"
    case "90d":
      return "Letzte 90 Tage"
    case "1y":
      return "Letztes Jahr"
    default:
      return "Letzte 7 Tage"
  }
}
