"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}
    let isValid = true

    if (!email) {
      newErrors.email = "E-Mail ist erforderlich"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Ungültige E-Mail-Adresse"
      isValid = false
    }

    if (!password) {
      newErrors.password = "Passwort ist erforderlich"
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
      // Simuliere Login-Prozess
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Anmeldung erfolgreich",
        description: "Du wirst zum Dashboard weitergeleitet.",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: "Bitte überprüfe deine Anmeldedaten.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Anmelden</CardTitle>
          <CardDescription>Gib deine Anmeldedaten ein, um auf dein Konto zuzugreifen</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="deine@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Passwort</Label>
                <Link href="/passwort-vergessen" className="text-sm text-primary hover:underline">
                  Passwort vergessen?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  <span className="sr-only">{showPassword ? "Passwort verbergen" : "Passwort anzeigen"}</span>
                </Button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Anmelden
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Noch kein Konto?{" "}
              <Link href="/registrieren" className="text-primary hover:underline">
                Registrieren
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
