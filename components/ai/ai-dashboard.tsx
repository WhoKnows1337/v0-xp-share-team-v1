"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Database,
  Zap,
  BarChart3,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Loader2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AIStats {
  embeddings: {
    total: number
    pending: number
    failed: number
  }
  clusters: {
    total: number
    lastUpdate: string
  }
  cache: {
    hitRate: number
    size: number
  }
  processing: {
    isRunning: boolean
    queueSize: number
  }
}

export function AIDashboard() {
  const [stats, setStats] = useState<AIStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadStats()
    const interval = setInterval(loadStats, 30000) // Update alle 30 Sekunden
    return () => clearInterval(interval)
  }, [])

  const loadStats = async () => {
    try {
      // Mock-Daten für Demo
      const mockStats: AIStats = {
        embeddings: {
          total: 1247,
          pending: 23,
          failed: 2,
        },
        clusters: {
          total: 8,
          lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 Stunden ago
        },
        cache: {
          hitRate: 0.87,
          size: 156,
        },
        processing: {
          isRunning: true,
          queueSize: 23,
        },
      }

      setStats(mockStats)
    } catch (error) {
      console.error("Fehler beim Laden der AI-Statistiken:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProcessQueue = async () => {
    setIsProcessing(true)
    try {
      // Simuliere Verarbeitung
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Queue verarbeitet",
        description: "Alle ausstehenden Embeddings wurden verarbeitet",
      })

      await loadStats()
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Beim Verarbeiten der Queue ist ein Fehler aufgetreten",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClearCache = async () => {
    try {
      // Simuliere Cache-Clearing
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Cache geleert",
        description: "Alle AI-Caches wurden erfolgreich geleert",
      })

      await loadStats()
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Beim Leeren des Caches ist ein Fehler aufgetreten",
        variant: "destructive",
      })
    }
  }

  const handleRecalculateClusters = async () => {
    try {
      // Simuliere Clustering
      await new Promise((resolve) => setTimeout(resolve, 3000))

      toast({
        title: "Clustering abgeschlossen",
        description: "Neue Cluster wurden erfolgreich berechnet",
      })

      await loadStats()
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Beim Berechnen der Cluster ist ein Fehler aufgetreten",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p>Fehler beim Laden der AI-Statistiken</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="h-8 w-8 text-purple-500" />
            AI-Dashboard
          </h1>
          <p className="text-muted-foreground">Überwache und verwalte alle AI-Features</p>
        </div>
        <Button onClick={loadStats} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Aktualisieren
        </Button>
      </div>

      {/* Status-Übersicht */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Embeddings</p>
                <p className="text-2xl font-bold">{stats.embeddings.total.toLocaleString()}</p>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant={stats.embeddings.pending > 0 ? "secondary" : "outline"} className="text-xs">
                {stats.embeddings.pending} ausstehend
              </Badge>
              {stats.embeddings.failed > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {stats.embeddings.failed} fehlgeschlagen
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cluster</p>
                <p className="text-2xl font-bold">{stats.clusters.total}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Zuletzt: {new Date(stats.clusters.lastUpdate).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cache Hit-Rate</p>
                <p className="text-2xl font-bold">{Math.round(stats.cache.hitRate * 100)}%</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
            <Progress value={stats.cache.hitRate * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verarbeitung</p>
                <div className="flex items-center gap-2">
                  {stats.processing.isRunning ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">{stats.processing.isRunning ? "Aktiv" : "Gestoppt"}</span>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{stats.processing.queueSize} in Queue</p>
          </CardContent>
        </Card>
      </div>

      {/* Detaillierte Verwaltung */}
      <Tabs defaultValue="embeddings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="embeddings">Embeddings</TabsTrigger>
          <TabsTrigger value="clustering">Clustering</TabsTrigger>
          <TabsTrigger value="cache">Cache</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="embeddings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Embedding-Verarbeitung</CardTitle>
              <CardDescription>Verwalte die Verarbeitung von Text-Embeddings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Verarbeitungs-Queue</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.processing.queueSize} Elemente warten auf Verarbeitung
                  </p>
                </div>
                <Button onClick={handleProcessQueue} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verarbeite...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Queue verarbeiten
                    </>
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">{stats.embeddings.total}</p>
                  <p className="text-sm text-muted-foreground">Gesamt</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{stats.embeddings.pending}</p>
                  <p className="text-sm text-muted-foreground">Ausstehend</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{stats.embeddings.failed}</p>
                  <p className="text-sm text-muted-foreground">Fehlgeschlagen</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clustering" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clustering-Verwaltung</CardTitle>
              <CardDescription>Verwalte die automatische Gruppierung von Inhalten</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Aktuelle Cluster</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.clusters.total} Cluster, zuletzt aktualisiert:{" "}
                    {new Date(stats.clusters.lastUpdate).toLocaleString()}
                  </p>
                </div>
                <Button onClick={handleRecalculateClusters}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Neu berechnen
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Clustering-Qualität</span>
                  <span>87%</span>
                </div>
                <Progress value={87} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cache" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cache-Verwaltung</CardTitle>
              <CardDescription>Überwache und verwalte den AI-Cache für bessere Performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Cache-Status</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.cache.size} Einträge, {Math.round(stats.cache.hitRate * 100)}% Hit-Rate
                  </p>
                </div>
                <Button onClick={handleClearCache} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Cache leeren
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Cache-Effizienz</span>
                  <span>{Math.round(stats.cache.hitRate * 100)}%</span>
                </div>
                <Progress value={stats.cache.hitRate * 100} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System-Monitoring</CardTitle>
              <CardDescription>Überwache die Performance und Gesundheit der AI-Services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${stats.processing.isRunning ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <span>Embedding-Processor</span>
                  </div>
                  <Badge variant={stats.processing.isRunning ? "default" : "destructive"}>
                    {stats.processing.isRunning ? "Aktiv" : "Gestoppt"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span>Real-time Updates</span>
                  </div>
                  <Badge variant="default">Aktiv</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span>Vector-Datenbank</span>
                  </div>
                  <Badge variant="default">Verbunden</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
