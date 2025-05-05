export interface ReferralStats {
  pending: number
  accepted: number
  totalManaEarned: number
  totalStardustEarned: number
}

export interface ReferralInvite {
  id: string
  code: string
  email?: string
  status: "pending" | "accepted" | "expired"
  createdAt: Date
  acceptedAt?: Date
  rewards?: {
    inviterMana: number
    inviterStardust: number
    inviteeMana: number
    inviteeStardust: number
  }
}

export type ReferralTier = "none" | "bronze" | "silver" | "gold" | "diamond"

export interface ReferralTierInfo {
  tier: ReferralTier
  name: string
  threshold: number
  color: string
  icon: string
  benefits: string[]
}

export const REFERRAL_TIERS: ReferralTierInfo[] = [
  {
    tier: "none",
    name: "Starter",
    threshold: 0,
    color: "bg-gray-400",
    icon: "🔍",
    benefits: ["Standard-Avatar-Rahmen"],
  },
  {
    tier: "bronze",
    name: "Bronze",
    threshold: 5,
    color: "bg-amber-600",
    icon: "🥉",
    benefits: ["Bronze-Avatar-Rahmen", "+5% Mana pro Einladung"],
  },
  {
    tier: "silver",
    name: "Silber",
    threshold: 25,
    color: "bg-gray-300",
    icon: "🥈",
    benefits: ["Silber-Avatar-Rahmen", "+10% Mana pro Einladung", "Exklusive Emojis"],
  },
  {
    tier: "gold",
    name: "Gold",
    threshold: 100,
    color: "bg-yellow-400",
    icon: "🥇",
    benefits: ["Gold-Avatar-Rahmen", "+15% Mana pro Einladung", "Exklusive Emojis", "Früher Zugang zu neuen Features"],
  },
  {
    tier: "diamond",
    name: "Diamant",
    threshold: 250,
    color: "bg-blue-300",
    icon: "💎",
    benefits: [
      "Diamant-Avatar-Rahmen",
      "+20% Mana pro Einladung",
      "Alle exklusiven Emojis",
      "Früher Zugang zu neuen Features",
      "Persönlicher Support-Kanal",
    ],
  },
]

export function getCurrentTier(acceptedReferrals: number): ReferralTierInfo {
  // Finde das höchste Tier, das der Benutzer erreicht hat
  const currentTier = [...REFERRAL_TIERS].reverse().find((tier) => acceptedReferrals >= tier.threshold)

  return currentTier || REFERRAL_TIERS[0]
}

export function getNextTier(acceptedReferrals: number): ReferralTierInfo | null {
  // Finde das nächste Tier, das der Benutzer noch nicht erreicht hat
  const nextTier = REFERRAL_TIERS.find((tier) => acceptedReferrals < tier.threshold)

  return nextTier || null
}

export function getReferralProgress(acceptedReferrals: number): {
  currentTier: ReferralTierInfo
  nextTier: ReferralTierInfo | null
  progress: number
} {
  const currentTier = getCurrentTier(acceptedReferrals)
  const nextTier = getNextTier(acceptedReferrals)

  let progress = 100
  if (nextTier) {
    const range = nextTier.threshold - currentTier.threshold
    const achieved = acceptedReferrals - currentTier.threshold
    progress = Math.min(Math.floor((achieved / range) * 100), 100)
  }

  return {
    currentTier,
    nextTier,
    progress,
  }
}
