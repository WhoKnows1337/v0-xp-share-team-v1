"use client"

import type React from "react"

import { createContext, useContext, useReducer, useMemo, useCallback } from "react"
import type { XPEintrag, XPStatistik } from "@/types/xp-eintrag"
import { mockXPEintraege, calculateStreak, calculateTopTags, calculateMoodDistribution } from "@/lib/mock-xp-eintraege"

// Define action types
type ActionType =
  | { type: "ADD_ENTRY"; payload: XPEintrag }
  | { type: "UPDATE_ENTRY"; payload: { id: string; data: Partial<XPEintrag> } }
  | { type: "DELETE_ENTRY"; payload: string }
  | {
      type: "SET_FILTER"
      payload: {
        tag?: string
        dateRange?: [Date, Date]
        mood?: string
        category?: string
        location?: string
        searchTerm?: string
      }
    }

// Define state type
interface XPBuchState {
  entries: XPEintrag[]
  filteredEntries: XPEintrag[]
  statistics: XPStatistik
  filters: {
    tag?: string
    dateRange?: [Date, Date]
    mood?: string
    category?: string
    location?: string
    searchTerm?: string
  }
}

// Create initial state
const initialState: XPBuchState = {
  entries: mockXPEintraege,
  filteredEntries: mockXPEintraege,
  statistics: {
    streak: calculateStreak(),
    längsteStreak: 14,
    gesamtEinträge: mockXPEintraege.length,
    einträgeProWoche: Math.round(mockXPEintraege.length / 4),
    moodVerteilung: calculateMoodDistribution(),
    häufigeSymbole: [],
    häufigeTags: calculateTopTags(5),
    täglichesZiel: 1,
    täglichesZielErreicht: true,
  },
  filters: {},
}

// Create reducer
function xpBuchReducer(state: XPBuchState, action: ActionType): XPBuchState {
  switch (action.type) {
    case "ADD_ENTRY":
      return {
        ...state,
        entries: [action.payload, ...state.entries],
        filteredEntries: applyFilters([action.payload, ...state.entries], state.filters),
        statistics: recalculateStatistics([action.payload, ...state.entries]),
      }
    case "UPDATE_ENTRY": {
      const updatedEntries = state.entries.map((entry) =>
        entry.id === action.payload.id ? { ...entry, ...action.payload.data } : entry,
      )
      return {
        ...state,
        entries: updatedEntries,
        filteredEntries: applyFilters(updatedEntries, state.filters),
        statistics: recalculateStatistics(updatedEntries),
      }
    }
    case "DELETE_ENTRY": {
      const filteredEntries = state.entries.filter((entry) => entry.id !== action.payload)
      return {
        ...state,
        entries: filteredEntries,
        filteredEntries: applyFilters(filteredEntries, state.filters),
        statistics: recalculateStatistics(filteredEntries),
      }
    }
    case "SET_FILTER":
      const newFilters = { ...state.filters, ...action.payload }
      return {
        ...state,
        filters: newFilters,
        filteredEntries: applyFilters(state.entries, newFilters),
      }
    default:
      return state
  }
}

// Helper functions
function applyFilters(entries: XPEintrag[], filters: XPBuchState["filters"]): XPEintrag[] {
  return entries.filter((entry) => {
    // Tag filter
    if (filters.tag && filters.tag !== "all" && (!entry.tags || !entry.tags.includes(filters.tag))) {
      return false
    }

    // Date range filter
    if (filters.dateRange) {
      const entryDate = new Date(entry.datum)
      if (entryDate < filters.dateRange[0] || entryDate > filters.dateRange[1]) {
        return false
      }
    }

    // Mood filter
    if (filters.mood && filters.mood !== "all") {
      if (Array.isArray(entry.mood)) {
        if (!entry.mood.includes(filters.mood as any)) {
          return false
        }
      } else if (entry.mood !== filters.mood) {
        return false
      }
    }

    // Category filter
    if (filters.category && filters.category !== "all" && entry.kategorie !== filters.category) {
      return false
    }

    // Location filter
    if (filters.location && filters.location !== "all" && entry.ort !== filters.location) {
      return false
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      const titleMatch = entry.titel.toLowerCase().includes(searchLower)
      const contentMatch = entry.inhalt.toLowerCase().includes(searchLower)
      const tagsMatch = entry.tags?.some((tag) => tag.toLowerCase().includes(searchLower)) || false

      if (!titleMatch && !contentMatch && !tagsMatch) {
        return false
      }
    }

    return true
  })
}

function recalculateStatistics(entries: XPEintrag[]): XPStatistik {
  // This would be a more complex calculation in a real app
  // For now, we'll just update the basic stats
  return {
    streak: calculateStreak(),
    längsteStreak: 14,
    gesamtEinträge: entries.length,
    einträgeProWoche: Math.round(entries.length / 4),
    moodVerteilung: calculateMoodDistribution(),
    häufigeSymbole: [],
    häufigeTags: calculateTopTags(5),
    täglichesZiel: 1,
    täglichesZielErreicht: true,
  }
}

// Create context
interface XPBuchContextType {
  state: XPBuchState
  addEntry: (entry: XPEintrag) => void
  updateEntry: (id: string, data: Partial<XPEintrag>) => void
  deleteEntry: (id: string) => void
  setFilter: (filter: Partial<XPBuchState["filters"]>) => void
}

const XPBuchContext = createContext<XPBuchContextType | undefined>(undefined)

// Create provider
export function XPBuchProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(xpBuchReducer, initialState)

  const addEntry = useCallback((entry: XPEintrag) => {
    dispatch({ type: "ADD_ENTRY", payload: entry })
  }, [])

  const updateEntry = useCallback((id: string, data: Partial<XPEintrag>) => {
    dispatch({ type: "UPDATE_ENTRY", payload: { id, data } })
  }, [])

  const deleteEntry = useCallback((id: string) => {
    dispatch({ type: "DELETE_ENTRY", payload: id })
  }, [])

  const setFilter = useCallback((filter: Partial<XPBuchState["filters"]>) => {
    dispatch({ type: "SET_FILTER", payload: filter })
  }, [])

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      state,
      addEntry,
      updateEntry,
      deleteEntry,
      setFilter,
    }),
    [state, addEntry, updateEntry, deleteEntry, setFilter],
  )

  return <XPBuchContext.Provider value={value}>{children}</XPBuchContext.Provider>
}

// Create hook for using the context
export function useXPBuch() {
  const context = useContext(XPBuchContext)
  if (context === undefined) {
    throw new Error("useXPBuch must be used within a XPBuchProvider")
  }
  return context
}
