"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NachrichtenButton } from "@/components/nachrichten/nachrichten-button"
import {
  Crown,
  Settings,
  BarChart2,
  Home,
  Book,
  Compass,
  TrendingUp,
  Hash,
  PartyPopper,
  LogOut,
  User,
  Search,
  Plus,
} from "lucide-react"
import { getCurrentUser } from "@/lib/mock-users"
import { getTotalUnreadMessages } from "@/lib/mock-messages"
import { mockUsers } from "@/lib/mock-users"
import { Benachrichtigungen } from "@/components/nachrichten/benachrichtigungen"
import Image from "next/image"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const pathname = usePathname()
  const router = useRouter()
  const currentUser = getCurrentUser()
  const currentUsername = currentUser?.username || "demo-user"
  const isLoggedIn = true // Mock für den eingeloggten Zustand

  // Admin-Rolle sofort beim Laden der Seite zuweisen
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Sofort die Admin-Rolle setzen, nicht in einem useEffect mit Abhängigkeiten
    setIsAdmin(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Aktualisiere den Zähler für ungelesene Nachrichten
    const count = getTotalUnreadMessages(currentUser)
    setUnreadMessages(count)

    // In einer echten Anwendung würde hier ein Echtzeit-Update über WebSockets erfolgen
    const interval = setInterval(() => {
      const newCount = getTotalUnreadMessages(currentUser)
      setUnreadMessages(newCount)
    }, 30000) // Alle 30 Sekunden aktualisieren

    return () => clearInterval(interval)
  }, [currentUser])

  const handleNewExperience = () => {
    // Löse ein benutzerdefiniertes Event aus, um den Wizard zu öffnen
    const event = new CustomEvent("openErlebnisWizard")
    window.dispatchEvent(event)
  }

  const handleProfileClick = (username: string) => {
    // Überprüfen, ob der Benutzer existiert
    const user = mockUsers.find((u) => u.username.toLowerCase() === username.toLowerCase())
    if (user) {
      router.push(`/profil/${encodeURIComponent(user.username)}`)
    } else {
      console.error("Benutzer nicht gefunden:", username)
      // Fallback auf den ersten verfügbaren Benutzer
      if (mockUsers.length > 0) {
        router.push(`/profil/${encodeURIComponent(mockUsers[0].username)}`)
      } else {
        alert("Keine Benutzer verfügbar. Bitte überprüfen Sie die Mock-Daten.")
      }
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Linke Seite - Logo */}
        <div className="flex items-center">
          <Link href="/dashboard" className="flex items-center">
            {/* Logo korrigiert, nicht mehr gestaucht */}
            <Image src="/xp-share_logo.png" alt="XP Share Logo" width={40} height={40} className="w-auto h-10" />
          </Link>
        </div>

        {/* Mitte - Suchleiste */}
        <div className="flex-1 flex justify-center px-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Suchen..." className="pl-10 w-full" aria-label="Suche in XP-Share" />
          </div>
        </div>

        {/* Rechte Seite - Aktionsbuttons */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              {/* Freunde einladen Button - gleiche Höhe wie Erlebnis teilen */}
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex items-center gap-2"
                onClick={() => router.push("/referrals")}
              >
                <PartyPopper className="h-4 w-4" />
                <span>Freunde einladen</span>
              </Button>

              {/* Erlebnis teilen Button */}
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex items-center gap-2"
                onClick={handleNewExperience}
              >
                <Plus className="h-4 w-4" />
                <span>Erlebnis teilen</span>
              </Button>

              <NachrichtenButton />
              <Benachrichtigungen />

              {/* Premium Button - gleiche Höhe wie Erlebnis teilen */}
              <Button
                variant="default"
                size="sm"
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                onClick={() => router.push("/pricing")}
              >
                <Crown className="h-4 w-4" />
                <span>Premium</span>
              </Button>

              {/* Avatar mit Dropdown-Menü */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={currentUser?.avatar || "/placeholder.svg"}
                        alt={currentUser?.name || "Benutzer"}
                      />
                      <AvatarFallback>{currentUser?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">@{currentUsername}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleProfileClick(currentUsername)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                    <Home className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/entdecken")}>
                    <Compass className="mr-2 h-4 w-4" />
                    <span>Entdecken</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/xp-buch")}>
                    <Book className="mr-2 h-4 w-4" />
                    <span>XP-Buch</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/channels")}>
                    <Hash className="mr-2 h-4 w-4" />
                    <span>Channels</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/insights")}>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    <span>Insights</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/referrals")}>
                    <PartyPopper className="mr-2 h-4 w-4" />
                    <span>Freunde einladen</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/pricing")}>
                    <Crown className="mr-2 h-4 w-4" />
                    <span>Premium & Preise</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/settings/subscription")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Abo verwalten</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/einstellungen")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Einstellungen</span>
                  </DropdownMenuItem>

                  {/* Admin-Punkte immer anzeigen, da isAdmin jetzt sofort gesetzt wird */}
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Administration</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => router.push("/admin")}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/admin/tracking")}>
                        <BarChart2 className="mr-2 h-4 w-4" />
                        <span>Tracking & Metriken</span>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/")}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Abmelden</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Anmelden
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Registrieren</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
