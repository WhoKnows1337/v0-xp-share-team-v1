"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    if (!formData.username) {
      newErrors.username = "Benutzername ist erforderlich"
      isValid = false
    } else if (formData.username.length < 3) {
      newErrors.username = "Benutzername muss mindestens 3 Zeichen lang sein"
      isValid = false
    }

    if (!formData.email) {
      newErrors.email = "E-Mail ist erforderlich"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Ungültige E-Mail-Adresse"
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = "Passwort ist erforderlich"
      isValid = false
    } else if (formData.password.length < 8) {
      newErrors.password = "Passwort muss mindestens 8 Zeichen lang sein"
      isValid = false
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Passwort-Bestätigung ist erforderlich"
      isValid = false
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwörter stimmen nicht überein"
      isValid = false
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Du musst den Nutzungsbedingungen zustimmen"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simuliere Registrierungsprozess
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Registrierung erfolgreich",
        description: "Dein Konto wurde erstellt. Du kannst dich jetzt anmelden.",
      })

      router.push("/login")
    } catch (error) {
      toast({
        title: "Registrierung fehlgeschlagen",
        description: "Bei der Registrierung ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="container flex min-h-screen items-center justify-center py-8">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Registrieren</CardTitle>
          <CardDescription>Erstelle dein XP-Share Konto</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Benutzername</Label>
              <Input
                id="username"
                type="text"
                placeholder="deinbenutzername"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                disabled={isLoading}
              />
              {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="deine@email.de"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={isLoading}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="acceptTerms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
                disabled={isLoading}
              />
              <Label htmlFor="acceptTerms" className="text-sm">
                Ich akzeptiere die{" "}
                <Link href="/nutzungsbedingungen" className="text-primary hover:underline">
                  Nutzungsbedingungen
                </Link>{" "}
                und{" "}
                <Link href="/datenschutz" className="text-primary hover:underline">
                  Datenschutzerklärung
                </Link>
              </Label>
            </div>
            {errors.acceptTerms && <p className="text-sm text-destructive">{errors.acceptTerms}</p>}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Registrieren
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Bereits ein Konto?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Anmelden
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
