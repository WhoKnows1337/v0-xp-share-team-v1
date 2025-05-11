"use client"

import type { ErlebnisData } from "../erlebnis-wizard"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Lock, LinkIcon, Globe, Users, FileText, Tag, ImageIcon, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Sparkles } from "lucide-react"

interface ZusammenfassungProps {
  data: ErlebnisData
  updateData: (data: Partial<ErlebnisData>) => void
}

// Beispiel-Gruppen
const gruppen = [
  { id: "traumforscher", name: "Traumforscher Berlin" },
  { id: "ufo-netzwerk", name: "UFO-Netzwerk Deutschland" },
  { id: "meditation", name: "Meditations-Zirkel" },
]

// Kategorien-Map
const kategorienMap: Record<string, string> = {
  traum: "Traum",
  nahtoderfahrung: "Nahtoderfahrung",
  intuition: "Intuition",
  ufo: "UFO-Sichtung",
  paranormal: "Paranormales",
  synchronizitat: "Synchronizität",
  spirituell: "Spirituelle Erfahrung",
  psychodelisch: "Psychodelische Reisen",
  sonstiges: "Sonstiges",
}

// Funktion zum Finden des Namens einer Unterkategorie
const findUnterkategorieName = (kategorie: string, unterkategorie?: string): string | null => {
  if (!unterkategorie) return null

  // Definiere die Unterkategorien (vereinfachte Version)
  const unterkategorien: Record<string, Record<string, string>> = {
    traum: {
      "traum-luzid": "Luzider Traum",
      "traum-wiederkehrend": "Wiederkehrender Traum",
      "traum-prophetisch": "Prophetischer Traum",
      "traum-albtraum": "Albtraum",
      "traum-klartraum": "Klartraum",
      "traum-parallelwelt": "Parallelwelt",
    },
    nahtoderfahrung: {
      "nde-tunnel": "Tunnelerfahrung",
      "nde-lebensruckblick": "Lebensrückblick",
      "nde-ausserkörperlich": "Außerkörperliche Erfahrung",
      "nde-begegnung": "Begegnung",
      "nde-grenzerfahrung": "Grenzerfahrung",
    },
    // Weitere Kategorien hier...
  }

  // Versuche, die Unterkategorie zu finden
  if (unterkategorien[kategorie] && unterkategorien[kategorie][unterkategorie]) {
    return unterkategorien[kategorie][unterkategorie]
  }

  // Fallback: Extrahiere den Namen aus der ID
  const namePart = unterkategorie.split("-").pop()
  if (namePart) {
    return namePart.charAt(0).toUpperCase() + namePart.slice(1)
  }

  return null
}

// Privatsphäre-Icons
const privatsphareIcons = {
  privat: <Lock className="h-4 w-4" />,
  link: <LinkIcon className="h-4 w-4" />,
  offentlich: <Globe className="h-4 w-4" />,
  gruppe: <Users className="h-4 w-4" />,
}

// Privatsphäre-Labels
const privatsphareLabels = {
  privat: "Privat",
  link: "Teilen via Link",
  offentlich: "Öffentlich",
  gruppe: "Nur für Gruppe",
}

export function Zusammenfassung({ data }: ZusammenfassungProps) {
  // Finde den Gruppennamen, falls eine Gruppe ausgewählt ist
  const gruppenName = data.gruppenId ? gruppen.find((g) => g.id === data.gruppenId)?.name : undefined

  // Prüfe, ob alle Pflichtfelder ausgefüllt sind
  const isComplete =
    data.titel.trim().length > 0 && data.kategorie.trim().length > 0 && data.beschreibung.trim().length > 0

  // Formatiere die Uhrzeit, falls vorhanden
  const formatTimeIfAvailable = (date?: Date) => {
    if (!date) return null

    const hours = date.getHours()
    const minutes = date.getMinutes()

    // Prüfe, ob eine Uhrzeit gesetzt wurde (nicht 00:00)
    if (hours === 0 && minutes === 0) return null

    return format(date, "HH:mm")
  }

  // Formatierte Uhrzeit
  const formattedTime = formatTimeIfAvailable(data.datum)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Zusammenfassung deines Erlebnisses</h3>
        <p className="text-gray-300 mb-4">Überprüfe deine Eingaben, bevor du dein Erlebnis veröffentlichst.</p>
      </div>

      {!isComplete && (
        <Alert variant="destructive" className="bg-red-900/50 border-red-800 text-white">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Bitte fülle alle Pflichtfelder aus (Titel, Kategorie, Beschreibung), bevor du dein Erlebnis veröffentlichst.
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-xl font-semibold">{data.titel || "Kein Titel angegeben"}</h2>
          <div className="flex flex-wrap items-center mt-2 text-sm text-gray-300 gap-y-2">
            <Badge variant="outline" className="mr-2 bg-primary/20 border-primary/30">
              {kategorienMap[data.kategorie] || "Keine Kategorie"}
              {data.unterkategorie && findUnterkategorieName(data.kategorie, data.unterkategorie) && (
                <span className="ml-1">
                  {" • "}
                  {findUnterkategorieName(data.kategorie, data.unterkategorie)}
                </span>
              )}
            </Badge>

            {/* Kombinierte Datum/Zeit-Anzeige */}
            {data.datum && (
              <div className="flex items-center mr-3">
                <Calendar className="h-3.5 w-3.5 mr-1 opacity-70" />
                <span>{format(data.datum, "PPP", { locale: de })}</span>
                {formattedTime && (
                  <>
                    <Clock className="h-3.5 w-3.5 mx-1 opacity-70" />
                    <span>{formattedTime} Uhr</span>
                  </>
                )}
              </div>
            )}

            {/* Ort-Anzeige */}
            {data.ort && (
              <span className="flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1 opacity-70" />
                {data.ort}
              </span>
            )}
          </div>
        </div>

        <div className="p-4 border-b border-white/10">
          <div className="flex items-center mb-2">
            <FileText className="h-4 w-4 mr-2 text-gray-400" />
            <h3 className="font-medium">Beschreibung</h3>
          </div>
          <div className="text-sm whitespace-pre-wrap">{data.beschreibung || "Keine Beschreibung angegeben"}</div>
        </div>

        {data.tags.length > 0 && (
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center mb-2">
              <Tag className="h-4 w-4 mr-2 text-gray-400" />
              <h3 className="font-medium">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-primary/20 border-primary/30">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Emotionen */}
        {data.emotionen.length > 0 && (
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center mb-2">
              <Tag className="h-4 w-4 mr-2 text-gray-400" />
              <h3 className="font-medium">Emotionen</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.emotionen.map((emotion) => (
                <Badge key={emotion} variant="secondary" className="bg-primary/20 border-primary/30">
                  {emotion}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {data.medien.length > 0 && (
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center mb-2">
              <ImageIcon className="h-4 w-4 mr-2 text-gray-400" />
              <h3 className="font-medium">Medien</h3>
            </div>
            <div className="text-sm">{data.medien.length} Datei(en) hochgeladen</div>
          </div>
        )}

        <div className="p-4">
          <div className="flex items-center mb-2">
            <div className="mr-2 text-gray-400">{privatsphareIcons[data.privatsphare]}</div>
            <h3 className="font-medium">Sichtbarkeit: {privatsphareLabels[data.privatsphare]}</h3>
          </div>
          <div className="text-sm text-gray-300">
            {data.privatsphare === "privat" && "Nur du kannst dieses Erlebnis sehen."}
            {data.privatsphare === "link" && "Nur Personen mit dem Link können dieses Erlebnis sehen."}
            {data.privatsphare === "offentlich" && "Dieses Erlebnis ist für alle sichtbar."}
            {data.privatsphare === "gruppe" &&
              gruppenName &&
              `Dieses Erlebnis ist nur für Mitglieder der Gruppe "${gruppenName}" sichtbar.`}
          </div>
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-medium mb-2 flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
          KI-Zusammenfassung (Vorschau)
        </h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-600 italic">
            Nach der Veröffentlichung wird automatisch eine KI-Zusammenfassung deines Erlebnisses erstellt. Diese wird
            in der Listenansicht und auf der Detailseite angezeigt.
          </p>
        </div>
      </div>

      <div className="bg-blue-900/30 p-4 rounded-md border border-blue-800/50 mt-6">
        <h4 className="font-medium mb-2">Hinweis</h4>
        <p className="text-sm text-gray-300">
          Nach der Veröffentlichung kannst du dein Erlebnis jederzeit bearbeiten oder löschen. Klicke auf
          "Veröffentlichen", um dein Erlebnis zu teilen, oder gehe zurück, um Änderungen vorzunehmen.
        </p>
      </div>
    </div>
  )
}
