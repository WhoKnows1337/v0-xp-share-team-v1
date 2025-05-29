"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { updatePrivacySettings } from "@/lib/mock-privacy"
import type { PrivacyLevel } from "@/types/privacy"
import { Shield, ArrowRight, ArrowLeft, Check, Globe, Users, Lock, User } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface PrivatsphareWizardProps {
  onComplete?: () => void
}

export function PrivatsphareWizard({ onComplete }: PrivatsphareWizardProps) {
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)

  // Privatsphäre-Einstellungen
  const [profileVisibility, setProfileVisibility] = useState<PrivacyLevel>("public")
  const [defaultVisibility, setDefaultVisibility] = useState<PrivacyLevel>("followers")
  const [locationSharing, setLocationSharing] = useState(true)
  const [activityTracking, setActivityTracking] = useState(true)
  const [searchVisibility, setSearchVisibility] = useState(true)
  const [allowComments, setAllowComments] = useState<PrivacyLevel>("followers")
  const [allowDirectMessages, setAllowDirectMessages] = useState<PrivacyLevel>("followers")
  const [showOnlineStatus, setShowOnlineStatus] = useState(true)
  const [thirdPartySharing, setThirdPartySharing] = useState(false)

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleComplete = async () => {
    setSaving(true)

    try {
      // Aktualisiere die Privatsphäre-Einstellungen
      await updatePrivacySettings({
        profileVisibility,
        defaultVisibility,
        locationSharing,
        activityTracking,
        searchVisibility,
        allowComments,
        allowDirectMessages,
        showOnlineStatus,
        thirdPartySharing,
      })

      toast({
        title: "Privatsphäre-Einstellungen gespeichert",
        description: "Deine Privatsphäre-Einstellungen wurden erfolgreich aktualisiert.",
      })

      if (onComplete) {
        onComplete()
      }
    } catch (error) {
      console.error("Fehler beim Speichern der Privatsphäre-Einstellungen:", error)

      toast({
        title: "Fehler",
        description:
          "Beim Speichern der Privatsphäre-Einstellungen ist ein Fehler aufgetreten. Bitte versuche es erneut.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Privatsphäre-Einstellungen</CardTitle>
        </div>
        <CardDescription>
          Richte deine Privatsphäre-Einstellungen ein, um zu kontrollieren, wer deine Inhalte sehen kann.
        </CardDescription>
        <Progress value={progress} className="h-1 mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Profil-Sichtbarkeit</h3>
              <p className="text-sm text-muted-foreground">Wähle aus, wer dein Profil sehen kann.</p>
            </div>

            <RadioGroup
              value={profileVisibility}
              onValueChange={(value) => setProfileVisibility(value as PrivacyLevel)}
            >
              <div className="flex items-start space-x-2 border p-4 rounded-md">
                <RadioGroupItem value="public" id="profile-public" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="profile-public" className="flex items-center gap-2 font-medium">
                    <Globe className="h-4 w-4" />
                    Öffentlich
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Jeder kann dein Profil sehen, auch ohne Anmeldung.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2 border p-4 rounded-md">
                <RadioGroupItem value="followers" id="profile-followers" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="profile-followers" className="flex items-center gap-2 font-medium">
                    <Users className="h-4 w-4" />
                    Nur Follower
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Nur Benutzer, die dir folgen, können dein Profil sehen.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2 border p-4 rounded-md">
                <RadioGroupItem value="private" id="profile-private" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="profile-private" className="flex items-center gap-2 font-medium">
                    <Lock className="h-4 w-4" />
                    Privat
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Dein Profil ist privat und nur auf Einladung sichtbar.
                  </p>
                </div>
              </div>
            </RadioGroup>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="searchVisibility">In Suche anzeigen</Label>
                <p className="text-sm text-muted-foreground">Erlaube anderen, dich in der Suche zu finden</p>
              </div>
              <Switch id="searchVisibility" checked={searchVisibility} onCheckedChange={setSearchVisibility} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Inhalts-Sichtbarkeit</h3>
              <p className="text-sm text-muted-foreground">Lege fest, wer standardmäßig deine Inhalte sehen kann.</p>
            </div>

            <RadioGroup
              value={defaultVisibility}
              onValueChange={(value) => setDefaultVisibility(value as PrivacyLevel)}
            >
              <div className="flex items-start space-x-2 border p-4 rounded-md">
                <RadioGroupItem value="public" id="content-public" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="content-public" className="flex items-center gap-2 font-medium">
                    <Globe className="h-4 w-4" />
                    Öffentlich
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Jeder kann deine Inhalte sehen, auch ohne Anmeldung.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2 border p-4 rounded-md">
                <RadioGroupItem value="followers" id="content-followers" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="content-followers" className="flex items-center gap-2 font-medium">
                    <Users className="h-4 w-4" />
                    Nur Follower
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Nur Benutzer, die dir folgen, können deine Inhalte sehen.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2 border p-4 rounded-md">
                <RadioGroupItem value="private" id="content-private" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="content-private" className="flex items-center gap-2 font-medium">
                    <Lock className="h-4 w-4" />
                    Privat
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">Nur du kannst deine Inhalte sehen.</p>
                </div>
              </div>

              <div className="flex items-start space-x-2 border p-4 rounded-md">
                <RadioGroupItem value="custom" id="content-custom" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="content-custom" className="flex items-center gap-2 font-medium">
                    <User className="h-4 w-4" />
                    Benutzerdefiniert
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Du entscheidest für jeden Inhalt individuell, wer ihn sehen kann.
                  </p>
                </div>
              </div>
            </RadioGroup>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="locationSharing">Standort teilen</Label>
                <p className="text-sm text-muted-foreground">
                  Erlaube der Plattform, deinen Standort für Erlebnisse zu verwenden
                </p>
              </div>
              <Switch id="locationSharing" checked={locationSharing} onCheckedChange={setLocationSharing} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Interaktionen</h3>
              <p className="text-sm text-muted-foreground">Lege fest, wie andere mit dir interagieren können.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Wer kann deine Inhalte kommentieren?</Label>
                <RadioGroup value={allowComments} onValueChange={(value) => setAllowComments(value as PrivacyLevel)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="comments-public" />
                    <Label htmlFor="comments-public">Alle</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="followers" id="comments-followers" />
                    <Label htmlFor="comments-followers">Nur Follower</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="comments-private" />
                    <Label htmlFor="comments-private">Niemand</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Wer kann dir Direktnachrichten senden?</Label>
                <RadioGroup
                  value={allowDirectMessages}
                  onValueChange={(value) => setAllowDirectMessages(value as PrivacyLevel)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="messages-public" />
                    <Label htmlFor="messages-public">Alle</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="followers" id="messages-followers" />
                    <Label htmlFor="messages-followers">Nur Follower</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="messages-private" />
                    <Label htmlFor="messages-private">Niemand</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showOnlineStatus">Online-Status anzeigen</Label>
                <p className="text-sm text-muted-foreground">Zeige anderen, wenn du online bist</p>
              </div>
              <Switch id="showOnlineStatus" checked={showOnlineStatus} onCheckedChange={setShowOnlineStatus} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="activityTracking">Aktivitäten teilen</Label>
                <p className="text-sm text-muted-foreground">
                  Teile deine Aktivitäten (Likes, Kommentare, etc.) mit Followern
                </p>
              </div>
              <Switch id="activityTracking" checked={activityTracking} onCheckedChange={setActivityTracking} />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Datenschutz</h3>
              <p className="text-sm text-muted-foreground">Lege fest, wie deine Daten verwendet werden dürfen.</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="thirdPartySharing">Datenfreigabe an Dritte</Label>
                <p className="text-sm text-muted-foreground">
                  Erlaube die Weitergabe deiner anonymisierten Daten für Verbesserungen
                </p>
              </div>
              <Switch id="thirdPartySharing" checked={thirdPartySharing} onCheckedChange={setThirdPartySharing} />
            </div>

            <div className="border p-4 rounded-md bg-muted/20">
              <h4 className="text-sm font-medium">Zusammenfassung deiner Einstellungen</h4>
              <ul className="mt-2 space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Profil-Sichtbarkeit:{" "}
                  {profileVisibility === "public"
                    ? "Öffentlich"
                    : profileVisibility === "followers"
                      ? "Nur Follower"
                      : "Privat"}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Standard-Sichtbarkeit für Inhalte:{" "}
                  {defaultVisibility === "public"
                    ? "Öffentlich"
                    : defaultVisibility === "followers"
                      ? "Nur Follower"
                      : defaultVisibility === "private"
                        ? "Privat"
                        : "Benutzerdefiniert"}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Kommentare:{" "}
                  {allowComments === "public"
                    ? "Alle können kommentieren"
                    : allowComments === "followers"
                      ? "Nur Follower können kommentieren"
                      : "Niemand kann kommentieren"}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Direktnachrichten:{" "}
                  {allowDirectMessages === "public"
                    ? "Alle können Nachrichten senden"
                    : allowDirectMessages === "followers"
                      ? "Nur Follower können Nachrichten senden"
                      : "Niemand kann Nachrichten senden"}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Standort teilen: {locationSharing ? "Aktiviert" : "Deaktiviert"}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Aktivitäten teilen: {activityTracking ? "Aktiviert" : "Deaktiviert"}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  In Suche anzeigen: {searchVisibility ? "Aktiviert" : "Deaktiviert"}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Online-Status anzeigen: {showOnlineStatus ? "Aktiviert" : "Deaktiviert"}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Datenfreigabe an Dritte: {thirdPartySharing ? "Aktiviert" : "Deaktiviert"}
                </li>
              </ul>

              <p className="mt-4 text-sm text-muted-foreground">
                Du kannst diese Einstellungen jederzeit in deinem Profil ändern.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t p-6">
        <Button variant="outline" onClick={handleBack} disabled={step === 1}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück
        </Button>

        <Button onClick={handleNext} disabled={saving}>
          {step < totalSteps ? (
            <>
              Weiter
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          ) : (
            <>
              {saving ? "Speichern..." : "Einstellungen speichern"}
              <Check className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
