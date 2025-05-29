"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase-client"
import type { User } from "@/lib/mock-users"
import { useToast } from "@/hooks/use-toast"

export function useUserProfile(username?: string) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()
  const supabase = createClient()

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true)

      let query = supabase.from("profiles").select(`
          *,
          experiences:experiences(count),
          followers:follows!following_id(count),
          following:follows!follower_id(count)
        `)

      if (username) {
        query = query.eq("username", username).single()
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error("Nicht authentifiziert")
        query = query.eq("id", user.id).single()
      }

      const { data, error } = await query

      if (error) throw error

      setUser(data as any)
      setError(null)
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Fehler beim Laden",
        description: "Das Benutzerprofil konnte nicht geladen werden.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [username, supabase, toast])

  useEffect(() => {
    fetchUserProfile()
  }, [fetchUserProfile])

  const updateProfile = useCallback(
    async (updates: Partial<User>) => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error("Nicht authentifiziert")

        const { error } = await supabase.from("profiles").update(updates).eq("id", user.id)

        if (error) throw error

        toast({
          title: "Erfolgreich aktualisiert",
          description: "Dein Profil wurde erfolgreich aktualisiert.",
        })

        await fetchUserProfile()
      } catch (err) {
        toast({
          title: "Fehler beim Aktualisieren",
          description: "Das Profil konnte nicht aktualisiert werden.",
          variant: "destructive",
        })
        throw err
      }
    },
    [supabase, toast, fetchUserProfile],
  )

  return {
    user,
    loading,
    error,
    refetch: fetchUserProfile,
    updateProfile,
  }
}
