"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Filter, Plus, Calendar, MapPin, Users } from "lucide-react"
import { format } from "date-fns"
import { de } from "date-fns/locale"

// Mock-Daten für Events
const mockEvents = [
  {
    id: 1,
    title: "Gemeinsame Meditation im Park",
    description: "Eine Stunde gemeinsame Meditation im Stadtpark.",
    date: new Date(2023, 6, 15, 10, 0),
    location: "Stadtpark, Berlin",
    attendees: 12,
    maxAttendees: 20,
    category: "Wellness",
    image: "/meditation-experience.png",
  },
  {
    id: 2,
    title: "Kulinarischer Stadtspaziergang",
    description: "Entdecke die besten Street-Food-Spots der Stadt.",
    date: new Date(2023, 6, 18, 14, 0),
    location: "Marktplatz, München",
    attendees: 8,
    maxAttendees: 15,
    category: "Essen",
    image: "/italian-feast.png",
  },
  {
    id: 3,
    title: "Fotografie-Workshop",
    description: "Lerne, wie du beeindruckende Landschaftsfotos machst.",
    date: new Date(2023, 6, 20, 9, 0),
    location: "Schwarzwald",
    attendees: 6,
    maxAttendees: 10,
    category: "Kunst",
    image: "/black-forest-valley.png",
  },
  {
    id: 4,
    title: "Gemeinsame Wanderung",
    description: "Mittelschwere Wanderung mit atemberaubender Aussicht.",
    date: new Date(2023, 6, 22, 8, 0),
    location: "Alpen, Bayern",
    attendees: 15,
    maxAttendees: 25,
    category: "Natur",
    image: "/alpine-mountain-biking-adventure.png",
  },
  {
    id: 5,
    title: "Architektur-Tour",
    description: "Entdecke die beeindruckende Architektur der Stadt.",
    date: new Date(2023, 6, 25, 11, 0),
    location: "Hamburg",
    attendees: 10,
    maxAttendees: 20,
    category: "Städte",
    image: "/Elbphilharmonie-modern-maritime.png",
  },
  {
    id: 6,
    title: "Kreatives Schreiben",
    description: "Workshop zum Thema kreatives Schreiben und Storytelling.",
    date: new Date(2023, 6, 28, 18, 0),
    location: "Online",
    attendees: 20,
    maxAttendees: 30,
    category: "Kunst",
    image: "/abstract-jb.png",
  },
]

export function CommunityEvents() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredEvents, setFilteredEvents] = useState(mockEvents)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)

    if (term.trim() === "") {
      setFilteredEvents(mockEvents)
    } else {
      const filtered = mockEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(term.toLowerCase()) ||
          event.description.toLowerCase().includes(term.toLowerCase()) ||
          event.location.toLowerCase().includes(term.toLowerCase()) ||
          event.category.toLowerCase().includes(term.toLowerCase()),
      )
      setFilteredEvents(filtered)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Suche nach Events..." className="pl-10" value={searchTerm} onChange={handleSearch} />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Neues Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map((event) => (
          <Card key={event.id}>
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <Badge>{event.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="aspect-video relative mb-3 rounded-md overflow-hidden">
                <img src={event.image || "/placeholder.svg"} alt={event.title} className="object-cover w-full h-full" />
              </div>
              <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  {format(event.date, "PPP 'um' HH:mm 'Uhr'", { locale: de })}
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2" />
                  {event.attendees}/{event.maxAttendees} Teilnehmer
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full">Teilnehmen</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
