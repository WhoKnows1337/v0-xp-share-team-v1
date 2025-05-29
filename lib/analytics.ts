interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  userId?: string
  timestamp?: Date
}

interface UserSession {
  sessionId: string
  userId?: string
  startTime: Date
  lastActivity: Date
  pageViews: number
  events: AnalyticsEvent[]
}

class PrivacyFirstAnalytics {
  private sessions = new Map<string, UserSession>()
  private consentGiven = false

  // Einverständnis prüfen
  setConsent(consent: boolean) {
    this.consentGiven = consent
    if (!consent) {
      this.clearAllData()
    }
  }

  // Event tracken (nur mit Einverständnis)
  track(event: string, properties?: Record<string, any>, userId?: string) {
    if (!this.consentGiven) return

    const sessionId = this.getSessionId()
    const session = this.getOrCreateSession(sessionId)

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: this.sanitizeProperties(properties),
      userId: userId ? this.hashUserId(userId) : undefined,
      timestamp: new Date(),
    }

    session.events.push(analyticsEvent)
    session.lastActivity = new Date()

    // Lokale Speicherung (keine externen Services)
    this.saveToLocalStorage(sessionId, session)
  }

  // Seitenaufruf tracken
  trackPageView(path: string, userId?: string) {
    this.track("page_view", { path }, userId)
  }

  // Benutzerinteraktion tracken
  trackInteraction(element: string, action: string, userId?: string) {
    this.track("user_interaction", { element, action }, userId)
  }

  // Fehler tracken
  trackError(error: string, context?: Record<string, any>) {
    this.track("error", { error, context })
  }

  // Session-Management
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem("analytics_session")
    if (!sessionId) {
      sessionId = this.generateSessionId()
      sessionStorage.setItem("analytics_session", sessionId)
    }
    return sessionId
  }

  private getOrCreateSession(sessionId: string): UserSession {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        sessionId,
        startTime: new Date(),
        lastActivity: new Date(),
        pageViews: 0,
        events: [],
      })
    }
    return this.sessions.get(sessionId)!
  }

  // Datenschutz-Funktionen
  private hashUserId(userId: string): string {
    // Einfacher Hash für Anonymisierung
    let hash = 0
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // 32-bit integer
    }
    return hash.toString(36)
  }

  private sanitizeProperties(properties?: Record<string, any>): Record<string, any> {
    if (!properties) return {}

    // Entferne persönliche Daten
    const sanitized = { ...properties }
    const sensitiveKeys = ["email", "phone", "address", "name", "password"]

    sensitiveKeys.forEach((key) => {
      if (key in sanitized) {
        delete sanitized[key]
      }
    })

    return sanitized
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  private saveToLocalStorage(sessionId: string, session: UserSession) {
    try {
      const data = JSON.stringify(session)
      localStorage.setItem(`analytics_${sessionId}`, data)
    } catch (error) {
      console.warn("Analytics: Lokale Speicherung fehlgeschlagen", error)
    }
  }

  private clearAllData() {
    this.sessions.clear()
    sessionStorage.removeItem("analytics_session")

    // Alle Analytics-Daten aus localStorage entfernen
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("analytics_")) {
        localStorage.removeItem(key)
      }
    })
  }

  // Berichte generieren
  generateReport(): {
    totalSessions: number
    totalEvents: number
    topEvents: Array<{ event: string; count: number }>
    averageSessionDuration: number
  } {
    if (!this.consentGiven) {
      return {
        totalSessions: 0,
        totalEvents: 0,
        topEvents: [],
        averageSessionDuration: 0,
      }
    }

    const sessions = Array.from(this.sessions.values())
    const allEvents = sessions.flatMap((s) => s.events)

    // Event-Häufigkeiten
    const eventCounts = new Map<string, number>()
    allEvents.forEach((event) => {
      eventCounts.set(event.event, (eventCounts.get(event.event) || 0) + 1)
    })

    const topEvents = Array.from(eventCounts.entries())
      .map(([event, count]) => ({ event, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Durchschnittliche Session-Dauer
    const totalDuration = sessions.reduce((sum, session) => {
      return sum + (session.lastActivity.getTime() - session.startTime.getTime())
    }, 0)

    const averageSessionDuration =
      sessions.length > 0
        ? totalDuration / sessions.length / 1000 / 60 // in Minuten
        : 0

    return {
      totalSessions: sessions.length,
      totalEvents: allEvents.length,
      topEvents,
      averageSessionDuration,
    }
  }
}

export const analytics = new PrivacyFirstAnalytics()

// React Hook für Analytics
export function useAnalytics() {
  const trackEvent = (event: string, properties?: Record<string, any>) => {
    analytics.track(event, properties)
  }

  const trackPageView = (path: string) => {
    analytics.trackPageView(path)
  }

  const trackInteraction = (element: string, action: string) => {
    analytics.trackInteraction(element, action)
  }

  return {
    trackEvent,
    trackPageView,
    trackInteraction,
  }
}
