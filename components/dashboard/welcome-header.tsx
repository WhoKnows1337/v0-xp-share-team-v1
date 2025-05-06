"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, FileEdit, Upload, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getCurrentUser } from "@/lib/mock-users"

export function WelcomeHeader() {
  const currentUser = getCurrentUser()
  const [mana, setMana] = useState(75) // Mock-Daten: Verbleibende Mana-Punkte
  const [maxMana, setMaxMana] = useState(100) // Mock-Daten: Maximale Mana-Punkte pro Monat

  // Mock-Daten für Level und XP
  const level = 42
  const xp = 8750
  const worldContribution = 12 // Welten-Level-Beitrag

  // Funktion zum Öffnen des ErlebnisWizards
  const handleNewExperience = () => {
    if (typeof window !== "undefined") {
      const event = new CustomEvent("openErlebnisWizard")
      window.dispatchEvent(event)
    }
  }

  // Funktion zum Öffnen des Stores (Mock)
  const handleOpenStore = () => {
    console.log("Store für Stardust öffnen")
    // Hier würde die Logik zum Öffnen des Stores kommen
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 rounded-xl p-6 shadow-lg border border-slate-700"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Linke Seite: Avatar und Nutzerdaten */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16 border-2 border-emerald-500 shadow-md shadow-emerald-500/20">
              <AvatarImage src={currentUser?.avatar || "/placeholder.svg"} alt={currentUser?.name || "Benutzer"} />
              <AvatarFallback>{currentUser?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            {/* Level-Status-Ring */}
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-slate-800">
              {level}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{currentUser?.name || "Benutzer"}</h2>
              <span className="text-sm text-slate-400">@{currentUser?.username || "username"}</span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className="bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
                    >
                      XP {xp}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Deine gesammelten Erfahrungspunkte</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className="bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20"
                    >
                      Welten-Beitrag {worldContribution}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Dein Beitrag zum globalen Welten-Level</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Rechte Seite: Mana-Zähler und Schnell-Aktionen */}
        <div className="flex flex-col gap-4 w-full md:w-auto">
          {/* Mana-Zähler */}
          <div className="bg-slate-800 rounded-lg p-3 flex flex-col w-full md:w-auto">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-slate-300">Mana</span>
              <span className="text-sm font-medium text-emerald-400">
                {mana}/{maxMana}
              </span>
            </div>
            <div className="relative w-full md:w-48">
              <Progress value={(mana / maxMana) * 100} className="h-2 bg-slate-700" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 p-0 h-auto"
              onClick={handleOpenStore}
            >
              <Zap className="h-3 w-3 mr-1" />
              Mit Stardust aufladen
            </Button>
          </div>

          {/* Schnell-Aktionen */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
              onClick={handleNewExperience}
            >
              <Plus className="h-4 w-4 mr-1" />
              Neues XP
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
            >
              <FileEdit className="h-4 w-4 mr-1" />
              Entwurf fortsetzen
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20"
            >
              <Upload className="h-4 w-4 mr-1" />
              Import-Wizard
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
