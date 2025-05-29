"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle, Clock, Star, Trophy, Zap } from "lucide-react"
import type { Quest, Reward } from "@/types/gamification"
import { cn } from "@/lib/utils"

interface QuestCardProps {
  quest: Quest
  onStart?: (questId: string) => void
  onClaim?: (questId: string) => void
  className?: string
  compact?: boolean
}

export function QuestCard({ quest, onStart, onClaim, className, compact = false }: QuestCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Berechne die verbleibende Zeit, falls vorhanden
  const getTimeRemaining = () => {
    if (!quest.expiresAt) return null

    const now = new Date()
    const expiresAt = new Date(quest.expiresAt)
    const diffMs = expiresAt.getTime() - now.getTime()

    if (diffMs <= 0) return "Abgelaufen"

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (diffDays > 0) {
      return `${diffDays} Tag${diffDays !== 1 ? "e" : ""}`
    } else {
      return `${diffHours} Stunde${diffHours !== 1 ? "n" : ""}`
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
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
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
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {reward.type === "xp" && `${reward.value} Erfahrungspunkte`}
                  {reward.type === "badge" && `Badge: ${reward.value}`}
                  {reward.type === "currency" && `${reward.value} ${reward.icon}`}
                  {reward.type === "feature" && `Funktion: ${reward.value}`}
                  {reward.type === "title" && `Titel: ${reward.value}`}
                  {reward.type === "item" && `Item: ${reward.value}`}
                </p>
                {reward.rarity && (
                  <p className="text-xs">
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
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    )
  }

  // Kompakte Version der Karte
  if (compact) {
    return (
      <Card
        className={cn(
          "border overflow-hidden transition-all duration-300",
          quest.isNew ? "border-blue-500" : "",
          quest.isRecommended ? "border-amber-500" : "",
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium text-sm">{quest.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={cn("text-xs", getQuestTypeColor())}>
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
                {quest.expiresAt && (
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {getTimeRemaining()}
                  </span>
                )}
              </div>
            </div>
            {quest.progress === 100 ? (
              <Button size="sm" variant="outline" className="h-8 bg-green-500/10 text-green-500 border-green-500/20">
                <CheckCircle className="h-4 w-4 mr-1" />
                Abgeschlossen
              </Button>
            ) : quest.progress > 0 ? (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                {quest.progress}% abgeschlossen
              </Badge>
            ) : null}
          </div>

          <Progress value={quest.progress} className="h-1 mb-2" />

          <div className="flex justify-between items-center">
            <div className="text-xs text-muted-foreground">{renderRewards(quest.rewards)}</div>

            {isHovered && quest.progress < 100 && (
              <Button size="sm" className="h-7 text-xs" onClick={() => onStart && onStart(quest.id)}>
                {quest.progress > 0 ? "Fortsetzen" : "Starten"}
              </Button>
            )}

            {isHovered && quest.progress === 100 && (
              <Button size="sm" className="h-7 text-xs" onClick={() => onClaim && onClaim(quest.id)}>
                Belohnung abholen
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Vollständige Version der Karte
  return (
    <Card
      className={cn(
        "border overflow-hidden transition-all duration-300",
        quest.isNew ? "border-blue-500" : "",
        quest.isRecommended ? "border-amber-500" : "",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle>{quest.title}</CardTitle>
            <CardDescription>{quest.description}</CardDescription>
          </div>
          {quest.isNew && <Badge className="bg-blue-500 hover:bg-blue-600">Neu</Badge>}
          {quest.isRecommended && <Badge className="bg-amber-500 hover:bg-amber-600">Empfohlen</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className={cn(getQuestTypeColor())}>
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
          <Badge variant="outline" className={cn(getDifficultyColor())}>
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
          {quest.requiredLevel && (
            <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
              Level {quest.requiredLevel} erforderlich
            </Badge>
          )}
        </div>

        {quest.steps && quest.steps.length > 0 && (
          <div className="space-y-2 mb-4">
            <h4 className="text-sm font-medium">Fortschritt</h4>
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

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Belohnungen</h4>
          {renderRewards(quest.rewards)}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {quest.progress === 0 && <Button onClick={() => onStart && onStart(quest.id)}>Quest starten</Button>}
        {quest.progress > 0 && quest.progress < 100 && (
          <Button onClick={() => onStart && onStart(quest.id)}>Fortsetzen</Button>
        )}
        {quest.progress === 100 && <Button onClick={() => onClaim && onClaim(quest.id)}>Belohnung abholen</Button>}
      </CardFooter>
    </Card>
  )
}
