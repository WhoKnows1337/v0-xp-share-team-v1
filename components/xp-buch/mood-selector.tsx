"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Mood = "sehr-gut" | "gut" | "neutral" | "schlecht" | "sehr-schlecht"

interface MoodSelectorProps {
  value?: Mood
  onChange?: (mood: Mood) => void
  className?: string
}

export function MoodSelector({ value, onChange, className }: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<Mood>(value || "neutral")

  const handleMoodChange = (mood: Mood) => {
    setSelectedMood(mood)
    onChange?.(mood)
  }

  const moods: { value: Mood; label: string; emoji: string; color: string }[] = [
    { value: "sehr-gut", label: "Sehr gut", emoji: "😄", color: "bg-green-100 text-green-700" },
    { value: "gut", label: "Gut", emoji: "🙂", color: "bg-emerald-100 text-emerald-700" },
    { value: "neutral", label: "Neutral", emoji: "😐", color: "bg-blue-100 text-blue-700" },
    { value: "schlecht", label: "Schlecht", emoji: "😕", color: "bg-amber-100 text-amber-700" },
    { value: "sehr-schlecht", label: "Sehr schlecht", emoji: "😞", color: "bg-red-100 text-red-700" },
  ]

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium">Stimmung</p>
      <div className="flex justify-between gap-2">
        {moods.map((mood) => (
          <Button
            key={mood.value}
            type="button"
            variant="outline"
            className={cn("flex-1 flex-col h-auto py-2 px-0", selectedMood === mood.value && mood.color)}
            onClick={() => handleMoodChange(mood.value)}
          >
            <span className="text-xl">{mood.emoji}</span>
            <span className="text-xs mt-1">{mood.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
