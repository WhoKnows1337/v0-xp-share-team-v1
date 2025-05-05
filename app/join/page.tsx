"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Coins } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreeTerms) {
      toast({
        title: "Bitte akzeptiere die Nutzungsbedingungen",
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
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="deine@email.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Benutzername</Label>
                <Input
                  id="username"
                  placeholder="DeinBenutzername"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Passwort</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                />
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
              </div>

              <input type="hidden" name="referralCode" value={referralCode} />
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
