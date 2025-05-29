"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, Brain, Sparkles, BarChart3, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { useXPBuch } from "@/contexts/xp-buch-context"
import { useToast } from "@/hooks/use-toast"

export function PatternAnalysisDemo() {
  const { state } = useXPBuch()
  const { entries } = state
  const [analysis, setAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { toast } = useToast()

  const handleAnalyze = async () => {
    if (entries.length < 5) {
      toast({
        title: "Nicht genügend Daten",
        description: "Mindestens 5 Einträge werden für eine Musteranalyse benötigt",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    try {
      // Simuliere AI-Analyse
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock-Analyse für Demo
      const mockAnalysis = {
        patterns: [
          {
            type: "Thematisch",
            description: "Wiederkehrende Reflexionen über persönliches Wachstum",
            confidence: 0.85,
            examples: ["Selbstreflexion", "Entwicklung", "Lernen"],
          },
          {
            type: "Emotional",
            description: "Positive Grundstimmung mit gelegentlichen nachdenklichen Phasen",
            confidence: 0.78,
            examples: ["Dankbarkeit", "Zufriedenheit", "Nachdenklichkeit"],
          },
          {
            type: "Zeitlich",
            description: "Erhöhte Aktivität am Wochenende",
            confidence: 0.92,
            examples: ["Samstag: 40% der Einträge", "Sonntag: 35% der Einträge"],
          },
        ],
        insights: [
          "Du reflektierst besonders intensiv über persönliche Entwicklung",
          "Deine Einträge zeigen eine kontinuierliche positive Entwicklung",
          "Am Wochenende nimmst du dir mehr Zeit für Selbstreflexion",
        ],
        recommendations: [
          "Nutze die Wochenend-Routine für tiefere Reflexionen",
          "Erkunde die Verbindung zwischen deinen Lernmomenten",
          "Teile deine Wachstumserfahrungen mit der Community",
        ],
      }

      setAnalysis(mockAnalysis)

      toast({
        title: "Analyse abgeschlossen",
        description: "Muster und Insights wurden erfolgreich identifiziert",
      })
    } catch (error) {
      toast({
        title: "Fehler bei der Analyse",
        description: "Bitte versuche es später erneut",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          KI-Musteranalyse
        </CardTitle>
        <CardDescription>Entdecke verborgene Muster und Trends in deinen Einträgen</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!analysis ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
            <p className="text-muted-foreground mb-4">Analysiere deine {entries.length} Einträge mit KI</p>
            <Button onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analysiere Muster...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyse starten
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Gefundene Muster */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Identifizierte Muster
              </h3>
              <div className="space-y-3">
                {analysis.patterns.map((pattern: any, index: number) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{pattern.type}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(pattern.confidence * 100)}% Konfidenz
                          </span>
                        </div>
                        <p className="text-sm">{pattern.description}</p>
                        <div className="flex gap-2">
                          {pattern.examples.map((example: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {example}
                            </Badge>
                          ))}
                        </div>
                        <Progress value={pattern.confidence * 100} className="h-1" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Einblicke
              </h3>
              <div className="space-y-2">
                {analysis.insights.map((insight: string, index: number) => (
                  <Alert key={index}>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>{insight}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>

            {/* Empfehlungen */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Empfehlungen
              </h3>
              <div className="space-y-2">
                {analysis.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                    <p className="text-sm text-muted-foreground">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={() => setAnalysis(null)}>
              Neue Analyse starten
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
