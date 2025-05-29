"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, ChevronRight, UserPlus, BookOpen, Share2, Users } from "lucide-react"

export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const steps = [
    {
      title: "Willkommen bei XP-Share",
      description: "Entdecke, wie du deine Erlebnisse teilen und von anderen lernen kannst.",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Profil erstellen</h3>
              <p className="text-sm text-muted-foreground">Personalisiere dein Profil und teile deine Interessen</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Erlebnisse dokumentieren</h3>
              <p className="text-sm text-muted-foreground">Halte deine besonderen Momente fest</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Share2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Teilen und Entdecken</h3>
              <p className="text-sm text-muted-foreground">Teile deine Erlebnisse und entdecke die anderer</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Gruppen beitreten</h3>
              <p className="text-sm text-muted-foreground">Finde Gleichgesinnte und tausche dich aus</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Dein erstes Erlebnis",
      description: "Lerne, wie du ein Erlebnis dokumentierst und teilst.",
      content: (
        <div className="space-y-4">
          <Tabs defaultValue="dokumentieren" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dokumentieren">Dokumentieren</TabsTrigger>
              <TabsTrigger value="teilen">Teilen</TabsTrigger>
              <TabsTrigger value="entdecken">Entdecken</TabsTrigger>
            </TabsList>
            <TabsContent value="dokumentieren" className="space-y-4 pt-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">1. Erlebnis-Wizard öffnen</h3>
                <p className="text-sm text-muted-foreground">Klicke auf den "+" Button in der Navigation</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">2. Details eingeben</h3>
                <p className="text-sm text-muted-foreground">Gib Titel, Beschreibung und Datum ein</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">3. Medien hinzufügen</h3>
                <p className="text-sm text-muted-foreground">Füge Fotos, Videos oder Audioaufnahmen hinzu</p>
              </div>
            </TabsContent>
            <TabsContent value="teilen" className="space-y-4 pt-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">1. Privatsphäre-Einstellungen</h3>
                <p className="text-sm text-muted-foreground">Wähle, wer dein Erlebnis sehen kann</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">2. Teilen mit Freunden</h3>
                <p className="text-sm text-muted-foreground">Wähle Freunde oder Gruppen zum Teilen aus</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">3. Link generieren</h3>
                <p className="text-sm text-muted-foreground">Erstelle einen Link zum direkten Teilen</p>
              </div>
            </TabsContent>
            <TabsContent value="entdecken" className="space-y-4 pt-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">1. Entdecken-Seite besuchen</h3>
                <p className="text-sm text-muted-foreground">Finde neue Erlebnisse auf der Entdecken-Seite</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">2. Filter nutzen</h3>
                <p className="text-sm text-muted-foreground">Filtere nach Kategorien, Orten oder Zeit</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">3. Interagieren</h3>
                <p className="text-sm text-muted-foreground">Kommentiere und speichere interessante Erlebnisse</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ),
    },
    {
      title: "Deine Einstellungen",
      description: "Passe XP-Share an deine Bedürfnisse an.",
      content: (
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Privatsphäre-Einstellungen</h3>
            <p className="text-sm text-muted-foreground">
              Lege fest, wer deine Inhalte sehen kann und wie du kontaktiert werden möchtest.
            </p>
            <Button variant="link" className="px-0">
              Einstellungen öffnen
            </Button>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Benachrichtigungen</h3>
            <p className="text-sm text-muted-foreground">Bestimme, worüber du informiert werden möchtest.</p>
            <Button variant="link" className="px-0">
              Benachrichtigungen anpassen
            </Button>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Profil vervollständigen</h3>
            <p className="text-sm text-muted-foreground">Füge ein Profilbild und weitere Informationen hinzu.</p>
            <Button variant="link" className="px-0">
              Zum Profil
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "Bereit zum Starten!",
      description: "Du bist jetzt bereit, XP-Share zu nutzen.",
      content: (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-3">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-xl font-medium">Glückwunsch!</h3>
          <p className="mt-2 text-muted-foreground">
            Du hast das Onboarding abgeschlossen und bist bereit, XP-Share zu nutzen.
          </p>
          <p className="mt-4 text-muted-foreground">
            Entdecke neue Erlebnisse, teile deine eigenen und verbinde dich mit Gleichgesinnten.
          </p>
        </div>
      ),
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentStepData = steps[currentStep]

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>{currentStepData.title}</CardTitle>
        <CardDescription>{currentStepData.description}</CardDescription>
      </CardHeader>
      <CardContent>{currentStepData.content}</CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
          Zurück
        </Button>
        <div className="flex items-center gap-2">
          {steps.map((_, index) => (
            <div key={index} className={`h-2 w-2 rounded-full ${index === currentStep ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>
        <Button onClick={handleNext}>
          {currentStep === steps.length - 1 ? "Fertig" : "Weiter"}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
