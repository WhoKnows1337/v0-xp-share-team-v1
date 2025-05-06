"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface NexusTimelineProps {
  timeRange: [Date, Date]
  onTimeRangeChange: (range: [Date, Date]) => void
}

export function NexusTimeline({ timeRange, onTimeRangeChange }: NexusTimelineProps) {
  const [startPos, setStartPos] = useState(0)
  const [endPos, setEndPos] = useState(100)
  const [isDragging, setIsDragging] = useState<"start" | "end" | "range" | null>(null)
  const [dragStartX, setDragStartX] = useState(0)
  const [rangeWidth, setRangeWidth] = useState(0)
  const timelineRef = useRef<HTMLDivElement>(null)

  // Formatiere das Datum für die Anzeige
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Berechne die Position basierend auf dem Datum
  const dateToPosition = (date: Date) => {
    const now = new Date()
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(now.getFullYear() - 1)

    const totalRange = now.getTime() - oneYearAgo.getTime()
    const datePosition = ((date.getTime() - oneYearAgo.getTime()) / totalRange) * 100

    return Math.max(0, Math.min(100, datePosition))
  }

  // Berechne das Datum basierend auf der Position
  const positionToDate = (position: number) => {
    const now = new Date()
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(now.getFullYear() - 1)

    const totalRange = now.getTime() - oneYearAgo.getTime()
    const timestamp = oneYearAgo.getTime() + (position / 100) * totalRange

    return new Date(timestamp)
  }

  // Initialisiere die Positionen basierend auf dem timeRange
  useEffect(() => {
    setStartPos(dateToPosition(timeRange[0]))
    setEndPos(dateToPosition(timeRange[1]))
  }, [])

  // Handle Mouse-Events für das Ziehen
  const handleMouseDown = (e: React.MouseEvent, type: "start" | "end" | "range") => {
    e.preventDefault()
    setIsDragging(type)
    setDragStartX(e.clientX)

    if (type === "range") {
      setRangeWidth(endPos - startPos)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !timelineRef.current) return

    const rect = timelineRef.current.getBoundingClientRect()
    const width = rect.width
    const deltaX = e.clientX - dragStartX
    const deltaPercent = (deltaX / width) * 100

    if (isDragging === "start") {
      const newStartPos = Math.max(0, Math.min(endPos - 5, startPos + deltaPercent))
      setStartPos(newStartPos)
      onTimeRangeChange([positionToDate(newStartPos), timeRange[1]])
    } else if (isDragging === "end") {
      const newEndPos = Math.max(startPos + 5, Math.min(100, endPos + deltaPercent))
      setEndPos(newEndPos)
      onTimeRangeChange([timeRange[0], positionToDate(newEndPos)])
    } else if (isDragging === "range") {
      const newStartPos = Math.max(0, Math.min(100 - rangeWidth, startPos + deltaPercent))
      const newEndPos = newStartPos + rangeWidth

      if (newStartPos >= 0 && newEndPos <= 100) {
        setStartPos(newStartPos)
        setEndPos(newEndPos)
        onTimeRangeChange([positionToDate(newStartPos), positionToDate(newEndPos)])
        setDragStartX(e.clientX)
      }
    }
  }

  const handleMouseUp = () => {
    setIsDragging(null)
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  // Zurücksetzen des Zeitbereichs
  const resetTimeRange = () => {
    const now = new Date()
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(now.getMonth() - 1)

    onTimeRangeChange([oneMonthAgo, now])
    setStartPos(dateToPosition(oneMonthAgo))
    setEndPos(dateToPosition(now))
  }

  return (
    <div className="h-12 border-t border-b border-gray-800 bg-gray-900 flex items-center px-4 relative">
      <div ref={timelineRef} className="flex-1 h-2 bg-gray-800 rounded-full relative mx-4">
        {/* Zeitbereich-Markierung */}
        <div
          className="absolute h-full bg-cyan-400/30 rounded-full cursor-grab"
          style={{
            left: `${startPos}%`,
            width: `${endPos - startPos}%`,
          }}
          onMouseDown={(e) => handleMouseDown(e, "range")}
        />

        {/* Start-Handle */}
        <div
          className="absolute w-4 h-4 bg-cyan-400 rounded-full -ml-2 -mt-1 cursor-ew-resize"
          style={{ left: `${startPos}%` }}
          onMouseDown={(e) => handleMouseDown(e, "start")}
        />

        {/* End-Handle */}
        <div
          className="absolute w-4 h-4 bg-cyan-400 rounded-full -ml-2 -mt-1 cursor-ew-resize"
          style={{ left: `${endPos}%` }}
          onMouseDown={(e) => handleMouseDown(e, "end")}
        />
      </div>

      {/* Reset-Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetTimeRange}
              className="h-8 w-8 text-gray-400 hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zeitbereich zurücksetzen</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Tooltip für den aktuellen Bereich */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 px-3 py-1 rounded text-xs">
        {formatDate(timeRange[0])} - {formatDate(timeRange[1])}
        <span className="ml-2 text-cyan-400">37 Treffer</span>
      </div>
    </div>
  )
}
