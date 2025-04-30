"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ErlebnisData } from "../erlebnis-wizard"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface TitelSchrittProps {
  data: ErlebnisData
  updateData: (data: Partial<ErlebnisData>) => void
}

export function TitelSchritt({ data, updateData }: TitelSchrittProps) {
  const [error, setError] = useState("")
  const [touched, setTouched] = useState(false)

  const validateTitle = (title: string) => {
    if (title.trim().length === 0) {
      return "Bitte gib einen Titel ein."
    }
    if (title.trim().length < 5) {
      return "Der Titel sollte mindestens 5 Zeichen lang sein."
    }
    if (title.trim().length > 100) {
      return "Der Titel darf maximal 100 Zeichen lang sein."
    }
    return ""
  }

  useEffect(() => {
    if (touched) {
      setError(validateTitle(data.titel))
    }
  }, [data.titel, touched])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ titel: e.target.value })
    if (!touched) setTouched(true)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold mb-2">Wie lautet der Titel deines Erlebnisses?</h3>
        <p className="text-gray-300 mb-4">Wähle einen kurzen, prägnanten Titel, der dein Erlebnis gut beschreibt.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="titel" className="flex items-center">
          Titel
          <span className="text-red-400 ml-1" aria-hidden="true">
            *
          </span>
          <span className="sr-only">Pflichtfeld</span>
        </Label>
        <Input
          id="titel"
          placeholder="z.B. Luzider Traum von fliegenden Städten"
          value={data.titel}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          className={`bg-white/5 border-white/20 text-white ${error ? "border-red-500" : ""}`}
          aria-required="true"
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? "titel-error" : "titel-hint"}
        />
        <div className="flex justify-between text-sm">
          <span className={error ? "text-red-400" : "text-gray-400"} id="titel-hint">
            {data.titel.length}/100 Zeichen
          </span>
        </div>
      </div>

      {error && touched && (
        <Alert variant="destructive" className="bg-red-900/50 border-red-800 text-white">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription id="titel-error">{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-blue-900/30 p-4 rounded-md border border-blue-800/50 mt-6" role="note">
        <h4 className="font-medium mb-2">Tipp</h4>
        <p className="text-sm text-gray-300">
          Ein guter Titel hilft anderen, dein Erlebnis zu finden und zu verstehen, worum es geht. Versuche, die
          wichtigsten Aspekte deiner Erfahrung in wenigen Worten zusammenzufassen.
        </p>
      </div>
    </div>
  )
}
