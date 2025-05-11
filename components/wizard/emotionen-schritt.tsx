"use client"

import { EmotionsRad } from "./emotions-rad"
import type { ErlebnisData } from "../erlebnis-wizard"
import { InfoIcon } from "lucide-react"

interface EmotionenSchrittProps {
  data: ErlebnisData
  updateData: (data: Partial<ErlebnisData>) => void
}

export function EmotionenSchritt({ data, updateData }: EmotionenSchrittProps) {
  // Funktion zum Umschalten einer Emotion
  const handleEmotionToggle = (emotion: string) => {
    const aktuelleEmotionen = [...data.emotionen]
    const index = aktuelleEmotionen.indexOf(emotion)

    if (index === -1) {
      // Emotion hinzufügen, wenn sie noch nicht ausgewählt ist
      aktuelleEmotionen.push(emotion)
    } else {
      // Emotion entfernen, wenn sie bereits ausgewählt ist
      aktuelleEmotionen.splice(index, 1)
    }

    updateData({ emotionen: aktuelleEmotionen })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Wie hast du dich gefühlt?</h3>
        <p className="text-gray-300 mb-4">
          Wähle die Emotionen aus, die du während deines Erlebnisses empfunden hast. Diese helfen anderen, deine
          Erfahrung besser nachzuvollziehen.
        </p>
      </div>

      {/* Emotionsrad-Komponente */}
      <EmotionsRad ausgewählteEmotionen={data.emotionen} onEmotionToggle={handleEmotionToggle} hideTitle={true} />

      {/* Blaue Tipp-Box */}
      <div className="bg-blue-900/30 p-4 rounded-md border border-blue-800/50 mt-6">
        <h4 className="font-medium mb-2 flex items-center">
          <InfoIcon className="h-4 w-4 mr-2" />
          Tipp
        </h4>
        <p className="text-sm text-gray-300">
          Emotionen sind ein wichtiger Teil deiner Erfahrung. Klicke auf die verschiedenen Bereiche des Emotionsrads, um
          deine Gefühle auszuwählen. Du kannst mehrere Emotionen auswählen, um ein vollständiges Bild deines Erlebnisses
          zu vermitteln. Die äußeren Ringe enthalten spezifischere Emotionen.
        </p>
      </div>
    </div>
  )
}
