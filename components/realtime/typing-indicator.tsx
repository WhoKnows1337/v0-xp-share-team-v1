"use client"

import { useEffect, useState } from "react"
import { useTypingIndicator } from "@/hooks/use-realtime"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { findUserByUsername } from "@/lib/user-utils"

interface TypingIndicatorProps {
  channelId: string
  currentUserId: string
}

export function TypingIndicator({ channelId, currentUserId }: TypingIndicatorProps) {
  const { typingUsers } = useTypingIndicator(channelId)
  const [animationKey, setAnimationKey] = useState(0)

  // Filter out current user from typing users
  const otherTypingUsers = typingUsers.filter((userId) => userId !== currentUserId)

  useEffect(() => {
    setAnimationKey((prev) => prev + 1)
  }, [otherTypingUsers.length])

  if (otherTypingUsers.length === 0) {
    return null
  }

  const getTypingText = () => {
    if (otherTypingUsers.length === 1) {
      const user = findUserByUsername(otherTypingUsers[0])
      return `${user?.username || "Jemand"} schreibt...`
    } else if (otherTypingUsers.length === 2) {
      const user1 = findUserByUsername(otherTypingUsers[0])
      const user2 = findUserByUsername(otherTypingUsers[1])
      return `${user1?.username || "Jemand"} und ${user2?.username || "jemand"} schreiben...`
    } else {
      return `${otherTypingUsers.length} Personen schreiben...`
    }
  }

  return (
    <div className="flex items-center gap-2 p-2 text-sm text-muted-foreground animate-in fade-in-0 slide-in-from-bottom-2">
      <div className="flex -space-x-1">
        {otherTypingUsers.slice(0, 3).map((userId) => {
          const user = findUserByUsername(userId)
          return (
            <Avatar key={userId} className="h-6 w-6 border-2 border-background">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.username} />
              <AvatarFallback className="text-xs">{user?.username?.charAt(0) || "?"}</AvatarFallback>
            </Avatar>
          )
        })}
      </div>
      <span>{getTypingText()}</span>
      <div className="flex space-x-1">
        <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  )
}
