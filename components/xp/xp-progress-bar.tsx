import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface XPProgressBarProps {
  currentXP: number
  nextLevelXP: number
  className?: string
}

export function XPProgressBar({ currentXP, nextLevelXP, className }: XPProgressBarProps) {
  // Berechne den Prozentsatz des Fortschritts
  const percentage = Math.min(Math.round((currentXP / nextLevelXP) * 100), 100)

  return (
    <div className={cn("space-y-2", className)}>
      <Progress
        value={percentage}
        className="h-2 bg-muted"
        indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500"
      />
    </div>
  )
}
