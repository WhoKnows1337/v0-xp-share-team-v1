"use client"

import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { getCurrentUser, getTotalUnreadMessages } from "@/lib/mock-messages"
import { useRouter } from "next/navigation"

export function NachrichtenButton() {
  const [unreadCount, setUnreadCount] = useState(0)
  const router = useRouter()
  const currentUser = getCurrentUser()

  useEffect(() => {
    // Aktualisiere den Zähler für ungelesene Nachrichten
    const count = getTotalUnreadMessages(currentUser)
    setUnreadCount(count)

    // In einer echten Anwendung würde hier ein Echtzeit-Update über WebSockets erfolgen
    const interval = setInterval(() => {
      const newCount = getTotalUnreadMessages(currentUser)
      setUnreadCount(newCount)
    }, 30000) // Alle 30 Sekunden aktualisieren

    return () => clearInterval(interval)
  }, [currentUser])

  const handleClick = () => {
    router.push("/nachrichten")
  }

  return (
    <Button variant="ghost" size="icon" className="relative" onClick={handleClick} aria-label="Nachrichten">
      <MessageSquare className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {unreadCount > 9 ? "9+" : unreadCount}
        </Badge>
      )}
      <span className="sr-only">Nachrichten</span>
    </Button>
  )
}
