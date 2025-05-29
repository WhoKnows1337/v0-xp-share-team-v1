"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, Star, Trophy, Zap } from "lucide-react"
import type { Quest, Reward } from "@/types/gamification"

interface QuestDetailDialogProps {
  quest: Quest
  open: boolean
  onOpenChange: (open: boolean) => void
  onStart?: () => void
}

export function QuestDetailDialog({ quest, open, onOpenChange, onStart }: QuestDetailDialogProps) {
  // Berechne die verbleibende Zeit, falls vorhanden
  const getTimeRemaining = () => {
    if (!quest.expiresAt) return null

    const now = new Date()
    const expiresAt = new Date(quest.expiresAt)
    const diffMs = expiresAt.getTime() - now.getTime()

    if (diffMs <= 0) return "Abgelaufen"

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffDays > 0) {
      return `${diffDays} Tag${diffDays !== 1 ? "e" : ""}, ${diffHours} Stunde${diffHours !== 1 ? "n" : ""}`
    } else if (diffHours > 0) {
      return `${diffHours} Stunde${diffHours !== 1 ? "n" : ""}, ${diffMinutes} Minute${diffMinutes !== 1 ? "n" : ""}`
    } else {
      return `${diffMinutes} Minute${diffMinutes !== 1 ? "n" : ""}`
    }
  }

  // Bestimme die Farbe basierend auf dem Quest-Typ
  const getQuestTypeColor = () => {
    switch (quest.type) {
      case "daily":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "weekly":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "monthly":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "seasonal":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "achievement":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  // Bestimme die Farbe basierend auf der Schwierigkeit
  const getDifficultyColor = () => {
    switch (quest.difficulty) {
      case "easy":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "hard":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "expert":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  // Rendere die Belohnungen
  const renderRewards = (rewards: Reward[]) => {
    return (
      <div className="flex flex-wrap gap-2">
        {rewards.map((reward, index) => (
          <Badge key={index} variant="outline" className="bg-primary/10 text-primary border-primary/20">
            {reward.type === "xp" && (
              <>
                <Zap className="h-3 w-3 mr-1" />
                {reward.value} XP
              </>
            )}
            {reward.type === "badge" && (
              <>
                <Trophy className="h-3 w-3 mr-1" />
                {reward.value}
              </>
            )}
            {reward.type === "currency" && (
              <>
                <Star className="h-3 w-3 mr-1" />
                {reward.value} {reward.icon}
              </>
            )}
            {(reward.type === "feature" || reward.type === "title" || reward.type === "item") && (
              <>
                <Star className="h-3 w-3 mr-1" />
                {reward.value}
              </>
            )}
          </Badge>
        ))}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{quest.title}</DialogTitle>
          <DialogDescription>{quest.description}</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={getQuestTypeColor()}>
              {quest.type === "daily"
                ? "Täglich"
                : quest.type === "weekly"
                  ? "Wöchentlich"
                  : quest.type === "monthly"
                    ? "Monatlich"
                    : quest.type === "seasonal"
                      ? "Saisonal"
                      : "Erfolg"}
            </Badge>
            <Badge variant="outline" className={getDifficultyColor()}>
              {quest.difficulty === "easy"
                ? "Einfach"
                : quest.difficulty === "medium"
                  ? "Mittel"
                  : quest.difficulty === "hard"
                    ? "Schwer"
                    : "Experte"}
            </Badge>
            {quest.expiresAt && (
              <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                <Clock className="h-3 w-3 mr-1" />
                {getTimeRemaining()}
              </Badge>
            )}
          </div>

          {quest.steps && quest.steps.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Schritte</h4>
              {quest.steps.map((step, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {step.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-muted-foreground mr-2" />
                    )}
                    <span className="text-sm">{step.description}</span>
                  </div>
                  {step.requiredCount && (
                    <span className="text-sm text-muted-foreground">
                      {step.currentCount || 0}/{step.requiredCount}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Gesamtfortschritt</span>
              <span>{quest.progress}%</span>
            </div>
            <Progress value={quest.progress} className="h-2" />
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Belohnungen</h4>
            {renderRewards(quest.rewards)}
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              onOpenChange(false)
              if (onStart) onStart()
            }}
          >
            {quest.progress > 0 ? "Fortsetzen" : "Quest starten"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
