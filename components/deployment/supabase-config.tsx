"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Database, Lock, Shield, Table } from "lucide-react"

export function SupabaseConfig() {
  const [activeTab, setActiveTab] = useState("database")
  const [authSettings, setAuthSettings] = useState({
    emailAuth: true,
    googleAuth: false,
    githubAuth: false,
    facebookAuth: false,
    twitterAuth: false,
    appleAuth: false,
    phoneAuth: false,
    magicLinkAuth: true,
    passwordlessAuth: true,
    emailConfirmation: true,
    inviteOnly: false,
  })

  // Ändere den Status einer Auth-Einstellung
  const toggleAuthSetting = (key: keyof typeof authSettings) => {
    setAuthSettings({ ...authSettings, [key]: !authSettings[key] })
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle>Supabase-Konfiguration</CardTitle>
        <CardDescription>Konfiguriere deine Supabase-Produktionsumgebung</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="database">
              <Database className="h-4 w-4 mr-2" />
              Datenbank
            </TabsTrigger>
            <TabsTrigger value="auth">
              <Lock className="h-4 w-4 mr-2" />
              Authentifizierung
            </TabsTrigger>
            <TabsTrigger value="storage">
              <Table className="h-4 w-4 mr-2" />
              Storage
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Sicherheit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="database" className="space-y-4">
            <div className="p-3 border rounded-md">
              <h3 className="font-medium mb-2">Datenbank-Einstellungen</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">PostgreSQL-Version</span>
                  <Badge variant="outline">14.1</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Region</span>
                  <Badge variant="outline">Frankfurt (eu-central-1)</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Compute-Größe</span>
                  <Badge variant="outline">Small</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Speicherplatz</span>
                  <Badge variant="outline">8 GB</Badge>
                </div>
              </div>
            </div>

            <div className="p-3 border rounded-md">
              <h3 className="font-medium mb-2">Tabellen-Setup</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    SQL-Editor öffnen
                  </Button>
                  <Button variant="outline" size="sm">
                    Schema importieren
                  </Button>
                  <Button size="sm">Tabellen erstellen</Button>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Verwende die SQL-Datei <code>lib/deployment/supabase-setup.sql</code>, um die erforderlichen Tabellen
                  zu erstellen.
                </div>
              </div>
            </div>

            <div className="p-3 border rounded-md">
              <h3 className="font-medium mb-2">Datenbank-Backups</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Automatische Backups</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Aktiviert
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Backup-Intervall</span>
                  <Badge variant="outline">Täglich</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Aufbewahrungszeitraum</span>
                  <Badge variant="outline">7 Tage</Badge>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Button variant="outline" size="sm">
                    Manuelles Backup erstellen
                  </Button>
                  <Button variant="outline" size="sm">
                    Backup wiederherstellen
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="auth" className="space-y-4">
            <div className="p-3 border rounded-md">
              <h3 className="font-medium mb-2">Authentifizierungsmethoden</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="emailAuth"
                    checked={authSettings.emailAuth}
                    onCheckedChange={() => toggleAuthSetting("emailAuth")}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="emailAuth" className="font-medium">
                      E-Mail-Authentifizierung
                    </Label>
                    <p className="text-sm text-muted-foreground">Ermöglicht die Anmeldung mit E-Mail und Passwort.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="googleAuth"
                    checked={authSettings.googleAuth}
                    onCheckedChange={() => toggleAuthSetting("googleAuth")}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="googleAuth" className="font-medium">
                      Google-Authentifizierung
                    </Label>
                    <p className="text-sm text-muted-foreground">Ermöglicht die Anmeldung mit einem Google-Konto.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="magicLinkAuth"
                    checked={authSettings.magicLinkAuth}
                    onCheckedChange={() => toggleAuthSetting("magicLinkAuth")}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="magicLinkAuth" className="font-medium">
                      Magic Link
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Ermöglicht die Anmeldung über einen Link, der per E-Mail gesendet wird.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="passwordlessAuth"
                    checked={authSettings.passwordlessAuth}
                    onCheckedChange={() => toggleAuthSetting("passwordlessAuth")}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="passwordlessAuth" className="font-medium">
                      Passwortlose Authentifizierung
                    </Label>
                    <p className="text-sm text-muted-foreground">Ermöglicht die Anmeldung ohne Passwort.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 border rounded-md">
              <h3 className="font-medium mb-2">Authentifizierungseinstellungen</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="emailConfirmation"
                    checked={authSettings.emailConfirmation}
                    onCheckedChange={() => toggleAuthSetting("emailConfirmation")}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="emailConfirmation" className="font-medium">
                      E-Mail-Bestätigung
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Erfordert die Bestätigung der E-Mail-Adresse bei der Registrierung.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="inviteOnly"
                    checked={authSettings.inviteOnly}
                    onCheckedChange={() => toggleAuthSetting("inviteOnly")}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="inviteOnly" className="font-medium">
                      Nur auf Einladung
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Beschränkt die Registrierung auf eingeladene Benutzer.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline">Zurücksetzen</Button>
              <Button>Einstellungen speichern</Button>
            </div>
          </TabsContent>

          <TabsContent value="storage" className="space-y-4">
            <div className="p-3 border rounded-md">
              <h3 className="font-medium mb-2">Storage-Buckets</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">avatars</span>
                  <Badge variant="outline">Öffentlich</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">experiences</span>
                  <Badge variant="outline">Privat</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">media</span>
                  <Badge variant="outline">Privat</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">attachments</span>
                  <Badge variant="outline">Privat</Badge>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Button variant="outline" size="sm">
                    Bucket erstellen
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-3 border rounded-md">
              <h3 className="font-medium mb-2">Storage-Einstellungen</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Maximale Dateigröße</span>
                  <Badge variant="outline">50 MB</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Erlaubte Dateitypen</span>
                  <Badge variant="outline">image/*, video/*, audio/*, application/pdf</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">CORS-Einstellungen</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Konfiguriert
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="p-3 border rounded-md">
              <h3 className="font-medium mb-2">Sicherheitseinstellungen</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Row Level Security (RLS)</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Aktiviert
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">API-Schlüssel-Rotation</span>
                  <Badge variant="outline">Alle 90 Tage</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">JWT-Gültigkeitsdauer</span>
                  <Badge variant="outline">3600 Sekunden</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">IP-Beschränkungen</span>
                  <Badge variant="outline" className="bg-red-50 text-red-700">
                    Deaktiviert
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-3 border rounded-md">
              <h3 className="font-medium mb-2">Zugriffsrichtlinien</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Öffentlicher Zugriff</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                    Eingeschränkt
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Authentifizierter Zugriff</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Erlaubt
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Service-Rollen-Zugriff</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Erlaubt
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-3 border rounded-md">
              <h3 className="font-medium mb-2">Webhook-Konfiguration</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auth-Webhooks</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Konfiguriert
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Datenbank-Webhooks</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Konfiguriert
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Button variant="outline" size="sm">
                    Webhook hinzufügen
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
