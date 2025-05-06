"use client"

import { useState } from "react"
import { Heart, Target, Bookmark, MoreHorizontal, Check, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface NexusResultsProps {
  filters: string[]
  timeRange: [Date, Date]
  advancedFilters?: any
  sortOption: "relevanz" | "datum" | "popularitaet"
  onSortChange: (option: "relevanz" | "datum" | "popularitaet") => void
}

export function NexusResults({ filters, timeRange, advancedFilters, sortOption, onSortChange }: NexusResultsProps) {
  const [viewMode, setViewMode] = useState<"karten" | "liste" | "kompakt">("karten")
  const [results, setResults] = useState([
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
      tags: ["luzider traum", "tokyo", "schwerelosigkeit"],
      intensity: 8,
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
      tags: ["meditation", "außerkörperlich", "shibuya", "zeitlosigkeit"],
      intensity: 9,
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
      tags: ["synchronizität", "akihabara", "traum", "freundschaft"],
      intensity: 7,
    },
  ])

  // Sortiere die Ergebnisse basierend auf der ausgewählten Option
  const sortedResults = [...results].sort((a, b) => {
    switch (sortOption) {
      case "datum":
        return b.date.getTime() - a.date.getTime()
      case "popularitaet":
        return b.likes - a.likes
      case "relevanz":
      default:
        // Für Relevanz könnten wir eine komplexere Logik implementieren
        // Hier verwenden wir eine einfache Kombination aus Likes und "Had Too"
        return b.likes + b.hadToo * 2 - (a.likes + a.hadToo * 2)
    }
  })

  const toggleLike = (id: string) => {
    setResults(
      results.map((result) =>
        result.id === id
          ? { ...result, liked: !result.liked, likes: result.liked ? result.likes - 1 : result.likes + 1 }
          : result,
      ),
    )
  }

  const toggleHadToo = (id: string) => {
    setResults(
      results.map((result) =>
        result.id === id
          ? {
              ...result,
              hadTooMarked: !result.hadTooMarked,
              hadToo: result.hadTooMarked ? result.hadToo - 1 : result.hadToo + 1,
            }
          : result,
      ),
    )
  }

  const toggleSave = (id: string) => {
    setResults(results.map((result) => (result.id === id ? { ...result, saved: !result.saved } : result)))
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Rendere die Ergebnisse basierend auf dem ausgewählten Ansichtsmodus
  const renderResults = () => {
    switch (viewMode) {
      case "liste":
        return (
          <div className="space-y-2">
            {sortedResults.map((result) => (
              <div
                key={result.id}
                className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-cyan-400/50 transition-colors p-3"
              >
                <div className="flex items-start">
                  <Avatar className="mr-3">
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
                      <span className="ml-auto text-sm text-gray-400">{formatDate(result.date)}</span>
                    </div>
                    <p className="text-sm mt-1">{result.summary}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {result.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end mt-2 space-x-2">
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

                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${result.saved ? "text-cyan-400" : "text-gray-400"}`}
                    onClick={() => toggleSave(result.id)}
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )

      case "kompakt":
        return (
          <div className="space-y-1">
            {sortedResults.map((result) => (
              <div
                key={result.id}
                className="bg-gray-800 rounded-md overflow-hidden border border-gray-700 hover:border-cyan-400/50 transition-colors p-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={result.user.avatar || "/placeholder.svg"} alt={result.user.name} />
                      <AvatarFallback>{result.user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{result.user.name}</span>
                    {result.user.verified && <Check className="h-3 w-3 ml-1 text-cyan-400" />}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">{formatDate(result.date)}</span>
                    <div className="flex items-center">
                      <Heart className={`h-3 w-3 ${result.liked ? "text-red-500" : "text-gray-400"}`} />
                      <span className="text-xs ml-1">{result.likes}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs mt-1 line-clamp-1">{result.summary}</p>
              </div>
            ))}
          </div>
        )

      case "karten":
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedResults.map((result) => (
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
                    <Badge variant="outline" className="bg-gray-700 text-gray-300 text-xs ml-2">
                      Intensität: {result.intensity}/10
                    </Badge>
                  </div>
                  <p className="text-sm">{result.summary}</p>
                  <Button variant="link" className="text-xs p-0 h-auto mt-1 text-cyan-400">
                    Original anzeigen
                  </Button>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {result.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
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
        )
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Ergebnisse</h2>

        <div className="flex items-center space-x-2">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
            <TabsList className="bg-gray-800">
              <TabsTrigger value="karten">Karten</TabsTrigger>
              <TabsTrigger value="liste">Liste</TabsTrigger>
              <TabsTrigger value="kompakt">Kompakt</TabsTrigger>
            </TabsList>
          </Tabs>

          <Select value={sortOption} onValueChange={(value) => onSortChange(value as any)}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sortieren nach" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevanz">Relevanz</SelectItem>
              <SelectItem value="datum">Datum (neueste)</SelectItem>
              <SelectItem value="popularitaet">Popularität</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {renderResults()}
    </div>
  )
}
