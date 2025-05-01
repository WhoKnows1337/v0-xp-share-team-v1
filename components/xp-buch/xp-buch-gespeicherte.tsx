"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bookmark, Calendar, MapPin, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

// Mock-Daten für gespeicherte Einträge
const mockGespeicherteEintraege = [
  {
    id: "saved1",
    title: "Wanderung im Schwarzwald",
    author: "NaturFreund42",
    authorId: "user123",
    date: "2023-08-15",
    location: "Schwarzwald, Deutschland",
    tags: ["Natur", "Wandern", "Wald"],
    imageUrl: "/black-forest-valley.png",
    excerpt: "Eine wunderschöne Wanderung durch den dichten Schwarzwald mit atemberaubenden Ausblicken...",
    savedAt: "2023-09-01",
    category: "Natur",
  },
  {
    id: "saved2",
    title: "Meditation am See",
    author: "ZenMaster",
    authorId: "user456",
    date: "2023-07-22",
    location: "Bodensee, Deutschland",
    tags: ["Meditation", "Entspannung", "See"],
    imageUrl: "/serene-meditation.png",
    excerpt: "Eine tiefgreifende Meditationserfahrung am ruhigen Ufer des Bodensees bei Sonnenaufgang...",
    savedAt: "2023-08-15",
    category: "Persönliches Wachstum",
  },
  {
    id: "saved3",
    title: "Pasta-Kochkurs in Italien",
    author: "FoodExplorer",
    authorId: "user789",
    date: "2023-06-10",
    location: "Bologna, Italien",
    tags: ["Kochen", "Italien", "Kulinarisch"],
    imageUrl: "/pasta-making-class.png",
    excerpt: "Ein authentischer Pasta-Kochkurs mit einer italienischen Nonna, die ihre Familienrezepte teilt...",
    savedAt: "2023-07-05",
    category: "Kulinarisch",
  },
  {
    id: "saved4",
    title: "Synchronizität im Berufsleben",
    author: "KarriereCoach",
    authorId: "user101",
    date: "2023-05-18",
    location: "Berlin, Deutschland",
    tags: ["Karriere", "Synchronizität", "Persönliches Wachstum"],
    imageUrl: "/synchronicity-career.png",
    excerpt: "Wie eine Reihe unerwarteter Zufälle zu einem bedeutenden Karrierewechsel führte...",
    savedAt: "2023-06-20",
    category: "Beruflich",
  },
  {
    id: "saved5",
    title: "Luzides Träumen am Meer",
    author: "TraumReisender",
    authorId: "user202",
    date: "2023-04-05",
    location: "Ostsee, Deutschland",
    tags: ["Träume", "Luzides Träumen", "Meer"],
    imageUrl: "/lucid-dream-ocean.png",
    excerpt: "Eine tiefgreifende Erfahrung mit luzidem Träumen während eines Retreats an der Ostsee...",
    savedAt: "2023-05-10",
    category: "Spirituell",
  },
]

export function XPBuchGespeicherte() {
  const [gespeicherteEintraege, setGespeicherteEintraege] = useState(mockGespeicherteEintraege)
  const [activeFilter, setActiveFilter] = useState("alle")
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  // Gefilterte Einträge basierend auf dem aktiven Filter und Suchbegriff
  const filteredEintraege = gespeicherteEintraege.filter((eintrag) => {
    const matchesSearch =
      eintrag.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eintrag.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eintrag.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      eintrag.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eintrag.category.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeFilter === "alle") return matchesSearch
    return eintrag.category.toLowerCase() === activeFilter.toLowerCase() && matchesSearch
  })

  // Kategorien für Filter extrahieren
  const categories = ["alle", ...new Set(gespeicherteEintraege.map((eintrag) => eintrag.category.toLowerCase()))]

  // Eintrag entfernen
  const removeEntry = (id: string) => {
    setGespeicherteEintraege((prev) => prev.filter((entry) => entry.id !== id))
    toast({
      title: "Eintrag entfernt",
      description: "Der gespeicherte Eintrag wurde erfolgreich entfernt.",
    })
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Gespeicherte Einträge</CardTitle>
          <div className="relative">
            <input
              type="text"
              placeholder="Suchen..."
              className="px-3 py-1 text-sm border rounded-md w-40 pl-7"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <CardDescription>Deine gespeicherten Erlebnisse von anderen Benutzern</CardDescription>
        <div className="flex overflow-x-auto pb-2 mt-2 gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={activeFilter === category ? "default" : "outline"}
              className="cursor-pointer capitalize"
              onClick={() => setActiveFilter(category)}
            >
              {category === "alle" ? "Alle" : category}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {filteredEintraege.length > 0 ? (
            <div className="space-y-4">
              {filteredEintraege.map((eintrag) => (
                <div key={eintrag.id} className="flex gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={eintrag.imageUrl || "/placeholder.svg"}
                      alt={eintrag.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium truncate">{eintrag.title}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <User className="h-3 w-3 mr-1" />
                          <Link href={`/profil/${eintrag.authorId}`} className="hover:underline">
                            {eintrag.author}
                          </Link>
                          <span className="mx-2">•</span>
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(eintrag.date).toLocaleDateString("de-DE")}
                          <span className="mx-2">•</span>
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="truncate">{eintrag.location}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => removeEntry(eintrag.id)}
                          title="Entfernen"
                        >
                          <Bookmark className="h-4 w-4 fill-current" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{eintrag.excerpt}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {eintrag.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-10 text-center">
              <Bookmark className="h-12 w-12 text-gray-300 mb-2" />
              <h3 className="text-lg font-medium text-gray-900">Keine gespeicherten Einträge</h3>
              <p className="text-sm text-gray-500 max-w-md mt-1">
                Du hast noch keine Einträge gespeichert oder deine Filterkriterien ergeben keine Treffer.
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
