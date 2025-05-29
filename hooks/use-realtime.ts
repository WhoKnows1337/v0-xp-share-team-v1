"use client"

import { useEffect, useState } from "react"
import { realtimeService } from "@/lib/realtime-service"

type ChannelEvent = "INSERT" | "UPDATE" | "DELETE" | "*"

interface UseRealtimeOptions {
  event?: ChannelEvent
  filter?: string
  enabled?: boolean
  onData?: (data: any) => void
}

/**
 * Hook für die Verwendung der Echtzeit-Funktionalität
 */
export function useRealtimeTable<T = any>(tableName: string, options: UseRealtimeOptions = {}) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { event, filter, enabled = true, onData } = options

  useEffect(() => {
    if (!enabled || !tableName) return

    setIsLoading(true)

    const unsubscribe = realtimeService.subscribeToTable(
      tableName,
      (payload) => {
        setData(payload.new as T)
        setIsLoading(false)

        if (onData) {
          onData(payload)
        }
      },
      { event, filter },
    )

    return () => {
      unsubscribe()
    }
  }, [tableName, event, filter, enabled, onData])

  return { data, error, isLoading }
}

/**
 * Hook für die Verwendung eines benutzerdefinierten Kanals
 */
export function useRealtimeChannel<T = any>(
  channelName: string,
  event: string,
  options: Omit<UseRealtimeOptions, "event" | "filter"> = {},
) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { enabled = true, onData } = options

  useEffect(() => {
    if (!enabled || !channelName || !event) return

    setIsLoading(true)

    const unsubscribe = realtimeService.subscribeToChannel(channelName, event, (payload) => {
      setData(payload as T)
      setIsLoading(false)

      if (onData) {
        onData(payload)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [channelName, event, enabled, onData])

  return { data, error, isLoading }
}

/**
 * Hook für das Senden von Nachrichten an einen Kanal
 */
export function useBroadcast() {
  const broadcast = (channelName: string, event: string, payload: any) => {
    realtimeService.broadcast(channelName, event, payload)
  }

  return { broadcast }
}
