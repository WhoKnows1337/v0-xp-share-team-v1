"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Bell, Shield, User, Globe, Palette, Database, Trash2, Download } from "lucide-react"

export default function EinstellungenPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    mentions: true,
    comments: false,
    achievements: true,
  })

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    experiencesPublic: false,
    locationSharing: true,
    analyticsOptOut: false,
  })

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Einstellungen</h1>
        <p className="text-muted-foreground">Verwalte deine Konto- und Anwendungseinstellungen</p>
      </div>

      <Tabs defaultValue="profil" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profil" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="benachrichtigungen" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Benachrichtigungen
          </TabsTrigger>
          <TabsTrigger value="privatsphare" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privatsphäre
          </TabsTrigger>
          <TabsTrigger value="sprache" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Sprache
          </TabsTrigger>
          <TabsTrigger value="design" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Design
          </TabsTrigger>
          <TabsTrigger value="daten" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Daten
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profil" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profil-Informationen</CardTitle>
              <CardDescription>Aktualisiere deine persönlichen Informationen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" />
                  <AvatarFallback>MU</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline">Foto ändern</Button>
                  <Button variant="ghost" size="sm">
                    Entfernen
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Benutzername</Label>
                  <Input id="username" defaultValue="max_mustermann" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <Input id="email" type="email" defaultValue="max@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Erzähle etwas über dich..."
                  defaultValue="Leidenschaftlicher Erlebnis-Sammler und Geschichtenerzähler."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Standort</Label>
                <Input id="location" defaultValue="Hamburg, Deutschland" />
              </div>

              <Button>Änderungen speichern</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benachrichtigungen" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Benachrichtigungseinstellungen</CardTitle>
              <CardDescription>Wähle, wie du benachrichtigt werden möchtest</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>E-Mail-Benachrichtigungen</Label>
                    <p className="text-sm text-muted-foreground">Erhalte Updates per E-Mail</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, email: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push-Benachrichtigungen</Label>
                    <p className="text-sm text-muted-foreground">Browser-Benachrichtigungen</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, push: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Erwähnungen</Label>
                    <p className="text-sm text-muted-foreground">Wenn dich jemand erwähnt</p>
                  </div>
                  <Switch
                    checked={notifications.mentions}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, mentions: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Kommentare</Label>
                    <p className="text-sm text-muted-foreground">Neue Kommentare zu deinen Erlebnissen</p>
                  </div>
                  <Switch
                    checked={notifications.comments}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, comments: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Achievements</Label>
                    <p className="text-sm text-muted-foreground">Neue Erfolge und Meilensteine</p>
                  </div>
                  <Switch
                    checked={notifications.achievements}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, achievements: checked }))}
                  />
                </div>
              </div>

              <Button>Einstellungen speichern</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privatsphare" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privatsphäre-Einstellungen</CardTitle>
              <CardDescription>Kontrolliere deine Sichtbarkeit und Datenfreigabe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Profil öffentlich sichtbar</Label>
                    <p className="text-sm text-muted-foreground">Andere können dein Profil finden</p>
                  </div>
                  <Switch
                    checked={privacy.profileVisible}
                    onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, profileVisible: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Erlebnisse öffentlich</Label>
                    <p className="text-sm text-muted-foreground">Deine Erlebnisse sind für alle sichtbar</p>
                  </div>
                  <Switch
                    checked={privacy.experiencesPublic}
                    onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, experiencesPublic: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Standort teilen</Label>
                    <p className="text-sm text-muted-foreground">Standortdaten in Erlebnissen anzeigen</p>
                  </div>
                  <Switch
                    checked={privacy.locationSharing}
                    onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, locationSharing: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Analytics deaktivieren</Label>
                    <p className="text-sm text-muted-foreground">Keine Nutzungsstatistiken sammeln</p>
                  </div>
                  <Switch
                    checked={privacy.analyticsOptOut}
                    onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, analyticsOptOut: checked }))}
                  />
                </div>
              </div>

              <Button>Einstellungen speichern</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sprache" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sprach- und Regioneinstellungen</CardTitle>
              <CardDescription>Wähle deine bevorzugte Sprache und Region</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Sprache</Label>
                  <Select defaultValue="de">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Zeitzone</Label>
                  <Select defaultValue="europe/berlin">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="europe/berlin">Europa/Berlin</SelectItem>
                      <SelectItem value="europe/london">Europa/London</SelectItem>
                      <SelectItem value="america/new_york">Amerika/New York</SelectItem>
                      <SelectItem value="asia/tokyo">Asien/Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Datumsformat</Label>
                  <Select defaultValue="dd.mm.yyyy">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd.mm.yyyy">DD.MM.YYYY</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button>Einstellungen speichern</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="design" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Design-Einstellungen</CardTitle>
              <CardDescription>Personalisiere das Aussehen der Anwendung</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select defaultValue="system">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Hell</SelectItem>
                      <SelectItem value="dark">Dunkel</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Akzentfarbe</Label>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-primary"></div>
                    <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-transparent"></div>
                    <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-transparent"></div>
                    <div className="w-8 h-8 rounded-full bg-orange-500 border-2 border-transparent"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Schriftgröße</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Klein</SelectItem>
                      <SelectItem value="medium">Mittel</SelectItem>
                      <SelectItem value="large">Groß</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button>Einstellungen speichern</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daten" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Datenmanagement</CardTitle>
              <CardDescription>Verwalte deine Daten und Konto-Optionen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Daten exportieren</h4>
                    <p className="text-sm text-muted-foreground">Lade alle deine Daten herunter</p>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Cache leeren</h4>
                    <p className="text-sm text-muted-foreground">Lokale Daten löschen</p>
                  </div>
                  <Button variant="outline">Cache leeren</Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 border border-destructive rounded-lg">
                  <div>
                    <h4 className="font-medium text-destructive">Konto löschen</h4>
                    <p className="text-sm text-muted-foreground">Alle Daten permanent entfernen</p>
                  </div>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Konto löschen
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
