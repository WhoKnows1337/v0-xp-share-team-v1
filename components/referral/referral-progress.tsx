"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getUserReferralStats } from "@/lib/mock-referrals"
import { getReferralProgress, REFERRAL_TIERS } from "@/types/referral"

interface ReferralProgressProps {
  className?: string
}

export function ReferralProgress({ className }: ReferralProgressProps) {
  const stats = getUserReferralStats()
  const { currentTier, nextTier, progress } = getReferralProgress(stats.accepted)

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle>Referral-Status</CardTitle>
        <CardDescription>Dein aktueller Status und Fortschritt im Referral-Programm.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentTier.icon}</span>
              <div>
                <div className="font-medium">{currentTier.name}</div>
                <div className="text-sm text-muted-foreground">{stats.accepted} Einladungen</div>
              </div>
            </div>

            {nextTier && (
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Nächstes Tier</div>
                <div className="font-medium flex items-center gap-1">
                  <span>{nextTier.icon}</span> {nextTier.name}
                </div>
              </div>
            )}
          </div>

          {nextTier && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{stats.accepted}</span>
                <span>{nextTier.threshold}</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="text-xs text-muted-foreground text-center">
                Noch {nextTier.threshold - stats.accepted} Einladungen bis {nextTier.name}
              </div>
            </div>
          )}

          <div className="pt-2">
            <div className="text-sm font-medium mb-2">Verfügbare Tiers</div>
            <div className="flex flex-wrap gap-2">
              <TooltipProvider>
                {REFERRAL_TIERS.map((tier) => (
                  <Tooltip key={tier.tier}>
                    <TooltipTrigger asChild>
                      <Badge
                        variant={tier.threshold <= stats.accepted ? "default" : "outline"}
                        className={`${tier.threshold <= stats.accepted ? tier.color : ""} cursor-help`}
                      >
                        {tier.icon} {tier.name}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-2 p-1 max-w-xs">
                        <div className="font-medium">
                          {tier.name} ({tier.threshold}+ Einladungen)
                        </div>
                        <ul className="text-xs space-y-1 list-disc pl-4">
                          {tier.benefits.map((benefit, i) => (
                            <li key={i}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
