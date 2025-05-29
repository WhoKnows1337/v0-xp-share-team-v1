"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import type { Group } from "@/types/group"
import { mockGroups } from "@/lib/mock-groups"
import { Users, Lock, Plus, Search, UserPlus } from "lucide-react"
import Link from "next/link"
import { GruppeErstellenDialog } from "./gruppe-erstellen-dialog"

export function GruppenListe() {
  const [groups, setGroups] = useState<Group[]>([])
  const [myGroups, setMyGroups] = useState<Group[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  // Simuliere das Laden der Gruppen
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true)
        // In einer echten Implementierung würden wir hier Supabase verwenden
        // const supabase = getSupabaseClient()
        // const { data: allGroups } = await supabase
        //   .from('groups')
        //   .select('*')
        //   .eq('is_private', false)
        //   .order('member_count', { ascending: false })

        // const { data: userGroups } = await supabase
        //   .from('group_members')
        //   .select('group:group_id(*)')
        //   .eq('user_id', userId)

        // Für Demo-Zwecke verwenden wir Mock-Daten
        setTimeout(() => {
          setGroups(mockGroups)
          // Simuliere, dass der Benutzer Mitglied in einigen Gruppen ist
          setMyGroups(mockGroups.filter((_, index) => index % 2 === 0))
          setLoading(false)
        }, 1000)
      } catch (err) {
        console.error("Fehler beim Laden der Gruppen:", err)
        setLoading(false)
      }
    }

    fetchGroups()
  }, [])

  // Filtere Gruppen basierend auf der Suchanfrage
  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredMyGroups = myGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gruppen</h1>
          <p className="text-muted-foreground">Entdecke und tritt Gruppen bei, um Erlebnisse zu teilen</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Neue Gruppe erstellen
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Gruppen durchsuchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="alle-gruppen">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="alle-gruppen">Alle Gruppen</TabsTrigger>
          <TabsTrigger value="meine-gruppen">Meine Gruppen</TabsTrigger>
        </TabsList>

        <TabsContent value="alle-gruppen" className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-5 w-3/4 mt-2" />
                    <Skeleton className="h-4 w-full mt-1" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-9 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Keine Gruppen gefunden</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <GroupCard key={group.id} group={group} isMember={myGroups.some((g) => g.id === group.id)} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="meine-gruppen" className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-5 w-3/4 mt-2" />
                    <Skeleton className="h-4 w-full mt-1" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-9 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredMyGroups.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Keine deiner Gruppen entspricht der Suche"
                  : "Du bist noch kein Mitglied in einer Gruppe"}
              </p>
              {!searchQuery && (
                <Button variant="outline" className="mt-4" onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Erstelle deine erste Gruppe
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMyGroups.map((group) => (
                <GroupCard key={group.id} group={group} isMember={true} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <GruppeErstellenDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  )
}

interface GroupCardProps {
  group: Group
  isMember: boolean
}

function GroupCard({ group, isMember }: GroupCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <Avatar className="h-12 w-12">
            <AvatarImage src={group.avatar_url || "/placeholder.svg"} alt={group.name} />
            <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          {group.is_private && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Privat
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg mt-2">{group.name}</CardTitle>
        <CardDescription className="line-clamp-2">{group.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {group.member_count} Mitglieder
          </div>
          <div>{group.experience_count} Erlebnisse</div>
        </div>
      </CardContent>
      <CardFooter>
        {isMember ? (
          <Button variant="default" className="w-full" asChild>
            <Link href={`/gruppen/${group.id}`}>Zur Gruppe</Link>
          </Button>
        ) : (
          <Button variant="outline" className="w-full">
            <UserPlus className="h-4 w-4 mr-2" />
            Beitreten
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
