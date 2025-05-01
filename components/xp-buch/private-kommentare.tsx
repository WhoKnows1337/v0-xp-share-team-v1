"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { getCurrentUser } from "@/lib/mock-users"
import { v4 as uuidv4 } from "uuid"
import { MessageSquare, Trash2 } from "lucide-react"

interface Kommentar {
  id: string
  text: string
  datum: string
  benutzer: {
    id: string
    name: string
    avatar: string
  }
}

interface PrivateKommentareProps {
  eintragId: string
  initialKommentare?: Kommentar[]
  onAddKommentar?: (kommentar: Kommentar) => void
  onDeleteKommentar?: (kommentarId: string) => void
}

export function PrivateKommentare({
  eintragId,
  initialKommentare = [],
  onAddKommentar,
  onDeleteKommentar,
}: PrivateKommentareProps) {
  const { toast } = useToast()
  const [kommentare, setKommentare] = useState<Kommentar[]>(initialKommentare)
  const [newKommentar, setNewKommentar] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentUser = getCurrentUser() || {
    id: "1",
    name: "Demo User",
    avatar: "/contemplative-figure.png",
  }

  const handleAddKommentar = () => {
    if (!newKommentar.trim()) return

    setIsSubmitting(true)

    const kommentar: Kommentar = {
      id: uuidv4(),
      text: newKommentar,
      datum: new Date().toISOString(),
      benutzer: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
    }

    // Aktualisiere lokalen Zustand
    setKommentare([...kommentare, kommentar])

    // Callback für übergeordnete Komponente
    if (onAddKommentar) {
      onAddKommentar(kommentar)
    }

    // Zeige Erfolgsmeldung
    toast({
      title: "Kommentar hinzugefügt",
      description: "Dein Kommentar wurde erfolgreich gespeichert.",
      duration: 3000,
    })

    // Setze Formular zurück
    setNewKommentar("")
    setIsSubmitting(false)
  }

  const handleDeleteKommentar = (kommentarId: string) => {
    // Aktualisiere lokalen Zustand
    setKommentare(kommentare.filter((k) => k.id !== kommentarId))

    // Callback für übergeordnete Komponente
    if (onDeleteKommentar) {
      onDeleteKommentar(kommentarId)
    }

    // Zeige Erfolgsmeldung
    toast({
      title: "Kommentar gelöscht",
      description: "Der Kommentar wurde erfolgreich gelöscht.",
      duration: 3000,
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-primary" />
            Private Kommentare
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Textarea
              placeholder="Füge einen privaten Kommentar hinzu..."
              value={newKommentar}
              onChange={(e) => setNewKommentar(e.target.value)}
              rows={3}
            />
            <Button
              type="button"
              onClick={handleAddKommentar}
              disabled={isSubmitting || !newKommentar.trim()}
              className="w-full"
            >
              {isSubmitting ? "Wird gespeichert..." : "Kommentar hinzufügen"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {kommentare.length > 0 ? (
        <div className="space-y-3">
          {kommentare.map((kommentar) => (
            <Card key={kommentar.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <img
                      src={kommentar.benutzer.avatar || "/placeholder.svg"}
                      alt={kommentar.benutzer.name}
                      className="h-8 w-8 rounded-full"
                    />
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">{kommentar.benutzer.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {format(new Date(kommentar.datum), "PPp", { locale: de })}
                        </span>
                      </div>
                      <p className="mt-1 text-sm">{kommentar.text}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteKommentar(kommentar.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Noch keine Kommentare vorhanden.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
