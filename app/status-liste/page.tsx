"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function StatusListePage() {
  const [activeTab, setActiveTab] = useState("alle")

  // Definiere die Status-Typen
  const statusTypes = {
    completed: {
      label: "Abgeschlossen",
      color: "bg-green-500",
      icon: CheckCircle,
      description: "Diese Funktionen sind vollständig implementiert und getestet.",
    },
    inProgress: {
      label: "In Bearbeitung",
      color: "bg-amber-500",
      icon: AlertCircle,
      description: "Diese Funktionen sind teilweise implementiert oder in Entwicklung.",
    },
    pending: {
      label: "Ausstehend",
      color: "bg-red-500",
      icon: XCircle,
      description: "Diese Funktionen müssen noch implementiert werden.",
    },
  }

  // Definiere die Feature-Kategorien
  const categories = [
    "Benutzeroberfläche",
    "Authentifizierung",
    "Erlebnisse",
    "Community",
    "Gamification",
    "Nachrichten",
    "Suche & Entdecken",
    "Profil",
    "XP-Buch",
    "Einstellungen",
    "Admin",
    "Sonstiges",
  ]

  // Definiere die Features mit ihrem Status
  const features = [
    // Benutzeroberfläche
    {
      name: "Hauptnavigation",
      category: "Benutzeroberfläche",
      status: "completed",
      description: "Hauptnavigationsleiste mit allen wichtigen Bereichen",
    },
    {
      name: "Responsive Design",
      category: "Benutzeroberfläche",
      status: "completed",
      description: "Vollständig responsive Benutzeroberfläche für alle Geräte",
    },
    {
      name: "Dark Mode",
      category: "Benutzeroberfläche",
      status: "completed",
      description: "Dunkles Farbschema für die gesamte Anwendung",
    },
    {
      name: "Startseite",
      category: "Benutzeroberfläche",
      status: "completed",
      description: "Landing Page mit Features und Call-to-Action",
    },
    {
      name: "Ladeanimationen",
      category: "Benutzeroberfläche",
      status: "completed",
      description: "Ladeanimationen für asynchrone Vorgänge",
    },
    {
      name: "Fehlerzustände",
      category: "Benutzeroberfläche",
      status: "completed",
      description: "Fehlerbehandlung und -anzeige",
    },
    {
      name: "Barrierefreiheit",
      category: "Benutzeroberfläche",
      status: "inProgress",
      description: "ARIA-Attribute und Tastaturnavigation",
    },
    {
      name: "Mehrsprachigkeit",
      category: "Benutzeroberfläche",
      status: "inProgress",
      description: "Unterstützung für mehrere Sprachen (Deutsch, Englisch)",
    },

    // Authentifizierung
    {
      name: "Anmeldung",
      category: "Authentifizierung",
      status: "completed",
      description: "Benutzeranmeldung mit E-Mail und Passwort",
    },
    {
      name: "Registrierung",
      category: "Authentifizierung",
      status: "completed",
      description: "Benutzerregistrierung mit E-Mail-Bestätigung",
    },
    {
      name: "Passwort vergessen",
      category: "Authentifizierung",
      status: "completed",
      description: "Passwort-Zurücksetzung per E-Mail",
    },
    {
      name: "Soziale Anmeldung",
      category: "Authentifizierung",
      status: "pending",
      description: "Anmeldung über Google, Facebook, etc.",
    },
    {
      name: "Zwei-Faktor-Authentifizierung",
      category: "Authentifizierung",
      status: "pending",
      description: "Zusätzliche Sicherheitsebene mit 2FA",
    },
    {
      name: "Sitzungsverwaltung",
      category: "Authentifizierung",
      status: "completed",
      description: "Verwaltung von Benutzersitzungen",
    },

    // Erlebnisse
    {
      name: "Erlebnis-Wizard",
      category: "Erlebnisse",
      status: "completed",
      description: "Schrittweiser Assistent zum Erstellen von Erlebnissen",
    },
    {
      name: "Erlebnis-Detailansicht",
      category: "Erlebnisse",
      status: "completed",
      description: "Detaillierte Ansicht eines einzelnen Erlebnisses",
    },
    {
      name: "Erlebnis-Bearbeitung",
      category: "Erlebnisse",
      status: "completed",
      description: "Bearbeiten bestehender Erlebnisse",
    },
    {
      name: "Erlebnis-Löschung",
      category: "Erlebnisse",
      status: "completed",
      description: "Löschen von Erlebnissen",
    },
    {
      name: "Erlebnis-Kategorisierung",
      category: "Erlebnisse",
      status: "completed",
      description: "Kategorien und Tags für Erlebnisse",
    },
    {
      name: "Erlebnis-Bewertung",
      category: "Erlebnisse",
      status: "completed",
      description: "Likes und Bewertungen für Erlebnisse",
    },
    {
      name: "Erlebnis-Kommentare",
      category: "Erlebnisse",
      status: "completed",
      description: "Kommentarfunktion für Erlebnisse",
    },
    {
      name: "Erlebnis-Teilen",
      category: "Erlebnisse",
      status: "completed",
      description: "Teilen von Erlebnissen über verschiedene Kanäle",
    },
    {
      name: "Medien-Upload",
      category: "Erlebnisse",
      status: "completed",
      description: "Hochladen von Bildern, Videos und Audiodateien",
    },
    {
      name: "Geolokalisierung",
      category: "Erlebnisse",
      status: "completed",
      description: "Standorterfassung und -anzeige für Erlebnisse",
    },
    {
      name: "Zeitliche Einordnung",
      category: "Erlebnisse",
      status: "completed",
      description: "Datum und Uhrzeit für Erlebnisse",
    },
    {
      name: "Emotionale Einordnung",
      category: "Erlebnisse",
      status: "completed",
      description: "Emotionsrad zur Erfassung von Gefühlen",
    },
    {
      name: "KI-Analyse",
      category: "Erlebnisse",
      status: "completed",
      description: "KI-gestützte Analyse von Erlebnissen",
    },
    {
      name: "Ähnliche Erlebnisse",
      category: "Erlebnisse",
      status: "completed",
      description: "Anzeige ähnlicher Erlebnisse",
    },
    {
      name: "Offline-Unterstützung",
      category: "Erlebnisse",
      status: "inProgress",
      description: "Erstellung und Bearbeitung von Erlebnissen im Offline-Modus",
    },

    // Community
    {
      name: "Community-Übersicht",
      category: "Community",
      status: "completed",
      description: "Übersicht über Community-Aktivitäten",
    },
    {
      name: "Gruppen",
      category: "Community",
      status: "inProgress",
      description: "Erstellen und Verwalten von Benutzergruppen",
    },
    {
      name: "Events",
      category: "Community",
      status: "completed",
      description: "Erstellen und Teilnehmen an Community-Events",
    },
    {
      name: "Diskussionen",
      category: "Community",
      status: "completed",
      description: "Thematische Diskussionen in der Community",
    },
    {
      name: "Mitgliederverzeichnis",
      category: "Community",
      status: "completed",
      description: "Durchsuchen und Finden von Community-Mitgliedern",
    },
    {
      name: "Folgen/Abonnieren",
      category: "Community",
      status: "completed",
      description: "Anderen Benutzern folgen und Aktualisierungen erhalten",
    },
    {
      name: "Aktivitäts-Feed",
      category: "Community",
      status: "completed",
      description: "Feed mit Aktivitäten der Community",
    },
    {
      name: "Moderationstools",
      category: "Community",
      status: "pending",
      description: "Tools für Community-Moderatoren",
    },

    // Gamification
    {
      name: "XP-System",
      category: "Gamification",
      status: "completed",
      description: "Erfahrungspunkte für verschiedene Aktivitäten",
    },
    {
      name: "Level-System",
      category: "Gamification",
      status: "completed",
      description: "Levelaufstiege basierend auf XP",
    },
    {
      name: "Achievements",
      category: "Gamification",
      status: "completed",
      description: "Abzeichen und Erfolge für bestimmte Aktionen",
    },
    {
      name: "Bestenlisten",
      category: "Gamification",
      status: "completed",
      description: "Ranglisten für verschiedene Kategorien",
    },
    {
      name: "Streaks",
      category: "Gamification",
      status: "completed",
      description: "Tägliche Aktivitätsserien",
    },
    {
      name: "Quests",
      category: "Gamification",
      status: "inProgress",
      description: "Aufgaben und Herausforderungen für Benutzer",
    },
    {
      name: "Belohnungen",
      category: "Gamification",
      status: "inProgress",
      description: "Belohnungen für abgeschlossene Quests und Achievements",
    },
    {
      name: "Fortschrittsanzeige",
      category: "Gamification",
      status: "completed",
      description: "Visualisierung des Fortschritts",
    },

    // Nachrichten
    {
      name: "Direktnachrichten",
      category: "Nachrichten",
      status: "completed",
      description: "Private Nachrichten zwischen Benutzern",
    },
    {
      name: "Themen-Channels",
      category: "Nachrichten",
      status: "completed",
      description: "Thematische Kanäle für Gruppendiskussionen",
    },
    {
      name: "Benachrichtigungen",
      category: "Nachrichten",
      status: "completed",
      description: "Benachrichtigungen für neue Nachrichten",
    },
    {
      name: "Nachrichtensuche",
      category: "Nachrichten",
      status: "inProgress",
      description: "Durchsuchen von Nachrichtenverläufen",
    },
    {
      name: "Medienanhänge",
      category: "Nachrichten",
      status: "completed",
      description: "Anhängen von Medien an Nachrichten",
    },
    {
      name: "Lesebestätigungen",
      category: "Nachrichten",
      status: "pending",
      description: "Anzeige, ob Nachrichten gelesen wurden",
    },
    {
      name: "Echtzeit-Chat",
      category: "Nachrichten",
      status: "completed",
      description: "Echtzeit-Nachrichtenaustausch",
    },

    // Suche & Entdecken
    {
      name: "Erweiterte Suche",
      category: "Suche & Entdecken",
      status: "completed",
      description: "Detaillierte Suchfunktion mit Filtern",
    },
    {
      name: "Entdecken-Seite",
      category: "Suche & Entdecken",
      status: "completed",
      description: "Seite zum Entdecken neuer Erlebnisse",
    },
    {
      name: "Filteroptionen",
      category: "Suche & Entdecken",
      status: "completed",
      description: "Verschiedene Filter für die Suche",
    },
    {
      name: "Zeitstrahl",
      category: "Suche & Entdecken",
      status: "completed",
      description: "Chronologische Darstellung von Erlebnissen",
    },
    {
      name: "Kartenansicht",
      category: "Suche & Entdecken",
      status: "completed",
      description: "Geografische Darstellung von Erlebnissen",
    },
    {
      name: "Empfehlungsalgorithmus",
      category: "Suche & Entdecken",
      status: "inProgress",
      description: "Personalisierte Empfehlungen basierend auf Interessen",
    },
    {
      name: "Trendanalyse",
      category: "Suche & Entdecken",
      status: "completed",
      description: "Anzeige von Trends und beliebten Themen",
    },

    // Profil
    {
      name: "Profilseite",
      category: "Profil",
      status: "completed",
      description: "Persönliche Profilseite mit Informationen",
    },
    {
      name: "Profilbearbeitung",
      category: "Profil",
      status: "completed",
      description: "Bearbeiten von Profilinformationen",
    },
    {
      name: "Profilbild",
      category: "Profil",
      status: "completed",
      description: "Hochladen und Bearbeiten des Profilbilds",
    },
    {
      name: "Biografie",
      category: "Profil",
      status: "completed",
      description: "Persönliche Beschreibung im Profil",
    },
    {
      name: "Aktivitätsübersicht",
      category: "Profil",
      status: "completed",
      description: "Übersicht über eigene Aktivitäten",
    },
    {
      name: "Freundesliste",
      category: "Profil",
      status: "completed",
      description: "Liste von Freunden und Kontakten",
    },
    {
      name: "Privatsphäre-Einstellungen",
      category: "Profil",
      status: "inProgress",
      description: "Einstellungen für die Sichtbarkeit des Profils",
    },

    // XP-Buch
    {
      name: "XP-Buch-Übersicht",
      category: "XP-Buch",
      status: "completed",
      description: "Übersicht über persönliche Einträge",
    },
    {
      name: "Eintrag erstellen",
      category: "XP-Buch",
      status: "completed",
      description: "Erstellen neuer Einträge im XP-Buch",
    },
    {
      name: "Eintrag bearbeiten",
      category: "XP-Buch",
      status: "completed",
      description: "Bearbeiten bestehender Einträge",
    },
    {
      name: "Eintrag löschen",
      category: "XP-Buch",
      status: "completed",
      description: "Löschen von Einträgen",
    },
    {
      name: "Kalenderansicht",
      category: "XP-Buch",
      status: "completed",
      description: "Kalendarische Darstellung von Einträgen",
    },
    {
      name: "Statistiken",
      category: "XP-Buch",
      status: "completed",
      description: "Statistiken zu Einträgen und Aktivitäten",
    },
    {
      name: "Export-Funktion",
      category: "XP-Buch",
      status: "completed",
      description: "Exportieren von Einträgen in verschiedene Formate",
    },
    {
      name: "Erinnerungen",
      category: "XP-Buch",
      status: "completed",
      description: "Erinnerungen für regelmäßige Einträge",
    },
    {
      name: "Muster und Trends",
      category: "XP-Buch",
      status: "completed",
      description: "Erkennung von Mustern in Einträgen",
    },
    {
      name: "Offline-Synchronisation",
      category: "XP-Buch",
      status: "inProgress",
      description: "Synchronisation von Offline-Einträgen",
    },

    // Einstellungen
    {
      name: "Allgemeine Einstellungen",
      category: "Einstellungen",
      status: "completed",
      description: "Grundlegende Anwendungseinstellungen",
    },
    {
      name: "Benachrichtigungseinstellungen",
      category: "Einstellungen",
      status: "completed",
      description: "Einstellungen für Benachrichtigungen",
    },
    {
      name: "Datenschutzeinstellungen",
      category: "Einstellungen",
      status: "inProgress",
      description: "Einstellungen für Datenschutz und Privatsphäre",
    },
    {
      name: "Abonnement-Verwaltung",
      category: "Einstellungen",
      status: "completed",
      description: "Verwaltung von Premium-Abonnements",
    },
    {
      name: "Konto-Verwaltung",
      category: "Einstellungen",
      status: "completed",
      description: "Verwaltung des Benutzerkontos",
    },
    {
      name: "Sprache ändern",
      category: "Einstellungen",
      status: "inProgress",
      description: "Ändern der Anwendungssprache",
    },
    {
      name: "Barrierefreiheitseinstellungen",
      category: "Einstellungen",
      status: "pending",
      description: "Einstellungen für verbesserte Barrierefreiheit",
    },

    // Admin
    {
      name: "Admin-Dashboard",
      category: "Admin",
      status: "completed",
      description: "Übersichtsseite für Administratoren",
    },
    {
      name: "Benutzerverwaltung",
      category: "Admin",
      status: "inProgress",
      description: "Verwaltung von Benutzern durch Administratoren",
    },
    {
      name: "Inhaltsverwaltung",
      category: "Admin",
      status: "inProgress",
      description: "Verwaltung von Inhalten durch Administratoren",
    },
    {
      name: "Statistiken und Berichte",
      category: "Admin",
      status: "completed",
      description: "Detaillierte Statistiken für Administratoren",
    },
    {
      name: "Systemeinstellungen",
      category: "Admin",
      status: "pending",
      description: "Globale Systemeinstellungen",
    },
    {
      name: "Moderationstools",
      category: "Admin",
      status: "pending",
      description: "Tools für die Inhaltsmoderation",
    },

    // Sonstiges
    {
      name: "Hilfe-Center",
      category: "Sonstiges",
      status: "completed",
      description: "Hilfe und Support für Benutzer",
    },
    {
      name: "Feedback-System",
      category: "Sonstiges",
      status: "completed",
      description: "System für Benutzer-Feedback",
    },
    {
      name: "Onboarding",
      category: "Sonstiges",
      status: "completed",
      description: "Einführung für neue Benutzer",
    },
    {
      name: "Referral-System",
      category: "Sonstiges",
      status: "completed",
      description: "System für Empfehlungen und Einladungen",
    },
    {
      name: "PWA-Unterstützung",
      category: "Sonstiges",
      status: "inProgress",
      description: "Progressive Web App Funktionalität",
    },
    {
      name: "Performance-Optimierung",
      category: "Sonstiges",
      status: "inProgress",
      description: "Optimierung der Anwendungsleistung",
    },
    {
      name: "Analytik",
      category: "Sonstiges",
      status: "completed",
      description: "Analyse von Benutzerverhalten",
    },
  ]

  // Berechne die Statistiken
  const totalFeatures = features.length
  const completedFeatures = features.filter((f) => f.status === "completed").length
  const inProgressFeatures = features.filter((f) => f.status === "inProgress").length
  const pendingFeatures = features.filter((f) => f.status === "pending").length
  const completionPercentage = Math.round((completedFeatures / totalFeatures) * 100)

  // Filtere die Features basierend auf dem aktiven Tab
  const filteredFeatures = features.filter((feature) => {
    if (activeTab === "alle") return true
    if (activeTab === "abgeschlossen") return feature.status === "completed"
    if (activeTab === "inBearbeitung") return feature.status === "inProgress"
    if (activeTab === "ausstehend") return feature.status === "pending"
    return feature.category.toLowerCase() === activeTab.toLowerCase()
  })

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projektstatus</h1>
          <p className="text-muted-foreground">Vollständige Liste aller Features und ihr aktueller Status</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            {completedFeatures}
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            {inProgressFeatures}
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            {pendingFeatures}
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>Gesamtfortschritt</CardTitle>
          <CardDescription>
            {completedFeatures} von {totalFeatures} Features abgeschlossen ({completionPercentage}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} className="h-2" />
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-500 mb-1" />
              <span className="text-xl font-bold">{completedFeatures}</span>
              <span className="text-xs text-muted-foreground">Abgeschlossen</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
              <AlertCircle className="h-6 w-6 text-amber-500 mb-1" />
              <span className="text-xl font-bold">{inProgressFeatures}</span>
              <span className="text-xs text-muted-foreground">In Bearbeitung</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
              <XCircle className="h-6 w-6 text-red-500 mb-1" />
              <span className="text-xl font-bold">{pendingFeatures}</span>
              <span className="text-xs text-muted-foreground">Ausstehend</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="alle">Alle</TabsTrigger>
          <TabsTrigger value="abgeschlossen">Abgeschlossen</TabsTrigger>
          <TabsTrigger value="inBearbeitung">In Bearbeitung</TabsTrigger>
          <TabsTrigger value="ausstehend">Ausstehend</TabsTrigger>
          <TabsTrigger value="Benutzeroberfläche">UI</TabsTrigger>
          <TabsTrigger value="Authentifizierung">Auth</TabsTrigger>
          <TabsTrigger value="Erlebnisse">Erlebnisse</TabsTrigger>
          <TabsTrigger value="Community">Community</TabsTrigger>
          <TabsTrigger value="Gamification">Gamification</TabsTrigger>
          <TabsTrigger value="Nachrichten">Nachrichten</TabsTrigger>
          <TabsTrigger value="Suche & Entdecken">Suche</TabsTrigger>
          <TabsTrigger value="Profil">Profil</TabsTrigger>
          <TabsTrigger value="XP-Buch">XP-Buch</TabsTrigger>
          <TabsTrigger value="Einstellungen">Einstellungen</TabsTrigger>
          <TabsTrigger value="Admin">Admin</TabsTrigger>
          <TabsTrigger value="Sonstiges">Sonstiges</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {categories.map((category) => {
            const categoryFeatures = filteredFeatures.filter((feature) => feature.category === category)
            if (categoryFeatures.length === 0) return null

            return (
              <Card key={category}>
                <CardHeader className="pb-2">
                  <CardTitle>{category}</CardTitle>
                  <CardDescription>
                    {categoryFeatures.filter((f) => f.status === "completed").length} von {categoryFeatures.length}{" "}
                    Features abgeschlossen
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryFeatures.map((feature) => (
                      <div key={feature.name} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <div
                          className={`flex-shrink-0 p-1.5 rounded-full ${
                            statusTypes[feature.status as keyof typeof statusTypes].color
                          }`}
                        >
                          {feature.status === "completed" && <CheckCircle className="h-4 w-4 text-white" />}
                          {feature.status === "inProgress" && <AlertCircle className="h-4 w-4 text-white" />}
                          {feature.status === "pending" && <XCircle className="h-4 w-4 text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{feature.name}</h3>
                            <Badge
                              variant={
                                feature.status === "completed"
                                  ? "default"
                                  : feature.status === "inProgress"
                                    ? "outline"
                                    : "destructive"
                              }
                            >
                              {statusTypes[feature.status as keyof typeof statusTypes].label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>
      </Tabs>
    </div>
  )
}
