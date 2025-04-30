"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

type Testimonial = {
  id: string
  content: string
  author: {
    name: string
    role: string
    avatar: string
  }
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    content:
      "XP-Share hat die Art und Weise, wie ich meine Reiseerlebnisse dokumentiere, komplett verändert. Die Plattform ist intuitiv und macht es einfach, meine Abenteuer mit Freunden zu teilen.",
    author: {
      name: "Julia Berger",
      role: "Reisebloggerin",
      avatar: "/placeholder.svg?height=100&width=100&query=portrait frau lächelnd",
    },
  },
  {
    id: "2",
    content:
      "Als Outdoor-Guide nutze ich XP-Share, um meine Touren zu dokumentieren und mit meinen Kunden zu teilen. Die Kartenfunktion und die Möglichkeit, Medien hinzuzufügen, sind unschlagbar!",
    author: {
      name: "Michael Schmidt",
      role: "Outdoor-Guide",
      avatar: "/placeholder.svg?height=100&width=100&query=portrait mann outdoor",
    },
  },
  {
    id: "3",
    content:
      "Ich organisiere regelmäßig Familientreffen und XP-Share hilft uns, gemeinsame Erinnerungen festzuhalten. Die Gruppenfunktion ist perfekt für unsere Bedürfnisse.",
    author: {
      name: "Sabine Müller",
      role: "Familienorganisatorin",
      avatar: "/placeholder.svg?height=100&width=100&query=portrait ältere frau lächelnd",
    },
  },
  {
    id: "4",
    content:
      "Als Fotograf schätze ich die hohe Qualität der Medienunterstützung bei XP-Share. Die Plattform präsentiert meine Arbeiten genau so, wie ich es mir vorstelle.",
    author: {
      name: "David Wagner",
      role: "Professioneller Fotograf",
      avatar: "/placeholder.svg?height=100&width=100&query=portrait mann mit kamera",
    },
  },
]

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(getVisibleCount())

  function getVisibleCount() {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1024) return 3
      if (window.innerWidth >= 768) return 2
      return 1
    }
    return 3 // Default for SSR
  }

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + visibleCount >= TESTIMONIALS.length ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? Math.max(0, TESTIMONIALS.length - visibleCount) : prev - 1))
  }

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Was unsere Nutzer sagen</h2>
        <p className="text-gray-300 max-w-2xl mx-auto">Erfahre, wie XP-Share das Leben unserer Community bereichert.</p>
      </div>

      <div className="relative">
        <div className="flex overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * (100 / visibleCount)}%)` }}
          >
            {TESTIMONIALS.map((testimonial) => (
              <div key={testimonial.id} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4">
                <Card className="h-full bg-slate-800 border-slate-700">
                  <CardContent className="p-6 flex flex-col h-full">
                    <Quote className="h-8 w-8 text-emerald-500 mb-4" />
                    <p className="text-gray-300 flex-grow mb-6">"{testimonial.content}"</p>
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage
                          src={testimonial.author.avatar || "/placeholder.svg"}
                          alt={testimonial.author.name}
                        />
                        <AvatarFallback>{testimonial.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{testimonial.author.name}</p>
                        <p className="text-sm text-gray-400">{testimonial.author.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Vorherige</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700"
          onClick={nextSlide}
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Nächste</span>
        </Button>
      </div>
    </section>
  )
}
