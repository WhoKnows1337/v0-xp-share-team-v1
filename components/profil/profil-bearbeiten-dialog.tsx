"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { User } from "@/lib/mock-users"

interface ProfilBearbeitenDialogProps {
  benutzer: User
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (data: Partial<User>) => void
}

export function ProfilBearbeitenDialog({ benutzer, open, onOpenChange, onSave }: ProfilBearbeitenDialogProps) {
  const [formData, setFormData] = useState({
    name: benutzer.name,
    username: benutzer.username,
    bio: benutzer.bio || "",
    website: benutzer.website || "",
    location: benutzer.location || "",
  })

  // Füge Validierungsstatus hinzu
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Markiere Feld als berührt
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  // Validierungsfunktion
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name ist erforderlich"
        if (value.length < 2) return "Name muss mindestens 2 Zeichen lang sein"
        if (value.length > 50) return "Name darf maximal 50 Zeichen lang sein"
        return ""
      case "username":
        if (!value.trim()) return "Benutzername ist erforderlich"
        if (value.length < 3) return "Benutzername muss mindestens 3 Zeichen lang sein"
        if (value.length > 30) return "Benutzername darf maximal 30 Zeichen lang sein"
        if (!/^[a-zA-Z0-9_-]+$/.test(value))
          return "Benutzername darf nur Buchstaben, Zahlen, Unterstriche und Bindestriche enthalten"
        return ""
      case "bio":
        if (value.length > 500) return "Bio darf maximal 500 Zeichen lang sein"
        return ""
      case "website":
        if (value && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value))
          return "Bitte gib eine gültige Website-URL ein"
        return ""
      default:
        return ""
    }
  }

  // Validiere alle Felder
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === "string") {
        const error = validateField(key, value)
        if (error) {
          newErrors[key] = error
          isValid = false
        }
      }
    })

    setErrors(newErrors)
    return isValid
  }

  // Validiere bei Änderungen, wenn das Feld berührt wurde
  useEffect(() => {
    const newErrors: Record<string, string> = {}

    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === "string" && touched[key]) {
        const error = validateField(key, value)
        if (error) {
          newErrors[key] = error
        }
      }
    })

    setErrors(newErrors)
  }, [formData, touched])

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Markiere alle Felder als berührt
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => {
        acc[key] = true
        return acc
      },
      {} as Record<string, boolean>,
    )
    setTouched(allTouched)

    if (validateForm()) {
      if (onSave) {
        onSave(formData)
      }
      onOpenChange(false)
    }

    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Profil bearbeiten</DialogTitle>
          <DialogDescription>Aktualisiere deine Profilinformationen</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center">
              Name
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.name ? "border-red-500" : ""}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && touched.name && (
              <p id="name-error" className="text-sm text-red-500 mt-1">
                {errors.name}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="username" className="flex items-center">
              Benutzername
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.username ? "border-red-500" : ""}
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? "username-error" : undefined}
            />
            {errors.username && touched.username && (
              <p id="username-error" className="text-sm text-red-500 mt-1">
                {errors.username}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Über mich</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={4}
              className={errors.bio ? "border-red-500" : ""}
              aria-invalid={!!errors.bio}
              aria-describedby={errors.bio ? "bio-error" : undefined}
            />
            {errors.bio && touched.bio && (
              <p id="bio-error" className="text-sm text-red-500 mt-1">
                {errors.bio}
              </p>
            )}
            <div className="flex justify-end">
              <span
                className={`text-xs ${formData.bio.length > 450 ? (formData.bio.length > 500 ? "text-red-500" : "text-amber-500") : "text-gray-500"}`}
              >
                {formData.bio.length}/500
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.website ? "border-red-500" : ""}
              aria-invalid={!!errors.website}
              aria-describedby={errors.website ? "website-error" : undefined}
            />
            {errors.website && touched.website && (
              <p id="website-error" className="text-sm text-red-500 mt-1">
                {errors.website}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Standort</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          {Object.keys(errors).length > 0 && isSubmitting && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Bitte korrigiere die markierten Felder, bevor du fortfährst.</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Speichern
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
