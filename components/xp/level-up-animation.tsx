"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { LevelChip } from "./level-chip"
import confetti from "canvas-confetti"

interface LevelUpAnimationProps {
  previousLevel: number
  newLevel: number
  onClose?: () => void
  autoClose?: boolean
  autoCloseDelay?: number
}

export function LevelUpAnimation({
  previousLevel,
  newLevel,
  onClose,
  autoClose = true,
  autoCloseDelay = 6000,
}: LevelUpAnimationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [stage, setStage] = useState<"initial" | "transition" | "final">("initial")

  // Effekt für die Animation
  useEffect(() => {
    // Starte mit dem vorherigen Level
    const stageTimer = setTimeout(() => {
      // Übergang zum neuen Level
      setStage("transition")

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

      // Konfetti von unten nach oben
      myConfetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.8 },
        gravity: 0.8,
        colors: ["#FFD700", "#FFC0CB", "#00FFFF", "#FF00FF", "#ADFF2F"],
      })

      // Nach der Übergangsanimation zum finalen Zustand
      setTimeout(() => {
        setStage("final")

        // Canvas nach der Animation entfernen
        setTimeout(() => {
          document.body.removeChild(canvas)
        }, 2000)
      }, 1500)
    }, 1000)

    // Automatisches Schließen
    let closeTimer: NodeJS.Timeout
    if (autoClose) {
      closeTimer = setTimeout(() => {
        setIsVisible(false)
        if (onClose) onClose()
      }, autoCloseDelay)
    }

    return () => {
      clearTimeout(stageTimer)
      if (autoClose) clearTimeout(closeTimer)
    }
  }, [previousLevel, newLevel, autoClose, autoCloseDelay, onClose])

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) onClose()
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={handleClose}>
      <div
        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-white text-2xl font-bold mb-6">Level Up!</h2>

        <div className="flex justify-center items-center space-x-8 mb-6">
          <div className="text-center">
            <LevelChip
              level={previousLevel}
              size="lg"
              className={cn(
                "h-20 w-20 text-2xl mx-auto transition-all duration-500",
                stage !== "initial" && "opacity-50 scale-75",
              )}
            />
            <p className="text-white mt-2">Level {previousLevel}</p>
          </div>

          <div className="text-white text-2xl font-bold">→</div>

          <div className="text-center">
            <LevelChip
              level={newLevel}
              size="lg"
              className={cn(
                "h-20 w-20 text-2xl mx-auto transition-all duration-500",
                stage === "initial" && "opacity-0 scale-50",
                stage === "transition" && "animate-bounce",
                stage === "final" && "scale-110",
              )}
            />
            <p className="text-white mt-2">Level {newLevel}</p>
          </div>
        </div>

        <div className="text-white">
          <p className="text-lg font-medium mb-2">Glückwunsch!</p>
          <p>Du hast Level {newLevel} erreicht und neue Funktionen freigeschaltet.</p>
        </div>

        <button
          onClick={handleClose}
          className="mt-6 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Weiter
        </button>
      </div>
    </div>
  )
}
