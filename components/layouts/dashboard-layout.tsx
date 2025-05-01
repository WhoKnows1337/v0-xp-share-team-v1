"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useSidebar } from "@/contexts/sidebar-context"
import { Menu, Home, BarChart2, Compass, MessageSquare, Book, Settings, Users } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
  activeTab?: string
}

export function DashboardLayout({ children, activeTab }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const { sidebarVisible } = useSidebar()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      active: activeTab === "dashboard" || pathname === "/dashboard",
    },
    {
      href: "/insights",
      label: "Insights & Trends",
      icon: <BarChart2 className="h-5 w-5" />,
      active: activeTab === "insights" || pathname === "/insights",
    },
    {
      href: "/entdecken",
      label: "Entdecken",
      icon: <Compass className="h-5 w-5" />,
      active: activeTab === "entdecken" || pathname === "/entdecken",
    },
    {
      href: "/nachrichten",
      label: "Nachrichten",
      icon: <MessageSquare className="h-5 w-5" />,
      active: activeTab === "nachrichten" || pathname === "/nachrichten",
    },
    {
      href: "/xp-buch",
      label: "XP-Buch",
      icon: <Book className="h-5 w-5" />,
      active: activeTab === "xp-buch" || pathname === "/xp-buch",
    },
    {
      href: "/community",
      label: "Community",
      icon: <Users className="h-5 w-5" />,
      active: activeTab === "community" || pathname === "/community",
    },
    {
      href: "/einstellungen",
      label: "Einstellungen",
      icon: <Settings className="h-5 w-5" />,
      active: activeTab === "einstellungen" || pathname === "/einstellungen",
    },
  ]

  const SidebarContent = () => (
    <ScrollArea className="h-full py-6">
      <div className="space-y-1 px-2">
        {routes.map((route) => (
          <Link key={route.href} href={route.href}>
            <Button
              variant={route.active ? "secondary" : "ghost"}
              className={cn("w-full justify-start", route.active ? "bg-accent" : "")}
            >
              {route.icon}
              <span className="ml-3">{route.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </ScrollArea>
  )

  return (
    <div className="flex min-h-screen">
      {/* Sidebar für Desktop */}
      {!isMobile && sidebarVisible && (
        <aside className="w-64 border-r bg-background hidden md:block">
          <SidebarContent />
        </aside>
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden absolute left-4 top-4 z-50">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menü öffnen</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      )}

      {/* Hauptinhalt */}
      <main className={cn("flex-1", !sidebarVisible && "ml-0", sidebarVisible && !isMobile && "md:ml-0")}>
        <div className="container mx-auto px-4 py-6">{children}</div>
      </main>
    </div>
  )
}
