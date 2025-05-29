"use client"

import type React from "react"

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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface DiskussionErstellenDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  groupId: string
}

export function DiskussionErstellenDialog({ open, onOpenChange, groupId }: DiskussionErstellenDialogProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib einen Titel für die Diskussion ein.",
        variant: "destructive",
      })
      return
    }

    if (!content.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib einen Inhalt für die Diskussion ein.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // In einer echten Implementierung würden wir hier Supabase verwenden
      // const supabase = getSupabaseClient()
      // const { data, error } = await supabase
      //   .from('group_discussions')
      //   .insert({
      //     group_id: groupId,
      //     title,
      //     content,
      //     created_by: userId
      //   })
      //   .select()

      // Simuliere eine Verzögerung
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Diskussion erstellt",
        description: "Deine Diskussion wurde erfolgreich erstellt.",
      })

      // Zurücksetzen des Formulars
      setTitle("")
      setContent("")

      // Dialog schließen
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Beim Erstellen der Diskussion ist ein Fehler aufgetreten. Bitte versuche es erneut.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Neue Diskussion erstellen</DialogTitle>
            <DialogDescription>Starte eine neue Diskussion in dieser Gruppe.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="discussion-title">Titel</Label>
              <Input
                id="discussion-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Worum geht es in dieser Diskussion?"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="discussion-content">Inhalt</Label>
              <Textarea
                id="discussion-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Beschreibe dein Anliegen oder deine Frage..."
                rows={6}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Wird erstellt..." : "Diskussion erstellen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
