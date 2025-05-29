import { lazy } from "react"

// Lazy Loading für schwere Komponenten
export const LazyDashboard = lazy(() =>
  import("@/components/dashboard/dashboard").then((m) => ({ default: m.Dashboard })),
)

export const LazyEntdeckenPage = lazy(() =>
  import("@/components/entdecken/entdecken-page").then((m) => ({ default: m.EntdeckenPage })),
)

export const LazyXPBuch = lazy(() =>
  import("@/components/xp-buch/xp-buch-layout").then((m) => ({ default: m.XPBuchLayout })),
)

export const LazyNexusPage = lazy(() => import("@/components/nexus/nexus-page").then((m) => ({ default: m.NexusPage })))

export const LazyCommunityPage = lazy(() =>
  import("@/components/community/community-page").then((m) => ({ default: m.CommunityPage })),
)

export const LazyProfilePage = lazy(() =>
  import("@/components/profil/benutzer-profil").then((m) => ({ default: m.BenutzerProfil })),
)

export const LazyErlebnisDetail = lazy(() =>
  import("@/components/erlebnis/erlebnis-detail").then((m) => ({ default: m.ErlebnisDetail })),
)

export const LazyAdminDashboard = lazy(() =>
  import("@/components/admin/tracking-dashboard").then((m) => ({ default: m.TrackingDashboard })),
)

// Preload-Funktionen für bessere UX
export const preloadDashboard = () => {
  const componentImport = () => import("@/components/dashboard/dashboard")
  return componentImport()
}

export const preloadEntdecken = () => {
  const componentImport = () => import("@/components/entdecken/entdecken-page")
  return componentImport()
}

export const preloadXPBuch = () => {
  const componentImport = () => import("@/components/xp-buch/xp-buch-layout")
  return componentImport()
}

// Route-basiertes Preloading
export const routePreloadMap = {
  "/dashboard": preloadDashboard,
  "/entdecken": preloadEntdecken,
  "/xp-buch": preloadXPBuch,
} as const

// Intersection Observer für Lazy Loading von Bildern
export class LazyImageLoader {
  private observer: IntersectionObserver | null = null

  constructor() {
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement
              if (img.dataset.src) {
                img.src = img.dataset.src
                img.removeAttribute("data-src")
                this.observer?.unobserve(img)
              }
            }
          })
        },
        {
          rootMargin: "50px",
        },
      )
    }
  }

  observe(element: HTMLImageElement) {
    if (this.observer) {
      this.observer.observe(element)
    }
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect()
    }
  }
}

export const lazyImageLoader = new LazyImageLoader()
