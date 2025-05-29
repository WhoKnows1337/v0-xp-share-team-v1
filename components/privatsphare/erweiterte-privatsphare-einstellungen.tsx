"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/hooks/use-toast"
import { getUserPrivacySettings, updatePrivacySettings } from "@/lib/mock-privacy"
import type { PrivacySettings } from "@/types/privacy"
import { getCurrentUser } from "@/lib/mock-users"
import { Separator } from "@/components/ui/separator"
import { Info, Shield, Eye, Users, Database, Bell } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ErweitertePrivatsphareEinstellungen() {
  const [settings, setSettings] = useState<PrivacySettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Lade die Privatsphäre-Einstellungen des Benutzers
    const userSettings = getUserPrivacySettings(getCurrentUser().id)
    setSettings(userSettings)
    setLoading(false)
  }, [])

  const handleToggleChange = (key: keyof PrivacySettings) => {
    if (!settings) return

    setSettings({
      ...settings,
      [key]: !settings[key as keyof PrivacySettings],
    })
  }

  const handleSelectChange = (key: keyof PrivacySettings, value: string) => {
    if (!settings) return

    setSettings({
      ...settings,
      [key]: value,
    })
  }

  const handleSliderChange = (key: keyof PrivacySettings, value: number[]) => {
    if (!settings) return

    setSettings({
      ...settings,
      [key]: value[0],
    })
  }

  const handleSave = async () => {
    if (!settings) return

    setSaving(true)

    try {
      // Aktualisiere die Einstellungen
      const updatedSettings = updatePrivacySettings(settings)
      setSettings(updatedSettings)

      toast({
        title: "Einstellungen gespeichert",
        description: "Deine Privatsphäre-Einstellungen wurden erfolgreich aktualisiert.",
      })
    } catch (error) {
      console.error("Fehler beim Speichern der Einstellungen:", error)

      toast({
        title: "Fehler",
        description: "Beim Speichern der Einstellungen ist ein Fehler aufgetreten. Bitte versuche es erneut.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading || !settings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erweiterte Privatsphäre-Einstellungen</CardTitle>
          <CardDescription>Lade Einstellungen...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Erweiterte Privatsphäre-Einstellungen</CardTitle>
        </div>
        <CardDescription>
          Passe deine Privatsphäre-Einstellungen an, um zu kontrollieren, wer deine Inhalte sehen kann und wie deine
          Daten verwendet werden.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sichtbarkeit">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="sichtbarkeit">Sichtbarkeit</TabsTrigger>
            <TabsTrigger value="interaktionen">Interaktionen</TabsTrigger>
            <TabsTrigger value="daten">Datenschutz</TabsTrigger>
            <TabsTrigger value="benachrichtigungen">Benachrichtigungen</TabsTrigger>
          </TabsList>

          <TabsContent value="sichtbarkeit" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Eye className="h-5 w-5 text-muted-foreground" />
                Sichtbarkeit & Zugriff
              </h3>

              <div className="grid gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="defaultVisibility">Standard-Sichtbarkeit für neue Inhalte</Label>
                  <Select
                    value={settings.defaultVisibility}
                    onValueChange={(value) => handleSelectChange("defaultVisibility", value)}
                  >
                    <SelectTrigger id="defaultVisibility">
                      <SelectValue placeholder="Wähle eine Option" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="public">Öffentlich (Alle können sehen)</SelectItem>
                      <SelectItem value="followers">Nur Follower</SelectItem>
                      <SelectItem value="private">Privat (Nur ich)</SelectItem>
                      <SelectItem value="custom">Benutzerdefiniert</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Diese Einstellung wird für alle neuen Erlebnisse und Einträge verwendet, wenn du keine spezifische
                    Sichtbarkeit wählst.
                  </p>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="profileVisibility">Profil-Sichtbarkeit</Label>
                  <Select
                    value={settings.profileVisibility}
                    onValueChange={(value) => handleSelectChange("profileVisibility", value)}
                  >
                    <SelectTrigger id="profileVisibility">
                      <SelectValue placeholder="Wähle eine Option" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="public">Öffentlich (Alle können sehen)</SelectItem>
                      <SelectItem value="followers">Nur Follower</SelectItem>
                      <SelectItem value="private">Privat (Nur auf Einladung)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Bestimmt, wer dein Profil sehen kann.</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="searchVisibility">In Suche anzeigen</Label>
                    <p className="text-sm text-muted-foreground">Erlaube anderen, dich in der Suche zu finden</p>
                  </div>
                  <Switch
                    id="searchVisibility"
                    checked={settings.searchVisibility}
                    onCheckedChange={() => handleToggleChange("searchVisibility")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="locationSharing">Standort teilen</Label>
                    <p className="text-sm text-muted-foreground">
                      Erlaube der Plattform, deinen Standort für Erlebnisse zu verwenden
                    </p>
                  </div>
                  <Switch
                    id="locationSharing"
                    checked={settings.locationSharing}
                    onCheckedChange={() => handleToggleChange("locationSharing")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="showOnlineStatus">Online-Status anzeigen</Label>
                    <p className="text-sm text-muted-foreground">Zeige anderen, wenn du online bist</p>
                  </div>
                  <Switch
                    id="showOnlineStatus"
                    checked={settings.showOnlineStatus}
                    onCheckedChange={() => handleToggleChange("showOnlineStatus")}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="interaktionen" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                Interaktionen & Kommunikation
              </h3>

              <div className="grid gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="allowComments">Kommentare erlauben</Label>
                  <Select
                    value={settings.allowComments}
                    onValueChange={(value) => handleSelectChange("allowComments", value)}
                  >
                    <SelectTrigger id="allowComments">
                      <SelectValue placeholder="Wähle eine Option" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="public">Alle können kommentieren</SelectItem>
                      <SelectItem value="followers">Nur Follower</SelectItem>
                      <SelectItem value="private">Niemand</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Bestimmt, wer deine Erlebnisse kommentieren kann.</p>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="allowDirectMessages">Direktnachrichten erlauben</Label>
                  <Select
                    value={settings.allowDirectMessages}
                    onValueChange={(value) => handleSelectChange("allowDirectMessages", value)}
                  >
                    <SelectTrigger id="allowDirectMessages">
                      <SelectValue placeholder="Wähle eine Option" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="public">Alle können Nachrichten senden</SelectItem>
                      <SelectItem value="followers">Nur Follower</SelectItem>
                      <SelectItem value="private">Niemand</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Bestimmt, wer dir Direktnachrichten senden kann.</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="showReadReceipts">Lesebestätigungen anzeigen</Label>
                    <p className="text-sm text-muted-foreground">
                      Zeige anderen, wenn du ihre Nachrichten gelesen hast
                    </p>
                  </div>
                  <Switch
                    id="showReadReceipts"
                    checked={settings.showReadReceipts}
                    onCheckedChange={() => handleToggleChange("showReadReceipts")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="activityTracking">Aktivitäten teilen</Label>
                    <p className="text-sm text-muted-foreground">
                      Teile deine Aktivitäten (Likes, Kommentare, etc.) mit Followern
                    </p>
                  </div>
                  <Switch
                    id="activityTracking"
                    checked={settings.activityTracking}
                    onCheckedChange={() => handleToggleChange("activityTracking")}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="daten" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Database className="h-5 w-5 text-muted-foreground" />
                Datenschutz & Datennutzung
              </h3>

              <div className="grid gap-4">
                <div className="flex flex-col space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dataRetentionPeriod">Datenspeicherungszeitraum</Label>
                    <span className="text-sm font-medium">
                      {settings.dataRetentionPeriod === 0 ? "Unbegrenzt" : `${settings.dataRetentionPeriod} Tage`}
                    </span>
                  </div>
                  <Slider
                    id="dataRetentionPeriod"
                    value={[settings.dataRetentionPeriod]}
                    min={0}
                    max={730}
                    step={30}
                    onValueChange={(value) => handleSliderChange("dataRetentionPeriod", value)}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Unbegrenzt</span>
                    <span>1 Monat</span>
                    <span>6 Monate</span>
                    <span>1 Jahr</span>
                    <span>2 Jahre</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Bestimmt, wie lange deine Daten gespeichert werden. Bei "Unbegrenzt" werden deine Daten dauerhaft
                    gespeichert.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="thirdPartySharing">Datenfreigabe an Dritte</Label>
                    <p className="text-sm text-muted-foreground">
                      Erlaube die Weitergabe deiner anonymisierten Daten für Verbesserungen
                    </p>
                  </div>
                  <Switch
                    id="thirdPartySharing"
                    checked={settings.thirdPartySharing}
                    onCheckedChange={() => handleToggleChange("thirdPartySharing")}
                  />
                </div>

                <Separator className="my-2" />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Datenexport & -löschung</h4>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button variant="outline" size="sm">
                      Meine Daten exportieren
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive border-destructive hover:bg-destructive/10"
                    >
                      Konto löschen
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Du kannst jederzeit alle deine Daten exportieren oder dein Konto vollständig löschen.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="benachrichtigungen" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Bell className="h-5 w-5 text-muted-foreground" />
                Benachrichtigungen & Privatsphäre
              </h3>

              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">E-Mail-Benachrichtigungen</Label>
                    <p className="text-sm text-muted-foreground">Erhalte wichtige Benachrichtigungen per E-Mail</p>
                  </div>
                  <Switch id="emailNotifications" checked={true} onCheckedChange={() => {}} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="privacyChanges">Privatsphäre-Änderungen</Label>
                    <p className="text-sm text-muted-foreground">
                      Benachrichtigungen bei Änderungen an Privatsphäre-Richtlinien
                    </p>
                  </div>
                  <Switch id="privacyChanges" checked={true} onCheckedChange={() => {}} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="securityAlerts">Sicherheitsbenachrichtigungen</Label>
                    <p className="text-sm text-muted-foreground">Benachrichtigungen bei verdächtigen Aktivitäten</p>
                  </div>
                  <Switch id="securityAlerts" checked={true} onCheckedChange={() => {}} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="accessNotifications">Zugriffs-Benachrichtigungen</Label>
                    <p className="text-sm text-muted-foreground">
                      Benachrichtigungen, wenn jemand auf deine privaten Inhalte zugreift
                    </p>
                  </div>
                  <Switch id="accessNotifications" checked={true} onCheckedChange={() => {}} />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="mr-2" variant="outline" size="sm">
                  <Info className="h-4 w-4 mr-2" />
                  Datenschutzrichtlinien
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Unsere Datenschutzrichtlinien einsehen</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Speichern..." : "Einstellungen speichern"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
