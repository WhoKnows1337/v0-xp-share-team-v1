"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DeploymentChecklist } from "@/components/deployment/deployment-checklist"
import { EnvironmentVariables } from "@/components/deployment/environment-variables"
import { BuildOptimizations } from "@/components/deployment/build-optimizations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Rocket, Settings, Database, Code, Server } from "lucide-react"

export default function DeploymentPage() {
  const [activeTab, setActiveTab] = useState("checklist")

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Deployment</h1>
          <p className="text-muted-foreground">Verwalte das Deployment deiner Anwendung</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Einstellungen
          </Button>
          <Button>
            <Rocket className="h-4 w-4 mr-2" />
            Jetzt deployen
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Umgebung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Entwicklung</div>
            <p className="text-xs text-muted-foreground">Aktuelle Umgebung</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Build-Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Erfolgreich
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Letzter Build: vor 2 Stunden</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Deployment-URL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">https://xp-share.vercel.app</div>
            <p className="text-xs text-muted-foreground">Produktions-URL</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Supabase-Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Verbunden
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Datenbank ist online</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="checklist">
            <Server className="h-4 w-4 mr-2" />
            Checkliste
          </TabsTrigger>
          <TabsTrigger value="environment">
            <Settings className="h-4 w-4 mr-2" />
            Umgebungsvariablen
          </TabsTrigger>
          <TabsTrigger value="build">
            <Code className="h-4 w-4 mr-2" />
            Build-Optimierungen
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="h-4 w-4 mr-2" />
            Datenbank
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checklist" className="space-y-4">
          <DeploymentChecklist />
        </TabsContent>

        <TabsContent value="environment" className="space-y-4">
          <EnvironmentVariables />
        </TabsContent>

        <TabsContent value="build" className="space-y-4">
          <BuildOptimizations />
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supabase-Datenbank</CardTitle>
              <CardDescription>Verwalte deine Supabase-Datenbank</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 border rounded-md">
                <h3 className="font-medium mb-2">Datenbank-Informationen</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Version</span>
                    <span className="text-sm">PostgreSQL 14.1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Region</span>
                    <span className="text-sm">Frankfurt (eu-central-1)</span>
                  </div>
                </div>
              </div>

              <div className="p-3 border rounded-md">
                <h3 className="font-medium mb-2">Tabellen</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">users</span>
                    <Badge variant="outline">250 Einträge</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">experiences</span>
                    <Badge variant="outline">1.250 Einträge</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">groups</span>
                    <Badge variant="outline">45 Einträge</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">messages</span>
                    <Badge variant="outline">3.780 Einträge</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">comments</span>
                    <Badge variant="outline">890 Einträge</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">activities</span>
                    <Badge variant="outline">4.560 Einträge</Badge>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline">Datenbank-Backup</Button>
                <Button variant="outline">SQL-Editor öffnen</Button>
                <Button>Zum Supabase-Dashboard</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
