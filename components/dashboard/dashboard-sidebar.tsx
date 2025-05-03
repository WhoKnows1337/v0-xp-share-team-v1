"use client"
import { cn } from "@/lib/utils"
import {
  Home,
  Activity,
  Compass,
  User,
  TrendingUp,
  LogOut,
  FileText,
  Hash,
  Settings,
  Book,
  BarChart2,
} from "lucide-react"
import { getCurrentUser } from "@/lib/mock-users"
import { getTotalUnreadMessages } from "@/lib/mock-messages"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { mockUsers } from "@/lib/mock-users"

interface DashboardSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  className?: string
}

export function DashboardSidebar({ activeTab, onTabChange, className }: DashboardSidebarProps) {
  const [unreadMessages, setUnreadMessages] = useState(0)
  const currentUser = getCurrentUser()
  const router = useRouter()

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

  // Temporär: Füge eine Admin-Rolle zum aktuellen Benutzer hinzu
  useEffect(() => {
    if (currentUser) {
      // @ts-ignore - Wir fügen temporär eine Rolle hinzu
      currentUser.role = "admin"
    }
  }, [currentUser])

  const handleProfileClick = () => {
    // Verwende den aktuellen Benutzernamen für die Profil-URL
    const username = currentUser?.username || "demo-user"
    console.log("Sidebar: Navigiere zum Profil von:", username)

    // Überprüfen, ob der Benutzer existiert
    const user = mockUsers.find((u) => u.username.toLowerCase() === username.toLowerCase())
    if (user) {
      router.push(`/profil/${encodeURIComponent(user.username)}`)
      onTabChange("profil")
    } else {
      console.error("Benutzer nicht gefunden:", username)
      // Fallback auf den ersten verfügbaren Benutzer
      if (mockUsers.length > 0) {
        router.push(`/profil/${encodeURIComponent(mockUsers[0].username)}`)
        onTabChange("profil")
      } else {
        alert("Keine Benutzer verfügbar. Bitte überprüfen Sie die Mock-Daten.")
      }
    }
  }

  const navItems = [
    {
      id: "home",
      name: "Dashboard",
      icon: Home,
      tab: "home",
      action: () => {
        router.push("/dashboard")
        onTabChange("home")
      },
    },
    {
      id: "insights-trends",
      name: "Insights & Trends",
      icon: TrendingUp,
      tab: "insights-trends",
      action: () => {
        router.push("/insights")
        onTabChange("insights-trends")
      },
    },
    {
      id: "my-experiences",
      name: "Meine Erlebnisse",
      icon: FileText,
      tab: "meine-erlebnisse",
      action: () => {
        router.push("/dashboard?tab=meine-erlebnisse")
        onTabChange("meine-erlebnisse")
      },
    },
    {
      id: "activities",
      name: "Aktivitäten",
      icon: Activity,
      tab: "aktivitäten",
      action: () => {
        router.push("/dashboard?tab=aktivitäten")
        onTabChange("aktivitäten")
      },
    },
    {
      id: "discover",
      name: "Entdecken",
      icon: Compass,
      tab: "entdecken",
      action: () => {
        router.push("/entdecken")
        onTabChange("entdecken")
      },
    },
    {
      id: "channels",
      name: "Channels",
      icon: Hash,
      tab: "channels",
      action: () => {
        router.push("/channels")
        onTabChange("channels")
      },
    },
    {
      id: "xp-book",
      name: "XP Buch",
      icon: Book,
      tab: "xp-buch",
      action: () => {
        router.push("/xp-buch")
        onTabChange("xp-buch")
      },
    },
    {
      id: "profile",
      name: "Profil",
      icon: User,
      tab: "profil",
      action: handleProfileClick,
    },
    {
      id: "settings",
      name: "Einstellungen",
      icon: Settings,
      tab: "einstellungen",
      action: () => {
        router.push("/einstellungen")
        onTabChange("einstellungen")
      },
    },
    // Admin-Bereich hinzufügen (nur für Admins sichtbar)
    {
      id: "admin-divider",
      name: "Admin-Bereich",
      isDivider: true,
      isAdmin: true,
    },
    {
      id: "admin-tracking",
      name: "Tracking & Metriken",
      icon: BarChart2,
      tab: "admin-tracking",
      isAdmin: true,
      action: () => {
        router.push("/admin/tracking")
        onTabChange("admin-tracking")
      },
    },
  ]

  return (
    <div className={cn("h-full flex flex-col justify-between overflow-hidden", className)}>
      <div className="space-y-2 pt-2">
        <div className="px-3 pt-1">
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

              // Normales Menüelement
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={cn(
                    "w-full flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    activeTab === item.tab ? "bg-accent" : "transparent",
                  )}
                  aria-current={activeTab === item.tab ? "page" : undefined}
                >
                  <span className="flex items-center">
                    <item.icon className="mr-2 h-4 w-4" aria-hidden="true" />
                    {item.name}
                  </span>
                  {item.badge && item.badge > 0 && (
                    <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-auto p-4">
        <div className="space-y-1">
          <button
            className="w-full flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            aria-label="Abmelden"
            onClick={() => {
              // Abmelden-Logik hier
              router.push("/")
              console.log("Abmelden")
            }}
          >
            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            Abmelden
          </button>
        </div>
      </div>
    </div>
  )
}
