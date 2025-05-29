// Service Worker für Caching
export const registerServiceWorker = async () => {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js")
      console.log("Service Worker registriert:", registration)
      return registration
    } catch (error) {
      console.error("Service Worker Registrierung fehlgeschlagen:", error)
    }
  }
}

// Memory Cache für API-Responses
class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  set(key: string, data: any, ttl: number = 5 * 60 * 1000) {
    // Standard TTL: 5 Minuten
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  get(key: string) {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear() {
    this.cache.clear()
  }

  delete(key: string) {
    this.cache.delete(key)
  }

  size() {
    return this.cache.size
  }
}

export const memoryCache = new MemoryCache()

// Local Storage Cache mit Expiration
export class LocalStorageCache {
  private prefix = "xp_share_cache_"

  set(key: string, data: any, ttl: number = 24 * 60 * 60 * 1000) {
    // Standard TTL: 24 Stunden
    try {
      const item = {
        data,
        timestamp: Date.now(),
        ttl,
      }
      localStorage.setItem(this.prefix + key, JSON.stringify(item))
    } catch (error) {
      console.warn("LocalStorage Cache Fehler:", error)
    }
  }

  get(key: string) {
    try {
      const itemStr = localStorage.getItem(this.prefix + key)
      if (!itemStr) return null

      const item = JSON.parse(itemStr)
      if (Date.now() - item.timestamp > item.ttl) {
        this.delete(key)
        return null
      }

      return item.data
    } catch (error) {
      console.warn("LocalStorage Cache Fehler:", error)
      return null
    }
  }

  delete(key: string) {
    localStorage.removeItem(this.prefix + key)
  }

  clear() {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(this.prefix))
      .forEach((key) => localStorage.removeItem(key))
  }
}

export const localStorageCache = new LocalStorageCache()

// Image Caching mit IndexedDB
export class ImageCache {
  private dbName = "xp_share_images"
  private version = 1
  private db: IDBDatabase | null = null

  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains("images")) {
          const store = db.createObjectStore("images", { keyPath: "url" })
          store.createIndex("timestamp", "timestamp")
        }
      }
    })
  }

  async cacheImage(url: string, blob: Blob) {
    if (!this.db) await this.init()

    return new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction(["images"], "readwrite")
      const store = transaction.objectStore("images")

      const item = {
        url,
        blob,
        timestamp: Date.now(),
      }

      const request = store.put(item)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getImage(url: string): Promise<Blob | null> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["images"], "readonly")
      const store = transaction.objectStore("images")
      const request = store.get(url)

      request.onsuccess = () => {
        const result = request.result
        if (result && Date.now() - result.timestamp < 7 * 24 * 60 * 60 * 1000) {
          // 7 Tage TTL
          resolve(result.blob)
        } else {
          resolve(null)
        }
      }
      request.onerror = () => reject(request.error)
    })
  }
}

export const imageCache = new ImageCache()
