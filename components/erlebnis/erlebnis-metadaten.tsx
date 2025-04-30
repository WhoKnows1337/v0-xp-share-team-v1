"use client"

import { Brain, Calendar, Clock, MapPin, User, Tag, Lightbulb, Activity, Users, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Erlebnis } from "@/types/erlebnis"

interface ErlebnisMetadatenProps {
  erlebnis: Erlebnis
}

export function ErlebnisMetadaten({ erlebnis }: ErlebnisMetadatenProps) {
  // Emotionale Signatur - Mock-Daten für die Visualisierung
  const emotionaleSignatur = [
    { name: "Ruhe", wert: 85 },
    { name: "Ehrfurcht", wert: 72 },
    { name: "Neugier", wert: 65 },
    { name: "Freude", wert: 58 },
  ]

  // Bewusstseinszustand - Mock-Daten
  const bewusstseinszustand = {
    zustand: "Erweitert",
    beschreibung: "Jenseits des normalen Wachbewusstseins, mit erhöhter Wahrnehmung und reduzierter Ich-Grenze",
    transformationspotenzial: "Hoch",
  }

  // Muster-Erkennung - Mock-Daten
  const musterErkennung = [
    { name: "Meditation als Auslöser", haeufigkeit: 78 },
    { name: "Gefühl des Schwebens", haeufigkeit: 65 },
    { name: "Zeitlosigkeit", haeufigkeit: 52 },
  ]

  // Ähnlichkeitscluster - Mock-Daten
  const aehnlichkeitscluster = {
    name: "Außerkörperliche Erfahrungen während Meditation",
    anzahlErlebnisse: 124,
    kollektiveResonanz: "Stark",
  }

  // Hauptthemen - Mock-Daten
  const hauptthemen = ["Bewusstseinserweiterung", "Spirituelle Verbindung", "Selbsttransformation"]

  // Empfehlungen - Mock-Daten
  const empfehlungen = [
    "Geführte Meditationen zur Vertiefung der Erfahrung",
    "Journaling zur Integration der Erkenntnisse",
    "Austausch mit ähnlich Erfahrenen",
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Brain className="h-5 w-5 mr-2 text-primary" />
          KI-Analyse
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Grundlegende Metadaten */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Grundlegende Informationen</h3>
          <div className="grid grid-cols-1 gap-2">
            {erlebnis.autor && (
              <div className="flex items-center text-sm">
                <User className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <span>
                  {typeof erlebnis.autor === "string"
                    ? erlebnis.autor
                    : erlebnis.autor.name || erlebnis.autor.username || "Anonym"}
                </span>
              </div>
            )}

            {erlebnis.datum && (
              <div className="flex items-center text-sm">
                <Calendar className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <span>
                  {erlebnis.datum instanceof Date
                    ? erlebnis.datum.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })
                    : erlebnis.datum}
                </span>
              </div>
            )}

            {erlebnis.ort && (
              <div className="flex items-center text-sm">
                <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <span>{typeof erlebnis.ort === "string" ? erlebnis.ort : erlebnis.ort.name}</span>
              </div>
            )}

            {erlebnis.dauer && (
              <div className="flex items-center text-sm">
                <Clock className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <span>{erlebnis.dauer} Minuten</span>
              </div>
            )}

            {erlebnis.tags && erlebnis.tags.length > 0 && (
              <div className="flex items-start text-sm">
                <Tag className="h-3.5 w-3.5 mr-2 mt-0.5 text-muted-foreground" />
                <div className="flex flex-wrap gap-1">
                  {erlebnis.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Emotionale Signatur */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium flex items-center">
            <Activity className="h-3.5 w-3.5 mr-2 text-primary" />
            Emotionale Signatur
          </h3>
          <div className="space-y-2">
            {emotionaleSignatur.map((emotion, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs">{emotion.name}</span>
                  <span className="text-xs text-muted-foreground">{emotion.wert}%</span>
                </div>
                <Progress value={emotion.wert} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>

        {/* Bewusstseinszustand */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium flex items-center">
            <Lightbulb className="h-3.5 w-3.5 mr-2 text-primary" />
            Bewusstseinszustand
          </h3>
          <div className="bg-primary/5 rounded-md p-3 text-sm">
            <div className="flex justify-between mb-1">
              <span className="font-medium">{bewusstseinszustand.zustand}</span>
              <Badge variant="outline" className="text-xs">
                Transformationspotenzial: {bewusstseinszustand.transformationspotenzial}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{bewusstseinszustand.beschreibung}</p>
          </div>
        </div>

        {/* Muster-Erkennung */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium flex items-center">
            <Sparkles className="h-3.5 w-3.5 mr-2 text-primary" />
            Erkannte Muster
          </h3>
          <div className="space-y-2">
            {musterErkennung.map((muster, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs">{muster.name}</span>
                  <span className="text-xs text-muted-foreground">{muster.haeufigkeit}% Übereinstimmung</span>
                </div>
                <Progress value={muster.haeufigkeit} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>

        {/* Ähnlichkeitscluster */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium flex items-center">
            <Users className="h-3.5 w-3.5 mr-2 text-primary" />
            Ähnlichkeitscluster
          </h3>
          <div className="bg-primary/5 rounded-md p-3 text-sm">
            <div className="flex justify-between mb-1">
              <span className="font-medium">{aehnlichkeitscluster.name}</span>
              <Badge variant="outline" className="text-xs">
                {aehnlichkeitscluster.anzahlErlebnisse} Erlebnisse
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Kollektive Resonanz: <span className="font-medium">{aehnlichkeitscluster.kollektiveResonanz}</span>
            </p>
          </div>
        </div>

        {/* Hauptthemen */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Hauptthemen</h3>
          <div className="flex flex-wrap gap-1.5">
            {hauptthemen.map((thema, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {thema}
              </Badge>
            ))}
          </div>
        </div>

        {/* Empfehlungen */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Empfehlungen</h3>
          <ul className="text-xs space-y-1 list-disc pl-4 text-muted-foreground">
            {empfehlungen.map((empfehlung, index) => (
              <li key={index}>{empfehlung}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
