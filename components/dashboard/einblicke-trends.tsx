"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { BarChart, TrendingUp, Map, AlertCircle, Lock, Lightbulb, Globe, Clock, Sparkles, Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function EinblickeTrends() {
  const [activeTab, setActiveTab] = useState("uebersicht")
  const [timeRange, setTimeRange] = useState("30d")
  const [isLoading, setIsLoading] = useState(true)
  const [showPremiumModal, setShowPremiumModal] = useState(false)

  // Simuliere Ladezustand
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Behandle Tab-Wechsel zu Premium
  useEffect(() => {
    if (activeTab === "premium") {
      setShowPremiumModal(true)
    }
  }, [activeTab])

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Einblicke & Trends</h1>
        <p className="text-muted-foreground">Entdecke Muster und Trends in den Erlebnissen der Community</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <Tabs defaultValue="uebersicht" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="uebersicht">Übersicht</TabsTrigger>
            <TabsTrigger value="erlebnisse">Erlebnisse</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="premium" className="relative">
              Premium
              <Lock className="ml-1 h-3 w-3" />
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Zeitraum:</span>
          <Select defaultValue="30d" value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Zeitraum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Tage</SelectItem>
              <SelectItem value="30d">30 Tage</SelectItem>
              <SelectItem value="90d">90 Tage</SelectItem>
              <SelectItem value="1y">1 Jahr</SelectItem>
              <SelectItem value="all">Alle Zeit</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-[180px] w-full" />
            <Skeleton className="h-[180px] w-full" />
            <Skeleton className="h-[180px] w-full" />
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : (
        <TabsContent value="uebersicht" className="space-y-4 mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Erlebnisse gesamt</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <BarChart className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">Gesamtzahl der geteilten Erlebnisse auf der Plattform</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,845</div>
                <p className="text-xs text-muted-foreground">+18% im Vergleich zum Vormonat</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aktive Nutzer</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Users className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">Anzahl der Nutzer, die im letzten Monat aktiv waren</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">573</div>
                <p className="text-xs text-muted-foreground">+12% im Vergleich zum Vormonat</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Neue Verbindungen</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TrendingUp className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">Neu entdeckte Verbindungen zwischen Erlebnissen</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">124</div>
                <p className="text-xs text-muted-foreground">+42% im Vergleich zum Vormonat</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                Aktuelle Erkenntnisse
              </CardTitle>
              <CardDescription>KI-generierte Analysen basierend auf den neuesten Daten</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-muted p-4">
                <div className="font-medium">Sentiment-Analyse</div>
                <p className="text-sm text-muted-foreground mt-1">
                  80% der Nahtoderfahrungen wurden als positiv (Frieden, Liebe) beschrieben, während Träume zu 40%
                  angstbehaftet waren.
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Nahtoderfahrungen (positiv)</span>
                    <span>80%</span>
                  </div>
                  <Progress value={80} className="h-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span>Träume (angstbehaftet)</span>
                    <span>40%</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
              </div>

              <div className="rounded-md bg-muted p-4">
                <div className="font-medium">Trending Tags</div>
                <p className="text-sm text-muted-foreground mt-1">
                  In diesem Monat 5 Erlebnisse mit Tag 'Pyramide', deutlich mehr als üblich.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary/10">
                    Pyramide
                  </Badge>
                  <Badge variant="secondary">Licht</Badge>
                  <Badge variant="secondary">Meditation</Badge>
                  <Badge variant="secondary">Zeitreise</Badge>
                  <Badge variant="secondary">Heilung</Badge>
                </div>
              </div>

              <div className="rounded-md bg-muted p-4">
                <div className="font-medium">Zeitliche Häufungen</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Im Jahr 2024 gab es ungewöhnlich viele Berichte über Begegnungen mit Lichtwesen.
                </p>
                <div className="mt-3 h-24 w-full bg-card rounded-md border flex items-end p-2">
                  {/* Einfaches Liniendiagramm-Mockup */}
                  <div className="flex items-end justify-between w-full h-full">
                    {[15, 25, 18, 35, 42, 28, 22, 30, 45, 38, 32, 40].map((value, i) => (
                      <div
                        key={i}
                        className={`w-1 bg-primary rounded-t ${i === 9 ? "bg-yellow-500" : ""}`}
                        style={{ height: `${value}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-center mt-1 text-muted-foreground">Jan - Dez 2024</div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center text-xs text-muted-foreground">
              <AlertCircle className="mr-1 h-3 w-3" />
              KI-generierte Analyse, kann Fehler enthalten.
            </CardFooter>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5 text-blue-500" />
                  Geografische Verteilung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[4/3] rounded-md bg-muted flex items-center justify-center">
                  <div className="text-center p-4">
                    <Map className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Viele Intuitionsberichte kommen aus urbanen Gebieten, UFO-Sichtungen mehr vom Land.
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm">Intuitionsberichte (urban)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">UFO-Sichtungen (ländlich)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
                  Cluster & Themenwolken
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-muted p-4">
                  <div className="font-medium">Top-Themen in Träumen</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge className="bg-purple-600 text-white px-3 py-1 text-base">Fliegen</Badge>
                    <Badge className="bg-purple-500 text-white px-3 py-1">Verstorbenen-Begegnung</Badge>
                    <Badge className="bg-purple-400 text-white px-2 py-0.5">Fallen</Badge>
                    <Badge className="bg-purple-300 text-white px-2 py-0.5">Wasser</Badge>
                    <Badge className="bg-purple-200 text-purple-900 px-2 py-0.5">Verfolgung</Badge>
                    <Badge className="bg-purple-100 text-purple-900 px-2 py-0.5">Fliehen</Badge>
                    <Badge className="bg-purple-100 text-purple-900 px-1 py-0.5 text-xs">Prüfung</Badge>
                    <Badge className="bg-purple-100 text-purple-900 px-1 py-0.5 text-xs">Suchen</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Unsere KI hat entdeckt, dass 'Fliegen' das häufigste Motiv in Träumen der Community ist.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      )}

      {!isLoading && (
        <>
          <TabsContent value="erlebnisse" className="space-y-4 mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Erlebnisse nach Kategorie</CardTitle>
                <CardDescription>Verteilung aller Erlebnisse nach Kategorie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div className="w-64 h-64 rounded-full border-8 border-background relative flex items-center justify-center">
                    {/* Einfaches Tortendiagramm-Mockup */}
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-purple-500 origin-bottom-right rotate-0"></div>
                      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500 origin-bottom-left rotate-0"></div>
                      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-green-500 origin-top-right rotate-0"></div>
                      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-yellow-500 origin-top-left rotate-0"></div>
                    </div>
                    <div className="w-40 h-40 rounded-full bg-background flex items-center justify-center">
                      <span className="text-xl font-bold">2,845</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                    <span className="text-sm">Traum (32%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm">Déjà-vu (24%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Meditation (18%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="text-sm">Andere (26%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-blue-500" />
                  Zeitliche Entwicklung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full bg-muted rounded-md p-4 flex flex-col justify-between">
                  <div className="text-sm font-medium">Anzahl der Erlebnisse pro Monat</div>
                  <div className="flex-1 flex items-end gap-2 mt-4">
                    {[45, 62, 58, 70, 85, 78, 92, 105, 98, 120, 115, 130].map((value, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-blue-500 rounded-t" style={{ height: `${value / 1.5}%` }}></div>
                        <div className="text-xs mt-1">{i + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm font-medium">Wichtige Beobachtungen:</div>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc pl-5">
                    <li>Kontinuierlicher Anstieg der Erlebnisberichte über das Jahr</li>
                    <li>Spitzen im April und Oktober könnten saisonale Muster andeuten</li>
                    <li>Dezember zeigt den höchsten Wert mit 130 neuen Erlebnissen</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sentiment-Analyse nach Kategorie</CardTitle>
                <CardDescription>Emotionale Stimmung in verschiedenen Erlebniskategorien</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Nahtoderfahrung</span>
                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                      >
                        80% positiv
                      </Badge>
                      <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300">
                        5% negativ
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-green-300" style={{ width: "80%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Traum</span>
                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                      >
                        35% positiv
                      </Badge>
                      <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300">
                        40% negativ
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-500 to-red-300" style={{ width: "40%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Meditation</span>
                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                      >
                        75% positiv
                      </Badge>
                      <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300">
                        8% negativ
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-green-300" style={{ width: "75%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Déjà-vu</span>
                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                      >
                        45% positiv
                      </Badge>
                      <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300">
                        15% negativ
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-300 to-yellow-300"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">UFO-Sichtung</span>
                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                      >
                        30% positiv
                      </Badge>
                      <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300">
                        25% negativ
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300"
                      style={{ width: "30%" }}
                    ></div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center text-xs text-muted-foreground">
                <AlertCircle className="mr-1 h-3 w-3" />
                KI-generierte Analyse, kann Fehler enthalten.
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="community" className="space-y-4 mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Community-Aktivität</CardTitle>
                <CardDescription>Aktivitätstrend der letzten 30 Tage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full bg-muted rounded-md p-4">
                  <div className="h-full w-full flex flex-col">
                    <div className="flex-1 flex items-end">
                      <div className="w-full h-full flex items-end">
                        {Array.from({ length: 30 }).map((_, i) => {
                          const height = 30 + Math.random() * 60
                          return (
                            <div
                              key={i}
                              className="flex-1 bg-blue-500 opacity-80 mx-0.5 rounded-t"
                              style={{ height: `${height}%` }}
                            ></div>
                          )
                        })}
                      </div>
                    </div>
                    <div className="h-6 flex items-center justify-between mt-2">
                      <span className="text-xs">1. Mai</span>
                      <span className="text-xs">15. Mai</span>
                      <span className="text-xs">30. Mai</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">124</div>
                    <div className="text-xs text-muted-foreground">Neue Erlebnisse</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">856</div>
                    <div className="text-xs text-muted-foreground">Kommentare</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">2.4k</div>
                    <div className="text-xs text-muted-foreground">Likes</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top-Beitragende</CardTitle>
                  <CardDescription>Nutzer mit den meisten Beiträgen</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                          <span className="font-medium text-sm">AE</span>
                        </div>
                        <div>
                          <div className="font-medium">AstralExplorer</div>
                          <div className="text-xs text-muted-foreground">42 Erlebnisse</div>
                        </div>
                      </div>
                      <Badge>Top Autor</Badge>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                          <span className="font-medium text-sm">TR</span>
                        </div>
                        <div>
                          <div className="font-medium">Traumreisende</div>
                          <div className="text-xs text-muted-foreground">38 Erlebnisse</div>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                          <span className="font-medium text-sm">MM</span>
                        </div>
                        <div>
                          <div className="font-medium">MeditationsMeister</div>
                          <div className="text-xs text-muted-foreground">29 Erlebnisse</div>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                          <span className="font-medium text-sm">WE</span>
                        </div>
                        <div>
                          <div className="font-medium">WaldEntdecker</div>
                          <div className="text-xs text-muted-foreground">24 Erlebnisse</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement-Statistiken</CardTitle>
                  <CardDescription>Interaktionen pro Erlebniskategorie</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Nahtoderfahrung</span>
                      <span className="text-sm">8.4 Kommentare/Erlebnis</span>
                    </div>
                    <Progress value={84} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">UFO-Sichtung</span>
                      <span className="text-sm">7.2 Kommentare/Erlebnis</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Außerkörperlich</span>
                      <span className="text-sm">6.5 Kommentare/Erlebnis</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Déjà-vu</span>
                      <span className="text-sm">4.8 Kommentare/Erlebnis</span>
                    </div>
                    <Progress value={48} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Traum</span>
                      <span className="text-sm">3.2 Kommentare/Erlebnis</span>
                    </div>
                    <Progress value={32} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="premium" className="space-y-4 mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2 h-5 w-5 text-amber-500" />
                  Premium Insights
                </CardTitle>
                <CardDescription>Erweiterte Analysen und persönliche Berichte (Premium-Funktion)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md bg-muted/50 p-6 text-center">
                  <Lock className="h-10 w-10 mx-auto text-amber-500 mb-3" />
                  <h3 className="text-lg font-medium">Premium-Funktionen</h3>
                  <p className="text-sm text-muted-foreground mt-2 mb-4">
                    Erhalte Zugang zu detaillierten Analysen deiner eigenen Erlebnisse und exklusiven
                    Community-Insights.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span className="text-sm">Persönliche Musteranalyse</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span className="text-sm">Detaillierte Symbolanalyse</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span className="text-sm">Vergleich mit Community-Daten</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span className="text-sm">Exportierbare PDF-Berichte</span>
                    </div>
                  </div>
                  <Button className="bg-amber-500 hover:bg-amber-600">Premium freischalten</Button>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Beispiel: Persönlicher Insight-Bericht</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    So könnte dein persönlicher Analysebericht aussehen:
                  </p>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    <p className="font-medium">Für: AstralExplorer</p>
                    <p className="mt-2">
                      Deine 8 dokumentierten Erlebnisse zeigen ein wiederkehrendes Muster von{" "}
                      <span className="text-amber-500">Bewusstseinserweiterung</span> und{" "}
                      <span className="text-amber-500">spiritueller Führung</span>.
                    </p>
                    <p className="mt-2">Häufigste Symbole in deinen Berichten:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>Licht (7 Erwähnungen)</li>
                      <li>Höheres Selbst (5 Erwähnungen)</li>
                      <li>Kosmische Energie (4 Erwähnungen)</li>
                    </ul>
                    <p className="mt-2">
                      Im Vergleich zur Community zeigen deine Erlebnisse eine stärkere Tendenz zu positiven Emotionen
                      (+24%) und tieferen Bewusstseinszuständen.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">
                  Premium-Berichte werden mit fortschrittlichen KI-Algorithmen erstellt und von Experten überprüft.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </>
      )}

      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-2">Premium-Funktion</h3>
            <p className="text-muted-foreground mb-4">
              Diese Funktion ist nur für Premium-Mitglieder verfügbar. Upgrade jetzt, um Zugang zu detaillierten
              Analysen und persönlichen Insights zu erhalten.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPremiumModal(false)
                  setActiveTab("uebersicht")
                }}
              >
                Abbrechen
              </Button>
              <Button
                onClick={() => {
                  setShowPremiumModal(false)
                  // Hier würde normalerweise der Upgrade-Prozess starten
                }}
              >
                Upgrade starten
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
