// Code-Splitting Utilities
export const dynamicImport = (importFn: () => Promise<any>) => {
  return importFn()
}

// Chunk-basierte Imports
export const loadChunk = async (chunkName: string) => {
  switch (chunkName) {
    case "dashboard":
      return import("@/components/dashboard/dashboard")
    case "entdecken":
      return import("@/components/entdecken/entdecken-page")
    case "xp-buch":
      return import("@/components/xp-buch/xp-buch-layout")
    case "nexus":
      return import("@/components/nexus/nexus-page")
    case "community":
      return import("@/components/community/community-page")
    case "admin":
      return import("@/components/admin/tracking-dashboard")
    default:
      throw new Error(`Unknown chunk: ${chunkName}`)
  }
}

// Resource Hints für bessere Performance
export const addResourceHints = () => {
  if (typeof document === "undefined") return

  // Preconnect zu wichtigen Domains
  const preconnectDomains = ["https://fonts.googleapis.com", "https://fonts.gstatic.com"]

  preconnectDomains.forEach((domain) => {
    const link = document.createElement("link")
    link.rel = "preconnect"
    link.href = domain
    document.head.appendChild(link)
  })

  // DNS-Prefetch für externe Ressourcen
  const dnsPrefetchDomains = ["https://api.example.com"]

  dnsPrefetchDomains.forEach((domain) => {
    const link = document.createElement("link")
    link.rel = "dns-prefetch"
    link.href = domain
    document.head.appendChild(link)
  })
}

// Critical CSS Inlining
export const inlineCriticalCSS = () => {
  const criticalCSS = [
    "/* Critical CSS für Above-the-fold Content */",
    ".loading-skeleton {",
    "  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);",
    "  background-size: 200% 100%;",
    "  animation: loading 1.5s infinite;",
    "}",
    "",
    "@keyframes loading {",
    "  0% { background-position: 200% 0; }",
    "  100% { background-position: -200% 0; }",
    "}",
  ].join("\n")

  if (typeof document !== "undefined") {
    const style = document.createElement("style")
    style.textContent = criticalCSS
    document.head.appendChild(style)
  }
}

// Performance Monitoring Interface
interface PerformanceMetrics {
  [key: string]: number
}

interface WebVitals {
  fcp: number
  lcp: number
  tti: number
  tbt: number
}

// Performance Monitoring
export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {}

  startTiming(label: string): void {
    this.metrics[label] = performance.now()
  }

  endTiming(label: string): number {
    if (this.metrics[label]) {
      const duration = performance.now() - this.metrics[label]
      console.log(`${label}: ${duration.toFixed(2)}ms`)
      delete this.metrics[label]
      return duration
    }
    return 0
  }

  measureComponent(componentName: string, fn: () => void): void {
    this.startTiming(componentName)
    fn()
    this.endTiming(componentName)
  }

  getWebVitals(): WebVitals | null {
    if (typeof window !== "undefined" && "performance" in window) {
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming

      return {
        // First Contentful Paint
        fcp: performance.getEntriesByName("first-contentful-paint")[0]?.startTime || 0,
        // Largest Contentful Paint
        lcp: performance.getEntriesByName("largest-contentful-paint")[0]?.startTime || 0,
        // Time to Interactive
        tti: navigation.loadEventEnd - navigation.fetchStart,
        // Total Blocking Time
        tbt: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      }
    }
    return null
  }
}

export const performanceMonitor = new PerformanceMonitor()

// Bundle Analysis Utilities
export const analyzeBundleSize = () => {
  if (typeof window === "undefined") return null

  const scripts = Array.from(document.querySelectorAll("script[src]"))
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))

  return {
    scriptCount: scripts.length,
    styleCount: styles.length,
    totalResources: scripts.length + styles.length,
  }
}

// Lazy Loading Helper
export const createLazyLoader = (threshold = 0.1) => {
  if (typeof window === "undefined") return null

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement
          const src = target.dataset.src
          if (src) {
            target.setAttribute("src", src)
            target.removeAttribute("data-src")
          }
        }
      })
    },
    { threshold },
  )
}
