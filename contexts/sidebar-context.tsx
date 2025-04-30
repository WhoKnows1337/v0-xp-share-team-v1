"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface SidebarContextType {
  sidebarVisible: boolean
  toggleSidebar: () => void
  showSidebar: () => void
  hideSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType>({
  sidebarVisible: true,
  toggleSidebar: () => {},
  showSidebar: () => {},
  hideSidebar: () => {},
})

export function SidebarProvider({ children }: { children: ReactNode }) {
  // Initialisiere den Zustand aus dem localStorage, falls vorhanden
  const [sidebarVisible, setSidebarVisible] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebarVisible")
      return saved !== null ? JSON.parse(saved) : true
    }
    return true
  })

  const toggleSidebar = () => {
    console.log("Toggling sidebar from", sidebarVisible, "to", !sidebarVisible)
    setSidebarVisible((prev) => !prev)
  }

  const showSidebar = () => setSidebarVisible(true)
  const hideSidebar = () => setSidebarVisible(false)

  // Speichere den Zustand im localStorage, wenn er sich ändert
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarVisible", JSON.stringify(sidebarVisible))
    }
    console.log("Sidebar context state changed:", sidebarVisible)
  }, [sidebarVisible])

  return (
    <SidebarContext.Provider value={{ sidebarVisible, toggleSidebar, showSidebar, hideSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
