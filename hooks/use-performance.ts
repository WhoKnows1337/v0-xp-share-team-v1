"use client"

import { useEffect, useRef } from "react"
import { performanceService } from "@/lib/performance-service"

/**
 * Hook für die Messung der Renderzeit einer Komponente
 */
export function useRenderMetrics(componentName: string) {
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    startTimeRef.current = performance.now()

    return () => {
      performanceService.measureRender(componentName, startTimeRef.current)
    }
  }, [componentName])
}

/**
 * Hook für die Messung der Zeit zwischen zwei Punkten
 */
export function usePerformanceMeasure() {
  const mark = (name: string) => {
    performanceService.mark(name)
  }

  const measure = (name: string, startMark: string, endMark?: string) => {
    return performanceService.measure(name, startMark, endMark)
  }

  return { mark, measure }
}

/**
 * Hook für die Messung der Ladezeit einer Ressource
 */
export function useResourceLoad() {
  const measureResourceLoad = (resource: string, callback: (duration: number) => void) => {
    performanceService.measureResourceLoad(resource, callback)
  }

  return { measureResourceLoad }
}

/**
 * Hook für den Zugriff auf alle Performance-Metriken
 */
export function usePerformanceMetrics() {
  const getMetrics = (name: string) => {
    return performanceService.getMetrics(name)
  }

  const getAllMetrics = () => {
    return performanceService.getAllMetrics()
  }

  const clearMetrics = () => {
    performanceService.clearMetrics()
  }

  return { getMetrics, getAllMetrics, clearMetrics }
}
