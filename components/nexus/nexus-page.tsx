"use client"

import { useState, useEffect } from "react"
import { NexusTopBar } from "./nexus-top-bar"
import { NexusSidebar } from "./nexus-sidebar"
import { NexusMap } from "./nexus-map"
import { NexusTimeline } from "./nexus-timeline"
import { NexusResults } from "./nexus-results"
import { NexusInsights } from "./nexus-insights"
import { useToast } from "@/components/ui/use-toast"
import { useMediaQuery } from "@/hooks/use-media-query"

export function NexusPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeMapMode, setActiveMapMode] = useState<"pins" | "heatmap" | "radar" | "graph">("pins")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [timeRange, setTimeRange] = useState<[Date, Date]>([
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 Tage zurück
    new Date(),
  ])
  const [advancedFilters, setAdvancedFilters] = useState<any>({})
  const [sortOption, setSortOption] = useState<"relevanz" | "datum" | "popularitaet">("relevanz")
  const [savedSearches, setSavedSearches] = useState<any[]>([])
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const { toast } = useToast()
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Automatisch die Sidebar ausblenden auf mobilen Geräten
  useEffect(() => {
    if (isMobile) {
      setSidebarVisible(false)
    } else {
      setSidebarVisible(true)
    }
  }, [isMobile])

  // Simuliere Ladezeit
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query && !activeFilters.includes(query)) {
      setActiveFilters([...activeFilters, query])
    }
  }

  const handleRemoveFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))
  }

  const handleTimeRangeChange = (range: [Date, Date]) => {
    setTimeRange(range)
  }

  const handleApplyAdvancedFilters = (filters: any) => {
    setAdvancedFilters(filters)
    toast({
      title: "Filter angewendet",
      description: `${Object.keys(filters).filter((key) => filters[key]).length} Filter aktiv`,
    })
  }

  const handleSaveSearch = (search: any) => {
    setSavedSearches([...savedSearches, search])
    toast({
      title: "Suche gespeichert",
      description: `"${search.name}" wurde zu deinen gespeicherten Suchen hinzugefügt.`,
    })
  }

  const handleSortChange = (option: "relevanz" | "datum" | "popularitaet") => {
    setSortOption(option)
  }

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  return (
    <div className="flex flex-col h-screen bg-[#0C0F1A] text-[#E4E8FF]">
      {/* Top Bar */}
      <NexusTopBar
        searchQuery={searchQuery}
        onSearch={handleSearch}
        activeFilters={activeFilters}
        onRemoveFilter={handleRemoveFilter}
        onToggleSidebar={toggleSidebar}
        sidebarVisible={sidebarVisible}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarVisible && (
          <NexusSidebar
            activeFilters={activeFilters}
            onAddFilter={(filter) => setActiveFilters([...activeFilters, filter])}
            onRemoveFilter={handleRemoveFilter}
            onApplyAdvancedFilters={handleApplyAdvancedFilters}
            onSaveSearch={handleSaveSearch}
          />
        )}

        {/* Main Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Map */}
          <div className="flex-1 relative">
            <NexusMap
              mode={activeMapMode}
              onModeChange={setActiveMapMode}
              filters={activeFilters}
              timeRange={timeRange}
              advancedFilters={advancedFilters}
            />
          </div>

          {/* Timeline */}
          <NexusTimeline timeRange={timeRange} onTimeRangeChange={handleTimeRangeChange} />

          {/* Results and Insights */}
          <div className="h-1/2 flex flex-col overflow-hidden">
            <NexusInsights filters={activeFilters} advancedFilters={advancedFilters} />
            <NexusResults
              filters={activeFilters}
              timeRange={timeRange}
              advancedFilters={advancedFilters}
              sortOption={sortOption}
              onSortChange={handleSortChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
