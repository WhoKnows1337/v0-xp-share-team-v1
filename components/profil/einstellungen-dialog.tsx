"use client"

import type React from "react"

import { useState, type ReactNode } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/mock-users"
import { toast } from "@/hooks/use-toast"

interface EinstellungenDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children?: ReactNode
}

export function EinstellungenDialog({ open, onOpenChange, children }: EinstellungenDialogProps) {
  const currentUser = getCurrentUser()
  const [profileData, setProfileData] = useState({
    name: currentUser.name,
    username: currentUser.username,
    bio: currentUser.bio || "",
    email: "astrid@example.com", // Beispiel-E-Mail
    website: currentUser.website || "",
    location: currentUser.location || "",
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showLocation: true,
    allowComments: true,
    showActivity: true,
    allowDirectMessages: "all", // "all", "followers", "none"
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    commentNotifications: true,
    mentionNotifications: true,
    newFollowerNotifications: true,
    directMessageNotifications: true,
    channelNotifications: true,
    channelMentionNotifications: true,
    digestEmail: "weekly", // "daily", "weekly", "never"
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePrivacyToggle = (key: keyof typeof privacySettings) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handlePrivacyChange = (key: keyof typeof privacySettings, value: any) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleNotificationToggle = (key: keyof typeof notificationSettings) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleNotificationChange = (key: keyof typeof notificationSettings, value: any) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = () => {
    // In einer echten Anwendung würden die Einstellungen an den Server gesendet werden
    toast({
      title: "Einstellungen gespeichert",
      description: "Deine Einstellungen wurden erfolgreich aktualisiert.",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Einstellungen</DialogTitle>
          {children || <DialogDescription>Passe dein Profil und deine Einstellungen an</DialogDescription>}
        </DialogHeader>
        <Tabs defaultValue="profil" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profil">Profil</TabsTrigger>
            <TabsTrigger value="privatsphare">Privatsphäre</TabsTrigger>
            <TabsTrigger value="benachrichtigungen">Benachrichtigungen</TabsTrigger>
          </TabsList>
          <TabsContent value="profil" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={profileData.name} onChange={handleProfileChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Benutzername</Label>
                <Input id="username" name="username" value={profileData.username} onChange={handleProfileChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Über mich</Label>
                <Textarea id="bio" name="bio" value={profileData.bio} onChange={handleProfileChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input id="email" name="email" type="email" value={profileData.email} onChange={handleProfileChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" name="website" value={profileData.website} onChange={handleProfileChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Standort</Label>
                <Input id="location" name="location" value={profileData.location} onChange={handleProfileChange} />
              </div>
            </div>
            <Button className="w-full" onClick={handleSaveSettings}>
              Speichern
            </Button>
          </TabsContent>
          <TabsContent value="privatsphare" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="profile-visibility" className="text-base">
                    Profilsichtbarkeit
                  </Label>
                  <p className="text-sm text-gray-500">Wer kann dein Profil sehen?</p>
                </div>
                <select
                  id="profile-visibility"
                  className="border rounded p-1"
                  value={privacySettings.profileVisibility}
                  onChange={(e) => handlePrivacyChange("profileVisibility", e.target.value)}
                >
                  <option value="public">Öffentlich</option>
                  <option value="followers">Nur Follower</option>
                  <option value="private">Privat</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-location" className="text-base">
                    Standort anzeigen
                  </Label>
                  <p className="text-sm text-gray-500">Zeige deinen Standort in deinem Profil an</p>
                </div>
                <Switch
                  id="show-location"
                  checked={privacySettings.showLocation}
                  onCheckedChange={() => handlePrivacyToggle("showLocation")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allow-comments" className="text-base">
                    Kommentare erlauben
                  </Label>
                  <p className="text-sm text-gray-500">Erlaube anderen, deine Erlebnisse zu kommentieren</p>
                </div>
                <Switch
                  id="allow-comments"
                  checked={privacySettings.allowComments}
                  onCheckedChange={() => handlePrivacyToggle("allowComments")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-activity" className="text-base">
                    Aktivität anzeigen
                  </Label>
                  <p className="text-sm text-gray-500">Zeige deine Aktivität in Feeds an</p>
                </div>
                <Switch
                  id="show-activity"
                  checked={privacySettings.showActivity}
                  onCheckedChange={() => handlePrivacyToggle("showActivity")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="direct-messages" className="text-base">
                    Direktnachrichten
                  </Label>
                  <p className="text-sm text-gray-500">Wer darf dir Direktnachrichten senden?</p>
                </div>
                <select
                  id="direct-messages"
                  className="border rounded p-1"
                  value={privacySettings.allowDirectMessages}
                  onChange={(e) => handlePrivacyChange("allowDirectMessages", e.target.value)}
                >
                  <option value="all">Alle</option>
                  <option value="followers">Nur Follower</option>
                  <option value="none">Niemand</option>
                </select>
              </div>
            </div>
            <Button className="w-full" onClick={handleSaveSettings}>
              Speichern
            </Button>
          </TabsContent>
          <TabsContent value="benachrichtigungen" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="text-base">
                    E-Mail-Benachrichtigungen
                  </Label>
                  <p className="text-sm text-gray-500">Erhalte Benachrichtigungen per E-Mail</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={() => handleNotificationToggle("emailNotifications")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="comment-notifications" className="text-base">
                    Kommentar-Benachrichtigungen
                  </Label>
                  <p className="text-sm text-gray-500">Benachrichtigungen, wenn jemand deine Erlebnisse kommentiert</p>
                </div>
                <Switch
                  id="comment-notifications"
                  checked={notificationSettings.commentNotifications}
                  onCheckedChange={() => handleNotificationToggle("commentNotifications")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="mention-notifications" className="text-base">
                    Erwähnungs-Benachrichtigungen
                  </Label>
                  <p className="text-sm text-gray-500">Benachrichtigungen, wenn jemand dich erwähnt</p>
                </div>
                <Switch
                  id="mention-notifications"
                  checked={notificationSettings.mentionNotifications}
                  onCheckedChange={() => handleNotificationToggle("mentionNotifications")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="follower-notifications" className="text-base">
                    Neue Follower
                  </Label>
                  <p className="text-sm text-gray-500">Benachrichtigungen bei neuen Followern</p>
                </div>
                <Switch
                  id="follower-notifications"
                  checked={notificationSettings.newFollowerNotifications}
                  onCheckedChange={() => handleNotificationToggle("newFollowerNotifications")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="direct-message-notifications" className="text-base">
                    Direktnachrichten
                  </Label>
                  <p className="text-sm text-gray-500">Benachrichtigungen bei neuen Direktnachrichten</p>
                </div>
                <Switch
                  id="direct-message-notifications"
                  checked={notificationSettings.directMessageNotifications}
                  onCheckedChange={() => handleNotificationToggle("directMessageNotifications")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="channel-notifications" className="text-base">
                    Channel-Benachrichtigungen
                  </Label>
                  <p className="text-sm text-gray-500">Benachrichtigungen für Aktivitäten in Channels</p>
                </div>
                <Switch
                  id="channel-notifications"
                  checked={notificationSettings.channelNotifications}
                  onCheckedChange={() => handleNotificationToggle("channelNotifications")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="channel-mention-notifications" className="text-base">
                    Channel-Erwähnungen
                  </Label>
                  <p className="text-sm text-gray-500">Benachrichtigungen, wenn du in einem Channel erwähnt wirst</p>
                </div>
                <Switch
                  id="channel-mention-notifications"
                  checked={notificationSettings.channelMentionNotifications}
                  onCheckedChange={() => handleNotificationToggle("channelMentionNotifications")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="digest-email" className="text-base">
                    Zusammenfassungs-E-Mail
                  </Label>
                  <p className="text-sm text-gray-500">Erhalte regelmäßige Zusammenfassungen deiner Aktivitäten</p>
                </div>
                <select
                  id="digest-email"
                  className="border rounded p-1"
                  value={notificationSettings.digestEmail}
                  onChange={(e) => handleNotificationChange("digestEmail", e.target.value)}
                >
                  <option value="daily">Täglich</option>
                  <option value="weekly">Wöchentlich</option>
                  <option value="never">Nie</option>
                </select>
              </div>
            </div>
            <Button className="w-full" onClick={handleSaveSettings}>
              Speichern
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
