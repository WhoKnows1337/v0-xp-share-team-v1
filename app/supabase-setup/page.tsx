"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SupabaseConfig } from "@/components/deployment/supabase-config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Database, Users, Table, Settings } from "lucide-react"

export default function SupabaseSetupPage() {
  const [activeTab, setActiveTab] = useState("config")

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Supabase-Setup</h1>
          <p className="text-muted-foreground">Konfiguriere deine Supabase-Produktionsumgebung</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Einstellungen
          </Button>
          <Button>
            <Database className="h-4 w-4 mr-2" />
            Zum Supabase-Dashboard
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Datenbank-Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Online
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">PostgreSQL 14.1</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tabellen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Tabellen konfiguriert</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Auth-Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Konfiguriert
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">E-Mail, Magic Link</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Buckets konfiguriert</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="config">
            <Settings className="h-4 w-4 mr-2" />
            Konfiguration
          </TabsTrigger>
          <TabsTrigger value="schema">
            <Table className="h-4 w-4 mr-2" />
            Datenbankschema
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Benutzerverwaltung
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <SupabaseConfig />
        </TabsContent>

        <TabsContent value="schema" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Datenbankschema</CardTitle>
              <CardDescription>Übersicht des Datenbankschemas für die Produktionsumgebung</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 border rounded-md">
                <h3 className="font-medium mb-2">Tabellen</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <div className="p-2 bg-muted rounded-md">
                    <p className="text-sm font-medium">profiles</p>
                    <p className="text-xs text-muted-foreground">Benutzerprofile</p>
                  </div>
                  <div className="p-2 bg-muted rounded-md">
                    <p className="text-sm font-medium">experiences</p>
                    <p className="text-xs text-muted-foreground">Erlebnisse</p>
                  </div>
                  <div className="p-2 bg-muted rounded-md">
                    <p className="text-sm font-medium">groups</p>
                    <p className="text-xs text-muted-foreground">Gruppen</p>
                  </div>
                  <div className="p-2 bg-muted rounded-md">
                    <p className="text-sm font-medium">group_members</p>
                    <p className="text-xs text-muted-foreground">Gruppenmitglieder</p>
                  </div>
                  <div className="p-2 bg-muted rounded-md">
                    <p className="text-sm font-medium">group_experiences</p>
                    <p className="text-xs text-muted-foreground">Gruppen-Erlebnisse</p>
                  </div>
                  <div className="p-2 bg-muted rounded-md">
                    <p className="text-sm font-medium">comments</p>
                    <p className="text-xs text-muted-foreground">Kommentare</p>
                  </div>
                  <div className="p-2 bg-muted rounded-md">
                    <p className="text-sm font-medium">likes</p>
                    <p className="text-xs text-muted-foreground">Likes</p>
                  </div>
                  <div className="p-2 bg-muted rounded-md">
                    <p className="text-sm font-medium">bookmarks</p>
                    <p className="text-xs text-muted-foreground">Lesezeichen</p>
                  </div>
                  <div className="p-2 bg-muted rounded-md">
                    <p className="text-sm font-medium">messages</p>
                    <p className="text-xs text-muted-foreground">Nachrichten</p>
                  </div>
                  <div className="p-2 bg-muted rounded-md">
                    <p className="text-sm font-medium">activities</p>
                    <p className="text-xs text-muted-foreground">Aktivitäten</p>
                  </div>
                  <div className="p-2 bg-muted rounded-md">
                    <p className="text-sm font-medium">achievements</p>
                    <p className="text-xs text-muted-foreground">Achievements</p>
                  </div>
                  <div className="p-2 bg-muted rounded-md">
                    <p className="text-sm font-medium">user_achievements</p>
                    <p className="text-xs text-muted-foreground">Benutzer-Achievements</p>
                  </div>
                  <div className="p-2 bg-muted rounded-md">
                    <p className="text-sm font-medium">quests</p>
                    <p className="text-xs text-muted-foreground">Quests</p>
                  </div>
                  <div className="p-2 bg-muted rounded-md">
                    <p className="text-sm font-medium">user_quests</p>
                    <p className="text-xs text-muted-foreground">Benutzer-Quests</p>
                  </div>
                  <div className="p-2 bg-muted rounded-md">
                    <p className="text-sm font-medium">privacy_settings</p>
                    <p className="text-xs text-muted-foreground">Privatsphäre-Einstellungen</p>
                  </div>
                  <div className="p-2 bg-muted rounded-md">
                    <p className="text-sm font-medium">temporary_shares</p>
                    <p className="text-xs text-muted-foreground">Temporäre Freigaben</p>
                  </div>
                  <div className="p-2 bg-muted rounded-md">
                    <p className="text-sm font-medium">health_check</p>
                    <p className="text-xs text-muted-foreground">Gesundheitscheck</p>
                  </div>
                </div>
              </div>

              <div className="p-3 border rounded-md">
                <h3 className="font-medium mb-2">Indizes</h3>
                <p className="text-sm text-muted-foreground">
                  Es wurden 24 Indizes für optimale Abfrageleistung erstellt.
                </p>
              </div>

              <div className="p-3 border rounded-md">
                <h3 className="font-medium mb-2">Funktionen und Trigger</h3>
                <p className="text-sm text-muted-foreground">
                  Es wurden 6 Funktionen und 10 Trigger für automatische Aktualisierungen erstellt.
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline">Schema exportieren</Button>
                <Button variant="outline">SQL-Editor öffnen</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Benutzerverwaltung</CardTitle>
              <CardDescription>Verwalte Benutzer in der Supabase-Produktionsumgebung</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 border rounded-md">
                <h3 className="font-medium mb-2">Benutzerstatistiken</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Gesamtbenutzer</p>
                    <p className="text-2xl font-bold">250</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bestätigte E-Mails</p>
                    <p className="text-2xl font-bold">235</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Aktive Benutzer</p>
                    <p className="text-2xl font-bold">180</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Neue Benutzer (30 Tage)</p>
                    <p className="text-2xl font-bold">45</p>
                  </div>
                </div>
              </div>

              <div className="p-3 border rounded-md">
                <h3 className="font-medium mb-2">Benutzerrollen</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Administratoren</span>
                    <Badge variant="outline">5</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Moderatoren</span>
                    <Badge variant="outline">15</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Premium-Benutzer</span>
                    <Badge variant="outline">50</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Standardbenutzer</span>
                    <Badge variant="outline">180</Badge>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline">Benutzer exportieren</Button>
                <Button variant="outline">Benutzer einladen</Button>
                <Button>Benutzerliste anzeigen</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
