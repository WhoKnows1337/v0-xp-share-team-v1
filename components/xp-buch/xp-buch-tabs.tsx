"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { XPBuchEintraege } from "./xp-buch-eintraege"
import { XPBuchGespeicherte } from "./xp-buch-gespeicherte"
import { XPBuchKalender } from "./xp-buch-kalender"
import { XPBuchHabitTracker } from "./xp-buch-habit-tracker"
import { XPBuchStatistik } from "./xp-buch-statistik"
import { XPBuchFilter } from "./xp-buch-filter"
import { Button } from "@/components/ui/button"
import { PlusCircle, Calendar, BookOpen, Bookmark, BarChart2, Target } from "lucide-react"
import { ErlebnisWizardModal } from "../erlebnis-wizard-modal"

export function XPBuchTabs() {
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("eintraege")
  const [filterState, setFilterState] = useState({
    ansicht: "alle",
    zeitraum: "alle",
    kategorie: "alle",
    sortierung: "neuste",
    tag: "",
    ort: "",
    suche: "",
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilterState((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mein XP-Buch</h1>
        <Button onClick={() => setIsWizardOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Neuer Eintrag
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="eintraege" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Meine Einträge</span>
            <span className="sm:hidden">Einträge</span>
          </TabsTrigger>
          <TabsTrigger value="kalender" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Kalender</span>
            <span className="sm:hidden">Kalender</span>
          </TabsTrigger>
          <TabsTrigger value="gespeichert" className="flex items-center">
            <Bookmark className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Gespeichert</span>
            <span className="sm:hidden">Gespeichert</span>
          </TabsTrigger>
          <TabsTrigger value="habits" className="flex items-center">
            <Target className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Habit Tracker</span>
            <span className="sm:hidden">Habits</span>
          </TabsTrigger>
          <TabsTrigger value="statistik" className="flex items-center">
            <BarChart2 className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Statistik</span>
            <span className="sm:hidden">Statistik</span>
          </TabsTrigger>
        </TabsList>

        {activeTab === "eintraege" && <XPBuchFilter filterState={filterState} onFilterChange={handleFilterChange} />}

        <TabsContent value="eintraege" className="mt-4">
          <XPBuchEintraege filterState={filterState} />
        </TabsContent>

        <TabsContent value="kalender" className="mt-4">
          <XPBuchKalender onNewEntry={() => setIsWizardOpen(true)} />
        </TabsContent>

        <TabsContent value="gespeichert" className="mt-4">
          <XPBuchGespeicherte />
        </TabsContent>

        <TabsContent value="habits" className="mt-4">
          <XPBuchHabitTracker />
        </TabsContent>

        <TabsContent value="statistik" className="mt-4">
          <XPBuchStatistik />
        </TabsContent>
      </Tabs>

      <ErlebnisWizardModal isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
    </div>
  )
}
