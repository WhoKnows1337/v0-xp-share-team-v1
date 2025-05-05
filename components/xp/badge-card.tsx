"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Badge } from "@/types/xp-level"
import { Progress } from "@/components/ui/progress"
import {
  Award,
  BookOpen,
  Calendar,
  CalendarCheck,
  Clock,
  Flame,
  Heart,
  ImageIcon,
  MessageSquare,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react"

interface BadgeCardProps {
  badge: Badge
  className?: string
}

// Hilfsfunktion zum Abrufen der Icon-Komponente basierend auf dem Namen
function getIconComponent(iconName: string) {
  const iconMap: Record<string, React.ComponentType<any>> = {
    Award,
    BookOpen,
    Calendar,
    CalendarCheck,
    Clock,
    Flame,
    Heart,
    ImageIcon,
    MessageSquare,
    Sparkles,
    Star,
    Users,
    Zap,
  }

  return iconMap[iconName] || Award
}

export function BadgeCard({ badge, className }: BadgeCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  // Bestimme das Icon basierend auf dem Icon-Namen
  const IconComponent = getIconComponent(badge.icon)

  // Bestimme die Farbe basierend auf dem Badge-Typ
  const badgeColor = badge.color || "#9CA3AF"

  // Bestimme den Fortschritt
  const progress = badge.progress
    ? Math.min(100, Math.round((badge.progress.current / badge.progress.total) * 100))
    : badge.earned
      ? 100
      : 0

  return (
    <div
      className={cn(
        "relative w-full aspect-square rounded-2xl overflow-hidden transition-all duration-300 transform cursor-pointer",
        {
          "rotate-y-180": isFlipped,
          "opacity-60 grayscale": !badge.earned && !isFlipped,
        },
        className,
      )}
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: "1000px" }}
    >
      {/* Vorderseite */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center p-4 backface-hidden transition-all duration-300",
          {
            "rotate-y-0": !isFlipped,
            "rotate-y-180": isFlipped,
          },
        )}
        style={{ backgroundColor: badgeColor }}
      >
        <div className="text-white">
          <IconComponent className="h-12 w-12 mb-2" />
        </div>
        <h3 className="text-sm font-semibold text-white text-center mt-2">{badge.name}</h3>
        {badge.progress && !badge.earned && (
          <div className="w-full mt-2">
            <Progress value={progress} className="h-1.5" />
            <div className="text-xs text-white text-center mt-1">
              {badge.progress.current} / {badge.progress.total}
            </div>
          </div>
        )}
      </div>

      {/* Rückseite */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 backface-hidden transition-all duration-300",
          {
            "rotate-y-180": !isFlipped,
            "rotate-y-0": isFlipped,
          },
        )}
      >
        <h3 className="text-sm font-semibold mb-2">{badge.name}</h3>
        <p className="text-xs text-center text-muted-foreground">{badge.description}</p>
        {badge.earned && badge.earnedDate && (
          <p className="text-xs text-center mt-2">
            Freigeschaltet am {new Date(badge.earnedDate).toLocaleDateString("de-DE")}
          </p>
        )}
        {badge.reward && (
          <div className="mt-2 text-xs text-center">
            <span className="font-semibold">Belohnung:</span>{" "}
            {badge.reward.type === "Mana" || badge.reward.type === "Stardust" ? (
              <span>
                +{badge.reward.value} {badge.reward.type}
              </span>
            ) : (
              <span>{badge.reward.value}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
