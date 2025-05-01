"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { XPEintrag } from "@/types/xp-eintrag"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { X, Lock, FileEdit, MapPin, Calendar, Clock, User } from "lucide-react"
import { useXPBuch } from "@/contexts/xp-buch-context"
import { PrivateKommentare } from "./private-kommentare"
import { AnhangUploader } from "./anhang-uploader"
import { AhnlicheEintraege } from "./ahnliche-eintraege"
import { TextZusammenfassung } from "./text-zusammenfassung"
import { useToast } from "@/hooks/use-toast"

interface XPEintragDetailProps {
  eintrag: XPEintrag
  onClose: () => void
  onUpdate?: (id: string, data: Partial<XPEintrag>) => void
  onSelectEntry?: (entry: XPEintrag) => void
}

export function XPEintragDetail({ eintrag, onClose, onUpdate, onSelectEntry }: XPEintragDetailProps) {
  const { state } = useXPBuch()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("inhalt")

  // Bilder und Audio-Anhänge
  const [bilder, setBilder] = useState<string[]>(eintrag.bilder || [])
  const [audios, setAudios] = useState<string[]>(
    eintrag.audio ? (Array.isArray(eintrag.audio) ? eintrag.audio : [eintrag.audio]) : [],
  )

  // Formatiere das Datum
  const formattedDate = format(new Date(eintrag.datum), "PPP", { locale: de })
  const formattedTime = format(new Date(eintrag.datum), "HH:mm", { locale: de })

  // Bild hinzufügen
  const handleAddImage = (imageUrl: string) => {
    const newBilder = [...bilder, imageUrl]
    setBilder(newBilder)

    if (onUpdate) {
      onUpdate(eintrag.id, { bilder: newBilder })
    }
  }

  // Bild entfernen
  const handleRemoveImage = (index: number) => {
    const newBilder = bilder.filter((_, i) => i !== index)
    setBilder(newBilder)

    if (onUpdate) {
      onUpdate(eintrag.id, { bilder: newBilder })
    }
  }

  // Audio hinzufügen
  const handleAddAudio = (audioUrl: string) => {
    const newAudios = [...audios, audioUrl]
    setAudios(newAudios)

    if (onUpdate) {
      onUpdate(eintrag.id, { audio: newAudios })
    }
  }

  // Audio entfernen
  const handleRemoveAudio = (index: number) => {
    const newAudios = audios.filter((_, i) => i !== index)
    setAudios(newAudios)

    if (onUpdate) {
      onUpdate(eintrag.id, { audio: newAudios })
    }
  }

  // Kommentar hinzufügen
  const handleAddKommentar = (kommentar: any) => {
    const kommentare = eintrag.kommentare || []
    const newKommentare = [...kommentare, kommentar]

    if (onUpdate) {
      onUpdate(eintrag.id, { kommentare: newKommentare })
    }
  }

  // Kommentar löschen
  const handleDeleteKommentar = (kommentarId: string) => {
    if (!eintrag.kommentare) return

    const newKommentare = eintrag.kommentare.filter((k) => k.id !== kommentarId)

    if (onUpdate) {
      onUpdate(eintrag.id, { kommentare: newKommentare })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{eintrag.titel}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
            <Clock className="h-4 w-4 ml-2" />
            <span>{formattedTime}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Schließen</span>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {eintrag.tags &&
          eintrag.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        {eintrag.privat && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            <span>Privat</span>
          </Badge>
        )}
        {eintrag.entwurf && (
          <Badge variant="outline" className="flex items-center gap-1">
            <FileEdit className="h-3 w-3" />
            <span>Entwurf</span>
          </Badge>
        )}
        {eintrag.ort && (
          <Badge variant="outline" className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{eintrag.ort.name}</span>
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm">
        <User className="h-4 w-4" />
        <span>{eintrag.benutzer.name}</span>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inhalt">Inhalt</TabsTrigger>
          <TabsTrigger value="anhange" className="flex items-center gap-1">
            <span>Anhänge</span>
            {(bilder.length > 0 || audios.length > 0) && (
              <Badge variant="secondary" className="ml-1">
                {bilder.length + audios.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="kommentare" className="flex items-center gap-1">
            <span>Kommentare</span>
            {eintrag.kommentare && eintrag.kommentare.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {eintrag.kommentare.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="analyse">Analyse</TabsTrigger>
        </TabsList>

        <TabsContent value="inhalt" className="pt-4">
          <div className="border rounded-lg p-4 whitespace-pre-wrap">{eintrag.inhalt}</div>

          <AhnlicheEintraege eintrag={eintrag} onSelectEntry={onSelectEntry} />
        </TabsContent>

        <TabsContent value="anhange" className="pt-4">
          <AnhangUploader
            onImageUpload={handleAddImage}
            onAudioRecord={handleAddAudio}
            existingImages={bilder}
            existingAudios={audios}
            onRemoveImage={handleRemoveImage}
            onRemoveAudio={handleRemoveAudio}
          />

          {bilder.length === 0 && audios.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Keine Anhänge vorhanden.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Füge Bilder oder Audioaufnahmen hinzu, um dein Erlebnis zu dokumentieren.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="kommentare" className="pt-4">
          <PrivateKommentare
            eintragId={eintrag.id}
            initialKommentare={eintrag.kommentare || []}
            onAddKommentar={handleAddKommentar}
            onDeleteKommentar={handleDeleteKommentar}
          />
        </TabsContent>

        <TabsContent value="analyse" className="pt-4">
          <TextZusammenfassung eintrag={eintrag} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
