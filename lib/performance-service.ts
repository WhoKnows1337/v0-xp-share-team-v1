"use client"

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  interactionTime: number
  memoryUsage: number
  cacheHitRate: number
}

class PerformanceService {
  private metrics: PerformanceMetrics = {
    loadTime: 0,
    renderTime: 0,
    interactionTime: 0,
    memoryUsage: 0,
    cacheHitRate: 0,
  }

  private observers: PerformanceObserver[] = []

  // Initialisiert Performance-Monitoring
  init() {
    this.setupPerformanceObservers()
    this.measureInitialLoad()
    this.setupMemoryMonitoring()
  }

  // Setzt Performance-Observer auf
  private setupPerformanceObservers() {
    // Navigation Timing
    if ("PerformanceObserver" in window) {
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === "navigation") {
            const navEntry = entry as PerformanceNavigationTiming
            this.metrics.loadTime = navEntry.loadEventEnd - navEntry.loadEventStart
          }
        })
      })

      navObserver.observe({ entryTypes: ["navigation"] })
      this.observers.push(navObserver)

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.metrics.renderTime = lastEntry.startTime
      })

      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] })
      this.observers.push(lcpObserver)

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          this.metrics.interactionTime = entry.processingStart - entry.startTime
        })
      })

      fidObserver.observe({ entryTypes: ["first-input"] })
      this.observers.push(fidObserver)
    }
  }

  // Misst die initiale Ladezeit
  private measureInitialLoad() {
    if ("performance" in window && "timing" in performance) {
      const timing = performance.timing
      this.metrics.loadTime = timing.loadEventEnd - timing.navigationStart
    }
  }

  // Überwacht Speicherverbrauch
  private setupMemoryMonitoring() {
    if ("memory" in performance) {
      const memory = (performance as any).memory
      this.metrics.memoryUsage = memory.usedJSHeapSize / memory.totalJSHeapSize
    }

    // Überwache Speicher alle 30 Sekunden
    setInterval(() => {
      if ("memory" in performance) {
        const memory = (performance as any).memory
        this.metrics.memoryUsage = memory.usedJSHeapSize / memory.totalJSHeapSize

        // Warnung bei hohem Speicherverbrauch
        if (this.metrics.memoryUsage > 0.8) {
          console.warn("Hoher Speicherverbrauch erkannt:", this.metrics.memoryUsage)
        }
      }
    }, 30000)
  }

  // Misst die Zeit für eine bestimmte Operation
  measureOperation<T>(name: string, operation: () => T): T {
    const start = performance.now()
    const result = operation()
    const end = performance.now()

    console.log(`Operation "${name}" dauerte ${end - start} Millisekunden`)
    return result
  }

  // Misst die Zeit für eine asynchrone Operation
  async measureAsyncOperation<T>(name: string, operation: () => Promise<T>): Promise<T> {
    const start = performance.now()
    const result = await operation()
    const end = performance.now()

    console.log(`Async Operation "${name}" dauerte ${end - start} Millisekunden`)
    return result
  }

  // Lazy Loading für Bilder
  setupLazyLoading() {
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.classList.remove("lazy")
              imageObserver.unobserve(img)
            }
          }
        })
      })

      // Beobachte alle Bilder mit lazy-Klasse
      document.querySelectorAll("img.lazy").forEach((img) => {
        imageObserver.observe(img)
      })
    }
  }

  // Preload kritischer Ressourcen
  preloadCriticalResources(urls: string[]) {
    urls.forEach((url) => {
      const link = document.createElement("link")
      link.rel = "preload"
      link.href = url

      // Bestimme den Ressourcentyp
      if (url.endsWith(".css")) {
        link.as = "style"
      } else if (url.endsWith(".js")) {
        link.as = "script"
      } else if (url.match(/\.(jpg|jpeg|png|webp|svg)$/)) {
        link.as = "image"
      }

      document.head.appendChild(link)
    })
  }

  // Optimiert Bilder für verschiedene Bildschirmgrößen
  getOptimizedImageUrl(baseUrl: string, width: number, quality = 80): string {
    // Hier würde normalerweise ein Bildoptimierungsservice verwendet
    return `${baseUrl}?w=${width}&q=${quality}`
  }

  // Bundle-Analyse
  analyzeBundleSize() {
    if ("performance" in window) {
      const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[]
      const jsResources = resources.filter((resource) => resource.name.endsWith(".js"))
      const cssResources = resources.filter((resource) => resource.name.endsWith(".css"))

      const totalJSSize = jsResources.reduce((total, resource) => total + (resource.transferSize || 0), 0)
      const totalCSSSize = cssResources.reduce((total, resource) => total + (resource.transferSize || 0), 0)

      console.log("Bundle-Analyse:", {
        jsFiles: jsResources.length,
        cssFiles: cssResources.length,
        totalJSSize: `${(totalJSSize / 1024).toFixed(2)} KB`,
        totalCSSSize: `${(totalCSSSize / 1024).toFixed(2)} KB`,
      })
    }
  }

  // Cache-Performance überwachen
  trackCachePerformance(cacheHits: number, totalRequests: number) {
    this.metrics.cacheHitRate = totalRequests > 0 ? cacheHits / totalRequests : 0
  }

  // Holt aktuelle Performance-Metriken
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  // Sendet Performance-Daten an Analytics
  reportMetrics() {
    const metrics = this.getMetrics()

    // Hier würde normalerweise an einen Analytics-Service gesendet
    console.log("Performance-Metriken:", metrics)

    // Beispiel für kritische Werte
    if (metrics.loadTime > 3000) {
      console.warn("Langsame Ladezeit erkannt:", metrics.loadTime)
    }

    if (metrics.renderTime > 2500) {
      console.warn("Langsame Renderzeit erkannt:", metrics.renderTime)
    }

    if (metrics.interactionTime > 100) {
      console.warn("Langsame Interaktionszeit erkannt:", metrics.interactionTime)
    }
  }

  // Cleanup
  cleanup() {
    this.observers.forEach((observer) => observer.disconnect())
    this.observers = []
  }
}

export const performanceService = new PerformanceService()
