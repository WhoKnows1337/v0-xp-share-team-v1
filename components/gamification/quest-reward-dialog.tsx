"use client"

import { useState, useEffect } from "react"
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
import { useToast } from "@/hooks/use-toast"
import { Award, Star, Trophy, Zap } from "lucide-react"
import confetti from "canvas-confetti"
import type { Quest, Reward } from "@/types/gamification"

interface QuestRewardDialogProps {
  quest: Quest
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuestRewardDialog({ quest, open, onOpenChange }: QuestRewardDialogProps) {
  const { toast } = useToast()
  const [currentRewardIndex, setCurrentRewardIndex] = useState(0)
  const [showAllRewards, setShowAllRewards] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)

  // Konfetti-Effekt beim Öffnen des Dialogs
  useEffect(() => {
    if (open) {
      // Konfetti-Effekt
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })

      // Animation für die Belohnungen
      const timer = setTimeout(() => {
        setAnimationComplete(true)
      }, 1000)

      return () => clearTimeout(timer)
    } else {
      // Zurücksetzen beim Schließen
      setCurrentRewardIndex(0)
      setShowAllRewards(false)
      setAnimationComplete(false)
    }
  }, [open])

  // Nächste Belohnung anzeigen
  const showNextReward = () => {
    if (currentRewardIndex < quest.rewards.length - 1) {
      setCurrentRewardIndex(currentRewardIndex + 1)

      // Konfetti für jede neue Belohnung
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
      })
    } else {
      setShowAllRewards(true)
    }
  }

  // Dialog schließen und Toast anzeigen
  const handleClose = () => {
    onOpenChange(false)

    toast({
      title: "Belohnungen erhalten!",
      description: `Du hast alle Belohnungen für "${quest.title}" erhalten.`,
    })
  }

  // Rendere eine einzelne Belohnung
  const renderReward = (reward: Reward) => {
    return (
      <div className="flex flex-col items-center justify-center p-6 animate-fadeIn">
        <div className="bg-primary/10 rounded-full p-6 mb-4">
          {reward.type === "xp" && <Zap className="h-12 w-12 text-yellow-500" />}
          {reward.type === "badge" && <Trophy className="h-12 w-12 text-amber-500" />}
          {reward.type === "currency" && <Star className="h-12 w-12 text-blue-500" />}
          {(reward.type === "feature" || reward.type === "title" || reward.type === "item") && (
            <Award className="h-12 w-12 text-purple-500" />
          )}
        </div>

        <h3 className="text-xl font-bold mb-2">
          {reward.type === "xp" && `${reward.value} XP`}
          {reward.type === "badge" && `Badge: ${reward.value}`}
          {reward.type === "currency" && `${reward.value} ${reward.icon}`}
          {reward.type === "feature" && `${reward.value}`}
          {reward.type === "title" && `Titel: ${reward.value}`}
          {reward.type === "item" && `Item: ${reward.value}`}
        </h3>

        {reward.rarity && (
          <Badge
            className={
              reward.rarity === "common"
                ? "bg-gray-500"
                : reward.rarity === "uncommon"
                  ? "bg-green-500"
                  : reward.rarity === "rare"
                    ? "bg-blue-500"
                    : reward.rarity === "epic"
                      ? "bg-purple-500"
                      : "bg-amber-500"
            }
          >
            {reward.rarity === "common"
              ? "Gewöhnlich"
              : reward.rarity === "uncommon"
                ? "Ungewöhnlich"
                : reward.rarity === "rare"
                  ? "Selten"
                  : reward.rarity === "epic"
                    ? "Episch"
                    : "Legendär"}
          </Badge>
        )}
      </div>
    )
  }

  // Rendere alle Belohnungen
  const renderAllRewards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
        {quest.rewards.map((reward, index) => (
          <div key={index} className="flex items-center p-4 rounded-lg border">
            <div className="bg-primary/10 rounded-full p-3 mr-4">
              {reward.type === "xp" && <Zap className="h-6 w-6 text-yellow-500" />}
              {reward.type === "badge" && <Trophy className="h-6 w-6 text-amber-500" />}
              {reward.type === "currency" && <Star className="h-6 w-6 text-blue-500" />}
              {(reward.type === "feature" || reward.type === "title" || reward.type === "item") && (
                <Award className="h-6 w-6 text-purple-500" />
              )}
            </div>

            <div>
              <h4 className="font-medium">
                {reward.type === "xp" && `${reward.value} XP`}
                {reward.type === "badge" && `Badge: ${reward.value}`}
                {reward.type === "currency" && `${reward.value} ${reward.icon}`}
                {reward.type === "feature" && `${reward.value}`}
                {reward.type === "title" && `Titel: ${reward.value}`}
                {reward.type === "item" && `Item: ${reward.value}`}
              </h4>

              {reward.rarity && (
                <p className="text-sm text-muted-foreground">
                  Seltenheit:{" "}
                  {reward.rarity === "common"
                    ? "Gewöhnlich"
                    : reward.rarity === "uncommon"
                      ? "Ungewöhnlich"
                      : reward.rarity === "rare"
                        ? "Selten"
                        : reward.rarity === "epic"
                          ? "Episch"
                          : "Legendär"}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quest abgeschlossen!</DialogTitle>
          <DialogDescription>Du hast die Quest "{quest.title}" erfolgreich abgeschlossen.</DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {!showAllRewards ? animationComplete && renderReward(quest.rewards[currentRewardIndex]) : renderAllRewards()}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {!showAllRewards ? (
            <Button onClick={showNextReward} className="w-full">
              {currentRewardIndex < quest.rewards.length - 1 ? "Nächste Belohnung" : "Alle Belohnungen anzeigen"}
            </Button>
          ) : (
            <Button onClick={handleClose} className="w-full">
              Schließen
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
