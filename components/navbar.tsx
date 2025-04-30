"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
import { openErlebnisWizard } from "@/components/erlebnis-wizard-modal"
import { Search, Menu, Plus, PanelLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { getCurrentUser } from "@/lib/mock-users"
import { getTotalUnreadMessages } from "@/lib/mock-messages"
import { mockUsers } from "@/lib/mock-users"
import { useSidebar } from "@/contexts/sidebar-context"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const pathname = usePathname()
  const currentUser = getCurrentUser()
  const currentUsername = currentUser.username
  const { sidebarVisible, toggleSidebar } = useSidebar()

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
    openErlebnisWizard()
  }

  const handleToggleSidebar = () => {
    console.log("Toggle sidebar, current state:", sidebarVisible)
    toggleSidebar()
  }

  // Auf der Startseite nicht anzeigen
  if (pathname === "/") {
    return null
  }

  const showSidebarToggle = pathname.includes("/dashboard") || pathname.includes("/insights")

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-background",
      )}
    >
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Linke Seite - Logo und Mobile Menu */}
        <div className="flex items-center mr-4">
          {/* Hamburger für Sidebar Toggle - nur auf bestimmten Seiten anzeigen */}
          {showSidebarToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleSidebar}
              className="mr-2"
              aria-label={sidebarVisible ? "Seitenleiste ausblenden" : "Seitenleiste einblenden"}
              aria-expanded={sidebarVisible}
            >
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Seitenleiste {sidebarVisible ? "ausblenden" : "einblenden"}</span>
            </Button>
          )}

          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden mr-2">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menü öffnen</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/insights"
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Insights & Trends</span>
                </Link>
                <Link
                  href="/entdecken"
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Entdecken</span>
                </Link>
              </nav>
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
                <Link href={`/profil/${encodeURIComponent(currentUsername)}`}>Profil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/einstellungen">Einstellungen</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Abmelden</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
