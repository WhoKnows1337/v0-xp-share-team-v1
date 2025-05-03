"use client"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrialRibbonProps {
  daysRemaining: number
  onUpgrade: () => void
  onDismiss: () => void
  className?: string
}

export function TrialRibbon({ daysRemaining, onUpgrade, onDismiss, className }: TrialRibbonProps) {
  return (
    <div
      className={cn(
        "bg-primary/10 text-primary-foreground py-1 px-4 text-sm flex items-center justify-center",
        className,
      )}
    >
      <span>
        Trial: {daysRemaining} {daysRemaining === 1 ? "Tag" : "Tage"} verbleibend
      </span>
      <button onClick={onUpgrade} className="ml-2 font-medium underline underline-offset-2 hover:text-primary">
        Upgrade 🔒
      </button>
      <button
        onClick={onDismiss}
        className="ml-auto rounded-sm opacity-70 hover:opacity-100 focus:outline-none"
        aria-label="Schließen"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
