"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Search, Mail, Copy, Check } from "lucide-react"

interface MitgliedEinladenDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  groupId: string
  groupName: string
}

// Mock-Benutzer für die Suche
const mockUsers = [
  {
    id: "u-006",
    username: "traumforscher",
    display_name: "Traumforscher",
    avatar_url: "/contemplative-woman.png",
    email: "traumforscher@example.com",
  },
  {
    id: "u-007",
    username: "seelenreisende",
    display_name: "Seelenreisende",
    avatar_url: "/serene-gaze.png",
    email: "seelenreisende@example.com",
  },
  {
    id: "u-008",
    username: "zeitwanderer",
    display_name: "Zeitwanderer",
    avatar_url: "/thoughtful-gaze.png",
    email: "zeitwanderer@example.com",
  },
]

export function MitgliedEinladenDialog({ open, onOpenChange, groupId, groupName }: MitgliedEinladenDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [inviteLink, setInviteLink] = useState(`https://xp-share.de/gruppen/einladung/${groupId}?code=abc123`)
  const [linkCopied, setLinkCopied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Filtere Benutzer basierend auf der Suchanfrage
  const filteredUsers = mockUsers.filter(
    (user) =>
      user.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleToggleUser = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink)
    setLinkCopied(true)

    toast({
      title: "Link kopiert",
      description: "Der Einladungslink wurde in die Zwischenablage kopiert.",
    })

    setTimeout(() => setLinkCopied(false), 3000)
  }

  const handleSendInvitations = async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "Keine Benutzer ausgewählt",
        description: "Bitte wähle mindestens einen Benutzer aus, um Einladungen zu senden.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // In einer echten Implementierung würden wir hier Supabase verwenden
      // const supabase = getSupabaseClient()
      // const invitations = selectedUsers.map(userId => ({
      //   group_id: groupId,
      //   invited_by: currentUserId,
      //   invited_user_id: userId,
      //   status: 'pending',
      //   expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 Tage
      // }))
      // const { data, error } = await supabase
      //   .from('group_invitations')
      //   .insert(invitations)

      // Simuliere eine Verzögerung
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Einladungen gesendet",
        description: `${selectedUsers.length} Einladung(en) wurden erfolgreich gesendet.`,
      })

      // Zurücksetzen
      setSelectedUsers([])
      setSearchQuery("")

      // Dialog schließen
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Beim Senden der Einladungen ist ein Fehler aufgetreten. Bitte versuche es erneut.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Mitglieder einladen</DialogTitle>
          <DialogDescription>Lade neue Mitglieder zu "{groupName}" ein.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div>
            <Label className="mb-2 block">Per Link einladen</Label>
            <div className="flex items-center gap-2">
              <Input value={inviteLink} readOnly className="flex-1" />
              <Button variant="outline" size="icon" onClick={handleCopyLink}>
                {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Dieser Link ist 30 Tage gültig und kann von jedem verwendet werden.
            </p>
          </div>

          <div className="space-y-4">
            <Label className="block">Per E-Mail einladen</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Nach Benutzern suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="border rounded-md">
              {filteredUsers.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">Keine Benutzer gefunden</div>
              ) : (
                <div className="divide-y">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center p-3">
                      <Checkbox
                        id={`user-${user.id}`}
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleToggleUser(user.id)}
                        className="mr-3"
                      />
                      <label htmlFor={`user-${user.id}`} className="flex items-center gap-3 flex-1 cursor-pointer">
                        <Avatar>
                          <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.display_name} />
                          <AvatarFallback>{user.display_name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.display_name}</p>
                          <p className="text-xs text-muted-foreground">@{user.username}</p>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">{selectedUsers.length} Benutzer ausgewählt</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedUsers([])}
                disabled={selectedUsers.length === 0}
              >
                Auswahl zurücksetzen
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSendInvitations} disabled={isSubmitting || selectedUsers.length === 0}>
            <Mail className="h-4 w-4 mr-2" />
            {isSubmitting ? "Wird gesendet..." : "Einladungen senden"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
