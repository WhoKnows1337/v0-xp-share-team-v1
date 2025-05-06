"use client"

import type React from "react"

import { useState } from "react"
import { Search, X, Menu, User, Bell, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
    <div className="h-16 border-b border-gray-800 bg-gray-900 flex items-center justify-between px-4">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={onToggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>

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

      <div className="flex items-center space-x-2">
        {activeFilters.length > 0 && (
          <div className="hidden md:flex items-center space-x-2 mr-2">
            <Badge variant="outline" className="bg-gray-800">
              {activeFilters.length} Filter aktiv
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => activeFilters.forEach(onRemoveFilter)}>
              <X className="h-4 w-4 mr-1" />
              Zurücksetzen
            </Button>
          </div>
        )}

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/contemplative-woman.png" alt="Benutzer" />
                <AvatarFallback>MK</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Einstellungen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
