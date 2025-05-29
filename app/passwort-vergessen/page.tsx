"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { resetPassword } from "@/lib/supabase-auth"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateForm = () => {
    if (!email) {
      setError("E-Mail ist erforderlich")
      return false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Ungültige E-Mail-Adresse")
      return false
    }
    setError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsLoading(true)
      await resetPassword(email)
      setIsSubmitted(true)
      toast({
        title: "Link gesendet",
        description: "Ein Link zum Zurücksetzen deines Passworts wurde an deine E-Mail-Adresse gesendet.",
      })
    } catch (error: any) {
      console.error("Fehler beim Zurücksetzen des Passworts:", error)
      toast({
        title: "Fehler",
        description: error.message || "Beim Zurücksetzen deines Passworts ist ein Fehler aufgetreten.",
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
          <CardTitle className="text-2xl font-bold">Passwort vergessen</CardTitle>
          <CardDescription>
            Gib deine E-Mail-Adresse ein, um einen Link zum Zurücksetzen deines Passworts zu erhalten
          </CardDescription>
        </CardHeader>
        {isSubmitted ? (
          <CardContent className="space-y-4">
            <div className="rounded-md bg-primary/10 p-4 text-center">
              <p className="text-sm text-primary">
                Ein Link zum Zurücksetzen deines Passworts wurde an <strong>{email}</strong> gesendet. Bitte überprüfe
                deine E-Mails und folge den Anweisungen.
              </p>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Keine E-Mail erhalten?{" "}
              <Button variant="link" className="p-0 text-primary" onClick={handleSubmit} disabled={isLoading}>
                Erneut senden
              </Button>
            </p>
          </CardContent>
        ) : (
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
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Link senden
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                <Link href="/login" className="text-primary hover:underline">
                  Zurück zur Anmeldung
                </Link>
              </p>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
