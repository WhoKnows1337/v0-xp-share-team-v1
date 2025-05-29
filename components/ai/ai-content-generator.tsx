"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Loader2, Check, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AIContentGeneratorProps {
  initialContent?: string
  onGenerated?: (content: string) => void
  placeholder?: string
  title?: string
  description?: string
}

export function AIContentGenerator({
  initialContent = "",
  onGenerated,
  placeholder = "Gib einen Prompt ein oder lass die KI automatisch generieren...",
  title = "KI-Unterstützung",
  description = "Lass die KI dir bei der Erstellung deines Inhalts helfen",
}: AIContentGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Simuliere die KI-Generierung (in einer echten App würde hier die OpenAI API aufgerufen werden)
  const generateContent = async () => {
    setIsGenerating(true)
    setIsSuccess(false)

    // Simuliere API-Aufruf
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockResponses = [
      "In meinem Traum befand ich mich in einer surrealen Landschaft mit schwebenden Inseln und leuchtenden Pflanzen. Die Farben waren intensiver als in der Realität, und ich konnte fliegen. Es fühlte sich unglaublich befreiend an, durch die Lüfte zu gleiten und die fantastische Welt von oben zu betrachten.",
      "Während meiner Meditation erlebte ich einen Moment vollkommener Stille. Mein Geist wurde ruhig, und ich spürte eine tiefe Verbindung zu allem um mich herum. Es war, als würde ich für einen kurzen Moment mit dem Universum verschmelzen und dessen unendliche Weisheit erfahren.",
      "Die Synchronizität war verblüffend: Gerade als ich an meinen alten Freund dachte, klingelte mein Telefon - er war dran, nach 15 Jahren Funkstille. Wir hatten beide am selben Tag den Impuls, Kontakt aufzunehmen. Diese bedeutungsvolle Koinzidenz hat mich tief berührt.",
      "In diesem außerkörperlichen Erlebnis schwebte ich über meinem Körper und konnte alles im Raum beobachten. Ich fühlte mich leicht und frei von physischen Begrenzungen. Die Erfahrung hat meine Sicht auf das Leben und den Tod grundlegend verändert.",
    ]

    const generatedText = prompt
      ? `Basierend auf deinem Prompt "${prompt}": ${mockResponses[Math.floor(Math.random() * mockResponses.length)]}`
      : mockResponses[Math.floor(Math.random() * mockResponses.length)]

    setGeneratedContent(generatedText)
    setIsGenerating(false)
    setIsSuccess(true)

    if (onGenerated) {
      onGenerated(generatedText)
    }
  }

  const handleApply = () => {
    if (onGenerated && generatedContent) {
      onGenerated(generatedContent)
    }
    setIsSuccess(true)
  }

  const handleReset = () => {
    setPrompt("")
    setGeneratedContent("")
    setIsSuccess(false)
  }

  return (
    <Card className="border border-purple-500/20 bg-purple-950/10">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!generatedContent && (
          <Textarea
            placeholder={placeholder}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] bg-background/50 border-purple-500/20"
          />
        )}

        {generatedContent && (
          <div className="relative">
            <div className="absolute -top-2 -right-2">
              <Badge variant="outline" className="bg-purple-500/20 text-purple-200 border-purple-500/30">
                KI-generiert
              </Badge>
            </div>
            <div className="p-3 bg-background/50 border border-purple-500/20 rounded-md min-h-[100px] text-sm">
              {generatedContent}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!generatedContent ? (
          <Button
            variant="outline"
            className="w-full bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 text-purple-100"
            onClick={generateContent}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generiere...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                {prompt ? "Mit Prompt generieren" : "Automatisch generieren"}
              </>
            )}
          </Button>
        ) : (
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 text-purple-100"
              onClick={handleReset}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Neu generieren
            </Button>

            <Button
              variant="default"
              size="sm"
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              onClick={handleApply}
              disabled={isSuccess}
            >
              {isSuccess ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Übernommen
                </>
              ) : (
                "Übernehmen"
              )}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
