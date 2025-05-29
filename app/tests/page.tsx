"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TestResults } from "@/components/testing/test-results"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { CheckCircle2, Code, FileText, Play, Settings } from "lucide-react"

export default function TestsPage() {
  const [activeTab, setActiveTab] = useState("results")

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Tests</h1>
          <p className="text-muted-foreground">Übersicht der Testergebnisse und Testabdeckung</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Einstellungen
          </Button>
          <Button>
            <Play className="h-4 w-4 mr-2" />
            Alle Tests ausführen
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Testabdeckung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Codeabdeckung</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Erfolgsrate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                93%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">14/15 Tests bestanden</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Letzte Ausführung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">Vor 2 Stunden</div>
            <p className="text-xs text-muted-foreground">29. Mai 2025, 00:56 Uhr</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Testdauer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.2s</div>
            <p className="text-xs text-muted-foreground">Gesamtdauer</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="results">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Testergebnisse
          </TabsTrigger>
          <TabsTrigger value="coverage">
            <Code className="h-4 w-4 mr-2" />
            Codeabdeckung
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileText className="h-4 w-4 mr-2" />
            Testberichte
          </TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-4">
          <TestResults />
        </TabsContent>

        <TabsContent value="coverage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Codeabdeckung</CardTitle>
              <CardDescription>Detaillierte Übersicht der Testabdeckung nach Komponenten</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 border rounded-md">
                <h3 className="font-medium mb-2">Abdeckungsübersicht</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Anweisungen</p>
                    <p className="text-2xl font-bold">94%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Zweige</p>
                    <p className="text-2xl font-bold">89%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Funktionen</p>
                    <p className="text-2xl font-bold">92%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Zeilen</p>
                    <p className="text-2xl font-bold">93%</p>
                  </div>
                </div>
              </div>

              <div className="p-3 border rounded-md">
                <h3 className="font-medium mb-2">Abdeckung nach Komponenten</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auth-Komponenten</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      98%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">UI-Komponenten</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      95%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Erlebnis-Komponenten</span>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      87%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Gruppen-Komponenten</span>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      85%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Privatsphäre-Komponenten</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      94%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Gamification-Komponenten</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      96%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Echtzeit-Komponenten</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      92%
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline">Abdeckungsbericht anzeigen</Button>
                <Button variant="outline">Bericht exportieren</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Testberichte</CardTitle>
              <CardDescription>Historische Testberichte und Trends</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 border rounded-md">
                <h3 className="font-medium mb-2">Letzte Testberichte</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div>
                      <p className="text-sm font-medium">29. Mai 2025, 00:56 Uhr</p>
                      <p className="text-xs text-muted-foreground">14/15 Tests bestanden (93%)</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Anzeigen
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div>
                      <p className="text-sm font-medium">28. Mai 2025, 18:30 Uhr</p>
                      <p className="text-xs text-muted-foreground">13/15 Tests bestanden (87%)</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Anzeigen
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div>
                      <p className="text-sm font-medium">28. Mai 2025, 12:15 Uhr</p>
                      <p className="text-xs text-muted-foreground">12/15 Tests bestanden (80%)</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Anzeigen
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div>
                      <p className="text-sm font-medium">27. Mai 2025, 16:45 Uhr</p>
                      <p className="text-xs text-muted-foreground">15/15 Tests bestanden (100%)</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Anzeigen
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-3 border rounded-md">
                <h3 className="font-medium mb-2">Testtrends</h3>
                <p className="text-sm text-muted-foreground">
                  Die Testabdeckung hat sich in den letzten 7 Tagen um 5% verbessert.
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline">Alle Berichte anzeigen</Button>
                <Button>Neuen Bericht erstellen</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
