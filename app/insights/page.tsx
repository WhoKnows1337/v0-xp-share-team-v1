import type { Metadata } from "next"
import { EinblickeTrends } from "@/components/dashboard/einblicke-trends"
import { WorldMapHeatmap } from "@/components/dashboard/world-map-heatmap"
import { CategoryPieChart } from "@/components/dashboard/category-pie-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, BarChart, TrendingUp } from "lucide-react"

export const metadata: Metadata = {
  title: "Insights & Trends | XP Share",
  description: "Entdecke Muster und Trends in den Erlebnissen der Community",
}

export default function InsightsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Einblicke & Trends</h1>
          <p className="text-muted-foreground">Entdecke Muster und Trends in den Erlebnissen der Community</p>
        </div>

        <Tabs defaultValue="uebersicht" className="space-y-4">
          <TabsList>
            <TabsTrigger value="uebersicht">Übersicht</TabsTrigger>
            <TabsTrigger value="statistiken">Statistiken</TabsTrigger>
            <TabsTrigger value="detailanalyse">Detailanalyse</TabsTrigger>
          </TabsList>

          <TabsContent value="uebersicht" className="space-y-4">
            <EinblickeTrends />
          </TabsContent>

          <TabsContent value="statistiken" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <CategoryPieChart />
              <WorldMapHeatmap />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-blue-500" />
                  Zeitlicher Verlauf
                </CardTitle>
                <CardDescription>Anzahl der Erlebnisberichte pro Monat</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full bg-muted rounded-md p-4 flex flex-col justify-between">
                  <div className="text-sm font-medium">Anzahl der Erlebnisse pro Monat</div>
                  <div className="flex-1 flex items-end gap-2 mt-4">
                    {[45, 62, 58, 70, 85, 78, 92, 105, 98, 120, 115, 130].map((value, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-blue-500 rounded-t" style={{ height: `${value / 1.5}%` }}></div>
                        <div className="text-xs mt-1">{i + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-2">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  KI-generierte Analyse, kann Fehler enthalten.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detailanalyse" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="mr-2 h-5 w-5 text-green-500" />
                  Top 10 Tags
                </CardTitle>
                <CardDescription>Die häufigsten Tags in allen Erlebnissen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Licht", count: 428, percentage: 85 },
                    { name: "Traum", count: 392, percentage: 78 },
                    { name: "Energie", count: 356, percentage: 71 },
                    { name: "Bewusstsein", count: 312, percentage: 62 },
                    { name: "Zeit", count: 285, percentage: 57 },
                    { name: "Meditation", count: 264, percentage: 53 },
                    { name: "Natur", count: 235, percentage: 47 },
                    { name: "Intuition", count: 214, percentage: 43 },
                    { name: "Synchronizität", count: 198, percentage: 40 },
                    { name: "Heilung", count: 176, percentage: 35 },
                  ].map((tag) => (
                    <div key={tag.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{tag.name}</span>
                        <span className="text-sm text-muted-foreground">{tag.count} Erlebnisse</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-green-300"
                          style={{ width: `${tag.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
