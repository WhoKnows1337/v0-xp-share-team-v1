"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, Menu, X, Filter, ArrowDownAZ, ArrowUpAZ, Calendar, Clock, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Beispiel-Suchvorschläge
  const sampleSuggestions = [
    "luzide träume",
    "synchronizität",
    "déjà-vu",
    "außerkörperliche erfahrung",
    "meditation",
    "intuition",
    "telepathie",
    "präkognition",
    "nahtoderfahrung",
    "kategorie:traum",
    "verifiziert:true",
    "ort:berlin",
    "ort:münchen",
    "stimmung:positiv",
    "intensität:hoch",
  ]

  // Filtere Vorschläge basierend auf der Eingabe
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = sampleSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase()),
      )
      setSuggestions(filtered.slice(0, 5)) // Begrenze auf 5 Vorschläge
    } else {
      setSuggestions([])
    }
  }, [inputValue])

  // Schließe Vorschläge, wenn außerhalb geklickt wird
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
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
    setInputValue(e.target.value)
    setShowSuggestions(true)
  }

  const handleInputFocus = () => {
    if (inputValue.trim()) {
      setShowSuggestions(true)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue("")
    onSearch(suggestion)
    setShowSuggestions(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSearch(inputValue.trim())
      setInputValue("")
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#0C0F1A]">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="mr-2"
          aria-label={sidebarVisible ? "Sidebar ausblenden" : "Sidebar einblenden"}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="relative flex-1 max-w-xl">
          <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Suche nach Erfahrungen, Orten, Personen..."
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              className="pl-10 pr-10 bg-gray-900 border-gray-700 w-full"
            />
            {inputValue && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                onClick={() => setInputValue("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </form>

          {/* Suchvorschläge */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-10 mt-1 w-full bg-gray-900 border border-gray-700 rounded-md shadow-lg"
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-800 cursor-pointer flex items-center"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.includes(":") ? (
                    <>
                      <Badge variant="outline" className="mr-2">
                        {suggestion.split(":")[0]}
                      </Badge>
                      <span>{suggestion.split(":")[1]}</span>
                    </>
                  ) : (
                    <span>{suggestion}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 ml-4">
        {/* Aktive Filter */}
        <div className="hidden md:flex flex-wrap gap-2 mr-2">
          {activeFilters.map((filter) => (
            <Badge
              key={filter}
              variant="secondary"
              className="cursor-pointer flex items-center"
              onClick={() => onRemoveFilter(filter)}
            >
              {filter}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
        </div>

        {/* Operatoren */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border-none"
                onClick={() => onSearch("AND")}
              >
                AND
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>UND-Verknüpfung: Beide Begriffe müssen vorkommen</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-pink-500/20 text-pink-400 hover:bg-pink-500/30 border-none"
                onClick={() => onSearch("OR")}
              >
                OR
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>ODER-Verknüpfung: Mindestens ein Begriff muss vorkommen</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border-none"
                onClick={() => onSearch("NOT")}
              >
                NOT
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ausschluss: Begriff darf nicht vorkommen</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Schnellfilter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="ml-2">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Schnellfilter</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onSearch("verifiziert:true")}>
              <Badge className="mr-2 bg-green-500/20 text-green-400">verifiziert</Badge>
              Nur verifizierte Erfahrungen
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSearch("kategorie:traum")}>
              <Badge className="mr-2 bg-blue-500/20 text-blue-400">kategorie</Badge>
              Träume
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSearch("kategorie:synchronizität")}>
              <Badge className="mr-2 bg-blue-500/20 text-blue-400">kategorie</Badge>
              Synchronizitäten
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Zeitraum</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onSearch("zeitraum:heute")}>
              <Clock className="mr-2 h-4 w-4" />
              Heute
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSearch("zeitraum:woche")}>
              <Calendar className="mr-2 h-4 w-4" />
              Diese Woche
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSearch("zeitraum:monat")}>
              <Calendar className="mr-2 h-4 w-4" />
              Diesen Monat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sortierung */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <ArrowDownAZ className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sortieren nach</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <ArrowDownAZ className="mr-2 h-4 w-4" />
              Relevanz (absteigend)
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ArrowUpAZ className="mr-2 h-4 w-4" />
              Relevanz (aufsteigend)
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Clock className="mr-2 h-4 w-4" />
              Datum (neueste zuerst)
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Clock className="mr-2 h-4 w-4" />
              Datum (älteste zuerst)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* KI-Assistent */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border-none"
              >
                <Zap className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>KI-Assistent für komplexe Suchanfragen</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
