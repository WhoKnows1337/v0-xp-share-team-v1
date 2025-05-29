/**
 * Performance-Service für die Überwachung und Optimierung der Anwendungsleistung
 */
class PerformanceService {
  private metrics: Record<string, number[]> = {}
  private marks: Record<string, number> = {}
  private enabled = true

  /**
   * Aktiviert oder deaktiviert die Performance-Überwachung
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  /**
   * Setzt eine Markierung für die Zeitmessung
   */
  mark(name: string): void {
    if (!this.enabled) return

    this.marks[name] = performance.now()
  }

  /**
   * Misst die Zeit zwischen zwei Markierungen
   */
  measure(name: string, startMark: string, endMark?: string): number | null {
    if (!this.enabled) return null

    const start = this.marks[startMark]
    if (!start) {
      console.warn(`Start mark "${startMark}" not found`)
      return null
    }

    const end = endMark ? this.marks[endMark] : performance.now()
    if (endMark && !end) {
      console.warn(`End mark "${endMark}" not found`)
      return null
    }

    const duration = end - start

    if (!this.metrics[name]) {
      this.metrics[name] = []
    }

    this.metrics[name].push(duration)

    return duration
  }

  /**
   * Gibt die Metriken für eine bestimmte Messung zurück
   */
  getMetrics(name: string): { min: number; max: number; avg: number; count: number } | null {
    if (!this.metrics[name] || this.metrics[name].length === 0) {
      return null
    }

    const values = this.metrics[name]
    const sum = values.reduce((acc, val) => acc + val, 0)

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: sum / values.length,
      count: values.length,
    }
  }

  /**
   * Gibt alle Metriken zurück
   */
  getAllMetrics(): Record<string, { min: number; max: number; avg: number; count: number }> {
    const result: Record<string, { min: number; max: number; avg: number; count: number }> = {}

    for (const name in this.metrics) {
      const metrics = this.getMetrics(name)
      if (metrics) {
        result[name] = metrics
      }
    }

    return result
  }

  /**
   * Löscht alle Metriken
   */
  clearMetrics(): void {
    this.metrics = {}
    this.marks = {}
  }

  /**
   * Misst die Ladezeit einer Ressource
   */
  measureResourceLoad(resource: string, callback: (duration: number) => void): void {
    if (!this.enabled) return

    const start = performance.now()

    if (resource.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      const img = new Image()
      img.onload = () => {
        const duration = performance.now() - start
        if (!this.metrics[`resource:${resource}`]) {
          this.metrics[`resource:${resource}`] = []
        }
        this.metrics[`resource:${resource}`].push(duration)
        callback(duration)
      }
      img.src = resource
    } else {
      fetch(resource)
        .then(() => {
          const duration = performance.now() - start
          if (!this.metrics[`resource:${resource}`]) {
            this.metrics[`resource:${resource}`] = []
          }
          this.metrics[`resource:${resource}`].push(duration)
          callback(duration)
        })
        .catch((error) => {
          console.error(`Failed to load resource ${resource}:`, error)
        })
    }
  }

  /**
   * Misst die Renderzeit einer Komponente
   */
  measureRender(componentName: string, startTime: number): void {
    if (!this.enabled) return

    const duration = performance.now() - startTime

    if (!this.metrics[`render:${componentName}`]) {
      this.metrics[`render:${componentName}`] = []
    }

    this.metrics[`render:${componentName}`].push(duration)
  }
}

// Singleton-Instanz exportieren
export const performanceService = new PerformanceService()
