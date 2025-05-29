"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, TrendingUp, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

interface AIInsight {
  type: "trend" | "pattern" | "recommendation" | "achievement"
  title: string
  description: string
  confidence: number
  icon: React.ReactNode
}

export function AIInsightsWidget() {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [hasXPBuch, setHasXPBuch] = useState(false)

  useEffect(() => {
    // Prüfe ob XPBuch-Context verfügbar ist
    try {
      // Versuche den Context zu verwenden, aber fange Fehler ab
      const checkContext = () => {
        if (typeof window !== "undefined" && window.localStorage.getItem("xp-entries")) {
          setHasXPBuch(true)
        }
      }
      checkContext()
    } catch (error) {
      console.log("XPBuch Context nicht verfügbar")
    }

    // Simuliere AI-Insights
    const timer = setTimeout(() => {
      setInsights([
        {
          type: "trend",
          title: "Positive Entwicklung",
          description: "Deine Stimmung hat sich in den letzten 7 Tagen verbessert",
          confidence: 0.85,
          icon: <TrendingUp className="h-4 w-4" />,
        },
        {
          type: "pattern",
          title: "Aktivitätsmuster erkannt",
          description: "Du bist besonders kreativ am Nachmittag",
          confidence: 0.72,
          icon: <Brain className="h-4 w-4" />,
        },
        {
          type: "recommendation",
          title: "Empfehlung",
          description: "Versuche mehr Zeit in der Natur zu verbringen",
          confidence: 0.68,
          icon: <Sparkles className="h-4 w-4" />,
        },
      ])
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            KI-Einblicke
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          KI-Einblicke
        </CardTitle>
        <CardDescription>Personalisierte Erkenntnisse basierend auf deinen Erlebnissen</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex-shrink-0 mt-0.5">{insight.icon}</div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm">{insight.title}</p>
                <Badge variant="secondary" className="text-xs">
                  {Math.round(insight.confidence * 100)}% Konfidenz
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
