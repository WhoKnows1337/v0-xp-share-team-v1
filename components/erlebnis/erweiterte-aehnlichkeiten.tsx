"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TrendingUp, Users } from "lucide-react"
import type { Erlebnis } from "@/types/erlebnis"

interface ErweiterteAehnlichkeitenProps {
  erlebnis: Erlebnis
  aehnlicheErlebnisse: any[]
}

export function ErweiterteAehnlichkeiten({ erlebnis, aehnlicheErlebnisse = [] }: ErweiterteAehnlichkeitenProps) {
  const [showAll, setShowAll] = useState(false)

  // Wenn keine ähnlichen Erlebnisse vorhanden sind, verwenden wir Beispieldaten
  const mockAehnlicheErlebnisse = [
    {
      id: "ae1",
      titel: "Astralreise während tiefer Meditation",
      kurzfassung: "Während einer intensiven Meditationssitzung löste sich mein Bewusstsein vom Körper.",
      bild: "/ethereal-aquatic-dream.png",
      kategorie: { name: "Astralreisen", farbe: "#805AD5" },
      autor: { name: "AstralExplorer" },
      aehnlichkeitsScore: 92,
    },
    {
      id: "ae2",
      titel: "Schweben über meinem Körper nach Yoga",
      kurzfassung: "Nach einer intensiven Yoga-Session hatte ich das Gefühl, meinen Körper zu verlassen.",
      bild: "/deep-sea-fantasy.png",
      kategorie: { name: "Außerkörperlich", farbe: "#10b981" },
      autor: { name: "YogaMeister" },
      aehnlichkeitsScore: 87,
    },
    {
      id: "ae3",
      titel: "Bewusstseinserweiterung durch Atemtechnik",
      kurzfassung: "Eine spezielle Atemtechnik führte zu einem Zustand erweiterter Wahrnehmung.",
      bild: "/celestial-contemplation.png",
      kategorie: { name: "Meditation", farbe: "#10b981" },
      autor: { name: "AtemKünstler" },
      aehnlichkeitsScore: 78,
    },
  ]

  const displayErlebnisse = aehnlicheErlebnisse.length > 0 ? aehnlicheErlebnisse : mockAehnlicheErlebnisse
  const displayCount = showAll ? displayErlebnisse.length : Math.min(3, displayErlebnisse.length)
  const hasMore = displayErlebnisse.length > 3

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-xl font-bold">Ähnliche Erlebnisse</h2>
        </div>
        <Link href={`/erlebnis/${erlebnis.id}/aehnliche`} passHref>
          <Button variant="outline" size="sm" className="flex items-center">
            Alle anzeigen
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {displayErlebnisse.slice(0, displayCount).map((aehnlich, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative h-40">
              <Image
                src={aehnlich.bild || "/diverse-experiences.png"}
                alt={aehnlich.titel}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge
                  className="bg-primary/20"
                  style={{
                    backgroundColor: `rgba(16, 185, 129, ${aehnlich.aehnlichkeitsScore / 100})`,
                  }}
                >
                  {aehnlich.aehnlichkeitsScore}% Übereinstimmung
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium mb-1 line-clamp-1">{aehnlich.titel}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{aehnlich.kurzfassung}</p>
              <div className="flex justify-between items-center">
                <Badge
                  style={{
                    backgroundColor: aehnlich.kategorie?.farbe || "#6366f1",
                  }}
                  className="text-xs"
                >
                  {aehnlich.kategorie?.name || "Kategorie"}
                </Badge>
                <span className="text-xs text-muted-foreground">{aehnlich.autor?.name || "Anonym"}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasMore && !showAll && (
        <div className="flex justify-center">
          <Button variant="ghost" onClick={() => setShowAll(true)}>
            Mehr anzeigen
          </Button>
        </div>
      )}

      <Card className="mt-6 bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Users className="h-5 w-5 mr-2 text-primary" />
            Muster in ähnlichen Erlebnissen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">Die KI hat in ähnlichen Erlebnissen folgende gemeinsame Muster erkannt:</p>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>
              <strong>Auslöser:</strong> Meditation oder tiefe Entspannung scheint ein häufiger Auslöser für
              außerkörperliche Erfahrungen zu sein.
            </li>
            <li>
              <strong>Wahrnehmung:</strong> 78% der ähnlichen Erlebnisse beschreiben ein Gefühl des Schwebens oder der
              Trennung vom physischen Körper.
            </li>
            <li>
              <strong>Emotionen:</strong> Überwiegend positive Gefühle wie Frieden, Freiheit und Verbundenheit werden
              berichtet.
            </li>
            <li>
              <strong>Dauer:</strong> Die meisten Erfahrungen dauern zwischen 5-20 Minuten.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
