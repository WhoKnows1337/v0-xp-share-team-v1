"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useOptimizedImage } from "@/hooks/use-optimized-image"
import { useRenderMetrics } from "@/hooks/use-performance"
import { Skeleton } from "@/components/ui/skeleton"

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  width?: number
  height?: number
  preload?: boolean
  placeholder?: string
  fallback?: React.ReactNode
  onLoad?: (duration: number) => void
  onError?: (error: Error) => void
  className?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  preload = false,
  placeholder,
  fallback,
  onLoad,
  onError,
  className,
  ...props
}: OptimizedImageProps) {
  useRenderMetrics("OptimizedImage")

  const [isVisible, setIsVisible] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  const { imageSrc, isLoading, error } = useOptimizedImage(isVisible ? src : null, {
    preload,
    placeholder,
    onLoad: (_, duration) => onLoad?.(duration),
    onError,
  })

  // Verwende Intersection Observer, um das Bild erst zu laden, wenn es sichtbar ist
  useEffect(() => {
    if (!imgRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "200px" }, // Lade das Bild, wenn es 200px vor dem Sichtbereich ist
    )

    observer.observe(imgRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  if (error && fallback) {
    return <>{fallback}</>
  }

  return (
    <div
      ref={imgRef}
      className="relative"
      style={{ width: width ? `${width}px` : "auto", height: height ? `${height}px` : "auto" }}
    >
      {isLoading && (
        <Skeleton
          className={className}
          style={{ width: width ? `${width}px` : "100%", height: height ? `${height}px` : "100%" }}
        />
      )}

      {imageSrc && (
        <img
          src={imageSrc || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          className={className}
          style={{ display: isLoading ? "none" : "block" }}
          {...props}
        />
      )}
    </div>
  )
}
