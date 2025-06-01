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
} from "lucide-react"
import { analyzeProjectCompleteness } from "@/lib/project-completeness-check"

export default function ProjektStatus() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  // Simulierte Projektdaten
  const projectData = {
    completeness: analyzeProjectCompleteness(),
    totalFeatures: 120,
    completedFeatures: 87,
    inProgressFeatures: 22,
    pendingFeatures: 11,
    highPriorityPending: 4,
    mediumPriorityPending: 5,
    lowPriorityPending: 2,
    testsPassed: 92,
    testsFailed: 3,
    testsWarning: 5,
  }

  // Berechne Prozentsätze
  const completionPercentage = Math.round((projectData.completedFeatures / projectData.totalFeatures) * 100)
  const testPassPercentage = Math.round(
    (projectData.testsPassed / (projectData.testsPassed + projectData.testsFailed + projectData.testsWarning)) * 100,
  )

  // Feature-Kategorien
  const categories = [
    "Benutzeroberfläche",
    "Authentifizierung",
    "Erlebnisse",
    "Community",
    "Nachrichten",
    "Gamification",
    "Suche",
    "Profile",
    "XP-Buch",
    "Einstellungen",
    "Deployment",
    "Empfehlungsprogramm",
  ]

  // Simulierte Feature-Liste
  const features = [
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
      name: "Erlebnis-Wizard",
      category: "Erlebnisse",
      status: "completed",
      priority: "high",
      effort: "high",
      tests: "passed",
    },
    {
      id: 3,
      name: "Authentifizierung mit Supabase",
      category: "Authentifizierung",
      status: "completed",
      priority: "high",
      effort: "medium",
      tests: "passed",
    },
    {
      id: 4,
      name: "Community-Gruppen",
      category: "Community",
      status: "in_progress",
      priority: "medium",
      effort: "high",
      tests: "warning",
    },
    {
      id: 5,
      name: "Echtzeit-Nachrichten",
      category: "Nachrichten",
      status: "in_progress",
      priority: "high",
      effort: "high",
      tests: "warning",
    },
    {
      id: 6,
      name: "Leaderboard",
      category: "Gamification",
      status: "completed",
      priority: "medium",
      effort: "low",
      tests: "passed",
    },
    {
      id: 7,
      name: "Semantische Suche",
      category: "Suche",
      status: "pending",
      priority: "high",
      effort: "high",
      tests: "failed",
    },
    {
      id: 8,
      name: "Profilbearbeitung",
      category: "Profile",
      status: "completed",
      priority: "medium",
      effort: "medium",
      tests: "passed",
    },
    {
      id: 9,
      name: "XP-Buch Einträge",
      category: "XP-Buch",
      status: "completed",
      priority: "high",
      effort: "medium",
      tests: "passed",
    },
    {
      id: 10,
      name: "Datenschutzeinstellungen",
      category: "Einstellungen",
      status: "in_progress",
      priority: "medium",
      effort: "medium",
      tests: "warning",
    },
    {
      id: 11,
      name: "Vercel Deployment",
      category: "Deployment",
      status: "completed",
      priority: "high",
      effort: "low",
      tests: "passed",
    },
    {
      id: 12,
      name: "Freunde-Einladung",
      category: "Empfehlungsprogramm",
      status: "pending",
      priority: "low",
      effort: "medium",
      tests: "failed",
    },
    {
      id: 13,
      name: "Offline-Modus",
      category: "Benutzeroberfläche",
      status: "pending",
      priority: "medium",
      effort: "high",
      tests: "failed",
    },
    {
      id: 14,
      name: "Push-Benachrichtigungen",
      category: "Nachrichten",
      status: "pending",
      priority: "medium",
      effort: "medium",
      tests: "not_tested",
    },
    {
      id: 15,
      name: "KI-Empfehlungen",
      category: "Erlebnisse",
      status: "in_progress",
      priority: "high",
      effort: "high",
      tests: "warning",
    },
  ]

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

  // Empfohlene nächste Schritte (Features mit hoher Priorität, die noch ausstehen)
  const nextSteps = features
    .filter((f) => f.status === "pending" && f.priority === "high")
    .sort((a, b) => {
      // Sortiere nach Priorität und dann nach Aufwand (niedrigerer Aufwand zuerst)
      const effortOrder = { low: 1, medium: 2, high: 3 }
      return effortOrder[a.effort as keyof typeof effortOrder] - effortOrder[b.effort as keyof typeof effortOrder]
    })

  // Kritische Tests (fehlgeschlagen)
  const criticalTests = features.filter((f) => f.tests === "failed")

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Projekt Status</h1>
        <p className="text-muted-foreground">
          Umfassende Übersicht über den aktuellen Projektstatus, offene Aufgaben und Testergebnisse
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
        <TabsList className="grid w-full grid-cols-4">
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
              <CardTitle>Alle Features</CardTitle>
              <CardDescription>Vollständige Liste aller geplanten Features und deren Status</CardDescription>

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Suche nach Features..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px]">
                      <Filter className="h-4 w-4 mr-2" />
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
                    <SelectTrigger className="w-[150px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Kategorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Kategorien</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
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
                    <div key={feature.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          {feature.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {feature.status === "in_progress" && <Clock className="h-4 w-4 text-amber-500" />}
                          {feature.status === "pending" && <XCircle className="h-4 w-4 text-red-500" />}
                          <p className="font-medium">{feature.name}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{feature.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
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
              <CardTitle>Offene Aufgaben</CardTitle>
              <CardDescription>Priorisierte Liste der noch zu implementierenden Features</CardDescription>

              <div className="flex gap-2 mt-4">
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Priorität" />
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
                  <h3 className="text-lg font-medium mb-4">Empfohlene nächste Schritte</h3>
                  {nextSteps.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      Keine hochprioritären Aufgaben ausstehend.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {nextSteps.map((step) => (
                        <div
                          key={step.id}
                          className="flex items-center justify-between p-3 border rounded-lg bg-amber-50"
                        >
                          <div>
                            <p className="font-medium">{step.name}</p>
                            <p className="text-sm text-muted-foreground">{step.category}</p>
                          </div>
                          <div className="flex items-center gap-2">
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
                  <h3 className="text-lg font-medium mb-4">Kritische Probleme</h3>
                  {criticalTests.length === 0 ? (
                    <div className="text-center py-4 text-green-600 font-medium">
                      Keine kritischen Testfehler gefunden!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {criticalTests.map((test) => (
                        <div
                          key={test.id}
                          className="flex items-center justify-between p-3 border rounded-lg bg-red-50"
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
                  <h3 className="text-lg font-medium mb-4">Alle Testergebnisse</h3>
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
              <CardTitle>Projektzusammenfassung</CardTitle>
              <CardDescription>Gesamtübersicht und Empfehlungen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Projektfortschritt</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Implementierungsstatus</h4>
                      <div className="flex items-center mb-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{ width: `${completionPercentage}%` }}
                          ></div>
                        </div>
                        <span>{completionPercentage}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {projectData.completedFeatures} von {projectData.totalFeatures} Features implementiert
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Testabdeckung</h4>
                      <div className="flex items-center mb-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{ width: `${testPassPercentage}%` }}
                          ></div>
                        </div>
                        <span>{testPassPercentage}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {projectData.testsPassed} von{" "}
                        {projectData.testsPassed + projectData.testsFailed + projectData.testsWarning} Tests erfolgreich
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Empfehlungen</h3>
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Nächste Schritte</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Implementierung der semantischen Suche (hohe Priorität)</li>
                        <li>Fertigstellung der Echtzeit-Nachrichten-Funktionalität</li>
                        <li>Behebung der fehlgeschlagenen Tests für Offline-Modus</li>
                        <li>Implementierung der Push-Benachrichtigungen</li>
                      </ul>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Verbesserungspotenzial</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Performance-Optimierung für mobile Geräte</li>
                        <li>Erhöhung der Testabdeckung für KI-Funktionen</li>
                        <li>Verbesserung der Barrierefreiheit</li>
                        <li>Optimierung der Ladezeiten für Medieninhalte</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Projektstatistiken</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold">{projectData.completeness.totalComponents}</div>
                      <p className="text-sm text-muted-foreground">Komponenten</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold">{projectData.completeness.implementedComponents}</div>
                      <p className="text-sm text-muted-foreground">Implementiert</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold">{projectData.completeness.testedComponents}</div>
                      <p className="text-sm text-muted-foreground">Getestet</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold">{projectData.completeness.criticalIssues.length}</div>
                      <p className="text-sm text-muted-foreground">Kritische Probleme</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
