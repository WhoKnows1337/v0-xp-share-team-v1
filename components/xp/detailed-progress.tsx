"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BarChart, LineChart, PieChart } from "lucide-react"

interface ProgressData {
  label: string
  current: number
  total: number
  percentage: number
  history?: { date: string; value: number }[]
}

interface DetailedProgressProps {
  data: ProgressData[]
  title?: string
  description?: string
}

export function DetailedProgress({ data, title = "Fortschritt", description }: DetailedProgressProps) {
  const [activeTab, setActiveTab] = useState("list")

  // Berechne den Gesamtfortschritt
  const totalProgress = data.reduce((acc, item) => acc + item.percentage, 0) / data.length

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Gesamtfortschritt</h3>
              <div className="flex items-center space-x-2">
                <Progress value={totalProgress} className="h-2 w-40" />
                <span className="text-sm text-muted-foreground">{Math.round(totalProgress)}%</span>
              </div>
            </div>
            <TabsList>
              <TabsTrigger value="list">
                <BarChart className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="chart">
                <LineChart className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="pie">
                <PieChart className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="list" className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{item.label}</span>
                  <span>
                    {item.current} / {item.total}
                  </span>
                </div>
                <Progress value={item.percentage} />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="chart">
            <div className="h-[200px] w-full flex items-center justify-center border rounded-md p-4">
              <div className="text-center text-muted-foreground">
                <LineChart className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>Fortschrittsverlauf</p>
                <p className="text-xs">(Diagramm-Visualisierung)</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pie">
            <div className="h-[200px] w-full flex items-center justify-center border rounded-md p-4">
              <div className="text-center text-muted-foreground">
                <PieChart className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>Fortschrittsverteilung</p>
                <p className="text-xs">(Kreisdiagramm-Visualisierung)</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
