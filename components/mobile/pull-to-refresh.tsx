"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  className?: string
}

export function PullToRefresh({ onRefresh, children, className }: PullToRefreshProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [startY, setStartY] = useState(0)
  const maxPullDistance = 100
  const triggerDistance = 60

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop === 0) {
        setStartY(e.touches[0].clientY)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (startY === 0 || container.scrollTop > 0 || isRefreshing) return

      const currentY = e.touches[0].clientY
      const distance = Math.max(0, Math.min(maxPullDistance, currentY - startY))

      if (distance > 0) {
        e.preventDefault()
        setPullDistance(distance)
      }
    }

    const handleTouchEnd = async () => {
      if (pullDistance >= triggerDistance && !isRefreshing) {
        setIsRefreshing(true)
        try {
          await onRefresh()
        } finally {
          setIsRefreshing(false)
        }
      }

      setPullDistance(0)
      setStartY(0)
    }

    container.addEventListener("touchstart", handleTouchStart, { passive: true })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    container.addEventListener("touchend", handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [startY, pullDistance, isRefreshing, onRefresh])

  const pullProgress = Math.min(1, pullDistance / triggerDistance)
  const shouldTrigger = pullDistance >= triggerDistance

  return (
    <div ref={containerRef} className={cn("relative overflow-auto", className)}>
      {/* Pull-to-Refresh Indikator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-transform duration-200 ease-out z-10"
        style={{
          transform: `translateY(${Math.max(-40, pullDistance - 40)}px)`,
          opacity: pullDistance > 0 ? 1 : 0,
        }}
      >
        <div className="bg-background border rounded-full p-2 shadow-lg">
          <RefreshCw
            className={cn("h-5 w-5 transition-all duration-200", {
              "animate-spin": isRefreshing,
              "text-primary": shouldTrigger,
              "text-muted-foreground": !shouldTrigger,
            })}
            style={{
              transform: `rotate(${pullProgress * 180}deg)`,
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div
        className="transition-transform duration-200 ease-out"
        style={{
          transform: `translateY(${pullDistance}px)`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
