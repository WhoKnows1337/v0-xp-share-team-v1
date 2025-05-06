"use client"

import { useState } from "react"
import { Edit, Book, ChevronLeft, ChevronRight, Eye, EyeOff, Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Mock-Daten für Entwürfe
const drafts = [
  {
    id: "1",
    title: "Meine Erfahrung mit Astralreisen",
    preview: "/abstract-geometric-shapes.png",
    lastEdited: "vor 2 Tagen",
    tags: ["astralreisen", "bewusstsein"],
  },
  {
    id: "2",
    title: "Meditation und ihre Auswirkungen auf meine Träume",
    preview: "/meditation-experience.png",
    lastEdited: "vor 5 Tagen",
    tags: ["meditation", "träume"],
  },
  {
    id: "3",
    title: "Synchronizitäten in meinem Alltag",
    preview: "/lucid-dream-ocean.png",
    lastEdited: "vor 1 Woche",
    tags: ["synchronizität", "alltag"],
  },
  {
    id: "4",
    title: "Mein erstes luzides Traumerlebnis",
    preview: "/deep-sea-fantasy.png",
    lastEdited: "vor 2 Wochen",
    tags: ["luzideträume", "traumwelt"],
  },
]

// Mock-Daten für privates Tagebuch
const privateJournal = {
  count: 17,
  unshared: 5,
  lastEntry: "vor 3 Tagen",
}

export function DraftsJournal() {
  const [currentDraftIndex, setCurrentDraftIndex] = useState(0)

  const nextDraft = () => {
    setCurrentDraftIndex((prev) => (prev + 1) % drafts.length)
  }

  const prevDraft = () => {
    setCurrentDraftIndex((prev) => (prev - 1 + drafts.length) % drafts.length)
  }

  const currentDraft = drafts[currentDraftIndex]

  return (
    <div className="space-y-4">
      {/* Entwürfe Karussell */}
      <div>
        <h2 className="text-xl font-bold text-white mb-3 flex items-center">
          <Edit className="h-5 w-5 mr-2" />
          Meine Entwürfe
        </h2>
        <div className="relative">
          <Card className="bg-slate-800/50 border-slate-700 text-white overflow-hidden">
            <div className="absolute top-2 left-2 z-10">
              <Badge className="bg-slate-700/80 text-xs">Bearbeitet {currentDraft.lastEdited}</Badge>
            </div>
            <div className="relative h-48">
              <img
                src={currentDraft.preview || "/placeholder.svg"}
                alt={currentDraft.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent flex flex-col justify-end p-4">
                <h3 className="font-medium text-lg">{currentDraft.title}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentDraft.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs bg-slate-800/70 border-slate-600">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <Button className="mt-3 bg-emerald-600 hover:bg-emerald-700">Weiter bearbeiten</Button>
              </div>
            </div>
          </Card>

          {/* Karussell-Steuerung */}
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-slate-800/80 border-slate-600 text-white hover:bg-slate-700/80 rounded-full h-8 w-8"
            onClick={prevDraft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-slate-800/80 border-slate-600 text-white hover:bg-slate-700/80 rounded-full h-8 w-8"
            onClick={nextDraft}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Karussell-Indikatoren */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {drafts.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full ${index === currentDraftIndex ? "w-4 bg-white" : "w-1.5 bg-slate-600"}`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Privates Tagebuch */}
      <Card className="bg-slate-800/50 border-slate-700 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Book className="h-5 w-5 mr-2" />
            Privates XP-Tagebuch
            <Lock className="h-4 w-4 ml-2 text-amber-400" />
          </CardTitle>
          <CardDescription className="text-slate-400">Nur für dich sichtbare Einträge</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="flex items-center">
                <span className="text-2xl font-bold">{privateJournal.count}</span>
                <span className="text-sm text-slate-400 ml-2">Einträge gesamt</span>
              </div>
              <div className="flex items-center text-sm text-amber-400">
                <EyeOff className="h-3 w-3 mr-1" />
                <span>{privateJournal.unshared} ungeteilte Einträge</span>
              </div>
              <div className="text-xs text-slate-400">Letzter Eintrag: {privateJournal.lastEntry}</div>
            </div>
            <Button variant="outline" className="border-slate-600 hover:bg-slate-700">
              <Eye className="h-4 w-4 mr-2" />
              Tagebuch öffnen
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
