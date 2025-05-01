import type { XPEintrag } from "@/types/xp-eintrag"

// Hilfsfunktion zum Prüfen, ob zwei Daten aufeinanderfolgende Tage sind
function areConsecutiveDays(date1: Date, date2: Date): boolean {
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays === 1
}

// Hilfsfunktion zum Prüfen, ob ein Datum heute ist
function isToday(date: Date): boolean {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

// Hilfsfunktion zum Prüfen, ob ein Datum gestern war
function isYesterday(date: Date): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  )
}

// Berechnet den aktuellen Streak basierend auf den Einträgen
export function calculateCurrentStreak(entries: XPEintrag[] = []): number {
  if (!entries || !entries.length) return 0

  // Sortiere Einträge nach Datum (neueste zuerst)
  const sortedEntries = [...entries].sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime())

  // Gruppiere Einträge nach Datum (ein Eintrag pro Tag)
  const entriesByDate = new Map<string, XPEintrag>()
  sortedEntries.forEach((entry) => {
    const dateStr = new Date(entry.datum).toDateString()
    if (!entriesByDate.has(dateStr)) {
      entriesByDate.set(dateStr, entry)
    }
  })

  // Konvertiere Map zu Array und sortiere nach Datum (neueste zuerst)
  const uniqueDateEntries = Array.from(entriesByDate.values()).sort(
    (a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime(),
  )

  if (!uniqueDateEntries.length) return 0

  // Prüfe, ob der neueste Eintrag von heute oder gestern ist
  const latestEntryDate = new Date(uniqueDateEntries[0].datum)
  if (!isToday(latestEntryDate) && !isYesterday(latestEntryDate)) {
    return 0 // Streak ist gebrochen, wenn der letzte Eintrag älter als gestern ist
  }

  // Berechne den Streak
  let streak = 1
  let currentDate = latestEntryDate

  for (let i = 1; i < uniqueDateEntries.length; i++) {
    const entryDate = new Date(uniqueDateEntries[i].datum)
    const expectedPrevDate = new Date(currentDate)
    expectedPrevDate.setDate(expectedPrevDate.getDate() - 1)

    if (entryDate.toDateString() === expectedPrevDate.toDateString()) {
      streak++
      currentDate = entryDate
    } else {
      break // Streak ist gebrochen
    }
  }

  return streak
}

// Berechnet den längsten Streak in der Historie
export function calculateLongestStreak(entries: XPEintrag[] = []): number {
  if (!entries || !entries.length) return 0

  // Sortiere Einträge nach Datum (älteste zuerst)
  const sortedEntries = [...entries].sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime())

  // Gruppiere Einträge nach Datum (ein Eintrag pro Tag)
  const entriesByDate = new Map<string, XPEintrag>()
  sortedEntries.forEach((entry) => {
    const dateStr = new Date(entry.datum).toDateString()
    if (!entriesByDate.has(dateStr)) {
      entriesByDate.set(dateStr, entry)
    }
  })

  // Konvertiere Map zu Array und sortiere nach Datum (älteste zuerst)
  const uniqueDateEntries = Array.from(entriesByDate.values()).sort(
    (a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime(),
  )

  if (!uniqueDateEntries.length) return 0

  let currentStreak = 1
  let longestStreak = 1

  for (let i = 1; i < uniqueDateEntries.length; i++) {
    const currentDate = new Date(uniqueDateEntries[i].datum)
    const prevDate = new Date(uniqueDateEntries[i - 1].datum)

    if (areConsecutiveDays(prevDate, currentDate)) {
      currentStreak++
      longestStreak = Math.max(longestStreak, currentStreak)
    } else {
      currentStreak = 1
    }
  }

  return longestStreak
}

// Prüft, ob das tägliche Ziel erreicht wurde
export function isDailyGoalAchieved(entries: XPEintrag[] = [], goal: number): boolean {
  if (!entries) return false

  const today = new Date()
  const todayEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.datum)
    return isToday(entryDate)
  })

  return todayEntries.length >= goal
}

// Berechnet die durchschnittliche Anzahl von Einträgen pro Woche
export function calculateEntriesPerWeek(entries: XPEintrag[] = []): number {
  if (!entries || !entries.length) return 0

  // Sortiere Einträge nach Datum
  const sortedEntries = [...entries].sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime())

  // Berechne die Anzahl der Wochen zwischen dem ersten und letzten Eintrag
  const firstEntryDate = new Date(sortedEntries[0].datum)
  const lastEntryDate = new Date(sortedEntries[sortedEntries.length - 1].datum)

  const diffTime = Math.abs(lastEntryDate.getTime() - firstEntryDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const diffWeeks = Math.max(1, Math.ceil(diffDays / 7)) // Mindestens 1 Woche

  return Math.round((entries.length / diffWeeks) * 10) / 10 // Auf eine Dezimalstelle gerundet
}

// Füge die fehlende getStreakInfo Funktion hinzu
export function getStreakInfo(entries: XPEintrag[] = []) {
  if (!entries) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      isActive: false,
      isRecord: false,
    }
  }

  const currentStreak = calculateCurrentStreak(entries)
  const longestStreak = calculateLongestStreak(entries)

  return {
    currentStreak,
    longestStreak,
    isActive: currentStreak > 0,
    isRecord: currentStreak === longestStreak && longestStreak > 0,
  }
}
