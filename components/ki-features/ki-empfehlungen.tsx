"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Sparkles, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Typdefinitionen
interface Experience {
  id: string
  title: string
  summary: string
  category: string
  created_at: string
}

interface AIRecommendation {
  id: string
  user_id: string
  recommended_experience_id: string
  recommendation_type: string
  score: number
  created_at: string
  experience: Experience
}

// Mock-Daten für die Anzeige
const mockRecommendations: AIRecommendation[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440010",
    user_id: "550e8400-e29b-41d4-a716-446655440020",
    recommended_experience_id: "550e8400-e29b-41d4-a716-446655440030",
    recommendation_type: "content_based",
    score: 0.92,
    created_at: "2023-05-16T14:30:00Z",
    experience: {
      id: "550e8400-e29b-41d4-a716-446655440030",
      title: "Flug über den Ozean",
      summary: "In diesem Traum flog ich über einen endlosen Ozean, das Wasser glitzerte im Sonnenlicht.",
      category: "Flugtraum",
      created_at: "2023-05-10T08:15:00Z",
    },
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440011",
    user_id: "550e8400-e29b-41d4-a716-446655440020",
    recommended_experience_id: "550e8400-e29b-41d4-a716-446655440031",
    recommendation_type: "collaborative",
    score: 0.87,
    created_at: "2023-05-16T14:30:00Z",
    experience: {
      id: "550e8400-e29b-41d4-a716-446655440031",
      title: "Schweben zwischen Wolkenkratzern",
      summary: "Ich schwebte zwischen riesigen Wolkenkratzern in einer futuristischen Stadt.",
      category: "Klartraum",
      created_at: "2023-05-12T10:45:00Z",
    },
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440012",
    user_id: "550e8400-e29b-41d4-a716-446655440020",
    recommended_experience_id: "550e8400-e29b-41d4-a716-446655440032",
    recommendation_type: "content_based",
    score: 0.81,
    created_at: "2023-05-16T14:30:00Z",
    experience: {
      id: "550e8400-e29b-41d4-a716-446655440032",
      title: "Begegnung mit einem Adler",
      summary: "Ein majestätischer Adler begleitete mich auf meinem Flug durch die Berge.",
      category: "Tiertraum",
      created_at: "2023-05-14T16:20:00Z",
    },
  },
]

export function KIEmpfehlungen({ userId }: { userId: string }) {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true)
        // In einer echten Implementierung würden wir hier Supabase verwenden
        // const supabase = getSupabaseClient()
        // const { data, error } = await supabase
        //   .from('ai_recommendations')
        //   .select('*, experience:recommended_experience_id(*)')
        //   .eq('user_id', userId)
        //   .order('score', { ascending: false })

        // Für Demo-Zwecke verwenden wir Mock-Daten
        setTimeout(() => {
          setRecommendations(mockRecommendations)
          setLoading(false)
        }, 1000)
      } catch (err) {
        setError("Fehler beim Laden der Empfehlungen")
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [userId])

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
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Für dich empfohlen
        </CardTitle>
        <CardDescription>Basierend auf deinen bisherigen Erlebnissen und Interaktionen</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              Noch keine Empfehlungen verfügbar. Teile mehr Erlebnisse, um personalisierte Empfehlungen zu erhalten.
            </p>
          ) : (
            recommendations.map((recommendation) => (
              <Card key={recommendation.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="p-4 flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{recommendation.experience.title}</h3>
                      <Badge type={recommendation.recommendation_type} score={recommendation.score} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {recommendation.experience.summary}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-muted-foreground">
                        Kategorie: {recommendation.experience.category}
                      </span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/erlebnisse/${recommendation.experience.id}`}>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Ansehen
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Hilfsfunktion für die Anzeige des Empfehlungstyps und Scores
function Badge({ type, score }: { type: string; score: number }) {
  let label = ""
  let bgColor = ""

  if (type === "content_based") {
    label = "Ähnlicher Inhalt"
    bgColor = "bg-blue-100 text-blue-800"
  } else if (type === "collaborative") {
    label = "Andere mögen dies"
    bgColor = "bg-purple-100 text-purple-800"
  } else {
    label = "Empfohlen"
    bgColor = "bg-green-100 text-green-800"
  }

  return (
    <div className={`text-xs px-2 py-1 rounded-full flex items-center ${bgColor}`}>
      {label} • {Math.round(score * 100)}%
    </div>
  )
}
