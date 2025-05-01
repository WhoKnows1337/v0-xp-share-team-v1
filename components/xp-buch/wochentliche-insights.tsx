"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { generateWeeklyInsights } from "@/lib/insights-utils"
import { useXPBuch } from "@/contexts/xp-buch-context"
import { format, startOfWeek, endOfWeek } from "date-fns"
import { de } from "date-fns/locale"
import { BarChart, Calendar, Lightbulb, RefreshCw } from "lucide-react"

export function WochentlicheInsights() {
  const { state } = useXPBuch()
  const { entries } = state
  const [insights, setInsights] = useState<ReturnType<typeof generateWeeklyInsights> | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Insights generieren
  const generateInsights = async () => {
    setIsLoading(true)

    try {
      // In einer echten Anwendung würde hier ein API-Aufruf stattfinden
      // Für die Demo simulieren wir eine Verzögerung
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const weeklyInsights = generateWeeklyInsights(entries)
      setInsights(weeklyInsights)
    } catch (error) {
      console.error("Fehler beim Generieren der Insights:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Beim ersten Laden Insights generieren
  useEffect(() => {
    generateInsights()
  }, [])

  // Datumsbereich der letzten Woche formatieren
  const today = new Date()
  const startOfLastWeek = startOfWeek(today, { weekStartsOn: 1 })
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7) // Eine Woche zurück
  const endOfLastWeek = endOfWeek(startOfLastWeek, { weekStartsOn: 1 })

  const formattedDateRange = `${format(startOfLastWeek, "dd. MMM", { locale: de })} - ${format(endOfLastWeek, "dd. MMM yyyy", { locale: de })}`

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <BarChart className="h-5 w-5 mr-2 text-indigo-500" />
            Wöchentliche Insights
          </CardTitle>
          <Badge variant="outline" className="font-normal">
            <Calendar className="h-3 w-3 mr-1" />
            {formattedDateRange}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="py-8 text-center">
            <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Insights werden generiert...</p>
          </div>
        ) : insights ? (
          <>
            <div className="bg-muted p-4 rounded-md">
              <p>{insights.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Aktivität</h3>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Einträge</span>
                      <span>{insights.statistics.totalEntries}</span>
                    </div>
                    <Progress value={Math.min(100, (insights.statistics.totalEntries / 7) * 100)} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Aktive Tage</span>
                      <span>{insights.statistics.activeDays} von 7</span>
                    </div>
                    <Progress value={(insights.statistics.activeDays / 7) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Längste Streak</span>
                      <span>{insights.statistics.longestStreak} Tage</span>
                    </div>
                    <Progress value={(insights.statistics.longestStreak / 7) * 100} className="h-2" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Top Themen</h3>
                {insights.statistics.topTags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {insights.statistics.topTags.map(({ tag, count }) => (
                      <Badge key={tag} variant="secondary">
                        {tag} ({count})
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Keine Tags in diesem Zeitraum</p>
                )}

                <h3 className="text-sm font-medium mt-4 mb-2">Stimmungen</h3>
                {insights.statistics.topMoods.length > 0 ? (
                  <div className="space-y-2">
                    {insights.statistics.topMoods.map(({ mood, count }) => (
                      <div key={mood}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{mood}</span>
                          <span>{count}x</span>
                        </div>
                        <Progress value={(count / insights.statistics.totalEntries) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Keine Stimmungen in diesem Zeitraum</p>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <h3 className="flex items-center text-sm font-medium mb-2">
                <Lightbulb className="h-4 w-4 mr-1 text-amber-500" />
                Tipps für dich
              </h3>
              <ul className="space-y-2">
                {insights.tips.map((tip, index) => (
                  <li key={index} className="text-sm flex items-start">
                    <span className="text-muted-foreground mr-2">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Keine Insights verfügbar</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={generateInsights} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Insights aktualisieren
        </Button>
      </CardFooter>
    </Card>
  )
}
