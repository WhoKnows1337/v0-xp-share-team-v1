"use client"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { useRouter } from "next/navigation"
import { ReferralButton } from "@/components/referral/referral-button"

export function CallToAction() {
  const router = useRouter()

  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
      <Container>
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Bereit, deine Erlebnisse zu teilen?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tritt der XP Share Community bei und entdecke eine neue Art, Erlebnisse zu dokumentieren, zu teilen und zu
            verbinden.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => router.push("/dashboard")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Jetzt starten
            </Button>
            <ReferralButton size="lg" text="Freunde einladen & Belohnungen erhalten" />
          </div>
        </div>
      </Container>
    </section>
  )
}
