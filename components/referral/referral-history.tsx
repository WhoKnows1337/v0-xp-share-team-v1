"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getUserReferrals } from "@/lib/mock-referrals"
import { formatDistanceToNow } from "date-fns"
import { de } from "date-fns/locale"
import { Coins, Sparkles, Clock, CheckCircle, XCircle } from "lucide-react"

interface ReferralHistoryProps {
  className?: string
}

export function ReferralHistory({ className }: ReferralHistoryProps) {
  const invites = getUserReferrals()

  // Sortiere nach Datum (neueste zuerst)
  const sortedInvites = [...invites].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle>Einladungsverlauf</CardTitle>
        <CardDescription>Deine gesendeten Einladungen und deren Status.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedInvites.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Du hast noch keine Einladungen gesendet.</div>
          ) : (
            sortedInvites.map((invite) => (
              <div key={invite.id} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">{invite.email || "Link-Einladung"}</div>
                    <div className="text-sm text-muted-foreground">
                      Gesendet {formatDistanceToNow(new Date(invite.createdAt), { addSuffix: true, locale: de })}
                    </div>
                  </div>
                  <Badge
                    variant={
                      invite.status === "accepted" ? "default" : invite.status === "pending" ? "outline" : "secondary"
                    }
                    className={invite.status === "accepted" ? "bg-green-500" : ""}
                  >
                    {invite.status === "accepted" ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : invite.status === "pending" ? (
                      <Clock className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {invite.status === "accepted"
                      ? "Angenommen"
                      : invite.status === "pending"
                        ? "Ausstehend"
                        : "Abgelaufen"}
                  </Badge>
                </div>

                {invite.status === "accepted" && invite.rewards && (
                  <div className="bg-muted rounded-md p-2 text-sm">
                    <div className="font-medium mb-1">Erhaltene Belohnungen:</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <Coins className="h-4 w-4 text-blue-500 mr-1" />
                        <span>{invite.rewards.inviterMana} Mana (du)</span>
                      </div>
                      <div className="flex items-center">
                        <Coins className="h-4 w-4 text-blue-500 mr-1" />
                        <span>{invite.rewards.inviteeMana} Mana (Freund)</span>
                      </div>
                      {invite.rewards.inviterStardust > 0 && (
                        <div className="flex items-center">
                          <Sparkles className="h-4 w-4 text-purple-500 mr-1" />
                          <span>{invite.rewards.inviterStardust} Stardust (du)</span>
                        </div>
                      )}
                      {invite.rewards.inviteeStardust > 0 && (
                        <div className="flex items-center">
                          <Sparkles className="h-4 w-4 text-purple-500 mr-1" />
                          <span>{invite.rewards.inviteeStardust} Stardust (Freund)</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
