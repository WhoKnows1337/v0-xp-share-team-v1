"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { XPBuchEintraege } from "./xp-buch-eintraege"
import { XPBuchKalender } from "./xp-buch-kalender"
import { XPBuchStatistik } from "./xp-buch-statistik"
import { XPBuchQuickEntry } from "./xp-buch-quick-entry"
import { XPBuchFilter } from "./xp-buch-filter"
import { XPBuchProvider } from "@/contexts/xp-buch-context"
import { Book, Calendar, BarChart, Settings, Download, Bell, BookMarked, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { XPExportDialog } from "./xp-export-dialog"
import { ReminderZeitplaner } from "./reminder-zeitplaner"
import { OfflineBanner } from "./offline-banner"
import { XPTypSelector, type XPTyp } from "./xp-typ-selector"

export function XPBuchLayout() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [activeSettingsTab, setActiveSettingsTab] = useState("erinnerungen")
  const [selectedXPTyp, setSelectedXPTyp] = useState<XPTyp>("erfahrung")
  const [activeTab, setActiveTab] = useState("alle")

  return (
    <XPBuchProvider>
      <div className="w-full space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">XP-Buch</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setIsExportOpen(true)}>
              <Download className="h-4 w-4 mr-2" />
              Exportieren
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsSettingsOpen(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Einstellungen
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">
          Dokumentiere und reflektiere deine persönlichen Erfahrungen und Erkenntnisse.
        </p>

        <OfflineBanner />

        <XPTypSelector selectedType={selectedXPTyp} onTypeChange={setSelectedXPTyp} />

        <XPBuchQuickEntry />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="alle" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              <span>Alle</span>
            </TabsTrigger>
            <TabsTrigger value="veroeffentlicht" className="flex items-center gap-2">
              <BookMarked className="h-4 w-4" />
              <span>Veröffentlicht</span>
            </TabsTrigger>
            <TabsTrigger value="entwuerfe" className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              <span>Entwürfe</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <XPBuchFilter />

        <Tabs defaultValue="eintraege" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="eintraege" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              <span>Einträge</span>
            </TabsTrigger>
            <TabsTrigger value="kalender" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Kalender</span>
            </TabsTrigger>
            <TabsTrigger value="statistik" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>Statistik</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="eintraege" className="space-y-4">
            <XPBuchEintraege />
          </TabsContent>

          <TabsContent value="kalender" className="space-y-4">
            <XPBuchKalender />
          </TabsContent>

          <TabsContent value="statistik" className="space-y-4">
            <XPBuchStatistik />
          </TabsContent>
        </Tabs>

        {/* Export Dialog */}
        <XPExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} />

        {/* Einstellungen Dialog */}
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>XP-Buch Einstellungen</DialogTitle>
            </DialogHeader>
            <Tabs value={activeSettingsTab} onValueChange={setActiveSettingsTab} className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="erinnerungen" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>Erinnerungen</span>
                </TabsTrigger>
                <TabsTrigger value="allgemein" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Allgemein</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="erinnerungen" className="py-4">
                <ReminderZeitplaner />
              </TabsContent>
              <TabsContent value="allgemein" className="py-4">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Hier kannst du allgemeine Einstellungen für dein XP-Buch vornehmen.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </XPBuchProvider>
  )
}
