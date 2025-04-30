"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Lightbulb, Users, Sparkles } from "lucide-react"

interface MusterTrendsProps {
  erlebnisId: string
}

export function MusterTrends({ erlebnisId }: MusterTrendsProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Mock-Daten für Muster und Trends
  const musterData = {
    haeufigeMuster: [
      {
        name: "Meditation als Auslöser",
        beschreibung: "Tiefe Meditation geht häufig außerkörperlichen Erfahrungen voraus",
        haeufigkeit: 78,
      },
      {
        name: "Gefühl des Schwebens",
        beschreibung: "Das Gefühl, über dem eigenen Körper zu schweben, ist ein wiederkehrendes Element",
        haeufigkeit: 65,
      },
      {
        name: "Zeitverzerrung",
        beschreibung: "Verändertes Zeitempfinden während der Erfahrung",
        haeufigkeit: 52,
      },
    ],
    erkenntnisse: [
      "Außerkörperliche Erfahrungen treten häufiger bei regelmäßig Meditierenden auf",
      "Die Erfahrungen werden überwiegend als positiv und bereichernd beschrieben",
      "Viele Berichte erwähnen eine veränderte Wahrnehmung von Raum und Zeit",
    ],
    aehnlicheCluster: [
      {
        name: "Luzide Träume",
        aehnlichkeit: 72,
        anzahlErlebnisse: 156,
      },
      {
        name: "Tiefenmeditation",
        aehnlichkeit: 68,
        anzahlErlebnisse: 89,
      },
      {
        name: "Spirituelle Erfahrungen",
        aehnlichkeit: 61,
        anzahlErlebnisse: 124,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-2">
        <TrendingUp className="h-5 w-5 mr-2 text-primary" />
        <h2 className="text-xl font-bold">Muster & Trends</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
              Häufige Muster
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {musterData.haeufigeMuster.map((muster, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{muster.name}</span>
                    <Badge variant="outline">{muster.haeufigkeit}%</Badge>
                  </div>
                  <Progress value={muster.haeufigkeit} className="h-2 mb-1" />
                  <p className="text-xs text-muted-foreground">{muster.beschreibung}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
              Erkenntnisse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc pl-5">
              {musterData.erkenntnisse.map((erkenntnis, index) => (
                <li key={index} className="text-sm">
                  {erkenntnis}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-500" />
            Ähnliche Erfahrungscluster
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {musterData.aehnlicheCluster.map((cluster, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{cluster.name}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20">
                      {cluster.anzahlErlebnisse} Erlebnisse
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20">
                      {cluster.aehnlichkeit}% Ähnlichkeit
                    </Badge>
                  </div>
                </div>
                <Progress value={cluster.aehnlichkeit} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
