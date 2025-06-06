"use client"

import { Crown } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface PremiumBadgeProps {
  size?: "sm" | "md"
  className?: string
  tooltipText?: string
}

export function PremiumBadge({ size = "md", className, tooltipText = "Premium-Mitglied" }: PremiumBadgeProps) {
  const router = useRouter()

  const badge = (
    <Button
      onClick={() => router.push("/pricing")}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-300 to-amber-500 text-black font-medium",
        size === "sm" ? "px-1.5 py-0.5 text-xs h-auto" : "px-2 py-1 text-sm h-auto",
        className,
      )}
    >
      <Crown className={size === "sm" ? "h-3 w-3 mr-1" : "h-4 w-4 mr-1"} />
      <span>Premium</span>
    </Button>
  )

  if (!tooltipText) return badge

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
