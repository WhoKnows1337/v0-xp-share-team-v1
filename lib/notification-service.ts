import { getSupabaseClient } from "./supabase-client"
import { config } from "./config"

export interface Notification {
  id: string
  user_id: string
  type: "like" | "comment" | "follow" | "group_invite" | "achievement" | "system"
  title: string
  message: string
  data?: any
  read: boolean
  created_at: string
}

// Mock-Daten für Benachrichtigungen
const mockNotifications: Notification[] = [
  {
    id: "1",
    user_id: "current-user",
    type: "like",
    title: "Neuer Like",
    message: "Anna hat dein Erlebnis 'Meditation im Schwarzwald' geliked",
    data: { experience_id: "1", user_id: "anna" },
    read: false,
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    user_id: "current-user",
    type: "comment",
    title: "Neuer Kommentar",
    message: "Marco hat dein Erlebnis kommentiert",
    data: { experience_id: "2", comment_id: "123" },
    read: false,
    created_at: "2024-01-15T09:30:00Z",
  },
  {
    id: "3",
    user_id: "current-user",
    type: "achievement",
    title: "Achievement freigeschaltet!",
    message: "Du hast das Achievement 'Naturverbunden' erhalten",
    data: { achievement_id: "nature_lover" },
    read: true,
    created_at: "2024-01-14T16:00:00Z",
  },
]

class NotificationService {
  // Holt alle Benachrichtigungen für einen Benutzer
  async getAll(userId: string, options?: { limit?: number; unreadOnly?: boolean }) {
    if (config.useMockData) {
      let filtered = mockNotifications.filter((notification) => notification.user_id === userId)

      if (options?.unreadOnly) {
        filtered = filtered.filter((notification) => !notification.read)
      }

      if (options?.limit) {
        filtered = filtered.slice(0, options.limit)
      }

      return filtered
    }

    try {
      const supabase = getSupabaseClient()
      let query = supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (options?.unreadOnly) {
        query = query.eq("read", false)
      }

      if (options?.limit) {
        query = query.limit(options.limit)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Fehler beim Abrufen der Benachrichtigungen:", error)
      throw error
    }
  }

  // Erstellt eine neue Benachrichtigung
  async create(notification: Omit<Notification, "id" | "created_at">) {
    if (config.useMockData) {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
      }
      mockNotifications.unshift(newNotification)
      return newNotification
    }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("notifications")
        .insert({
          ...notification,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Fehler beim Erstellen der Benachrichtigung:", error)
      throw error
    }
  }

  // Markiert eine Benachrichtigung als gelesen
  async markAsRead(id: string) {
    if (config.useMockData) {
      const notification = mockNotifications.find((n) => n.id === id)
      if (notification) {
        notification.read = true
        return notification
      }
      return null
    }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from("notifications").update({ read: true }).eq("id", id).select().single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Fehler beim Markieren der Benachrichtigung als gelesen:", error)
      throw error
    }
  }

  // Markiert alle Benachrichtigungen als gelesen
  async markAllAsRead(userId: string) {
    if (config.useMockData) {
      mockNotifications.forEach((notification) => {
        if (notification.user_id === userId) {
          notification.read = true
        }
      })
      return true
    }

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("notifications").update({ read: true }).eq("user_id", userId)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Fehler beim Markieren aller Benachrichtigungen als gelesen:", error)
      throw error
    }
  }

  // Löscht eine Benachrichtigung
  async delete(id: string) {
    if (config.useMockData) {
      const index = mockNotifications.findIndex((n) => n.id === id)
      if (index === -1) return false

      mockNotifications.splice(index, 1)
      return true
    }

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("notifications").delete().eq("id", id)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Fehler beim Löschen der Benachrichtigung:", error)
      throw error
    }
  }

  // Holt die Anzahl ungelesener Benachrichtigungen
  async getUnreadCount(userId: string) {
    if (config.useMockData) {
      return mockNotifications.filter((n) => n.user_id === userId && !n.read).length
    }

    try {
      const supabase = getSupabaseClient()
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("read", false)

      if (error) throw error
      return count || 0
    } catch (error) {
      console.error("Fehler beim Abrufen der Anzahl ungelesener Benachrichtigungen:", error)
      throw error
    }
  }

  // Sendet eine Push-Benachrichtigung
  async sendPushNotification(userId: string, title: string, body: string, data?: any) {
    // Hier würde normalerweise eine Push-Benachrichtigung gesendet
    console.log("Push-Benachrichtigung gesendet:", { userId, title, body, data })

    // Erstelle auch eine interne Benachrichtigung
    return this.create({
      user_id: userId,
      type: "system",
      title,
      message: body,
      data,
      read: false,
    })
  }
}

export const notificationService = new NotificationService()
