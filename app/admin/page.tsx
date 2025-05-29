"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  MessageSquare,
  TrendingUp,
  Shield,
  Settings,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
} from "lucide-react"

export default function AdminPage() {
  const stats = {
    totalUsers: 12847,
    activeUsers: 8934,
    totalExperiences: 45621,
    totalMessages: 123456,
    reportedContent: 23,
    pendingApprovals: 12,
  }

  const recentActivity = [
    { id: 1, type: "user_registered", user: "max_mustermann", time: "vor 5 Min" },
    { id: 2, type: "experience_shared", user: "anna_schmidt", time: "vor 12 Min" },
    { id: 3, type: "content_reported", user: "system", time: "vor 23 Min" },
    { id: 4, type: "achievement_unlocked", user: "tom_weber", time: "vor 1 Std" },
  ]

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Übersicht und Verwaltung der XP-Share Plattform</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Benutzer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{stats.activeUsers.toLocaleString()} aktiv</p>
            <Progress value={70} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Erlebnisse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExperiences.toLocaleString()}</div>
            <p className="text-xs text-green-600">+12% diese Woche</p>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Nachrichten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages.toLocaleString()}</div>
            <p className="text-xs text-green-600">+8% diese Woche</p>
            <Progress value={92} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Moderierung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reportedContent}</div>
            <p className="text-xs text-orange-600">{stats.pendingApprovals} ausstehend</p>
            <Progress value={15} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Übersicht
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Benutzer
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Inhalte
          </TabsTrigger>
          <TabsTrigger value="moderation" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Moderierung
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Einstellungen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Letzte Aktivitäten</CardTitle>
                <CardDescription>Die neuesten Ereignisse auf der Plattform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span>
                          {activity.type === "user_registered" && " hat sich registriert"}
                          {activity.type === "experience_shared" && " hat ein Erlebnis geteilt"}
                          {activity.type === "content_reported" && " Inhalt wurde gemeldet"}
                          {activity.type === "achievement_unlocked" && " hat ein Achievement freigeschaltet"}
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System-Status</CardTitle>
                <CardDescription>Aktuelle Systemleistung und -gesundheit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">API-Server</span>
                    </div>
                    <Badge variant="secondary" className="text-green-600">
                      Online
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Datenbank</span>
                    </div>
                    <Badge variant="secondary" className="text-green-600">
                      Optimal
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">CDN</span>
                    </div>
                    <Badge variant="secondary" className="text-yellow-600">
                      Langsam
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">E-Mail-Service</span>
                    </div>
                    <Badge variant="secondary" className="text-green-600">
                      Online
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Benutzerverwaltung</CardTitle>
              <CardDescription>Verwalte Benutzerkonten und -berechtigungen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>MM</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Max Mustermann</p>
                      <p className="text-sm text-muted-foreground">max@example.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>Admin</Badge>
                    <Button variant="outline" size="sm">
                      Bearbeiten
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>AS</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Anna Schmidt</p>
                      <p className="text-sm text-muted-foreground">anna@example.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Moderator</Badge>
                    <Button variant="outline" size="sm">
                      Bearbeiten
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>TW</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Tom Weber</p>
                      <p className="text-sm text-muted-foreground">tom@example.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Benutzer</Badge>
                    <Button variant="outline" size="sm">
                      Bearbeiten
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inhaltsverwaltung</CardTitle>
              <CardDescription>Übersicht über alle Inhalte auf der Plattform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{stats.totalExperiences.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Erlebnisse</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">8,234</div>
                  <p className="text-sm text-muted-foreground">Kommentare</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">1,567</div>
                  <p className="text-sm text-muted-foreground">Medien-Dateien</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Moderierung</CardTitle>
              <CardDescription>Gemeldete Inhalte und ausstehende Genehmigungen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Unangemessener Kommentar gemeldet</p>
                    <p className="text-sm text-muted-foreground">Von: anna_schmidt • vor 2 Stunden</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Genehmigen
                    </Button>
                    <Button size="sm" variant="destructive">
                      <XCircle className="h-4 w-4 mr-1" />
                      Ablehnen
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Spam-Erlebnis gemeldet</p>
                    <p className="text-sm text-muted-foreground">Von: tom_weber • vor 4 Stunden</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Genehmigen
                    </Button>
                    <Button size="sm" variant="destructive">
                      <XCircle className="h-4 w-4 mr-1" />
                      Ablehnen
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Detaillierte Statistiken und Trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Benutzeraktivität</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Täglich aktive Benutzer</span>
                      <span className="text-sm font-medium">2,847</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Wöchentlich aktive Benutzer</span>
                      <span className="text-sm font-medium">8,934</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Monatlich aktive Benutzer</span>
                      <span className="text-sm font-medium">12,847</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Engagement</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Durchschnittliche Sitzungsdauer</span>
                      <span className="text-sm font-medium">12 Min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Erlebnisse pro Benutzer</span>
                      <span className="text-sm font-medium">3.6</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Kommentare pro Erlebnis</span>
                      <span className="text-sm font-medium">2.1</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System-Einstellungen</CardTitle>
              <CardDescription>Konfiguration der Plattform-Einstellungen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Allgemeine Einstellungen</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Neue Registrierungen erlauben</span>
                      <Button variant="outline" size="sm">
                        Aktiviert
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Wartungsmodus</span>
                      <Button variant="outline" size="sm">
                        Deaktiviert
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">E-Mail-Benachrichtigungen</span>
                      <Button variant="outline" size="sm">
                        Aktiviert
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Sicherheitseinstellungen</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Zwei-Faktor-Authentifizierung</span>
                      <Button variant="outline" size="sm">
                        Erforderlich
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Passwort-Komplexität</span>
                      <Button variant="outline" size="sm">
                        Hoch
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Session-Timeout</span>
                      <Button variant="outline" size="sm">
                        24 Stunden
                      </Button>
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
