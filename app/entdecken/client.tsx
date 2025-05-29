"use client"

import { useState } from "react"
import { useExperiences } from "@/hooks/use-experiences"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, MapPin, Calendar } from "lucide-react"

export function EntdeckenClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const { experiences, loading, error } = useExperiences({ search: searchQuery })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="h-32 bg-muted rounded w-full max-w-3xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Fehler</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Erlebnisse entdecken</h1>
        <Input
          type="text"
          placeholder="Suche nach Erlebnissen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiences.map((experience) => (
          <Card key={experience.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={experience.author_avatar || "/placeholder.svg"} />
                  <AvatarFallback>{experience.author_name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{experience.author_name}</span>
              </div>
              <CardTitle className="line-clamp-2">{experience.title}</CardTitle>
              <CardDescription className="line-clamp-3">{experience.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{experience.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(experience.date).toLocaleDateString("de-DE")}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary">{experience.category}</Badge>
                  {experience.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{experience.likes_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{experience.comments_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="h-4 w-4" />
                      <span>{experience.shares_count}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {experiences.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Keine Erlebnisse gefunden</h3>
          <p className="text-muted-foreground">Versuche einen anderen Suchbegriff oder entdecke alle Erlebnisse.</p>
        </div>
      )}
    </div>
  )
}

// Benenne den Export um für Konsistenz
export { EntdeckenClient as EntdeckenPageClient }
