"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, ThumbsUp, ThumbsDown, Tag, Lightbulb } from "lucide-react"

// Typdefinitionen
type SentimentLabel = "positiv" | "neutral" | "negativ"

interface AIAnalysis {
  id: string
  experience_id: string
  sentiment_score: number
  sentiment_label: SentimentLabel
  keywords: string[]
  categories: string[]
  entities: {
    name: string
    type: string
    confidence: number
  }[]
  created_at: string
  updated_at: string
}

// Mock-Daten für die Anzeige
const mockAnalysis: AIAnalysis = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  experience_id: "550e8400-e29b-41d4-a716-446655440001",
  sentiment_score: 0.78,
  sentiment_label: "positiv",
  keywords: ["Traum", "fliegen", "Wolken", "Freiheit", "Schwerelosigkeit"],
  categories: ["Klartraum", "Flugtraum", "Positiverlebnis"],
  entities: [
    { name: "Himmel", type: "Ort", confidence: 0.92 },
    { name: "Vögel", type: "Lebewesen", confidence: 0.85 },
    { name: "Wolken", type: "Objekt", confidence: 0.94 },
  ],
  created_at: "2023-05-15T10:30:00Z",
  updated_at: "2023-05-15T10:35:00Z",
}

export function KIAnalyse({ experienceId }: { experienceId: string }) {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true)
        // In einer echten Implementierung würden wir hier Supabase verwenden
        // const supabase = getSupabaseClient()
        // const { data, error } = await supabase
        //   .from('ai_analysis')
        //   .select('*')
        //   .eq('experience_id', experienceId)
        //   .single()

        // Für Demo-Zwecke verwenden wir Mock-Daten
        setTimeout(() => {
          setAnalysis(mockAnalysis)
          setLoading(false)
        }, 1000)
      } catch (err) {
        setError("Fehler beim Laden der KI-Analyse")
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [experienceId])

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Fehler
          </CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>KI-Analyse deines Erlebnisses</CardTitle>
        <CardDescription>Automatisch generierte Erkenntnisse zu deinem Erlebnis</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="stimmung">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stimmung">Stimmung</TabsTrigger>
            <TabsTrigger value="schluesselwoerter">Schlüsselwörter</TabsTrigger>
            <TabsTrigger value="kategorien">Kategorien</TabsTrigger>
            <TabsTrigger value="entitaeten">Entitäten</TabsTrigger>
          </TabsList>

          <TabsContent value="stimmung" className="mt-4">
            <div className="flex flex-col items-center space-y-4">
              {analysis?.sentiment_label === "positiv" && <ThumbsUp className="h-16 w-16 text-green-500" />}
              {analysis?.sentiment_label === "neutral" && (
                <div className="h-16 w-16 rounded-full border-4 border-gray-400 flex items-center justify-center">
                  <span className="text-2xl">•</span>
                </div>
              )}
              {analysis?.sentiment_label === "negativ" && <ThumbsDown className="h-16 w-16 text-red-500" />}

              <h3 className="text-xl font-semibold">
                {analysis?.sentiment_label === "positiv" && "Positives Erlebnis"}
                {analysis?.sentiment_label === "neutral" && "Neutrales Erlebnis"}
                {analysis?.sentiment_label === "negativ" && "Negatives Erlebnis"}
              </h3>

              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className={`h-2.5 rounded-full ${
                    analysis?.sentiment_label === "positiv"
                      ? "bg-green-500"
                      : analysis?.sentiment_label === "negativ"
                        ? "bg-red-500"
                        : "bg-gray-400"
                  }`}
                  style={{ width: `${Math.abs(analysis?.sentiment_score || 0) * 100}%` }}
                ></div>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Stimmungswert: {(analysis?.sentiment_score || 0) * 100}%
              </p>
            </div>
          </TabsContent>

          <TabsContent value="schluesselwoerter" className="mt-4">
            <div className="flex flex-wrap gap-2">
              {analysis?.keywords.map((keyword, index) => (
                <Badge key={index} className="px-3 py-1 text-sm">
                  <Tag className="h-3 w-3 mr-1" />
                  {keyword}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Diese Schlüsselwörter wurden automatisch aus deinem Erlebnis extrahiert.
            </p>
          </TabsContent>

          <TabsContent value="kategorien" className="mt-4">
            <div className="flex flex-wrap gap-2">
              {analysis?.categories.map((category, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1 text-sm">
                  {category}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Dein Erlebnis wurde automatisch diesen Kategorien zugeordnet.
            </p>
          </TabsContent>

          <TabsContent value="entitaeten" className="mt-4">
            <div className="space-y-3">
              {analysis?.entities.map((entity, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
                    <span className="font-medium">{entity.name}</span>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {entity.type}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(entity.confidence * 100)}% Konfidenz
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">Diese Entitäten wurden in deinem Erlebnis erkannt.</p>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Letzte Aktualisierung: {new Date(analysis?.updated_at || "").toLocaleString("de-DE")}
      </CardFooter>
    </Card>
  )
}
