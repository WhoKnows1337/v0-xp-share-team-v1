"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PriceCard } from "@/components/subscription/price-card"
import { subscriptionPlans } from "@/types/subscription"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaywallModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  variant?: "soft" | "hard"
  triggerContext?: string
  onUpgrade: (planId: string) => void
  onClose?: () => void
}

export function PaywallModal({
  open,
  onOpenChange,
  variant = "soft",
  triggerContext = "feature",
  onUpgrade,
  onClose,
}: PaywallModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const benefits = [
    {
      title: "Unbegrenzte Möglichkeiten",
      description: "Erhalte Zugang zu allen Premium-Features und erweitere deine XP-Reise.",
    },
    {
      title: "Deep-AI-Analyse",
      description: "Entdecke verborgene Muster und Zusammenhänge in deinen Erlebnissen.",
    },
    {
      title: "HD-Media Upload",
      description: "Teile deine Erlebnisse in höchster Qualität mit der Community.",
    },
  ]

  const handleSelectPlan = (planId: string) => {
    onUpgrade(planId)
    onOpenChange(false)
  }

  const handleClose = () => {
    if (onClose) onClose()
    if (variant === "soft") onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={variant === "soft" ? onOpenChange : undefined}>
      <DialogContent
        className={cn(
          "sm:max-w-[900px] p-0 gap-0 overflow-hidden",
          variant === "hard" ? "sm:max-h-[90vh]" : "sm:max-h-[600px]",
        )}
      >
        {variant === "soft" && (
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Schließen</span>
          </button>
        )}

        <div className="grid md:grid-cols-2 h-full">
          {/* Left column - Benefits carousel */}
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-8 flex flex-col justify-center">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-2xl">Entfessle das volle Potenzial</DialogTitle>
              <DialogDescription>Upgrade auf Premium und erlebe XP Share ohne Einschränkungen</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className={cn(
                    "transition-opacity duration-300",
                    currentSlide === index ? "opacity-100" : "opacity-50",
                  )}
                  onMouseEnter={() => setCurrentSlide(index)}
                >
                  <h3 className="text-lg font-medium">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-6 flex space-x-2">
              {benefits.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    currentSlide === index ? "bg-primary" : "bg-primary/30",
                  )}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>

          {/* Right column - Pricing */}
          <div className="p-8 flex flex-col">
            <h2 className="text-xl font-bold mb-6">Wähle deinen Plan</h2>

            <div className="space-y-4 flex-1">
              {subscriptionPlans
                .filter((plan) => plan.id !== "free")
                .map((plan) => (
                  <PriceCard key={plan.id} plan={plan} onSelectPlan={handleSelectPlan} className="h-auto" />
                ))}
            </div>

            {variant === "hard" && (
              <div className="mt-6">
                <Button variant="outline" className="w-full" onClick={handleClose}>
                  Vielleicht später
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
