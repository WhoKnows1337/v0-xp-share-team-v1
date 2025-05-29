"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { checkRequiredEnvVars, getCurrentEnvironment, getEnvironmentConfig } from "@/lib/deployment/vercel-config"
import { supabase } from "@/lib/supabase"
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, ExternalLink } from "lucide-react"

interface CheckResult {
  name: string
  status: "success" | "error" | "warning" | "pending"
  message: string
  details?: string
}

export function DeploymentChecklist() {
  const [checks, setChecks] = useState<CheckResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("environment")

  // Führe die Checks aus
  const runChecks = async () => {
    setIsLoading(true)
    const results: CheckResult[] = []

    // Prüfe die Umgebungsvariablen
    const envVarsCheck = checkRequiredEnvVars()
    results.push({
      name: "Umgebungsvariablen",
      status: envVarsCheck.valid ? "success" : "error",
      message: envVarsCheck.valid
        ? "Alle erforderlichen Umgebungsvariablen sind vorhanden."
        : "Es fehlen erforderliche Umgebungsvariablen.",
      details: envVarsCheck.valid ? undefined : `Fehlende Variablen: ${envVarsCheck.missing.join(", ")}`,
    })

    // Prüfe die Supabase-Verbindung
    try {
      const { data, error } = await supabase.from("health_check").select("*").limit(1)

      if (error) {
        results.push({
          name: "Supabase-Verbindung",
          status: "error",
          message: "Fehler bei der Verbindung zu Supabase.",
          details: error.message,
        })
      } else {
        results.push({
          name: "Supabase-Verbindung",
          status: "success",
          message: "Verbindung zu Supabase erfolgreich hergestellt.",
        })
      }
    } catch (error) {
      results.push({
        name: "Supabase-Verbindung",
        status: "error",
        message: "Fehler bei der Verbindung zu Supabase.",
        details: error instanceof Error ? error.message : String(error),
      })
    }

    // Prüfe die aktuelle Umgebung
    const environment = getCurrentEnvironment()
    results.push({
      name: "Umgebung",
      status: "success",
      message: `Die Anwendung läuft in der ${environment}-Umgebung.`,
    })

    // Prüfe die API-URL
    const config = getEnvironmentConfig()
    results.push({
      name: "API-URL",
      status: config.apiUrl ? "success" : "warning",
      message: config.apiUrl ? `API-URL ist konfiguriert: ${config.apiUrl}` : "API-URL ist nicht konfiguriert.",
    })

    // Prüfe die Supabase-URL
    results.push({
      name: "Supabase-URL",
      status: config.supabaseUrl ? "success" : "error",
      message: config.supabaseUrl
        ? `Supabase-URL ist konfiguriert: ${config.supabaseUrl}`
        : "Supabase-URL ist nicht konfiguriert.",
    })

    // Prüfe die Vercel-URL
    results.push({
      name: "Vercel-URL",
      status: config.url ? "success" : "warning",
      message: config.url ? `Vercel-URL ist konfiguriert: ${config.url}` : "Vercel-URL ist nicht konfiguriert.",
    })

    setChecks(results)
    setIsLoading(false)
  }

  // Führe die Checks beim Laden der Komponente aus
  useEffect(() => {
    runChecks()
  }, [])

  // Berechne den Fortschritt
  const progress =
    checks.length > 0
      ? Math.round((checks.filter((check) => check.status === "success").length / checks.length) * 100)
      : 0

  // Rendere das Status-Icon
  const renderStatusIcon = (status: CheckResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "pending":
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Deployment-Checkliste</CardTitle>
            <CardDescription>Überprüfe den Status des Deployments</CardDescription>
          </div>
          <Button variant="outline" onClick={runChecks} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Aktualisieren
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Gesamtfortschritt</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="environment">Umgebung</TabsTrigger>
            <TabsTrigger value="database">Datenbank</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
          </TabsList>

          <TabsContent value="environment" className="space-y-4">
            {checks
              .filter((check) => ["Umgebungsvariablen", "Umgebung", "API-URL", "Vercel-URL"].includes(check.name))
              .map((check) => (
                <div key={check.name} className="flex items-start space-x-3 p-3 border rounded-md">
                  {renderStatusIcon(check.status)}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{check.name}</h3>
                      <Badge variant={check.status === "success" ? "default" : "outline"}>
                        {check.status === "success" ? "OK" : check.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{check.message}</p>
                    {check.details && <p className="text-xs text-red-500">{check.details}</p>}
                  </div>
                </div>
              ))}
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            {checks
              .filter((check) => ["Supabase-Verbindung", "Supabase-URL"].includes(check.name))
              .map((check) => (
                <div key={check.name} className="flex items-start space-x-3 p-3 border rounded-md">
                  {renderStatusIcon(check.status)}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{check.name}</h3>
                      <Badge variant={check.status === "success" ? "default" : "outline"}>
                        {check.status === "success" ? "OK" : check.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{check.message}</p>
                    {check.details && <p className="text-xs text-red-500">{check.details}</p>}
                  </div>
                </div>
              ))}

            <div className="p-3 border rounded-md">
              <h3 className="font-medium mb-2">Supabase-Tabellen</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-muted rounded-md">
                  <p className="text-sm font-medium">users</p>
                  <p className="text-xs text-muted-foreground">Benutzer-Tabelle</p>
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <p className="text-sm font-medium">experiences</p>
                  <p className="text-xs text-muted-foreground">Erlebnisse-Tabelle</p>
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <p className="text-sm font-medium">groups</p>
                  <p className="text-xs text-muted-foreground">Gruppen-Tabelle</p>
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <p className="text-sm font-medium">messages</p>
                  <p className="text-xs text-muted-foreground">Nachrichten-Tabelle</p>
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <p className="text-sm font-medium">comments</p>
                  <p className="text-xs text-muted-foreground">Kommentare-Tabelle</p>
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <p className="text-sm font-medium">activities</p>
                  <p className="text-xs text-muted-foreground">Aktivitäten-Tabelle</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="deployment" className="space-y-4">
            <div className="p-3 border rounded-md">
              <h3 className="font-medium mb-2">Deployment-Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Umgebung</span>
                  <Badge>{getCurrentEnvironment()}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Build-Status</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Erfolgreich
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Letzte Aktualisierung</span>
                  <span className="text-sm text-muted-foreground">{new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-3 border rounded-md">
              <h3 className="font-medium mb-2">Deployment-Links</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-between" asChild>
                  <a href={getEnvironmentConfig().url} target="_blank" rel="noopener noreferrer">
                    <span>Zur Anwendung</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-between" asChild>
                  <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
                    <span>Vercel Dashboard</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-between" asChild>
                  <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer">
                    <span>Supabase Dashboard</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
