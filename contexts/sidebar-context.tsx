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
  // Immer auf true initialisieren, damit die Sidebar immer sichtbar ist
  const [sidebarVisible, setSidebarVisible] = useState(true)

  // Diese Funktionen behalten wir bei, aber sie haben keinen Effekt mehr
  const toggleSidebar = () => {
    console.log("Sidebar toggle wurde aufgerufen, aber die Sidebar bleibt sichtbar")
    // Wir setzen den Zustand nicht mehr, damit die Sidebar immer sichtbar bleibt
  }

  const showSidebar = () => {
    setSidebarVisible(true)
  }

  const hideSidebar = () => {
    console.log("Sidebar hide wurde aufgerufen, aber die Sidebar bleibt sichtbar")
    // Wir setzen den Zustand nicht mehr, damit die Sidebar immer sichtbar bleibt
  }

  // Stellen Sie sicher, dass der Zustand im localStorage immer auf true gesetzt ist
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarVisible", "true")
    }
  }, [])

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
