"use client"

import { UserValidator } from "@/components/user-validator"

export default function BenutzerTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Benutzer-Test</h1>
      <p className="mb-6 text-muted-foreground">
        Diese Seite überprüft alle Mock-Benutzer auf Vollständigkeit und Funktionalität. Klicke auf die Benutzerlinks,
        um zu testen, ob die Navigation zu den Profilseiten funktioniert.
      </p>

      <UserValidator />
    </div>
  )
}
