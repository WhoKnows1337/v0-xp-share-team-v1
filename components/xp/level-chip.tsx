"use client"

import { cn } from "@/lib/utils"
import type { LevelInfo } from "@/types/xp-level"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface LevelChipProps {
  level: number
  size?: "sm" | "md" | "lg"
  className?: string
  levelInfo?: LevelInfo
}

export function LevelChip({ level, size = "md", className, levelInfo }: LevelChipProps) {
  // Bestimme die Größe basierend auf dem size-Prop
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-12 w-12 text-lg",
  }

  // Bestimme die Farbe und das Symbol basierend auf dem Level
  const range =
    levelInfo?.range ||
    (level >= 76 ? "Luminary" : level >= 51 ? "Sage" : level >= 26 ? "Adept" : level >= 11 ? "Explorer" : "Novice")

  const symbol =
    levelInfo?.symbol || (level >= 76 ? "✦" : level >= 51 ? "★" : level >= 26 ? "◆" : level >= 11 ? "◼" : "▲")

  const symbolColor =
    levelInfo?.symbolColor ||
    (level >= 76
      ? "bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-600"
      : level >= 51
        ? "bg-amber-400"
        : level >= 26
          ? "bg-violet-500"
          : level >= 11
            ? "bg-teal-500"
            : "bg-gray-400")

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex items-center justify-center rounded-full text-white font-semibold",
              symbolColor,
              sizeClasses[size],
              className,
            )}
          >
            {symbol}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Level {level} ({range})
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
