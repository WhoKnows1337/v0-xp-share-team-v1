"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { Trophy, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuestCompletionProps {
  questTitle: string
  reward: string
  onClose: () => void
  autoClose?: boolean
  autoCloseDelay?: number
}

export function QuestCompletion({
  questTitle,
  reward,
  onClose,
  autoClose = true,
  autoCloseDelay = 6000,
}: QuestCompletionProps) {
  const [isVisible, setIsVisible] = useState(true)

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

    // Konfetti von unten nach oben
    myConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.7 },
      gravity: 0.8,
      colors: ["#FFD700", "#FFC0CB", "#00FFFF", "#FF00FF", "#ADFF2F"],
    })

    // Automatisches Schließen
    let closeTimer: NodeJS.Timeout
    if (autoClose) {
      closeTimer = setTimeout(() => {
        setIsVisible(false)
        if (onClose) onClose()
        document.body.removeChild(canvas)
      }, autoCloseDelay)
    }

    return () => {
      if (autoClose) clearTimeout(closeTimer)
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas)
      }
    }
  }, [autoClose, autoCloseDelay, onClose])

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) onClose()
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={handleClose}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 15 }}
        className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-white/70 hover:text-white p-1 rounded-full hover:bg-black/10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="bg-white/20 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <Trophy className="h-10 w-10 text-white" />
        </div>

        <h2 className="text-white text-2xl font-bold mb-2">Quest abgeschlossen!</h2>
        <p className="text-white/90 mb-4">{questTitle}</p>

        <div className="bg-white/20 p-3 rounded-lg mb-4">
          <p className="text-white font-medium">Belohnung erhalten:</p>
          <p className="text-amber-100 text-lg">{reward}</p>
        </div>

        <Button
          onClick={handleClose}
          className="bg-white/20 hover:bg-white/30 text-white border-none w-full py-2 rounded-md font-medium"
        >
          Weiter
        </Button>
      </motion.div>
    </div>
  )
}
