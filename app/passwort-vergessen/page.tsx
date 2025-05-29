"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Mail } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError("E-Mail ist erforderlich")
      return
    }

    if (!validateEmail(email)) {
      setError("Ungültige E-Mail-Adresse")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simuliere API-Aufruf
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSubmitted(true)
      toast({
        title: "E-Mail gesendet",
        description:
          "Falls ein Konto mit dieser E-Mail existiert, haben wir dir einen Link zum Zurücksetzen des Passworts gesendet.",
      })
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Beim Senden der E-Mail ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMounted) {
    return null
  }

  if (isSubmitted) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold">E-Mail gesendet</CardTitle>
            <CardDescription>
              Wir haben dir einen Link zum Zurücksetzen deines Passworts an <strong>{email}</strong> gesendet.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Überprüfe dein E-Mail-Postfach und folge den Anweisungen in der E-Mail.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button asChild className="w-full">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück zur Anmeldung
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsSubmitted(false)
                setEmail("")
              }}
              className="w-full"
            >
              Andere E-Mail verwenden
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Passwort vergessen?</CardTitle>
          <CardDescription>
            Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum Zurücksetzen deines Passworts.
          </CardDescription>
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
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError("")
                }}
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
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück zur Anmeldung
              </Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
