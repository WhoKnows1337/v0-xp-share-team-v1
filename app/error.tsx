"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Fehler in der Konsole protokollieren
    console.error("Anwendungsfehler:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Etwas ist schiefgelaufen!</h2>
      <p className="mb-6 text-muted-foreground">
        Es tut uns leid, aber es ist ein Fehler aufgetreten. Bitte versuche es erneut.
      </p>
      <Button onClick={() => reset()} className="mb-4">
        Erneut versuchen
      </Button>
      <Button variant="outline" onClick={() => (window.location.href = "/")}>
        Zurück zur Startseite
      </Button>
    </div>
  )
}
