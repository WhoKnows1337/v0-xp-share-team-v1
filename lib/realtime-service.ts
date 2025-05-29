import { supabase } from "./supabase"
import type { RealtimeChannel } from "@supabase/supabase-js"

type ChannelCallback = (payload: any) => void
type ChannelEvent = "INSERT" | "UPDATE" | "DELETE" | "*"

interface SubscriptionOptions {
  event?: ChannelEvent
  filter?: string
}

class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map()

  /**
   * Abonniert Änderungen an einer Tabelle
   */
  subscribeToTable(tableName: string, callback: ChannelCallback, options: SubscriptionOptions = {}): () => void {
    const channelName = `realtime:${tableName}:${Date.now()}`

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: options.event || "*",
          schema: "public",
          table: tableName,
          filter: options.filter || undefined,
        },
        (payload) => {
          callback(payload)
        },
      )
      .subscribe()

    this.channels.set(channelName, channel)

    // Unsubscribe-Funktion zurückgeben
    return () => {
      supabase.removeChannel(channel)
      this.channels.delete(channelName)
    }
  }

  /**
   * Abonniert einen benutzerdefinierten Kanal
   */
  subscribeToChannel(channelName: string, event: string, callback: ChannelCallback): () => void {
    const channel = supabase.channel(channelName).on("broadcast", { event }, callback).subscribe()

    this.channels.set(channelName, channel)

    // Unsubscribe-Funktion zurückgeben
    return () => {
      supabase.removeChannel(channel)
      this.channels.delete(channelName)
    }
  }

  /**
   * Sendet eine Nachricht an einen Kanal
   */
  broadcast(channelName: string, event: string, payload: any): void {
    const channel = this.channels.get(channelName)

    if (channel) {
      channel.send({
        type: "broadcast",
        event,
        payload,
      })
    } else {
      console.error(`Channel ${channelName} nicht gefunden`)
    }
  }

  /**
   * Beendet alle Abonnements
   */
  unsubscribeAll(): void {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel)
    })
    this.channels.clear()
  }
}

// Singleton-Instanz exportieren
export const realtimeService = new RealtimeService()
