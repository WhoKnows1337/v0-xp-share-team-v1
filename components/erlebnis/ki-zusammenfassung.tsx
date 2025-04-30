"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ThumbsUp, ThumbsDown, Languages } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

interface KIZusammenfassungProps {
  erlebnisId: string
  zusammenfassung?: string
  isLoading?: boolean
  englishSummary?: string
}

export function KIZusammenfassung({
  erlebnisId,
  zusammenfassung,
  isLoading = false,
  englishSummary,
}: KIZusammenfassungProps) {
  const [feedbackGegeben, setFeedbackGegeben] = useState<boolean>(false)
  const [feedbackPositiv, setFeedbackPositiv] = useState<boolean | null>(null)
  const [sprache, setSprache] = useState<"deutsch" | "englisch">("deutsch")
  const [showEnglish, setShowEnglish] = useState<boolean>(false)

  const handleFeedback = (positiv: boolean) => {
    // In einer echten Anwendung würde hier ein API-Aufruf erfolgen
    setFeedbackGegeben(true)
    setFeedbackPositiv(positiv)

    // Simuliere API-Aufruf
    toast({
      title: positiv ? "Danke für dein positives Feedback!" : "Danke für dein Feedback!",
      description: positiv
        ? "Wir freuen uns, dass die Zusammenfassung hilfreich war."
        : "Wir werden versuchen, die Zusammenfassung zu verbessern.",
      duration: 3000,
    })
  }

  const toggleSprache = () => {
    setShowEnglish(!showEnglish)
    setSprache(showEnglish ? "deutsch" : "englisch")
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
          KI-Zusammenfassung
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ) : (
          <>
            <div className="text-sm text-gray-700">
              {showEnglish && englishSummary ? englishSummary : zusammenfassung || "Keine Zusammenfassung verfügbar."}
            </div>

            {englishSummary && (
              <div className="flex items-center space-x-2 pt-2">
                <Languages className="h-4 w-4 text-gray-500" />
                <Switch id="sprache" checked={showEnglish} onCheckedChange={toggleSprache} />
                <Label htmlFor="sprache" className="text-sm">
                  {showEnglish ? "Auf Deutsch anzeigen" : "In English"}
                </Label>
              </div>
            )}

            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">War diese Zusammenfassung hilfreich?</p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex items-center ${
                    feedbackGegeben && feedbackPositiv ? "bg-green-50 border-green-200" : ""
                  }`}
                  onClick={() => handleFeedback(true)}
                  disabled={feedbackGegeben}
                >
                  <ThumbsUp className={`h-4 w-4 mr-1 ${feedbackGegeben && feedbackPositiv ? "text-green-500" : ""}`} />
                  Ja
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex items-center ${
                    feedbackGegeben && !feedbackPositiv ? "bg-red-50 border-red-200" : ""
                  }`}
                  onClick={() => handleFeedback(false)}
                  disabled={feedbackGegeben}
                >
                  <ThumbsDown className={`h-4 w-4 mr-1 ${feedbackGegeben && !feedbackPositiv ? "text-red-500" : ""}`} />
                  Nein
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
