"use client"
import { Container } from "@/components/ui/container"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSubscription } from "@/contexts/subscription-context"
import { PremiumBadge } from "@/components/subscription/premium-badge"
import { subscriptionPlans } from "@/types/subscription"
import { AlertTriangle, CreditCard } from "lucide-react"

export default function SubscriptionSettingsPage() {
  const { userSubscription, cancelSubscription, upgradePlan } = useSubscription()

  const currentPlan = subscriptionPlans.find((plan) => plan.id === userSubscription.tier)
  const isFreeTier = userSubscription.tier === "free"
  const isTrial = !!userSubscription.trialEndsAt

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "N/A"
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold mb-8">Abonnement-Einstellungen</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Aktueller Plan</CardTitle>
                  <CardDescription>Verwalte dein Abonnement</CardDescription>
                </div>
                {!isFreeTier && <PremiumBadge />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{currentPlan?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {isFreeTier ? "Kostenlos" : `${currentPlan?.price.toFixed(2).replace(".", ",")} € pro Monat`}
                    </p>
                  </div>
                  {!isFreeTier && (
                    <Button variant="outline" onClick={() => {}}>
                      Plan ändern
                    </Button>
                  )}
                </div>

                {!isFreeTier && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      {isTrial ? (
                        <div className="flex justify-between">
                          <span>Testphase endet am</span>
                          <span className="font-medium">{formatDate(userSubscription.trialEndsAt)}</span>
                        </div>
                      ) : (
                        <div className="flex justify-between">
                          <span>Nächste Abrechnung</span>
                          <span className="font-medium">{formatDate(userSubscription.renewsAt)}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span>Mana-Guthaben</span>
                        <span className="font-medium">{userSubscription.manaRemaining} Mana</span>
                      </div>

                      {userSubscription.cancelledAt && (
                        <div className="flex justify-between text-destructive">
                          <span>Gekündigt am</span>
                          <span className="font-medium">{formatDate(userSubscription.cancelledAt)}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch space-y-4">
              {isFreeTier ? (
                <Button
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700"
                  onClick={() => upgradePlan("explorer")}
                >
                  Upgrade auf Premium
                </Button>
              ) : !userSubscription.cancelledAt ? (
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:bg-destructive/10"
                  onClick={() => cancelSubscription()}
                >
                  Abonnement kündigen
                </Button>
              ) : (
                <Button className="w-full" onClick={() => upgradePlan(userSubscription.tier)}>
                  Kündigung zurücknehmen
                </Button>
              )}

              {!isFreeTier && (
                <div className="flex items-center justify-center text-xs text-muted-foreground">
                  <CreditCard className="h-3 w-3 mr-1" />
                  <span>Verwaltet über Stripe</span>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Zahlungsmethoden</CardTitle>
              <CardDescription>Verwalte deine Zahlungsmethoden</CardDescription>
            </CardHeader>
            <CardContent>
              {isFreeTier ? (
                <div className="text-center py-6 text-muted-foreground">
                  <p>Keine Zahlungsmethoden vorhanden</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">•••• 4242</p>
                        <p className="text-xs text-muted-foreground">Läuft ab: 12/25</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Bearbeiten
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {!isFreeTier && (
                <Button variant="outline" className="w-full">
                  Zahlungsmethode hinzufügen
                </Button>
              )}
            </CardFooter>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Rechnungen</CardTitle>
              <CardDescription>Deine Rechnungshistorie</CardDescription>
            </CardHeader>
            <CardContent>
              {isFreeTier ? (
                <div className="text-center py-6 text-muted-foreground">
                  <p>Keine Rechnungen vorhanden</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Premium (Monatlich)</p>
                      <p className="text-xs text-muted-foreground">01.04.2023</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      PDF
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Premium (Monatlich)</p>
                      <p className="text-xs text-muted-foreground">01.03.2023</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      PDF
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {!isFreeTier && userSubscription.cancelledAt && (
        <Card className="mt-8 border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <div className="bg-destructive/10 p-2 rounded-full">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-medium text-destructive">Dein Abonnement wurde gekündigt</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Du hast noch bis zum {formatDate(userSubscription.renewsAt)} Zugriff auf alle Premium-Features. Danach
                  wird dein Account auf den kostenlosen Plan zurückgestuft.
                </p>
                <Button className="mt-4" onClick={() => upgradePlan(userSubscription.tier)}>
                  Kündigung zurücknehmen
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </Container>
  )
}
