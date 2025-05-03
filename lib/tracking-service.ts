// Typen für Tracking-Events
export type TrackingEventType =
  | "page_view"
  | "click"
  | "scroll"
  | "experience_view"
  | "experience_create"
  | "experience_like"
  | "experience_comment"
  | "experience_share"
  | "search"
  | "signup"
  | "login"
  | "logout"

export interface TrackingEvent {
  type: TrackingEventType
  timestamp: number
  userId?: string
  sessionId: string
  data?: Record<string, any>
}

// Mock-Implementierung eines Tracking-Services
class TrackingService {
  private events: TrackingEvent[] = []
  private sessionId: string
  private userId?: string
  private isEnabled = true

  constructor() {
    // Generiere eine einfache Session-ID
    this.sessionId = `session_${Math.random().toString(36).substring(2, 15)}`
    console.log("Tracking Session gestartet:", this.sessionId)
  }

  // Benutzer-ID setzen (nach Login)
  setUserId(userId: string) {
    this.userId = userId
    console.log("Tracking User ID gesetzt:", userId)
  }

  // Tracking aktivieren/deaktivieren (für Datenschutzeinstellungen)
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled
    console.log("Tracking ist jetzt:", enabled ? "aktiviert" : "deaktiviert")
  }

  // Event tracken
  track(type: TrackingEventType, data?: Record<string, any>) {
    if (!this.isEnabled) return

    const event: TrackingEvent = {
      type,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      data,
    }

    this.events.push(event)

    // In einer echten Implementierung würden wir das Event an einen Server senden
    // Hier loggen wir es nur in die Konsole
    console.log("Tracking Event:", event)

    // Simuliere das Senden an einen Server
    this.sendToServer(event)
  }

  // Simuliere das Senden an einen Server
  private sendToServer(event: TrackingEvent) {
    // In einer echten Implementierung würde hier ein API-Aufruf stehen
    // Für die Demo verzögern wir nur ein wenig
    setTimeout(() => {
      console.log("Event an Server gesendet:", event.type)
    }, 500)
  }

  // Hole alle Events (nur für Demo-Zwecke)
  getEvents() {
    return this.events
  }

  // Tracking für Seitenaufrufe
  trackPageView(path: string, title: string) {
    this.track("page_view", { path, title })
  }

  // Tracking für Klicks
  trackClick(elementId: string, elementType: string) {
    this.track("click", { elementId, elementType })
  }

  // Tracking für Erlebnis-Ansichten
  trackExperienceView(experienceId: string, experienceTitle: string) {
    this.track("experience_view", { experienceId, experienceTitle })
  }

  // Tracking für Erlebnis-Erstellung
  trackExperienceCreate(experienceId: string) {
    this.track("experience_create", { experienceId })
  }

  // Tracking für Erlebnis-Likes
  trackExperienceLike(experienceId: string) {
    this.track("experience_like", { experienceId })
  }

  // Tracking für Erlebnis-Kommentare
  trackExperienceComment(experienceId: string) {
    this.track("experience_comment", { experienceId })
  }

  // Tracking für Erlebnis-Teilen
  trackExperienceShare(experienceId: string, shareMethod: string) {
    this.track("experience_share", { experienceId, shareMethod })
  }

  // Tracking für Suchen
  trackSearch(query: string, resultsCount: number) {
    this.track("search", { query, resultsCount })
  }
}

// Singleton-Instanz exportieren
export const trackingService = new TrackingService()
