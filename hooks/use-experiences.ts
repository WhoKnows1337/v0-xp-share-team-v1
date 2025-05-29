"use client"

import { useState, useEffect, useCallback } from "react"
import { experienceService } from "@/lib/experience-service"
import type { Experience } from "@/types/erlebnis"
import { useToast } from "@/hooks/use-toast"

export function useExperiences(options?: {
  limit?: number
  offset?: number
  category?: string
  search?: string
}) {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  const fetchExperiences = useCallback(async () => {
    try {
      setLoading(true)
      const data = await experienceService.getAll(options)
      setExperiences(data)
      setError(null)
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Fehler beim Laden",
        description: "Die Erlebnisse konnten nicht geladen werden.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [options, toast])

  useEffect(() => {
    fetchExperiences()
  }, [fetchExperiences])

  return {
    experiences,
    loading,
    error,
    refetch: fetchExperiences,
  }
}

export function useExperience(id: string) {
  const [experience, setExperience] = useState<Experience | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  const fetchExperience = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      const data = await experienceService.getById(id)
      setExperience(data)
      setError(null)
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Fehler beim Laden",
        description: "Das Erlebnis konnte nicht geladen werden.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [id, toast])

  useEffect(() => {
    fetchExperience()
  }, [fetchExperience])

  const updateExperience = useCallback(
    async (data: Partial<Experience>) => {
      if (!id) return

      try {
        const updated = await experienceService.update(id, data)
        setExperience(updated)
        toast({
          title: "Erfolgreich aktualisiert",
          description: "Das Erlebnis wurde erfolgreich aktualisiert.",
        })
        return updated
      } catch (err) {
        toast({
          title: "Fehler beim Aktualisieren",
          description: "Das Erlebnis konnte nicht aktualisiert werden.",
          variant: "destructive",
        })
        throw err
      }
    },
    [id, toast],
  )

  const deleteExperience = useCallback(async () => {
    if (!id) return

    try {
      await experienceService.delete(id)
      toast({
        title: "Erfolgreich gelöscht",
        description: "Das Erlebnis wurde erfolgreich gelöscht.",
      })
    } catch (err) {
      toast({
        title: "Fehler beim Löschen",
        description: "Das Erlebnis konnte nicht gelöscht werden.",
        variant: "destructive",
      })
      throw err
    }
  }, [id, toast])

  return {
    experience,
    loading,
    error,
    refetch: fetchExperience,
    updateExperience,
    deleteExperience,
  }
}

export function useCreateExperience() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const createExperience = useCallback(
    async (data: Partial<Experience>) => {
      try {
        setLoading(true)
        const created = await experienceService.create(data)
        toast({
          title: "Erfolgreich erstellt",
          description: "Das Erlebnis wurde erfolgreich erstellt.",
        })
        return created
      } catch (err) {
        toast({
          title: "Fehler beim Erstellen",
          description: "Das Erlebnis konnte nicht erstellt werden.",
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
    createExperience,
    loading,
  }
}
