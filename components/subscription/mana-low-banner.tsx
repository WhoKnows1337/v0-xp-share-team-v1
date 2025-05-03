"use client"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface ManaLowBannerProps {
  remaining: number
  ctaLabel?: string
  onUpgrade: () => void
  className?: string
}

export function ManaLowBanner({
  remaining,
  ctaLabel = "Upgrade auf Premium",
  onUpgrade,
  className,
}: ManaLowBannerProps) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex items-center justify-between z-50",
        className,
      )}
    >
      <div className="flex items-center">
        <div className="bg-amber-100 text-amber-800 p-2 rounded-full mr-3">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium">Nur noch {remaining} Mana übrig</p>
          <p className="text-sm text-muted-foreground">Upgrade für mehr Mana und Premium-Features</p>
        </div>
      </div>
      <Button
        onClick={onUpgrade}
        className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700"
      >
        {ctaLabel}
      </Button>
    </div>
  )
}
