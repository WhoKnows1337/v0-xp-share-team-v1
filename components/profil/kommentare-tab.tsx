"use client"

import { motion } from "framer-motion"
import { Calendar, MessageSquare, ThumbsUp, MoreHorizontal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock-Daten für Kommentare
const mockKommentare = [
  {
    id: "k1",
    text: "Das ist wirklich faszinierend! Ich hatte eine ähnliche Erfahrung letztes Jahr, aber nicht so intensiv wie du sie beschreibst. Hast du bestimmte Meditationstechniken verwendet?",
    datum: "18.03.2023",
    erlebnis: {
      id: "e5",
      titel: "Tiefe Meditation und Zeitlosigkeit",
      autor: {
        username: "MeditationsMeister",
        avatar: "/serene-spirit.png",
      },
    },
    likes: 12,
  },
  {
    id: "k2",
    text: "Ich glaube, die Synchronizitäten in deinem Leben sind kein Zufall. Manchmal müssen wir einfach auf die Zeichen achten, die uns das Universum sendet. Danke fürs Teilen!",
    datum: "20.06.2023",
    erlebnis: {
      id: "e6",
      titel: "Synchronizität und Karrierewechsel",
      autor: {
        username: "UniversumsForscher",
        avatar: "/elemental-convergence.png",
      },
    },
    likes: 8,
  },
  {
    id: "k3",
    text: "Deine Beschreibung der Astralreise hat mich inspiriert, es selbst zu versuchen. Kannst du vielleicht ein paar Tipps für Anfänger teilen?",
    datum: "05.04.2023",
    erlebnis: {
      id: "e7",
      titel: "Astralreise in die Akasha-Chronik",
      autor: {
        username: "NeugierigerGeist",
        avatar: "/blue-being-wondering.png",
      },
    },
    likes: 5,
  },
  {
    id: "k4",
    text: "Ich bin skeptisch, was solche Erfahrungen angeht, aber deine detaillierte Beschreibung lässt mich zumindest darüber nachdenken. Danke für den Einblick!",
    datum: "10.05.2023",
    erlebnis: {
      id: "e8",
      titel: "Begegnung mit einem Schutzgeist",
      autor: {
        username: "SkeptischerDenker",
        avatar: "/placeholder.svg?height=40&width=40&query=avatar%20skeptic",
      },
    },
    likes: 3,
  },
]

interface KommentareTabProps {
  benutzer: any
}

export function KommentareTab({ benutzer }: KommentareTabProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Kommentare</h2>

      <div className="space-y-4">
        {mockKommentare.map((kommentar) => (
          <motion.div
            key={kommentar.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={kommentar.erlebnis.autor.avatar || "/placeholder.svg"}
                          alt={kommentar.erlebnis.autor.username}
                        />
                        <AvatarFallback>
                          {kommentar.erlebnis.autor.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        Kommentar zu &quot;{kommentar.erlebnis.titel}&quot; von {kommentar.erlebnis.autor.username}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{kommentar.datum}</span>
                      </div>
                      <p className="mt-2 text-sm">{kommentar.text}</p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Mehr Optionen</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Zum Erlebnis gehen</DropdownMenuItem>
                      <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">Löschen</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-3 flex items-center">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    <span>{kommentar.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    <span>Antworten</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {mockKommentare.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Keine Kommentare gefunden.</p>
        </div>
      )}
    </div>
  )
}
