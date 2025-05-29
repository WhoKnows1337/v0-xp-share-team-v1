import { createClient } from "@supabase/supabase-js"

// Singleton Supabase Client für Realtime
let supabaseClient: ReturnType<typeof createClient> | null = null

export const getRealtimeClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  }
  return supabaseClient
}

// Real-Time Event Types
export type RealtimeEvent =
  | "message_received"
  | "user_online"
  | "user_offline"
  | "experience_liked"
  | "experience_commented"
  | "achievement_unlocked"
  | "notification_received"

export interface RealtimeMessage {
  id: string
  type: RealtimeEvent
  payload: any
  timestamp: Date
  userId?: string
}

// Real-Time Service Class
export class RealtimeService {
  private client = getRealtimeClient()
  private channels = new Map<string, any>()
  private listeners = new Map<string, Set<(message: RealtimeMessage) => void>>()

  // Kanal abonnieren
  subscribe(channelName: string, callback: (message: RealtimeMessage) => void) {
    // Listener hinzufügen
    if (!this.listeners.has(channelName)) {
      this.listeners.set(channelName, new Set())
    }
    this.listeners.get(channelName)!.add(callback)

    // Kanal erstellen falls nicht vorhanden
    if (!this.channels.has(channelName)) {
      const channel = this.client
        .channel(channelName)
        .on("broadcast", { event: "*" }, (payload) => {
          const message: RealtimeMessage = {
            id: crypto.randomUUID(),
            type: payload.event as RealtimeEvent,
            payload: payload.payload,
            timestamp: new Date(),
            userId: payload.userId,
          }

          // Alle Listener benachrichtigen
          this.listeners.get(channelName)?.forEach((listener) => listener(message))
        })
        .subscribe()

      this.channels.set(channelName, channel)
    }

    // Cleanup-Funktion zurückgeben
    return () => {
      this.listeners.get(channelName)?.delete(callback)
      if (this.listeners.get(channelName)?.size === 0) {
        this.channels.get(channelName)?.unsubscribe()
        this.channels.delete(channelName)
        this.listeners.delete(channelName)
      }
    }
  }

  // Nachricht senden
  async broadcast(channelName: string, event: RealtimeEvent, payload: any, userId?: string) {
    const channel = this.channels.get(channelName)
    if (channel) {
      await channel.send({
        type: "broadcast",
        event,
        payload,
        userId,
      })
    }
  }

  // Online-Status verwalten
  async setUserOnline(userId: string) {
    await this.broadcast("presence", "user_online", { userId })
  }

  async setUserOffline(userId: string) {
    await this.broadcast("presence", "user_offline", { userId })
  }

  // Typing-Indikator
  async sendTyping(channelName: string, userId: string, isTyping: boolean) {
    await this.broadcast(channelName, "user_typing" as RealtimeEvent, { userId, isTyping })
  }
}

export const realtimeService = new RealtimeService()
