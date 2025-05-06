"use client"

import { useState, useEffect } from "react"
import { NexusTopBar } from "./nexus-top-bar"
import { NexusSidebar } from "./nexus-sidebar"
import { NexusMap } from "./nexus-map"
import { NexusTimeline } from "./nexus-timeline"
import { NexusResults } from "./nexus-results"
import { NexusInsights } from "./nexus-insights"

export function NexusPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeMapMode, setActiveMapMode] = useState<"pins" | "heatmap" | "radar" | "graph">("pins")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [timeRange, setTimeRange] = useState<[Date, Date]>([
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 Tage zurück
    new Date(),
  ])

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

  return (
    <div className="flex flex-col h-screen bg-[#0C0F1A] text-[#E4E8FF]">
      {/* Top Bar */}
      <NexusTopBar
        searchQuery={searchQuery}
        onSearch={handleSearch}
        activeFilters={activeFilters}
        onRemoveFilter={handleRemoveFilter}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <NexusSidebar
          activeFilters={activeFilters}
          onAddFilter={(filter) => setActiveFilters([...activeFilters, filter])}
          onRemoveFilter={handleRemoveFilter}
        />

        {/* Main Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Map */}
          <div className="flex-1 relative">
            <NexusMap
              mode={activeMapMode}
              onModeChange={setActiveMapMode}
              filters={activeFilters}
              timeRange={timeRange}
            />
          </div>

          {/* Timeline */}
          <NexusTimeline timeRange={timeRange} onTimeRangeChange={handleTimeRangeChange} />

          {/* Results and Insights */}
          <div className="h-1/2 flex flex-col overflow-hidden">
            <NexusInsights filters={activeFilters} />
            <NexusResults filters={activeFilters} timeRange={timeRange} />
          </div>
        </div>
      </div>
    </div>
  )
}
