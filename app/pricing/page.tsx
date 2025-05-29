"use client"

import { useState } from "react"
import { PriceCard } from "@/components/subscription/price-card"
import { PricingToggle } from "@/components/subscription/pricing-toggle"
import { subscriptionPlans } from "@/types/subscription"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Crown, Shield, Users, Infinity } from "lucide-react"

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true)

  const features = {
    free: [
      "5 Erlebnisse pro Monat",
      "Basis-Community-Zugang",
      "Standard-Support",
      "Mobile App",
      "Grundlegende Analytics",
    ],
    premium: [
      "Unbegrenzte Erlebnisse",
      "Erweiterte Community-Features",
      "Priority Support",
      "Erweiterte Analytics",
      "KI-Insights",
      "Export-Funktionen",
      "Erweiterte Privatsphäre-Einstellungen",
    ],
    business: [
      "Alle Premium-Features",
      "Team-Management",
      "Admin-Dashboard",
      "API-Zugang",
      "White-Label-Optionen",
      "Dedicated Support",
      "Custom Integrations",
      "Advanced Security",
    ],
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-4">
          <Star className="h-3 w-3 mr-1" />
          Beliebte Wahl
        </Badge>
        <h1 className="text-4xl font-bold mb-4">Wähle deinen Plan</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Entdecke die Vorteile von XP Share Premium und wähle den Plan, der am besten zu dir passt. Alle Pläne
          beinhalten eine 14-tägige kostenlose Testphase.
        </p>
        <PricingToggle isAnnual={isYearly} onToggle={() => setIsYearly(!isYearly)} className="mt-6" />
        {isYearly && (
          <p className="text-sm text-green-600 mt-2">
            <Zap className="h-4 w-4 inline mr-1" />
            Spare bis zu 20% mit jährlicher Abrechnung
          </p>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
        {subscriptionPlans.map((plan) => (
          <div key={plan.id} className={plan.id === "premium" ? "relative" : ""}>
            {plan.id === "premium" && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Crown className="h-3 w-3 mr-1" />
                  Beliebtester Plan
                </Badge>
              </div>
            )}
            <PriceCard
              plan={plan}
              isYearly={isYearly}
              onSelectPlan={() => console.log(`Selected plan: ${plan.id}`)}
              className={plan.id === "premium" ? "border-2 border-primary shadow-lg scale-105" : ""}
            />
          </div>
        ))}
      </div>

      {/* Feature Comparison */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Detaillierter Funktionsvergleich</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Features</th>
                    <th className="text-center p-4 font-medium">Free</th>
                    <th className="text-center p-4 font-medium bg-primary/5">Premium</th>
                    <th className="text-center p-4 font-medium">Business</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Erlebnisse pro Monat</td>
                    <td className="text-center p-4">5</td>
                    <td className="text-center p-4 bg-primary/5">
                      <Infinity className="h-4 w-4 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <Infinity className="h-4 w-4 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Community-Zugang</td>
                    <td className="text-center p-4">
                      <Check className="h-4 w-4 mx-auto text-green-500" />
                    </td>
                    <td className="text-center p-4 bg-primary/5">
                      <Check className="h-4 w-4 mx-auto text-green-500" />
                    </td>
                    <td className="text-center p-4">
                      <Check className="h-4 w-4 mx-auto text-green-500" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">KI-Insights</td>
                    <td className="text-center p-4">-</td>
                    <td className="text-center p-4 bg-primary/5">
                      <Check className="h-4 w-4 mx-auto text-green-500" />
                    </td>
                    <td className="text-center p-4">
                      <Check className="h-4 w-4 mx-auto text-green-500" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Team-Management</td>
                    <td className="text-center p-4">-</td>
                    <td className="text-center p-4 bg-primary/5">-</td>
                    <td className="text-center p-4">
                      <Check className="h-4 w-4 mx-auto text-green-500" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">API-Zugang</td>
                    <td className="text-center p-4">-</td>
                    <td className="text-center p-4 bg-primary/5">-</td>
                    <td className="text-center p-4">
                      <Check className="h-4 w-4 mx-auto text-green-500" />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Support</td>
                    <td className="text-center p-4">Community</td>
                    <td className="text-center p-4 bg-primary/5">Priority</td>
                    <td className="text-center p-4">Dedicated</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Häufig gestellte Fragen</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kann ich meinen Plan jederzeit wechseln?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Ja, du kannst jederzeit zwischen den Plänen wechseln. Bei einem Upgrade wird die Differenz anteilig
                berechnet, bei einem Downgrade wird das Guthaben auf die nächste Rechnung angerechnet.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gibt es eine Geld-zurück-Garantie?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Ja, wir bieten eine 14-tägige Geld-zurück-Garantie für alle Premium- und Business-Pläne. Keine Fragen
                gestellt.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Wie funktioniert die jährliche Abrechnung?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Bei jährlicher Abrechnung zahlst du einmal im Jahr und sparst im Vergleich zur monatlichen Zahlung. Du
                erhältst eine Rechnung für das gesamte Jahr.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kann ich meine Daten exportieren?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Ja, alle Pläne beinhalten die Möglichkeit, deine Daten zu exportieren. Premium- und Business-Nutzer
                haben zusätzliche Export-Optionen.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-6">Vertraut von über 10.000+ Nutzern</h3>
        <div className="flex justify-center items-center gap-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span>SSL-verschlüsselt</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>DSGVO-konform</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            <span>4.9/5 Bewertung</span>
          </div>
        </div>
      </div>
    </div>
  )
}
