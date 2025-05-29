"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import {
  type AuthSession,
  type AuthUser,
  type UserProfile,
  getCurrentSession,
  getCurrentUser,
  getUserProfile,
  signIn,
  signOut,
  signUp,
  updatePassword,
  updateUserProfile,
  updateUserPreferences,
} from "@/lib/supabase-auth"

interface AuthContextType {
  user: AuthUser | null
  profile: UserProfile | null
  session: AuthSession | null
  isLoading: boolean
  isAuthenticated: boolean
  signUp: (email: string, password: string, username: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  updatePreferences: (preferences: any) => Promise<void>
  updatePassword: (password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUserData() {
      try {
        setIsLoading(true)
        const session = await getCurrentSession()
        setSession(session)

        if (session) {
          const user = await getCurrentUser()
          setUser(user)

          if (user) {
            const profile = await getUserProfile(user.id)
            setProfile(profile)
          }
        }
      } catch (error) {
        console.error("Fehler beim Laden der Benutzerdaten:", error)
        toast({
          title: "Fehler",
          description: "Beim Laden deiner Benutzerdaten ist ein Fehler aufgetreten.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [])

  const handleSignUp = async (email: string, password: string, username: string) => {
    try {
      setIsLoading(true)
      await signUp(email, password, username)
      toast({
        title: "Registrierung erfolgreich",
        description: "Dein Konto wurde erfolgreich erstellt. Bitte überprüfe deine E-Mails für die Bestätigung.",
      })
      router.push("/login")
    } catch (error: any) {
      console.error("Fehler bei der Registrierung:", error)
      toast({
        title: "Registrierung fehlgeschlagen",
        description: error.message || "Bei der Registrierung ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const { session, user } = await signIn(email, password)
      setSession(session)
      setUser(user)

      if (user) {
        const profile = await getUserProfile(user.id)
        setProfile(profile)
      }

      toast({
        title: "Anmeldung erfolgreich",
        description: "Du bist jetzt angemeldet.",
      })
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Fehler bei der Anmeldung:", error)
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: error.message || "Bei der Anmeldung ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      await signOut()
      setUser(null)
      setProfile(null)
      setSession(null)
      toast({
        title: "Abmeldung erfolgreich",
        description: "Du wurdest erfolgreich abgemeldet.",
      })
      router.push("/")
    } catch (error: any) {
      console.error("Fehler bei der Abmeldung:", error)
      toast({
        title: "Abmeldung fehlgeschlagen",
        description: error.message || "Bei der Abmeldung ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return

    try {
      setIsLoading(true)
      const updatedProfile = await updateUserProfile(user.id, updates)
      setProfile(updatedProfile)
      toast({
        title: "Profil aktualisiert",
        description: "Dein Profil wurde erfolgreich aktualisiert.",
      })
    } catch (error: any) {
      console.error("Fehler beim Aktualisieren des Profils:", error)
      toast({
        title: "Aktualisierung fehlgeschlagen",
        description: error.message || "Beim Aktualisieren deines Profils ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePreferences = async (preferences: any) => {
    if (!user) return

    try {
      setIsLoading(true)
      const updatedProfile = await updateUserPreferences(user.id, preferences)
      setProfile(updatedProfile)
      toast({
        title: "Einstellungen aktualisiert",
        description: "Deine Einstellungen wurden erfolgreich aktualisiert.",
      })
    } catch (error: any) {
      console.error("Fehler beim Aktualisieren der Einstellungen:", error)
      toast({
        title: "Aktualisierung fehlgeschlagen",
        description: error.message || "Beim Aktualisieren deiner Einstellungen ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePassword = async (password: string) => {
    try {
      setIsLoading(true)
      await updatePassword(password)
      toast({
        title: "Passwort aktualisiert",
        description: "Dein Passwort wurde erfolgreich aktualisiert.",
      })
    } catch (error: any) {
      console.error("Fehler beim Aktualisieren des Passworts:", error)
      toast({
        title: "Aktualisierung fehlgeschlagen",
        description: error.message || "Beim Aktualisieren deines Passworts ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    profile,
    session,
    isLoading,
    isAuthenticated: !!user,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    updateProfile: handleUpdateProfile,
    updatePreferences: handleUpdatePreferences,
    updatePassword: handleUpdatePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth muss innerhalb eines AuthProviders verwendet werden")
  }
  return context
}
