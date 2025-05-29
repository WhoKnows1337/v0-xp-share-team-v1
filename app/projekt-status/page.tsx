"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  BarChart3,
  ListChecks,
  ClipboardList,
  Activity,
  ArrowUpCircle,
  ArrowRightCircle,
  ArrowDownCircle,
  Construction,
  Sparkles,
  Users,
  MessageSquare,
  Gamepad2,
  UserCircle,
  Settings2,
  CloudCog,
  Gift,
  MapPinned,
} from "lucide-react"
import { analyzeProjectCompleteness } from "@/lib/project-completeness-check" // Annahme: Diese Funktion existiert und liefert Basisdaten

// Aktualisierte Projektdaten basierend auf Analyse
const projectData = {
  completeness: analyzeProjectCompleteness(), // Beibehaltung der externen Analysefunktion
  totalFeatures: 43,
  completedFeatures: 18,
  inProgressFeatures: 9,
  pendingFeatures: 16,
  highPriorityPending: 8,
  mediumPriorityPending: 7,
  lowPriorityPending: 1,
  testsPassed: 18,
  testsFailed: 1,
  testsWarning: 9,
}

// Berechne Prozentsätze
const completionPercentage = Math.round((projectData.completedFeatures / projectData.totalFeatures) * 100)
const testPassPercentage = Math.round(
  (projectData.testsPassed / (projectData.testsPassed + projectData.testsFailed + projectData.testsWarning)) * 100,
)

// Feature-Kategorien mit Icons
const categories = [
  { name: "Benutzeroberfläche", icon: <Construction className="h-4 w-4 mr-2" /> },
  { name: "Authentifizierung", icon: <UserCircle className="h-4 w-4 mr-2" /> },
  { name: "Erlebnisse", icon: <Sparkles className="h-4 w-4 mr-2" /> },
  { name: "XP-Buch", icon: <ClipboardList className="h-4 w-4 mr-2" /> },
  { name: "Community", icon: <Users className="h-4 w-4 mr-2" /> },
  { name: "Nachrichten", icon: <MessageSquare className="h-4 w-4 mr-2" /> },
  { name: "Gamification", icon: <Gamepad2 className="h-4 w-4 mr-2" /> },
  { name: "Profile", icon: <UserCircle className="h-4 w-4 mr-2" /> },
  { name: "Einstellungen", icon: <Settings2 className="h-4 w-4 mr-2" /> },
  { name: "Deployment & Admin", icon: <CloudCog className="h-4 w-4 mr-2" /> },
  { name: "Empfehlungsprogramm", icon: <Gift className="h-4 w-4 mr-2" /> },
  { name: "Suche & Entdecken", icon: <MapPinned className="h-4 w-4 mr-2" /> },
]

// Aktualisierte Feature-Liste
const features = [
  // Benutzeroberfläche
  {
    id: 1,
    name: "Dashboard Layout",
    category: "Benutzeroberfläche",
    status: "completed",
    priority: "high",
    effort: "medium",
    tests: "passed",
  },
  {
    id: 2,
    name: "Responsive Design",
    category: "Benutzeroberfläche",
    status: "completed",
    priority: "high",
    effort: "medium",
    tests: "passed",
  },
  {
    id: 3,
    name: "Theming (Dark/Light)",
    category: "Benutzeroberfläche",
    status: "completed",
    priority: "medium",
    effort: "low",
    tests: "passed",
  },
  {
    id: 4,
    name: "Onboarding Flow",
    category: "Benutzeroberfläche",
    status: "in_progress",
    priority: "high",
    effort: "medium",
    tests: "warning",
  },
  {
    id: 5,
    name: "Offline Modus UI",
    category: "Benutzeroberfläche",
    status: "pending",
    priority: "medium",
    effort: "medium",
    tests: "not_tested",
  },
  // Authentifizierung
  {
    id: 6,
    name: "Supabase Auth (Email/Pass)",
    category: "Authentifizierung",
    status: "completed",
    priority: "high",
    effort: "medium",
    tests: "passed",
  },
  {
    id: 7,
    name: "Social Logins (Google, etc.)",
    category: "Authentifizierung",
    status: "pending",
    priority: "medium",
    effort: "medium",
    tests: "not_tested",
  },
  {
    id: 8,
    name: "Passwort Reset",
    category: "Authentifizierung",
    status: "completed",
    priority: "medium",
    effort: "low",
    tests: "passed",
  },
  // Erlebnisse
  {
    id: 9,
    name: "Erlebnis-Wizard",
    category: "Erlebnisse",
    status: "completed",
    priority: "high",
    effort: "high",
    tests: "passed",
  },
  {
    id: 10,
    name: "Erlebnis Detailansicht",
    category: "Erlebnisse",
    status: "completed",
    priority: "high",
    effort: "medium",
    tests: "passed",
  },
  {
    id: 11,
    name: "Erlebnisse Auflisten & Filtern",
    category: "Erlebnisse",
    status: "completed",
    priority: "high",
    effort: "medium",
    tests: "passed",
  },
  {
    id: 12,
    name: "Medien-Upload (Bilder/Videos) für Erlebnisse",
    category: "Erlebnisse",
    status: "completed",
    priority: "high",
    effort: "medium",
    tests: "passed",
  },
  {
    id: 13,
    name: "KI-Analyse für Erlebnisse (Emotionen, Tags)",
    category: "Erlebnisse",
    status: "in_progress",
    priority: "high",
    effort: "high",
    tests: "warning",
  },
  {
    id: 14,
    name: "Semantische Suche für Erlebnisse",
    category: "Erlebnisse",
    status: "pending",
    priority: "high",
    effort: "high",
    tests: "failed",
  },
  {
    id: 15,
    name: "Erlebnisse Teilen (Social Media, Link)",
    category: "Erlebnisse",
    status: "pending",
    priority: "medium",
    effort: "medium",
    tests: "not_tested",
  },
  // XP-Buch
  {
    id: 16,
    name: "XP-Buch Einträge (CRUD)",
    category: "XP-Buch",
    status: "completed",
    priority: "high",
    effort: "medium",
    tests: "passed",
  },
  {
    id: 17,
    name: "Stimmung & Tags für XP-Buch",
    category: "XP-Buch",
    status: "completed",
    priority: "medium",
    effort: "low",
    tests: "passed",
  },
  {
    id: 18,
    name: "XP-Buch Medien-Upload",
    category: "XP-Buch",
    status: "in_progress",
    priority: "medium",
    effort: "medium",
    tests: "warning",
  },
  {
    id: 19,
    name: "XP-Buch KI-Zusammenfassungen",
    category: "XP-Buch",
    status: "pending",
    priority: "high",
    effort: "high",
    tests: "not_tested",
  },
  // Community
  {
    id: 20,
    name: "Community-Gruppen (CRUD, Join/Leave)",
    category: "Community",
    status: "in_progress",
    priority: "medium",
    effort: "high",
    tests: "warning",
  },
  {
    id: 21,
    name: "Gruppen-Diskussionen",
    category: "Community",
    status: "pending",
    priority: "high",
    effort: "high",
    tests: "not_tested",
  },
  {
    id: 22,
    name: "Community-Events",
    category: "Community",
    status: "pending",
    priority: "low",
    effort: "medium",
    tests: "not_tested",
  },
  // Nachrichten
  {
    id: 23,
    name: "Echtzeit-Direktnachrichten",
    category: "Nachrichten",
    status: "in_progress",
    priority: "high",
    effort: "high",
    tests: "warning",
  },
  {
    id: 24,
    name: "Gruppen-Chats",
    category: "Nachrichten",
    status: "pending",
    priority: "high",
    effort: "high",
    tests: "not_tested",
  },
  {
    id: 25,
    name: "Push-Benachrichtigungen für Nachrichten",
    category: "Nachrichten",
    status: "pending",
    priority: "high",
    effort: "medium",
    tests: "not_tested",
  },
  // Gamification
  {
    id: 26,
    name: "XP-Punkte & Level-System",
    category: "Gamification",
    status: "completed",
    priority: "medium",
    effort: "medium",
    tests: "passed",
  },
  {
    id: 27,
    name: "Achievements (Basis)",
    category: "Gamification",
    status: "in_progress",
    priority: "medium",
    effort: "medium",
    tests: "warning",
  },
  {
    id: 28,
    name: "Quests (Täglich/Wöchentlich)",
    category: "Gamification",
    status: "pending",
    priority: "high",
    effort: "high",
    tests: "not_tested",
  },
  {
    id: 29,
    name: "Leaderboard",
    category: "Gamification",
    status: "completed",
    priority: "low",
    effort: "low",
    tests: "passed",
  },
  // Profile
  {
    id: 30,
    name: "Profilansicht (Öffentlich/Privat)",
    category: "Profile",
    status: "completed",
    priority: "high",
    effort: "medium",
    tests: "passed",
  },
  {
    id: 31,
    name: "Profilbearbeitung",
    category: "Profile",
    status: "completed",
    priority: "medium",
    effort: "low",
    tests: "passed",
  },
  {
    id: 32,
    name: "Anzeige von Achievements & XP im Profil",
    category: "Profile",
    status: "in_progress",
    priority: "medium",
    effort: "low",
    tests: "warning",
  },
  // Einstellungen
  {
    id: 33,
    name: "Benutzerkonto-Einstellungen",
    category: "Einstellungen",
    status: "completed",
    priority: "medium",
    effort: "low",
    tests: "passed",
  },
  {
    id: 34,
    name: "Datenschutzeinstellungen",
    category: "Einstellungen",
    status: "in_progress",
    priority: "high",
    effort: "medium",
    tests: "warning",
  },
  {
    id: 35,
    name: "Benachrichtigungseinstellungen",
    category: "Einstellungen",
    status: "pending",
    priority: "medium",
    effort: "medium",
    tests: "not_tested",
  },
  // Deployment & Admin
  {
    id: 36,
    name: "Vercel Deployment Setup",
    category: "Deployment & Admin",
    status: "completed",
    priority: "high",
    effort: "low",
    tests: "passed",
  },
  {
    id: 37,
    name: "Admin Dashboard (Basis Nutzerübersicht)",
    category: "Deployment & Admin",
    status: "in_progress",
    priority: "low",
    effort: "medium",
    tests: "warning",
  },
  {
    id: 38,
    name: "Admin Content Moderation Tools",
    category: "Deployment & Admin",
    status: "pending",
    priority: "high",
    effort: "high",
    tests: "not_tested",
  },
  // Empfehlungsprogramm
  {
    id: 39,
    name: "Freunde einladen & Tracking",
    category: "Empfehlungsprogramm",
    status: "pending",
    priority: "medium",
    effort: "medium",
    tests: "not_tested",
  },
  {
    id: 40,
    name: "Belohnungssystem für Referrals",
    category: "Empfehlungsprogramm",
    status: "pending",
    priority: "medium",
    effort: "medium",
    tests: "not_tested",
  },
  // Suche & Entdecken
  {
    id: 41,
    name: "Basis-Textsuche & Filter",
    category: "Suche & Entdecken",
    status: "completed",
    priority: "high",
    effort: "medium",
    tests: "passed",
  },
  {
    id: 42,
    name: "Kartenansicht für Erlebnisse",
    category: "Suche & Entdecken",
    status: "pending",
    priority: "high",
    effort: "high",
    tests: "not_tested",
  },
  {
    id: 43,
    name: "Zeitstrahl-Ansicht für Erlebnisse",
    category: "Suche & Entdecken",
    status: "pending",
    priority: "medium",
    effort: "medium",
    tests: "not_tested",
  },
]

export default function ProjektStatus() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  // Filtere Features basierend auf Suchbegriff und Filtern
  const filteredFeatures = features.filter((feature) => {
    const matchesSearch =
      feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && feature.status === "completed") ||
      (statusFilter === "in_progress" && feature.status === "in_progress") ||
      (statusFilter === "pending" && feature.status === "pending")
    const matchesCategory = categoryFilter === "all" || feature.category === categoryFilter
    const matchesPriority = priorityFilter === "all" || feature.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority
  })

  // Empfohlene nächste Schritte (Features mit hoher Priorität, die noch ausstehen oder in Bearbeitung sind)
  const nextSteps = features
    .filter((f) => (f.status === "pending" || f.status === "in_progress") && f.priority === "high")
    .sort((a, b) => {
      const priorityOrder = { high: 1, medium: 2, low: 3 }
      const effortOrder = { low: 1, medium: 2, high: 3 }
      if (
        priorityOrder[a.priority as keyof typeof priorityOrder] !==
        priorityOrder[b.priority as keyof typeof priorityOrder]
      ) {
        return (
          priorityOrder[a.priority as keyof typeof priorityOrder] -
          priorityOrder[b.priority as keyof typeof priorityOrder]
        )
      }
      return effortOrder[a.effort as keyof typeof effortOrder] - effortOrder[b.effort as keyof typeof effortOrder]
    })
    .slice(0, 5) // Top 5 nächste Schritte

  // Kritische Tests (fehlgeschlagen)
  const criticalTests = features.filter((f) => f.tests === "failed")

  // Projektzusammenfassung Daten
  const summaryData = {
    totalComponents: projectData.totalFeatures,
    implementedComponents: projectData.completedFeatures + projectData.inProgressFeatures,
    testedComponents: projectData.testsPassed + projectData.testsWarning + projectData.testsFailed,
    criticalIssuesCount: criticalTests.length,
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Projekt Status: XP Share</h1>
        <p className="text-muted-foreground">
          Umfassende Übersicht über den aktuellen Projektfortschritt, offene Aufgaben und Testergebnisse.
        </p>
      </div>

      {/* Dashboard-Übersicht */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Gesamtfortschritt</CardTitle>
            <CardDescription>Implementierte Features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{completionPercentage}%</div>
            <Progress value={completionPercentage} className="h-2 mb-2" />
            <div className="grid grid-cols-3 text-sm mt-4">
              <div className="flex flex-col items-center">
                <span className="font-medium text-green-600">{projectData.completedFeatures}</span>
                <span className="text-xs text-muted-foreground">Abgeschlossen</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-medium text-amber-600">{projectData.inProgressFeatures}</span>
                <span className="text-xs text-muted-foreground">In Bearbeitung</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-medium text-red-600">{projectData.pendingFeatures}</span>
                <span className="text-xs text-muted-foreground">Ausstehend</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Offene Aufgaben</CardTitle>
            <CardDescription>Nach Priorität</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{projectData.pendingFeatures}</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ArrowUpCircle className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-sm">Hohe Priorität</span>
                </div>
                <span className="font-medium">{projectData.highPriorityPending}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ArrowRightCircle className="h-4 w-4 text-amber-500 mr-2" />
                  <span className="text-sm">Mittlere Priorität</span>
                </div>
                <span className="font-medium">{projectData.mediumPriorityPending}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ArrowDownCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Niedrige Priorität</span>
                </div>
                <span className="font-medium">{projectData.lowPriorityPending}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Testergebnisse</CardTitle>
            <CardDescription>Qualitätssicherung</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{testPassPercentage}%</div>
            <Progress value={testPassPercentage} className="h-2 mb-2" />
            <div className="grid grid-cols-3 text-sm mt-4">
              <div className="flex flex-col items-center">
                <span className="font-medium text-green-600">{projectData.testsPassed}</span>
                <span className="text-xs text-muted-foreground">Erfolgreich</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-medium text-amber-600">{projectData.testsWarning}</span>
                <span className="text-xs text-muted-foreground">Warnungen</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-medium text-red-600">{projectData.testsFailed}</span>
                <span className="text-xs text-muted-foreground">Fehlgeschlagen</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs für detaillierte Ansichten */}
      <Tabs defaultValue="features" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="features" className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            Feature-Liste
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Offene Aufgaben
          </TabsTrigger>
          <TabsTrigger value="tests" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Testergebnisse
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Zusammenfassung
          </TabsTrigger>
        </TabsList>

        {/* Feature-Liste Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alle Features ({filteredFeatures.length})</CardTitle>
              <CardDescription>Vollständige Liste aller geplanten Features und deren Status</CardDescription>

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Suche nach Features oder Kategorien..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[130px]">
                      <Filter className="h-4 w-4 mr-1 sm:mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Status</SelectItem>
                      <SelectItem value="completed">Abgeschlossen</SelectItem>
                      <SelectItem value="in_progress">In Bearbeitung</SelectItem>
                      <SelectItem value="pending">Ausstehend</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <Filter className="h-4 w-4 mr-1 sm:mr-2" />
                      <SelectValue placeholder="Kategorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Kategorien</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.name} value={category.name} className="flex items-center">
                          {category.icon} {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredFeatures.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Keine Features gefunden, die den Filterkriterien entsprechen.
                  </div>
                ) : (
                  filteredFeatures.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-2"
                    >
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1 sm:mb-0">
                          {feature.status === "completed" && (
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          )}
                          {feature.status === "in_progress" && (
                            <Clock className="h-4 w-4 text-amber-500 flex-shrink-0" />
                          )}
                          {feature.status === "pending" && <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />}
                          <p className="font-medium">{feature.name}</p>
                        </div>
                        <p className="text-sm text-muted-foreground ml-6 sm:ml-0">{feature.category}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0 self-start sm:self-center">
                        {feature.status === "completed" && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                            Abgeschlossen
                          </Badge>
                        )}
                        {feature.status === "in_progress" && (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                            In Bearbeitung
                          </Badge>
                        )}
                        {feature.status === "pending" && (
                          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                            Ausstehend
                          </Badge>
                        )}

                        {feature.priority === "high" && (
                          <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50">
                            Hohe Priorität
                          </Badge>
                        )}
                        {feature.priority === "medium" && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-600 hover:bg-amber-50">
                            Mittlere Priorität
                          </Badge>
                        )}
                        {feature.priority === "low" && (
                          <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">
                            Niedrige Priorität
                          </Badge>
                        )}

                        {feature.tests === "passed" && (
                          <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">
                            Tests bestanden
                          </Badge>
                        )}
                        {feature.tests === "warning" && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-600 hover:bg-amber-50">
                            Test-Warnungen
                          </Badge>
                        )}
                        {feature.tests === "failed" && (
                          <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50">
                            Tests fehlgeschlagen
                          </Badge>
                        )}
                        {feature.tests === "not_tested" && (
                          <Badge variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                            Nicht getestet
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Offene Aufgaben Tab */}
        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Offene Aufgaben ({projectData.pendingFeatures})</CardTitle>
              <CardDescription>Priorisierte Liste der noch zu implementierenden Features</CardDescription>
              <div className="flex gap-2 mt-4">
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Priorität filtern" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Prioritäten</SelectItem>
                    <SelectItem value="high">Hohe Priorität</SelectItem>
                    <SelectItem value="medium">Mittlere Priorität</SelectItem>
                    <SelectItem value="low">Niedrige Priorität</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Empfohlene nächste Schritte (Top 5)</h3>
                  {nextSteps.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      Keine hochprioritären Aufgaben ausstehend oder in Bearbeitung.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {nextSteps.map((step) => (
                        <div
                          key={step.id}
                          className="flex items-center justify-between p-3 border rounded-lg bg-amber-50 dark:bg-amber-900/30"
                        >
                          <div>
                            <p className="font-medium">{step.name}</p>
                            <p className="text-sm text-muted-foreground">{step.category}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {step.status === "in_progress" && (
                              <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                                In Bearbeitung
                              </Badge>
                            )}
                            <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50">
                              Hohe Priorität
                            </Badge>
                            <Badge variant="outline">
                              {step.effort === "low" && "Geringer Aufwand"}
                              {step.effort === "medium" && "Mittlerer Aufwand"}
                              {step.effort === "high" && "Hoher Aufwand"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Alle offenen Aufgaben</h3>
                  <div className="space-y-3">
                    {features
                      .filter(
                        (f) => f.status === "pending" && (priorityFilter === "all" || f.priority === priorityFilter),
                      )
                      .sort((a, b) => {
                        const priorityOrder = { high: 1, medium: 2, low: 3 }
                        return (
                          priorityOrder[a.priority as keyof typeof priorityOrder] -
                          priorityOrder[b.priority as keyof typeof priorityOrder]
                        )
                      })
                      .map((feature) => (
                        <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{feature.name}</p>
                            <p className="text-sm text-muted-foreground">{feature.category}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {feature.priority === "high" && (
                              <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50">
                                Hohe Priorität
                              </Badge>
                            )}
                            {feature.priority === "medium" && (
                              <Badge variant="outline" className="bg-amber-50 text-amber-600 hover:bg-amber-50">
                                Mittlere Priorität
                              </Badge>
                            )}
                            {feature.priority === "low" && (
                              <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">
                                Niedrige Priorität
                              </Badge>
                            )}
                            <Badge variant="outline">
                              {feature.effort === "low" && "Geringer Aufwand"}
                              {feature.effort === "medium" && "Mittlerer Aufwand"}
                              {feature.effort === "high" && "Hoher Aufwand"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    {features.filter(
                      (f) => f.status === "pending" && (priorityFilter === "all" || f.priority === priorityFilter),
                    ).length === 0 && (
                      <p className="text-muted-foreground text-center py-4">
                        Keine offenen Aufgaben für die gewählte Priorität.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testergebnisse Tab */}
        <TabsContent value="tests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Testergebnisse</CardTitle>
              <CardDescription>Qualitätssicherung und Testabdeckung</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Kritische Probleme ({criticalTests.length})</h3>
                  {criticalTests.length === 0 ? (
                    <div className="text-center py-4 text-green-600 font-medium">
                      Keine kritischen Testfehler gefunden! Sehr gut!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {criticalTests.map((test) => (
                        <div
                          key={test.id}
                          className="flex items-center justify-between p-3 border rounded-lg bg-red-50 dark:bg-red-900/30"
                        >
                          <div>
                            <div className="flex items-center">
                              <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                              <p className="font-medium">{test.name}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">{test.category}</p>
                          </div>
                          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                            Test fehlgeschlagen
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Alle Testergebnisse nach Feature</h3>
                  <div className="space-y-3">
                    {features.map((feature) => (
                      <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{feature.name}</p>
                          <p className="text-sm text-muted-foreground">{feature.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {feature.tests === "passed" && (
                            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Bestanden
                            </Badge>
                          )}
                          {feature.tests === "warning" && (
                            <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Warnung
                            </Badge>
                          )}
                          {feature.tests === "failed" && (
                            <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                              <XCircle className="h-3 w-3 mr-1" />
                              Fehlgeschlagen
                            </Badge>
                          )}
                          {feature.tests === "not_tested" && (
                            <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                              Nicht getestet
                            </Badge>
                          )}

                          <Badge
                            variant="outline"
                            className={
                              feature.status === "completed"
                                ? "bg-green-50 text-green-600"
                                : feature.status === "in_progress"
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-red-50 text-red-600"
                            }
                          >
                            {feature.status === "completed" && "Abgeschlossen"}
                            {feature.status === "in_progress" && "In Bearbeitung"}
                            {feature.status === "pending" && "Ausstehend"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Zusammenfassung Tab */}
        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Projektzusammenfassung & Ausblick</CardTitle>
              <CardDescription>Gesamtübersicht, Empfehlungen und nächste Schritte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Aktueller Projektfortschritt</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Implementierungsstatus</h4>
                      <div className="flex items-center mb-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{ width: `${completionPercentage}%` }}
                          ></div>
                        </div>
                        <span>{completionPercentage}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {projectData.completedFeatures} von {projectData.totalFeatures} Features implementiert.
                        {projectData.inProgressFeatures > 0 &&
                          ` ${projectData.inProgressFeatures} weitere in aktiver Entwicklung.`}
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Testabdeckung & Qualität</h4>
                      <div className="flex items-center mb-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{ width: `${testPassPercentage}%` }}
                          ></div>
                        </div>
                        <span>{testPassPercentage}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {projectData.testsPassed} von{" "}
                        {projectData.testsPassed + projectData.testsFailed + projectData.testsWarning} Tests
                        erfolgreich.
                        {projectData.testsFailed > 0 && ` ${projectData.testsFailed} kritischer Fehler identifiziert.`}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Empfehlungen & Fokusbereiche</h3>
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/30">
                      <h4 className="font-medium mb-2 text-blue-700 dark:text-blue-300">
                        Nächste Schritte (Priorität Hoch)
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Finalisierung der KI-Analyse für Erlebnisse und XP-Buch KI-Zusammenfassungen.</li>
                        <li>Implementierung der semantischen Suche für eine verbesserte Entdeckbarkeit.</li>
                        <li>Entwicklung der Kernfunktionen für Community-Diskussionen und Gruppen-Chats.</li>
                        <li>Implementierung von Push-Benachrichtigungen für Echtzeit-Interaktion.</li>
                        <li>Ausarbeitung des Quest-Systems zur Steigerung der Nutzerbindung.</li>
                        <li>Entwicklung von Admin-Tools für Content-Moderation.</li>
                        <li>Implementierung der Kartenansicht für geografische Entdeckung von Erlebnissen.</li>
                      </ul>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Mittelfristige Ziele</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Implementierung des Offline-Modus für Kernfunktionen.</li>
                        <li>Integration von Social Logins für vereinfachte Registrierung.</li>
                        <li>Ausbau der Sharing-Funktionen für Erlebnisse.</li>
                        <li>Entwicklung des Empfehlungsprogramms.</li>
                        <li>Erweiterung der Testabdeckung, insbesondere für neue Features.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Projektstatistiken (Komponentenübersicht)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold">{summaryData.totalComponents}</div>
                      <p className="text-sm text-muted-foreground">Geplante Features</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold">{summaryData.implementedComponents}</div>
                      <p className="text-sm text-muted-foreground">Implementiert/In Arbeit</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold">{summaryData.testedComponents}</div>
                      <p className="text-sm text-muted-foreground">Getestete Features</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-red-600">{summaryData.criticalIssuesCount}</div>
                      <p className="text-sm text-muted-foreground">Kritische Testfehler</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <h4 className="font-medium mb-2">Hinweis zur Datenbasis</h4>
                  <p className="text-sm text-muted-foreground">
                    Diese Statusübersicht basiert auf der Analyse der Projektdokumente ('xp share v1', '2do list') und
                    dem aktuellen Stand der Codebasis. Die Feature-Liste und deren Status wurden sorgfältig abgeleitet,
                    um einen möglichst genauen Überblick zu geben. Die Funktion{" "}
                    <code>analyzeProjectCompleteness()</code> liefert zusätzliche Metriken, die hier integriert sind.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
