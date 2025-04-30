"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Reply, MoreHorizontal } from "lucide-react"

interface KommentareProps {
  erlebnisId: string
  initialKommentare?: Array<{
    id: string
    autor: {
      name: string
      avatar?: string
    }
    text: string
    datum: string
    likes: number
    antworten: Array<{
      id: string
      autor: {
        name: string
        avatar?: string
      }
      text: string
      datum: string
      likes: number
    }>
  }>
}

export function Kommentare({ erlebnisId, initialKommentare = [] }: KommentareProps) {
  const [kommentar, setKommentar] = useState("")
  const [kommentare, setKommentare] = useState(
    initialKommentare.length > 0
      ? initialKommentare
      : [
          {
            id: "1",
            autor: {
              name: "NaturEntdecker",
              avatar: "/forest-explorer.png",
            },
            text: "Wow, das klingt nach einem unglaublichen Erlebnis! Ich hatte etwas Ähnliches im letzten Sommer erlebt, aber nicht so intensiv wie du es beschreibst.",
            datum: "vor 2 Tagen",
            likes: 5,
            antworten: [
              {
                id: "1-1",
                autor: {
                  name: "Traumreisende",
                  avatar: "/dream-traveler.png",
                },
                text: "Danke für deinen Kommentar! Wo genau hast du dein Erlebnis gehabt?",
                datum: "vor 1 Tag",
                likes: 2,
              },
            ],
          },
          {
            id: "2",
            autor: {
              name: "PhilosophischerWanderer",
              avatar: "/philosophical-wanderer.png",
            },
            text: "Ich finde es faszinierend, wie solche Erlebnisse unser Bewusstsein erweitern können. Hast du danach irgendwelche Veränderungen in deiner Wahrnehmung bemerkt?",
            datum: "vor 3 Tagen",
            likes: 8,
            antworten: [],
          },
        ],
  )

  const handleKommentarAbsenden = () => {
    if (!kommentar.trim()) return

    const neuerKommentar = {
      id: `${kommentare.length + 1}`,
      autor: {
        name: "Du",
        avatar: "/serene-meditation.png",
      },
      text: kommentar,
      datum: "gerade eben",
      likes: 0,
      antworten: [],
    }

    setKommentare([neuerKommentar, ...kommentare])
    setKommentar("")
  }

  return (
    <div className="mt-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Kommentare ({kommentare.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <Avatar>
              <AvatarImage src="/serene-meditation.png" alt="Dein Profilbild" />
              <AvatarFallback>Du</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Schreibe einen Kommentar..."
                value={kommentar}
                onChange={(e) => setKommentar(e.target.value)}
                className="mb-2"
              />
              <Button onClick={handleKommentarAbsenden} disabled={!kommentar.trim()}>
                Kommentar absenden
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {kommentare.map((kommentar) => (
              <div key={kommentar.id} className="space-y-4">
                <div className="flex space-x-4">
                  <Avatar>
                    <AvatarImage src={kommentar.autor.avatar || "/placeholder.svg"} alt={kommentar.autor.name} />
                    <AvatarFallback>{kommentar.autor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{kommentar.autor.name}</span>
                        <span className="text-muted-foreground text-sm ml-2">{kommentar.datum}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="mt-1 text-card-foreground">{kommentar.text}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <Heart className="h-4 w-4 mr-1" />
                        <span>{kommentar.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <Reply className="h-4 w-4 mr-1" />
                        <span>Antworten</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Antworten */}
                {kommentar.antworten.length > 0 && (
                  <div className="ml-12 space-y-4">
                    {kommentar.antworten.map((antwort) => (
                      <div key={antwort.id} className="flex space-x-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={antwort.autor.avatar || "/placeholder.svg"} alt={antwort.autor.name} />
                          <AvatarFallback>{antwort.autor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">{antwort.autor.name}</span>
                              <span className="text-muted-foreground text-sm ml-2">{antwort.datum}</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="mt-1 text-card-foreground">{antwort.text}</p>
                          <div className="flex items-center mt-2 space-x-4">
                            <Button variant="ghost" size="sm" className="text-gray-500">
                              <Heart className="h-4 w-4 mr-1" />
                              <span>{antwort.likes}</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
