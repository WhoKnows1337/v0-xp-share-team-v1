"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

export default function AdvancedSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = () => {
    setIsLoading(true)

    // Simuliere eine API-Anfrage
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Einstellungen gespeichert",
        description: "Deine Einstellungen wurden erfolgreich aktualisiert.",
      })
    }, 1000)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Erweiterte Einstellungen</h1>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account">Konto</TabsTrigger>
          <TabsTrigger value="privacy">Privatsphäre</TabsTrigger>
          <TabsTrigger value="notifications">Benachrichtigungen</TabsTrigger>
          <TabsTrigger value="appearance">Erscheinungsbild</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profil-Informationen</CardTitle>
              <CardDescription>Aktualisiere deine persönlichen Informationen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Vorname</Label>
                  <Input id="firstName" defaultValue="Max" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nachname</Label>
                  <Input id="lastName" defaultValue="Mustermann" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail-Adresse</Label>
                <Input id="email" type="email" defaultValue="max.mustermann@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Über mich</Label>
                <Input id="bio" defaultValue="Erlebnissammler und Entdecker" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Wird gespeichert..." : "Speichern"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Passwort ändern</CardTitle>
              <CardDescription>Aktualisiere dein Passwort regelmäßig für mehr Sicherheit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Aktuelles Passwort</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Neues Passwort</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                <Input id="confirmPassword" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Wird gespeichert..." : "Passwort ändern"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Konto löschen</CardTitle>
              <CardDescription>Lösche dein Konto und alle damit verbundenen Daten</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Diese Aktion kann nicht rückgängig gemacht werden. Alle deine Daten, Erlebnisse und Verbindungen werden
                dauerhaft gelöscht.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="destructive">Konto löschen</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privatsphäre-Einstellungen</CardTitle>
              <CardDescription>Lege fest, wer deine Inhalte sehen kann</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Profil sichtbar für</Label>
                  <p className="text-sm text-muted-foreground">Wer kann dein Profil sehen?</p>
                </div>
                <Select defaultValue="friends">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Wählen..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Alle</SelectItem>
                    <SelectItem value="friends">Nur Freunde</SelectItem>
                    <SelectItem value="private">Niemand</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Standard-Sichtbarkeit für neue Erlebnisse</Label>
                  <p className="text-sm text-muted-foreground">Wer kann deine neuen Erlebnisse standardmäßig sehen?</p>
                </div>
                <Select defaultValue="friends">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Wählen..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Alle</SelectItem>
                    <SelectItem value="friends">Nur Freunde</SelectItem>
                    <SelectItem value="private">Nur ich</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Standort-Informationen</Label>
                  <p className="text-sm text-muted-foreground">
                    Sollen Standort-Informationen in deinen Erlebnissen angezeigt werden?
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Profilsuche</Label>
                  <p className="text-sm text-muted-foreground">Können andere Benutzer dich über die Suche finden?</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Wird gespeichert..." : "Speichern"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Datenexport</CardTitle>
              <CardDescription>Exportiere alle deine Daten</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Du kannst alle deine Daten, einschließlich Erlebnisse, Kommentare und Profilinformationen,
                herunterladen.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Daten exportieren</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Benachrichtigungseinstellungen</CardTitle>
              <CardDescription>Lege fest, worüber du informiert werden möchtest</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>E-Mail-Benachrichtigungen</Label>
                  <p className="text-sm text-muted-foreground">Erhalte Benachrichtigungen per E-Mail</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Push-Benachrichtigungen</Label>
                  <p className="text-sm text-muted-foreground">Erhalte Push-Benachrichtigungen im Browser</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Neue Kommentare</Label>
                  <p className="text-sm text-muted-foreground">
                    Benachrichtigungen über neue Kommentare zu deinen Erlebnissen
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Neue Freundschaftsanfragen</Label>
                  <p className="text-sm text-muted-foreground">Benachrichtigungen über neue Freundschaftsanfragen</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Gruppenaktivitäten</Label>
                  <p className="text-sm text-muted-foreground">Benachrichtigungen über Aktivitäten in deinen Gruppen</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>System-Updates</Label>
                  <p className="text-sm text-muted-foreground">Benachrichtigungen über Updates und neue Funktionen</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Wird gespeichert..." : "Speichern"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Erscheinungsbild</CardTitle>
              <CardDescription>Passe das Aussehen von XP-Share an deine Vorlieben an</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Dunkelmodus</Label>
                  <p className="text-sm text-muted-foreground">
                    Aktiviere den Dunkelmodus für ein augenschonendes Erlebnis
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label>Farbschema</Label>
                <div className="grid grid-cols-5 gap-2">
                  <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-blue-500 text-white ring-2 ring-blue-500 ring-offset-2">
                    <span className="sr-only">Blau</span>
                  </div>
                  <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-green-500 text-white">
                    <span className="sr-only">Grün</span>
                  </div>
                  <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-purple-500 text-white">
                    <span className="sr-only">Lila</span>
                  </div>
                  <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white">
                    <span className="sr-only">Rot</span>
                  </div>
                  <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-orange-500 text-white">
                    <span className="sr-only">Orange</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Schriftgröße</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Wählen..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Klein</SelectItem>
                    <SelectItem value="medium">Mittel</SelectItem>
                    <SelectItem value="large">Groß</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Animationen reduzieren</Label>
                  <p className="text-sm text-muted-foreground">Reduziere Animationen für bessere Performance</p>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Wird gespeichert..." : "Speichern"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
