"use client"

import { useEffect, useRef, useState } from "react"
import { realtimeService, type RealtimeEvent, type RealtimeMessage } from "@/lib/realtime-service"

export function useRealtime(channelName: string) {
  const [messages, setMessages] = useState<RealtimeMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const unsubscribeRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    setIsConnected(true)

    const handleMessage = (message: RealtimeMessage) => {
      setMessages((prev) => [...prev, message])
    }

    unsubscribeRef.current = realtimeService.subscribe(channelName, handleMessage)

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }
      setIsConnected(false)
    }
  }, [channelName])

  const sendMessage = async (event: RealtimeEvent, payload: any, userId?: string) => {
    await realtimeService.broadcast(channelName, event, payload, userId)
  }

  const clearMessages = () => {
    setMessages([])
  }

  return {
    messages,
    isConnected,
    sendMessage,
    clearMessages,
  }
}

// Hook für Online-Status
export function useOnlineStatus() {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())

  useEffect(() => {
    const handlePresence = (message: RealtimeMessage) => {
      if (message.type === "user_online") {
        setOnlineUsers((prev) => new Set([...prev, message.payload.userId]))
      } else if (message.type === "user_offline") {
        setOnlineUsers((prev) => {
          const newSet = new Set(prev)
          newSet.delete(message.payload.userId)
          return newSet
        })
      }
    }

    const unsubscribe = realtimeService.subscribe("presence", handlePresence)
    return unsubscribe
  }, [])

  const setUserOnline = (userId: string) => {
    realtimeService.setUserOnline(userId)
  }

  const setUserOffline = (userId: string) => {
    realtimeService.setUserOffline(userId)
  }

  return {
    onlineUsers: Array.from(onlineUsers),
    setUserOnline,
    setUserOffline,
  }
}

// Hook für Typing-Indikatoren
export function useTypingIndicator(channelName: string) {
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())

  useEffect(() => {
    const handleTyping = (message: RealtimeMessage) => {
      if (message.type === "user_typing") {
        const { userId, isTyping } = message.payload
        setTypingUsers((prev) => {
          const newSet = new Set(prev)
          if (isTyping) {
            newSet.add(userId)
          } else {
            newSet.delete(userId)
          }
          return newSet
        })
      }
    }

    const unsubscribe = realtimeService.subscribe(channelName, handleTyping)
    return unsubscribe
  }, [channelName])

  const setTyping = (userId: string, isTyping: boolean) => {
    realtimeService.sendTyping(channelName, userId, isTyping)
  }

  return {
    typingUsers: Array.from(typingUsers),
    setTyping,
  }
}
