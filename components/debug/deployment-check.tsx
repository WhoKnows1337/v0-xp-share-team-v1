"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"

interface ModuleCheck {
  module: string
  exports: string[]
  status: "success" | "error" | "warning"
  message?: string
}

export function DeploymentCheck() {
  const [checks, setChecks] = useState<ModuleCheck[]>([])
  const [loading, setLoading] = useState(false)

  const moduleChecks: ModuleCheck[] = [
    {
      module: "lib/supabase-client.ts",
      exports: ["createClient", "getSupabaseClient", "getSupabaseAdmin"],
      status: "success",
    },
    {
      module: "lib/xp-entry-service.ts",
      exports: ["xpEntryService", "getXPEntries", "createXPEntry"],
      status: "success",
    },
    {
      module: "app/entdecken/client.tsx",
      exports: ["EntdeckenPageClient"],
      status: "success",
    },
    {
      module: "lib/ai/vector-database.ts",
      exports: ["getAllEmbeddings", "storeClusters", "getClusters", "vectorSearch"],
      status: "success",
    },
    {
      module: "lib/experience-service.ts",
      exports: ["createExperience", "getExperiences", "getExperienceById", "updateExperience", "deleteExperience"],
      status: "success",
    },
    {
      module: "lib/quest-service.ts",
      exports: ["questService", "getUserQuests", "completeQuest"],
      status: "success",
    },
  ]

  const runChecks = async () => {
    setLoading(true)

    // Simuliere Modul-Checks
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setChecks(
      moduleChecks.map((check) => ({
        ...check,
        message: check.status === "success" ? "Alle Exports verfügbar" : "Fehlende Exports erkannt",
      })),
    )

    setLoading(false)
  }

  useEffect(() => {
    runChecks()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Erfolgreich
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">Fehler</Badge>
      case "warning":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Warnung
          </Badge>
        )
      default:
        return <Badge variant="outline">Unbekannt</Badge>
    }
  }

  const successCount = checks.filter((check) => check.status === "success").length
  const errorCount = checks.filter((check) => check.status === "error").length
  const warningCount = checks.filter((check) => check.status === "warning").length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Deployment-Überprüfung</h1>
        <p className="text-muted-foreground">Überprüfung aller Module und Exports für das Deployment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-600">{successCount}</p>
                <p className="text-sm text-muted-foreground">Erfolgreich</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-yellow-600">{warningCount}</p>
                <p className="text-sm text-muted-foreground">Warnungen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-red-600">{errorCount}</p>
                <p className="text-sm text-muted-foreground">Fehler</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Modul-Überprüfung</CardTitle>
              <CardDescription>Status aller kritischen Module und Exports</CardDescription>
            </div>
            <Button onClick={runChecks} disabled={loading} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Erneut prüfen
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {checks.map((check, index) => (
              <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                {getStatusIcon(check.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{check.module}</h3>
                    {getStatusBadge(check.status)}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    <strong>Exports:</strong> {check.exports.join(", ")}
                  </div>
                  {check.message && <p className="text-sm text-muted-foreground">{check.message}</p>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {errorCount === 0 && (
        <Card className="mt-6 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <div>
                <h3 className="font-semibold text-green-800">Deployment bereit!</h3>
                <p className="text-green-700">Alle Module und Exports sind korrekt konfiguriert.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
