"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface ZeitStrahlProps {
  startDate: Date
  endDate: Date
  currentDate?: Date
  onDateChange?: (date: Date) => void
  className?: string
}

export function ZeitStrahl({ startDate, endDate, currentDate, onDateChange, className }: ZeitStrahlProps) {
  const [position, setPosition] = useState(0)
  const strahlRef = useRef<HTMLDivElement>(null)

  // Berechne die Position basierend auf dem aktuellen Datum
  useEffect(() => {
    if (!currentDate) return

    const totalDuration = endDate.getTime() - startDate.getTime()
    const currentDuration = currentDate.getTime() - startDate.getTime()
    const newPosition = (currentDuration / totalDuration) * 100

    setPosition(Math.max(0, Math.min(100, newPosition)))
  }, [currentDate, startDate, endDate])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!strahlRef.current || !onDateChange) return

    const rect = strahlRef.current.getBoundingClientRect()
    const clickPosition = (e.clientX - rect.left) / rect.width
    const newPosition = Math.max(0, Math.min(100, clickPosition * 100))

    const totalDuration = endDate.getTime() - startDate.getTime()
    const newTimestamp = startDate.getTime() + totalDuration * (newPosition / 100)
    const newDate = new Date(newTimestamp)

    setPosition(newPosition)
    onDateChange(newDate)
  }

  return (
    <div
      ref={strahlRef}
      className={cn("relative h-2 bg-gray-200 rounded-full cursor-pointer", className)}
      onClick={handleClick}
    >
      <div className="absolute top-0 left-0 h-full bg-primary rounded-full" style={{ width: `${position}%` }} />
      <div
        className="absolute top-0 h-4 w-4 bg-primary rounded-full -mt-1 transform -translate-x-1/2"
        style={{ left: `${position}%` }}
      />
    </div>
  )
}
