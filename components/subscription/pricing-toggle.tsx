"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface PricingToggleProps {
  isYearly: boolean
  onChange: (isYearly: boolean) => void
}

export function PricingToggle({ isYearly, onChange }: PricingToggleProps) {
  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      <Label htmlFor="yearly-pricing" className={isYearly ? "text-muted-foreground" : "font-medium"}>
        Monatlich
      </Label>
      <Switch
        id="yearly-pricing"
        checked={isYearly}
        onCheckedChange={onChange}
        aria-label="Jährliche Abrechnung umschalten"
      />
      <div className="flex items-center">
        <Label htmlFor="yearly-pricing" className={!isYearly ? "text-muted-foreground" : "font-medium"}>
          Jährlich
        </Label>
        <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
          20% Rabatt
        </span>
      </div>
    </div>
  )
}
