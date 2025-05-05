"use client"

import { useState, useEffect } from "react"
import { Award, X } from "lucide-react"
import { cn } from "@/lib/utils"
import confetti from "canvas-confetti"

interface AchievementNotificationProps {
  achievement: {
    id: string
    name: string
    description: string
    icon: string
    xpGained?: number
  }
  onClose?: () => void
  autoClose?: boolean
  autoCloseDelay?: number
}

export function AchievementNotification({
  achievement,
  onClose,
  autoClose = true,
  autoCloseDelay = 5000,
}: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(true)

  // Effekt für automatisches Schließen
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        if (onClose) onClose()
      }, autoCloseDelay)

      return () => clearTimeout(timer)
    }
  }, [autoClose, autoCloseDelay, onClose])

  // Konfetti-Effekt beim Mounten
  useEffect(() => {
    // Konfetti-Effekt
    const canvas = document.createElement("canvas")
    canvas.style.position = "fixed"
    canvas.style.top = "0"
    canvas.style.left = "0"
    canvas.style.width = "100vw"
    canvas.style.height = "100vh"
    canvas.style.pointerEvents = "none"
    canvas.style.zIndex = "9999"
    document.body.appendChild(canvas)

    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true,
    })

    myConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFD700", "#FFC0CB", "#00FFFF", "#FF00FF", "#ADFF2F"],
    })

    // Animation nach 2 Sekunden beenden
    const animationTimer = setTimeout(() => {
      setIsAnimating(false)
    }, 2000)

    // Canvas nach der Animation entfernen
    const cleanupTimer = setTimeout(() => {
      document.body.removeChild(canvas)
    }, 3000)

    return () => {
      clearTimeout(animationTimer)
      clearTimeout(cleanupTimer)
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas)
      }
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) onClose()
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-4 z-50 flex justify-center transition-opacity duration-500",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      <div
        className={cn(
          "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-4 rounded-lg shadow-lg max-w-md w-full mx-4 relative overflow-hidden",
          isAnimating ? "animate-pulse" : "",
        )}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-white/80 hover:text-white"
          aria-label="Schließen"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center">
          <div className="bg-white/20 p-3 rounded-full mr-4">
            <Award className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">Achievement freigeschaltet!</h3>
            <p className="font-medium">{achievement.name}</p>
            <p className="text-sm text-white/80 mt-1">{achievement.description}</p>
            {achievement.xpGained && <p className="text-sm font-bold mt-2">+{achievement.xpGained} XP erhalten</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
