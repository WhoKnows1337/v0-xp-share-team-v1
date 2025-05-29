"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SemanticSearchDemo } from "@/components/ai/semantic-search-demo"
import { PatternAnalysisDemo } from "@/components/ai/pattern-analysis-demo"
import { Brain, Search, BarChart3, Sparkles } from "lucide-react"

export default function AIDemoPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Brain className="h-8 w-8 text-purple-500" />
          KI-Features Demo
        </h1>
        <p className="text-muted-foreground">
          Erlebe die Kraft von AI in XP-Share - Semantische Suche, Mustererkennung und intelligente Analysen
        </p>
      </div>

      <Tabs defaultValue="search" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Semantische Suche
          </TabsTrigger>
          <TabsTrigger value="patterns" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Musteranalyse
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <SemanticSearchDemo />

          <div className="bg-muted/50 rounded-lg p-4 border">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              So funktioniert's
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Texte werden in hochdimensionale Vektoren umgewandelt (Embeddings)</li>
              <li>• Ähnlichkeit wird durch Kosinus-Distanz berechnet</li>
              <li>• Findet semantisch ähnliche Inhalte, auch ohne exakte Wortübereinstimmung</li>
              <li>• Perfekt für die Entdeckung verwandter Erlebnisse</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <PatternAnalysisDemo />

          <div className="bg-muted/50 rounded-lg p-4 border">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              Mustererkennungs-Features
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Erkennt wiederkehrende Themen und Emotionen</li>
              <li>• Identifiziert zeitliche Muster (Tageszeiten, Wochentage)</li>
              <li>• Analysiert Zusammenhänge zwischen Tags und Stimmungen</li>
              <li>• Generiert personalisierte Insights und Empfehlungen</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
