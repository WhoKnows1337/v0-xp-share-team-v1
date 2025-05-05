"use client"

import { useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Coins, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

interface RewardUnlockedModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  amount: number
  type: "mana" | "stardust"
  autoClose?: boolean
  autoCloseDelay?: number
}

export function RewardUnlockedModal({
  open,
  onOpenChange,
  amount,
  type,
  autoClose = true,
  autoCloseDelay = 5000,
}: RewardUnlockedModalProps) {
  const router = useRouter()

  useEffect(() => {
    if (autoClose && open) {
      const timer = setTimeout(() => {
        onOpenChange(false)
      }, autoCloseDelay)
      return () => clearTimeout(timer)
    }
  }, [autoClose, autoCloseDelay, onOpenChange, open])

  const handleViewWallet = () => {
    onOpenChange(false)
    router.push("/settings/subscription")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="text-2xl">Belohnung freigeschaltet!</DialogTitle>
          <DialogDescription>Deine Einladung wurde angenommen und du hast eine Belohnung erhalten.</DialogDescription>
        </DialogHeader>

        <div className="py-6 flex flex-col items-center">
          <div className="relative mb-4">
            {type === "mana" ? (
              <Coins className="h-16 w-16 text-blue-500" />
            ) : (
              <Sparkles className="h-16 w-16 text-purple-500" />
            )}

            {/* Animierte Partikel */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: type === "mana" ? "#3B82F6" : "#8B5CF6",
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${i * 30}deg) translateY(-30px)`,
                    opacity: 0,
                    animation: `particle-${i} 2s ease-out infinite`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="text-3xl font-bold mb-2">
            +{amount} {type === "mana" ? "Mana" : "Stardust"}
          </div>

          <p className="text-muted-foreground">
            {type === "mana"
              ? "Nutze dein Mana, um neue Funktionen freizuschalten."
              : "Stardust kann für Premium-Features verwendet werden."}
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2">
          <Button onClick={handleViewWallet}>Wallet anzeigen</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Schließen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
