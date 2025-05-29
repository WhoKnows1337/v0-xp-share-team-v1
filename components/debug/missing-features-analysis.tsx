"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, AlertTriangle, Clock, Code, Database, Shield, Smartphone } from "lucide-react"

interface FeatureStatus {
  name: string
  status: "complete" | "partial" | "missing" | "planned"
  priority: "high" | "medium" | "low"
  description: string
  implementation?: string
  blockers?: string[]
}

export function MissingFeaturesAnalysis() {
  const coreFeatures: FeatureStatus[] = [
    {
      name: "Authentifizierung",
      status: "partial",
      priority: "high",
      description: "Login/Register Komponenten existieren, aber keine echte Auth-Integration",
      implementation: "Supabase Auth ist vorbereitet, aber nicht vollständig integriert",
      blockers: ["Keine Auth-Guards", "Keine Session-Persistierung", "Keine Passwort-Reset-Logik"],
    },
    {
      name: "Datenbank-Integration",
      status: "missing",
      priority: "high",
      description: "Alle Daten sind Mock-Daten, keine echte Datenbank-Verbindung",
      implementation: "Supabase ist konfiguriert, aber keine Tabellen oder Queries implementiert",
      blockers: ["Keine Datenbankschema", "Keine API-Routen", "Keine Daten-Synchronisation"],
    },
    {
      name: "Datei-Upload",
      status: "partial",
      priority: "high",
      description: "UI für Upload existiert, aber keine echte Upload-Funktionalität",
      implementation: "Komponenten sind da, aber kein Backend-Integration",
      blockers: ["Keine Storage-Integration", "Keine Bildoptimierung", "Keine Datei-Validierung"],
    },
    {
      name: "Push-Benachrichtigungen",
      status: "complete",
      priority: "medium",
      description: "Vollständig implementiert mit Service Worker",
    },
    {
      name: "Offline-Funktionalität",
      status: "partial",
      priority: "medium",
      description: "Service Worker existiert, aber keine Offline-Sync-Logik",
      blockers: ["Keine Offline-Datenspeicherung", "Keine Sync-Mechanismen"],
    },
  ]

  const backendFeatures: FeatureStatus[] = [
    {
      name: "API-Routen",
      status: "missing",
      priority: "high",
      description: "Keine Next.js API-Routen implementiert",
      blockers: ["Keine CRUD-Operationen", "Keine Validierung", "Keine Error-Handling"],
    },
    {
      name: "Server Actions",
      status: "partial",
      priority: "high",
      description: "Einige Server Actions existieren, aber nicht vollständig",
      blockers: ["Keine Datenbank-Integration", "Keine Validierung"],
    },
    {
      name: "Middleware",
      status: "missing",
      priority: "medium",
      description: "Keine Auth-Middleware oder Route-Protection",
      blockers: ["Keine Session-Validierung", "Keine Role-based Access"],
    },
    {
      name: "Rate Limiting",
      status: "partial",
      priority: "medium",
      description: "Code existiert, aber nicht integriert",
    },
    {
      name: "Email-Service",
      status: "missing",
      priority: "medium",
      description: "Keine Email-Versendung implementiert",
      blockers: ["Keine Email-Templates", "Keine SMTP-Konfiguration"],
    },
  ]

  const uiFeatures: FeatureStatus[] = [
    {
      name: "Error Boundaries",
      status: "partial",
      priority: "high",
      description: "Basis Error-Handling, aber nicht umfassend",
      blockers: ["Keine globalen Error-Handler", "Keine Fehler-Reporting"],
    },
    {
      name: "Loading States",
      status: "partial",
      priority: "medium",
      description: "Einige Loading-Komponenten, aber nicht konsistent",
      blockers: ["Keine globalen Loading-States", "Keine Skeleton-Screens"],
    },
    {
      name: "Accessibility",
      status: "partial",
      priority: "high",
      description: "Basis-Accessibility, aber nicht vollständig getestet",
      blockers: ["Keine Screen-Reader Tests", "Keine Keyboard-Navigation Tests"],
    },
    {
      name: "Internationalisierung",
      status: "partial",
      priority: "low",
      description: "Deutsch implementiert, aber keine i18n-Struktur",
      blockers: ["Keine Übersetzungs-Keys", "Keine Sprach-Switching"],
    },
    {
      name: "Theme-System",
      status: "complete",
      priority: "low",
      description: "Dark/Light Mode vollständig implementiert",
    },
  ]

  const testingFeatures: FeatureStatus[] = [
    {
      name: "Unit Tests",
      status: "missing",
      priority: "high",
      description: "Keine Tests implementiert",
      blockers: ["Keine Test-Setup", "Keine Test-Coverage"],
    },
    {
      name: "Integration Tests",
      status: "missing",
      priority: "high",
      description: "Keine API-Tests",
      blockers: ["Keine Test-Datenbank", "Keine Mock-Services"],
    },
    {
      name: "E2E Tests",
      status: "missing",
      priority: "medium",
      description: "Keine End-to-End Tests",
      blockers: ["Keine Playwright/Cypress Setup"],
    },
    {
      name: "Performance Tests",
      status: "missing",
      priority: "medium",
      description: "Keine Performance-Benchmarks",
    },
  ]

  const deploymentFeatures: FeatureStatus[] = [
    {
      name: "CI/CD Pipeline",
      status: "missing",
      priority: "high",
      description: "Keine automatisierte Deployment-Pipeline",
      blockers: ["Keine GitHub Actions", "Keine Vercel-Integration"],
    },
    {
      name: "Environment Management",
      status: "partial",
      priority: "high",
      description: "Basis-Env-Vars, aber keine vollständige Konfiguration",
      blockers: ["Keine Staging-Environment", "Keine Secrets-Management"],
    },
    {
      name: "Monitoring",
      status: "missing",
      priority: "medium",
      description: "Keine Produktions-Monitoring",
      blockers: ["Keine Error-Tracking", "Keine Performance-Monitoring"],
    },
    {
      name: "Backup-Strategie",
      status: "missing",
      priority: "medium",
      description: "Keine Daten-Backup-Lösung",
    },
  ]

  const getStatusIcon = (status: FeatureStatus["status"]) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "partial":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "missing":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "planned":
        return <Clock className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusColor = (status: FeatureStatus["status"]) => {
    switch (status) {
      case "complete":
        return "bg-green-100 text-green-800"
      case "partial":
        return "bg-yellow-100 text-yellow-800"
      case "missing":
        return "bg-red-100 text-red-800"
      case "planned":
        return "bg-blue-100 text-blue-800"
    }
  }

  const getPriorityColor = (priority: FeatureStatus["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
    }
  }

  const calculateProgress = (features: FeatureStatus[]) => {
    const total = features.length
    const complete = features.filter((f) => f.status === "complete").length
    const partial = features.filter((f) => f.status === "partial").length
    return Math.round(((complete + partial * 0.5) / total) * 100)
  }

  const allFeatures = [...coreFeatures, ...backendFeatures, ...uiFeatures, ...testingFeatures, ...deploymentFeatures]
  const overallProgress = calculateProgress(allFeatures)

  const criticalMissing = allFeatures.filter((f) => f.status === "missing" && f.priority === "high")

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">🔍 Fehlende Features Analyse</h1>
        <p className="text-muted-foreground">Umfassende Übersicht über den aktuellen Implementierungsstand</p>
      </div>

      {/* Übersicht */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Gesamt-Fortschritt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{overallProgress}%</div>
            <Progress value={overallProgress} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Kritische Lücken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalMissing.length}</div>
            <p className="text-xs text-muted-foreground">Hohe Priorität</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Vollständig</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {allFeatures.filter((f) => f.status === "complete").length}
            </div>
            <p className="text-xs text-muted-foreground">Features</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">In Arbeit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {allFeatures.filter((f) => f.status === "partial").length}
            </div>
            <p className="text-xs text-muted-foreground">Teilweise</p>
          </CardContent>
        </Card>
      </div>

      {/* Kritische Probleme */}
      {criticalMissing.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">🚨 Kritische Lücken (Hohe Priorität)</CardTitle>
            <CardDescription>Diese Features müssen vor dem Produktions-Launch implementiert werden</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalMissing.map((feature, index) => (
                <div key={index} className="p-3 bg-red-50 border border-red-200 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(feature.status)}
                    <h4 className="font-medium text-red-800">{feature.name}</h4>
                    <Badge className={getPriorityColor(feature.priority)}>
                      {feature.priority === "high" ? "Hoch" : feature.priority === "medium" ? "Mittel" : "Niedrig"}
                    </Badge>
                  </div>
                  <p className="text-sm text-red-600 mb-2">{feature.description}</p>
                  {feature.blockers && (
                    <div>
                      <p className="text-xs font-medium text-red-700 mb-1">Blocker:</p>
                      <ul className="text-xs text-red-600 space-y-1">
                        {feature.blockers.map((blocker, i) => (
                          <li key={i}>• {blocker}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detaillierte Analyse */}
      <Tabs defaultValue="core" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="core">Core Features</TabsTrigger>
          <TabsTrigger value="backend">Backend</TabsTrigger>
          <TabsTrigger value="ui">UI/UX</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
        </TabsList>

        <TabsContent value="core" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Core Features ({calculateProgress(coreFeatures)}% vollständig)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {coreFeatures.map((feature, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(feature.status)}
                        <h4 className="font-medium">{feature.name}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(feature.priority)}>
                          {feature.priority === "high" ? "Hoch" : feature.priority === "medium" ? "Mittel" : "Niedrig"}
                        </Badge>
                        <Badge className={getStatusColor(feature.status)}>
                          {feature.status === "complete"
                            ? "Vollständig"
                            : feature.status === "partial"
                              ? "Teilweise"
                              : feature.status === "missing"
                                ? "Fehlt"
                                : "Geplant"}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                    {feature.implementation && (
                      <p className="text-sm text-blue-600 mb-2">💡 {feature.implementation}</p>
                    )}
                    {feature.blockers && (
                      <div>
                        <p className="text-sm font-medium text-red-600 mb-1">Blocker:</p>
                        <ul className="text-sm text-red-500 space-y-1">
                          {feature.blockers.map((blocker, i) => (
                            <li key={i}>• {blocker}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backend" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Backend Features ({calculateProgress(backendFeatures)}% vollständig)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backendFeatures.map((feature, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(feature.status)}
                        <h4 className="font-medium">{feature.name}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(feature.priority)}>
                          {feature.priority === "high" ? "Hoch" : feature.priority === "medium" ? "Mittel" : "Niedrig"}
                        </Badge>
                        <Badge className={getStatusColor(feature.status)}>
                          {feature.status === "complete"
                            ? "Vollständig"
                            : feature.status === "partial"
                              ? "Teilweise"
                              : feature.status === "missing"
                                ? "Fehlt"
                                : "Geplant"}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                    {feature.blockers && (
                      <div>
                        <p className="text-sm font-medium text-red-600 mb-1">Blocker:</p>
                        <ul className="text-sm text-red-500 space-y-1">
                          {feature.blockers.map((blocker, i) => (
                            <li key={i}>• {blocker}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ui" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                UI/UX Features ({calculateProgress(uiFeatures)}% vollständig)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uiFeatures.map((feature, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(feature.status)}
                        <h4 className="font-medium">{feature.name}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(feature.priority)}>
                          {feature.priority === "high" ? "Hoch" : feature.priority === "medium" ? "Mittel" : "Niedrig"}
                        </Badge>
                        <Badge className={getStatusColor(feature.status)}>
                          {feature.status === "complete"
                            ? "Vollständig"
                            : feature.status === "partial"
                              ? "Teilweise"
                              : feature.status === "missing"
                                ? "Fehlt"
                                : "Geplant"}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                    {feature.blockers && (
                      <div>
                        <p className="text-sm font-medium text-red-600 mb-1">Blocker:</p>
                        <ul className="text-sm text-red-500 space-y-1">
                          {feature.blockers.map((blocker, i) => (
                            <li key={i}>• {blocker}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Testing Features ({calculateProgress(testingFeatures)}% vollständig)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testingFeatures.map((feature, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(feature.status)}
                        <h4 className="font-medium">{feature.name}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(feature.priority)}>
                          {feature.priority === "high" ? "Hoch" : feature.priority === "medium" ? "Mittel" : "Niedrig"}
                        </Badge>
                        <Badge className={getStatusColor(feature.status)}>
                          {feature.status === "complete"
                            ? "Vollständig"
                            : feature.status === "partial"
                              ? "Teilweise"
                              : feature.status === "missing"
                                ? "Fehlt"
                                : "Geplant"}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                    {feature.blockers && (
                      <div>
                        <p className="text-sm font-medium text-red-600 mb-1">Blocker:</p>
                        <ul className="text-sm text-red-500 space-y-1">
                          {feature.blockers.map((blocker, i) => (
                            <li key={i}>• {blocker}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Deployment Features ({calculateProgress(deploymentFeatures)}% vollständig)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deploymentFeatures.map((feature, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(feature.status)}
                        <h4 className="font-medium">{feature.name}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(feature.priority)}>
                          {feature.priority === "high" ? "Hoch" : feature.priority === "medium" ? "Mittel" : "Niedrig"}
                        </Badge>
                        <Badge className={getStatusColor(feature.status)}>
                          {feature.status === "complete"
                            ? "Vollständig"
                            : feature.status === "partial"
                              ? "Teilweise"
                              : feature.status === "missing"
                                ? "Fehlt"
                                : "Geplant"}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                    {feature.blockers && (
                      <div>
                        <p className="text-sm font-medium text-red-600 mb-1">Blocker:</p>
                        <ul className="text-sm text-red-500 space-y-1">
                          {feature.blockers.map((blocker, i) => (
                            <li key={i}>• {blocker}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Empfehlungen */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Empfohlene nächste Schritte</CardTitle>
          <CardDescription>Prioritäten für die weitere Entwicklung</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">1. Kritische Backend-Integration (Hoch)</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Supabase Datenbank-Schema erstellen</li>
                <li>• Authentifizierung vollständig implementieren</li>
                <li>• API-Routen für CRUD-Operationen</li>
                <li>• Datei-Upload mit Supabase Storage</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">2. Testing-Framework aufsetzen (Hoch)</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Jest und React Testing Library konfigurieren</li>
                <li>• Unit Tests für kritische Komponenten</li>
                <li>• Integration Tests für API-Routen</li>
                <li>• E2E Tests mit Playwright</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">3. Deployment-Pipeline (Mittel)</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• GitHub Actions für CI/CD</li>
                <li>• Staging und Production Environments</li>
                <li>• Automatisierte Tests im CI</li>
                <li>• Error-Monitoring mit Sentry</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">4. UX-Verbesserungen (Niedrig)</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Accessibility-Audit und Verbesserungen</li>
                <li>• Internationalisierung (i18n)</li>
                <li>• Performance-Optimierungen</li>
                <li>• Mobile App (React Native)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
