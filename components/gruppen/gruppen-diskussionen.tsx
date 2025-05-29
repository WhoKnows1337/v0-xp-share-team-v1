"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import type { GroupDiscussion } from "@/types/group"
import { mockGroupDiscussions } from "@/lib/mock-groups"
import { Plus, MessageSquare, Clock, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DiskussionErstellenDialog } from "./diskussion-erstellen-dialog"

interface GruppenDiskussionenProps {
  groupId: string
}

export function GruppenDiskussionen({ groupId }: GruppenDiskussionenProps) {
  const [discussions, setDiscussions] = useState<GroupDiscussion[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        setLoading(true)
        // In einer echten Implementierung würden wir hier Supabase verwenden
        // const supabase = getSupabaseClient()
        // const { data, error } = await supabase
        //   .from('group_discussions')
        //   .select('*, user:created_by(*)')
        //   .eq('group_id', groupId)
        //   .order('created_at', { ascending: false })

        // Für Demo-Zwecke verwenden wir Mock-Daten
        setTimeout(() => {
          setDiscussions(mockGroupDiscussions)
          setLoading(false)
        }, 800)
      } catch (err) {
        console.error("Fehler beim Laden der Gruppendiskussionen:", err)
        setLoading(false)
      }
    }

    fetchDiscussions()
  }, [groupId])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Diskussionen</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Neue Diskussion
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
                <Skeleton className="h-5 w-3/4 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
                <div className="flex justify-between mt-4">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : discussions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">In dieser Gruppe wurden noch keine Diskussionen gestartet.</p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Starte die erste Diskussion
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {discussions.map((discussion) => (
            <Card key={discussion.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={discussion.user.avatar_url || "/placeholder.svg"}
                        alt={discussion.user.display_name}
                      />
                      <AvatarFallback>{discussion.user.display_name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Link
                        href={`/profil/${discussion.user.username}`}
                        className="font-medium text-sm hover:underline"
                      >
                        {discussion.user.display_name}
                      </Link>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(discussion.created_at).toLocaleDateString("de-DE")}
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
                      <DropdownMenuItem className="text-destructive">Löschen</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Link href={`/gruppen/${groupId}/diskussionen/${discussion.id}`} className="block mt-2">
                  <h3 className="text-lg font-semibold hover:underline">{discussion.title}</h3>
                </Link>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3 mb-4">{discussion.content}</p>

                <div className="flex justify-between">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/gruppen/${groupId}/diskussionen/${discussion.id}`}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {discussion.comment_count} Kommentare
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/gruppen/${groupId}/diskussionen/${discussion.id}`}>Ansehen</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <DiskussionErstellenDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} groupId={groupId} />
    </div>
  )
}
