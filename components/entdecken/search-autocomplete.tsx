"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchAutocompleteProps {
  placeholder?: string
  onSearch: (term: string) => void
  suggestions?: string[]
  className?: string
  kategorien?: string[]
  tags?: string[]
  orte?: string[]
}

export function SearchAutocomplete({
  placeholder = "Suchen...",
  onSearch,
  suggestions = [],
  className = "",
  kategorien = [],
  tags = [],
  orte = [],
}: SearchAutocompleteProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Kombiniere alle Vorschläge
  const allSuggestions = [...(suggestions || []), ...(kategorien || []), ...(tags || []), ...(orte || [])]

  useEffect(() => {
    // Filtere Vorschläge basierend auf dem Suchbegriff
    if (searchTerm && allSuggestions && allSuggestions.length > 0) {
      const filtered = allSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredSuggestions(filtered)
    } else {
      setFilteredSuggestions([])
    }
  }, [searchTerm])

  useEffect(() => {
    // Schließe Vorschläge, wenn außerhalb geklickt wird
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setShowSuggestions(value.length > 0)
  }

  const handleSearch = () => {
    onSearch(searchTerm)
    setShowSuggestions(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion)
    onSearch(suggestion)
    setShowSuggestions(false)
  }

  const handleClearSearch = () => {
    setSearchTerm("")
    onSearch("")
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(searchTerm.length > 0)}
          className="pr-16"
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleClearSearch}
              aria-label="Suche löschen"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleSearch}
            aria-label="Suchen"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showSuggestions && filteredSuggestions && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-muted cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
