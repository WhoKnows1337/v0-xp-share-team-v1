"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { VercelButton } from "@/components/ui/vercel-button"
import { Bell, Search, User, Menu, X } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Erlebnisse", href: "/erlebnisse" },
  { name: "Community", href: "/community" },
  { name: "Entdecken", href: "/entdecken" },
]

export function VercelNavbar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">XP</span>
              </div>
              <span className="font-semibold text-lg">XP Share</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            <VercelButton variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </VercelButton>
            <VercelButton variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </VercelButton>

            {user ? (
              <div className="flex items-center space-x-2">
                <VercelButton variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                </VercelButton>
                <VercelButton variant="outline" size="sm" onClick={() => signOut()}>
                  Abmelden
                </VercelButton>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <VercelButton variant="ghost" size="sm" asChild>
                  <Link href="/anmelden">Anmelden</Link>
                </VercelButton>
                <VercelButton variant="vercel" size="sm" asChild>
                  <Link href="/registrieren">Registrieren</Link>
                </VercelButton>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <VercelButton variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </VercelButton>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t bg-background">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 pb-3 border-t border-border">
              {user ? (
                <VercelButton variant="outline" className="w-full" onClick={() => signOut()}>
                  Abmelden
                </VercelButton>
              ) : (
                <div className="space-y-2">
                  <VercelButton variant="ghost" className="w-full" asChild>
                    <Link href="/anmelden">Anmelden</Link>
                  </VercelButton>
                  <VercelButton variant="vercel" className="w-full" asChild>
                    <Link href="/registrieren">Registrieren</Link>
                  </VercelButton>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
