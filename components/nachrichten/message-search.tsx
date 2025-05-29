"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, X, Filter } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SearchResult {
  id: string
  type: "message" | "conversation" | "user"
  content: string
  author?: {
    name: string
    username: string
    avatar?: string
  }
  conversationName?: string
  timestamp: Date
  highlights: string[]
}

interface SearchFilters {
  dateRange: "all" | "today" | "week" | "month"
  messageType: "all" | "text" | "media" | "files"
  participants: string[]
}

export function MessageSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    dateRange: "all",
    messageType: "all",
    participants: [],
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    if (searchTerm.length > 2) {
      performSearch()
    } else {
      setResults([])
    }
  }, [searchTerm, filters])

  const performSearch = async () => {
    setIsLoading(true)

    // Mock-Suche (in einer echten App würde hier eine API-Anfrage stattfinden)
    await new Promise((resolve) => setTimeout(resolve, 300))

    const mockResults: SearchResult[] = [
      {
        id: "1",
        type: "message",
        content: `Hey, hast du schon das neue ${searchTerm} ausprobiert? Es ist wirklich interessant!`,
        author: {
          name: "Anna Schmidt",
          username: "anna_s",
          avatar: "/contemplative-woman.png",
        },
        conversationName: "Allgemeine Diskussion",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        highlights: [searchTerm],
      },
      {
        id: "2",
        type: "message",
        content: `Ich kann dir mehr über ${searchTerm} erzählen, wenn du möchtest. Lass uns später darüber sprechen.`,
        author: {
          name: "Max Weber",
          username: "max_w",
          avatar: "/philosophical-wanderer.png",
        },
        conversationName: "Direktnachricht",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        highlights: [searchTerm],
      },
      {
        id: "3",
        type: "conversation",
        content: `Unterhaltung über ${searchTerm} und verwandte Themen`,
        conversationName: `${searchTerm} Diskussionsgruppe`,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        highlights: [searchTerm],
      },
    ]

    setResults(
      mockResults.filter(
        (result) =>
          result.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.conversationName?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    )
    setIsLoading(false)
  }

  const highlightText = (text: string, highlights: string[]) => {
    let highlightedText = text
    highlights.forEach((highlight) => {
      const regex = new RegExp(`(${highlight})`, "gi")
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>')
    })
    return highlightedText
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60))
      return `vor ${minutes} Min`
    } else if (hours < 24) {
      return `vor ${hours}h`
    } else {
      const days = Math.floor(hours / 24)
      return `vor ${days}d`
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Nachrichten durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Suchfilter</DialogTitle>
            </DialogHeader>
            <SearchFilters filters={filters} onFiltersChange={setFilters} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Suche läuft...</p>
        </div>
      )}

      {!isLoading && searchTerm && results.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Keine Ergebnisse für "{searchTerm}" gefunden.</p>
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {results.length} Ergebnis{results.length !== 1 ? "se" : ""} für "{searchTerm}"
          </p>

          {results.map((result) => (
            <Card key={result.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  {result.author && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={result.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{result.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        {result.author && <span className="font-medium text-sm">{result.author.name}</span>}
                        <Badge variant="outline" className="text-xs">
                          {result.type === "message"
                            ? "Nachricht"
                            : result.type === "conversation"
                              ? "Unterhaltung"
                              : "Benutzer"}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatTimestamp(result.timestamp)}</span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-1">{result.conversationName}</p>

                    <div
                      className="text-sm"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(result.content, result.highlights),
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function SearchFilters({
  filters,
  onFiltersChange,
}: {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
}) {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="general">Allgemein</TabsTrigger>
        <TabsTrigger value="advanced">Erweitert</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Zeitraum</label>
          <select
            value={filters.dateRange}
            onChange={(e) => onFiltersChange({ ...filters, dateRange: e.target.value as any })}
            className="w-full p-2 border rounded-md"
          >
            <option value="all">Alle Nachrichten</option>
            <option value="today">Heute</option>
            <option value="week">Diese Woche</option>
            <option value="month">Dieser Monat</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Nachrichtentyp</label>
          <select
            value={filters.messageType}
            onChange={(e) => onFiltersChange({ ...filters, messageType: e.target.value as any })}
            className="w-full p-2 border rounded-md"
          >
            <option value="all">Alle Typen</option>
            <option value="text">Nur Text</option>
            <option value="media">Medien</option>
            <option value="files">Dateien</option>
          </select>
        </div>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Teilnehmer</label>
          <Input placeholder="Benutzer hinzufügen..." />
          <p className="text-xs text-muted-foreground mt-1">Suche nur in Unterhaltungen mit bestimmten Personen</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
