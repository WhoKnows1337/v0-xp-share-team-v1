"use client"

import type React from "react"

import { useState } from "react"
import { Search, X, Folder, SnowflakeIcon as Crystal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface NexusTopBarProps {
  searchQuery: string
  onSearch: (query: string) => void
  activeFilters: string[]
  onRemoveFilter: (filter: string) => void
}

export function NexusTopBar({ searchQuery, onSearch, activeFilters, onRemoveFilter }: NexusTopBarProps) {
  const [inputValue, setInputValue] = useState(searchQuery)
  const [mana, setMana] = useState(100) // Beispielwert

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSearch(inputValue.trim())
      setInputValue("")
    }
  }

  return (
    <div className="h-16 border-b border-gray-800 flex items-center px-4 gap-4">
      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="w-3/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Suche in 2.1 Mio XPs..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700 focus:border-cyan-400 focus:ring-cyan-400/20"
          />
        </div>
      </form>

      {/* Active Filters */}
      <div className="flex-1 flex items-center gap-2 overflow-x-auto">
        {activeFilters.map((filter) => (
          <Badge
            key={filter}
            variant="outline"
            className="px-2 py-1 bg-gray-800 hover:bg-gray-700 cursor-pointer group"
          >
            {filter}
            <X className="ml-1 h-3 w-3 text-gray-400 group-hover:text-white" onClick={() => onRemoveFilter(filter)} />
          </Badge>
        ))}
      </div>

      {/* Mana Meter */}
      <div className="flex items-center gap-2 text-cyan-400">
        <Crystal className="h-5 w-5" />
        <span className="text-sm font-medium">{mana} Mana</span>
      </div>

      {/* My Entries Button */}
      <Button variant="outline" className="flex items-center gap-2">
        <Folder className="h-4 w-4" />
        <span className="hidden md:inline">Meine Einträge</span>
      </Button>
    </div>
  )
}
