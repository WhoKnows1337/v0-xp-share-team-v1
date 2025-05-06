"use client"

import { cn } from "@/lib/utils"
import {
  Home,
  Compass,
  User,
  TrendingUp,
  LogOut,
  Hash,
  Settings,
  Book,
  BarChart2,
  PartyPopper,
  Award,
  Trophy,
  MessageSquare,
  Users,
} from "lucide-react"
import { getCurrentUser } from "@/lib/mock-users"
import { getTotalUnreadMessages } from "@/lib/mock-messages"
import { useEffect, useState } from "react"
import Link from "next/link"

interface DashboardSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  className?: string
}

export function DashboardSidebar({ activeTab, onTabChange, className }: DashboardSidebarProps) {
  const [unreadMessages, setUnreadMessages] = useState(0)
  const currentUser = getCurrentUser()

  useEffect(() => {
    const count = getTotalUnreadMessages(currentUser)
    setUnreadMessages(count)

    const interval = setInterval(() => {
      const newCount = getTotalUnreadMessages(currentUser)
      setUnreadMessages(newCount)
    }, 30000)

    return () => clearInterval(interval)
  }, [currentUser])

  // Temporär: Füge eine Admin-Rolle zum aktuellen Benutzer hinzu
  useEffect(() => {
    if (currentUser) {
      // @ts-ignore - Wir fügen temporär eine Rolle hinzu
      currentUser.role = "admin"
    }
  }, [currentUser])

  // Füge den Nexus-Link zwischen "Entdecken" und "Nachrichten" ein
  const navItems = [
    {
      id: "home",
      name: "Dashboard",
      icon: Home,
      tab: "home",
      href: "/dashboard",
    },
    {
      id: "insights-trends",
      name: "Insights & Trends",
      icon: TrendingUp,
      tab: "insights-trends",
      href: "/insights",
    },
    {
      id: "discover",
      name: "Entdecken",
      icon: Compass,
      tab: "entdecken",
      href: "/entdecken",
    },
    {
      id: "nexus",
      name: "Nexus",
      icon: Compass,
      tab: "nexus",
      href: "/nexus",
      // Spezielle Styling für Nexus
      customStyle: "text-cyan-400",
    },
    {
      id: "messages",
      name: "Nachrichten",
      icon: MessageSquare,
      tab: "nachrichten",
      href: "/nachrichten",
      badge: unreadMessages,
    },
    {
      id: "xp-book",
      name: "XP-Buch",
      icon: Book,
      tab: "xp-buch",
      href: "/xp-buch",
    },
    {
      id: "community",
      name: "Community",
      icon: Users,
      tab: "community",
      href: "/community",
    },
    {
      id: "channels",
      name: "Channels",
      icon: Hash,
      tab: "channels",
      href: "/channels",
    },
    {
      id: "achievements",
      name: "Achievements",
      icon: Award,
      tab: "achievements",
      href: "/achievements",
    },
    {
      id: "leaderboard",
      name: "Bestenliste",
      icon: Trophy,
      tab: "leaderboard",
      href: "/leaderboard",
    },
    {
      id: "referrals",
      name: "Freunde einladen",
      icon: PartyPopper,
      tab: "referrals",
      href: "/referrals",
    },
    {
      id: "profile",
      name: "Profil",
      icon: User,
      tab: "profil",
      href: `/profil/${encodeURIComponent(currentUser?.username || "demo-user")}`,
    },
    {
      id: "settings",
      name: "Einstellungen",
      icon: Settings,
      tab: "einstellungen",
      href: "/einstellungen",
    },
    // Admin-Bereich hinzufügen (nur für Admins sichtbar)
    {
      id: "admin-divider",
      name: "Admin-Bereich",
      isDivider: true,
      isAdmin: true,
    },
    {
      id: "admin-dashboard",
      name: "Admin Dashboard",
      icon: BarChart2,
      tab: "admin-dashboard",
      isAdmin: true,
      href: "/admin",
    },
    {
      id: "admin-tracking",
      name: "Tracking & Metriken",
      icon: BarChart2,
      tab: "admin-tracking",
      isAdmin: true,
      href: "/admin/tracking",
    },
  ]

  return (
    <div className={cn("h-full flex flex-col justify-between overflow-hidden", className)}>
      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-3">
          <div className="space-y-1">
            {navItems.map((item) => {
              // Überprüfe, ob es sich um ein Admin-Element handelt und ob der Benutzer Admin ist
              if (item.isAdmin && !(currentUser?.role === "admin")) {
                return null
              }

              // Wenn es ein Divider ist
              if (item.isDivider) {
                return (
                  <div key={item.id} className="px-3 py-2">
                    <div className="text-xs font-semibold text-muted-foreground">{item.name}</div>
                    <div className="h-px bg-border mt-1"></div>
                  </div>
                )
              }

              // Aktualisiere den Link-Rendering-Code, um das benutzerdefinierte Styling zu berücksichtigen
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => onTabChange(item.tab)}
                  className={cn(
                    "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    activeTab === item.tab ? "bg-accent" : "transparent",
                    item.customStyle && item.id === "nexus" ? "hover:text-cyan-400" : "",
                  )}
                  aria-current={activeTab === item.tab ? "page" : undefined}
                >
                  <span className="flex items-center">
                    <item.icon
                      className={cn("mr-2 h-4 w-4", item.id === "nexus" ? "text-cyan-400" : "")}
                      aria-hidden="true"
                    />
                    <span className={item.id === "nexus" ? "text-cyan-400" : ""}>{item.name}</span>
                  </span>
                  {item.badge && item.badge > 0 && (
                    <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 border-t">
        <div className="space-y-1">
          <Link
            href="/"
            className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            aria-label="Abmelden"
            onClick={() => {
              console.log("Abmelden")
              onTabChange("")
            }}
          >
            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            Abmelden
          </Link>
        </div>
      </div>
    </div>
  )
}
