"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Shield, Eye, Users, Globe, Lock, Download, Trash2, AlertTriangle, Settings, Camera, Bell } from "lucide-react"

interface PrivacySettings {
  profile: {
    visibility: "public" | "friends" | "private"
    showRealName: boolean
    showLocation: boolean
    showJoinDate: boolean
    showLastActive: boolean
    showXPLevel: boolean
    showAchievements: boolean
  }
  experiences: {
    defaultVisibility: "public" | "friends" | "private"
    allowComments: "everyone" | "friends" | "none"
    allowLikes: "everyone" | "friends" | "none"
    showLocation: boolean
    showTimestamp: boolean
    allowDownload: boolean
  }
  social: {
    allowFriendRequests: "everyone" | "friends-of-friends" | "none"
    allowMessages: "everyone" | "friends" | "none"
    allowGroupInvites: "everyone" | "friends" | "none"
    showOnlineStatus: boolean
    allowTagging: "everyone" | "friends" | "none"
  }
  notifications: {
    emailNotifications: boolean
    pushNotifications: boolean
    marketingEmails: boolean
    weeklyDigest: boolean
    achievementAlerts: boolean
    commentNotifications: boolean
    likeNotifications: boolean
    followNotifications: boolean
  }
  data: {
    allowAnalytics: boolean
    allowPersonalization: boolean
    allowThirdPartySharing: boolean
    dataRetention: "1year" | "2years" | "5years" | "forever"
  }
}

export function PrivacySettings() {
  const [settings, setSettings] = useState<PrivacySettings>({
    profile: {
      visibility: "public",
      showRealName: true,
      showLocation: false,
      showJoinDate: true,
      showLastActive: false,
      showXPLevel: true,
      showAchievements: true,
    },
    experiences: {
      defaultVisibility: "public",
      allowComments: "everyone",
      allowLikes: "everyone",
      showLocation: true,
      showTimestamp: true,
      allowDownload: false,
    },
    social: {
      allowFriendRequests: "everyone",
      allowMessages: "friends",
      allowGroupInvites: "friends",
      showOnlineStatus: true,
      allowTagging: "friends",
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
      weeklyDigest: true,
      achievementAlerts: true,
      commentNotifications: true,
      likeNotifications: false,
      followNotifications: true,
    },
    data: {
      allowAnalytics: true,
      allowPersonalization: true,
      allowThirdPartySharing: false,
      dataRetention: "2years",
    },
  })

  const updateProfileSetting = (key: keyof PrivacySettings["profile"], value: any) => {
    setSettings((prev) => ({
      ...prev,
      profile: { ...prev.profile, [key]: value },
    }))
  }

  const updateExperiencesSetting = (key: keyof PrivacySettings["experiences"], value: any) => {
    setSettings((prev) => ({
      ...prev,
      experiences: { ...prev.experiences, [key]: value },
    }))
  }

  const updateSocialSetting = (key: keyof PrivacySettings["social"], value: any) => {
    setSettings((prev) => ({
      ...prev,
      social: { ...prev.social, [key]: value },
    }))
  }

  const updateNotificationSetting = (key: keyof PrivacySettings["notifications"], value: any) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }))
  }

  const updateDataSetting = (key: keyof PrivacySettings["data"], value: any) => {
    setSettings((prev) => ({
      ...prev,
      data: { ...prev.data, [key]: value },
    }))
  }

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public":
        return <Globe className="h-4 w-4 text-green-500" />
      case "friends":
        return <Users className="h-4 w-4 text-blue-500" />
      case "private":
        return <Lock className="h-4 w-4 text-red-500" />
      default:
        return <Eye className="h-4 w-4" />
    }
  }

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case "public":
        return "Öffentlich"
      case "friends":
        return "Nur Freunde"
      case "private":
        return "Privat"
      default:
        return visibility
    }
  }

  const exportData = () => {
    // Hier würde normalerweise ein API-Call zum Datenexport gemacht
    console.log("Datenexport angefordert")
  }

  const deleteAccount = () => {
    // Hier würde normalerweise ein Bestätigungsdialog und API-Call gemacht
    console.log("Account-Löschung angefordert")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <div>
          <h2 className="text-2xl font-bold">Datenschutz & Sicherheit</h2>
          <p className="text-muted-foreground">Kontrolliere deine Privatsphäre und Datensicherheit</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="experiences">Erlebnisse</TabsTrigger>
          <TabsTrigger value="social">Sozial</TabsTrigger>
          <TabsTrigger value="notifications">Benachrichtigungen</TabsTrigger>
          <TabsTrigger value="data">Daten</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Profil-Sichtbarkeit
              </CardTitle>
              <CardDescription>Bestimme, wer dein Profil und deine Informationen sehen kann</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Profil-Sichtbarkeit</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Wer kann dein Profil sehen und deine Informationen einsehen?
                </p>
                <Select
                  value={settings.profile.visibility}
                  onValueChange={(value) => updateProfileSetting("visibility", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-green-500" />
                        Öffentlich - Jeder kann mein Profil sehen
                      </div>
                    </SelectItem>
                    <SelectItem value="friends">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        Nur Freunde - Nur meine Freunde können mein Profil sehen
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-red-500" />
                        Privat - Niemand kann mein Profil sehen
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Profil-Informationen anzeigen</h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Echter Name</Label>
                      <p className="text-sm text-muted-foreground">Zeige deinen echten Namen im Profil</p>
                    </div>
                    <Switch
                      checked={settings.profile.showRealName}
                      onCheckedChange={(checked) => updateProfileSetting("showRealName", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Standort</Label>
                      <p className="text-sm text-muted-foreground">Zeige deinen Standort im Profil</p>
                    </div>
                    <Switch
                      checked={settings.profile.showLocation}
                      onCheckedChange={(checked) => updateProfileSetting("showLocation", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Beitrittsdatum</Label>
                      <p className="text-sm text-muted-foreground">Zeige wann du der Plattform beigetreten bist</p>
                    </div>
                    <Switch
                      checked={settings.profile.showJoinDate}
                      onCheckedChange={(checked) => updateProfileSetting("showJoinDate", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Zuletzt aktiv</Label>
                      <p className="text-sm text-muted-foreground">Zeige wann du zuletzt online warst</p>
                    </div>
                    <Switch
                      checked={settings.profile.showLastActive}
                      onCheckedChange={(checked) => updateProfileSetting("showLastActive", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>XP-Level</Label>
                      <p className="text-sm text-muted-foreground">Zeige dein aktuelles XP-Level und Fortschritt</p>
                    </div>
                    <Switch
                      checked={settings.profile.showXPLevel}
                      onCheckedChange={(checked) => updateProfileSetting("showXPLevel", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Achievements</Label>
                      <p className="text-sm text-muted-foreground">Zeige deine freigeschalteten Achievements</p>
                    </div>
                    <Switch
                      checked={settings.profile.showAchievements}
                      onCheckedChange={(checked) => updateProfileSetting("showAchievements", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experiences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Erlebnis-Einstellungen
              </CardTitle>
              <CardDescription>Kontrolliere die Sichtbarkeit und Interaktion mit deinen Erlebnissen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Standard-Sichtbarkeit für neue Erlebnisse</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Diese Einstellung wird als Standard für neue Erlebnisse verwendet
                </p>
                <Select
                  value={settings.experiences.defaultVisibility}
                  onValueChange={(value) => updateExperiencesSetting("defaultVisibility", value)}
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

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Interaktionen</h4>

                <div className="space-y-3">
                  <div>
                    <Label>Kommentare erlauben</Label>
                    <p className="text-sm text-muted-foreground mb-2">Wer darf deine Erlebnisse kommentieren?</p>
                    <Select
                      value={settings.experiences.allowComments}
                      onValueChange={(value) => updateExperiencesSetting("allowComments", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Jeder</SelectItem>
                        <SelectItem value="friends">Nur Freunde</SelectItem>
                        <SelectItem value="none">Niemand</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Likes erlauben</Label>
                    <p className="text-sm text-muted-foreground mb-2">Wer darf deine Erlebnisse liken?</p>
                    <Select
                      value={settings.experiences.allowLikes}
                      onValueChange={(value) => updateExperiencesSetting("allowLikes", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Jeder</SelectItem>
                        <SelectItem value="friends">Nur Freunde</SelectItem>
                        <SelectItem value="none">Niemand</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Metadaten</h4>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Standort anzeigen</Label>
                    <p className="text-sm text-muted-foreground">Zeige den Standort deiner Erlebnisse</p>
                  </div>
                  <Switch
                    checked={settings.experiences.showLocation}
                    onCheckedChange={(checked) => updateExperiencesSetting("showLocation", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Zeitstempel anzeigen</Label>
                    <p className="text-sm text-muted-foreground">Zeige wann das Erlebnis stattgefunden hat</p>
                  </div>
                  <Switch
                    checked={settings.experiences.showTimestamp}
                    onCheckedChange={(checked) => updateExperiencesSetting("showTimestamp", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Download erlauben</Label>
                    <p className="text-sm text-muted-foreground">Andere können deine Medien herunterladen</p>
                  </div>
                  <Switch
                    checked={settings.experiences.allowDownload}
                    onCheckedChange={(checked) => updateExperiencesSetting("allowDownload", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Soziale Interaktionen
              </CardTitle>
              <CardDescription>Bestimme wie andere mit dir interagieren können</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Freundschaftsanfragen</Label>
                  <p className="text-sm text-muted-foreground mb-2">Wer darf dir Freundschaftsanfragen senden?</p>
                  <Select
                    value={settings.social.allowFriendRequests}
                    onValueChange={(value) => updateSocialSetting("allowFriendRequests", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyone">Jeder</SelectItem>
                      <SelectItem value="friends-of-friends">Freunde von Freunden</SelectItem>
                      <SelectItem value="none">Niemand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Private Nachrichten</Label>
                  <p className="text-sm text-muted-foreground mb-2">Wer darf dir private Nachrichten senden?</p>
                  <Select
                    value={settings.social.allowMessages}
                    onValueChange={(value) => updateSocialSetting("allowMessages", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyone">Jeder</SelectItem>
                      <SelectItem value="friends">Nur Freunde</SelectItem>
                      <SelectItem value="none">Niemand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Gruppen-Einladungen</Label>
                  <p className="text-sm text-muted-foreground mb-2">Wer darf dich in Gruppen einladen?</p>
                  <Select
                    value={settings.social.allowGroupInvites}
                    onValueChange={(value) => updateSocialSetting("allowGroupInvites", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyone">Jeder</SelectItem>
                      <SelectItem value="friends">Nur Freunde</SelectItem>
                      <SelectItem value="none">Niemand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Markierungen in Erlebnissen</Label>
                  <p className="text-sm text-muted-foreground mb-2">Wer darf dich in Erlebnissen markieren?</p>
                  <Select
                    value={settings.social.allowTagging}
                    onValueChange={(value) => updateSocialSetting("allowTagging", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyone">Jeder</SelectItem>
                      <SelectItem value="friends">Nur Freunde</SelectItem>
                      <SelectItem value="none">Niemand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Online-Status anzeigen</Label>
                  <p className="text-sm text-muted-foreground">Andere können sehen, ob du online bist</p>
                </div>
                <Switch
                  checked={settings.social.showOnlineStatus}
                  onCheckedChange={(checked) => updateSocialSetting("showOnlineStatus", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Benachrichtigungs-Einstellungen
              </CardTitle>
              <CardDescription>Kontrolliere welche Benachrichtigungen du erhalten möchtest</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Allgemeine Benachrichtigungen</h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>E-Mail Benachrichtigungen</Label>
                      <p className="text-sm text-muted-foreground">Erhalte wichtige Updates per E-Mail</p>
                    </div>
                    <Switch
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(checked) => updateNotificationSetting("emailNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push-Benachrichtigungen</Label>
                      <p className="text-sm text-muted-foreground">Erhalte sofortige Benachrichtigungen im Browser</p>
                    </div>
                    <Switch
                      checked={settings.notifications.pushNotifications}
                      onCheckedChange={(checked) => updateNotificationSetting("pushNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Marketing E-Mails</Label>
                      <p className="text-sm text-muted-foreground">
                        Erhalte Informationen über neue Features und Angebote
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.marketingEmails}
                      onCheckedChange={(checked) => updateNotificationSetting("marketingEmails", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Wöchentlicher Digest</Label>
                      <p className="text-sm text-muted-foreground">Zusammenfassung deiner Aktivitäten per E-Mail</p>
                    </div>
                    <Switch
                      checked={settings.notifications.weeklyDigest}
                      onCheckedChange={(checked) => updateNotificationSetting("weeklyDigest", checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Aktivitäts-Benachrichtigungen</h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Achievement-Benachrichtigungen</Label>
                      <p className="text-sm text-muted-foreground">Benachrichtigung bei neuen Achievements</p>
                    </div>
                    <Switch
                      checked={settings.notifications.achievementAlerts}
                      onCheckedChange={(checked) => updateNotificationSetting("achievementAlerts", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Kommentar-Benachrichtigungen</Label>
                      <p className="text-sm text-muted-foreground">Benachrichtigung bei neuen Kommentaren</p>
                    </div>
                    <Switch
                      checked={settings.notifications.commentNotifications}
                      onCheckedChange={(checked) => updateNotificationSetting("commentNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Like-Benachrichtigungen</Label>
                      <p className="text-sm text-muted-foreground">Benachrichtigung bei neuen Likes</p>
                    </div>
                    <Switch
                      checked={settings.notifications.likeNotifications}
                      onCheckedChange={(checked) => updateNotificationSetting("likeNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Follower-Benachrichtigungen</Label>
                      <p className="text-sm text-muted-foreground">Benachrichtigung bei neuen Followern</p>
                    </div>
                    <Switch
                      checked={settings.notifications.followNotifications}
                      onCheckedChange={(checked) => updateNotificationSetting("followNotifications", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Datenverwendung
              </CardTitle>
              <CardDescription>Kontrolliere wie deine Daten verwendet werden</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Analytics erlauben</Label>
                    <p className="text-sm text-muted-foreground">
                      Hilf uns die Plattform zu verbessern durch anonyme Nutzungsdaten
                    </p>
                  </div>
                  <Switch
                    checked={settings.data.allowAnalytics}
                    onCheckedChange={(checked) => updateDataSetting("allowAnalytics", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Personalisierung erlauben</Label>
                    <p className="text-sm text-muted-foreground">Erhalte personalisierte Inhalte und Empfehlungen</p>
                  </div>
                  <Switch
                    checked={settings.data.allowPersonalization}
                    onCheckedChange={(checked) => updateDataSetting("allowPersonalization", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Daten mit Partnern teilen</Label>
                    <p className="text-sm text-muted-foreground">
                      Anonyme Daten mit vertrauenswürdigen Partnern teilen
                    </p>
                  </div>
                  <Switch
                    checked={settings.data.allowThirdPartySharing}
                    onCheckedChange={(checked) => updateDataSetting("allowThirdPartySharing", checked)}
                  />
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-base font-medium">Daten-Aufbewahrung</Label>
                <p className="text-sm text-muted-foreground mb-3">Wie lange sollen deine Daten gespeichert werden?</p>
                <Select
                  value={settings.data.dataRetention}
                  onValueChange={(value) => updateDataSetting("dataRetention", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1year">1 Jahr</SelectItem>
                    <SelectItem value="2years">2 Jahre</SelectItem>
                    <SelectItem value="5years">5 Jahre</SelectItem>
                    <SelectItem value="forever">Unbegrenzt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Daten-Management</h4>

                <div className="space-y-3">
                  <Button variant="outline" onClick={exportData} className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Meine Daten exportieren
                  </Button>

                  <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                      <div className="space-y-2">
                        <h5 className="font-medium text-red-800 dark:text-red-200">Gefahrenzone</h5>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          Diese Aktionen können nicht rückgängig gemacht werden.
                        </p>
                        <Button variant="destructive" onClick={deleteAccount} className="w-full">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Account dauerhaft löschen
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button>Einstellungen speichern</Button>
      </div>
    </div>
  )
}
