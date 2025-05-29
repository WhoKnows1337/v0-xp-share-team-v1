"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { GroupExperience } from "@/types/group"
import { mockGroupExperiences } from "@/lib/mock-groups"
import { Plus, ThumbsUp, MessageSquare, Share2, MoreHorizontal, Clock } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface GruppenErlebnisseProps {
  groupId: string
}

export function GruppenErlebnisse({ groupId }: GruppenErlebnisseProps) {
  const [experiences, setExperiences] = useState<GroupExperience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true)
        // In einer echten Implementierung würden wir hier Supabase verwenden
        // const supabase = getSupabaseClient()
        // const { data, error } = await supabase
        //   .from('group_experiences')
        //   .select('*, experience:experience_id(*), user:shared_by(*)')
        //   .eq('group_id', groupId)
        //   .order('shared_at', { ascending: false })

        // Für Demo-Zwecke verwenden wir Mock-Daten
        setTimeout(() => {
          setExperiences(mockGroupExperiences)
          setLoading(false)
        }, 800)
      } catch (err) {
        console.error("Fehler beim Laden der Gruppenerlebnisse:", err)
        setLoading(false)
      }
    }

    fetchExperiences()
  }, [groupId])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Geteilte Erlebnisse</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Erlebnis teilen
        </Button>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16 mt-1" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-20 w-full" />
                <div className="flex justify-between mt-4">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : experiences.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">In dieser Gruppe wurden noch keine Erlebnisse geteilt.</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Sei der Erste, der ein Erlebnis teilt
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {experiences.map((groupExperience) => (
            <Card key={groupExperience.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={groupExperience.user.avatar_url || "/placeholder.svg"}
                        alt={groupExperience.user.display_name}
                      />
                      <AvatarFallback>{groupExperience.user.display_name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Link
                        href={`/profil/${groupExperience.user.username}`}
                        className="font-medium text-sm hover:underline"
                      >
                        {groupExperience.user.display_name}
                      </Link>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(groupExperience.shared_at).toLocaleDateString("de-DE")}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Melden</DropdownMenuItem>
                      <DropdownMenuItem>Speichern</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Aus Gruppe entfernen</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <Link href={`/erlebnis/${groupExperience.experience.id}`} className="block">
                  <h3 className="text-lg font-semibold mb-2 hover:underline">{groupExperience.experience.title}</h3>
                  <p className="text-muted-foreground mb-3">{groupExperience.experience.summary}</p>

                  {groupExperience.experience.image_url && (
                    <div className="mb-3 rounded-md overflow-hidden">
                      <img
                        src={groupExperience.experience.image_url || "/placeholder.svg"}
                        alt={groupExperience.experience.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">{groupExperience.experience.category}</Badge>
                    {groupExperience.experience.location && (
                      <Badge variant="outline">{groupExperience.experience.location}</Badge>
                    )}
                  </div>
                </Link>

                <div className="flex justify-between">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Gefällt mir
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Kommentieren
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Teilen
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
