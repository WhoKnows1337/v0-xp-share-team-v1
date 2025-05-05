"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Filter, Plus, MessageSquare, ThumbsUp, Eye } from "lucide-react"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { mockUsers } from "@/lib/mock-users"

// Mock-Daten für Diskussionen
const mockDiscussions = [
  {
    id: 1,
    title: "Wie hat Meditation euer Leben verändert?",
    content: "Ich praktiziere seit einem Jahr täglich Meditation und habe bemerkenswerte Veränderungen festgestellt...",
    author: mockUsers[0],
    date: new Date(2023, 5, 10),
    category: "Wellness",
    views: 128,
    likes: 24,
    comments: 15,
  },
  {
    id: 2,
    title: "Die besten versteckten Reiseziele in Europa",
    content: "Ich bin auf der Suche nach weniger bekannten, aber wunderschönen Orten in Europa. Habt ihr Empfehlungen?",
    author: mockUsers[1],
    date: new Date(2023, 5, 15),
    category: "Reisen",
    views: 256,
    likes: 42,
    comments: 31,
  },
  {
    id: 3,
    title: "Wie dokumentiert ihr eure Erlebnisse?",
    content: "Ich suche nach kreativen Wegen, meine Erlebnisse festzuhalten. Was nutzt ihr außer XP Share?",
    author: mockUsers[2],
    date: new Date(2023, 5, 20),
    category: "Kreativität",
    views: 189,
    likes: 37,
    comments: 28,
  },
  {
    id: 4,
    title: "Synchronizitäten im Alltag erkennen",
    content: "In letzter Zeit erlebe ich immer mehr merkwürdige Zufälle. Wie geht ihr mit solchen Erfahrungen um?",
    author: mockUsers[3],
    date: new Date(2023, 5, 25),
    category: "Spiritualität",
    views: 147,
    likes: 31,
    comments: 22,
  },
  {
    id: 5,
    title: "Kulinarische Erlebnisse, die euch geprägt haben",
    content: "Welche Geschmackserlebnisse haben euch besonders beeindruckt oder sogar verändert?",
    author: mockUsers[4],
    date: new Date(2023, 5, 30),
    category: "Essen",
    views: 203,
    likes: 45,
    comments: 37,
  },
  {
    id: 6,
    title: "Naturerlebnisse und ihre Wirkung auf die Psyche",
    content:
      "Ich habe festgestellt, dass Zeit in der Natur meine Stimmung erheblich verbessert. Wie sind eure Erfahrungen?",
    author: mockUsers[5],
    date: new Date(2023, 6, 5),
    category: "Natur",
    views: 176,
    likes: 39,
    comments: 25,
  },
]

export function CommunityDiscussions() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredDiscussions, setFilteredDiscussions] = useState(mockDiscussions)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)

    if (term.trim() === "") {
      setFilteredDiscussions(mockDiscussions)
    } else {
      const filtered = mockDiscussions.filter(
        (discussion) =>
          discussion.title.toLowerCase().includes(term.toLowerCase()) ||
          discussion.content.toLowerCase().includes(term.toLowerCase()) ||
          discussion.category.toLowerCase().includes(term.toLowerCase()) ||
          discussion.author.name.toLowerCase().includes(term.toLowerCase()),
      )
      setFilteredDiscussions(filtered)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Suche nach Diskussionen..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Neue Diskussion
        </Button>
      </div>

      <div className="space-y-4">
        {filteredDiscussions.map((discussion) => (
          <Card key={discussion.id}>
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg hover:underline cursor-pointer">{discussion.title}</CardTitle>
                  <div className="flex items-center mt-1 space-x-2">
                    <Badge>{discussion.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(discussion.date, "PP", { locale: de })}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-sm text-muted-foreground">{discussion.content}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={discussion.author.avatar || "/placeholder.svg"} alt={discussion.author.name} />
                  <AvatarFallback>{discussion.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{discussion.author.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Eye className="h-4 w-4 mr-1" />
                  {discussion.views}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {discussion.likes}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {discussion.comments}
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
