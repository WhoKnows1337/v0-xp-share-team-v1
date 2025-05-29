"use client"

import { useState, useEffect, useCallback } from "react"
import { xpEntryService } from "@/lib/xp-entry-service"
import type { XPEintrag } from "@/types/xp-eintrag"
import { useToast } from "@/hooks/use-toast"

export function useXPEntries() {
  const [entries, setEntries] = useState<XPEintrag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true)
      const data = await xpEntryService.getAll()
      setEntries(data)
      setError(null)
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Fehler beim Laden",
        description: "Die XP-Einträge konnten nicht geladen werden.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  return {
    entries,
    loading,
    error,
    refetch: fetchEntries,
  }
}

export function useXPEntry(id: string) {
  const [entry, setEntry] = useState<XPEintrag | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  const fetchEntry = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      const data = await xpEntryService.getById(id)
      setEntry(data)
      setError(null)
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Fehler beim Laden",
        description: "Der XP-Eintrag konnte nicht geladen werden.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [id, toast])

  useEffect(() => {
    fetchEntry()
  }, [fetchEntry])

  const updateEntry = useCallback(
    async (data: Partial<XPEintrag>) => {
      if (!id) return

      try {
        const updated = await xpEntryService.update(id, data)
        setEntry(updated)
        toast({
          title: "Erfolgreich aktualisiert",
          description: "Der XP-Eintrag wurde erfolgreich aktualisiert.",
        })
        return updated
      } catch (err) {
        toast({
          title: "Fehler beim Aktualisieren",
          description: "Der XP-Eintrag konnte nicht aktualisiert werden.",
          variant: "destructive",
        })
        throw err
      }
    },
    [id, toast],
  )

  const deleteEntry = useCallback(async () => {
    if (!id) return

    try {
      await xpEntryService.delete(id)
      toast({
        title: "Erfolgreich gelöscht",
        description: "Der XP-Eintrag wurde erfolgreich gelöscht.",
      })
    } catch (err) {
      toast({
        title: "Fehler beim Löschen",
        description: "Der XP-Eintrag konnte nicht gelöscht werden.",
        variant: "destructive",
      })
      throw err
    }
  }, [id, toast])

  return {
    entry,
    loading,
    error,
    refetch: fetchEntry,
    updateEntry,
    deleteEntry,
  }
}

export function useCreateXPEntry() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const createEntry = useCallback(
    async (data: Partial<XPEintrag>) => {
      try {
        setLoading(true)
        const created = await xpEntryService.create(data)
        toast({
          title: "Erfolgreich erstellt",
          description: "Der XP-Eintrag wurde erfolgreich erstellt.",
        })
        return created
      } catch (err) {
        toast({
          title: "Fehler beim Erstellen",
          description: "Der XP-Eintrag konnte nicht erstellt werden.",
          variant: "destructive",
        })
        throw err
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  return {
    createEntry,
    loading,
  }
}
