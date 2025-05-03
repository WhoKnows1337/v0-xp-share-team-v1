"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { trackingService, type TrackingEventType } from "@/lib/tracking-service"
import { getCurrentUser } from "@/lib/mock-users"

export function useTracking() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Automatisches Tracking von Seitenaufrufen
  useEffect(() => {
    // Setze User ID, wenn ein Benutzer angemeldet ist
    const currentUser = getCurrentUser()
    if (currentUser?.id) {
      trackingService.setUserId(currentUser.id)
    }

    // Tracke Seitenaufruf
    const title = document.title
    trackingService.trackPageView(pathname, title)

    // Tracke URL-Parameter
    if (searchParams && searchParams.toString()) {
      const params = Object.fromEntries(searchParams.entries())
      trackingService.track("page_view_params", { pathname, params })
    }
  }, [pathname, searchParams])

  // Scroll-Tracking
  useEffect(() => {
    let lastScrollY = 0
    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      clearTimeout(scrollTimeout)

      scrollTimeout = setTimeout(() => {
        const scrollY = window.scrollY
        const scrollHeight = document.documentElement.scrollHeight
        const clientHeight = document.documentElement.clientHeight
        const scrollPercentage = Math.round((scrollY / (scrollHeight - clientHeight)) * 100)

        // Nur tracken, wenn sich der Scroll signifikant geändert hat
        if (Math.abs(scrollY - lastScrollY) > 200 || scrollPercentage === 100) {
          trackingService.track("scroll", {
            scrollY,
            scrollPercentage,
            path: pathname,
          })
          lastScrollY = scrollY
        }
      }, 500)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  // Expose tracking methods
  return {
    trackClick: (elementId: string, elementType: string) => trackingService.trackClick(elementId, elementType),
    trackExperienceView: (experienceId: string, experienceTitle: string) =>
      trackingService.trackExperienceView(experienceId, experienceTitle),
    trackExperienceCreate: (experienceId: string) => trackingService.trackExperienceCreate(experienceId),
    trackExperienceLike: (experienceId: string) => trackingService.trackExperienceLike(experienceId),
    trackExperienceComment: (experienceId: string) => trackingService.trackExperienceComment(experienceId),
    trackExperienceShare: (experienceId: string, shareMethod: string) =>
      trackingService.trackExperienceShare(experienceId, shareMethod),
    trackSearch: (query: string, resultsCount: number) => trackingService.trackSearch(query, resultsCount),
    trackEvent: (type: TrackingEventType, data?: Record<string, any>) => trackingService.track(type, data),
  }
}
