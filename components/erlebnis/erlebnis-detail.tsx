"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  User,
  ArrowLeft,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  MoreVertical,
  Flag,
  Search,
  HelpCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Kommentare } from "./kommentare"
import { KIZusammenfassung } from "./ki-zusammenfassung"
import type { Erlebnis } from "@/types/erlebnis"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ErweiterteAehnlichkeiten } from "./erweiterte-aehnlichkeiten"
import { ErlebnisVerknuepfung } from "./erlebnis-verknuepfung"
import { useXPAssistant } from "@/components/xp-assistant-provider"
import { KIAnalyse } from "./ki-analyse"
import { MusterTrends } from "./muster-trends"

interface ErlebnisDetailProps {
  id: string
  erlebnis: Erlebnis
}

export function ErlebnisDetail({ id, erlebnis }: ErlebnisDetailProps) {
  const router = useRouter()
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [likesCount, setLikesCount] = useState(erlebnis.bewertungen || 42)
  const [showSimilarModal, setShowSimilarModal] = useState(false)
  const { openAssistant } = useXPAssistant()

  // Stelle sicher, dass erlebnis vorhanden ist
  if (!erlebnis) {
    return (
      <div className="py-6 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Erlebnis wird geladen...</h1>
        <p>Bitte warten Sie, während das Erlebnis geladen wird.</p>
      </div>
    )
  }

  const handleGoBack = () => {
    router.back()
  }

  const handleLike = () => {
    setLiked(!liked)
    setLikesCount(liked ? likesCount - 1 : likesCount + 1)
  }

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
  }

  const handleOpenAssistant = () => {
    openAssistant(`Erlebnis: ${erlebnis.titel}`)
  }

  // Sicherstellen, dass erlebnis.medien existiert und ein Array ist
  const medien = Array.isArray(erlebnis.medien) ? erlebnis.medien : []
  const mainImage = medien.length > 0 ? medien[0].url : "/diverse-experiences.png"

  // Extrahiere den Kategorienamen aus dem Kategorieobjekt
  const getKategorieName = () => {
    if (!erlebnis.kategorie) return "Unbekannt"
    if (typeof erlebnis.kategorie === "string") return erlebnis.kategorie
    if (typeof erlebnis.kategorie === "object" && erlebnis.kategorie.name) return erlebnis.kategorie.name
    return "Unbekannt"
  }

  // Formatiere das Datum, falls vorhanden
  const formatDatum = (datum: any) => {
    if (!datum) return "Unbekannt"
    if (datum instanceof Date) return datum.toLocaleDateString("de-DE")
    if (typeof datum === "string") return datum
    return "Unbekannt"
  }

  return (
    <div className="py-6 px-0">
      <Button variant="ghost" className="mb-4 pl-0" onClick={handleGoBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Zurück
      </Button>

      {/* Hero-Bereich mit Titelbild */}
      <div className="relative w-full h-[400px] mb-6 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
        <Image
          src={mainImage || "/placeholder.svg"}
          alt={erlebnis.titel}
          fill
          className="object-cover"
          onError={(e) => {
            // Fallback für fehlerhafte Bilder
            ;(e.target as HTMLImageElement).src = "/diverse-experiences.png"
          }}
        />
        <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
          <h1 className="text-3xl font-bold text-white mb-2">{erlebnis.titel}</h1>
          <div className="flex items-center text-white/80">
            <User className="h-4 w-4 mr-2" />
            <span>
              {typeof erlebnis.autor === "string"
                ? erlebnis.autor
                : erlebnis.autor?.name || erlebnis.autor?.username || "Anonym"}
            </span>
          </div>
        </div>
      </div>

      {/* Zweispaltiges Layout direkt nach dem Hero-Bereich */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hauptinhalt - 2/3 der Breite */}
        <div className="md:col-span-2">
          {/* Aktionsleiste */}
          <div className="flex justify-between items-center py-4 border-b border-gray-200 dark:border-gray-800 mb-6">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center ${liked ? "text-red-500" : ""}`}
                onClick={handleLike}
              >
                <Heart className={`h-5 w-5 mr-2 ${liked ? "fill-current" : ""}`} />
                <span>{likesCount}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                <span>{erlebnis.kommentare?.length || 12}</span>
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={handleOpenAssistant}>
                <HelpCircle className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={bookmarked ? "text-yellow-500" : ""}
                onClick={handleBookmark}
              >
                <Bookmark className={`h-5 w-5 ${bookmarked ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center ml-2"
                onClick={() => setShowSimilarModal(true)}
              >
                <Search className="h-4 w-4 mr-2" />
                Ähnliche finden
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="flex items-center">
                    <Flag className="h-4 w-4 mr-2" />
                    <span>Melden</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* KI-Zusammenfassung - nur in der linken Spalte */}
          <div className="mb-6">
            <KIZusammenfassung
              erlebnisId={erlebnis.id}
              zusammenfassung={erlebnis.kiZusammenfassung}
              isLoading={erlebnis.kiZusammenfassungStatus === "pending"}
              englishSummary={erlebnis.englishSummary}
            />
          </div>

          {/* Tabs für Inhalt */}
          <Tabs defaultValue="beschreibung" className="mt-0">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="beschreibung">Beschreibung</TabsTrigger>
              <TabsTrigger value="medien">Medien</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="kommentare">Kommentare</TabsTrigger>
            </TabsList>

            <TabsContent value="beschreibung" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="prose max-w-none dark:prose-invert">
                    <p className="whitespace-pre-line">
                      {erlebnis.beschreibung ||
                        "Eine tiefgreifende Erfahrung, bei der ich mich außerhalb meines Körpers befand und verschiedene Ebenen des Bewusstseins erkunden konnte."}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-6">
                    {(erlebnis.tags || ["Astralreise", "Außerkörperliche Erfahrung", "Bewusstseinserweiterung"]).map(
                      (tag, index) => (
                        <Badge key={index} variant="secondary" className="rounded-full">
                          {tag}
                        </Badge>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medien" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  {medien.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {medien.map((medium, index) => (
                        <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                          {medium.typ === "bild" && (
                            <Image
                              src={medium.url || "/placeholder.svg"}
                              alt={medium.beschreibung || `Bild ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          )}
                          {medium.typ === "video" && (
                            <video src={medium.url} controls className="w-full h-full object-cover" />
                          )}
                          {medium.typ === "audio" && (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                              <audio src={medium.url} controls className="w-full" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="relative aspect-square rounded-md overflow-hidden">
                        <Image src="/ethereal-aquatic-dream.png" alt="Beispielbild 1" fill className="object-cover" />
                      </div>
                      <div className="relative aspect-square rounded-md overflow-hidden">
                        <Image src="/deep-sea-fantasy.png" alt="Beispielbild 2" fill className="object-cover" />
                      </div>
                      <div className="relative aspect-square rounded-md overflow-hidden">
                        <Image src="/celestial-contemplation.png" alt="Beispielbild 3" fill className="object-cover" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Emotionale Tonalität</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Introspektiv</Badge>
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                        >
                          Spirituell
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        >
                          Transformativ
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Benutzerfreundlichkeit</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        >
                          Intuitiv
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                        >
                          Spirituell
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        >
                          Transformativ
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Schlüsselerkenntnisse</h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                        <li>Erfahrung von Bewusstseinserweiterung jenseits physischer Grenzen</li>
                        <li>Verbindung zu höheren Bewusstseinsebenen</li>
                        <li>Transformation des Selbstverständnisses</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Ähnliche Konzepte</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge>Luzides Träumen</Badge>
                        <Badge>Meditation</Badge>
                        <Badge>Transpersonale Psychologie</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="kommentare" className="mt-4">
              <Card>
                <CardContent className="pt-6 pb-2">
                  <h3 className="text-lg font-medium mb-4">Kommentare ({erlebnis.kommentare?.length || 12})</h3>
                  <div className="prose max-w-none dark:prose-invert mb-4">
                    <p>
                      Teile deine Gedanken zu diesem Erlebnis und tausche dich mit anderen Nutzern aus. Kommentare
                      können helfen, neue Perspektiven zu entdecken und tiefere Einsichten zu gewinnen.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-4">
                <Kommentare erlebnisId={erlebnis.id} initialKommentare={erlebnis.kommentare || []} />
              </div>
            </TabsContent>
          </Tabs>

          <Separator className="my-8" />

          {/* Verknüpfungen */}
          <div className="mt-8">
            <ErlebnisVerknuepfung erlebnisId={erlebnis.id} verknuepfungen={8} />
          </div>

          {/* Erweiterte Ähnlichkeiten */}
          <div className="mt-12 pt-8 border-t">
            <ErweiterteAehnlichkeiten erlebnis={erlebnis} aehnlicheErlebnisse={erlebnis.aehnlicheErlebnisse || []} />
          </div>
        </div>

        {/* Rechte Seitenleiste - 1/3 der Breite - jetzt über die gesamte Höhe */}
        <div className="md:col-span-1 space-y-6">
          {/* Titel für die rechte Spalte */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">KI-Analyse & Einsichten</h2>
            <p className="text-sm opacity-90 mt-1">
              Automatisch generierte Erkenntnisse und Muster basierend auf diesem Erlebnis
            </p>
          </div>

          {/* KI-Analyse */}
          <KIAnalyse erlebnis={erlebnis} />

          {/* Muster und Trends */}
          <div className="mt-6">
            <MusterTrends
              erlebnisId={erlebnis.id}
              muster={erlebnis.muster}
              trends={erlebnis.trends}
              einsichten={erlebnis.einsichten}
            />
          </div>

          {/* Zusätzliche Informationen für die rechte Spalte */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-3">Erlebnis-Metadaten</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Erstellt am:</span>
                  <span>{formatDatum(erlebnis.erstelltAm)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Kategorie:</span>
                  <span>{getKategorieName()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Sichtbarkeit:</span>
                  <span>{erlebnis.sichtbarkeit || "Öffentlich"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Verifiziert:</span>
                  <span>{erlebnis.verifiziert ? "Ja" : "Nein"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ähnlichkeitsgrad */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-3">Ähnlichkeitsgrad</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Spirituelle Erfahrungen</span>
                    <span>87%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: "87%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Bewusstseinserweiternde Erlebnisse</span>
                    <span>92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "92%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Außerkörperliche Erfahrungen</span>
                    <span>78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: "78%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
