import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface StreakMeterProps {
  streak: {
    current: number
    max: number
    lastActivity: string
  }
  className?: string
}

export function StreakMeter({ streak, className }: StreakMeterProps) {
  // Bestimme die Farbe basierend auf der Streak-Länge
  const getStreakColor = () => {
    if (streak.current >= 30) return "text-red-500"
    if (streak.current >= 14) return "text-orange-500"
    if (streak.current >= 7) return "text-amber-500"
    return "text-yellow-500"
  }

  // Formatiere das letzte Aktivitätsdatum
  const formatLastActivity = () => {
    const date = new Date(streak.lastActivity)
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("flex items-center rounded-full bg-muted/50 p-2", getStreakColor(), className)}>
            <Flame className="h-5 w-5" />
            <span className="ml-1 font-medium">{streak.current}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-medium">🔥 {streak.current} Tage Streak!</p>
            <p className="text-xs text-muted-foreground">Längste Streak: {streak.max} Tage</p>
            <p className="text-xs text-muted-foreground">Letzte Aktivität: {formatLastActivity()}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
