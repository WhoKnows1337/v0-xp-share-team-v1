export type SubscriptionTier = "free" | "explorer" | "creator"

export interface SubscriptionPlan {
  id: SubscriptionTier
  name: string
  price: number
  priceYearly: number
  manaPerMonth: number
  features: string[]
  highlighted?: boolean
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    priceYearly: 0,
    manaPerMonth: 50,
    features: ["50 Mana pro Monat", "Basis-Wizard", "3D-Graph", "Feed"],
  },
  {
    id: "explorer",
    name: "Explorer",
    price: 6.99,
    priceYearly: 69.99,
    manaPerMonth: 300,
    features: ["300 Mana pro Monat", "Deep-AI-Analyse", "HD-Media Upload", "Private Gruppen (≤25 Mitglieder)"],
    highlighted: true,
  },
  {
    id: "creator",
    name: "Creator",
    price: 14.99,
    priceYearly: 149.99,
    manaPerMonth: 1000,
    features: ["1000 Mana pro Monat", "Unbegrenzte Gruppen", "VR-Space Export", "Beta-Features", "Höheres Rate-Limit"],
  },
]

export interface UserSubscription {
  tier: SubscriptionTier
  trialEndsAt?: Date | null
  renewsAt?: Date | null
  cancelledAt?: Date | null
  manaRemaining: number
}
