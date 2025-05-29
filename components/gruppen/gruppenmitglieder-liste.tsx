"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { GroupMember } from "@/types/group"
import { mockGroupMembers } from "@/lib/mock-groups"
import { Search, UserPlus, MoreHorizontal, Crown, Shield } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface GruppenmitgliederListeProps {
  groupId: string
}

export function GruppenmitgliederListe({ groupId }: GruppenmitgliederListeProps) {
  const [members, setMembers] = useState<GroupMember[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true)
        // In einer echten Implementierung würden wir hier Supabase verwenden
        // const supabase = getSupabaseClient()
        // const { data, error } = await supabase
        //   .from('group_members')
        //   .select('*, user:user_id(*)')
        //   .eq('group_id', groupId)
        //   .order('role', { ascending: true })
        //   .order('joined_at', { ascending: true })

        // Für Demo-Zwecke verwenden wir Mock-Daten
        setTimeout(() => {
          setMembers(mockGroupMembers)
          setLoading(false)
        }, 800)
      } catch (err) {
        console.error("Fehler beim Laden der Gruppenmitglieder:", err)
        setLoading(false)
      }
    }

    fetchMembers()
  }, [groupId])

  // Filtere Mitglieder basierend auf der Suchanfrage
  const filteredMembers = members.filter(
    (member) =>
      member.user.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.user.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Gruppenmitglieder</CardTitle>
            <CardDescription>Alle Mitglieder dieser Gruppe</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Mitglied einladen
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Mitglieder suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <ScrollArea className="h-[400px] pr-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-1/4 mt-1" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              ))}
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Keine Mitglieder gefunden</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.user.avatar_url || "/placeholder.svg"} alt={member.user.display_name} />
                      <AvatarFallback>{member.user.display_name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link href={`/profil/${member.user.username}`} className="font-medium hover:underline">
                          {member.user.display_name}
                        </Link>
                        {member.role === "admin" && (
                          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                            <Crown className="h-3 w-3" />
                            Admin
                          </Badge>
                        )}
                        {member.role === "moderator" && (
                          <Badge variant="outline" className="flex items-center gap-1 text-xs">
                            <Shield className="h-3 w-3" />
                            Moderator
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Beigetreten am {new Date(member.joined_at).toLocaleDateString("de-DE")}
                      </p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Aktionen</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Nachricht senden</DropdownMenuItem>
                      <DropdownMenuItem>Zum Moderator ernennen</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Aus Gruppe entfernen</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
