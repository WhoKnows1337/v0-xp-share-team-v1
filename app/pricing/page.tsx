"use client"

import { useState } from "react"
import { PriceCard } from "@/components/subscription/price-card"
import { PricingToggle } from "@/components/subscription/pricing-toggle"

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Wähle deinen Plan</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Entdecke die Vorteile von XP Share Premium und wähle den Plan, der am besten zu dir passt.
        </p>
        <PricingToggle isAnnual={isAnnual} onToggle={() => setIsAnnual(!isAnnual)} className="mt-6" />
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <PriceCard
          title="Kostenlos"
          price={0}
          isAnnual={isAnnual}
          features={[
            "Grundlegende Erlebnis-Teilung",
            "Begrenzte Speicherkapazität",
            "Zugang zur Community",
            "Basis-Analysen",
          ]}
          cta="Aktueller Plan"
          variant="outline"
          disabled
        />
        <PriceCard
          title="Premium"
          price={isAnnual ? 8.99 : 10.99}
          isAnnual={isAnnual}
          features={[
            "Unbegrenzte Erlebnis-Teilung",
            "Erweiterte Speicherkapazität",
            "Prioritäts-Support",
            "Erweiterte Analysen",
            "Werbefreie Erfahrung",
            "Exklusive Vorlagen",
          ]}
          cta="Upgrade auf Premium"
          variant="default"
          popular
        />
        <PriceCard
          title="Business"
          price={isAnnual ? 19.99 : 24.99}
          isAnnual={isAnnual}
          features={[
            "Alles aus Premium",
            "Team-Kollaboration",
            "Admin-Dashboard",
            "API-Zugang",
            "Dedizierter Support",
            "Anpassbare Berichte",
            "Erweiterte Sicherheit",
          ]}
          cta="Kontaktiere uns"
          variant="outline"
        />
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Häufig gestellte Fragen</h2>
        <div className="max-w-3xl mx-auto mt-8 space-y-6 text-left">
          <div>
            <h3 className="font-semibold mb-2">Kann ich meinen Plan jederzeit wechseln?</h3>
            <p className="text-muted-foreground">
              Ja, du kannst jederzeit zwischen den Plänen wechseln. Bei einem Upgrade wird die Differenz anteilig
              berechnet, bei einem Downgrade wird das Guthaben auf die nächste Rechnung angerechnet.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Gibt es eine Geld-zurück-Garantie?</h3>
            <p className="text-muted-foreground">
              Ja, wir bieten eine 14-tägige Geld-zurück-Garantie für alle Premium- und Business-Pläne.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Wie funktioniert die jährliche Abrechnung?</h3>
            <p className="text-muted-foreground">
              Bei jährlicher Abrechnung zahlst du einmal im Jahr und sparst im Vergleich zur monatlichen Zahlung.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
