"use client"

import { useState } from "react"
import { Heart, Target, Bookmark, MoreHorizontal, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NexusResultsProps {
  filters: string[]
  timeRange: [Date, Date]
}

export function NexusResults({ filters, timeRange }: NexusResultsProps) {
  const [sortBy, setSortBy] = useState("relevanz")
  const [results] = useState([
    {
      id: "1",
      user: {
        name: "MariaStern",
        avatar: "/contemplative-woman.png",
        verified: true,
      },
      date: new Date("2023-05-15"),
      summary:
        "Intensiver luzider Traum mit fliegenden Walen über Tokyo. Gefühl von Schwerelosigkeit und tiefem Frieden. Erwachte mit Gefühl von Verbundenheit.",
      likes: 24,
      hadToo: 3,
      saved: false,
      liked: false,
      hadTooMarked: false,
    },
    {
      id: "2",
      user: {
        name: "DreamWalker",
        avatar: "/dream-traveler.png",
        verified: true,
      },
      date: new Date("2023-06-22"),
      summary:
        "Meditation führte zu außerkörperlicher Erfahrung. Schwebte über Shibuya-Kreuzung und konnte Energieströme der Menschen sehen. Zeitgefühl völlig aufgelöst.",
      likes: 42,
      hadToo: 7,
      saved: true,
      liked: true,
      hadTooMarked: false,
    },
    {
      id: "3",
      user: {
        name: "CosmicJourney",
        avatar: "/philosophical-wanderer.png",
        verified: false,
      },
      date: new Date("2023-07-10"),
      summary:
        "Synchronizität in Akihabara: Dachte an alten Freund, drehte mich um und er stand dort nach 10 Jahren. Wir hatten am selben Tag den gleichen Traum.",
      likes: 18,
      hadToo: 1,
      saved: false,
      liked: false,
      hadTooMarked: true,
    },
  ])

  const toggleLike = (id: string) => {
    // In einer echten Anwendung würde hier ein API-Aufruf erfolgen
    console.log(`Toggle like for ${id}`)
  }

  const toggleHadToo = (id: string) => {
    // In einer echten Anwendung würde hier ein API-Aufruf erfolgen
    console.log(`Toggle "had too" for ${id}`)
  }

  const toggleSave = (id: string) => {
    // In einer echten Anwendung würde hier ein API-Aufruf erfolgen
    console.log(`Toggle save for ${id}`)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Ergebnisse</h2>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sortieren nach" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevanz">Relevanz</SelectItem>
            <SelectItem value="datum">Datum (neueste)</SelectItem>
            <SelectItem value="popularitaet">Popularität</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result) => (
          <div
            key={result.id}
            className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-cyan-400/50 transition-colors group"
          >
            {/* Header */}
            <div className="p-4 flex items-center space-x-3 border-b border-gray-700">
              <Avatar>
                <AvatarImage src={result.user.avatar || "/placeholder.svg"} alt={result.user.name} />
                <AvatarFallback>{result.user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="font-medium">{result.user.name}</span>
                  {result.user.verified && (
                    <Badge variant="outline" className="ml-2 bg-cyan-500/20 text-cyan-400">
                      <Check className="h-3 w-3 mr-1" />
                      Verifiziert
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-400">{formatDate(result.date)}</p>
              </div>
            </div>

            {/* Body */}
            <div className="p-4">
              <div className="flex items-start mb-2">
                <Badge variant="outline" className="bg-gray-700 text-gray-300 text-xs">
                  KI-Summary
                </Badge>
              </div>
              <p className="text-sm">{result.summary}</p>
              <Button variant="link" className="text-xs p-0 h-auto mt-1 text-cyan-400">
                Original anzeigen
              </Button>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${result.liked ? "text-red-500" : "text-gray-400"}`}
                  onClick={() => toggleLike(result.id)}
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <span className="text-xs text-gray-400">{result.likes}</span>

                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${result.hadTooMarked ? "text-yellow-500" : "text-gray-400"}`}
                  onClick={() => toggleHadToo(result.id)}
                >
                  <Target className="h-4 w-4" />
                </Button>
                <span className="text-xs text-gray-400">{result.hadToo}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${result.saved ? "text-cyan-400" : "text-gray-400"}`}
                  onClick={() => toggleSave(result.id)}
                >
                  <Bookmark className="h-4 w-4" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Teilen</DropdownMenuItem>
                    <DropdownMenuItem>Melden</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
