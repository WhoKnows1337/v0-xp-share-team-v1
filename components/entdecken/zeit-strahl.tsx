"use client"

import { useState, useEffect, useRef } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"

interface ZeitStrahlProps {
  minJahr: number
  maxJahr: number
  onChange: (jahr: number) => void
  initialJahr?: number
}

export function ZeitStrahl({ minJahr, maxJahr, onChange, initialJahr }: ZeitStrahlProps) {
  const [jahr, setJahr] = useState<number>(initialJahr || minJahr)
  const [isPlaying, setIsPlaying] = useState(false)
  const animationRef = useRef<number | null>(null)
  const lastUpdateTimeRef = useRef<number>(0)
  const speedRef = useRef<number>(1) // Jahre pro Sekunde

  useEffect(() => {
    if (initialJahr !== undefined) {
      setJahr(initialJahr)
    }
  }, [initialJahr])

  useEffect(() => {
    onChange(jahr)
  }, [jahr, onChange])

  const animate = (time: number) => {
    if (!lastUpdateTimeRef.current) {
      lastUpdateTimeRef.current = time
    }

    const deltaTime = time - lastUpdateTimeRef.current
    if (deltaTime > 1000 / speedRef.current) {
      setJahr((prevJahr) => {
        const newJahr = prevJahr + 1
        if (newJahr > maxJahr) {
          setIsPlaying(false)
          return minJahr
        }
        return newJahr
      })
      lastUpdateTimeRef.current = time
    }

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate)
    }
  }

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate)
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    lastUpdateTimeRef.current = 0
  }

  const handleChange = (values: number[]) => {
    setJahr(values[0])
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Zeitstrahl</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Abspielen"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <span className="text-lg font-bold">{jahr}</span>
        </div>
      </div>
      <Slider
        defaultValue={[jahr]}
        min={minJahr}
        max={maxJahr}
        step={1}
        value={[jahr]}
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
