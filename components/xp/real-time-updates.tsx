"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { AchievementNotification } from "./achievement-notification"
import { LevelUpAnimation } from "./level-up-animation"

// Typen für die simulierten Ereignisse
type EventType = "achievement_unlocked" | "level_up" | "xp_gained" | "streak_updated"

interface SimulatedEvent {
  type: EventType
  data: any
}

// Mock-Daten für Achievements
const mockAchievements = [
  {
    id: "1",
    name: "Erster Beitrag",
    description: "Du hast deinen ersten Beitrag veröffentlicht!",
    icon: "Award",
    xpGained: 100,
  },
  {
    id: "2",
    name: "Kommentar-König",
    description: "Du hast 10 Kommentare geschrieben!",
    icon: "MessageSquare",
    xpGained: 50,
  },
  {
    id: "3",
    name: "Beliebter Beitrag",
    description: "Einer deiner Beiträge hat 50 Likes erhalten!",
    icon: "Heart",
    xpGained: 200,
  },
]

export function RealTimeUpdates() {
  const { toast } = useToast()
  const [showAchievement, setShowAchievement] = useState<boolean>(false)
  const [currentAchievement, setCurrentAchievement] = useState<any>(null)
  const [showLevelUp, setShowLevelUp] = useState<boolean>(false)
  const [levelUpData, setLevelUpData] = useState<{ previousLevel: number; newLevel: number } | null>(null)

  // Simuliere Echtzeit-Ereignisse
  useEffect(() => {
    // Zufällige Ereignisse generieren
    const generateRandomEvent = (): SimulatedEvent | null => {
      const random = Math.random()

      if (random < 0.3) {
        // Achievement freigeschaltet
        const achievement = mockAchievements[Math.floor(Math.random() * mockAchievements.length)]
        return {
          type: "achievement_unlocked",
          data: achievement,
        }
      } else if (random < 0.4) {
        // Level-Up
        return {
          type: "level_up",
          data: {
            previousLevel: Math.floor(Math.random() * 10) + 1,
            newLevel: Math.floor(Math.random() * 10) + 11,
          },
        }
      } else if (random < 0.7) {
        // XP erhalten
        return {
          type: "xp_gained",
          data: {
            amount: Math.floor(Math.random() * 50) + 5,
            reason: "Aktivität auf der Plattform",
          },
        }
      } else if (random < 0.8) {
        // Streak aktualisiert
        return {
          type: "streak_updated",
          data: {
            streak: Math.floor(Math.random() * 10) + 1,
          },
        }
      }

      return null
    }

    // Ereignis verarbeiten
    const processEvent = (event: SimulatedEvent) => {
      switch (event.type) {
        case "achievement_unlocked":
          setCurrentAchievement(event.data)
          setShowAchievement(true)
          break
        case "level_up":
          setLevelUpData(event.data)
          setShowLevelUp(true)
          break
        case "xp_gained":
          toast({
            title: "XP erhalten!",
            description: `+${event.data.amount} XP für ${event.data.reason}`,
            duration: 3000,
          })
          break
        case "streak_updated":
          toast({
            title: "Streak aktualisiert!",
            description: `Deine aktuelle Streak: ${event.data.streak} Tage`,
            duration: 3000,
          })
          break
      }
    }

    // Simuliere ein Ereignis alle 30 Sekunden
    const eventInterval = setInterval(() => {
      const event = generateRandomEvent()
      if (event) {
        processEvent(event)
      }
    }, 30000)

    // Simuliere ein initiales Ereignis nach 5 Sekunden
    const initialTimeout = setTimeout(() => {
      const event = generateRandomEvent()
      if (event) {
        processEvent(event)
      }
    }, 5000)

    return () => {
      clearInterval(eventInterval)
      clearTimeout(initialTimeout)
    }
  }, [toast])

  return (
    <>
      {showAchievement && currentAchievement && (
        <AchievementNotification achievement={currentAchievement} onClose={() => setShowAchievement(false)} />
      )}
      {showLevelUp && levelUpData && (
        <LevelUpAnimation
          previousLevel={levelUpData.previousLevel}
          newLevel={levelUpData.newLevel}
          onClose={() => setShowLevelUp(false)}
        />
      )}
    </>
  )
}
