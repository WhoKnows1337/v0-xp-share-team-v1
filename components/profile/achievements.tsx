"use client"
import { motion } from "framer-motion"
import {
  BookOpen,
  MessageSquare,
  Heart,
  Award,
  Trophy,
  Star,
  Clock,
  Map,
  Users,
  Zap,
  Compass,
  Share2,
  TrendingUp,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Achievement } from "@/lib/mock-users"

interface AchievementsProps {
  achievements: Achievement[]
}

export function Achievements({ achievements }: AchievementsProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "BookOpen":
        return <BookOpen className="h-5 w-5" />
      case "MessageSquare":
        return <MessageSquare className="h-5 w-5" />
      case "Heart":
        return <Heart className="h-5 w-5" />
      case "Award":
        return <Award className="h-5 w-5" />
      case "Trophy":
        return <Trophy className="h-5 w-5" />
      case "Star":
        return <Star className="h-5 w-5" />
      case "Clock":
        return <Clock className="h-5 w-5" />
      case "Map":
        return <Map className="h-5 w-5" />
      case "Users":
        return <Users className="h-5 w-5" />
      case "Compass":
        return <Compass className="h-5 w-5" />
      case "Share2":
        return <Share2 className="h-5 w-5" />
      case "TrendingUp":
        return <TrendingUp className="h-5 w-5" />
      default:
        return <Zap className="h-5 w-5" />
    }
  }

  // Nur freigeschaltete Achievements anzeigen
  const unlockedAchievements = achievements.filter((achievement) => achievement.unlocked)

  return (
    <div className="flex flex-wrap gap-3">
      <TooltipProvider>
        {unlockedAchievements.map((achievement) => (
          <Tooltip key={achievement.id}>
            <TooltipTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="bg-slate-100 dark:bg-slate-700 p-3 rounded-full cursor-help"
              >
                {getIcon(achievement.icon)}
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <div className="text-sm font-medium">{achievement.name}</div>
              <div className="text-xs text-muted-foreground">{achievement.beschreibung}</div>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  )
}
