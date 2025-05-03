"use client"

import type React from "react"

import { useState, useEffect, useContext } from "react"
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Benachrichtigungen } from "@/components/nachrichten/benachrichtigungen"
import { NachrichtenButton } from "@/components/nachrichten/nachrichten-button"
import { ErlebnisWizardContext } from "@/components/erlebnis-wizard-modal"
import {
  Search,
  Menu,
  Plus,
  Crown,
  Settings,
  BarChart2,
  Home,
  Book,
  Compass,
  Activity,
  TrendingUp,
  Hash,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getCurrentUser } from "@/lib/mock-users"
import { getTotalUnreadMessages } from "@/lib/mock-messages"
import { mockUsers } from "@/lib/mock-users"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const pathname = usePathname()
  const router = useRouter()
  const currentUser = getCurrentUser()
  const currentUsername = currentUser?.username || "demo-user"

  // Sicherer Zugriff auf den ErlebnisWizardContext
  const erlebnisWizardContext = useContext(ErlebnisWizardContext)
  const openWizard = () => {
    if (erlebnisWizardContext) {
      erlebnisWizardContext.openWizard()
    } else {
      console.warn("ErlebnisWizardContext ist nicht verfügbar")
    }
  }

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
    console.log("Navbar: Öffne ErlebnisWizard")
    openWizard()
  }

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log("Navigiere zum Profil von:", currentUsername)

    // Überprüfen, ob der Benutzer existiert
    const user = mockUsers.find((u) => u.username.toLowerCase() === currentUsername.toLowerCase())
    if (user) {
      router.push(`/profil/${encodeURIComponent(user.username)}`)
    } else {
      console.error("Benutzer nicht gefunden:", currentUsername)
      // Fallback auf den ersten verfügbaren Benutzer
      if (mockUsers.length > 0) {
        router.push(`/profil/${encodeURIComponent(mockUsers[0].username)}`)
      } else {
        alert("Keine Benutzer verfügbar. Bitte überprüfen Sie die Mock-Daten.")
      }
    }
  }

  // Temporär: Füge eine Admin-Rolle zum aktuellen Benutzer hinzu
  useEffect(() => {
    if (currentUser) {
      // @ts-ignore - Wir fügen temporär eine Rolle hinzu
      currentUser.role = "admin"
    }
  }, [currentUser])

  const isAdmin = currentUser?.role === "admin"

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-200",
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-background",
      )}
    >
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Linke Seite - Logo und Mobile Menu */}
        <div className="flex items-center mr-4">
          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden mr-2">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menü öffnen</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="py-4">
                  <Link href="/dashboard" className="flex items-center mb-6">
                    <span className="font-bold text-xl">XP-Share</span>
                  </Link>
                  <nav className="flex flex-col gap-1">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Home className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/insights"
                      className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <TrendingUp className="h-4 w-4" />
                      <span>Insights & Trends</span>
                    </Link>
                    <Link
                      href="/entdecken"
                      className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Compass className="h-4 w-4" />
                      <span>Entdecken</span>
                    </Link>
                    <Link
                      href="/dashboard?tab=meine-erlebnisse"
                      className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Activity className="h-4 w-4" />
                      <span>Meine Erlebnisse</span>
                    </Link>
                    <Link
                      href="/channels"
                      className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Hash className="h-4 w-4" />
                      <span>Channels</span>
                    </Link>
                    <Link
                      href="/xp-buch"
                      className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Book className="h-4 w-4" />
                      <span>XP-Buch</span>
                    </Link>
                    <Link
                      href="/pricing"
                      className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Crown className="h-4 w-4" />
                      <span>Premium & Preise</span>
                    </Link>
                    <Link
                      href="/einstellungen"
                      className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Einstellungen</span>
                    </Link>

                    {isAdmin && (
                      <>
                        <div className="px-4 py-2 mt-4">
                          <div className="text-xs font-semibold text-muted-foreground">Admin-Bereich</div>
                          <div className="h-px bg-border mt-1"></div>
                        </div>
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                        <Link
                          href="/admin/tracking"
                          className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <BarChart2 className="h-4 w-4" />
                          <span>Tracking & Metriken</span>
                        </Link>
                      </>
                    )}
                  </nav>
                </div>

                <div className="mt-auto border-t pt-4">
                  <div
                    className="flex items-center gap-3 px-4 py-2 cursor-pointer"
                    onClick={(e) => {
                      handleProfileClick(e)
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={mockUsers.find((u) => u.username === currentUsername)?.avatar || "/placeholder.svg"}
                        alt={currentUsername}
                      />
                      <AvatarFallback>{currentUsername.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{currentUser?.name}</p>
                      <p className="text-xs text-muted-foreground">@{currentUsername}</p>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-bold text-xl">XP-Share</span>
          </Link>
        </div>

        {/* Mitte - Suchleiste */}
        <div className="flex-1 flex justify-center px-4">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Suchen..." className="pl-10 w-full" aria-label="Suche in XP-Share" />
          </div>
        </div>

        {/* Rechte Seite - Aktionsbuttons */}
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex items-center gap-2"
            onClick={handleNewExperience}
          >
            <Plus className="h-4 w-4" />
            <span>Erlebnis teilen</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={handleNewExperience}
            aria-label="Erlebnis teilen"
          >
            <Plus className="h-5 w-5" />
          </Button>

          {/* Premium Button hinzufügen */}
          <Button
            variant="default"
            size="sm"
            className="hidden md:flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
            onClick={() => router.push("/pricing")}
          >
            <Crown className="h-4 w-4" />
            <span>Premium</span>
          </Button>

          <Benachrichtigungen />

          <NachrichtenButton />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="Benutzerprofil und Einstellungen"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={mockUsers.find((u) => u.username === currentUsername)?.avatar || "/placeholder.svg"}
                    alt={currentUsername}
                  />
                  <AvatarFallback>{currentUsername.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background">
              <DropdownMenuLabel>Mein Konto</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/">Startseite</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleProfileClick}>Profil</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/xp-buch">XP-Buch</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/pricing">Premium & Preise</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/einstellungen">Einstellungen</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings/subscription">Abo verwalten</Link>
              </DropdownMenuItem>
              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Administration</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/tracking">Tracking & Metriken</Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/">Abmelden</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
