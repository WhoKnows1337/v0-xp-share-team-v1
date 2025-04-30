"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle } from "lucide-react"
import { useOptionalProfile } from "@/contexts/profile-context"
import { findUserByUsername } from "@/lib/user-utils"
import { toast } from "@/components/ui/use-toast"

interface UserLinkProps {
  username: string
  avatar?: string
  isVerifiziert?: boolean
  size?: "sm" | "md" | "lg"
  showName?: boolean
}

export function UserLink({ username, avatar, isVerifiziert = false, size = "md", showName = true }: UserLinkProps) {
  const router = useRouter()
  const { context, isAvailable } = useOptionalProfile()

  const avatarSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  }

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  // Ändern Sie die getInitials Funktion, um mit undefined oder leeren Namen umzugehen
  const getInitials = (name: string | undefined) => {
    if (!name || name.length === 0) {
      return "U" // "U" für "User" als Fallback
    }
    return name.charAt(0).toUpperCase()
  }

  // Ändern Sie die handleClick Funktion, um mit Fallback-Benutzernamen umzugehen
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Überprüfen, ob es sich um einen Fallback-Benutzernamen handelt
    if (!username || username === "Unbekannt" || username === "Unbekannter Benutzer") {
      // Wenn es ein Fallback-Name ist, zeigen wir eine Benachrichtigung an
      toast({
        title: "Kein Benutzerprofil verfügbar",
        description: "Für diesen Eintrag ist kein Benutzerprofil verfügbar.",
        variant: "default",
      })
      return
    }

    // Überprüfen, ob der Benutzer existiert, bevor wir navigieren
    const user = findUserByUsername(username)
    if (user) {
      // Direkt zur Profilseite navigieren
      router.push(`/profil/${encodeURIComponent(username)}`)
    } else {
      console.error(`Benutzer ${username} nicht gefunden`)
      // Zeige eine Benachrichtigung an, dass der Benutzer nicht gefunden wurde
      toast({
        title: "Benutzer nicht gefunden",
        description: `Der Benutzer "${username}" konnte nicht gefunden werden.`,
        variant: "destructive",
      })
    }
  }

  // Stellen Sie sicher, dass username nicht undefined ist, bevor wir es verwenden
  const AvatarAndName = () => (
    <>
      <Avatar className={avatarSizes[size]}>
        <AvatarImage src={avatar || "/placeholder.svg"} alt={username || "Benutzer"} />
        <AvatarFallback>{getInitials(username)}</AvatarFallback>
      </Avatar>
      {showName && (
        <div className="flex items-center">
          <span className={`font-medium ${textSizes[size]}`}>{username || "Unbekannter Benutzer"}</span>
          {isVerifiziert && <CheckCircle className="h-3 w-3 ml-1 text-blue-500 fill-blue-500" />}
        </div>
      )}
    </>
  )

  // Verwende immer einen Button mit onClick für konsistentes Verhalten
  return (
    <button onClick={handleClick} className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left">
      <AvatarAndName />
    </button>
  )
}
