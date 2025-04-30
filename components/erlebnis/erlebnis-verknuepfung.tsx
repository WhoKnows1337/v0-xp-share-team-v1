"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Link2, Check, Users } from "lucide-react"

interface ErlebnisVerknuepfungProps {
  erlebnisId: string
  verknuepfungen?: number
}

export function ErlebnisVerknuepfung({ erlebnisId, verknuepfungen = 0 }: ErlebnisVerknuepfungProps) {
  const [showForm, setShowForm] = useState(false)
  const [comment, setComment] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [verknuepfungenCount, setVerknuepfungenCount] = useState(verknuepfungen)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Hier würde normalerweise ein API-Aufruf stattfinden
    setSubmitted(true)
    setVerknuepfungenCount(verknuepfungenCount + 1)
  }

  const handleReset = () => {
    setShowForm(false)
    setComment("")
    setSubmitted(false)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Link2 className="h-5 w-5 mr-2 text-primary" />
          Erlebnis verknüpfen
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!showForm && !submitted ? (
          <div className="space-y-4">
            <p className="text-sm">
              Hast du etwas Ähnliches erlebt? Verknüpfe deine Erfahrung mit diesem Erlebnis, um anderen zu helfen,
              Muster zu erkennen.
            </p>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {verknuepfungenCount} {verknuepfungenCount === 1 ? "Person hat" : "Personen haben"} Ähnliches erlebt
              </span>
            </div>
            <Button onClick={() => setShowForm(true)} className="w-full">
              Ich habe Ähnliches erlebt
            </Button>
          </div>
        ) : submitted ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <Check className="h-5 w-5" />
              <span className="font-medium">Verknüpfung erfolgreich!</span>
            </div>
            <p className="text-sm">
              Vielen Dank für deine Verknüpfung. Deine Erfahrung hilft anderen, Muster zu erkennen und zu verstehen.
            </p>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {verknuepfungenCount} {verknuepfungenCount === 1 ? "Person hat" : "Personen haben"} Ähnliches erlebt
              </span>
            </div>
            <Button variant="outline" onClick={handleReset} className="w-full">
              Weitere Verknüpfung hinzufügen
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="comment" className="block text-sm font-medium mb-1">
                Beschreibe kurz deine ähnliche Erfahrung
              </label>
              <Textarea
                id="comment"
                placeholder="Ich hatte eine ähnliche Erfahrung während..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full"
                rows={3}
                required
              />
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                Meditation
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                Außerkörperlich
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                Traum
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                Schweben
              </Badge>
            </div>
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">
                Verknüpfen
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Abbrechen
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
