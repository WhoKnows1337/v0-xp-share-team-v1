"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Check } from "lucide-react"
import type { SubscriptionPlan } from "@/types/subscription"
import { cn } from "@/lib/utils"

interface PriceCardProps {
  plan: SubscriptionPlan
  isYearly?: boolean
  onSelectPlan: (planId: string) => void
  className?: string
}

export function PriceCard({ plan, isYearly = false, onSelectPlan, className }: PriceCardProps) {
  const price = isYearly ? plan.priceYearly : plan.price
  const formattedPrice = price === 0 ? "Kostenlos" : `${price.toFixed(2).replace(".", ",")} €`
  const period = isYearly ? "/Jahr" : "/Monat"

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
        plan.highlighted && "border-primary shadow-[0_0_20px_rgba(255,215,0,0.2)]",
        className,
      )}
    >
      {plan.highlighted && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
          Empfohlen
        </div>
      )}
      <CardHeader className="pb-2">
        <h3 className="text-xl font-bold">{plan.name}</h3>
        <div className="flex items-baseline mt-2">
          <span className="text-4xl font-bold tracking-tight">{formattedPrice}</span>
          {price > 0 && <span className="ml-1 text-sm text-muted-foreground">{period}</span>}
        </div>
        {price > 0 && <p className="text-xs text-muted-foreground mt-1">Inkl. MwSt. • Jederzeit kündbar</p>}
      </CardHeader>
      <CardContent className="pb-2">
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onSelectPlan(plan.id)}
          className={cn("w-full", plan.highlighted ? "bg-primary hover:bg-primary/90" : "")}
          variant={plan.id === "free" ? "outline" : "default"}
        >
          {plan.id === "free" ? "Kostenlos starten" : "Kostenlos testen"}
        </Button>
      </CardFooter>
      {price > 0 && (
        <div className="text-center text-xs text-muted-foreground pb-4">SSL gesichert • Zahlung über Stripe</div>
      )}
    </Card>
  )
}
