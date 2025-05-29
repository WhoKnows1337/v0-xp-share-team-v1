"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import type {
  Session as AuthSession, // Renamed to avoid conflict
  User as AuthUser, // Renamed to avoid conflict
} from "@supabase/supabase-js"
import {
  type UserProfile, // This will be our detailed user profile type
  getCurrentSession,
  getCurrentUser,
  getUserProfile,
  signInWithEmailPassword, // Renamed for clarity
  signOutUser, // Renamed for clarity
  signUpUser, // Renamed for clarity
  updateUserPassword, // Renamed for clarity
  updateUserProfileDetails, // Renamed for clarity
  updateUserPreferencesDetails, // Renamed for clarity
} from "@/lib/supabase-auth" // Assuming functions are named this way

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
  updatePreferences: (preferences: any) => Promise<void> // Define 'any' more strictly if possible
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
        const currentSession = await getCurrentSession()
        setSession(currentSession)

        if (currentSession) {
          const currentUser = await getCurrentUser() // This gets the AuthUser
          setUser(currentUser)

          if (currentUser) {
            const userProfileData = await getUserProfile(currentUser.id) // This gets UserProfile
            setProfile(userProfileData)
          } else {
            setProfile(null) // No user, so no profile
          }
        } else {
          setUser(null)
          setProfile(null)
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
      const { user: signedUpUser, session: newSession } = await signUpUser(email, password, username)

      setUser(signedUpUser)
      setSession(newSession)
      if (signedUpUser) {
        const userProfileData = await getUserProfile(signedUpUser.id)
        setProfile(userProfileData)
      }

      toast({
        title: "Registrierung erfolgreich",
        description:
          "Dein Konto wurde erfolgreich erstellt. Bitte überprüfe deine E-Mails für die Bestätigung (falls nicht im Mock-Modus).",
      })
      // router.push("/login") // Or directly to dashboard if auto-login
      router.push("/dashboard")
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
      const { session: signedInSession, user: signedInUser } = await signInWithEmailPassword(email, password)
      setSession(signedInSession)
      setUser(signedInUser)

      if (signedInUser) {
        const userProfileData = await getUserProfile(signedInUser.id)
        setProfile(userProfileData)
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
      await signOutUser()
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
    if (!user || !profile) return // Need user.id for update, profile for optimistic update

    try {
      setIsLoading(true)
      const updatedProfile = await updateUserProfileDetails(user.id, updates)
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
    if (!user || !profile) return

    try {
      setIsLoading(true)
      // Assuming preferences are part of the UserProfile or a sub-object
      const updatedProfile = await updateUserPreferencesDetails(user.id, preferences)
      setProfile(updatedProfile) // Assuming this returns the full updated profile
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

  const handleUpdatePassword = async (newPassword: string) => {
    try {
      setIsLoading(true)
      await updateUserPassword(newPassword)
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
    isAuthenticated: !!user && !!session, // Check for session as well
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
