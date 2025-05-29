"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Zap, CheckCircle, AlertCircle } from "lucide-react"

export function AIFeaturesOverview() {
  const [activeTab, setActiveTab] = useState("implemented")

  const implementedFeatures = [
    {
      name: "Basis Mustererkennung",
      description: "Erkennt wiederkehrende Symbole und Themen",
      file: "lib/pattern-detection.ts",
      status: "✅ Implementiert",
      progress: 100,
    },
    {
      name: "Ähnlichkeitsberechnung",
      description: "Jaccard-Ähnlichkeit für Tags, Moods, Content",
      file: "lib/similarity-utils.ts",
      status: "✅ Implementiert",
      progress: 100,
    },
    {
      name: "Text-Zusammenfassung",
      description: "Einfache regelbasierte Zusammenfassungen",
      file: "lib/summarize-utils.ts",
      status: "✅ Implementiert",
      progress: 100,
    },
    {
      name: "Wort-Häufigkeitsanalyse",
      description: "Tag-Clouds und Wortmuster",
      file: "components/xp-buch/muster-trends.tsx",
      status: "✅ Implementiert",
      progress: 100,
    },
  ]

  const missingFeatures = [
    {
      name: "Text-Embeddings",
      description: "Vektorisierung von Einträgen für semantische Suche",
      implementation: "OpenAI Embeddings API",
      priority: "🔥 Kritisch",
      effort: "Hoch",
    },
    {
      name: "Semantic Search",
      description: "Suche basierend auf Bedeutung, nicht nur Keywords",
      implementation: "Vector Database (Supabase pgvector)",
      priority: "🔥 Kritisch",
      effort: "Hoch",
    },
    {
      name: "AI-Zusammenfassungen",
      description: "LLM-basierte intelligente Zusammenfassungen",
      implementation: "AI SDK + OpenAI/Anthropic",
      priority: "⚡ Hoch",
      effort: "Mittel",
    },
    {
      name: "Emotionsanalyse",
      description: "Automatische Mood-Erkennung aus Text",
      implementation: "Sentiment Analysis API",
      priority: "⚡ Hoch",
      effort: "Mittel",
    },
    {
      name: "Themen-Clustering",
      description: "Automatische Kategorisierung von Einträgen",
      implementation: "K-Means + Embeddings",
      priority: "💡 Mittel",
      effort: "Hoch",
    },
    {
      name: "Personalisierte Insights",
      description: "AI-generierte persönliche Erkenntnisse",
      implementation: "LLM + Prompt Engineering",
      priority: "💡 Mittel",
      effort: "Mittel",
    },
    {
      name: "Anomalie-Erkennung",
      description: "Ungewöhnliche Muster in Einträgen erkennen",
      implementation: "Statistical Analysis + ML",
      priority: "🔮 Niedrig",
      effort: "Hoch",
    },
    {
      name: "Predictive Analytics",
      description: "Vorhersage von Mood-Trends und Mustern",
      implementation: "Time Series Analysis + ML",
      priority: "🔮 Niedrig",
      effort: "Sehr Hoch",
    },
  ]

  const canImplementNow = [
    {
      name: "AI SDK Integration",
      description: "Grundlage für alle AI-Features",
      code: "npm install ai @ai-sdk/openai",
      status: "Sofort möglich",
    },
    {
      name: "OpenAI Embeddings",
      description: "Text-Vektorisierung für semantische Suche",
      code: "generateEmbedding(text)",
      status: "Sofort möglich",
    },
    {
      name: "Supabase pgvector",
      description: "Vector Database für Similarity Search",
      code: "CREATE EXTENSION vector",
      status: "Sofort möglich",
    },
    {
      name: "LLM-Zusammenfassungen",
      description: "Intelligente Text-Analyse",
      code: "generateText({ model, prompt })",
      status: "Sofort möglich",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🧠 AI & ML Features Status</h1>
        <p className="text-muted-foreground">Übersicht über implementierte und fehlende KI-Features</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="implemented">
            <CheckCircle className="h-4 w-4 mr-2" />
            Implementiert
          </TabsTrigger>
          <TabsTrigger value="missing">
            <AlertCircle className="h-4 w-4 mr-2" />
            Fehlt noch
          </TabsTrigger>
          <TabsTrigger value="possible">
            <Zap className="h-4 w-4 mr-2" />
            Jetzt möglich
          </TabsTrigger>
        </TabsList>

        <TabsContent value="implemented" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Bereits implementierte AI-Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {implementedFeatures.map((feature, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{feature.name}</h3>
                    <Badge variant="outline" className="text-green-600">
                      {feature.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                  <div className="flex justify-between items-center">
                    <code className="text-xs bg-muted px-2 py-1 rounded">{feature.file}</code>
                    <Progress value={feature.progress} className="w-20 h-2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="missing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
                Fehlende AI-Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {missingFeatures.map((feature, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{feature.name}</h3>
                    <div className="flex gap-2">
                      <Badge variant="outline">{feature.priority}</Badge>
                      <Badge variant="secondary">{feature.effort}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                  <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">💡 {feature.implementation}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="possible" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-blue-500" />
                Sofort implementierbar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {canImplementNow.map((feature, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{feature.name}</h3>
                    <Badge className="bg-green-100 text-green-800">{feature.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block">{feature.code}</code>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-600" />
            AI-Roadmap Empfehlung
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-800">Phase 1</Badge>
              <span className="text-sm">AI SDK + OpenAI Embeddings + Supabase pgvector</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-100 text-orange-800">Phase 2</Badge>
              <span className="text-sm">Semantic Search + AI-Zusammenfassungen</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">Phase 3</Badge>
              <span className="text-sm">Emotionsanalyse + Themen-Clustering</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-100 text-purple-800">Phase 4</Badge>
              <span className="text-sm">Predictive Analytics + Anomalie-Erkennung</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
