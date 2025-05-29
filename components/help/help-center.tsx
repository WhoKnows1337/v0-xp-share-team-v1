"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, Mail, HelpCircle, BookOpen, MessageCircle } from "lucide-react"

export function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("")

  const faqs = [
    {
      question: "Wie erstelle ich ein Erlebnis?",
      answer:
        "Um ein neues Erlebnis zu erstellen, klicke auf den '+' Button in der Navigation und folge dem Erlebnis-Wizard. Dort kannst du Titel, Beschreibung, Datum, Ort und Medien hinzufügen.",
    },
    {
      question: "Wer kann meine Erlebnisse sehen?",
      answer:
        "Das hängt von deinen Privatsphäre-Einstellungen ab. Du kannst wählen zwischen 'Öffentlich' (alle können es sehen), 'Nur Freunde' (nur deine Kontakte) oder 'Privat' (nur du). Diese Einstellung kannst du für jedes Erlebnis individuell festlegen.",
    },
    {
      question: "Wie kann ich meine Erlebnisse teilen?",
      answer:
        "Auf der Detailseite eines Erlebnisses findest du einen 'Teilen' Button. Dort kannst du einen Link generieren oder das Erlebnis direkt mit Freunden oder Gruppen teilen.",
    },
    {
      question: "Kann ich meine Erlebnisse nachträglich bearbeiten?",
      answer:
        "Ja, du kannst deine Erlebnisse jederzeit bearbeiten. Gehe dazu zur Detailseite des Erlebnisses und klicke auf den 'Bearbeiten' Button.",
    },
    {
      question: "Wie erstelle ich eine Gruppe?",
      answer:
        "Gehe zur Gruppen-Seite und klicke auf 'Neue Gruppe erstellen'. Gib einen Namen und eine Beschreibung ein und lege die Privatsphäre-Einstellungen fest.",
    },
    {
      question: "Wie funktioniert das XP-Buch?",
      answer:
        "Das XP-Buch ist dein persönliches Tagebuch. Hier kannst du private Einträge erstellen, die nur für dich sichtbar sind. Du kannst sie später in öffentliche Erlebnisse umwandeln, wenn du möchtest.",
    },
  ]

  const filteredFaqs = searchQuery
    ? faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : faqs

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hilfe & Support</CardTitle>
        <CardDescription>Finde Antworten auf deine Fragen oder kontaktiere uns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center gap-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Suche nach Hilfe-Themen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>

        <Tabs defaultValue="faq">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="guides">Anleitungen</TabsTrigger>
            <TabsTrigger value="contact">Kontakt</TabsTrigger>
          </TabsList>
          <TabsContent value="faq" className="mt-6">
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  Keine Ergebnisse für "{searchQuery}" gefunden.
                </div>
              )}
            </Accordion>
          </TabsContent>
          <TabsContent value="guides" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Erste Schritte</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">
                    Lerne die Grundlagen von XP-Share kennen und starte deine Reise.
                  </p>
                  <Button variant="link" className="mt-2 px-0">
                    Anleitung lesen
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Erlebnisse erstellen</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">
                    Erfahre, wie du beeindruckende Erlebnisse erstellst und teilst.
                  </p>
                  <Button variant="link" className="mt-2 px-0">
                    Anleitung lesen
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Gruppen verwalten</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">Lerne, wie du Gruppen erstellst und verwaltest.</p>
                  <Button variant="link" className="mt-2 px-0">
                    Anleitung lesen
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Privatsphäre-Einstellungen</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">
                    Schütze deine Daten mit den richtigen Privatsphäre-Einstellungen.
                  </p>
                  <Button variant="link" className="mt-2 px-0">
                    Anleitung lesen
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="contact" className="mt-6">
            <div className="grid gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">E-Mail Support</h3>
                  <p className="text-sm text-muted-foreground">Schreibe uns eine E-Mail an support@xp-share.de</p>
                  <p className="text-sm text-muted-foreground">Antwortzeit: Innerhalb von 24 Stunden</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Live-Chat</h3>
                  <p className="text-sm text-muted-foreground">Chatte mit unserem Support-Team in Echtzeit</p>
                  <p className="text-sm text-muted-foreground">Verfügbar: Mo-Fr, 9:00 - 17:00 Uhr</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Chat starten
                  </Button>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <HelpCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Community-Forum</h3>
                  <p className="text-sm text-muted-foreground">Stelle Fragen und erhalte Antworten von der Community</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Forum besuchen
                  </Button>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Wissensdatenbank</h3>
                  <p className="text-sm text-muted-foreground">Durchsuche unsere umfangreiche Dokumentation</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Wissensdatenbank öffnen
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
