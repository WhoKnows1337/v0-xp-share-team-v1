"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

interface ZeitSliderProps {
  minJahr: number
  maxJahr: number
  onChange: (minJahr: number, maxJahr: number) => void
  initialMin?: number
  initialMax?: number
}

export function ZeitSlider({ minJahr, maxJahr, onChange, initialMin, initialMax }: ZeitSliderProps) {
  const [range, setRange] = useState<[number, number]>([initialMin || minJahr, initialMax || maxJahr])

  useEffect(() => {
    if (initialMin !== undefined && initialMax !== undefined) {
      setRange([initialMin, initialMax])
    }
  }, [initialMin, initialMax])

  const handleChange = (values: number[]) => {
    const [min, max] = values as [number, number]
    setRange([min, max])
    onChange(min, max)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Zeitraum (Jahre)</Label>
        <span className="text-sm font-medium">
          {range[0]} - {range[1]}
        </span>
      </div>
      <Slider
        defaultValue={[range[0], range[1]]}
        min={minJahr}
        max={maxJahr}
        step={1}
        value={[range[0], range[1]]}
        onValueChange={handleChange}
        className="my-4"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{minJahr}</span>
        <span>{maxJahr}</span>
      </div>
    </div>
  )
}
