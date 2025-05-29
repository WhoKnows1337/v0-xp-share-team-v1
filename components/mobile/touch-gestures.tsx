"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface TouchGestureProps {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onPinch?: (scale: number) => void
  onDoubleTap?: () => void
  children: React.ReactNode
  className?: string
}

export function TouchGesture({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinch,
  onDoubleTap,
  children,
  className,
}: TouchGestureProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [lastTap, setLastTap] = useState<number>(0)
  const [initialDistance, setInitialDistance] = useState<number>(0)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        setTouchStart({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        })
      } else if (e.touches.length === 2 && onPinch) {
        const distance = Math.sqrt(
          Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
            Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2),
        )
        setInitialDistance(distance)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && onPinch && initialDistance > 0) {
        const currentDistance = Math.sqrt(
          Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
            Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2),
        )
        const scale = currentDistance / initialDistance
        onPinch(scale)
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart || e.touches.length > 0) return

      const touchEnd = e.changedTouches[0]
      const deltaX = touchEnd.clientX - touchStart.x
      const deltaY = touchEnd.clientY - touchStart.y
      const minSwipeDistance = 50

      // Doppeltipp-Erkennung
      const now = Date.now()
      if (onDoubleTap && now - lastTap < 300) {
        onDoubleTap()
        setLastTap(0)
        return
      }
      setLastTap(now)

      // Swipe-Erkennung
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontaler Swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight()
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft()
          }
        }
      } else {
        // Vertikaler Swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown()
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp()
          }
        }
      }

      setTouchStart(null)
      setInitialDistance(0)
    }

    element.addEventListener("touchstart", handleTouchStart, { passive: true })
    element.addEventListener("touchmove", handleTouchMove, { passive: true })
    element.addEventListener("touchend", handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener("touchstart", handleTouchStart)
      element.removeEventListener("touchmove", handleTouchMove)
      element.removeEventListener("touchend", handleTouchEnd)
    }
  }, [touchStart, lastTap, initialDistance, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onPinch, onDoubleTap])

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  )
}
