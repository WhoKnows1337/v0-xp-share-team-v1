"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { summarizeEntry } from "@/lib/summarize-utils"
import { FileText, Copy } from "lucide-react"
import type { XPEintrag } from "@/types/xp-eintrag"
import { useToast } from "@/hooks/use-toast"

interface TextZusammenfassungProps {
  eintrag: XPEintrag
}

export function TextZusammenfassung({ eintrag }: TextZusammenfassungProps) {
  const { toast } = useToast()
  const [summary, setSummary] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Zusammenfassung generieren
  const generateSummary = async () => {
    setIsLoading(true)

    try {
      // In einer echten Anwendung würde hier ein API-Aufruf stattfinden
      // Für die Demo simulieren wir eine Verzögerung
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const generatedSummary = summarizeEntry(eintrag)
      setSummary(generatedSummary)
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Die Zusammenfassung konnte nicht generiert werden.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Text in die Zwischenablage kopieren
  const copyToClipboard = () => {
    if (summary) {
      navigator.clipboard.writeText(summary)
      toast({
        title: "Kopiert",
        description: "Die Zusammenfassung wurde in die Zwischenablage kopiert.",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-500" />
          KI-Zusammenfassung
        </CardTitle>
      </CardHeader>
      <CardContent>
        {summary ? (
          <div className="bg-muted p-4 rounded-md">
            <p>{summary}</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-2">Lass die KI eine Zusammenfassung deines Eintrags erstellen.</p>
            <p className="text-xs text-muted-foreground">
              Die Zusammenfassung extrahiert die wichtigsten Punkte und Themen aus deinem Text.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {summary ? (
          <>
            <Button variant="outline" onClick={generateSummary} disabled={isLoading}>
              Neu generieren
            </Button>
            <Button variant="secondary" onClick={copyToClipboard} disabled={isLoading}>
              <Copy className="h-4 w-4 mr-2" />
              Kopieren
            </Button>
          </>
        ) : (
          <Button onClick={generateSummary} disabled={isLoading} className="w-full">
            {isLoading ? "Generiere Zusammenfassung..." : "Zusammenfassung generieren"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
