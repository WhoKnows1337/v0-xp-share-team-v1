"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Search,
  MessageSquare,
  Book,
  Settings,
  Users,
  Compass,
  BarChart,
  ChevronDown,
  ChevronRight,
  Brain,
  Bug,
  TestTube,
  Activity,
  Database,
  Zap,
  FileText,
  BarChart3,
  Settings2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

export function MainNavigation() {
  const pathname = usePathname()
  const [isAdminExpanded, setIsAdminExpanded] = useState(false)

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
      name: "Admin",
      href: "/admin",
      icon: Settings2,
      isExpandable: true,
      subLinks: [
        // KI-spezifische Seiten
        { name: "KI-Dashboard", href: "/ai-dashboard", icon: Brain },
        { name: "KI-Features", href: "/ai-features", icon: Zap },
        { name: "KI-Demo", href: "/ai-demo", icon: TestTube },
        // Debug & Entwicklung
        { name: "Benutzer-Test", href: "/benutzer-test", icon: Bug },
        { name: "Verfügbarkeit", href: "/debug/availability", icon: Activity },
        { name: "Deployment", href: "/debug/deployment", icon: Database },
        { name: "Fehlende Features", href: "/debug/missing-features", icon: FileText },
        { name: "Mock-Daten", href: "/debug/toggle-mock", icon: Settings },
        { name: "Projekt-Review", href: "/project-review", icon: BarChart3 },
        { name: "Status Aktuell", href: "/status-aktuell", icon: Activity },
        { name: "Status Liste", href: "/status-liste", icon: FileText },
      ],
    },
    {
      name: "Einstellungen",
      href: "/settings",
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
            const hasActiveSubLink = link.subLinks?.some(
              (subLink) => pathname === subLink.href || pathname.startsWith(`${subLink.href}/`),
            )

            return (
              <li key={link.name}>
                <div>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center px-4 py-3 text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg mx-2 transition-colors",
                      {
                        "bg-secondary text-primary": isActive || hasActiveSubLink,
                        "hover:text-cyan-400": link.name === "Nexus",
                      },
                    )}
                    onClick={(e) => {
                      if (link.isExpandable) {
                        e.preventDefault()
                        setIsAdminExpanded(!isAdminExpanded)
                      }
                    }}
                  >
                    <link.icon
                      className={cn("h-5 w-5 mr-3", {
                        "text-cyan-400": link.name === "Nexus" && (isActive || pathname.includes("hover")),
                      })}
                    />
                    <span className="hidden md:inline flex-1">{link.name}</span>
                    {link.isExpandable && (
                      <div className="hidden md:block">
                        {isAdminExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </div>
                    )}
                  </Link>

                  {/* Untermenü für Admin */}
                  {link.isExpandable && isAdminExpanded && (
                    <ul className="ml-4 mt-2 space-y-1">
                      {link.subLinks?.map((subLink) => {
                        const isSubActive = pathname === subLink.href || pathname.startsWith(`${subLink.href}/`)
                        return (
                          <li key={subLink.name}>
                            <Link
                              href={subLink.href}
                              className={cn(
                                "flex items-center px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-secondary/30 rounded-lg mx-2 transition-colors",
                                {
                                  "bg-secondary/50 text-primary": isSubActive,
                                },
                              )}
                            >
                              <subLink.icon className="h-4 w-4 mr-3" />
                              <span className="hidden md:inline">{subLink.name}</span>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
