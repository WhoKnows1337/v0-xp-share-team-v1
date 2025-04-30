"use client"

import { useEffect, useState } from "react"
import { findUserByUsername, findAllUserReferences } from "@/lib/mock-users"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { UserLink } from "@/components/user-link"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function UserValidator() {
  const [validationResults, setValidationResults] = useState<
    {
      username: string
      exists: boolean
      hasStatistiken: boolean
      hasAvatar: boolean
      hasBio: boolean
    }[]
  >([])
  const [isValidating, setIsValidating] = useState(false)
  const { toast } = useToast()

  const validateAllUsers = () => {
    setIsValidating(true)

    // Hole alle Benutzernamen, die in der Anwendung verwendet werden
    const userReferences = findAllUserReferences()

    // Validiere jeden Benutzer
    const results = userReferences.map((username) => {
      const user = findUserByUsername(username)
      return {
        username,
        exists: !!user,
        hasStatistiken: user ? !!user.statistiken : false,
        hasAvatar: user ? !!user.avatar : false,
        hasBio: user ? !!user.bio : false,
      }
    })

    setValidationResults(results)
    setIsValidating(false)

    // Zeige Toast mit Ergebnis
    const allValid = results.every((r) => r.exists && r.hasStatistiken && r.hasAvatar && r.hasBio)

    if (allValid) {
      toast({
        title: "Alle Benutzer sind gültig",
        description: `${results.length} Benutzer wurden erfolgreich validiert.`,
        variant: "default",
      })
    } else {
      const invalidCount = results.filter((r) => !r.exists || !r.hasStatistiken || !r.hasAvatar || !r.hasBio).length
      toast({
        title: "Einige Benutzer haben Probleme",
        description: `${invalidCount} von ${results.length} Benutzern haben Probleme.`,
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    // Automatische Validierung beim Laden
    validateAllUsers()
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Benutzer-Validierung</CardTitle>
        <CardDescription>Überprüft alle Mock-Benutzer auf Vollständigkeit und Funktionalität</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button onClick={validateAllUsers} disabled={isValidating} className="mb-4">
            {isValidating ? "Validiere..." : "Alle Benutzer validieren"}
          </Button>
        </div>

        <div className="space-y-4">
          {validationResults.map((result) => (
            <div key={result.username} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <UserLink username={result.username} showName={true} />
              </div>

              <div className="flex gap-2">
                <Badge variant={result.exists ? "default" : "destructive"} className="flex items-center gap-1">
                  {result.exists ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  Existiert
                </Badge>

                <Badge variant={result.hasStatistiken ? "default" : "destructive"} className="flex items-center gap-1">
                  {result.hasStatistiken ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  Statistiken
                </Badge>

                <Badge variant={result.hasAvatar ? "default" : "destructive"} className="flex items-center gap-1">
                  {result.hasAvatar ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  Avatar
                </Badge>

                <Badge variant={result.hasBio ? "default" : "destructive"} className="flex items-center gap-1">
                  {result.hasBio ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  Bio
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {validationResults.length === 0 && !isValidating && (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="mx-auto h-8 w-8 mb-2" />
            <p>Keine Validierungsergebnisse verfügbar.</p>
          </div>
        )}

        {isValidating && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Validiere Benutzer...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
