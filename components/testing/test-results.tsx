"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, AlertCircle, Clock, Play, FileText } from "lucide-react"

interface TestResult {
  id: string
  name: string
  status: "passed" | "failed" | "skipped" | "running"
  duration?: number
  error?: string
  component?: string
  category: string
}

export function TestResults() {
  const [activeTab, setActiveTab] = useState("all")
  const [isRunning, setIsRunning] = useState(false)

  // Beispiel-Testergebnisse
  const testResults: TestResult[] = [
    {
      id: "1",
      name: "Benutzeranmeldung sollte erfolgreich sein",
      status: "passed",
      duration: 1250,
      component: "AuthForm",
      category: "auth",
    },
    {
      id: "2",
      name: "Benutzerregistrierung sollte erfolgreich sein",
      status: "passed",
      duration: 980,
      component: "RegisterForm",
      category: "auth",
    },
    {
      id: "3",
      name: "Passwort-Zurücksetzen sollte funktionieren",
      status: "passed",
      duration: 850,
      component: "ResetPasswordForm",
      category: "auth",
    },
    {
      id: "4",
      name: "Dashboard sollte alle Komponenten anzeigen",
      status: "passed",
      duration: 1500,
      component: "Dashboard",
      category: "ui",
    },
    {
      id: "5",
      name: "Erlebnis-Erstellung sollte funktionieren",
      status: "passed",
      duration: 2100,
      component: "ExperienceForm",
      category: "experiences",
    },
    {
      id: "6",
      name: "Erlebnis-Bearbeitung sollte funktionieren",
      status: "failed",
      duration: 1800,
      component: "ExperienceForm",
      category: "experiences",
      error: "Element mit ID 'save-button' konnte nicht gefunden werden",
    },
    {
      id: "7",
      name: "Kommentare sollten hinzugefügt werden können",
      status: "passed",
      duration: 950,
      component: "CommentForm",
      category: "comments",
    },
    {
      id: "8",
      name: "Likes sollten funktionieren",
      status: "passed",
      duration: 750,
      component: "LikeButton",
      category: "interactions",
    },
    {
      id: "9",
      name: "Gruppen-Erstellung sollte funktionieren",
      status: "passed",
      duration: 1650,
      component: "GroupForm",
      category: "groups",
    },
    {
      id: "10",
      name: "Gruppenmitglieder sollten hinzugefügt werden können",
      status: "skipped",
      component: "GroupMembers",
      category: "groups",
    },
    {
      id: "11",
      name: "Privatsphäre-Einstellungen sollten gespeichert werden",
      status: "passed",
      duration: 1200,
      component: "PrivacySettings",
      category: "privacy",
    },
    {
      id: "12",
      name: "Temporäre Freigaben sollten erstellt werden können",
      status: "passed",
      duration: 1350,
      component: "TemporaryShare",
      category: "privacy",
    },
    {
      id: "13",
      name: "Quest-Fortschritt sollte aktualisiert werden",
      status: "passed",
      duration: 1100,
      component: "QuestProgress",
      category: "gamification",
    },
    {
      id: "14",
      name: "Achievements sollten freigeschaltet werden",
      status: "passed",
      duration: 950,
      component: "Achievements",
      category: "gamification",
    },
    {
      id: "15",
      name: "Echtzeit-Chat sollte Nachrichten senden",
      status: "passed",
      duration: 1800,
      component: "RealtimeChat",
      category: "realtime",
    },
  ]

  // Filtere die Testergebnisse basierend auf dem aktiven Tab
  const filteredResults =
    activeTab === "all"
      ? testResults
      : activeTab === "passed"
        ? testResults.filter((result) => result.status === "passed")
        : activeTab === "failed"
          ? testResults.filter((result) => result.status === "failed")
          : activeTab === "skipped"
            ? testResults.filter((result) => result.status === "skipped")
            : testResults.filter((result) => result.category === activeTab)

  // Berechne die Statistiken
  const stats = {
    total: testResults.length,
    passed: testResults.filter((result) => result.status === "passed").length,
    failed: testResults.filter((result) => result.status === "failed").length,
    skipped: testResults.filter((result) => result.status === "skipped").length,
    passRate: Math.round(
      (testResults.filter((result) => result.status === "passed").length / testResults.length) * 100,
    ),
  }

  // Simuliere das Ausführen der Tests
  const runTests = () => {
    setIsRunning(true)
    setTimeout(() => {
      setIsRunning(false)
    }, 3000)
  }

  // Rendere das Status-Icon
  const renderStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "passed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "skipped":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "running":
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />
    }
  }

  // Formatiere die Dauer
  const formatDuration = (duration?: number) => {
    if (!duration) return "N/A"
    return `${(duration / 1000).toFixed(2)}s`
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Testergebnisse</CardTitle>
            <CardDescription>Ergebnisse der End-to-End-Tests</CardDescription>
          </div>
          <Button onClick={runTests} disabled={isRunning}>
            <Play className={`h-4 w-4 mr-2 ${isRunning ? "animate-spin" : ""}`} />
            {isRunning ? "Tests laufen..." : "Tests ausführen"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Gesamttests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Tests insgesamt</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Bestanden</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.passed}</div>
              <p className="text-xs text-muted-foreground">Erfolgreiche Tests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Fehlgeschlagen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{stats.failed}</div>
              <p className="text-xs text-muted-foreground">Fehlgeschlagene Tests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Erfolgsrate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.passRate}%</div>
              <Progress value={stats.passRate} className="h-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="all">Alle</TabsTrigger>
            <TabsTrigger value="passed">Bestanden</TabsTrigger>
            <TabsTrigger value="failed">Fehlgeschlagen</TabsTrigger>
            <TabsTrigger value="skipped">Übersprungen</TabsTrigger>
            <TabsTrigger value="auth">Auth</TabsTrigger>
            <TabsTrigger value="ui">UI</TabsTrigger>
            <TabsTrigger value="experiences">Erlebnisse</TabsTrigger>
            <TabsTrigger value="groups">Gruppen</TabsTrigger>
            <TabsTrigger value="privacy">Privatsphäre</TabsTrigger>
            <TabsTrigger value="gamification">Gamification</TabsTrigger>
            <TabsTrigger value="realtime">Echtzeit</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Keine Testergebnisse gefunden</div>
            ) : (
              <div className="space-y-2">
                {filteredResults.map((result) => (
                  <div key={result.id} className="flex items-start space-x-3 p-3 border rounded-md">
                    {renderStatusIcon(result.status)}
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{result.name}</h3>
                        <div className="flex items-center space-x-2">
                          {result.component && <Badge variant="outline">{result.component}</Badge>}
                          <Badge variant="outline">{result.category}</Badge>
                          {result.duration && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              {formatDuration(result.duration)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {result.error && <p className="text-sm text-red-500">{result.error}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Bericht exportieren
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
