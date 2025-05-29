"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react"

export default function StatusAktuellPage() {
  const offeneFunktionen = [
    {
      kategorie: "Admin-Bereich",
      funktionen: [
        {
          name: "Systemeinstellungen",
          beschreibung: "Globale Konfigurationsoptionen für Administratoren",
          prioritaet: "hoch",
          aufwand: "mittel",
        },
        {
          name: "Erweiterte Moderationstools",
          beschreibung: "Werkzeuge zur Inhaltsmoderation und Benutzerberichte",
          prioritaet: "hoch",
          aufwand: "hoch",
        },
        {
          name: "Benutzer-Verwaltung (erweitert)",
          beschreibung: "Detaillierte Benutzerverwaltung mit Rollen und Berechtigungen",
          prioritaet: "mittel",
          aufwand: "hoch",
        },
      ],
    },
    {
      kategorie: "Nachrichten",
      funktionen: [
        {
          name: "Lesebestätigungen",
          beschreibung: "Anzeige, wann Nachrichten gelesen wurden",
          prioritaet: "mittel",
          aufwand: "niedrig",
        },
        {
          name: "Nachrichtenverschlüsselung",
          beschreibung: "End-zu-End-Verschlüsselung für private Nachrichten",
          prioritaet: "niedrig",
          aufwand: "hoch",
        },
      ],
    },
    {
      kategorie: "Barrierefreiheit",
      funktionen: [
        {
          name: "Erweiterte Barrierefreiheitseinstellungen",
          beschreibung: "Detaillierte Optionen für Sehbehinderte und motorische Einschränkungen",
          prioritaet: "hoch",
          aufwand: "mittel",
        },
        {
          name: "Screenreader-Optimierung",
          beschreibung: "Verbesserte Unterstützung für Screenreader",
          prioritaet: "hoch",
          aufwand: "mittel",
        },
        {
          name: "Tastaturnavigation",
          beschreibung: "Vollständige Tastaturnavigation für alle Funktionen",
          prioritaet: "hoch",
          aufwand: "niedrig",
        },
      ],
    },
    {
      kategorie: "PWA & Performance",
      funktionen: [
        {
          name: "Service Worker",
          beschreibung: "Implementierung für Offline-Zugriff und Caching",
          prioritaet: "hoch",
          aufwand: "mittel",
        },
        {
          name: "App-Installation",
          beschreibung: "Prompt zur Installation als Progressive Web App",
          prioritaet: "mittel",
          aufwand: "niedrig",
        },
        {
          name: "Code-Splitting",
          beschreibung: "Optimierung der Ladezeiten durch intelligentes Code-Splitting",
          prioritaet: "mittel",
          aufwand: "mittel",
        },
        {
          name: "Lazy Loading",
          beschreibung: "Verzögertes Laden von Komponenten und Bildern",
          prioritaet: "mittel",
          aufwand: "niedrig",
        },
        {
          name: "Bundle-Optimierung",
          beschreibung: "Minimierung der Bundle-Größe",
          prioritaet: "niedrig",
          aufwand: "niedrig",
        },
      ],
    },
    {
      kategorie: "Community",
      funktionen: [
        {
          name: "Gruppen-Moderationstools",
          beschreibung: "Erweiterte Werkzeuge für Gruppenadministratoren",
          prioritaet: "mittel",
          aufwand: "mittel",
        },
        {
          name: "Automatische Moderation",
          beschreibung: "KI-gestützte Inhaltsmoderation",
          prioritaet: "niedrig",
          aufwand: "hoch",
        },
      ],
    },
    {
      kategorie: "Sicherheit",
      funktionen: [
        {
          name: "Rate Limiting",
          beschreibung: "Schutz vor API-Missbrauch",
          prioritaet: "hoch",
          aufwand: "niedrig",
        },
        {
          name: "CSRF-Schutz",
          beschreibung: "Cross-Site Request Forgery Schutz",
          prioritaet: "hoch",
          aufwand: "niedrig",
        },
        {
          name: "Content Security Policy",
          beschreibung: "Erweiterte CSP-Konfiguration",
          prioritaet: "mittel",
          aufwand: "niedrig",
        },
      ],
    },
    {
      kategorie: "Monitoring & Analytics",
      funktionen: [
        {
          name: "Error Tracking",
          beschreibung: "Automatische Fehlererfassung und -berichterstattung",
          prioritaet: "hoch",
          aufwand: "niedrig",
        },
        {
          name: "Performance Monitoring",
          beschreibung: "Überwachung der Anwendungsleistung",
          prioritaet: "mittel",
          aufwand: "niedrig",
        },
        {
          name: "User Analytics",
          beschreibung: "Detaillierte Benutzeranalyse (DSGVO-konform)",
          prioritaet: "niedrig",
          aufwand: "mittel",
        },
      ],
    },
    {
      kategorie: "API & Integration",
      funktionen: [
        {
          name: "REST API Dokumentation",
          beschreibung: "Vollständige API-Dokumentation mit OpenAPI",
          prioritaet: "mittel",
          aufwand: "niedrig",
        },
        {
          name: "Webhook-System",
          beschreibung: "Webhooks für externe Integrationen",
          prioritaet: "niedrig",
          aufwand: "mittel",
        },
        {
          name: "Third-Party Integrationen",
          beschreibung: "Integration mit externen Diensten (Kalender, etc.)",
          prioritaet: "niedrig",
          aufwand: "hoch",
        },
      ],
    },
  ]

  const gesamtFunktionen = offeneFunktionen.reduce((sum, kat) => sum + kat.funktionen.length, 0)
  const hochPrioritaet = offeneFunktionen.flatMap((kat) => kat.funktionen).filter((f) => f.prioritaet === "hoch").length
  const mittelPrioritaet = offeneFunktionen
    .flatMap((kat) => kat.funktionen)
    .filter((f) => f.prioritaet === "mittel").length
  const niedrigPrioritaet = offeneFunktionen
    .flatMap((kat) => kat.funktionen)
    .filter((f) => f.prioritaet === "niedrig").length

  const getPrioritaetColor = (prioritaet: string) => {
    switch (prioritaet) {
      case "hoch":
        return "bg-red-500"
      case "mittel":
        return "bg-amber-500"
      case "niedrig":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPrioritaetVariant = (prioritaet: string) => {
    switch (prioritaet) {
      case "hoch":
        return "destructive"
      case "mittel":
        return "outline"
      case "niedrig":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Noch offene Funktionen</h1>
          <p className="text-muted-foreground">Übersicht der noch zu implementierenden Features</p>
        </div>
      </div>

      {/* Statistik-Übersicht */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <XCircle className="h-8 w-8 text-muted-foreground mb-2" />
            <div className="text-2xl font-bold">{gesamtFunktionen}</div>
            <p className="text-xs text-muted-foreground text-center">Gesamt offen</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
            <div className="text-2xl font-bold">{hochPrioritaet}</div>
            <p className="text-xs text-muted-foreground text-center">Hohe Priorität</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Clock className="h-8 w-8 text-amber-500 mb-2" />
            <div className="text-2xl font-bold">{mittelPrioritaet}</div>
            <p className="text-xs text-muted-foreground text-center">Mittlere Priorität</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
            <div className="text-2xl font-bold">{niedrigPrioritaet}</div>
            <p className="text-xs text-muted-foreground text-center">Niedrige Priorität</p>
          </CardContent>
        </Card>
      </div>

      {/* Kategorien */}
      <div className="space-y-6">
        {offeneFunktionen.map((kategorie) => (
          <Card key={kategorie.kategorie}>
            <CardHeader>
              <CardTitle>{kategorie.kategorie}</CardTitle>
              <CardDescription>{kategorie.funktionen.length} offene Funktionen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {kategorie.funktionen.map((funktion) => (
                  <div key={funktion.name} className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <div
                      className={`flex-shrink-0 w-3 h-3 rounded-full mt-1 ${getPrioritaetColor(funktion.prioritaet)}`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{funktion.name}</h3>
                        <div className="flex gap-2">
                          <Badge variant={getPrioritaetVariant(funktion.prioritaet)} className="text-xs">
                            {funktion.prioritaet === "hoch" && "Hoch"}
                            {funktion.prioritaet === "mittel" && "Mittel"}
                            {funktion.prioritaet === "niedrig" && "Niedrig"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {funktion.aufwand === "hoch" && "Hoher Aufwand"}
                            {funktion.aufwand === "mittel" && "Mittlerer Aufwand"}
                            {funktion.aufwand === "niedrig" && "Niedriger Aufwand"}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{funktion.beschreibung}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empfohlene Reihenfolge */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Empfohlene Implementierungsreihenfolge</CardTitle>
          <CardDescription>Basierend auf Priorität und Aufwand</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <div className="font-medium">Sicherheit & Barrierefreiheit</div>
                <div className="text-sm text-muted-foreground">
                  Rate Limiting, CSRF-Schutz, Barrierefreiheitseinstellungen
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <div className="font-medium">PWA & Performance</div>
                <div className="text-sm text-muted-foreground">Service Worker, App-Installation, Lazy Loading</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <div className="font-medium">Admin & Moderation</div>
                <div className="text-sm text-muted-foreground">Systemeinstellungen, Moderationstools</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <div className="font-medium">Monitoring & Integrationen</div>
                <div className="text-sm text-muted-foreground">Error Tracking, API-Dokumentation, Webhooks</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
