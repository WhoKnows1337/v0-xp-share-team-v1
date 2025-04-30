"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, MapPin, Calendar, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Experience = {
  id: string
  title: string
  date: string
  location: string
  category: string
  imageUrl: string
}

const RECENT_EXPERIENCES: Experience[] = [
  {
    id: "1",
    title: "Wanderung im Schwarzwald",
    date: "12.04.2023",
    location: "Schwarzwald, Deutschland",
    category: "Natur",
    imageUrl: "/placeholder.svg?height=200&width=300&query=wanderung im schwarzwald",
  },
  {
    id: "2",
    title: "Konzert in der Elbphilharmonie",
    date: "03.05.2023",
    location: "Hamburg, Deutschland",
    category: "Kultur",
    imageUrl: "/placeholder.svg?height=200&width=300&query=elbphilharmonie konzert",
  },
  {
    id: "3",
    title: "Radtour entlang der Mosel",
    date: "22.06.2023",
    location: "Mosel, Deutschland",
    category: "Sport",
    imageUrl: "/placeholder.svg?height=200&width=300&query=radtour mosel fluss",
  },
]

export function RecentExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>(RECENT_EXPERIENCES)

  const handleDelete = (id: string) => {
    setExperiences((prev) => prev.filter((exp) => exp.id !== id))
  }

  return (
    <Card className="bg-slate-800 border-slate-700 mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Neueste Erlebnisse</CardTitle>
        <Button variant="outline" size="sm" className="border-slate-600 hover:bg-slate-700">
          Alle anzeigen
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {experiences.map((experience) => (
            <div key={experience.id} className="flex bg-slate-700 rounded-lg overflow-hidden border border-slate-600">
              <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                <img
                  src={experience.imageUrl || "/placeholder.svg"}
                  alt={experience.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{experience.title}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-slate-600">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Aktionen</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-white">
                        <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer flex items-center">
                          <Edit className="h-4 w-4 mr-2" />
                          Bearbeiten
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500 hover:bg-slate-700 cursor-pointer flex items-center"
                          onClick={() => handleDelete(experience.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Löschen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center text-sm text-slate-400 mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{experience.date}</span>
                    <span className="mx-2">•</span>
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{experience.location}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Badge className="bg-emerald-600 hover:bg-emerald-700">{experience.category}</Badge>
                  <Button variant="link" className="text-sm p-0 h-auto text-emerald-500 hover:text-emerald-400">
                    Details anzeigen
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {experiences.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <p>Keine Erlebnisse vorhanden</p>
              <Button variant="link" className="mt-2 text-emerald-500 hover:text-emerald-400">
                Erstelle dein erstes Erlebnis
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
