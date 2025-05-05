"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Share2 } from "lucide-react"
import type { ReferralTierInfo } from "@/types/referral"
import { motion, AnimatePresence } from "framer-motion"

interface MilestoneBannerProps {
  tier: ReferralTierInfo
  onClose: () => void
  onShare: () => void
  autoClose?: boolean
  autoCloseDelay?: number
}

export function MilestoneBanner({
  tier,
  onClose,
  onShare,
  autoClose = true,
  autoCloseDelay = 10000,
}: MilestoneBannerProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(onClose, 500) // Allow animation to complete
      }, autoCloseDelay)
      return () => clearTimeout(timer)
    }
  }, [autoClose, autoCloseDelay, onClose])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full px-4"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Card className={`p-4 shadow-lg border-2 ${tier.color} overflow-hidden relative`}>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => {
                setVisible(false)
                setTimeout(onClose, 500)
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Schließen</span>
            </Button>

            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              <div className="text-4xl animate-bounce">{tier.icon}</div>
              <div>
                <h3 className="text-xl font-bold">{tier.name}-Tier erreicht!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Gratulation! Du hast das {tier.name}-Tier im Referral-Programm erreicht.
                </p>
              </div>

              <div className="bg-background/80 rounded-lg p-3 w-full">
                <h4 className="font-medium text-sm mb-2">Deine neuen Vorteile:</h4>
                <ul className="text-xs space-y-1 list-disc pl-4">
                  {tier.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
              </div>

              <Button className="w-full" onClick={onShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Teilen und mehr verdienen
              </Button>
            </div>

            {/* Konfetti-Effekt im Hintergrund */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: ["#FFD700", "#FF6347", "#4169E1", "#32CD32"][i % 4],
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: 0.7,
                    animation: `fall-${i} ${2 + Math.random() * 3}s linear infinite`,
                  }}
                />
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
