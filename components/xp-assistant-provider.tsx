"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { useState, createContext, useContext, useEffect } from "react"
import { XPAssistant } from "@/components/xp-assistant/xp-assistant"

type XPAssistantContextType = {
  openAssistant: (context?: string) => void
}

const XPAssistantContext = createContext<XPAssistantContextType>({
  openAssistant: () => {},
})

export const useXPAssistant = () => useContext(XPAssistantContext)

interface XPAssistantProviderProps {
  children: React.ReactNode
}

export function XPAssistantProvider({ children }: XPAssistantProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [context, setContext] = useState<string | undefined>(undefined)
  const pathname = usePathname()

  // Automatisch öffnen auf dem Dashboard
  useEffect(() => {
    if (pathname?.includes("/dashboard")) {
      setIsOpen(true)
    }
  }, [pathname])

  const openAssistant = (newContext?: string) => {
    setContext(newContext)
    setIsOpen(true)
  }

  // Prüfen, ob wir auf der Startseite sind
  const isHomePage = pathname === "/"

  return (
    <XPAssistantContext.Provider value={{ openAssistant }}>
      {children}
      {!isHomePage && <XPAssistant initialContext={context} initialOpen={isOpen} />}
    </XPAssistantContext.Provider>
  )
}
