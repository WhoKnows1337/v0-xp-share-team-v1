"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2 } from "lucide-react"

type Experience = {
  id: string
  title: string
  description: string
  imageUrl: string
  category: string
  location: string
  date: string
  user: {
    name: string
    avatar: string
  }
  likes: number
  comments: number
}

const FEATURED_EXPERIENCES: Experience[] = [
  {
    id: "1",
    title: "Sonnenaufgang auf dem Brocken",
    description: "Ein unvergessliches Erlebnis beim Wandern im Harz mit atemberaubenden Ausblicken.",
    imageUrl: "/brocken-sunrise.png",
    category: "Natur",
    location: "Harz, Deutschland",
    date: "15.03.2023",
    user: {
      name: "Thomas M.",
      avatar: "/thoughtful-man.png",
    },
    likes: 124,
    comments: 18,
  },
  {
    id: "2",
    title: "Street Food Festival Berlin",
    description: "Kulinarische Weltreise mit über 50 verschiedenen Ständen und Live-Musik.",
    imageUrl: "/colorful-street-food-fest.png",
    category: "Kulinarik",
    location: "Berlin, Deutschland",
    date: "22.05.2023",
    user: {
      name: "Laura K.",
      avatar: "/serene-woman.png",
    },
    likes: 89,
    comments: 24,
  },
  {
    id: "3",
    title: "Paragliding über dem Bodensee",
    description: "Mein erster Tandemflug mit atemberaubender Aussicht auf den Bodensee.",
    imageUrl: "/placeholder.svg?height=400&width=600&query=Paragliding über dem Bodensee",
    category: "Abenteuer",
    location: "Bodensee, Deutschland",
    date: "08.06.2023",
    user: {
      name: "Markus W.",
      avatar: "/placeholder.svg?height=100&width=100&query=portrait männlich jung",
    },
    likes: 156,
    comments: 32,
  },
]

export function FeaturedExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>(FEATURED_EXPERIENCES)

  const handleLike = (id: string) => {
    setExperiences((prev) => prev.map((exp) => (exp.id === id ? { ...exp, likes: exp.likes + 1 } : exp)))
  }

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Entdecke besondere Erlebnisse</h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Lass dich von den Erfahrungen anderer inspirieren und finde neue Ideen für deine nächsten Abenteuer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {experiences.map((experience) => (
          <Card
            key={experience.id}
            className="bg-slate-800 border-slate-700 overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="aspect-video relative">
              <img
                src={experience.imageUrl || "/placeholder.svg"}
                alt={experience.title}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-emerald-600 hover:bg-emerald-700">{experience.category}</Badge>
            </div>

            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={experience.user.avatar || "/placeholder.svg"} alt={experience.user.name} />
                    <AvatarFallback>{experience.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-300">{experience.user.name}</span>
                </div>
                <div className="text-sm text-gray-400">{experience.date}</div>
              </div>

              <h3 className="text-xl font-semibold mb-2">{experience.title}</h3>
              <p className="text-gray-300 mb-3">{experience.description}</p>

              <div className="flex items-center text-sm text-gray-400 mb-4">
                <span>{experience.location}</span>
              </div>
            </CardContent>

            <CardFooter className="border-t border-slate-700 pt-4">
              <div className="flex justify-between w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white hover:bg-slate-700"
                  onClick={() => handleLike(experience.id)}
                >
                  <Heart className="h-4 w-4 mr-1" />
                  {experience.likes}
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-slate-700">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {experience.comments}
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-slate-700">
                  <Share2 className="h-4 w-4 mr-1" />
                  Teilen
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button variant="outline" className="text-white border-white hover:bg-white/10">
          Mehr Erlebnisse entdecken
        </Button>
      </div>
    </section>
  )
}
