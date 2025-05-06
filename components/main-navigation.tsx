"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, MessageSquare, Book, Settings, Users, Compass, BarChart } from "lucide-react"
import { cn } from "@/lib/utils"

export function MainNavigation() {
  const pathname = usePathname()

  const links = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Entdecken",
      href: "/entdecken",
      icon: Search,
    },
    {
      name: "Nexus",
      href: "/nexus",
      icon: Compass,
    },
    {
      name: "Nachrichten",
      href: "/nachrichten",
      icon: MessageSquare,
    },
    {
      name: "XP-Buch",
      href: "/xp-buch",
      icon: Book,
    },
    {
      name: "Community",
      href: "/community",
      icon: Users,
    },
    {
      name: "Insights",
      href: "/insights",
      icon: BarChart,
    },
    {
      name: "Einstellungen",
      href: "/einstellungen",
      icon: Settings,
    },
  ]

  return (
    <nav className="h-screen w-16 md:w-64 bg-background border-r border-border flex flex-col">
      <div className="p-4 flex items-center justify-center md:justify-start">
        <Link href="/" className="text-xl font-bold text-primary">
          <span className="hidden md:inline">XP Share</span>
          <span className="md:hidden">XP</span>
        </Link>
      </div>
      <div className="flex-1 py-8">
        <ul className="space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg mx-2 transition-colors",
                    {
                      "bg-secondary text-primary": isActive,
                      "hover:text-cyan-400": link.name === "Nexus",
                    },
                  )}
                >
                  <link.icon
                    className={cn("h-5 w-5 mr-3", {
                      "text-cyan-400": link.name === "Nexus" && (isActive || pathname.includes("hover")),
                    })}
                  />
                  <span className="hidden md:inline">{link.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
