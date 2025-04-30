"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { createNewConversation, getCurrentUser } from "@/lib/mock-messages"

interface NachrichtSendenButtonProps {
  username: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function NachrichtSendenButton({
  username,
  variant = "default",
  size = "default",
  className,
}: NachrichtSendenButtonProps) {
  const router = useRouter()
  const currentUser = getCurrentUser()

  const handleClick = () => {
    if (username === currentUser) return

    // Erstelle eine neue Konversation oder öffne eine bestehende
    const newConversation = createNewConversation([currentUser, username], "direct")

    router.push(`/nachrichten?id=${newConversation.id}`)
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
      disabled={username === currentUser}
    >
      <MessageSquare className="mr-2 h-4 w-4" />
      Nachricht senden
    </Button>
  )
}
