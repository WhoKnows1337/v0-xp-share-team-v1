"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

type SharedExperience = {
  id: string
  title: string
  description: string
  date: string
  location: string
  category: string
  imageUrl: string
  sharedBy: {
    name: string
    avatar: string
  }
  likes: number
  comments: number
}

const SHARED_EXPERIENCES: SharedExperience[] = [
  {
    id: "1",
    title: "Segeltörn in Kroatien",
    description: "Eine Woche auf dem Meer mit fantastischen Sonnenuntergängen und kristallklarem Wasser.",
    date: "15.07.2023",
    location: "Dalmatien, Kroatien",
    category: "Reisen",
    imageUrl: "/sailing-adriatic-coast.png",
    sharedBy: {
      name: "Anna M.",
      avatar: "/contemplative-woman.png",
    },
    likes: 24,
    comments: 8,
  },
  {
    id: "2",
    title: "Kochkurs: Italienische Küche",
    description: "Leckere Pasta und Tiramisu selbst gemacht - ein kulinarisches Highlight!",
    date: "28.06.2023",
    location: "München, Deutschland",
    category: "Kulinarik",
    imageUrl: "/pasta-making-class.png",
    sharedBy: {
      name: "Markus K.",
      avatar: "/contemplative-figure.png",
    },
    likes: 18,
    comments: 5,
  },
  {
    id: "3",
    title: "Mountainbike-Tour in den Alpen",
    description: "Anspruchsvolle Trails und atemberaubende Ausblicke auf die Bergwelt.",
    date: "05.08.2023",
    location: "Garmisch, Deutschland",
    category: "Sport",
    imageUrl: "/alpine-mountain-biking-adventure.png",
    sharedBy: {
      name: "Stefan W.",
      avatar: "/placeholder.svg?height=100&width=100&query=portrait mann sportlich",
    },
    likes: 32,
    comments: 12,
  },
]

export function SharedWithMe() {
  const [activeTab, setActiveTab] = useState("all")
  const [experiences, setExperiences] = useState<SharedExperience[]>(SHARED_EXPERIENCES)

  const handleLike = (id: string) => {
    setExperiences((prev) => prev.map((exp) => (exp.id === id ? { ...exp, likes: exp.likes + 1 } : exp)))
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Mit mir geteilt</CardTitle>
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="bg-slate-700">
            <TabsTrigger value="all" className="data-[state=active]:bg-slate-600">
              Alle
            </TabsTrigger>
            <TabsTrigger value="friends" className="data-[state=active]:bg-slate-600">
              Freunde
            </TabsTrigger>
            <TabsTrigger value="groups" className="data-[state=active]:bg-slate-600">
              Gruppen
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {experiences.map((experience) => (
            <div key={experience.id} className="bg-slate-700 rounded-lg overflow-hidden border border-slate-600">
              <div className="relative h-48 w-full">
                <Image
                  src={experience.imageUrl || "/placeholder.svg"}
                  alt={experience.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 bg-slate-800 text-white px-2 py-1 rounded text-xs">
                  {experience.category}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative h-8 w-8 rounded-full overflow-hidden">
                    <Image
                      src={experience.sharedBy.avatar || "/placeholder.svg"}
                      alt={experience.sharedBy.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{experience.sharedBy.name}</p>
                    <p className="text-xs text-slate-400">{experience.date}</p>
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-1">{experience.title}</h3>
                <p className="text-sm text-slate-300 mb-2">{experience.description}</p>
                <div className="text-xs text-slate-400 mb-3">📍 {experience.location}</div>
                <div className="flex items-center justify-between border-t border-slate-600 pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-300 hover:text-white hover:bg-slate-600"
                    onClick={() => handleLike(experience.id)}
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    {experience.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-600">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {experience.comments}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-600">
                    <Share2 className="h-4 w-4 mr-1" />
                    Teilen
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
