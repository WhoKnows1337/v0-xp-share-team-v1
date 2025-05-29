"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Settings, Server, Shield, Mail, Database, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SystemSettings {
  siteName: string
  siteDescription: string
  maintenanceMode: boolean
  registrationEnabled: boolean
  emailVerificationRequired: boolean
  maxFileSize: number
  allowedFileTypes: string[]
  rateLimit: {
    requests: number
    window: number
  }
  backup: {
    enabled: boolean
    frequency: string
    retention: number
  }
  email: {
    provider: string
    smtpHost: string
    smtpPort: number
    smtpUser: string
    smtpPassword: string
  }
  security: {
    sessionTimeout: number
    passwordMinLength: number
    requireTwoFactor: boolean
    allowedDomains: string[]
  }
}

export function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: "XP Share",
    siteDescription: "Eine Plattform zum Teilen und Entdecken von Erlebnissen",
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    maxFileSize: 10,
    allowedFileTypes: ["jpg", "jpeg", "png", "gif", "mp4", "mp3"],
    rateLimit: {
      requests: 100,
      window: 60,
    },
    backup: {
      enabled: true,
      frequency: "daily",
      retention: 30,
    },
    email: {
      provider: "smtp",
      smtpHost: "smtp.gmail.com",
      smtpPort: 587,
      smtpUser: "",
      smtpPassword: "",
    },
    security: {
      sessionTimeout: 24,
      passwordMinLength: 8,
      requireTwoFactor: false,
      allowedDomains: [],
    },
  })

  const { toast } = useToast()

  const saveSettings = () => {
    // Simuliere das Speichern der Einstellungen
    toast({
      title: "Einstellungen gespeichert",
      description: "Die Systemeinstellungen wurden erfolgreich aktualisiert.",
    })
  }

  const updateSetting = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const updateNestedSetting = <T extends keyof SystemSettings>(
    section: T,
    key: keyof SystemSettings[T],
    value: any,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Systemeinstellungen</h2>
          <p className="text-muted-foreground">Verwalte globale Einstellungen für die Plattform</p>
        </div>
        <Button onClick={saveSettings}>
          <Settings className="h-4 w-4 mr-2" />
          Speichern
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">Allgemein</TabsTrigger>
          <TabsTrigger value="security">Sicherheit</TabsTrigger>
          <TabsTrigger value="email">E-Mail</TabsTrigger>
          <TabsTrigger value="files">Dateien</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Allgemeine Einstellungen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Site-Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => updateSetting("siteName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="siteDescription">Site-Beschreibung</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => updateSetting("siteDescription", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Wartungsmodus</Label>
                    <p className="text-sm text-muted-foreground">Aktiviere den Wartungsmodus für alle Benutzer</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => updateSetting("maintenanceMode", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Registrierung aktiviert</Label>
                    <p className="text-sm text-muted-foreground">Erlaube neuen Benutzern die Registrierung</p>
                  </div>
                  <Switch
                    checked={settings.registrationEnabled}
                    onCheckedChange={(checked) => updateSetting("registrationEnabled", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">E-Mail-Verifizierung erforderlich</Label>
                    <p className="text-sm text-muted-foreground">Neue Benutzer müssen ihre E-Mail bestätigen</p>
                  </div>
                  <Switch
                    checked={settings.emailVerificationRequired}
                    onCheckedChange={(checked) => updateSetting("emailVerificationRequired", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Sicherheitseinstellungen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">Session-Timeout (Stunden)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateNestedSetting("security", "sessionTimeout", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="passwordMinLength">Minimale Passwort-Länge</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) =>
                      updateNestedSetting("security", "passwordMinLength", Number.parseInt(e.target.value))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rateLimitRequests">Rate Limit (Anfragen)</Label>
                  <Input
                    id="rateLimitRequests"
                    type="number"
                    value={settings.rateLimit.requests}
                    onChange={(e) => updateNestedSetting("rateLimit", "requests", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="rateLimitWindow">Rate Limit (Zeitfenster in Sekunden)</Label>
                  <Input
                    id="rateLimitWindow"
                    type="number"
                    value={settings.rateLimit.window}
                    onChange={(e) => updateNestedSetting("rateLimit", "window", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Zwei-Faktor-Authentifizierung erforderlich</Label>
                  <p className="text-sm text-muted-foreground">Alle Benutzer müssen 2FA aktivieren</p>
                </div>
                <Switch
                  checked={settings.security.requireTwoFactor}
                  onCheckedChange={(checked) => updateNestedSetting("security", "requireTwoFactor", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                E-Mail-Einstellungen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpHost">SMTP-Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.email.smtpHost}
                    onChange={(e) => updateNestedSetting("email", "smtpHost", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP-Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={settings.email.smtpPort}
                    onChange={(e) => updateNestedSetting("email", "smtpPort", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpUser">SMTP-Benutzer</Label>
                  <Input
                    id="smtpUser"
                    value={settings.email.smtpUser}
                    onChange={(e) => updateNestedSetting("email", "smtpUser", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">SMTP-Passwort</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.email.smtpPassword}
                    onChange={(e) => updateNestedSetting("email", "smtpPassword", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">E-Mail testen</Button>
                <Button variant="outline">Konfiguration validieren</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Datei-Einstellungen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="maxFileSize">Maximale Dateigröße (MB)</Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => updateSetting("maxFileSize", Number.parseInt(e.target.value))}
                />
              </div>

              <div>
                <Label>Erlaubte Dateitypen</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {settings.allowedFileTypes.map((type) => (
                    <Badge key={type} variant="secondary">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Backup-Einstellungen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Automatische Backups</Label>
                  <p className="text-sm text-muted-foreground">Aktiviere automatische Datenbank-Backups</p>
                </div>
                <Switch
                  checked={settings.backup.enabled}
                  onCheckedChange={(checked) => updateNestedSetting("backup", "enabled", checked)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="backupFrequency">Backup-Häufigkeit</Label>
                  <select
                    id="backupFrequency"
                    value={settings.backup.frequency}
                    onChange={(e) => updateNestedSetting("backup", "frequency", e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="hourly">Stündlich</option>
                    <option value="daily">Täglich</option>
                    <option value="weekly">Wöchentlich</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="backupRetention">Aufbewahrung (Tage)</Label>
                  <Input
                    id="backupRetention"
                    type="number"
                    value={settings.backup.retention}
                    onChange={(e) => updateNestedSetting("backup", "retention", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">Backup jetzt erstellen</Button>
                <Button variant="outline">Backup wiederherstellen</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="h-5 w-5 mr-2" />
                Performance-Einstellungen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-500">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-blue-500">1.2s</div>
                  <div className="text-sm text-muted-foreground">Avg. Response</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-purple-500">1,234</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">Cache leeren</Button>
                <Button variant="outline">Performance-Report</Button>
                <Button variant="outline">System-Status</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
