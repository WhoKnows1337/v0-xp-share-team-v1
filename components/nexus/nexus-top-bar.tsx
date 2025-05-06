"use client"

import type React from "react"

import { useState } from "react"
import { Search, X, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface NexusTopBarProps {
  searchQuery: string
  onSearch: (query: string) => void
  activeFilters: string[]
  onRemoveFilter: (filter: string) => void
  onToggleSidebar: () => void
  sidebarVisible: boolean
}

export function NexusTopBar({
  searchQuery,
  onSearch,
  activeFilters,
  onRemoveFilter,
  onToggleSidebar,
  sidebarVisible,
}: NexusTopBarProps) {
  const [inputValue, setInputValue] = useState(searchQuery)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSearch(inputValue.trim())
    }
  }

  return (
    <div className="h-16 border-b border-gray-800 bg-gray-900 flex items-center px-4">
      {/* Linke Seite mit Sidebar-Toggle */}
      <div className="w-1/4 flex items-center justify-start">
        <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={onToggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Zentrierte Suchleiste */}
      <div className="w-2/4 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Suche im Nexus..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 w-full"
          />
        </form>
      </div>

      {/* Rechte Seite mit Filtern */}
      <div className="w-1/4 flex items-center justify-end">
        {activeFilters.length > 0 && (
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-gray-800">
              {activeFilters.length} Filter aktiv
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => activeFilters.forEach(onRemoveFilter)}>
              <X className="h-4 w-4 mr-1" />
              Zurücksetzen
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
