"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Bell, Clock, Calendar, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { v4 as uuidv4 } from "uuid"

interface Reminder {
  id: string
  type: "daily" | "weekly"
  time: string
  day?: number // 0-6 für Wochentag (Sonntag-Samstag)
  enabled: boolean
}

export function ReminderZeitplaner() {
  const { toast } = useToast()
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "1",
      type: "daily",
      time: "20:00",
      enabled: true,
    },
  ])
  const [newReminderType, setNewReminderType] = useState<"daily" | "weekly">("daily")
  const [newReminderTime, setNewReminderTime] = useState("20:00")
  const [newReminderDay, setNewReminderDay] = useState<number>(1) // Montag

  const weekdays = [
    { value: 0, label: "Sonntag" },
    { value: 1, label: "Montag" },
    { value: 2, label: "Dienstag" },
    { value: 3, label: "Mittwoch" },
    { value: 4, label: "Donnerstag" },
    { value: 5, label: "Freitag" },
    { value: 6, label: "Samstag" },
  ]

  const handleAddReminder = () => {
    const newReminder: Reminder = {
      id: uuidv4(),
      type: newReminderType,
      time: newReminderTime,
      day: newReminderType === "weekly" ? newReminderDay : undefined,
      enabled: true,
    }

    setReminders([...reminders, newReminder])

    toast({
      title: "Erinnerung hinzugefügt",
      description: `${newReminderType === "daily" ? "Tägliche" : "Wöchentliche"} Erinnerung um ${newReminderTime} Uhr ${
        newReminderType === "weekly" ? `am ${weekdays.find((d) => d.value === newReminderDay)?.label}` : ""
      } wurde hinzugefügt.`,
      duration: 3000,
    })
  }

  const handleToggleReminder = (id: string, enabled: boolean) => {
    setReminders(reminders.map((reminder) => (reminder.id === id ? { ...reminder, enabled } : reminder)))

    const reminder = reminders.find((r) => r.id === id)
    if (reminder) {
      toast({
        title: enabled ? "Erinnerung aktiviert" : "Erinnerung deaktiviert",
        description: `${reminder.type === "daily" ? "Tägliche" : "Wöchentliche"} Erinnerung um ${reminder.time} Uhr wurde ${
          enabled ? "aktiviert" : "deaktiviert"
        }.`,
        duration: 3000,
      })
    }
  }

  const handleDeleteReminder = (id: string) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id))

    toast({
      title: "Erinnerung gelöscht",
      description: "Die Erinnerung wurde erfolgreich gelöscht.",
      duration: 3000,
    })
  }

  const formatReminderText = (reminder: Reminder) => {
    if (reminder.type === "daily") {
      return `Täglich um ${reminder.time} Uhr`
    } else {
      const day = weekdays.find((d) => d.value === reminder.day)?.label || ""
      return `Jeden ${day} um ${reminder.time} Uhr`
    }
  }

  const getNextReminderDate = (reminder: Reminder) => {
    const now = new Date()
    const [hours, minutes] = reminder.time.split(":").map(Number)

    const nextDate = new Date()
    nextDate.setHours(hours, minutes, 0, 0)

    if (reminder.type === "daily") {
      // Wenn die Zeit heute bereits vorbei ist, setze auf morgen
      if (nextDate <= now) {
        nextDate.setDate(nextDate.getDate() + 1)
      }
    } else if (reminder.type === "weekly" && reminder.day !== undefined) {
      // Setze auf den nächsten Wochentag
      const currentDay = nextDate.getDay()
      const daysUntilNext = (reminder.day - currentDay + 7) % 7

      nextDate.setDate(nextDate.getDate() + (daysUntilNext === 0 && nextDate <= now ? 7 : daysUntilNext))
    }

    return nextDate
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Bell className="h-5 w-5 mr-2 text-primary" />
            Erinnerungen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="reminder-type">Häufigkeit</Label>
              <Select
                value={newReminderType}
                onValueChange={(value) => setNewReminderType(value as "daily" | "weekly")}
              >
                <SelectTrigger id="reminder-type">
                  <SelectValue placeholder="Häufigkeit wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Täglich</SelectItem>
                  <SelectItem value="weekly">Wöchentlich</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newReminderType === "weekly" && (
              <div>
                <Label htmlFor="reminder-day">Tag</Label>
                <Select value={newReminderDay.toString()} onValueChange={(value) => setNewReminderDay(Number(value))}>
                  <SelectTrigger id="reminder-day">
                    <SelectValue placeholder="Tag wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {weekdays.map((day) => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="reminder-time">Uhrzeit</Label>
              <input
                type="time"
                id="reminder-time"
                value={newReminderTime}
                onChange={(e) => setNewReminderTime(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <Button type="button" onClick={handleAddReminder} className="w-full">
            Erinnerung hinzufügen
          </Button>
        </CardContent>
      </Card>

      {reminders.length > 0 ? (
        <div className="space-y-3">
          {reminders.map((reminder) => (
            <Card key={reminder.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {reminder.type === "daily" ? (
                      <Clock className="h-5 w-5 text-primary" />
                    ) : (
                      <Calendar className="h-5 w-5 text-primary" />
                    )}
                    <div>
                      <p className="font-medium">{formatReminderText(reminder)}</p>
                      {reminder.enabled && (
                        <p className="text-xs text-muted-foreground">
                          Nächste Erinnerung: {format(getNextReminderDate(reminder), "PPp", { locale: de })}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={reminder.enabled}
                      onCheckedChange={(checked) => handleToggleReminder(reminder.id, checked)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteReminder(reminder.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Keine Erinnerungen vorhanden.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
