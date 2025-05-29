"use client"

export interface OfflineAction {
  id: string
  type: "create" | "update" | "delete"
  entity: "experience" | "xp_entry" | "comment" | "like"
  data: any
  timestamp: string
  synced: boolean
}

class OfflineService {
  private readonly STORAGE_KEY = "xp_share_offline_actions"
  private readonly DATA_KEY = "xp_share_offline_data"

  // Speichert eine Aktion für die spätere Synchronisation
  async queueAction(action: Omit<OfflineAction, "id" | "timestamp" | "synced">) {
    const offlineAction: OfflineAction = {
      ...action,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      synced: false,
    }

    const actions = this.getQueuedActions()
    actions.push(offlineAction)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(actions))

    return offlineAction
  }

  // Holt alle wartenden Aktionen
  getQueuedActions(): OfflineAction[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Fehler beim Laden der Offline-Aktionen:", error)
      return []
    }
  }

  // Markiert eine Aktion als synchronisiert
  markActionSynced(actionId: string) {
    const actions = this.getQueuedActions()
    const updatedActions = actions.map((action) => (action.id === actionId ? { ...action, synced: true } : action))
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedActions))
  }

  // Entfernt synchronisierte Aktionen
  clearSyncedActions() {
    const actions = this.getQueuedActions()
    const pendingActions = actions.filter((action) => !action.synced)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(pendingActions))
  }

  // Synchronisiert alle wartenden Aktionen
  async syncActions() {
    const actions = this.getQueuedActions()
    const pendingActions = actions.filter((action) => !action.synced)

    for (const action of pendingActions) {
      try {
        await this.syncSingleAction(action)
        this.markActionSynced(action.id)
      } catch (error) {
        console.error(`Fehler beim Synchronisieren der Aktion ${action.id}:`, error)
      }
    }

    this.clearSyncedActions()
  }

  // Synchronisiert eine einzelne Aktion
  private async syncSingleAction(action: OfflineAction) {
    const endpoint = this.getEndpointForAction(action)
    const method = this.getMethodForAction(action)

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action.data),
    })

    if (!response.ok) {
      throw new Error(`Synchronisation fehlgeschlagen: ${response.statusText}`)
    }

    return response.json()
  }

  // Bestimmt den Endpoint für eine Aktion
  private getEndpointForAction(action: OfflineAction): string {
    const baseUrl = "/api"

    switch (action.entity) {
      case "experience":
        return action.type === "create" ? `${baseUrl}/experiences` : `${baseUrl}/experiences/${action.data.id}`
      case "xp_entry":
        return action.type === "create" ? `${baseUrl}/xp-entries` : `${baseUrl}/xp-entries/${action.data.id}`
      case "comment":
        return action.type === "create" ? `${baseUrl}/comments` : `${baseUrl}/comments/${action.data.id}`
      case "like":
        return `${baseUrl}/likes`
      default:
        throw new Error(`Unbekannte Entität: ${action.entity}`)
    }
  }

  // Bestimmt die HTTP-Methode für eine Aktion
  private getMethodForAction(action: OfflineAction): string {
    switch (action.type) {
      case "create":
        return "POST"
      case "update":
        return "PUT"
      case "delete":
        return "DELETE"
      default:
        throw new Error(`Unbekannter Aktionstyp: ${action.type}`)
    }
  }

  // Speichert Daten für Offline-Verwendung
  cacheData(key: string, data: any) {
    try {
      const cache = this.getCachedData()
      cache[key] = {
        data,
        timestamp: new Date().toISOString(),
      }
      localStorage.setItem(this.DATA_KEY, JSON.stringify(cache))
    } catch (error) {
      console.error("Fehler beim Cachen der Daten:", error)
    }
  }

  // Holt gecachte Daten
  getCachedData(key?: string) {
    try {
      const stored = localStorage.getItem(this.DATA_KEY)
      const cache = stored ? JSON.parse(stored) : {}

      if (key) {
        return cache[key]?.data || null
      }

      return cache
    } catch (error) {
      console.error("Fehler beim Laden der gecachten Daten:", error)
      return key ? null : {}
    }
  }

  // Prüft, ob Daten veraltet sind
  isCacheStale(key: string, maxAge: number = 5 * 60 * 1000): boolean {
    const cached = this.getCachedData()
    const item = cached[key]

    if (!item) return true

    const age = Date.now() - new Date(item.timestamp).getTime()
    return age > maxAge
  }

  // Löscht veraltete Cache-Einträge
  clearStaleCache(maxAge: number = 24 * 60 * 60 * 1000) {
    try {
      const cache = this.getCachedData()
      const now = Date.now()

      Object.keys(cache).forEach((key) => {
        const item = cache[key]
        const age = now - new Date(item.timestamp).getTime()

        if (age > maxAge) {
          delete cache[key]
        }
      })

      localStorage.setItem(this.DATA_KEY, JSON.stringify(cache))
    } catch (error) {
      console.error("Fehler beim Löschen des veralteten Caches:", error)
    }
  }

  // Prüft den Online-Status
  isOnline(): boolean {
    return navigator.onLine
  }

  // Registriert Event-Listener für Online/Offline-Events
  setupEventListeners() {
    window.addEventListener("online", () => {
      console.log("Verbindung wiederhergestellt - synchronisiere Daten...")
      this.syncActions()
    })

    window.addEventListener("offline", () => {
      console.log("Verbindung verloren - Offline-Modus aktiviert")
    })
  }

  // Holt die Anzahl wartender Aktionen
  getPendingActionsCount(): number {
    return this.getQueuedActions().filter((action) => !action.synced).length
  }

  // Löscht alle Offline-Daten
  clearAllData() {
    localStorage.removeItem(this.STORAGE_KEY)
    localStorage.removeItem(this.DATA_KEY)
  }
}

export const offlineService = new OfflineService()
