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
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GruppeErstellenDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GruppeErstellenDialog({ open, onOpenChange }: GruppeErstellenDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState("")
  const [bannerUrl, setBannerUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib einen Namen für die Gruppe ein.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // In einer echten Implementierung würden wir hier Supabase verwenden
      // const supabase = getSupabaseClient()
      // const { data, error } = await supabase
      //   .from('groups')
      //   .insert({
      //     name,
      //     description,
      //     is_private: isPrivate,
      //     avatar_url: avatarUrl,
      //     banner_url: bannerUrl,
      //     created_by: userId
      //   })
      //   .select()

      // Simuliere eine Verzögerung
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Gruppe erstellt",
        description: `Die Gruppe "${name}" wurde erfolgreich erstellt.`,
      })

      // Zurücksetzen des Formulars
      setName("")
      setDescription("")
      setIsPrivate(false)
      setAvatarUrl("")
      setBannerUrl("")

      // Dialog schließen
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Beim Erstellen der Gruppe ist ein Fehler aufgetreten. Bitte versuche es erneut.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAvatarUpload = () => {
    // In einer echten Implementierung würden wir hier einen Datei-Upload-Dialog öffnen
    // Für Demo-Zwecke setzen wir einfach eine zufällige Bild-URL
    const randomImage = [
      "/abstract-geometric.png",
      "/elemental-convergence.png",
      "/serene-spirit.png",
      "/blue-being-wondering.png",
    ]
    const randomIndex = Math.floor(Math.random() * randomImage.length)
    setAvatarUrl(randomImage[randomIndex])
  }

  const handleBannerUpload = () => {
    // In einer echten Implementierung würden wir hier einen Datei-Upload-Dialog öffnen
    // Für Demo-Zwecke setzen wir einfach eine zufällige Bild-URL
    const randomImage = [
      "/abstract-experience.png",
      "/celestial-contemplation.png",
      "/ethereal-forest-glow.png",
      "/serene-meditation.png",
    ]
    const randomIndex = Math.floor(Math.random() * randomImage.length)
    setBannerUrl(randomImage[randomIndex])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Neue Gruppe erstellen</DialogTitle>
            <DialogDescription>
              Erstelle eine Gruppe, um Erlebnisse mit Gleichgesinnten zu teilen und zu diskutieren.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="group-name">Gruppenname</Label>
              <Input
                id="group-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z.B. Klarträumer Berlin"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="group-description">Beschreibung</Label>
              <Textarea
                id="group-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Worum geht es in dieser Gruppe?"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="block mb-2">Gruppenprofilbild</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={avatarUrl || "/placeholder.svg"} />
                    <AvatarFallback>
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <Button type="button" variant="outline" onClick={handleAvatarUpload}>
                    <Upload className="h-4 w-4 mr-2" />
                    Hochladen
                  </Button>
                </div>
              </div>

              <div>
                <Label className="block mb-2">Gruppenbanner</Label>
                <div className="flex items-center gap-4">
                  {bannerUrl ? (
                    <div className="h-16 w-24 rounded overflow-hidden">
                      <img src={bannerUrl || "/placeholder.svg"} alt="Banner" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-16 w-24 rounded border border-dashed flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <Button type="button" variant="outline" onClick={handleBannerUpload}>
                    <Upload className="h-4 w-4 mr-2" />
                    Hochladen
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="private-group" checked={isPrivate} onCheckedChange={setIsPrivate} />
              <Label htmlFor="private-group">Private Gruppe</Label>
            </div>

            {isPrivate && (
              <p className="text-sm text-muted-foreground">
                Private Gruppen sind nur für eingeladene Mitglieder sichtbar und zugänglich.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Wird erstellt..." : "Gruppe erstellen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
