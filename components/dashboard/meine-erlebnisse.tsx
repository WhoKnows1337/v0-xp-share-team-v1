"use client"

import { useState } from "react"
import { Search, Calendar, ImageIcon, Mic, Video, Filter, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock-Daten für meine Erlebnisse
const myExperiences = [
  {
    id: "1",
    title: "Wanderung im Schwarzwald",
    date: "15.04.2023",
    location: "Schwarzwald",
    type: "image",
    preview: "/placeholder.svg?key=uonwz",
    tags: ["Natur", "Wandern", "Frühling"],
  },
  {
    id: "2",
    title: "Konzert in der Elbphilharmonie",
    date: "03.05.2023",
    location: "Hamburg",
    type: "audio",
    preview: "/placeholder.svg?key=yb4kp",
    tags: ["Musik", "Kultur", "Abend"],
  },
  {
    id: "3",
    title: "Stadtführung in Berlin",
    date: "22.06.2023",
    location: "Berlin",
    type: "video",
    preview: "/placeholder.svg?key=y42d2",
    tags: ["Stadt", "Kultur", "Geschichte"],
  },
  {
    id: "4",
    title: "Strandtag an der Ostsee",
    date: "10.07.2023",
    location: "Rügen",
    type: "image",
    preview: "/placeholder.svg?key=0rj51",
    tags: ["Strand", "Sommer", "Entspannung"],
  },
  {
    id: "5",
    title: "Kochkurs italienische Küche",
    date: "05.08.2023",
    location: "München",
    type: "video",
    preview: "/placeholder.svg?key=8viyc",
    tags: ["Essen", "Lernen", "Italien"],
  },
  {
    id: "6",
    title: "Mountainbike Tour im Harz",
    date: "18.09.2023",
    location: "Harz",
    type: "image",
    preview: "/placeholder.svg?key=pgih1",
    tags: ["Sport", "Natur", "Abenteuer"],
  },
]

export function MeineErlebnisse() {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "audio":
        return <Mic className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  // Alle verfügbaren Tags sammeln
  const allTags = Array.from(new Set(myExperiences.flatMap((exp) => exp.tags)))

  // Tag-Filter umschalten
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const filteredExperiences = myExperiences.filter((exp) => {
    const matchesSearch =
      searchTerm === "" ||
      exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => exp.tags.includes(tag))

    return matchesSearch && matchesTags
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Meine Erlebnisse</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className={`text-white border-white hover:bg-white/10 ${viewMode === "grid" ? "bg-white/20" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
            <span className="sr-only">Rasteransicht</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`text-white border-white hover:bg-white/10 ${viewMode === "list" ? "bg-white/20" : ""}`}
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
            <span className="sr-only">Listenansicht</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <Input
            type="text"
            placeholder="Suche nach Titel, Ort oder Tags..."
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-white border-white hover:bg-white/10">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="p-2">
              <div className="font-medium mb-2">Nach Tags filtern</div>
              <div className="flex flex-wrap gap-1">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {filteredExperiences.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Keine Erlebnisse gefunden, die deinen Filterkriterien entsprechen.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map((exp) => (
            <Card key={exp.id} className="bg-slate-800/50 border-slate-700 text-white overflow-hidden">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={exp.preview || "/placeholder.svg"}
                  alt={exp.title}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle>{exp.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 mb-4">
                  {exp.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Calendar className="h-4 w-4" />
                  <span>{exp.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                  <div className="bg-slate-700/50 p-1 rounded-md">{getTypeIcon(exp.type)}</div>
                  <span>{exp.location}</span>
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-700 pt-4">
                <Button variant="outline" className="w-full text-slate-300 hover:text-white hover:bg-slate-700/50">
                  Anzeigen
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredExperiences.map((exp) => (
            <Card key={exp.id} className="bg-slate-800/50 border-slate-700 text-white">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-48 h-32 overflow-hidden">
                  <img src={exp.preview || "/placeholder.svg"} alt={exp.title} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 p-4">
                  <h3 className="text-lg font-medium">{exp.title}</h3>
                  <div className="flex flex-wrap gap-1 my-2">
                    {exp.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400 mt-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{exp.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="bg-slate-700/50 p-1 rounded-md">{getTypeIcon(exp.type)}</div>
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex items-center">
                  <Button variant="outline" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-700/50">
                    Anzeigen
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
