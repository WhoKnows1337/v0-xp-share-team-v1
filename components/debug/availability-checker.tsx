"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, ExternalLink } from "lucide-react"
import Link from "next/link"

interface RouteCheck {
  path: string
  name: string
  status: "available" | "missing" | "broken" | "not-linked"
  component?: string
  issues?: string[]
}

export function AvailabilityChecker() {
  const [checks] = useState<RouteCheck[]>([
    // Hauptnavigation
    { path: "/dashboard", name: "Dashboard", status: "available", component: "DashboardHome" },
    { path: "/entdecken", name: "Entdecken", status: "available", component: "EntdeckenPage" },
    { path: "/nexus", name: "Nexus", status: "available", component: "NexusPage" },
    { path: "/nachrichten", name: "Nachrichten", status: "available", component: "NachrichtenUebersicht" },
    { path: "/xp-buch", name: "XP-Buch", status: "available", component: "XpBuchLayout" },
    { path: "/community", name: "Community", status: "available", component: "CommunityPage" },
    { path: "/insights", name: "Insights", status: "available", component: "InsightsPage" },

    // Einstellungen - PROBLEM GEFUNDEN!
    {
      path: "/einstellungen",
      name: "Einstellungen",
      status: "broken",
      component: "EinstellungenDialog",
      issues: ["Verwendet Dialog statt Page", "Nicht als eigenständige Seite verfügbar"],
    },
    {
      path: "/einstellungen/erweitert",
      name: "Erweiterte Einstellungen",
      status: "available",
      component: "AdvancedSettingsPage",
    },

    // Profile
    { path: "/profil/[username]", name: "Benutzerprofil", status: "available", component: "BenutzerProfil" },

    // Admin - PROBLEME GEFUNDEN!
    {
      path: "/admin",
      name: "Admin Dashboard",
      status: "missing",
      issues: ["Page existiert, aber kein Inhalt implementiert"],
    },
    {
      path: "/admin/tracking",
      name: "Admin Tracking",
      status: "missing",
      issues: ["Page existiert, aber kein Inhalt implementiert"],
    },

    // Auth
    { path: "/login", name: "Login", status: "missing", issues: ["Entwickelt aber nicht implementiert"] },
    {
      path: "/registrieren",
      name: "Registrierung",
      status: "missing",
      issues: ["Entwickelt aber nicht implementiert"],
    },

    // Weitere Features
    { path: "/achievements", name: "Achievements", status: "missing", issues: ["Layout existiert, aber kein Inhalt"] },
    { path: "/leaderboard", name: "Leaderboard", status: "missing", issues: ["Page existiert, aber kein Inhalt"] },
    { path: "/pricing", name: "Pricing", status: "missing", issues: ["Page existiert, aber kein Inhalt"] },
    { path: "/referrals", name: "Referrals", status: "missing", issues: ["Page existiert, aber kein Inhalt"] },
    { path: "/channels", name: "Channels", status: "missing", issues: ["Page existiert, aber kein Inhalt"] },

    // Hilfe & Support
    { path: "/hilfe", name: "Hilfe", status: "missing", issues: ["Entwickelt aber nicht vollständig implementiert"] },
    { path: "/onboarding", name: "Onboarding", status: "missing", issues: ["Entwickelt aber nicht implementiert"] },
  ])

  const availableCount = checks.filter((c) => c.status === "available").length
  const missingCount = checks.filter((c) => c.status === "missing").length
  const brokenCount = checks.filter((c) => c.status === "broken").length

  const getStatusIcon = (status: RouteCheck["status"]) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "missing":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "broken":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: RouteCheck["status"]) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500">Verfügbar</Badge>
      case "missing":
        return <Badge variant="destructive">Fehlt</Badge>
      case "broken":
        return <Badge className="bg-yellow-500">Defekt</Badge>
      default:
        return <Badge variant="secondary">Unbekannt</Badge>
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">🔍 Verfügbarkeits-Check</h1>
        <p className="text-muted-foreground">
          Überprüfung aller entwickelten Features und deren tatsächliche Verfügbarkeit
        </p>
      </div>

      {/* Übersicht */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Verfügbar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{availableCount}</div>
            <p className="text-sm text-muted-foreground">Funktionieren korrekt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
              Fehlen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{missingCount}</div>
            <p className="text-sm text-muted-foreground">Entwickelt aber nicht verfügbar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              Defekt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">{brokenCount}</div>
            <p className="text-sm text-muted-foreground">Probleme gefunden</p>
          </CardContent>
        </Card>
      </div>

      {/* Detaillierte Liste */}
      <Card>
        <CardHeader>
          <CardTitle>Detaillierte Analyse</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {checks.map((check, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(check.status)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{check.name}</span>
                      {getStatusBadge(check.status)}
                      {check.component && (
                        <Badge variant="outline" className="text-xs">
                          {check.component}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{check.path}</p>
                    {check.issues && (
                      <div className="mt-1">
                        {check.issues.map((issue, i) => (
                          <p key={i} className="text-xs text-red-500">
                            • {issue}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {check.status === "available" && (
                    <Link href={check.path.replace("[username]", "demo-user")}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Öffnen
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Kritische Probleme */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">🚨 Kritische Probleme gefunden</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <h4 className="font-medium text-red-800">Einstellungen nicht verfügbar</h4>
              <p className="text-sm text-red-600">
                Die Einstellungen-Seite (/einstellungen) existiert nur als Dialog-Komponente, nicht als eigenständige
                Seite. Benutzer können nicht direkt darauf zugreifen.
              </p>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <h4 className="font-medium text-red-800">Admin-Bereich leer</h4>
              <p className="text-sm text-red-600">
                Admin-Seiten existieren, aber haben keinen Inhalt. Entwickelte Admin-Komponenten sind nicht eingebunden.
              </p>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <h4 className="font-medium text-red-800">Authentifizierung fehlt</h4>
              <p className="text-sm text-red-600">
                Login/Registrierung-Komponenten sind entwickelt, aber die Seiten sind nicht implementiert.
              </p>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <h4 className="font-medium text-red-800">Viele Features nicht verlinkt</h4>
              <p className="text-sm text-red-600">
                Achievements, Leaderboard, Pricing, Referrals, Channels - alle entwickelt, aber Seiten sind leer oder
                nicht implementiert.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
