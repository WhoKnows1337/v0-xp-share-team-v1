"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useXPBuch } from "@/contexts/xp-buch-context"
import { getStreakInfo } from "@/lib/streak-utils"
import { CalendarIcon, Flame, Plus, Edit } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ErlebnisWizard } from "@/components/erlebnis-wizard"

export function XPBuchKalender() {
  const { state } = useXPBuch()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const { currentStreak, longestStreak } = getStreakInfo(state.entries)
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<string | null>(null)

  // Erstelle ein Set mit allen Tagen, an denen Einträge vorhanden sind
  const datesWithEntries = new Set(
    state.entries.map((eintrag) => {
      const date = new Date(eintrag.datum)
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    }),
  )

  // Funktion, um zu prüfen, ob ein bestimmter Tag Einträge hat
  const hasEntriesOnDate = (date: Date) => {
    return datesWithEntries.has(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`)
  }

  // Funktion, um die Anzahl der Einträge für ein bestimmtes Datum zu zählen
  const countEntriesOnDate = (date: Date) => {
    return state.entries.filter((eintrag) => {
      const entryDate = new Date(eintrag.datum)
      return (
        entryDate.getFullYear() === date.getFullYear() &&
        entryDate.getMonth() === date.getMonth() &&
        entryDate.getDate() === date.getDate()
      )
    }).length
  }

  // Einträge für das ausgewählte Datum
  const selectedDateEntries = selectedDate
    ? state.entries.filter((eintrag) => {
        const entryDate = new Date(eintrag.datum)
        return (
          entryDate.getFullYear() === selectedDate.getFullYear() &&
          entryDate.getMonth() === selectedDate.getMonth() &&
          entryDate.getDate() === selectedDate.getDate()
        )
      })
    : []

  // Öffne den Wizard für einen neuen Eintrag am ausgewählten Datum
  const handleNewEntry = () => {
    setEditingEntry(null)
    setIsWizardOpen(true)
  }

  // Öffne den Wizard zum Bearbeiten eines Eintrags
  const handleEditEntry = (entryId: string) => {
    setEditingEntry(entryId)
    setIsWizardOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Kalender</CardTitle>
            <CardDescription>Übersicht deiner XP-Buch Einträge</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                hasEntry: (date) => hasEntriesOnDate(date),
              }}
              modifiersStyles={{
                hasEntry: {
                  backgroundColor: "var(--primary-50)",
                  fontWeight: "bold",
                  color: "var(--primary)",
                },
              }}
              components={{
                DayContent: ({ date }) => {
                  const count = countEntriesOnDate(date)
                  return (
                    <div className="relative w-full h-full flex items-center justify-center">
                      {date.getDate()}
                      {count > 0 && <span className="absolute bottom-0 right-0 w-2 h-2 bg-primary rounded-full" />}
                    </div>
                  )
                },
              }}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleNewEntry} className="w-full" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Neuer Eintrag für {selectedDate?.toLocaleDateString("de-DE", { day: "numeric", month: "long" })}
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Flame className="h-5 w-5 mr-2 text-amber-500" />
                Streak
              </CardTitle>
              <CardDescription>Deine aktuelle Eintrags-Serie</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Aktuelle Serie</p>
                  <p className="text-3xl font-bold">{currentStreak} Tage</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Längste Serie</p>
                  <p className="text-3xl font-bold">{longestStreak} Tage</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedDate && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  {selectedDate.toLocaleDateString("de-DE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </CardTitle>
                <CardDescription>
                  {selectedDateEntries.length === 0
                    ? "Keine Einträge an diesem Tag"
                    : `${selectedDateEntries.length} Einträge an diesem Tag`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDateEntries.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedDateEntries.map((eintrag) => (
                      <li key={eintrag.id} className="p-2 rounded-md bg-accent">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{eintrag.titel}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2">{eintrag.inhalt}</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleEditEntry(eintrag.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">
                      Keine Einträge für diesen Tag. Erstelle deinen ersten Eintrag!
                    </p>
                    <Button onClick={handleNewEntry} variant="outline" className="mt-2">
                      <Plus className="mr-2 h-4 w-4" />
                      Eintrag erstellen
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Wizard Dialog */}
      <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{editingEntry ? "Eintrag bearbeiten" : "Neuer Eintrag"}</DialogTitle>
          </DialogHeader>
          <ErlebnisWizard initialDate={selectedDate} entryId={editingEntry} onComplete={() => setIsWizardOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
