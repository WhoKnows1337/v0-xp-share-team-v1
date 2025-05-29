"use client"

import { useState, useEffect } from "react"
import { optimizedImageLoader } from "@/lib/optimized-image-loader"
import { performanceService } from "@/lib/performance-service"

interface UseOptimizedImageOptions {
  preload?: boolean
  placeholder?: string
  onLoad?: (src: string, duration: number) => void
  onError?: (error: Error) => void
}

/**
 * Hook für die Verwendung des optimierten Image-Loaders
 */
export function useOptimizedImage(src: string | null | undefined, options: UseOptimizedImageOptions = {}) {
  const [imageSrc, setImageSrc] = useState<string | null>(options.placeholder || null)
  const [isLoading, setIsLoading] = useState<boolean>(!!src)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!src) {
      setImageSrc(options.placeholder || null)
      setIsLoading(false)
      setError(null)
      return
    }

    setIsLoading(true)

    const startTime = performance.now()

    optimizedImageLoader
      .loadImage(src)
      .then((loadedSrc) => {
        setImageSrc(loadedSrc)
        setIsLoading(false)

        const duration = performance.now() - startTime
        performanceService.measureResourceLoad(src, duration)

        if (options.onLoad) {
          options.onLoad(loadedSrc, duration)
        }
      })
      .catch((err) => {
        setImageSrc(options.placeholder || null)
        setIsLoading(false)
        setError(err)

        if (options.onError) {
          options.onError(err)
        }
      })
  }, [src, options.placeholder, options.onLoad, options.onError])

  // Preload-Funktion
  const preload = (imageSrc: string) => {
    optimizedImageLoader.preloadImage(imageSrc)
  }

  // Preload das Bild, wenn die Option gesetzt ist
  useEffect(() => {
    if (options.preload && src) {
      optimizedImageLoader.preloadImage(src)
    }
  }, [src, options.preload])

  return { imageSrc, isLoading, error, preload }
}
