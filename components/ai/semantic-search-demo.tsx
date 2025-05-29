"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Sparkles, Brain, Loader2 } from "lucide-react"
import { mockErlebnisse } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export function SemanticSearchDemo() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Bitte gib einen Suchbegriff ein",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)
    try {
      // Simuliere API-Call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In einer echten Implementierung würde hier die semantische Suche stattfinden
      // Für die Demo verwenden wir eine vereinfachte Version
      const mockResults = mockErlebnisse
        .filter(
          (e) =>
            e.titel.toLowerCase().includes(query.toLowerCase()) ||
            e.beschreibung.toLowerCase().includes(query.toLowerCase()) ||
            e.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
        )
        .slice(0, 5)
        .map((e) => ({
          item: e,
          score: Math.random() * 0.5 + 0.5, // Mock-Score zwischen 0.5 und 1.0
          highlights: [e.kurzfassung.substring(0, 150) + "...", `Tags: ${e.tags.slice(0, 3).join(", ")}`],
        }))

      setResults(mockResults)

      if (mockResults.length === 0) {
        toast({
          title: "Keine Ergebnisse gefunden",
          description: "Versuche es mit anderen Suchbegriffen",
        })
      }
    } catch (error) {
      toast({
        title: "Fehler bei der Suche",
        description: "Bitte versuche es später erneut",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          Semantische Suche
        </CardTitle>
        <CardDescription>Finde Erlebnisse basierend auf Bedeutung, nicht nur Schlüsselwörtern</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Suche nach Erlebnissen, Gefühlen, Themen..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">{results.length} Ergebnisse gefunden</h3>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                AI-powered
              </Badge>
            </div>

            {results.map((result, index) => (
              <Card key={index} className="border-l-4 border-l-purple-500">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium">{result.item.titel}</h4>
                      <Badge variant="outline">{Math.round(result.score * 100)}% Match</Badge>
                    </div>

                    <div className="text-sm text-muted-foreground space-y-1">
                      {result.highlights.map((highlight: string, i: number) => (
                        <p key={i}>{highlight}</p>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {result.item.kategorie.name}
                      </Badge>
                      {result.item.tags.slice(0, 2).map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isSearching && results.length === 0 && query && (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>Starte eine Suche, um semantisch ähnliche Erlebnisse zu finden</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
