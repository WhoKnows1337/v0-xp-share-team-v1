"use client"

import { useEffect, useState } from "react"
import { findUserByUsername } from "@/lib/user-utils"
import { BenutzerProfil as ProfilKomponente } from "@/components/profil/benutzer-profil"
import { useRouter } from "next/navigation"

interface BenutzerProfilProps {
  username: string
}

export function BenutzerProfil({ username }: BenutzerProfilProps) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Simuliere API-Aufruf mit einer kleinen Verzögerung
    const timer = setTimeout(() => {
      try {
        const foundUser = findUserByUsername(username)
        if (foundUser) {
          setUser(foundUser)
        } else {
          setError(`Benutzer "${username}" wurde nicht gefunden.`)
        }
      } catch (err) {
        setError("Ein Fehler ist aufgetreten beim Laden des Benutzerprofils.")
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [username])

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center">
          <div className="animate-pulse">Profil wird geladen...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button onClick={() => router.push("/")} className="mt-2 text-sm underline hover:text-red-800">
            Zurück zur Startseite
          </button>
        </div>
      </div>
    )
  }

  return <ProfilKomponente user={user} />
}
