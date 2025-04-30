"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, SlidersHorizontal, TrendingUp, Zap } from "lucide-react"
import { ErlebnisKarte } from "@/components/entdecken/erlebnis-karte"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MusterTrends } from "@/components/erlebnis/muster-trends"

// Simulierte API-Funktion
const fetchAehnlicheErlebnisse = async (id: string) => {
  // In einer echten App würde hier ein API-Aufruf stehen
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    erlebnis: {
      id,
      titel: "Meditation führte zu außerkörperlicher Erfahrung",
      kategorie: { name: "Außerkörperlich", icon: "🧠", farbe: "#10b981" },
    },
    aehnlicheErlebnisse: [
      {
        id: "ae1",
        titel: "Astralreise während tiefer Meditation",
        kurzfassung: "Während einer intensiven Meditationssitzung löste sich mein Bewusstsein vom Körper.",
        kategorie: { name: "Astralreisen", icon: "Star", farbe: "#805AD5" },
        autor: { name: "AstralExplorer" },
        datum: "15. März 2023",
        verknuepfungstyp: "Ähnliche Erfahrung (92% Übereinstimmung)",
        aehnlichkeitsScore: 92,
        tags: ["Meditation", "Astralreise", "Bewusstseinserweiterung"],
      },
      {
        id: "ae2",
        titel: "Schweben über meinem Körper nach Yoga",
        kurzfassung: "Nach einer intensiven Yoga-Session hatte ich das Gefühl, meinen Körper zu verlassen.",
        kategorie: { name: "Außerkörperlich", icon: "🧠", farbe: "#10b981" },
        autor: { name: "YogaMeister" },
        datum: "22. April 2023",
        verknuepfungstyp: "Ähnliche Erfahrung (87% Übereinstimmung)",
        aehnlichkeitsScore: 87,
        tags: ["Yoga", "Außerkörperlich", "Schweben"],
      },
      {
        id: "ae3",
        titel: "Bewusstseinserweiterung durch Atemtechnik",
        kurzfassung: "Eine spezielle Atemtechnik führte zu einem Zustand erweiterter Wahrnehmung.",
        kategorie: { name: "Meditation", icon: "🧘", farbe: "#10b981" },
        autor: { name: "AtemKünstler" },
        datum: "10. Mai 2023",
        verknuepfungstyp: "Ähnliche Technik (78% Übereinstimmung)",
        aehnlichkeitsScore: 78,
        tags: ["Atemtechnik", "Bewusstsein", "Wahrnehmung"],
      },
      {
        id: "ae4",
        titel: "Traumreise mit außerkörperlichen Elementen",
        kurzfassung: "In einem luziden Traum erlebte ich Elemente einer außerkörperlichen Erfahrung.",
        kategorie: { name: "Traum", icon: "💤", farbe: "#8b5cf6" },
        autor: { name: "Traumreisende" },
        datum: "3. Juni 2023",
        verknuepfungstyp: "Ähnliches Phänomen (75% Übereinstimmung)",
        aehnlichkeitsScore: 75,
        tags: ["Luzider Traum", "Außerkörperlich", "Traumreise"],
      },
      {
        id: "ae5",
        titel: "Meditation und Zeitverzerrung",
        kurzfassung: "Während einer Meditation verlor ich jegliches Zeitgefühl und erlebte eine Art Schweben.",
        kategorie: { name: "Meditation", icon: "🧘", farbe: "#10b981" },
        autor: { name: "ZeitWanderer" },
        datum: "18. Juli 2023",
        verknuepfungstyp: "Ähnliches Phänomen (72% Übereinstimmung)",
        aehnlichkeitsScore: 72,
        tags: ["Meditation", "Zeitverzerrung", "Schweben"],
      },
      {
        id: "ae6",
        titel: "Energetische Heilung mit Bewusstseinsveränderung",
        kurzfassung: "Während einer energetischen Heilungssitzung erlebte ich eine Trennung vom Körper.",
        kategorie: { name: "Energiearbeit", icon: "Zap", farbe: "#D53F8C" },
        autor: { name: "EnergieHeiler" },
        datum: "5. August 2023",
        verknuepfungstyp: "Ähnliches Ergebnis (68% Übereinstimmung)",
        aehnlichkeitsScore: 68,
        tags: ["Energiearbeit", "Heilung", "Bewusstsein"],
      },
    ],
    cluster: {
      name: "Außerkörperliche Erfahrungen während Meditation",
      beschreibung:
        "Eine Sammlung von Berichten über außerkörperliche Erfahrungen, die während oder nach Meditationspraktiken auftreten.",
      anzahl: 42,
      durchschnittlicheUebereinstimmung: 82,
      haeufigeTags: ["Meditation", "Außerkörperlich", "Schweben", "Bewusstsein", "Astralreise"],
    },
  }
}

export default function AehnlicheErlebnissePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filterOption, setFilterOption] = useState("relevanz")

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const result = await fetchAehnlicheErlebnisse(params.id)
        setData(result)
      } catch (error) {
        console.error("Fehler beim Laden ähnlicher Erlebnisse:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [params.id])

  const handleGoBack = () => {
    router.back()
  }

  const sortedErlebnisse = data?.aehnlicheErlebnisse?.slice() || []

  if (filterOption === "relevanz") {
    sortedErlebnisse.sort((a: any, b: any) => b.aehnlichkeitsScore - a.aehnlichkeitsScore)
  } else if (filterOption === "datum") {
    sortedErlebnisse.sort((a: any, b: any) => new Date(b.datum).getTime() - new Date(a.datum).getTime())
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4 sm:px-6">
      <Button variant="ghost" className="mb-4 pl-0" onClick={handleGoBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Zurück zum Erlebnis
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Ähnliche Erlebnisse</h1>
        {data?.erlebnis && (
          <p className="text-muted-foreground">Erlebnisse mit Ähnlichkeit zu "{data.erlebnis.titel}"</p>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {data?.cluster && (
            <Card className="mb-6 bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-primary" />
                  Cluster: {data.cluster.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{data.cluster.beschreibung}</p>
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge variant="outline" className="bg-primary/10">
                    {data.cluster.anzahl} Erlebnisse
                  </Badge>
                  <Badge variant="outline" className="bg-primary/10">
                    Ø {data.cluster.durchschnittlicheUebereinstimmung}% Übereinstimmung
                  </Badge>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex flex-wrap gap-1">
                    {data.cluster.haeufigeTags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {sortedErlebnisse.length} ähnliche Erlebnisse gefunden
              </span>
            </div>
            <div className="flex items-center">
              <SlidersHorizontal className="h-4 w-4 mr-2 text-muted-foreground" />
              <select
                className="text-sm bg-transparent border-none focus:outline-none focus:ring-0"
                value={filterOption}
                onChange={(e) => setFilterOption(e.target.value)}
              >
                <option value="relevanz">Nach Relevanz</option>
                <option value="datum">Nach Datum</option>
              </select>
            </div>
          </div>

          <Tabs defaultValue="liste" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="liste">Liste</TabsTrigger>
              <TabsTrigger value="muster">Muster & Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="liste" className="space-y-4">
              {sortedErlebnisse.map((erlebnis: any, index: number) => (
                <div key={index} className="relative">
                  <ErlebnisKarte erlebnis={erlebnis} />
                  {erlebnis.verknuepfungstyp && (
                    <Badge
                      className="absolute top-3 right-3 bg-primary/20 text-xs"
                      style={{
                        backgroundColor: `rgba(16, 185, 129, ${erlebnis.aehnlichkeitsScore / 100})`,
                      }}
                    >
                      {erlebnis.verknuepfungstyp}
                    </Badge>
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="muster">
              <MusterTrends erlebnisId={params.id} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
