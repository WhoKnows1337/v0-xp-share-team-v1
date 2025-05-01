"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useXPBuch } from "@/contexts/xp-buch-context"
import { CalendarIcon, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { getAllTags } from "@/lib/tag-utils"

export function XPBuchFilter() {
  const { setFilter } = useXPBuch()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined])
  const [startDate, endDate] = dateRange

  const tags = getAllTags()

  // Mock-Kategorien und Orte
  const categories = ["Persönlich", "Beruflich", "Reise", "Bildung", "Spirituell", "Gesundheit"]
  const locations = ["Berlin", "Hamburg", "München", "Köln", "Frankfurt", "Online"]

  // Anwenden der Filter
  const applyFilters = () => {
    const filters: any = {}

    if (selectedTag && selectedTag !== "all") {
      filters.tag = selectedTag
    }

    if (selectedCategory && selectedCategory !== "all") {
      filters.category = selectedCategory
    }

    if (selectedLocation && selectedLocation !== "all") {
      filters.location = selectedLocation
    }

    if (startDate && endDate) {
      filters.dateRange = [startDate, endDate]
    }

    if (searchTerm) {
      filters.searchTerm = searchTerm
    }

    setFilter(filters)
  }

  // Zurücksetzen der Filter
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedTag("")
    setSelectedCategory("")
    setSelectedLocation("")
    setDateRange([undefined, undefined])
    setFilter({})
  }

  // Automatisches Anwenden der Filter bei Änderungen
  useEffect(() => {
    applyFilters()
  }, [selectedTag, selectedCategory, selectedLocation, startDate, endDate, searchTerm])

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Suche</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Einträge durchsuchen..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag">Tag</Label>
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger id="tag">
                <SelectValue placeholder="Tag auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Tags</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategorie</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Kategorie auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Kategorien</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ort</Label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger id="location">
                <SelectValue placeholder="Ort auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Orte</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Zeitraum</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate && endDate ? (
                    <>
                      {format(startDate, "PPP", { locale: de })} - {format(endDate, "PPP", { locale: de })}
                    </>
                  ) : (
                    <span>Zeitraum auswählen</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={startDate}
                  selected={{
                    from: startDate,
                    to: endDate,
                  }}
                  onSelect={(range) => {
                    setDateRange([range?.from, range?.to])
                  }}
                  numberOfMonths={2}
                  locale={de}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-end md:col-span-2">
            <Button variant="outline" onClick={resetFilters} className="flex items-center">
              <X className="mr-2 h-4 w-4" />
              Filter zurücksetzen
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
