"use client"

import type { ErlebnisData } from "../erlebnis-wizard"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Lock, Link, Globe, Users, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PrivatsphareSchrittProps {
  data: ErlebnisData
  updateData: (data: Partial<ErlebnisData>) => void
}

// Beispiel-Gruppen
const gruppen = [
  { id: "traumforscher", name: "Traumforscher Berlin" },
  { id: "ufo-netzwerk", name: "UFO-Netzwerk Deutschland" },
  { id: "meditation", name: "Meditations-Zirkel" },
]

export function PrivatsphareSchritt({ data, updateData }: PrivatsphareSchrittProps) {
  const handlePrivatsphareChange = (value: string) => {
    if (value === "gruppe" && !data.gruppenId) {
      // Wenn Gruppe gewählt, aber keine Gruppe ausgewählt ist, setze die erste Gruppe
      updateData({
        privatsphare: value as "privat" | "link" | "offentlich" | "gruppe",
        gruppenId: gruppen[0].id,
      })
    } else {
      updateData({
        privatsphare: value as "privat" | "link" | "offentlich" | "gruppe",
        // Wenn nicht Gruppe gewählt, setze gruppenId zurück
        ...(value !== "gruppe" && { gruppenId: undefined }),
      })
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold mb-2">Privatsphäre-Einstellungen</h3>
        <p className="text-gray-300 mb-4">
          Wähle, wer dein Erlebnis sehen kann. Du kannst diese Einstellung später jederzeit ändern.
        </p>
      </div>

      <Alert className="bg-yellow-900/30 border-yellow-800 text-white">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Dein Benutzername wird immer als Autor angezeigt. Wenn du vollständig anonym bleiben möchtest, verwende ein
          Pseudonym in deinem Profil.
        </AlertDescription>
      </Alert>

      <div className="space-y-2 mt-4">
        <Label>Sichtbarkeit</Label>
        <RadioGroup value={data.privatsphare} onValueChange={handlePrivatsphareChange} className="space-y-3">
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="privat" id="privat" className="mt-1" />
            <div className="grid gap-1.5">
              <Label htmlFor="privat" className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Privat
              </Label>
              <p className="text-sm text-gray-400">
                Nur du kannst dieses Erlebnis sehen. Es wird in deinem persönlichen Tagebuch gespeichert, aber nicht
                öffentlich geteilt.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <RadioGroupItem value="link" id="link" className="mt-1" />
            <div className="grid gap-1.5">
              <Label htmlFor="link" className="flex items-center">
                <Link className="h-4 w-4 mr-2" />
                Teilen via Link
              </Label>
              <p className="text-sm text-gray-400">
                Das Erlebnis ist nicht öffentlich gelistet, kann aber über einen geheimen Link aufgerufen werden. Nur
                Personen mit diesem Link können es sehen.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <RadioGroupItem value="offentlich" id="offentlich" className="mt-1" />
            <div className="grid gap-1.5">
              <Label htmlFor="offentlich" className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                Öffentlich
              </Label>
              <p className="text-sm text-gray-400">
                Das Erlebnis ist für alle sichtbar und erscheint im öffentlichen Feed, in Suchen und auf der Karte.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <RadioGroupItem value="gruppe" id="gruppe" className="mt-1" />
            <div className="grid gap-1.5 w-full">
              <Label htmlFor="gruppe" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Nur für Gruppe
              </Label>
              <p className="text-sm text-gray-400 mb-2">
                Das Erlebnis ist nur für Mitglieder einer bestimmten Gruppe sichtbar.
              </p>

              {data.privatsphare === "gruppe" && (
                <Select value={data.gruppenId} onValueChange={(value) => updateData({ gruppenId: value })}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Gruppe auswählen" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    {gruppen.map((gruppe) => (
                      <SelectItem key={gruppe.id} value={gruppe.id}>
                        {gruppe.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </RadioGroup>
      </div>

      <div className="bg-blue-900/30 p-4 rounded-md border border-blue-800/50 mt-6">
        <h4 className="font-medium mb-2">Tipp</h4>
        <p className="text-sm text-gray-300">
          Du kannst mit "Privat" beginnen und dein Erlebnis später öffentlich machen, wenn du dich damit wohler fühlst.
          Die Standardeinstellung ist "Öffentlich", da dies am besten zum Gemeinschaftsgedanken von XP-Share passt.
        </p>
      </div>
    </div>
  )
}
