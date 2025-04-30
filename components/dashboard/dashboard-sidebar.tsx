"use client"
import { cn } from "@/lib/utils"
import {
  Home,
  Share2,
  Activity,
  Compass,
  User,
  TrendingUp,
  LogOut,
  BarChart2,
  FileText,
  MessageSquare,
  Hash,
  Settings,
} from "lucide-react"
import { getCurrentUser } from "@/lib/mock-users"
import { getTotalUnreadMessages } from "@/lib/mock-messages"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

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

  const navItems = [
    {
      id: "home",
      name: "Dashboard",
      icon: Home,
      tab: "home",
      action: () => onTabChange("home"),
    },
    {
      id: "insights-trends",
      name: "Insights & Trends",
      icon: TrendingUp,
      tab: "insights-trends",
      action: () => router.push("/insights"),
    },
    {
      id: "overview",
      name: "Übersicht",
      icon: BarChart2,
      tab: "übersicht",
      action: () => onTabChange("übersicht"),
    },
    {
      id: "my-experiences",
      name: "Meine Erlebnisse",
      icon: FileText,
      tab: "meine-erlebnisse",
      action: () => onTabChange("meine-erlebnisse"),
    },
    {
      id: "shared-experiences",
      name: "Geteilte Erlebnisse",
      icon: Share2,
      tab: "geteilte-erlebnisse",
      action: () => onTabChange("geteilte-erlebnisse"),
    },
    {
      id: "activities",
      name: "Aktivitäten",
      icon: Activity,
      tab: "aktivitäten",
      action: () => onTabChange("aktivitäten"),
    },
    {
      id: "discover",
      name: "Entdecken",
      icon: Compass,
      tab: "entdecken",
      action: () => onTabChange("entdecken"),
    },
    {
      id: "messages",
      name: "Nachrichten",
      icon: MessageSquare,
      tab: "nachrichten",
      badge: unreadMessages,
      action: () => onTabChange("nachrichten"),
    },
    {
      id: "channels",
      name: "Channels",
      icon: Hash,
      tab: "channels",
      action: () => onTabChange("channels"),
    },
    {
      id: "profile",
      name: "Profil",
      icon: User,
      tab: "profil",
      action: () => onTabChange("profil"),
    },
  ]

  return (
    <div className={cn("h-full flex flex-col justify-between", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Dashboard</h2>
          <div className="space-y-1">
            {navItems.map((item) => (
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
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto p-4">
        <div className="space-y-1">
          <button
            className="w-full flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            aria-label="Einstellungen öffnen"
          >
            <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
            Einstellungen
          </button>
          <button
            className="w-full flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            aria-label="Abmelden"
          >
            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            Abmelden
          </button>
        </div>
      </div>
    </div>
  )
}
