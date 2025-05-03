import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface PricingToggleProps {
  isYearly: boolean
  onChange: (isYearly: boolean) => void
}

export function PricingToggle({ isYearly, onChange }: PricingToggleProps) {
  return (
    <div className="flex items-center justify-center space-x-4 my-8">
      <Label
        htmlFor="yearly-pricing"
        className={`text-sm font-medium ${!isYearly ? "text-primary" : "text-muted-foreground"}`}
      >
        Monatlich
      </Label>
      <Switch id="yearly-pricing" checked={isYearly} onCheckedChange={onChange} />
      <div className="flex items-center">
        <Label
          htmlFor="yearly-pricing"
          className={`text-sm font-medium ${isYearly ? "text-primary" : "text-muted-foreground"}`}
        >
          Jährlich
        </Label>
        <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">20% sparen</span>
      </div>
    </div>
  )
}
