"use client"

import { useState } from "react"
import { Container } from "@/components/ui/container"
import { PriceCard } from "@/components/subscription/price-card"
import { PricingToggle } from "@/components/subscription/pricing-toggle"
import { subscriptionPlans } from "@/types/subscription"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast"

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const { toast } = useToast()

  const handleSelectPlan = (planId: string) => {
    // In einer echten Implementierung würde hier der Checkout-Prozess starten
    toast({
      title: "Testversion starten",
      description: `Du hast das ${planId}-Paket ausgewählt. Der Checkout-Prozess würde jetzt starten.`,
    })
  }

  return (
    <Container className="py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Entfessle deine XP-Reise</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Wähle den Plan, der am besten zu deinen Bedürfnissen passt und erlebe XP Share in vollem Umfang.
        </p>
      </div>

      <PricingToggle isYearly={isYearly} onChange={setIsYearly} />

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {subscriptionPlans.map((plan) => (
          <PriceCard key={plan.id} plan={plan} isYearly={isYearly} onSelectPlan={handleSelectPlan} />
        ))}
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Häufig gestellte Fragen</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Was ist Mana und wofür wird es verwendet?</AccordionTrigger>
            <AccordionContent>
              Mana ist unsere interne Währung für KI-gestützte Funktionen. Du verwendest Mana für Deep-AI-Analysen,
              Muster-Erkennung und andere Premium-Features. Jeder Plan kommt mit einem monatlichen Mana-Kontingent.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Kann ich meinen Plan jederzeit wechseln?</AccordionTrigger>
            <AccordionContent>
              Ja, du kannst jederzeit zwischen den Plänen wechseln. Bei einem Upgrade wird die Differenz anteilig
              berechnet. Bei einem Downgrade wird der neue Plan nach Ablauf der aktuellen Abrechnungsperiode wirksam.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Wie funktioniert die kostenlose Testphase?</AccordionTrigger>
            <AccordionContent>
              Du erhältst 7 Tage kostenlosen Zugang zu allen Features des gewählten Plans. Wenn du innerhalb dieser Zeit
              nicht kündigst, wird dir der reguläre Preis nach Ablauf der Testphase berechnet.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Gibt es Rabatte für Teams oder Bildungseinrichtungen?</AccordionTrigger>
            <AccordionContent>
              Ja, wir bieten spezielle Tarife für Teams ab 5 Personen und für Bildungseinrichtungen an. Kontaktiere uns
              bitte direkt für weitere Informationen.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Container>
  )
}
