"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ErlebnisKarte } from "@/components/entdecken/erlebnis-karte"
import { Badge } from "@/components/ui/badge"
import type { ErlebnisData } from "@/components/erlebnis-wizard"

interface AehnlicheFindenButtonProps {
  data: ErlebnisData
}

export function AehnlicheFindenButton({ data }: AehnlicheFindenButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [aehnlicheErlebnisse, setAehnlicheErlebnisse] = useState<any[]>([])

  const handleSuchen = async () => {
    setIsLoading(true)

    // Simuliere API-Aufruf
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Beispieldaten
    setAehnlicheErlebnisse([
      {
        id: "ae1",
        titel: "Astralreise während tiefer Meditation",
        kurzfassung: "Während einer intensiven Meditationssitzung löste sich mein Bewusstsein vom Körper.",
        kategorie: { name: "Astralreisen", icon: "Star", farbe: "#805AD5" },
        autor: { name: "AstralExplorer" },
        datum: "15. März 2023",
        verknuepfungstyp: "Ähnliche Erfahrung (92% Übereinstimmung)",
        aehnlichkeitsScore: 92,
        tags: ["Meditation", "Astralreise", "Bewusstseinserweiterung"],
      },
      {
        id: "ae2",
        titel: "Schweben über meinem Körper nach Yoga",
        kurzfassung: "Nach einer intensiven Yoga-Session hatte ich das Gefühl, meinen Körper zu verlassen.",
        kategorie: { name: "Außerkörperlich", icon: "🧠", farbe: "#10b981" },
        autor: { name: "YogaMeister" },
        datum: "22. April 2023",
        verknuepfungstyp: "Ähnliche Erfahrung (87% Übereinstimmung)",
        aehnlichkeitsScore: 87,
        tags: ["Yoga", "Außerkörperlich", "Schweben"],
      },
      {
        id: "ae3",
        titel: "Bewusstseinserweiterung durch Atemtechnik",
        kurzfassung: "Eine spezielle Atemtechnik führte zu einem Zustand erweiterter Wahrnehmung.",
        kategorie: { name: "Meditation", icon: "🧘", farbe: "#10b981" },
        autor: { name: "AtemKünstler" },
        datum: "10. Mai 2023",
        verknuepfungstyp: "Ähnliche Technik (78% Übereinstimmung)",
        aehnlichkeitsScore: 78,
        tags: ["Atemtechnik", "Bewusstsein", "Wahrnehmung"],
      },
    ])

    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => {
            setIsOpen(true)
            handleSuchen()
          }}
        >
          <Search className="h-4 w-4" />
          Ähnliche Erlebnisse finden
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ähnliche Erlebnisse</DialogTitle>
          <DialogDescription>
            Basierend auf deinen Eingaben haben wir folgende ähnliche Erlebnisse gefunden. Diese können dir Inspiration
            geben oder zeigen, dass andere Ähnliches erlebt haben.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {aehnlicheErlebnisse.length > 0 ? (
                aehnlicheErlebnisse.map((erlebnis, index) => (
                  <div key={index} className="relative">
                    <ErlebnisKarte erlebnis={erlebnis} compact />
                    {erlebnis.verknuepfungstyp && (
                      <Badge
                        className="absolute top-2 right-2 bg-primary/20 text-xs"
                        style={{
                          backgroundColor: `rgba(16, 185, 129, ${erlebnis.aehnlichkeitsScore / 100})`,
                        }}
                      >
                        {erlebnis.verknuepfungstyp}
                      </Badge>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Keine ähnlichen Erlebnisse gefunden.</p>
                  <p className="text-sm mt-2">
                    Dein Erlebnis scheint einzigartig zu sein! Nach der Veröffentlichung kann es anderen helfen, die in
                    Zukunft Ähnliches erleben.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
