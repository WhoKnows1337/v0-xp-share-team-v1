"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Coins, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function JoinPage() {
  const searchParams = useSearchParams()
  const referralCode = searchParams?.get("ref") || ""
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Validierungsstatus
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({
    email: false,
    username: false,
    password: false,
    agreeTerms: false,
  })

  // Validierungsfunktionen
  const validateEmail = (email: string): string => {
    if (!email.trim()) return "E-Mail ist erforderlich"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Bitte gib eine gültige E-Mail-Adresse ein"
    return ""
  }

  const validateUsername = (username: string): string => {
    if (!username.trim()) return "Benutzername ist erforderlich"
    if (username.length < 3) return "Benutzername muss mindestens 3 Zeichen lang sein"
    if (username.length > 30) return "Benutzername darf maximal 30 Zeichen lang sein"
    if (!/^[a-zA-Z0-9_-]+$/.test(username))
      return "Benutzername darf nur Buchstaben, Zahlen, Unterstriche und Bindestriche enthalten"
    return ""
  }

  const validatePassword = (password: string): string => {
    if (!password) return "Passwort ist erforderlich"
    if (password.length < 8) return "Passwort muss mindestens 8 Zeichen lang sein"
    if (!/(?=.*[a-z])/.test(password)) return "Passwort muss mindestens einen Kleinbuchstaben enthalten"
    if (!/(?=.*[A-Z])/.test(password)) return "Passwort muss mindestens einen Großbuchstaben enthalten"
    if (!/(?=.*\d)/.test(password)) return "Passwort muss mindestens eine Zahl enthalten"
    return ""
  }

  // Validiere bei Änderungen, wenn das Feld berührt wurde
  useEffect(() => {
    const newErrors: Record<string, string> = {}

    if (touched.email) {
      const emailError = validateEmail(email)
      if (emailError) newErrors.email = emailError
    }

    if (touched.username) {
      const usernameError = validateUsername(username)
      if (usernameError) newErrors.username = usernameError
    }

    if (touched.password) {
      const passwordError = validatePassword(password)
      if (passwordError) newErrors.password = passwordError
    }

    if (touched.agreeTerms && !agreeTerms) {
      newErrors.agreeTerms = "Du musst die Nutzungsbedingungen akzeptieren"
    }

    setErrors(newErrors)
  }, [email, username, password, agreeTerms, touched])

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const validateForm = (): boolean => {
    const emailError = validateEmail(email)
    const usernameError = validateUsername(username)
    const passwordError = validatePassword(password)
    const termsError = !agreeTerms ? "Du musst die Nutzungsbedingungen akzeptieren" : ""

    const newErrors = {
      ...(emailError ? { email: emailError } : {}),
      ...(usernameError ? { username: usernameError } : {}),
      ...(passwordError ? { password: passwordError } : {}),
      ...(termsError ? { agreeTerms: termsError } : {}),
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Markiere alle Felder als berührt
    setTouched({
      email: true,
      username: true,
      password: true,
      agreeTerms: true,
    })

    if (!validateForm()) {
      toast({
        title: "Formular unvollständig",
        description: "Bitte fülle alle erforderlichen Felder korrekt aus.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simuliere API-Aufruf
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Willkommen bei XP Share!",
      description: "Dein Konto wurde erfolgreich erstellt. Du hast 100 Mana erhalten!",
    })

    // Weiterleitung zum Dashboard
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">XP Share</h1>
          <p className="text-muted-foreground">Teile deine Erlebnisse mit der Welt</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registrieren</CardTitle>
            <CardDescription>Erstelle dein Konto und beginne deine Reise.</CardDescription>
          </CardHeader>
          <CardContent>
            {referralCode && (
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4 flex items-center">
                <Coins className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                <div className="text-sm">
                  <span className="font-medium">+100 Mana Bonus!</span> Du wurdest eingeladen und erhältst einen
                  Willkommensbonus.
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center">
                  E-Mail
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="deine@email.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={errors.email && touched.email ? "border-red-500" : ""}
                  aria-invalid={!!(errors.email && touched.email)}
                  aria-describedby={errors.email && touched.email ? "email-error" : undefined}
                  required
                />
                {errors.email && touched.email && (
                  <p id="email-error" className="text-sm text-red-500 mt-1">
                    {errors.email}
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
                  placeholder="DeinBenutzername"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => handleBlur("username")}
                  className={errors.username && touched.username ? "border-red-500" : ""}
                  aria-invalid={!!(errors.username && touched.username)}
                  aria-describedby={errors.username && touched.username ? "username-error" : undefined}
                  required
                />
                {errors.username && touched.username && (
                  <p id="username-error" className="text-sm text-red-500 mt-1">
                    {errors.username}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center">
                  Passwort
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  className={errors.password && touched.password ? "border-red-500" : ""}
                  aria-invalid={!!(errors.password && touched.password)}
                  aria-describedby={errors.password && touched.password ? "password-error" : undefined}
                  required
                />
                {errors.password && touched.password && (
                  <p id="password-error" className="text-sm text-red-500 mt-1">
                    {errors.password}
                  </p>
                )}

                {touched.password && !errors.password && password && (
                  <div className="mt-2 text-sm text-green-500 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Sicheres Passwort
                  </div>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => {
                    setAgreeTerms(checked as boolean)
                    setTouched((prev) => ({ ...prev, agreeTerms: true }))
                  }}
                  className={errors.agreeTerms && touched.agreeTerms ? "border-red-500" : ""}
                  aria-invalid={!!(errors.agreeTerms && touched.agreeTerms)}
                  aria-describedby={errors.agreeTerms && touched.agreeTerms ? "terms-error" : undefined}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Ich akzeptiere die{" "}
                    <a href="#" className="text-blue-500 hover:underline">
                      Nutzungsbedingungen
                    </a>{" "}
                    und{" "}
                    <a href="#" className="text-blue-500 hover:underline">
                      Datenschutzrichtlinien
                    </a>
                  </label>
                  {errors.agreeTerms && touched.agreeTerms && (
                    <p id="terms-error" className="text-sm text-red-500">
                      {errors.agreeTerms}
                    </p>
                  )}
                </div>
              </div>

              <input type="hidden" name="referralCode" value={referralCode} />

              {Object.keys(errors).length > 0 && Object.values(touched).some((t) => t) && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Bitte korrigiere die markierten Felder, bevor du fortfährst.</AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Wird erstellt..." : "Konto erstellen"}
            </Button>
          </CardFooter>
        </Card>

        <div className="text-center text-sm">
          Bereits ein Konto?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Anmelden
          </a>
        </div>
      </div>
    </div>
  )
}
