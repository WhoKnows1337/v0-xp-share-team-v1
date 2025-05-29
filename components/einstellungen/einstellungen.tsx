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
import { User, Bell, Shield, Globe, Palette, Database, Camera, Save, Download, Trash2 } from "lucide-react"
import { getCurrentUser } from "@/lib/mock-users"

export function Einstellungen() {
  const currentUser = getCurrentUser()
  const [activeTab, setActiveTab] = useState("profil")

  // Profil-Einstellungen
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || "",
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    bio: currentUser?.bio || "",
    location: "Hamburg, Deutschland",
    website: "",
    birthday: "1990-01-01",
  })

  // Benachrichtigungs-Einstellungen
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newExperiences: true,
    comments: true,
    mentions: true,
    achievements: true,
    weeklyDigest: false,
    marketingEmails: false,
  })

  // Privatsphäre-Einstellungen
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    experienceVisibility: "friends",
    showLocation: true,
    showOnlineStatus: true,
    allowMessages: "everyone",
    showAchievements: true,
  })

  // Design-Einstellungen
  const [design, setDesign] = useState({
    theme: "system",
    language: "de",
    fontSize: "medium",
    reducedMotion: false,
  })

  const handleSaveProfile = () => {
    console.log("Profil gespeichert:", profileData)
    // Hier würde die API-Anfrage stehen
  }

  const handleSaveNotifications = () => {
    console.log("Benachrichtigungen gespeichert:", notifications)
    // Hier würde die API-Anfrage stehen
  }

  const handleSavePrivacy = () => {
    console.log("Privatsphäre gespeichert:", privacy)
    // Hier würde die API-Anfrage stehen
  }

  const handleSaveDesign = () => {
    console.log("Design gespeichert:", design)
    // Hier würde die API-Anfrage stehen
  }

  const handleExportData = () => {
    console.log("Daten werden exportiert...")
    // Hier würde der Export starten
  }

  const handleDeleteAccount = () => {
    console.log("Konto löschen angefordert...")
    // Hier würde der Löschvorgang starten
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Einstellungen</h1>
          <p className="text-muted-foreground mt-2">Verwalte deine Konto- und Anwendungseinstellungen</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profil" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="benachrichtigungen" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Benachrichtigungen</span>
            </TabsTrigger>
            <TabsTrigger value="privatsphare" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privatsphäre</span>
            </TabsTrigger>
            <TabsTrigger value="sprache" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Sprache</span>
            </TabsTrigger>
            <TabsTrigger value="design" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Design</span>
            </TabsTrigger>
            <TabsTrigger value="daten" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Daten</span>
            </TabsTrigger>
          </TabsList>

          {/* Profil Tab */}
          <TabsContent value="profil" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profil-Informationen</CardTitle>
                <CardDescription>Aktualisiere deine persönlichen Informationen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={currentUser?.avatar || "/placeholder.svg"} alt={currentUser?.name} />
                    <AvatarFallback>{currentUser?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Foto ändern
                    </Button>
                    <p className="text-sm text-muted-foreground">JPG, PNG oder GIF. Max. 5MB.</p>
                  </div>
                </div>

                <Separator />

                {/* Grunddaten */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Benutzername</Label>
                    <Input
                      id="username"
                      value={profileData.username}
                      onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthday">Geburtstag</Label>
                    <Input
                      id="birthday"
                      type="date"
                      value={profileData.birthday}
                      onChange={(e) => setProfileData({ ...profileData, birthday: e.target.value })}
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Erzähle etwas über dich..."
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={3}
                  />
                </div>

                {/* Kontakt */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Standort</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://..."
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveProfile} className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Profil speichern
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Benachrichtigungen Tab */}
          <TabsContent value="benachrichtigungen" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Benachrichtigungs-Einstellungen</CardTitle>
                <CardDescription>Wähle aus, wie du benachrichtigt werden möchtest</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>E-Mail Benachrichtigungen</Label>
                      <p className="text-sm text-muted-foreground">Erhalte Benachrichtigungen per E-Mail</p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push-Benachrichtigungen</Label>
                      <p className="text-sm text-muted-foreground">Erhalte Push-Benachrichtigungen im Browser</p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Neue Erlebnisse</Label>
                      <p className="text-sm text-muted-foreground">
                        Benachrichtigung bei neuen Erlebnissen von Freunden
                      </p>
                    </div>
                    <Switch
                      checked={notifications.newExperiences}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, newExperiences: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Kommentare</Label>
                      <p className="text-sm text-muted-foreground">
                        Benachrichtigung bei Kommentaren zu deinen Erlebnissen
                      </p>
                    </div>
                    <Switch
                      checked={notifications.comments}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, comments: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Erwähnungen</Label>
                      <p className="text-sm text-muted-foreground">Benachrichtigung wenn du erwähnt wirst</p>
                    </div>
                    <Switch
                      checked={notifications.mentions}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, mentions: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Achievements</Label>
                      <p className="text-sm text-muted-foreground">Benachrichtigung bei neuen Errungenschaften</p>
                    </div>
                    <Switch
                      checked={notifications.achievements}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, achievements: checked })}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Wöchentliche Zusammenfassung</Label>
                      <p className="text-sm text-muted-foreground">Erhalte eine wöchentliche E-Mail mit Highlights</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyDigest}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing E-Mails</Label>
                      <p className="text-sm text-muted-foreground">Erhalte E-Mails über neue Features und Angebote</p>
                    </div>
                    <Switch
                      checked={notifications.marketingEmails}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveNotifications} className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Einstellungen speichern
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privatsphäre Tab */}
          <TabsContent value="privatsphare" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privatsphäre-Einstellungen</CardTitle>
                <CardDescription>Kontrolliere wer deine Inhalte sehen kann</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Profil-Sichtbarkeit</Label>
                    <Select
                      value={privacy.profileVisibility}
                      onValueChange={(value) => setPrivacy({ ...privacy, profileVisibility: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Öffentlich</SelectItem>
                        <SelectItem value="friends">Nur Freunde</SelectItem>
                        <SelectItem value="private">Privat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Erlebnis-Sichtbarkeit</Label>
                    <Select
                      value={privacy.experienceVisibility}
                      onValueChange={(value) => setPrivacy({ ...privacy, experienceVisibility: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Öffentlich</SelectItem>
                        <SelectItem value="friends">Nur Freunde</SelectItem>
                        <SelectItem value="private">Privat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Nachrichten erlauben von</Label>
                    <Select
                      value={privacy.allowMessages}
                      onValueChange={(value) => setPrivacy({ ...privacy, allowMessages: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Jedem</SelectItem>
                        <SelectItem value="friends">Nur Freunde</SelectItem>
                        <SelectItem value="none">Niemand</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Standort anzeigen</Label>
                      <p className="text-sm text-muted-foreground">Zeige deinen Standort in Erlebnissen</p>
                    </div>
                    <Switch
                      checked={privacy.showLocation}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, showLocation: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Online-Status anzeigen</Label>
                      <p className="text-sm text-muted-foreground">Zeige anderen wann du online bist</p>
                    </div>
                    <Switch
                      checked={privacy.showOnlineStatus}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, showOnlineStatus: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Achievements anzeigen</Label>
                      <p className="text-sm text-muted-foreground">Zeige deine Errungenschaften im Profil</p>
                    </div>
                    <Switch
                      checked={privacy.showAchievements}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, showAchievements: checked })}
                    />
                  </div>
                </div>

                <Button onClick={handleSavePrivacy} className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Privatsphäre speichern
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sprache Tab */}
          <TabsContent value="sprache" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sprach-Einstellungen</CardTitle>
                <CardDescription>Wähle deine bevorzugte Sprache</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Sprache</Label>
                    <Select
                      value={design.language}
                      onValueChange={(value) => setDesign({ ...design, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
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

                <Button onClick={handleSaveDesign} className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Sprache speichern
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Design Tab */}
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
                    <Select value={design.theme} onValueChange={(value) => setDesign({ ...design, theme: value })}>
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
                    <Label>Schriftgröße</Label>
                    <Select
                      value={design.fontSize}
                      onValueChange={(value) => setDesign({ ...design, fontSize: value })}
                    >
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

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Reduzierte Bewegungen</Label>
                      <p className="text-sm text-muted-foreground">Reduziere Animationen für bessere Zugänglichkeit</p>
                    </div>
                    <Switch
                      checked={design.reducedMotion}
                      onCheckedChange={(checked) => setDesign({ ...design, reducedMotion: checked })}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveDesign} className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Design speichern
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Daten Tab */}
          <TabsContent value="daten" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Daten-Management</CardTitle>
                <CardDescription>Verwalte deine Daten und Konto-Einstellungen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Daten exportieren</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Lade eine Kopie deiner Daten herunter, einschließlich Erlebnisse, Kommentare und
                      Profil-Informationen.
                    </p>
                    <Button onClick={handleExportData} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Daten exportieren
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Speicher-Nutzung</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Erlebnisse</span>
                        <span>245 MB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Medien</span>
                        <span>1.2 GB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Cache</span>
                        <span>89 MB</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Gesamt</span>
                        <span>1.5 GB</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-destructive rounded-lg">
                    <h3 className="font-medium mb-2 text-destructive">Konto löschen</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Das Löschen deines Kontos ist permanent und kann nicht rückgängig gemacht werden. Alle deine Daten
                      werden gelöscht.
                    </p>
                    <Button onClick={handleDeleteAccount} variant="destructive">
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
    </div>
  )
}
