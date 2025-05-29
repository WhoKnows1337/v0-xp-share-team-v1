interface WebhookEvent {
  id: string
  event: string
  data: any
  timestamp: Date
  retries: number
  status: "pending" | "delivered" | "failed"
}

interface WebhookEndpoint {
  id: string
  url: string
  events: string[]
  secret: string
  active: boolean
  created_at: Date
}

class WebhookManager {
  private endpoints = new Map<string, WebhookEndpoint>()
  private eventQueue: WebhookEvent[] = []
  private processing = false

  // Webhook-Endpoint registrieren
  registerEndpoint(url: string, events: string[], secret?: string): string {
    const id = this.generateId()
    const endpoint: WebhookEndpoint = {
      id,
      url,
      events,
      secret: secret || this.generateSecret(),
      active: true,
      created_at: new Date(),
    }

    this.endpoints.set(id, endpoint)
    return id
  }

  // Webhook-Endpoint entfernen
  removeEndpoint(id: string): boolean {
    return this.endpoints.delete(id)
  }

  // Event senden
  async sendEvent(event: string, data: any): Promise<void> {
    const webhookEvent: WebhookEvent = {
      id: this.generateId(),
      event,
      data,
      timestamp: new Date(),
      retries: 0,
      status: "pending",
    }

    this.eventQueue.push(webhookEvent)

    if (!this.processing) {
      this.processQueue()
    }
  }

  // Event-Queue verarbeiten
  private async processQueue(): Promise<void> {
    this.processing = true

    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift()!
      await this.deliverEvent(event)
    }

    this.processing = false
  }

  // Event an Endpoints liefern
  private async deliverEvent(event: WebhookEvent): Promise<void> {
    const relevantEndpoints = Array.from(this.endpoints.values()).filter(
      (endpoint) => endpoint.active && endpoint.events.includes(event.event),
    )

    const deliveryPromises = relevantEndpoints.map((endpoint) => this.sendToEndpoint(endpoint, event))

    await Promise.allSettled(deliveryPromises)
  }

  // Event an spezifischen Endpoint senden
  private async sendToEndpoint(endpoint: WebhookEndpoint, event: WebhookEvent): Promise<void> {
    const maxRetries = 3

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const payload = {
          id: event.id,
          event: event.event,
          data: event.data,
          timestamp: event.timestamp.toISOString(),
        }

        const signature = this.generateSignature(JSON.stringify(payload), endpoint.secret)

        const response = await fetch(endpoint.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-Signature": signature,
            "X-Webhook-Event": event.event,
            "User-Agent": "XP-Share-Webhooks/1.0",
          },
          body: JSON.stringify(payload),
        })

        if (response.ok) {
          event.status = "delivered"
          console.log(`Webhook delivered to ${endpoint.url}`)
          return
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
      } catch (error) {
        console.error(`Webhook delivery failed (attempt ${attempt + 1}):`, error)

        if (attempt === maxRetries) {
          event.status = "failed"
          event.retries = attempt + 1

          // Optional: Dead Letter Queue für fehlgeschlagene Events
          this.handleFailedDelivery(endpoint, event, error as Error)
        } else {
          // Exponential backoff
          await this.delay(Math.pow(2, attempt) * 1000)
        }
      }
    }
  }

  // Signatur für Webhook-Verifizierung generieren
  private generateSignature(payload: string, secret: string): string {
    const crypto = require("crypto")
    return crypto.createHmac("sha256", secret).update(payload).digest("hex")
  }

  // Fehlgeschlagene Lieferung behandeln
  private handleFailedDelivery(endpoint: WebhookEndpoint, event: WebhookEvent, error: Error): void {
    console.error(`Webhook permanently failed for ${endpoint.url}:`, {
      eventId: event.id,
      event: event.event,
      error: error.message,
      retries: event.retries,
    })

    // Optional: Endpoint deaktivieren nach zu vielen Fehlern
    // Optional: Admin-Benachrichtigung senden
  }

  // Hilfsfunktionen
  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  private generateSecret(): string {
    const crypto = require("crypto")
    return crypto.randomBytes(32).toString("hex")
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // Webhook-Status abrufen
  getEndpoints(): WebhookEndpoint[] {
    return Array.from(this.endpoints.values())
  }

  getEndpoint(id: string): WebhookEndpoint | undefined {
    return this.endpoints.get(id)
  }

  // Webhook testen
  async testEndpoint(id: string): Promise<boolean> {
    const endpoint = this.endpoints.get(id)
    if (!endpoint) return false

    try {
      await this.sendEvent("webhook.test", {
        message: "Test-Event von XP-Share",
        timestamp: new Date().toISOString(),
      })
      return true
    } catch (error) {
      console.error("Webhook-Test fehlgeschlagen:", error)
      return false
    }
  }
}

export const webhookManager = new WebhookManager()

// Vordefinierte Events
export const WEBHOOK_EVENTS = {
  USER_REGISTERED: "user.registered",
  USER_UPDATED: "user.updated",
  EXPERIENCE_CREATED: "experience.created",
  EXPERIENCE_UPDATED: "experience.updated",
  EXPERIENCE_DELETED: "experience.deleted",
  COMMENT_CREATED: "comment.created",
  ACHIEVEMENT_UNLOCKED: "achievement.unlocked",
  MESSAGE_SENT: "message.sent",
} as const
