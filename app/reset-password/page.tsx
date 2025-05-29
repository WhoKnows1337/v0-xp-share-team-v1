"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { updatePassword } from "@/lib/supabase-auth"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({})

  useEffect(() => {
    // Überprüfe, ob ein gültiger Token in der URL vorhanden ist
    const token = searchParams?.get("token")
    if (!token) {
      toast({
        title: "Ungültiger Link",
        description: "Der Link zum Zurücksetzen des Passworts ist ungültig oder abgelaufen.",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [router, searchParams])

  const validateForm = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {}
    let isValid = true

    if (!password) {
      newErrors.password = "Passwort ist erforderlich"
      isValid = false
    } else if (password.length < 8) {
      newErrors.password = "Passwort muss mindestens 8 Zeichen lang sein"
      isValid = false
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Passwort bestätigen ist erforderlich"
      isValid = false
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwörter stimmen nicht überein"
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

    try {
      setIsLoading(true)
      await updatePassword(password)
      toast({
        title: "Passwort aktualisiert",
        description: "Dein Passwort wurde erfolgreich aktualisiert. Du kannst dich jetzt anmelden.",
      })
      router.push("/login")
    } catch (error: any) {
      console.error("Fehler beim Aktualisieren des Passworts:", error)
      toast({
        title: "Fehler",
        description: error.message || "Beim Aktualisieren deines Passworts ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Passwort zurücksetzen</CardTitle>
          <CardDescription>Gib dein neues Passwort ein</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Neues Passwort</Label>
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  <span className="sr-only">{showConfirmPassword ? "Passwort verbergen" : "Passwort anzeigen"}</span>
                </Button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Passwort zurücksetzen
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/login" className="text-primary hover:underline">
                Zurück zur Anmeldung
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
