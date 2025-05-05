"use client"

import type React from "react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Filter, Users, Plus } from "lucide-react"
import { useState } from "react"

// Mock-Daten für Gruppen
const mockGroups = [
  {
    id: 1,
    name: "Reiseliebhaber",
    description: "Eine Gruppe für Menschen, die gerne reisen und ihre Erfahrungen teilen.",
    members: 128,
    category: "Reisen",
    image: "/abstract-geometric-shapes.png",
  },
  {
    id: 2,
    name: "Meditationskreis",
    description: "Teile deine Meditationserfahrungen und lerne von anderen.",
    members: 76,
    category: "Wellness",
    image: "/meditation-experience.png",
  },
  {
    id: 3,
    name: "Kulinarische Abenteuer",
    description: "Für Feinschmecker und Entdecker neuer Geschmackserlebnisse.",
    members: 94,
    category: "Essen",
    image: "/italian-feast.png",
  },
  {
    id: 4,
    name: "Naturverbundene",
    description: "Erlebnisse in der Natur und Umweltschutz.",
    members: 112,
    category: "Natur",
    image: "/black-forest-valley.png",
  },
  {
    id: 5,
    name: "Kreative Köpfe",
    description: "Künstlerische und kreative Erfahrungen austauschen.",
    members: 87,
    category: "Kunst",
    image: "/abstract-jb.png",
  },
  {
    id: 6,
    name: "Stadtentdecker",
    description: "Urbane Erlebnisse und Geheimtipps für Städtereisen.",
    members: 65,
    category: "Städte",
    image: "/barcelona-cityscape.png",
  },
]

export function CommunityGroups() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredGroups, setFilteredGroups] = useState(mockGroups)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)

    if (term.trim() === "") {
      setFilteredGroups(mockGroups)
    } else {
      const filtered = mockGroups.filter(
        (group) =>
          group.name.toLowerCase().includes(term.toLowerCase()) ||
          group.description.toLowerCase().includes(term.toLowerCase()) ||
          group.category.toLowerCase().includes(term.toLowerCase()),
      )
      setFilteredGroups(filtered)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Suche nach Gruppen..." className="pl-10" value={searchTerm} onChange={handleSearch} />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Neue Gruppe
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGroups.map((group) => (
          <Card key={group.id}>
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{group.name}</CardTitle>
                <Badge>{group.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="aspect-video relative mb-3 rounded-md overflow-hidden">
                <img src={group.image || "/placeholder.svg"} alt={group.name} className="object-cover w-full h-full" />
              </div>
              <p className="text-sm text-muted-foreground">{group.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex items-center justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-1" />
                {group.members} Mitglieder
              </div>
              <Button>Beitreten</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
