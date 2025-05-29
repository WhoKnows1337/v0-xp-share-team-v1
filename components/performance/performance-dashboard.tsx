"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PerformanceMonitor } from "./performance-monitor"
import { optimizedImageLoader } from "@/lib/optimized-image-loader"
import { performanceService } from "@/lib/performance-service"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Activity, Database, ImageIcon, Trash } from "lucide-react"

export function PerformanceDashboard() {
  const [activeTab, setActiveTab] = useState<string>("metrics")
  const [cacheStats, setCacheStats] = useState({ size: 0 })
  const [performanceEnabled, setPerformanceEnabled] = useState(true)

  // Aktualisiere die Cache-Statistiken regelmäßig
  useEffect(() => {
    const updateCacheStats = () => {
      setCacheStats({
        size: optimizedImageLoader.getCacheSize(),
      })
    }

    updateCacheStats()

    const interval = setInterval(updateCacheStats, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  // Aktiviere/Deaktiviere die Performance-Überwachung
  const togglePerformanceMonitoring = () => {
    performanceService.setEnabled(!performanceEnabled)
    setPerformanceEnabled(!performanceEnabled)
  }

  // Lösche den Bild-Cache
  const clearImageCache = () => {
    optimizedImageLoader.clearCache()
    setCacheStats({ size: 0 })
  }

  // Lösche alle Performance-Metriken
  const clearPerformanceMetrics = () => {
    performanceService.clearMetrics()
  }

  // Dummy-Daten für die Leistungstrends
  const performanceTrendData = [
    { name: "Tag 1", pageLoad: 1200, apiResponse: 350, renderTime: 180 },
    { name: "Tag 2", pageLoad: 1100, apiResponse: 320, renderTime: 170 },
    { name: "Tag 3", pageLoad: 1300, apiResponse: 380, renderTime: 190 },
    { name: "Tag 4", pageLoad: 1000, apiResponse: 300, renderTime: 160 },
    { name: "Tag 5", pageLoad: 950, apiResponse: 280, renderTime: 150 },
    { name: "Tag 6", pageLoad: 900, apiResponse: 260, renderTime: 140 },
    { name: "Tag 7", pageLoad: 850, apiResponse: 240, renderTime: 130 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Performance-Dashboard</h2>
          <p className="text-muted-foreground">Überwache und optimiere die Leistung deiner Anwendung</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant={performanceEnabled ? "default" : "outline"} onClick={togglePerformanceMonitoring}>
            <Activity className="h-4 w-4 mr-2" />
            {performanceEnabled ? "Monitoring aktiv" : "Monitoring inaktiv"}
          </Button>

          <Button variant="outline" onClick={clearPerformanceMetrics}>
            <Trash className="h-4 w-4 mr-2" />
            Metriken zurücksetzen
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="metrics">
            <Activity className="h-4 w-4 mr-2" />
            Performance-Metriken
          </TabsTrigger>
          <TabsTrigger value="cache">
            <Database className="h-4 w-4 mr-2" />
            Cache-Verwaltung
          </TabsTrigger>
          <TabsTrigger value="trends">
            <ImageIcon className="h-4 w-4 mr-2" />
            Leistungstrends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <PerformanceMonitor />
        </TabsContent>

        <TabsContent value="cache" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cache-Verwaltung</CardTitle>
              <CardDescription>Verwalte den Bild-Cache und andere Caching-Mechanismen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Bild-Cache</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{cacheStats.size}</div>
                    <p className="text-xs text-muted-foreground">Bilder im Cache</p>

                    <Button variant="outline" size="sm" className="mt-4" onClick={clearImageCache}>
                      <Trash className="h-3 w-3 mr-2" />
                      Cache leeren
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">API-Cache</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">API-Anfragen im Cache</p>

                    <Button variant="outline" size="sm" className="mt-4" disabled>
                      <Trash className="h-3 w-3 mr-2" />
                      Cache leeren
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Komponenten-Cache</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">Komponenten im Cache</p>

                    <Button variant="outline" size="sm" className="mt-4" disabled>
                      <Trash className="h-3 w-3 mr-2" />
                      Cache leeren
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Cache-Einstellungen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Bild-Cache</h3>
                      <p className="text-xs text-muted-foreground mb-2">Maximale Anzahl an Bildern im Cache</p>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          defaultValue={100}
                          min={10}
                          max={1000}
                        />
                        <Button variant="outline" size="sm">
                          Speichern
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium">API-Cache</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        Maximale Lebensdauer von API-Anfragen im Cache (in Sekunden)
                      </p>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          defaultValue={300}
                          min={10}
                          max={3600}
                        />
                        <Button variant="outline" size="sm">
                          Speichern
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leistungstrends</CardTitle>
              <CardDescription>Verfolge die Leistungstrends deiner Anwendung über Zeit</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  pageLoad: {
                    label: "Seitenladezeit (ms)",
                    color: "hsl(var(--chart-1))",
                  },
                  apiResponse: {
                    label: "API-Antwortzeit (ms)",
                    color: "hsl(var(--chart-2))",
                  },
                  renderTime: {
                    label: "Renderzeit (ms)",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="pageLoad"
                      stroke="var(--color-pageLoad)"
                      name="Seitenladezeit (ms)"
                    />
                    <Line
                      type="monotone"
                      dataKey="apiResponse"
                      stroke="var(--color-apiResponse)"
                      name="API-Antwortzeit (ms)"
                    />
                    <Line
                      type="monotone"
                      dataKey="renderTime"
                      stroke="var(--color-renderTime)"
                      name="Renderzeit (ms)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Durchschnittliche Seitenladezeit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1.05s</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-500">↓ 12%</span> im Vergleich zur Vorwoche
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Durchschnittliche API-Antwortzeit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">304ms</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-500">↓ 8%</span> im Vergleich zur Vorwoche
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Durchschnittliche Renderzeit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">160ms</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-500">↓ 15%</span> im Vergleich zur Vorwoche
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
