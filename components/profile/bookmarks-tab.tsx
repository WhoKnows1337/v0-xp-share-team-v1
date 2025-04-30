"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Eye, Heart, MessageSquare, Bookmark } from "lucide-react"
import { UserLink } from "@/components/user-link"
import Link from "next/link"
import type { User } from "@/lib/mock-users"

interface BookmarksTabProps {
  user: User
}

export function BookmarksTab({ user }: BookmarksTabProps) {
  // In einer echten App würden wir hier die Lesezeichen des Benutzers abrufen
  // Für Demozwecke erstellen wir einige Mock-Erlebnisse
  const [bookmarks] = useState([
    {
      id: "b1",
      titel: "Wanderung durch die Sächsische Schweiz",
      kurzfassung: "Atemberaubende Felsformationen und malerische Aussichten",
      datum: "05.07.2023",
      kategorie: {
        name: "Natur",
        farbe: "#4CAF50",
      },
      tags: ["wandern", "sachsen", "natur", "felsen"],
      medien: [{ url: "/elbe-sandstone-towers.png" }],
      autor: {
        name: "thomas_mueller",
        avatar: "/thoughtful-gaze.png",
        verifiziert: false,
      },
      statistik: {
        likes: 56,
        kommentare: 14,
        ansichten: 278,
      },
    },
    {
      id: "b2",
      titel: "Konzert in der Elbphilharmonie",
      kurzfassung: "Ein unvergesslicher Abend mit klassischer Musik",
      datum: "20.06.2023",
      kategorie: {
        name: "Kultur",
        farbe: "#FF9800",
      },
      tags: ["musik", "hamburg", "konzert", "klassik"],
      medien: [{ url: "/elbphilharmonie-interior.png" }],
      autor: {
        name: "lisa_wagner",
        avatar: "/thoughtful-gaze.png",
        verifiziert: true,
      },
      statistik: {
        likes: 42,
        kommentare: 9,
        ansichten: 215,
      },
    },
  ])

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Lesezeichen</h2>

      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bookmark) => (
            <motion.div
              key={bookmark.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden h-full flex flex-col">
                <div className="relative">
                  <img
                    src={bookmark.medien[0]?.url || "/placeholder.svg"}
                    alt={bookmark.titel}
                    className="h-48 w-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge style={{ backgroundColor: bookmark.kategorie.farbe }} className="text-white">
                      {bookmark.kategorie.name}
                    </Badge>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 dark:bg-slate-800/80 dark:hover:bg-slate-800/90"
                  >
                    <Bookmark className="h-4 w-4 fill-current" />
                  </Button>
                </div>

                <CardContent className="pt-4 flex-grow">
                  <Link href={`/erlebnis/${bookmark.id}`}>
                    <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors">
                      {bookmark.titel}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground text-sm mb-3">{bookmark.kurzfassung}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {bookmark.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{bookmark.datum}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="border-t pt-3 flex justify-between">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      <span>{bookmark.statistik.ansichten}</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      <span>{bookmark.statistik.likes}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      <span>{bookmark.statistik.kommentare}</span>
                    </div>
                  </div>

                  <UserLink
                    username={bookmark.autor.name}
                    avatar={bookmark.autor.avatar}
                    isVerifiziert={bookmark.autor.verifiziert}
                    size="sm"
                  />
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Keine Lesezeichen gefunden.</p>
        </div>
      )}
    </div>
  )
}
