"use client"

import { useState } from "react"
import { InviteCard } from "./invite-card"
import { ReferralProgress } from "./referral-progress"
import { ReferralLeaderboard } from "./referral-leaderboard"
import { ReferralHistory } from "./referral-history"
import { Container } from "@/components/ui/container"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserReferralStats } from "@/lib/mock-referrals"
import { getCurrentTier } from "@/types/referral"
import { MilestoneBanner } from "./milestone-banner"
import { ShareSheet } from "./share-sheet"
import { getReferralLink } from "@/lib/mock-referrals"
import { EmptyReferralState } from "./empty-referral-state"

export function ReferralDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showMilestone, setShowMilestone] = useState(false)
  const [shareSheetOpen, setShareSheetOpen] = useState(false)

  const stats = getUserReferralStats()
  const currentTier = getCurrentTier(stats.accepted)
  const referralLink = getReferralLink()

  const handleShare = () => {
    setShareSheetOpen(true)
  }

  return (
    <Container className="py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Referral-Programm</h1>
          <p className="text-muted-foreground mt-2">Lade Freunde ein, teile Erlebnisse und verdiene Belohnungen.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="history">Verlauf</TabsTrigger>
            <TabsTrigger value="leaderboard">Bestenliste</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InviteCard onShare={handleShare} />
              <ReferralProgress />
            </div>

            {stats.accepted === 0 && <EmptyReferralState onShare={handleShare} />}
          </TabsContent>

          <TabsContent value="history">
            <ReferralHistory />
          </TabsContent>

          <TabsContent value="leaderboard">
            <ReferralLeaderboard />
          </TabsContent>
        </Tabs>
      </div>

      {/* Milestone Banner (für Demo-Zwecke) */}
      {showMilestone && (
        <MilestoneBanner tier={currentTier} onClose={() => setShowMilestone(false)} onShare={handleShare} />
      )}

      {/* Share Sheet */}
      <ShareSheet open={shareSheetOpen} onOpenChange={setShareSheetOpen} referralLink={referralLink} />
    </Container>
  )
}
