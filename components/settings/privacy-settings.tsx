"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Shield, Eye, Download, Trash2, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PrivacySettings {
  profileVisibility: "public" | "friends" | "private"
  showOnlineStatus: boolean
  showLastSeen: boolean
  allowDirectMessages: "everyone" | "friends" | "nobody"
  showLocation: boolean
  showExperiences: "public" | "friends" | "private"
  allowComments: boolean
  allowMentions: boolean
  dataCollection: boolean
  analyticsTracking: boolean
  marketingEmails: boolean
  shareWithPartners: boolean
}

export function PrivacySettings() {
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: "public",
    showOnlineStatus: true,
    showLastSeen: true,
    allowDirectMessages: "everyone",
    showLocation: false,
    showExperiences: "public",
    allowComments: true,
    allowMentions: true,
    dataCollection: true,
    analyticsTracking: true,
    marketingEmails: false,
    shareWithPartners: false,
  })

  const [showDataExport, setShowDataExport] = useState(false)
  const [showAccountDeletion, setShowAccountDeletion] = useState(false)
  const { toast } = useToast()

  const updateSetting = <K extends keyof PrivacySettings>(key: K, value: PrivacySettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    toast({
      title: "Einstellung gespeichert",
      description: "Deine Privatsphäre-Einstellung wurde aktualisiert.",
    })
  }

  const exportData = async () => {
    // Simuliere Datenexport
    toast({
      title: "Datenexport gestartet",
      description: "Du erhältst eine E-Mail, wenn der Export bereit ist.",
    })
    setShowDataExport(false)
  }

  const deleteAccount = async () => {
    // Simuliere Kontolöschung
    toast({
      title: "Konto gelöscht",
      description: "Dein Konto wurde erfolgreich gelöscht.",
      variant: "destructive",
    })
    setShowAccountDeletion(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Privatsphäre & Sicherheit</h2>
        <p className="text-muted-foreground">Verwalte deine Privatsphäre-Einstellungen und Datenschutz-Präferenzen.</p>
      </div>

      {/* Sichtbarkeitseinstellungen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Sichtbarkeit
          </CardTitle>
          <CardDescription>Kontrolliere, wer deine Inhalte und Informationen sehen kann.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Profilsichtbarkeit</Label>
              <p className="text-sm text-muted-foreground mb-2">Wer kann dein Profil sehen?</p>
              <div className="flex gap-2">
                {(["public", "friends", "private"] as const).map((option) => (
                  <Button
                    key={option}
                    variant={settings.profileVisibility === option ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateSetting("profileVisibility", option)}
                  >
                    {option === "public" && "Öffentlich"}
                    {option === "friends" && "Freunde"}
                    {option === "private" && "Privat"}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Online-Status anzeigen</Label>
                <p className="text-sm text-muted-foreground">Zeige anderen, wenn du online bist</p>
              </div>
              <Switch
                checked={settings.showOnlineStatus}
                onCheckedChange={(checked) => updateSetting("showOnlineStatus", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Zuletzt gesehen</Label>
                <p className="text-sm text-muted-foreground">Zeige, wann du zuletzt aktiv warst</p>
              </div>
              <Switch
                checked={settings.showLastSeen}
                onCheckedChange={(checked) => updateSetting("showLastSeen", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Standort anzeigen</Label>
                <p className="text-sm text-muted-foreground">Zeige deinen Standort in Erlebnissen</p>
              </div>
              <Switch
                checked={settings.showLocation}
                onCheckedChange={(checked) => updateSetting("showLocation", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interaktionseinstellungen */}
      <Card>
        <CardHeader>
          <CardTitle>Interaktionen</CardTitle>
          <CardDescription>Kontrolliere, wie andere mit dir interagieren können.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium">Direktnachrichten</Label>
            <p className="text-sm text-muted-foreground mb-2">Wer darf dir Nachrichten senden?</p>
            <div className="flex gap-2">
              {(["everyone", "friends", "nobody"] as const).map((option) => (
                <Button
                  key={option}
                  variant={settings.allowDirectMessages === option ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSetting("allowDirectMessages", option)}
                >
                  {option === "everyone" && "Alle"}
                  {option === "friends" && "Freunde"}
                  {option === "nobody" && "Niemand"}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Kommentare erlauben</Label>
              <p className="text-sm text-muted-foreground">Erlaube Kommentare zu deinen Erlebnissen</p>
            </div>
            <Switch
              checked={settings.allowComments}
              onCheckedChange={(checked) => updateSetting("allowComments", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Erwähnungen erlauben</Label>
              <p className="text-sm text-muted-foreground">Erlaube anderen, dich zu erwähnen</p>
            </div>
            <Switch
              checked={settings.allowMentions}
              onCheckedChange={(checked) => updateSetting("allowMentions", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Datensammlung */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Datensammlung & Analyse
          </CardTitle>
          <CardDescription>Kontrolliere, welche Daten gesammelt und wie sie verwendet werden.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Datensammlung für Verbesserungen</Label>
              <p className="text-sm text-muted-foreground">Hilf uns, die App zu verbessern</p>
            </div>
            <Switch
              checked={settings.dataCollection}
              onCheckedChange={(checked) => updateSetting("dataCollection", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Analytics-Tracking</Label>
              <p className="text-sm text-muted-foreground">Anonyme Nutzungsstatistiken</p>
            </div>
            <Switch
              checked={settings.analyticsTracking}
              onCheckedChange={(checked) => updateSetting("analyticsTracking", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Marketing-E-Mails</Label>
              <p className="text-sm text-muted-foreground">Erhalte E-Mails über neue Features</p>
            </div>
            <Switch
              checked={settings.marketingEmails}
              onCheckedChange={(checked) => updateSetting("marketingEmails", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Daten mit Partnern teilen</Label>
              <p className="text-sm text-muted-foreground">Anonyme Daten für Forschungszwecke</p>
            </div>
            <Switch
              checked={settings.shareWithPartners}
              onCheckedChange={(checked) => updateSetting("shareWithPartners", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Datenmanagement */}
      <Card>
        <CardHeader>
          <CardTitle>Datenmanagement</CardTitle>
          <CardDescription>Verwalte deine gespeicherten Daten und Konto-Optionen.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Daten exportieren</Label>
              <p className="text-sm text-muted-foreground">Lade eine Kopie deiner Daten herunter</p>
            </div>
            <Dialog open={showDataExport} onOpenChange={setShowDataExport}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportieren
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Daten exportieren</DialogTitle>
                  <DialogDescription>
                    Du erhältst eine E-Mail mit einem Link zum Download deiner Daten. Dies kann einige Minuten dauern.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Enthaltene Daten:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Profildaten</li>
                      <li>• Erlebnisse und Einträge</li>
                      <li>• Nachrichten</li>
                      <li>• Einstellungen</li>
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={exportData} className="flex-1">
                      Export starten
                    </Button>
                    <Button variant="outline" onClick={() => setShowDataExport(false)}>
                      Abbrechen
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium text-destructive">Konto löschen</Label>
              <p className="text-sm text-muted-foreground">Lösche dein Konto und alle Daten permanent</p>
            </div>
            <Dialog open={showAccountDeletion} onOpenChange={setShowAccountDeletion}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Löschen
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center text-destructive">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Konto löschen
                  </DialogTitle>
                  <DialogDescription>
                    Diese Aktion kann nicht rückgängig gemacht werden. Alle deine Daten werden permanent gelöscht.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <h4 className="font-medium text-destructive mb-2">Was wird gelöscht:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Dein Profil und alle persönlichen Daten</li>
                      <li>• Alle deine Erlebnisse und XP-Buch-Einträge</li>
                      <li>• Nachrichten und Kommentare</li>
                      <li>• Achievements und Fortschritt</li>
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="destructive" onClick={deleteAccount} className="flex-1">
                      Konto endgültig löschen
                    </Button>
                    <Button variant="outline" onClick={() => setShowAccountDeletion(false)}>
                      Abbrechen
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
