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
  Flame,
  Target,
  Crown,
  Gift,
  ThumbsUp,
  Lightbulb,
  Coffee,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Achievement {
  id: string
  name: string
  beschreibung: string
  icon: string
  unlocked: boolean
  progress?: {
    current: number
    total: number
  }
}

interface AchievementsProps {
  achievements: Achievement[]
  showLocked?: boolean
}

export function Achievements({ achievements, showLocked = false }: AchievementsProps) {
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
      case "Flame":
        return <Flame className="h-5 w-5" />
      case "Target":
        return <Target className="h-5 w-5" />
      case "Crown":
        return <Crown className="h-5 w-5" />
      case "Gift":
        return <Gift className="h-5 w-5" />
      case "ThumbsUp":
        return <ThumbsUp className="h-5 w-5" />
      case "Lightbulb":
        return <Lightbulb className="h-5 w-5" />
      case "Coffee":
        return <Coffee className="h-5 w-5" />
      default:
        return <Zap className="h-5 w-5" />
    }
  }

  // Filtern der Achievements basierend auf showLocked
  const filteredAchievements = showLocked ? achievements : achievements.filter((achievement) => achievement.unlocked)

  return (
    <div className="flex flex-wrap gap-3">
      <TooltipProvider>
        {filteredAchievements.map((achievement) => (
          <Tooltip key={achievement.id}>
            <TooltipTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`relative p-3 rounded-full cursor-help ${
                  achievement.unlocked
                    ? "bg-gradient-to-br from-amber-100 to-amber-300 dark:from-amber-700 dark:to-amber-900 text-amber-800 dark:text-amber-100"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 opacity-60"
                }`}
              >
                <div className={achievement.unlocked ? "" : "opacity-50"}>{getIcon(achievement.icon)}</div>

                {/* Progress indicator for achievements in progress */}
                {achievement.progress && achievement.progress.current > 0 && !achievement.unlocked && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {achievement.progress.current}/{achievement.progress.total}
                  </div>
                )}
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="space-y-1">
                <div className="text-sm font-medium flex items-center gap-1">
                  {achievement.name}
                  {achievement.unlocked && <span className="text-green-500 text-xs">✓</span>}
                </div>
                <div className="text-xs text-muted-foreground">{achievement.beschreibung}</div>

                {/* Progress bar for achievements in progress */}
                {achievement.progress && (
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{
                        width: `${Math.min(100, (achievement.progress.current / achievement.progress.total) * 100)}%`,
                      }}
                    ></div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {achievement.progress.current} von {achievement.progress.total}
                    </div>
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  )
}
