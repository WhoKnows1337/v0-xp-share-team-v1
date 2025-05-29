/**
 * Optimierter Image-Loader für die Anwendung
 */
class OptimizedImageLoader {
  private cache: Map<string, string> = new Map()
  private loadingPromises: Map<string, Promise<string>> = new Map()
  private preloadQueue: string[] = []
  private isPreloading = false
  private maxCacheSize = 100

  /**
   * Lädt ein Bild und gibt die URL zurück
   */
  async loadImage(src: string): Promise<string> {
    // Prüfe, ob das Bild bereits im Cache ist
    if (this.cache.has(src)) {
      return this.cache.get(src)!
    }

    // Prüfe, ob das Bild bereits geladen wird
    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src)!
    }

    // Lade das Bild
    const promise = new Promise<string>((resolve, reject) => {
      const img = new Image()

      img.onload = () => {
        // Füge das Bild zum Cache hinzu
        this.cache.set(src, src)

        // Entferne das Promise aus der Map
        this.loadingPromises.delete(src)

        // Prüfe, ob der Cache zu groß ist
        if (this.cache.size > this.maxCacheSize) {
          // Entferne das älteste Element
          const firstKey = this.cache.keys().next().value
          this.cache.delete(firstKey)
        }

        resolve(src)
      }

      img.onerror = () => {
        // Entferne das Promise aus der Map
        this.loadingPromises.delete(src)

        reject(new Error(`Failed to load image: ${src}`))
      }

      img.src = src
    })

    this.loadingPromises.set(src, promise)

    return promise
  }

  /**
   * Fügt ein Bild zur Preload-Warteschlange hinzu
   */
  preloadImage(src: string): void {
    if (!this.cache.has(src) && !this.loadingPromises.has(src) && !this.preloadQueue.includes(src)) {
      this.preloadQueue.push(src)
      this.processPreloadQueue()
    }
  }

  /**
   * Verarbeitet die Preload-Warteschlange
   */
  private async processPreloadQueue(): Promise<void> {
    if (this.isPreloading || this.preloadQueue.length === 0) {
      return
    }

    this.isPreloading = true

    while (this.preloadQueue.length > 0) {
      const src = this.preloadQueue.shift()!

      try {
        await this.loadImage(src)
      } catch (error) {
        console.error(`Failed to preload image: ${src}`, error)
      }
    }

    this.isPreloading = false
  }

  /**
   * Löscht den Cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Setzt die maximale Cache-Größe
   */
  setMaxCacheSize(size: number): void {
    this.maxCacheSize = size
  }

  /**
   * Gibt die aktuelle Cache-Größe zurück
   */
  getCacheSize(): number {
    return this.cache.size
  }

  /**
   * Prüft, ob ein Bild im Cache ist
   */
  isImageCached(src: string): boolean {
    return this.cache.has(src)
  }
}

// Singleton-Instanz exportieren
export const optimizedImageLoader = new OptimizedImageLoader()
