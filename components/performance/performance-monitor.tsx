"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { usePerformanceMetrics } from "@/hooks/use-performance"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Activity, RefreshCw, Trash } from "lucide-react"

export function PerformanceMonitor() {
  const { getAllMetrics, clearMetrics } = usePerformanceMetrics()
  const [metrics, setMetrics] = useState<Record<string, { min: number; max: number; avg: number; count: number }>>({})
  const [activeTab, setActiveTab] = useState<string>("render")

  // Aktualisiere die Metriken regelmäßig
  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(getAllMetrics())
    }

    updateMetrics()

    const interval = setInterval(updateMetrics, 2000)

    return () => {
      clearInterval(interval)
    }
  }, [getAllMetrics])

  // Filtere die Metriken basierend auf dem aktiven Tab
  const filteredMetrics = Object.entries(metrics)
    .filter(([key]) => {
      if (activeTab === "render") return key.startsWith("render:")
      if (activeTab === "resource") return key.startsWith("resource:")
      return !key.startsWith("render:") && !key.startsWith("resource:")
    })
    .map(([key, value]) => ({
      name: key.replace(/^(render:|resource:)/, ""),
      min: Math.round(value.min * 100) / 100,
      avg: Math.round(value.avg * 100) / 100,
      max: Math.round(value.max * 100) / 100,
      count: value.count,
    }))

  // Aktualisiere die Metriken manuell
  const handleRefresh = () => {
    setMetrics(getAllMetrics())
  }

  // Lösche alle Metriken
  const handleClear = () => {
    clearMetrics()
    setMetrics({})
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Performance-Monitor
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Aktualisieren
            </Button>
            <Button variant="outline" size="sm" onClick={handleClear}>
              <Trash className="h-4 w-4 mr-2" />
              Zurücksetzen
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="render">Render-Zeiten</TabsTrigger>
            <TabsTrigger value="resource">Ressourcen-Ladezeiten</TabsTrigger>
            <TabsTrigger value="custom">Benutzerdefinierte Metriken</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredMetrics.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Keine Metriken verfügbar</div>
            ) : (
              <div className="space-y-4">
                <ChartContainer
                  config={{
                    min: {
                      label: "Min (ms)",
                      color: "hsl(var(--chart-1))",
                    },
                    avg: {
                      label: "Durchschnitt (ms)",
                      color: "hsl(var(--chart-2))",
                    },
                    max: {
                      label: "Max (ms)",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredMetrics} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="min" fill="var(--color-min)" name="Min (ms)" />
                      <Bar dataKey="avg" fill="var(--color-avg)" name="Durchschnitt (ms)" />
                      <Bar dataKey="max" fill="var(--color-max)" name="Max (ms)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMetrics.map((metric) => (
                    <Card key={metric.name} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Min:</p>
                            <p className="font-medium">{metric.min} ms</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Max:</p>
                            <p className="font-medium">{metric.max} ms</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Durchschnitt:</p>
                            <p className="font-medium">{metric.avg} ms</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Anzahl:</p>
                            <p className="font-medium">{metric.count}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
