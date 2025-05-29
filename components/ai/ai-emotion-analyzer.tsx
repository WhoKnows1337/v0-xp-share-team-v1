"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Smile, Meh, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

interface EmotionAnalysis {
  emotion: string
  score: number
  icon: React.ReactNode
  color: string
}

interface AIEmotionAnalyzerProps {
  text?: string
  onAnalysisComplete?: (analysis: EmotionAnalysis[]) => void
}

export function AIEmotionAnalyzer({ text, onAnalysisComplete }: AIEmotionAnalyzerProps) {
  const [analysis, setAnalysis] = useState<EmotionAnalysis[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!text) return

    setLoading(true)
    // Simuliere Emotionsanalyse
    const timer = setTimeout(() => {
      const emotions: EmotionAnalysis[] = [
        {
          emotion: "Freude",
          score: 0.75,
          icon: <Smile className="h-4 w-4" />,
          color: "text-green-500",
        },
        {
          emotion: "Aufregung",
          score: 0.6,
          icon: <Zap className="h-4 w-4" />,
          color: "text-yellow-500",
        },
        {
          emotion: "Ruhe",
          score: 0.45,
          icon: <Heart className="h-4 w-4" />,
          color: "text-blue-500",
        },
        {
          emotion: "Nachdenklichkeit",
          score: 0.3,
          icon: <Meh className="h-4 w-4" />,
          color: "text-purple-500",
        },
      ]
      setAnalysis(emotions)
      setLoading(false)
      onAnalysisComplete?.(emotions)
    }, 1500)

    return () => clearTimeout(timer)
  }, [text, onAnalysisComplete])

  if (!text) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Emotionsanalyse
          </CardTitle>
          <CardDescription>Erstelle einen Eintrag, um die emotionale Analyse zu sehen</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Emotionsanalyse
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Emotionsanalyse
        </CardTitle>
        <CardDescription>KI-basierte Analyse der emotionalen Inhalte</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {analysis.map((emotion, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={emotion.color}>{emotion.icon}</span>
                <span className="text-sm font-medium">{emotion.emotion}</span>
              </div>
              <span className="text-sm text-muted-foreground">{Math.round(emotion.score * 100)}%</span>
            </div>
            <Progress value={emotion.score * 100} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
