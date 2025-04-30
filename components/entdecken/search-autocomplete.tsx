"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"

interface SearchSuggestion {
  type: "kategorie" | "tag" | "titel" | "ort" | "synonym"
  value: string
  originalValue?: string // Für Synonyme
}

interface SearchAutocompleteProps {
  onSearch: (query: string) => void
  initialValue?: string
  kategorien?: Array<{ name: string; icon: string; farbe: string }>
  tags?: string[]
  orte?: string[]
  titel?: string[]
  className?: string
  placeholder?: string
}

// Synonyme für häufige Suchbegriffe
const synonymMap: Record<string, string[]> = {
  alien: ["Außerirdische", "UFO", "Fremde Wesen"],
  geist: ["Erscheinung", "Spuk", "Paranormale Begegnung"],
  traum: ["Schlafvision", "Traumwelt", "Nachttraum"],
  vision: ["Erscheinung", "Halluzination", "Spirituelle Erfahrung"],
  engel: ["Himmlische Wesen", "Spirituelle Erscheinung", "Lichtgestalt"],
  tod: ["Nahtoderfahrung", "Jenseits", "Lebensende"],
  zufall: ["Synchronizität", "Fügung", "Schicksal"],
  deja: ["Déjà-vu", "Erinnerung"],
  meditation: ["Achtsamkeit", "Spirituelle Übung", "Bewusstseinserweiterung"],
}

export function SearchAutocomplete({
  onSearch,
  initialValue = "",
  kategorien = [],
  tags = [],
  orte = [],
  titel = [],
  className = "",
  placeholder = "Suche nach Erlebnissen...",
}: SearchAutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState(initialValue)
  const inputRef = useRef<HTMLInputElement>(null)

  // Generiere Suchvorschläge basierend auf der Eingabe
  const generateSuggestions = (query: string): SearchSuggestion[] => {
    if (!query || query.length < 2) {
      return []
    }

    const results: SearchSuggestion[] = []
    const addedValues = new Set<string>() // Verhindert Duplikate
    const lowercaseQuery = query.toLowerCase()

    // Prüfe auf Synonyme
    Object.entries(synonymMap).forEach(([key, synonyms]) => {
      if (lowercaseQuery.includes(key) && !addedValues.has(key)) {
        synonyms.forEach((synonym) => {
          if (!addedValues.has(synonym)) {
            results.push({ type: "synonym", value: synonym, originalValue: key })
            addedValues.add(synonym)
          }
        })
      }
    })

    // Kategorien durchsuchen
    kategorien.forEach((kategorie) => {
      if (kategorie.name.toLowerCase().includes(lowercaseQuery) && !addedValues.has(kategorie.name)) {
        results.push({ type: "kategorie", value: kategorie.name })
        addedValues.add(kategorie.name)
      }
    })

    // Tags durchsuchen
    tags.forEach((tag) => {
      if (tag.toLowerCase().includes(lowercaseQuery) && !addedValues.has(tag)) {
        results.push({ type: "tag", value: tag })
        addedValues.add(tag)
      }
    })

    // Orte durchsuchen
    orte.forEach((ort) => {
      if (ort.toLowerCase().includes(lowercaseQuery) && !addedValues.has(ort)) {
        results.push({ type: "ort", value: ort })
        addedValues.add(ort)
      }
    })

    // Titel durchsuchen
    titel.forEach((t) => {
      if (t.toLowerCase().includes(lowercaseQuery) && !addedValues.has(t)) {
        results.push({ type: "titel", value: t })
        addedValues.add(t)
      }
    })

    // Sortiere Ergebnisse: Synonyme zuerst, dann nach Relevanz (exakte Übereinstimmung zuerst)
    results.sort((a, b) => {
      // Synonyme haben höchste Priorität
      if (a.type === "synonym" && b.type !== "synonym") return -1
      if (a.type !== "synonym" && b.type === "synonym") return 1

      // Dann nach Typ sortieren
      const typeOrder = { kategorie: 0, tag: 1, ort: 2, titel: 3 }
      if (typeOrder[a.type] !== typeOrder[b.type]) {
        return typeOrder[a.type] - typeOrder[b.type]
      }

      // Dann nach exakter Übereinstimmung
      const aExact = a.value.toLowerCase() === lowercaseQuery
      const bExact = b.value.toLowerCase() === lowercaseQuery
      if (aExact && !bExact) return -1
      if (!aExact && bExact) return 1

      // Dann nach Länge (kürzere zuerst)
      return a.value.length - b.value.length
    })

    // Begrenze auf 10 Vorschläge
    return results.slice(0, 10)
  }

  // Vorschlag auswählen
  const selectSuggestion = (suggestion: SearchSuggestion) => {
    setSearchValue(suggestion.value)
    onSearch(suggestion.value)
    setOpen(false)
    inputRef.current?.focus()
  }

  // Suche ausführen
  const handleSearch = () => {
    onSearch(searchValue)
    setOpen(false)
  }

  // Tastatureingaben verarbeiten
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  // Eingabeänderungen verarbeiten
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)

    // Vorschläge nur anzeigen, wenn mindestens 2 Zeichen eingegeben wurden
    if (value.length >= 2) {
      const suggestions = generateSuggestions(value)
      setOpen(suggestions.length > 0)
    } else {
      setOpen(false)
    }
  }

  // Vorschläge für die aktuelle Eingabe
  const suggestions = searchValue.length >= 2 ? generateSuggestions(searchValue) : []

  return (
    <div className={`relative ${className}`} ref={inputRef}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-10 pr-4"
        value={searchValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        onFocus={() => {
          if (searchValue.length >= 2) {
            const suggestions = generateSuggestions(searchValue)
            setOpen(suggestions.length > 0)
          }
        }}
      />

      {open && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg overflow-hidden">
          <Command>
            <CommandList>
              <CommandEmpty>Keine Vorschläge gefunden</CommandEmpty>
              <CommandGroup heading="Suchvorschläge">
                {suggestions.map((suggestion, index) => (
                  <CommandItem
                    key={`${suggestion.type}-${index}`}
                    onSelect={() => selectSuggestion(suggestion)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-muted cursor-pointer"
                  >
                    {suggestion.type === "kategorie" && (
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Kategorie</Badge>
                    )}
                    {suggestion.type === "tag" && (
                      <Badge className="bg-secondary/20 text-secondary-foreground hover:bg-secondary/30">Tag</Badge>
                    )}
                    {suggestion.type === "ort" && (
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800">
                        Ort
                      </Badge>
                    )}
                    {suggestion.type === "titel" && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800">
                        Titel
                      </Badge>
                    )}
                    {suggestion.type === "synonym" && (
                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800">
                        Meintest du
                      </Badge>
                    )}
                    <span className="flex-1">{suggestion.value}</span>
                    {suggestion.originalValue && (
                      <span className="text-xs text-muted-foreground">für "{suggestion.originalValue}"</span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  )
}
