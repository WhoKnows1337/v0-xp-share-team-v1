"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Sparkles, Users, Compass, BookOpen, Settings, TrendingUp, Calendar, Heart } from "lucide-react"

const sidebarItems = [
  {
    title: "Hauptbereich",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Meine Erlebnisse", href: "/meine-erlebnisse", icon: Sparkles },
      { name: "Tagebuch", href: "/tagebuch", icon: BookOpen },
    ],
  },
  {
    title: "Community",
    items: [
      { name: "Entdecken", href: "/entdecken", icon: Compass },
      { name: "Community", href: "/community", icon: Users },
      { name: "Trending", href: "/trending", icon: TrendingUp },
    ],
  },
  {
    title: "Persönlich",
    items: [
      { name: "Favoriten", href: "/favoriten", icon: Heart },
      { name: "Kalender", href: "/kalender", icon: Calendar },
      { name: "Einstellungen", href: "/einstellungen", icon: Settings },
    ],
  },
]

export function VercelSidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-background/50 backdrop-blur-sm overflow-y-auto">
      <div className="p-4 space-y-6">
        {sidebarItems.map((section) => (
          <div key={section.title}>
            <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
