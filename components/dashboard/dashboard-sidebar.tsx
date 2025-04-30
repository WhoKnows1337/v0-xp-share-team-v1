"use client"
import { cn } from "@/lib/utils"
import {
  Home,
  BarChart2,
  FileText,
  Share2,
  Activity,
  Compass,
  User,
  MessageSquare,
  Hash,
  Settings,
  LogOut,
} from "lucide-react"
import { getCurrentUser } from "@/lib/mock-users"
import { getTotalUnreadMessages } from "@/lib/mock-messages"
import { useEffect, useState } from "react"

interface DashboardSidebarProps {
  activeTab: string
  onTabChange: (tab: any) => void
  className?: string
}

export function DashboardSidebar({ activeTab, onTabChange, className }: DashboardSidebarProps) {
  const [unreadMessages, setUnreadMessages] = useState(0)
  const currentUser = getCurrentUser()

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
      name: "Dashboard",
      icon: Home,
      tab: "home",
    },
    {
      name: "Übersicht",
      icon: BarChart2,
      tab: "übersicht",
    },
    {
      name: "Meine Erlebnisse",
      icon: FileText,
      tab: "meine-erlebnisse",
    },
    {
      name: "Geteilte Erlebnisse",
      icon: Share2,
      tab: "geteilte-erlebnisse",
    },
    {
      name: "Aktivitäten",
      icon: Activity,
      tab: "aktivitäten",
    },
    {
      name: "Entdecken",
      icon: Compass,
      tab: "entdecken",
    },
    {
      name: "Nachrichten",
      icon: MessageSquare,
      tab: "nachrichten",
      badge: unreadMessages,
    },
    {
      name: "Channels",
      icon: Hash,
      tab: "channels",
    },
    {
      name: "Profil",
      icon: User,
      tab: "profil",
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
                key={item.tab}
                onClick={() => onTabChange(item.tab)}
                className={cn(
                  "w-full flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  activeTab === item.tab ? "bg-accent" : "transparent",
                )}
              >
                <span className="flex items-center">
                  <item.icon className="mr-2 h-4 w-4" />
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
          <button className="w-full flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            <Settings className="mr-2 h-4 w-4" />
            Einstellungen
          </button>
          <button className="w-full flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            <LogOut className="mr-2 h-4 w-4" />
            Abmelden
          </button>
        </div>
      </div>
    </div>
  )
}
