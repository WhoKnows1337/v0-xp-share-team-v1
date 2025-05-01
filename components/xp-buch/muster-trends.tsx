"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useXPBuch } from "@/contexts/xp-buch-context"
import { detectRecurringSymbols, calculateWordFrequency } from "@/lib/pattern-detection"
import { Sparkles, Cloud, Hash } from "lucide-react"

export function MusterTrends() {
  const { state } = useXPBuch()
  const { entries } = state
  const [activeTab, setActiveTab] = useState("symbole")

  // Wiederkehrende Symbole erkennen
  const recurringSymbols = detectRecurringSymbols(entries)

  // Wort-Häufigkeit berechnen
  const wordFrequency = calculateWordFrequency(entries)

  // Tag-Häufigkeit
  const tagFrequency = entries.reduce((acc: Record<string, number>, entry) => {
    if (entry.tags) {
      entry.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1
      })
    }
    return acc
  }, {})

  const sortedTags = Object.entries(tagFrequency)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 30)

  // Maximale Anzahl für die Skalierung
  const maxSymbolCount = recurringSymbols.length > 0 ? recurringSymbols[0].count : 0
  const maxWordCount = wordFrequency.length > 0 ? wordFrequency[0].count : 0
  const maxTagCount = sortedTags.length > 0 ? sortedTags[0].count : 0

  // Berechne Schriftgröße basierend auf Häufigkeit
  const calculateFontSize = (count: number, max: number) => {
    const minSize = 0.8
    const maxSize = 2
    return minSize + (count / max) * (maxSize - minSize)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
          Muster & Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="symbole" className="text-sm">
              Symbole
            </TabsTrigger>
            <TabsTrigger value="wortwolke" className="text-sm">
              <Cloud className="h-3 w-3 mr-1" />
              Wortwolke
            </TabsTrigger>
            <TabsTrigger value="tags" className="text-sm">
              <Hash className="h-3 w-3 mr-1" />
              Tags
            </TabsTrigger>
          </TabsList>

          <TabsContent value="symbole">
            {recurringSymbols.length > 0 ? (
              <div className="space-y-3">
                {recurringSymbols.slice(0, 8).map((item) => (
                  <div key={item.symbol}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.symbol}</span>
                      <span className="text-muted-foreground">{item.count}x</span>
                    </div>
                    <Progress value={(item.count / maxSymbolCount) * 100} className="h-2" />
                  </div>
                ))}
                <p className="text-xs text-muted-foreground mt-4">
                  Diese Symbole tauchen wiederholt in deinen Einträgen auf. Sie könnten wichtige Themen oder Muster in
                  deinen Erfahrungen darstellen.
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Noch keine wiederkehrenden Symbole erkannt. Erstelle mehr Einträge, um Muster zu entdecken.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="wortwolke">
            {wordFrequency.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-2 py-4">
                {wordFrequency.slice(0, 40).map((item) => (
                  <span
                    key={item.word}
                    className="inline-block px-1"
                    style={{
                      fontSize: `${calculateFontSize(item.count, maxWordCount)}rem`,
                      opacity: 0.5 + item.count / maxWordCount / 2,
                    }}
                  >
                    {item.word}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Noch nicht genügend Daten für eine Wortwolke. Erstelle mehr Einträge, um Wortmuster zu entdecken.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="tags">
            {sortedTags.length > 0 ? (
              <div className="flex flex-wrap gap-2 py-4">
                {sortedTags.map((item) => (
                  <Badge
                    key={item.tag}
                    variant="secondary"
                    style={{
                      fontSize: `${calculateFontSize(item.count, maxTagCount) * 0.8}rem`,
                      opacity: 0.7 + item.count / maxTagCount / 3,
                    }}
                  >
                    {item.tag} ({item.count})
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Noch keine Tags vorhanden. Füge Tags zu deinen Einträgen hinzu, um Muster zu erkennen.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
