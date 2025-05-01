"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { formatDate } from "@/lib/utils"

interface ZeitStrahlSliderProps {
  startDate: Date
  endDate: Date
  value?: Date
  onChange?: (date: Date) => void
  className?: string
}

export function ZeitStrahlSlider({ startDate, endDate, value, onChange, className }: ZeitStrahlSliderProps) {
  const [sliderValue, setSliderValue] = useState(0)
  const [displayDate, setDisplayDate] = useState("")

  // Konvertiere das Datum in einen Slider-Wert (0-100)
  useEffect(() => {
    if (!value) return

    const totalDuration = endDate.getTime() - startDate.getTime()
    const currentDuration = value.getTime() - startDate.getTime()
    const newValue = (currentDuration / totalDuration) * 100

    setSliderValue(Math.max(0, Math.min(100, newValue)))
    setDisplayDate(formatDate(value))
  }, [value, startDate, endDate])

  const handleSliderChange = (newValue: number[]) => {
    const value = newValue[0]
    setSliderValue(value)

    const totalDuration = endDate.getTime() - startDate.getTime()
    const newTimestamp = startDate.getTime() + totalDuration * (value / 100)
    const newDate = new Date(newTimestamp)

    setDisplayDate(formatDate(newDate))
    onChange?.(newDate)
  }

  return (
    <div className={className}>
      <div className="flex justify-between mb-2 text-sm text-muted-foreground">
        <span>{formatDate(startDate)}</span>
        <span>{displayDate}</span>
        <span>{formatDate(endDate)}</span>
      </div>
      <Slider value={[sliderValue]} min={0} max={100} step={0.1} onValueChange={handleSliderChange} />
    </div>
  )
}
