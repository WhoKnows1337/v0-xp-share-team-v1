import type { XPEintrag } from "@/types/xp-eintrag"
import { format, startOfWeek, endOfWeek, differenceInDays, isSameDay } from "date-fns"
import { de } from "date-fns/locale"

// Filtert Einträge nach Zeitraum
export function filterEntriesByDateRange(entries: XPEintrag[], startDate: Date, endDate: Date): XPEintrag[] {
  return entries.filter((entry) => {
    const entryDate = new Date(entry.datum)
    return entryDate >= startDate && entryDate <= endDate
  })
}

// Berechnet Statistiken für einen bestimmten Zeitraum
export function calculatePeriodStatistics(
  entries: XPEintrag[],
  startDate: Date,
  endDate: Date,
): {
  totalEntries: number
  entriesPerDay: number
  activeDays: number
  topTags: Array<{ tag: string; count: number }>
  topMoods: Array<{ mood: string; count: number }>
  longestStreak: number
  currentStreak: number
} {
  const periodEntries = filterEntriesByDateRange(entries, startDate, endDate)
  const totalDays = differenceInDays(endDate, startDate) + 1

  // Aktive Tage berechnen
  const activeDaysSet = new Set<string>()
  periodEntries.forEach((entry) => {
    const dateStr = new Date(entry.datum).toDateString()
    activeDaysSet.add(dateStr)
  })
  const activeDays = activeDaysSet.size

  // Tags zählen
  const tagCounts: Record<string, number> = {}
  periodEntries.forEach((entry) => {
    if (entry.tags) {
      entry.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    }
  })

  const topTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Stimmungen zählen
  const moodCounts: Record<string, number> = {}
  periodEntries.forEach((entry) => {
    if (entry.mood) {
      const moods = Array.isArray(entry.mood) ? entry.mood : [entry.mood]
      moods.forEach((mood) => {
        moodCounts[mood] = (moodCounts[mood] || 0) + 1
      })
    }
  })

  const topMoods = Object.entries(moodCounts)
    .map(([mood, count]) => ({ mood, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)

  // Streaks berechnen (vereinfachte Version)
  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0

  // Sortiere Einträge nach Datum
  const sortedEntries = [...periodEntries].sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime())

  // Berechne Streaks
  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)

    const hasEntryForDay = sortedEntries.some((entry) => isSameDay(new Date(entry.datum), currentDate))

    if (hasEntryForDay) {
      tempStreak++
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak
      }
    } else {
      tempStreak = 0
    }
  }

  // Aktuelle Streak berechnen
  const today = new Date()
  let dayCounter = 0
  currentStreak = 0

  while (true) {
    const checkDate = new Date()
    checkDate.setDate(today.getDate() - dayCounter)

    if (checkDate < startDate) break

    const hasEntryForDay = entries.some((entry) => isSameDay(new Date(entry.datum), checkDate))

    if (hasEntryForDay) {
      currentStreak++
    } else {
      break
    }

    dayCounter++
  }

  return {
    totalEntries: periodEntries.length,
    entriesPerDay: periodEntries.length / totalDays,
    activeDays,
    topTags,
    topMoods,
    longestStreak,
    currentStreak,
  }
}

// Generiert Insights für einen bestimmten Zeitraum
export function generatePeriodInsights(
  entries: XPEintrag[],
  startDate: Date,
  endDate: Date,
): {
  summary: string
  statistics: ReturnType<typeof calculatePeriodStatistics>
  tips: string[]
} {
  const stats = calculatePeriodStatistics(entries, startDate, endDate)

  // Formatiere Datumsbereich
  const formattedStartDate = format(startDate, "dd. MMMM", { locale: de })
  const formattedEndDate = format(endDate, "dd. MMMM yyyy", { locale: de })

  // Erstelle Zusammenfassung
  let summary = `Vom ${formattedStartDate} bis ${formattedEndDate} hast du ${stats.totalEntries} Einträge an ${stats.activeDays} Tagen verfasst.`

  if (stats.topMoods.length > 0) {
    const topMood = stats.topMoods[0]
    summary += ` Deine häufigste Stimmung war "${topMood.mood}" (${topMood.count}x).`
  }

  if (stats.topTags.length > 0) {
    const topTag = stats.topTags[0]
    summary += ` Das häufigste Thema war "${topTag.tag}" (${topTag.count}x).`
  }

  // Erstelle Tipps
  const tips: string[] = []

  if (stats.activeDays < 3) {
    tips.push("Versuche, regelmäßiger Einträge zu verfassen, um deine Erfahrungen besser zu dokumentieren.")
  }

  if (stats.entriesPerDay < 0.5) {
    tips.push("Tägliche kurze Einträge können dir helfen, deine Gedanken und Erfahrungen besser zu reflektieren.")
  }

  if (stats.currentStreak > 0) {
    tips.push(`Großartig! Du hast eine aktuelle Streak von ${stats.currentStreak} Tagen. Halte sie aufrecht!`)
  } else {
    tips.push("Starte eine neue Streak, indem du heute einen Eintrag verfasst.")
  }

  if (stats.topTags.length < 3) {
    tips.push("Verwende mehr Tags, um deine Einträge besser zu kategorisieren und Muster zu erkennen.")
  }

  return {
    summary,
    statistics: stats,
    tips: tips.slice(0, 3), // Maximal 3 Tipps
  }
}

// Generiert wöchentliche Insights
export function generateWeeklyInsights(entries: XPEintrag[]): ReturnType<typeof generatePeriodInsights> {
  const today = new Date()
  const startOfLastWeek = startOfWeek(today, { weekStartsOn: 1 })
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7) // Eine Woche zurück
  const endOfLastWeek = endOfWeek(startOfLastWeek, { weekStartsOn: 1 })

  return generatePeriodInsights(entries, startOfLastWeek, endOfLastWeek)
}
