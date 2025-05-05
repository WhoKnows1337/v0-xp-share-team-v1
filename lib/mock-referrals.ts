import type { ReferralInvite, ReferralStats } from "@/types/referral"
import { getCurrentUser } from "./mock-users"

// Mock-Daten für Einladungen
const mockInvites: ReferralInvite[] = [
  {
    id: "ref-001",
    code: "MAGIC123",
    email: "freund1@example.com",
    status: "accepted",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 Tage alt
    acceptedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
    rewards: {
      inviterMana: 100,
      inviterStardust: 0,
      inviteeMana: 100,
      inviteeStardust: 0,
    },
  },
  {
    id: "ref-002",
    code: "MAGIC456",
    email: "freund2@example.com",
    status: "accepted",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    acceptedAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
    rewards: {
      inviterMana: 100,
      inviterStardust: 0,
      inviteeMana: 100,
      inviteeStardust: 0,
    },
  },
  {
    id: "ref-003",
    code: "MAGIC789",
    email: "freund3@example.com",
    status: "accepted",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    acceptedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    rewards: {
      inviterMana: 150, // Bonus für ersten XP-Post
      inviterStardust: 0,
      inviteeMana: 150,
      inviteeStardust: 0,
    },
  },
  {
    id: "ref-004",
    code: "MAGICABC",
    email: "freund4@example.com",
    status: "accepted",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    acceptedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    rewards: {
      inviterMana: 100,
      inviterStardust: 200, // Upgrade auf Explorer
      inviteeMana: 100,
      inviteeStardust: 0,
    },
  },
  {
    id: "ref-005",
    code: "MAGICDEF",
    email: "freund5@example.com",
    status: "pending",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "ref-006",
    code: "MAGICGHI",
    email: "freund6@example.com",
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
]

// Top-Referrer für das Leaderboard
export interface ReferralLeader {
  userId: string
  username: string
  avatar: string
  acceptedReferrals: number
  tier: string
}

export const mockLeaderboard: ReferralLeader[] = [
  {
    userId: "user-001",
    username: "DreamExplorer",
    avatar: "/philosophical-wanderer.png",
    acceptedReferrals: 287,
    tier: "diamond",
  },
  {
    userId: "user-002",
    username: "MindfulJourney",
    avatar: "/peaceful-meditation-guide.png",
    acceptedReferrals: 142,
    tier: "gold",
  },
  {
    userId: "user-003",
    username: "CosmicWanderer",
    avatar: "/dream-traveler.png",
    acceptedReferrals: 98,
    tier: "silver",
  },
  {
    userId: "user-004",
    username: "ForestGuide",
    avatar: "/forest-explorer.png",
    acceptedReferrals: 76,
    tier: "silver",
  },
  {
    userId: "user-005",
    username: "StellarDreamer",
    avatar: "/celestial-contemplation.png",
    acceptedReferrals: 54,
    tier: "silver",
  },
  {
    userId: "user-006",
    username: "EtherealExplorer",
    avatar: "/ethereal-forest-glow.png",
    acceptedReferrals: 37,
    tier: "silver",
  },
  {
    userId: "user-007",
    username: "PathFinder",
    avatar: "/diverging-paths.png",
    acceptedReferrals: 21,
    tier: "bronze",
  },
  {
    userId: "user-008",
    username: "OceanDreamer",
    avatar: "/ethereal-aquatic-dream.png",
    acceptedReferrals: 18,
    tier: "bronze",
  },
  {
    userId: "user-009",
    username: "SpiritGuide",
    avatar: "/serene-spirit.png",
    acceptedReferrals: 12,
    tier: "bronze",
  },
  {
    userId: "user-010",
    username: "ElementalSage",
    avatar: "/elemental-convergence.png",
    acceptedReferrals: 8,
    tier: "bronze",
  },
]

// Funktionen zum Abrufen von Referral-Daten
export function getUserReferrals(): ReferralInvite[] {
  const currentUser = getCurrentUser()
  if (!currentUser) return []

  // In einer echten Anwendung würden wir hier die Einladungen des aktuellen Benutzers abrufen
  return mockInvites
}

export function getUserReferralStats(): ReferralStats {
  const invites = getUserReferrals()

  const accepted = invites.filter((invite) => invite.status === "accepted").length
  const pending = invites.filter((invite) => invite.status === "pending").length

  const totalManaEarned = invites.reduce((sum, invite) => {
    return sum + (invite.rewards?.inviterMana || 0)
  }, 0)

  const totalStardustEarned = invites.reduce((sum, invite) => {
    return sum + (invite.rewards?.inviterStardust || 0)
  }, 0)

  return {
    accepted,
    pending,
    totalManaEarned,
    totalStardustEarned,
  }
}

export function generateReferralCode(): string {
  const currentUser = getCurrentUser()
  if (!currentUser) return "XPSHARE"

  // Generiere einen Code basierend auf dem Benutzernamen und einer zufälligen Zeichenfolge
  const username = currentUser.username
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 5)
    .toUpperCase()
  const randomString = Math.random().toString(36).substring(2, 6).toUpperCase()

  return `${username}${randomString}`
}

export function getReferralLink(): string {
  const code = generateReferralCode()
  return `https://xpshare.de/join?ref=${code}`
}

export function getTopReferrers(limit = 10): ReferralLeader[] {
  return mockLeaderboard.slice(0, limit)
}
