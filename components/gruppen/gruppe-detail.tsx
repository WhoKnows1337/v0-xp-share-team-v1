"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { Group } from "@/types/group"
import { mockGroups } from "@/lib/mock-groups"
import { Users, Settings, Share2, Bell, BellOff, UserPlus, MessageSquare, Calendar } from "lucide-react"
import { GruppenmitgliederListe } from "./gruppenmitglieder-liste"
import { GruppenErlebnisse } from "./gruppen-erlebnisse"
import { GruppenDiskussionen } from "./gruppen-diskussionen"
import { MitgliedEinladenDialog } from "./mitglied-einladen-dialog"

interface GruppeDetailProps {
  groupId: string
}

export function GruppeDetail({ groupId }: GruppeDetailProps) {
  const [group, setGroup] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(true)
  const [showInviteDialog, setShowInviteDialog] = useState(false)

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        setLoading(true)
        // In einer echten Implementierung würden wir hier Supabase verwenden
        // const supabase = getSupabaseClient()
        // const { data, error } = await supabase
        //   .from('groups')
        //   .select('*')
        //   .eq('id', groupId)
        //   .single()

        // Für Demo-Zwecke verwenden wir Mock-Daten
        setTimeout(() => {
          const foundGroup = mockGroups.find((g) => g.id === groupId)
          if (foundGroup) {
            setGroup(foundGroup)
          } else {
            setError("Gruppe nicht gefunden")
          }
          setLoading(false)
        }, 1000)
      } catch (err) {
        setError("Fehler beim Laden der Gruppendetails")
        setLoading(false)
      }
    }

    fetchGroupDetails()
  }, [groupId])

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-destructive">{error}</h2>
        <p className="text-muted-foreground mt-2">Bitte versuche es später erneut oder wähle eine andere Gruppe.</p>
        <Button variant="outline" className="mt-4" onClick={() => window.history.back()}>
          Zurück
        </Button>
      </div>
    )
  }

  if (loading || !group) {
    return (
      <div className="space-y-6">
        <div className="relative">
          <Skeleton className="h-48 w-full rounded-lg" />
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="ml-4 flex-1">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </div>
          </div>
        </div>

        <Skeleton className="h-10 w-full" />

        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Gruppenbanner und Informationen */}
      <div className="relative">
        {group.banner_url ? (
          <div className="h-48 w-full rounded-lg overflow-hidden">
            <img
              src={group.banner_url || "/placeholder.svg"}
              alt={`${group.name} Banner`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-48 w-full rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100" />
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white rounded-b-lg">
          <div className="flex items-end">
            <Avatar className="h-24 w-24 border-4 border-white">
              <AvatarImage src={group.avatar_url || "/placeholder.svg"} alt={group.name} />
              <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
            </Avatar>

            <div className="ml-4 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{group.name}</h1>
                {group.is_private && (
                  <Badge variant="secondary" className="text-xs">
                    Privat
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-200 mt-1 line-clamp-2">{group.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gruppenaktionen */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => setShowInviteDialog(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Mitglied einladen
        </Button>

        <Button variant="outline" size="sm" onClick={() => setIsSubscribed(!isSubscribed)}>
          {isSubscribed ? (
            <>
              <BellOff className="h-4 w-4 mr-2" />
              Benachrichtigungen deaktivieren
            </>
          ) : (
            <>
              <Bell className="h-4 w-4 mr-2" />
              Benachrichtigungen aktivieren
            </>
          )}
        </Button>

        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Teilen
        </Button>

        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Einstellungen
        </Button>
      </div>

      {/* Gruppenstatistiken */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1" />
          {group.member_count} Mitglieder
        </div>
        <div className="flex items-center">
          <MessageSquare className="h-4 w-4 mr-1" />
          {group.experience_count} Erlebnisse
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          Erstellt am {new Date(group.created_at).toLocaleDateString("de-DE")}
        </div>
      </div>

      {/* Gruppeninhalte */}
      <Tabs defaultValue="erlebnisse">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="erlebnisse">Erlebnisse</TabsTrigger>
          <TabsTrigger value="diskussionen">Diskussionen</TabsTrigger>
          <TabsTrigger value="mitglieder">Mitglieder</TabsTrigger>
        </TabsList>

        <TabsContent value="erlebnisse" className="mt-6">
          <GruppenErlebnisse groupId={groupId} />
        </TabsContent>

        <TabsContent value="diskussionen" className="mt-6">
          <GruppenDiskussionen groupId={groupId} />
        </TabsContent>

        <TabsContent value="mitglieder" className="mt-6">
          <GruppenmitgliederListe groupId={groupId} />
        </TabsContent>
      </Tabs>

      <MitgliedEinladenDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        groupId={groupId}
        groupName={group.name}
      />
    </div>
  )
}
