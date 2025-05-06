"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useXPBuch } from "@/contexts/xp-buch-context"
import { v4 as uuidv4 } from "uuid"
import { getCurrentUser } from "@/lib/mock-users"
import { useToast } from "@/hooks/use-toast"
import { MoodSelector } from "./mood-selector"
import { TagVorschlage } from "./tag-vorschlage"
import { Lightbulb, Check, Loader2, WifiOff, AlertCircle } from "lucide-react"
import type { MoodType } from "@/types/xp-eintrag"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Journaling-Prompts für den Fragegenerator
const journalingPrompts = [
  "Was ist dir heute besonders aufgefallen?",
  "Wofür bist du gerade dankbar?",
  "Beschreibe ein unerwartetes Erlebnis aus der letzten Woche.",
  "Was hat dich heute inspiriert?",
  "Welche Herausforderung hast du kürzlich gemeistert?",
  "Was würdest du deinem jüngeren Ich raten?",
  "Welche drei Dinge möchtest du morgen erreichen?",
  "Welche Gewohnheit möchtest du entwickeln oder ablegen?",
  "Was hat dich zuletzt überrascht?",
  "Welche Erkenntnis hattest du in letzter Zeit?",
  "Beschreibe einen Moment, der dich zum Lächeln gebracht hat.",
  "Was bedeutet Erfolg für dich persönlich?",
  "Welche Fähigkeit möchtest du verbessern?",
  "Wie hat sich deine Perspektive zu einem Thema verändert?",
  "Was hast du heute gelernt?",
]

export function XPBuchQuickEntry() {
  const { addEntry } = useXPBuch()
  const { toast } = useToast()
  const isOnline = useOnlineStatus()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedMoods, setSelectedMoods] = useState<MoodType[]>([])
  const [isPrivate, setIsPrivate] = useState(false)
  const [isDraft, setIsDraft] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const draftIdRef = useRef<string | null>(null)
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Validierungsstatus
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({
    title: false,
    content: false,
  })

  const currentUser = getCurrentUser()

  // Validierungsfunktionen
  const validateTitle = (title: string): string => {
    if (!title.trim()) return "Bitte gib einen Titel ein"
    if (title.length > 100) return "Der Titel darf maximal 100 Zeichen lang sein"
    return ""
  }

  const validateContent = (content: string): string => {
    if (!content.trim()) return "Bitte beschreibe dein Erlebnis"
    if (content.length > 5000) return "Die Beschreibung darf maximal 5000 Zeichen lang sein"
    return ""
  }

  // Validiere bei Änderungen, wenn das Feld berührt wurde
  useEffect(() => {
    const newErrors: Record<string, string> = {}

    if (touched.title) {
      const titleError = validateTitle(title)
      if (titleError) newErrors.title = titleError
    }

    if (touched.content) {
      const contentError = validateContent(content)
      if (contentError) newErrors.content = contentError
    }

    setErrors(newErrors)
  }, [title, content, touched])

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  // Auto-Save Funktion
  useEffect(() => {
    // Wenn Titel oder Inhalt leer sind, nicht speichern
    if (!title.trim() && !content.trim()) {
      return
    }

    // Bestehenden Timer löschen
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    // Neuen Timer setzen
    setAutoSaveStatus("idle")
    autoSaveTimerRef.current = setTimeout(() => {
      setAutoSaveStatus("saving")

      // Entwurf speichern
      const draftId = draftIdRef.current || uuidv4()
      draftIdRef.current = draftId

      // Lokalen Speicher simulieren (in einer echten App würde hier ein API-Aufruf stehen)
      localStorage.setItem(
        `xp-draft-${draftId}`,
        JSON.stringify({
          id: draftId,
          title,
          content,
          selectedTags,
          selectedMoods,
          isPrivate,
          isDraft: true,
          timestamp: new Date().toISOString(),
        }),
      )

      setAutoSaveStatus("saved")

      // Nach 3 Sekunden den Status zurücksetzen
      setTimeout(() => {
        setAutoSaveStatus("idle")
      }, 3000)
    }, 2000) // 2 Sekunden Verzögerung

    // Cleanup beim Unmount
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [title, content, selectedTags, selectedMoods, isPrivate])

  const validateForm = (): boolean => {
    const titleError = validateTitle(title)
    const contentError = validateContent(content)

    const newErrors = {
      ...(titleError ? { title: titleError } : {}),
      ...(contentError ? { content: contentError } : {}),
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Markiere alle Felder als berührt
    setTouched({
      title: true,
      content: true,
    })

    if (!validateForm()) {
      toast({
        title: "Fehler",
        description: "Bitte fülle alle erforderlichen Felder korrekt aus.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    setIsSubmitting(true)

    // Erstelle einen neuen Eintrag
    const newEntry = {
      id: draftIdRef.current || uuidv4(),
      titel: title,
      inhalt: content,
      datum: new Date().toISOString(),
      tags: selectedTags,
      mood: selectedMoods.length > 0 ? selectedMoods : ["neutral"],
      privat: isPrivate,
      entwurf: isDraft,
      erstellt: new Date().toISOString(),
      benutzer: {
        id: currentUser?.id || "1",
        name: currentUser?.name || "Demo User",
        avatar: currentUser?.avatar || "/contemplative-figure.png",
      },
    }

    // Simuliere eine kurze Verzögerung für das Speichern
    setTimeout(() => {
      // Füge den Eintrag hinzu
      addEntry(newEntry)

      // Zeige eine Erfolgsmeldung
      toast({
        title: isDraft ? "Entwurf gespeichert" : "Eintrag gespeichert",
        description: isDraft
          ? "Dein Entwurf wurde erfolgreich gespeichert."
          : "Dein Eintrag wurde erfolgreich gespeichert.",
        duration: 3000,
      })

      // Zeige kurz das Erfolgssymbol
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)

      // Lösche den Entwurf aus dem lokalen Speicher
      if (draftIdRef.current) {
        localStorage.removeItem(`xp-draft-${draftIdRef.current}`)
        draftIdRef.current = null
      }

      // Setze das Formular zurück
      setTitle("")
      setContent("")
      setSelectedTags([])
      setSelectedMoods([])
      setIsPrivate(false)
      setIsDraft(false)
      setIsSubmitting(false)
      setCurrentPrompt(null)
      setTouched({ title: false, content: false })
      setErrors({})
    }, 1000)
  }

  // Generiere einen zufälligen Prompt
  const generateRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * journalingPrompts.length)
    setCurrentPrompt(journalingPrompts[randomIndex])
  }

  // Verwende den Prompt als Inhalt
  const usePromptAsContent = () => {
    if (currentPrompt) {
      setContent(content ? `${content}\n\n${currentPrompt}` : currentPrompt)
      setCurrentPrompt(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schnelleintrag</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {!isOnline && (
            <div className="bg-muted p-3 rounded-md flex items-center mb-4">
              <WifiOff className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Du bist offline. Dein Eintrag wird lokal gespeichert und später synchronisiert.
              </span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center">
              Titel
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Was ist passiert? (z.B. 'Unerwartete Begegnung im Park')"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => handleBlur("title")}
              required
              aria-invalid={!!(errors.title && touched.title)}
              aria-describedby={errors.title && touched.title ? "title-error" : undefined}
              className={errors.title && touched.title ? "border-red-500" : ""}
            />
            {errors.title && touched.title && (
              <p id="title-error" className="text-sm text-red-500 mt-1">
                {errors.title}
              </p>
            )}
            <div className="flex justify-end">
              <span
                className={`text-xs ${title.length > 80 ? (title.length > 100 ? "text-red-500" : "text-amber-500") : "text-gray-500"}`}
              >
                {title.length}/100
              </span>
            </div>
          </div>

          {currentPrompt && (
            <div className="bg-muted p-3 rounded-md flex flex-col space-y-2">
              <div className="flex items-center">
                <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
                <span className="font-medium">Inspiration:</span>
              </div>
              <p className="text-sm">{currentPrompt}</p>
              <div className="flex justify-end">
                <Button type="button" variant="outline" size="sm" onClick={usePromptAsContent}>
                  Verwenden
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="content" className="flex items-center">
              Beschreibung
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              id="content"
              placeholder="Schreibe hier deine Erfahrung... (z.B. 'Heute habe ich beim Spaziergang im Park eine interessante Begegnung gehabt...')"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onBlur={() => handleBlur("content")}
              required
              aria-invalid={!!(errors.content && touched.content)}
              aria-describedby={errors.content && touched.content ? "content-error" : undefined}
              className={errors.content && touched.content ? "border-red-500" : ""}
            />
            {errors.content && touched.content && (
              <p id="content-error" className="text-sm text-red-500 mt-1">
                {errors.content}
              </p>
            )}
            <div className="flex justify-end">
              <span
                className={`text-xs ${content.length > 4000 ? (content.length > 5000 ? "text-red-500" : "text-amber-500") : "text-gray-500"}`}
              >
                {content.length}/5000
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <TagVorschlage content={content} selectedTags={selectedTags} onChange={setSelectedTags} />
          </div>

          <div className="space-y-2">
            <Label>Stimmung</Label>
            <MoodSelector selectedMoods={selectedMoods} onChange={setSelectedMoods} />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="private" checked={isPrivate} onCheckedChange={setIsPrivate} />
              <Label htmlFor="private">Privat</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="draft" checked={isDraft} onCheckedChange={setIsDraft} />
              <Label htmlFor="draft">Als Entwurf speichern</Label>
            </div>
          </div>

          {Object.keys(errors).length > 0 && (touched.title || touched.content) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Bitte korrigiere die markierten Felder, bevor du fortfährst.</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <div className="flex items-center space-x-2">
            <Button type="button" variant="outline" onClick={generateRandomPrompt}>
              <Lightbulb className="h-4 w-4 mr-2" />
              Inspiration
            </Button>
            {autoSaveStatus === "saving" && <span className="text-xs text-muted-foreground">Speichert...</span>}
            {autoSaveStatus === "saved" && (
              <span className="text-xs text-muted-foreground">Automatisch gespeichert</span>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting || (!title.trim() && !content.trim())} className="min-w-[140px]">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Wird gespeichert...
              </>
            ) : saveSuccess ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Gespeichert!
              </>
            ) : isDraft ? (
              "Entwurf speichern"
            ) : (
              "Eintrag speichern"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
