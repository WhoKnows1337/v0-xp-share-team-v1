"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { motion } from "framer-motion"
import { WelcomeHeader } from "./welcome-header"
import { ProgressCard } from "./progress-card"
import { CommunityFeed } from "./community-feed"
import { QuestsGroups } from "./quests-groups"
import { AIInsights } from "./ai-insights"
import { DraftsJournal } from "./drafts-journal"
import { PhenomenaTicker } from "./phenomena-ticker"
import { CollapsibleCard } from "./collapsible-card"
import { QuestCompletion } from "./quest-completion"
import { useToast } from "@/components/ui/use-toast"

// Definiere die Struktur für die Dashboard-Blöcke
type DashboardBlock = {
  id: string
  title: string
  component: React.ReactNode
  defaultCollapsed?: boolean
}

export function DashboardOverview() {
  const { toast } = useToast()
  const [showQuestCompletion, setShowQuestCompletion] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Setze isClient auf true, wenn die Komponente auf dem Client gerendert wird
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Demo-Funktion zum Anzeigen der Quest-Abschluss-Animation
  const triggerQuestCompletion = () => {
    setShowQuestCompletion(true)
  }

  // Definiere die Dashboard-Blöcke für die linke Spalte
  const [leftBlocks, setLeftBlocks] = useState<DashboardBlock[]>([
    {
      id: "progress",
      title: "Mein Fortschritt",
      component: <ProgressCard />,
    },
    {
      id: "community",
      title: "Community Feed",
      component: <CommunityFeed onQuestComplete={triggerQuestCompletion} />,
    },
    {
      id: "drafts",
      title: "Entwürfe & Privates Tagebuch",
      component: <DraftsJournal />,
      defaultCollapsed: true,
    },
  ])

  // Definiere die Dashboard-Blöcke für die rechte Spalte
  const [rightBlocks, setRightBlocks] = useState<DashboardBlock[]>([
    {
      id: "quests",
      title: "Aktive Quests & Gruppen",
      component: <QuestsGroups />,
    },
    {
      id: "insights",
      title: "AI-Insights",
      component: <AIInsights />,
    },
    {
      id: "phenomena",
      title: "Externe Phänomene",
      component: <PhenomenaTicker />,
      defaultCollapsed: true,
    },
  ])

  // Speichere die Reihenfolge im localStorage
  useEffect(() => {
    if (!isClient) return

    const savedLeftBlocks = localStorage.getItem("dashboardLeftBlocks")
    const savedRightBlocks = localStorage.getItem("dashboardRightBlocks")

    if (savedLeftBlocks) {
      try {
        const parsedLeftBlocks = JSON.parse(savedLeftBlocks)
        // Stelle sicher, dass die gespeicherten IDs mit den aktuellen übereinstimmen
        if (parsedLeftBlocks.every((id: string) => leftBlocks.some((block) => block.id === id))) {
          setLeftBlocks((prevBlocks) => {
            const newOrder = [...prevBlocks]
            return parsedLeftBlocks.map((id: string) => newOrder.find((block) => block.id === id)!)
          })
        }
      } catch (e) {
        console.error("Fehler beim Parsen der gespeicherten linken Blöcke:", e)
      }
    }

    if (savedRightBlocks) {
      try {
        const parsedRightBlocks = JSON.parse(savedRightBlocks)
        if (parsedRightBlocks.every((id: string) => rightBlocks.some((block) => block.id === id))) {
          setRightBlocks((prevBlocks) => {
            const newOrder = [...prevBlocks]
            return parsedRightBlocks.map((id: string) => newOrder.find((block) => block.id === id)!)
          })
        }
      } catch (e) {
        console.error("Fehler beim Parsen der gespeicherten rechten Blöcke:", e)
      }
    }
  }, [isClient])

  // Speichere die Reihenfolge bei Änderungen
  useEffect(() => {
    if (!isClient) return

    localStorage.setItem("dashboardLeftBlocks", JSON.stringify(leftBlocks.map((block) => block.id)))
    localStorage.setItem("dashboardRightBlocks", JSON.stringify(rightBlocks.map((block) => block.id)))
  }, [leftBlocks, rightBlocks, isClient])

  // Funktion zum Verschieben eines Blocks
  const moveBlock = (
    sourceList: "left" | "right",
    sourceIndex: number,
    destList: "left" | "right",
    destIndex: number,
  ) => {
    if (sourceList === "left" && destList === "left") {
      // Innerhalb der linken Spalte verschieben
      const newLeftBlocks = [...leftBlocks]
      const [removed] = newLeftBlocks.splice(sourceIndex, 1)
      newLeftBlocks.splice(destIndex, 0, removed)
      setLeftBlocks(newLeftBlocks)
    } else if (sourceList === "right" && destList === "right") {
      // Innerhalb der rechten Spalte verschieben
      const newRightBlocks = [...rightBlocks]
      const [removed] = newRightBlocks.splice(sourceIndex, 1)
      newRightBlocks.splice(destIndex, 0, removed)
      setRightBlocks(newRightBlocks)
    } else if (sourceList === "left" && destList === "right") {
      // Von links nach rechts verschieben
      const newLeftBlocks = [...leftBlocks]
      const [removed] = newLeftBlocks.splice(sourceIndex, 1)
      const newRightBlocks = [...rightBlocks]
      newRightBlocks.splice(destIndex, 0, removed)
      setLeftBlocks(newLeftBlocks)
      setRightBlocks(newRightBlocks)
    } else if (sourceList === "right" && destList === "left") {
      // Von rechts nach links verschieben
      const newRightBlocks = [...rightBlocks]
      const [removed] = newRightBlocks.splice(sourceIndex, 1)
      const newLeftBlocks = [...leftBlocks]
      newLeftBlocks.splice(destIndex, 0, removed)
      setRightBlocks(newRightBlocks)
      setLeftBlocks(newLeftBlocks)
    }

    // Zeige Toast-Nachricht an
    toast({
      title: "Dashboard angepasst",
      description: "Die Anordnung deiner Dashboard-Elemente wurde gespeichert.",
      duration: 3000,
    })
  }

  // Funktion zum Starten des Drag-Vorgangs
  const handleDragStart = (e: React.DragEvent, list: "left" | "right", index: number) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ list, index }))
    e.dataTransfer.effectAllowed = "move"
  }

  // Funktion zum Überwachen des Drag-Over-Ereignisses
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  // Funktion zum Verarbeiten des Drop-Ereignisses
  const handleDrop = (e: React.DragEvent, list: "left" | "right", index: number) => {
    e.preventDefault()

    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"))
      if (data && typeof data.list === "string" && typeof data.index === "number") {
        moveBlock(data.list, data.index, list, index)
      }
    } catch (error) {
      console.error("Fehler beim Parsen der Drag-Daten:", error)
    }
  }

  // Wenn die Komponente noch nicht auf dem Client gerendert wurde, zeige einen Ladeindikator an
  if (!isClient) {
    return (
      <div className="space-y-6">
        <WelcomeHeader />
        <div className="flex justify-center items-center py-12">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-emerald-500 animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Willkommens-Header */}
      <WelcomeHeader />

      {/* Quest-Abschluss-Animation */}
      {showQuestCompletion && (
        <QuestCompletion
          questTitle="30 Tage Meditation"
          reward="250 XP + Achtsamkeits-Badge"
          onClose={() => setShowQuestCompletion(false)}
        />
      )}

      {/* Hauptinhalt in Grid-Layout mit Drag-and-Drop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Linke Spalte */}
        <div className="lg:col-span-2 space-y-6" onDragOver={handleDragOver}>
          {leftBlocks.map((block, index) => (
            <div
              key={block.id}
              draggable
              onDragStart={(e) => handleDragStart(e, "left", index)}
              onDrop={(e) => handleDrop(e, "left", index)}
              className="cursor-move"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <CollapsibleCard title={block.title} defaultCollapsed={block.defaultCollapsed} id={block.id}>
                  {block.component}
                </CollapsibleCard>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Rechte Spalte */}
        <div className="space-y-6" onDragOver={handleDragOver}>
          {rightBlocks.map((block, index) => (
            <div
              key={block.id}
              draggable
              onDragStart={(e) => handleDragStart(e, "right", index)}
              onDrop={(e) => handleDrop(e, "right", index)}
              className="cursor-move"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <CollapsibleCard title={block.title} defaultCollapsed={block.defaultCollapsed} id={block.id}>
                  {block.component}
                </CollapsibleCard>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
