"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"

interface ZeitStrahlSliderProps {
  minJahr: number
  maxJahr: number
  onChange: (jahr: number) => void
}

export function ZeitStrahlSlider({ minJahr, maxJahr, onChange }: ZeitStrahlSliderProps) {
  console.log("ZeitStrahlSlider - minJahr:", minJahr, "maxJahr:", maxJahr)

  // Stelle sicher, dass minJahr und maxJahr gültige Werte sind
  const validMinJahr = isNaN(minJahr) ? new Date().getFullYear() - 10 : minJahr
  const validMaxJahr = isNaN(maxJahr) ? new Date().getFullYear() : maxJahr

  // Stelle sicher, dass minJahr <= maxJahr
  const finalMinJahr = Math.min(validMinJahr, validMaxJahr)
  const finalMaxJahr = Math.max(validMinJahr, validMaxJahr)

  console.log("ZeitStrahlSlider - finalMinJahr:", finalMinJahr, "finalMaxJahr:", finalMaxJahr)

  const [jahr, setJahr] = useState<number>(finalMaxJahr)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playSpeed, setPlaySpeed] = useState(1000) // Millisekunden pro Jahr

  useEffect(() => {
    // Aktualisiere das Jahr, wenn sich minJahr oder maxJahr ändert
    setJahr(finalMaxJahr)
  }, [finalMinJahr, finalMaxJahr])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isPlaying) {
      interval = setInterval(() => {
        setJahr((prevJahr) => {
          // Wenn wir das maximale Jahr erreicht haben, stoppen wir die Animation
          if (prevJahr >= finalMaxJahr) {
            setIsPlaying(false)
            return finalMaxJahr
          }
          const neuesJahr = prevJahr + 1
          onChange(neuesJahr)
          return neuesJahr
        })
      }, playSpeed)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, finalMaxJahr, playSpeed, onChange])

  const handleSliderChange = (value: number[]) => {
    const neuesJahr = value[0]
    console.log("ZeitStrahlSlider - handleSliderChange:", neuesJahr)
    setJahr(neuesJahr)
    onChange(neuesJahr)
  }

  const handlePlayPause = () => {
    if (jahr >= finalMaxJahr) {
      // Wenn wir am Ende sind und Play drücken, starten wir von vorne
      setJahr(finalMinJahr)
    }
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setJahr(finalMinJahr)
    onChange(finalMinJahr)
    setIsPlaying(false)
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md fixed bottom-8 left-1/2 transform -translate-x-1/2 w-[90%] max-w-3xl z-10">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Zeitreise: {jahr}</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handlePlayPause}
            aria-label={isPlaying ? "Pause" : "Abspielen"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset} className="text-xs h-8">
            Zurücksetzen
          </Button>
        </div>
      </div>

      <div className="pt-2">
        <Slider
          value={[jahr]}
          min={finalMinJahr}
          max={finalMaxJahr}
          step={1}
          onValueChange={handleSliderChange}
          className="w-full"
        />
      </div>

      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
        <span>{finalMinJahr}</span>
        <span>{finalMaxJahr}</span>
      </div>
    </div>
  )
}
