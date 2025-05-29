"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PerformanceDashboard } from "@/components/performance/performance-dashboard"
import { OptimizedImage } from "@/components/optimized/optimized-image"
import { usePerformanceMeasure, useResourceLoad } from "@/hooks/use-performance"
import { Activity, ImageIcon, RefreshCw } from "lucide-react"

export default function PerformanceDemoPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [loadTimes, setLoadTimes] = useState<Record<string, number>>({})
  const { mark, measure } = usePerformanceMeasure()
  const { measureResourceLoad } = useResourceLoad()

  // Bilder für den Test
  const testImages = [
    "/abstract-geometric-shapes.png",
    "/abstract-ms-flow.png",
    "/black-forest-valley.png",
    "/italian-feast.png",
    "/abstract-jb.png",
    "/Elbphilharmonie-modern-maritime.png",
    "/barcelona-cityscape.png",
    "/sailing-adriatic-coast.png",
  ]

  // Lade die Bilder und messe die Ladezeit
  const loadImage = (src: string) => {
    mark(`start-${src}`)

    measureResourceLoad(src, (duration) => {
      setLoadTimes((prev) => ({
        ...prev,
        [src]: duration,
      }))

      measure(`load-${src}`, `start-${src}`)
    })
  }

  // Lade alle Bilder
  const loadAllImages = () => {
    testImages.forEach((src) => {
      loadImage(src)
    })
  }

  // Lösche alle Ladezeiten
  const clearLoadTimes = () => {
    setLoadTimes({})
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Performance-Optimierung Demo</h1>
      <p className="text-muted-foreground mb-8">
        Diese Seite demonstriert die Performance-Optimierungen der Anwendung.
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="dashboard">
            <Activity className="h-4 w-4 mr-2" />
            Performance-Dashboard
          </TabsTrigger>
          <TabsTrigger value="images">
            <ImageIcon className="h-4 w-4 mr-2" />
            Optimierte Bilder
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <PerformanceDashboard />
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Optimierte Bilder</CardTitle>
                  <CardDescription>Teste die Leistung des optimierten Bild-Ladens</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={loadAllImages}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Alle Bilder laden
                  </Button>
                  <Button variant="outline" onClick={clearLoadTimes}>
                    Zurücksetzen
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {testImages.map((src) => (
                  <Card key={src} className="overflow-hidden">
                    <div className="aspect-video relative">
                      <OptimizedImage
                        src={src}
                        alt="Test-Bild"
                        className="object-cover w-full h-full"
                        onLoad={(duration) => {
                          setLoadTimes((prev) => ({
                            ...prev,
                            [src]: duration,
                          }))
                        }}
                      />
                    </div>
                    <CardContent className="p-4">
                      <p className="text-sm font-medium truncate">{src.split("/").pop()}</p>
                      <p className="text-xs text-muted-foreground">
                        Ladezeit: {loadTimes[src] ? `${Math.round(loadTimes[src])}ms` : "Nicht geladen"}
                      </p>
                      <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => loadImage(src)}>
                        Neu laden
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
