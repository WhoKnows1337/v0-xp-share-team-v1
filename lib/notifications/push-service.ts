"use client"

import { useEffect } from "react"

import { useState } from "react"

interface PushNotification {
  id: string
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  data?: any
  actions?: NotificationAction[]
  timestamp: Date
  read: boolean
  type: "experience" | "comment" | "like" | "achievement" | "quest" | "system"
}

interface NotificationAction {
  action: string
  title: string
  icon?: string
}

class PushNotificationService {
  private registration: ServiceWorkerRegistration | null = null
  private permission: NotificationPermission = "default"

  async initialize(): Promise<boolean> {
    if (!("serviceWorker" in navigator) || !("Notification" in window)) {
      console.warn("Push notifications not supported")
      return false
    }

    try {
      // Service Worker registrieren
      this.registration = await navigator.serviceWorker.register("/sw.js")
      console.log("Service Worker registered:", this.registration)

      // Permission anfragen
      this.permission = await this.requestPermission()

      return this.permission === "granted"
    } catch (error) {
      console.error("Failed to initialize push notifications:", error)
      return false
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      return "denied"
    }

    if (Notification.permission === "granted") {
      return "granted"
    }

    if (Notification.permission === "denied") {
      return "denied"
    }

    const permission = await Notification.requestPermission()
    this.permission = permission
    return permission
  }

  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.registration || this.permission !== "granted") {
      return null
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""),
      })

      // Subscription an Server senden
      await this.sendSubscriptionToServer(subscription)

      return subscription
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error)
      return null
    }
  }

  async unsubscribeFromPush(): Promise<boolean> {
    if (!this.registration) {
      return false
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()
        await this.removeSubscriptionFromServer(subscription)
      }
      return true
    } catch (error) {
      console.error("Failed to unsubscribe from push notifications:", error)
      return false
    }
  }

  async showNotification(notification: Omit<PushNotification, "id" | "timestamp" | "read">): Promise<void> {
    if (!this.registration || this.permission !== "granted") {
      return
    }

    const options: NotificationOptions = {
      body: notification.body,
      icon: notification.icon || "/icons/icon-192x192.png",
      badge: notification.badge || "/icons/badge-72x72.png",
      tag: notification.tag,
      data: notification.data,
      actions: notification.actions,
      requireInteraction: notification.type === "achievement",
      silent: false,
      vibrate: [200, 100, 200],
    }

    await this.registration.showNotification(notification.title, options)
  }

  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription,
          userId: this.getCurrentUserId(),
        }),
      })
    } catch (error) {
      console.error("Failed to send subscription to server:", error)
    }
  }

  private async removeSubscriptionFromServer(subscription: PushSubscription): Promise<void> {
    try {
      await fetch("/api/notifications/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription,
          userId: this.getCurrentUserId(),
        }),
      })
    } catch (error) {
      console.error("Failed to remove subscription from server:", error)
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  private getCurrentUserId(): string {
    // Hier würde normalerweise die aktuelle User-ID aus dem Auth-Context geholt
    return localStorage.getItem("userId") || "anonymous"
  }

  // Notification Templates
  createExperienceNotification(
    experienceName: string,
    authorName: string,
  ): Omit<PushNotification, "id" | "timestamp" | "read"> {
    return {
      title: "Neues Erlebnis geteilt",
      body: `${authorName} hat "${experienceName}" geteilt`,
      type: "experience",
      icon: "/icons/experience-icon.png",
      actions: [
        { action: "view", title: "Ansehen" },
        { action: "dismiss", title: "Ignorieren" },
      ],
    }
  }

  createAchievementNotification(
    achievementName: string,
    xpReward: number,
  ): Omit<PushNotification, "id" | "timestamp" | "read"> {
    return {
      title: "Achievement freigeschaltet!",
      body: `Du hast "${achievementName}" erreicht und ${xpReward} XP erhalten!`,
      type: "achievement",
      icon: "/icons/achievement-icon.png",
      actions: [
        { action: "view", title: "Details ansehen" },
        { action: "share", title: "Teilen" },
      ],
    }
  }

  createCommentNotification(
    commenterName: string,
    experienceName: string,
  ): Omit<PushNotification, "id" | "timestamp" | "read"> {
    return {
      title: "Neuer Kommentar",
      body: `${commenterName} hat dein Erlebnis "${experienceName}" kommentiert`,
      type: "comment",
      icon: "/icons/comment-icon.png",
      actions: [
        { action: "reply", title: "Antworten" },
        { action: "view", title: "Ansehen" },
      ],
    }
  }

  createQuestNotification(questName: string): Omit<PushNotification, "id" | "timestamp" | "read"> {
    return {
      title: "Quest abgeschlossen!",
      body: `Du hast die Quest "${questName}" erfolgreich abgeschlossen`,
      type: "quest",
      icon: "/icons/quest-icon.png",
      actions: [
        { action: "claim", title: "Belohnung einlösen" },
        { action: "view", title: "Details ansehen" },
      ],
    }
  }
}

export const pushNotificationService = new PushNotificationService()

// Hook für die Verwendung des Push-Services
export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    const initializeService = async () => {
      const supported = await pushNotificationService.initialize()
      setIsSupported(supported)
      setPermission(Notification.permission)

      if (supported && Notification.permission === "granted") {
        // Prüfe ob bereits abonniert
        const registration = await navigator.serviceWorker.getRegistration()
        if (registration) {
          const subscription = await registration.pushManager.getSubscription()
          setIsSubscribed(!!subscription)
        }
      }
    }

    initializeService()
  }, [])

  const requestPermission = async () => {
    const newPermission = await pushNotificationService.requestPermission()
    setPermission(newPermission)
    return newPermission === "granted"
  }

  const subscribe = async () => {
    const subscription = await pushNotificationService.subscribeToPush()
    setIsSubscribed(!!subscription)
    return !!subscription
  }

  const unsubscribe = async () => {
    const success = await pushNotificationService.unsubscribeFromPush()
    if (success) {
      setIsSubscribed(false)
    }
    return success
  }

  const showNotification = (notification: Omit<PushNotification, "id" | "timestamp" | "read">) => {
    return pushNotificationService.showNotification(notification)
  }

  return {
    isSupported,
    permission,
    isSubscribed,
    requestPermission,
    subscribe,
    unsubscribe,
    showNotification,
    // Template-Funktionen
    createExperienceNotification: pushNotificationService.createExperienceNotification,
    createAchievementNotification: pushNotificationService.createAchievementNotification,
    createCommentNotification: pushNotificationService.createCommentNotification,
    createQuestNotification: pushNotificationService.createQuestNotification,
  }
}
