"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getTopReferrers } from "@/lib/mock-referrals"
import { Trophy } from "lucide-react"

interface ReferralLeaderboardProps {
  className?: string
  limit?: number
}

export function ReferralLeaderboard({ className, limit = 10 }: ReferralLeaderboardProps) {
  const leaders = getTopReferrers(limit)

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "diamond":
        return "bg-blue-300 text-blue-950"
      case "gold":
        return "bg-yellow-400 text-yellow-950"
      case "silver":
        return "bg-gray-300 text-gray-950"
      case "bronze":
        return "bg-amber-600 text-amber-950"
      default:
        return "bg-gray-400 text-gray-950"
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "diamond":
        return "💎"
      case "gold":
        return "🥇"
      case "silver":
        return "🥈"
      case "bronze":
        return "🥉"
      default:
        return "🔍"
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Top Referrers
          </CardTitle>
        </div>
        <CardDescription>Die aktivsten Community-Builder auf XP Share.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaders.map((leader, index) => (
            <div key={leader.userId} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 text-center font-medium text-muted-foreground">#{index + 1}</div>
                <Avatar>
                  <AvatarImage src={leader.avatar || "/placeholder.svg"} alt={leader.username} />
                  <AvatarFallback>{leader.username.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{leader.username}</div>
                  <div className="text-xs text-muted-foreground">{leader.acceptedReferrals} Einladungen</div>
                </div>
              </div>
              <Badge className={getTierColor(leader.tier)}>
                {getTierIcon(leader.tier)} {leader.tier.charAt(0).toUpperCase() + leader.tier.slice(1)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
