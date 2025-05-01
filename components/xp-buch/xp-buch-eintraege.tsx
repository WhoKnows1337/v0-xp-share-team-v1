"use client"

import { useState } from "react"
import { useXPBuch } from "@/contexts/xp-buch-context"
import { XPEintragKarte } from "./xp-eintrag-karte"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EmptyState } from "./empty-state"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Grid2X2, List } from "lucide-react"

export function XPBuchEintraege() {
  const { state, setFilter } = useXPBuch()
  const { filteredEntries, filters } = state
  const { toast } = useToast()
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

  const handleResetFilter = () => {
    setFilter({})
    toast({
      title: "Filter zurückgesetzt",
      description: "Alle Filter wurden zurückgesetzt.",
      duration: 3000,
    })
  }

  // Bestimme den leeren Zustand basierend auf dem Filter
  const getEmptyStateType = () => {
    if (Object.keys(filters).length === 0) {
      return "empty"
    } else if (filters.searchTerm) {
      return "search"
    } else {
      return "filter"
    }
  }

  if (filteredEntries.length === 0) {
    return <EmptyState type={getEmptyStateType()} onCreateEntry={handleResetFilter} />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            {filteredEntries.length} {filteredEntries.length === 1 ? "Eintrag" : "Einträge"} gefunden
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "list" | "grid")}>
            <TabsList>
              <TabsTrigger value="list">
                <List className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="grid">
                <Grid2X2 className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-400px)] pr-4">
        {viewMode === "list" ? (
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <XPEintragKarte key={entry.id} eintrag={entry} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEntries.map((entry) => (
              <XPEintragKarte key={entry.id} eintrag={entry} isGridView />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
