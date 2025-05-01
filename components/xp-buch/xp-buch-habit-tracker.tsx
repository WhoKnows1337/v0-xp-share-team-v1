"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Check, Edit2, Trash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Habit-Typ-Definition
interface Habit {
  id: string
  name: string
  frequency: "daily" | "weekly"
  completedDates: string[] // ISO-Datumsstrings
  createdAt: string
  color: string
}

// Mock-Daten für Habits
const initialHabits: Habit[] = [
  {
    id: "1",
    name: "Tagebuch schreiben",
    frequency: "daily",
    completedDates: [
      new Date(Date.now() - 86400000).toISOString(),
      new Date(Date.now() - 86400000 * 2).toISOString(),
      new Date(Date.now() - 86400000 * 3).toISOString(),
      new Date().toISOString(),
    ],
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    color: "bg-blue-500",
  },
  {
    id: "2",
    name: "Meditation",
    frequency: "daily",
    completedDates: [new Date(Date.now() - 86400000).toISOString(), new Date().toISOString()],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    color: "bg-purple-500",
  },
  {
    id: "3",
    name: "Wöchentliche Reflexion",
    frequency: "weekly",
    completedDates: [new Date(Date.now() - 86400000 * 7).toISOString()],
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    color: "bg-green-500",
  },
]

// Verfügbare Farben für Habits
const habitColors = [
  { name: "Blau", value: "bg-blue-500" },
  { name: "Grün", value: "bg-green-500" },
  { name: "Lila", value: "bg-purple-500" },
  { name: "Rosa", value: "bg-pink-500" },
  { name: "Orange", value: "bg-orange-500" },
  { name: "Rot", value: "bg-red-500" },
  { name: "Gelb", value: "bg-yellow-500" },
  { name: "Türkis", value: "bg-teal-500" },
]

export function XPBuchHabitTracker() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [newHabitName, setNewHabitName] = useState("")
  const [newHabitFrequency, setNewHabitFrequency] = useState<"daily" | "weekly">("daily")
  const [newHabitColor, setNewHabitColor] = useState("bg-blue-500")
  const { toast } = useToast()

  // Generiere Tage für die letzten 7 Tage
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date
  }).reverse()

  // Prüfe, ob ein Habit an einem bestimmten Tag abgeschlossen wurde
  const isHabitCompletedOnDate = (habit: Habit, date: Date) => {
    return habit.completedDates.some((completedDate) => {
      const completed = new Date(completedDate)
      return (
        completed.getDate() === date.getDate() &&
        completed.getMonth() === date.getMonth() &&
        completed.getFullYear() === date.getFullYear()
      )
    })
  }

  // Toggle den Abschluss eines Habits für ein bestimmtes Datum
  const toggleHabitCompletion = (habitId: string, date: Date) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id !== habitId) return habit

        const dateString = date.toISOString()
        const isCompleted = isHabitCompletedOnDate(habit, date)

        if (isCompleted) {
          // Entferne das Datum aus den abgeschlossenen Daten
          return {
            ...habit,
            completedDates: habit.completedDates.filter((d) => {
              const completedDate = new Date(d)
              return !(
                completedDate.getDate() === date.getDate() &&
                completedDate.getMonth() === date.getMonth() &&
                completedDate.getFullYear() === date.getFullYear()
              )
            }),
          }
        } else {
          // Füge das Datum zu den abgeschlossenen Daten hinzu
          return {
            ...habit,
            completedDates: [...habit.completedDates, dateString],
          }
        }
      }),
    )
  }

  // Füge einen neuen Habit hinzu oder aktualisiere einen bestehenden
  const saveHabit = () => {
    if (!newHabitName.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib einen Namen für die Gewohnheit ein.",
        variant: "destructive",
      })
      return
    }

    if (editingHabit) {
      // Aktualisiere einen bestehenden Habit
      setHabits((prevHabits) =>
        prevHabits.map((habit) =>
          habit.id === editingHabit.id
            ? {
                ...habit,
                name: newHabitName,
                frequency: newHabitFrequency,
                color: newHabitColor,
              }
            : habit,
        ),
      )
      toast({
        title: "Gewohnheit aktualisiert",
        description: `"${newHabitName}" wurde erfolgreich aktualisiert.`,
      })
    } else {
      // Füge einen neuen Habit hinzu
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: newHabitName,
        frequency: newHabitFrequency,
        completedDates: [],
        createdAt: new Date().toISOString(),
        color: newHabitColor,
      }
      setHabits((prevHabits) => [...prevHabits, newHabit])
      toast({
        title: "Gewohnheit hinzugefügt",
        description: `"${newHabitName}" wurde erfolgreich hinzugefügt.`,
      })
    }

    // Zurücksetzen und Dialog schließen
    resetForm()
    setIsAddDialogOpen(false)
  }

  // Lösche einen Habit
  const deleteHabit = (habitId: string) => {
    setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== habitId))
    toast({
      title: "Gewohnheit gelöscht",
      description: "Die Gewohnheit wurde erfolgreich gelöscht.",
    })
    resetForm()
    setIsAddDialogOpen(false)
  }

  // Öffne den Dialog zum Bearbeiten eines Habits
  const openEditDialog = (habit: Habit) => {
    setEditingHabit(habit)
    setNewHabitName(habit.name)
    setNewHabitFrequency(habit.frequency)
    setNewHabitColor(habit.color)
    setIsAddDialogOpen(true)
  }

  // Formular zurücksetzen
  const resetForm = () => {
    setEditingHabit(null)
    setNewHabitName("")
    setNewHabitFrequency("daily")
    setNewHabitColor("bg-blue-500")
  }

  // Berechne die aktuelle Streak für einen Habit
  const calculateStreak = (habit: Habit) => {
    if (habit.completedDates.length === 0) return 0

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Für tägliche Gewohnheiten
    if (habit.frequency === "daily") {
      const currentDate = new Date(today)

      while (true) {
        if (isHabitCompletedOnDate(habit, currentDate)) {
          streak++
          currentDate.setDate(currentDate.getDate() - 1)
        } else {
          break
        }
      }
    }
    // Für wöchentliche Gewohnheiten
    else if (habit.frequency === "weekly") {
      // Vereinfachte Implementierung für wöchentliche Gewohnheiten
      const thisWeekCompleted = habit.completedDates.some((date) => {
        const completedDate = new Date(date)
        const diffTime = today.getTime() - completedDate.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        return diffDays < 7
      })

      if (thisWeekCompleted) streak = 1
    }

    return streak
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Habit Tracker</CardTitle>
              <CardDescription>Verfolge deine täglichen und wöchentlichen Gewohnheiten</CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Neue Gewohnheit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-2 min-w-[200px]">Gewohnheit</th>
                  {last7Days.map((date) => (
                    <th key={date.toISOString()} className="text-center p-2 w-10">
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-muted-foreground">
                          {date.toLocaleDateString("de-DE", { weekday: "short" })}
                        </span>
                        <span className="font-bold">{date.getDate()}</span>
                      </div>
                    </th>
                  ))}
                  <th className="text-center p-2">Streak</th>
                  <th className="text-center p-2">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {habits.map((habit) => (
                  <tr key={habit.id} className="border-t">
                    <td className="p-2">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${habit.color} mr-2`}></div>
                        <span>{habit.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({habit.frequency === "daily" ? "täglich" : "wöchentlich"})
                        </span>
                      </div>
                    </td>
                    {last7Days.map((date) => (
                      <td key={date.toISOString()} className="text-center p-2">
                        <Button
                          variant={isHabitCompletedOnDate(habit, date) ? "default" : "outline"}
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => toggleHabitCompletion(habit.id, date)}
                        >
                          {isHabitCompletedOnDate(habit, date) ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <span className="opacity-0">✓</span>
                          )}
                        </Button>
                      </td>
                    ))}
                    <td className="text-center p-2">
                      <span className="font-bold">{calculateStreak(habit)}</span>
                    </td>
                    <td className="text-center p-2">
                      <div className="flex justify-center space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(habit)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteHabit(habit.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open)
          if (!open) resetForm()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingHabit ? "Gewohnheit bearbeiten" : "Neue Gewohnheit hinzufügen"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="habit-name">Name</Label>
              <Input
                id="habit-name"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="z.B. Tagebuch schreiben"
              />
            </div>
            <div className="space-y-2">
              <Label>Häufigkeit</Label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={newHabitFrequency === "daily" ? "default" : "outline"}
                  onClick={() => setNewHabitFrequency("daily")}
                  className="flex-1"
                >
                  Täglich
                </Button>
                <Button
                  type="button"
                  variant={newHabitFrequency === "weekly" ? "default" : "outline"}
                  onClick={() => setNewHabitFrequency("weekly")}
                  className="flex-1"
                >
                  Wöchentlich
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Farbe</Label>
              <div className="grid grid-cols-4 gap-2">
                {habitColors.map((color) => (
                  <Button
                    key={color.value}
                    type="button"
                    variant="outline"
                    className={`h-8 ${newHabitColor === color.value ? "ring-2 ring-offset-2 ring-primary" : ""}`}
                    onClick={() => setNewHabitColor(color.value)}
                  >
                    <div className={`w-full h-4 rounded ${color.value}`}></div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm()
                setIsAddDialogOpen(false)
              }}
            >
              Abbrechen
            </Button>
            {editingHabit && (
              <Button variant="destructive" onClick={() => deleteHabit(editingHabit.id)}>
                Löschen
              </Button>
            )}
            <Button onClick={saveHabit}>{editingHabit ? "Aktualisieren" : "Hinzufügen"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
