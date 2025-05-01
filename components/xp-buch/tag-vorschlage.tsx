"use client"

import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { X, Plus, Tag } from "lucide-react"
import { useXPBuch } from "@/contexts/xp-buch-context"
import { suggestTags, findSimilarTags, getAllUniqueTags } from "@/lib/tag-utils"
import { cn } from "@/lib/utils"

interface TagVorschlageProps {
  content: string
  selectedTags: string[]
  onChange: (tags: string[]) => void
  className?: string
}

export function TagVorschlage({ content, selectedTags, onChange, className }: TagVorschlageProps) {
  const { state } = useXPBuch()
  const [inputValue, setInputValue] = useState("")
  const [suggestedTags, setSuggestedTags] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Alle einzigartigen Tags aus allen Einträgen sammeln
  const allTags = getAllUniqueTags(state.entries)

  // Tags basierend auf dem Inhalt und vorhandenen Einträgen vorschlagen
  useEffect(() => {
    if (content) {
      const suggestions = suggestTags(content, selectedTags, state.entries)
      setSuggestedTags(suggestions)
    }
  }, [content, selectedTags, state.entries])

  // Tag hinzufügen
  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      onChange([...selectedTags, tag])
      setInputValue("")
      inputRef.current?.focus()
    }
  }

  // Tag entfernen
  const removeTag = (tag: string) => {
    onChange(selectedTags.filter((t) => t !== tag))
  }

  // Ähnliche Tags basierend auf der Eingabe finden
  const similarTags = findSimilarTags(inputValue, allTags)

  // Alle Tags, die angezeigt werden sollen (Vorschläge und ähnliche Tags)
  const displayTags = [...new Set([...suggestedTags, ...similarTags])].filter((tag) => !selectedTags.includes(tag))

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1 px-3 py-1">
            {tag}
            <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1" onClick={() => removeTag(tag)}>
              <X className="h-3 w-3" />
              <span className="sr-only">Tag entfernen</span>
            </Button>
          </Badge>
        ))}
      </div>

      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                placeholder="Tag hinzufügen..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputValue) {
                    addTag(inputValue)
                    e.preventDefault()
                  }
                }}
                className="w-full"
                onClick={() => setOpen(true)}
              />
              <Tag className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Command>
              <CommandInput placeholder="Tag suchen..." />
              <CommandList>
                <CommandEmpty>Keine passenden Tags gefunden</CommandEmpty>
                <CommandGroup heading="Vorschläge">
                  {displayTags.length > 0 ? (
                    displayTags.map((tag) => (
                      <CommandItem
                        key={tag}
                        onSelect={() => {
                          addTag(tag)
                          setOpen(false)
                        }}
                      >
                        {tag}
                      </CommandItem>
                    ))
                  ) : (
                    <CommandItem disabled>Keine Vorschläge verfügbar</CommandItem>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Button
          type="button"
          size="icon"
          onClick={() => {
            if (inputValue) {
              addTag(inputValue)
            }
          }}
          disabled={!inputValue}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Tag hinzufügen</span>
        </Button>
      </div>

      {suggestedTags.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-muted-foreground mb-1">Vorschläge:</p>
          <div className="flex flex-wrap gap-1">
            {suggestedTags.slice(0, 5).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer hover:bg-secondary"
                onClick={() => addTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
