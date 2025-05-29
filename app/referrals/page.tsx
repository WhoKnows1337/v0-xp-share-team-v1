"use client"

import { ReferralDashboard } from "@/components/referral/referral-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Gift, Users, Trophy, Share2, Copy, Mail, MessageCircle } from "lucide-react"
import { useState } from "react"

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false)

  const referralCode = "XP-SHARE-MAX123"
  const referralLink = `https://xp-share.com/join?ref=${referralCode}`

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const stats = {
    totalReferrals: 12,
    activeReferrals: 8,
    totalRewards: 2400,
    nextMilestone: 15,
    currentStreak: 5,
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Freunde einladen</h1>
        <p className="text-muted-foreground">
          Teile XP-Share mit deinen Freunden und verdiene Belohnungen für jeden erfolgreichen Verweis
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Eingeladene Freunde
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">{stats.activeReferrals} aktiv</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Verdiente XP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRewards.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+200 XP pro Freund</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Nächster Meilenstein
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.nextMilestone}</div>
            <Progress value={(stats.totalReferrals / stats.nextMilestone) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.nextMilestone - stats.totalReferrals} Freunde fehlen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentStreak}</div>
            <p className="text-xs text-muted-foreground">Tage in Folge</p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Dein Einladungslink
          </CardTitle>
          <CardDescription>
            Teile diesen Link mit deinen Freunden und verdiene 200 XP für jeden, der sich registriert
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm">{referralLink}</div>
            <Button onClick={handleCopy} variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              {copied ? "Kopiert!" : "Kopieren"}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1" variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Per E-Mail teilen
            </Button>
            <Button className="flex-1" variant="outline">
              <MessageCircle className="h-4 w-4 mr-2" />
              In WhatsApp teilen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Rewards Program */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Belohnungsprogramm</CardTitle>
          <CardDescription>Verdiene immer bessere Belohnungen, je mehr Freunde du einlädst</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">1-5 Freunde</Badge>
                <span>200 XP pro Freund</span>
              </div>
              <Badge variant={stats.totalReferrals >= 1 ? "default" : "outline"}>
                {stats.totalReferrals >= 1 ? "Erreicht" : "Ausstehend"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">6-10 Freunde</Badge>
                <span>300 XP pro Freund + Bonus Badge</span>
              </div>
              <Badge variant={stats.totalReferrals >= 6 ? "default" : "outline"}>
                {stats.totalReferrals >= 6 ? "Erreicht" : "Ausstehend"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">11-15 Freunde</Badge>
                <span>400 XP pro Freund + Premium Features</span>
              </div>
              <Badge variant={stats.totalReferrals >= 11 ? "default" : "outline"}>
                {stats.totalReferrals >= 11 ? "Erreicht" : "Ausstehend"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">16+ Freunde</Badge>
                <span>500 XP pro Freund + Exklusive Belohnungen</span>
              </div>
              <Badge variant={stats.totalReferrals >= 16 ? "default" : "outline"}>
                {stats.totalReferrals >= 16 ? "Erreicht" : "Ausstehend"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Referral Dashboard */}
      <ReferralDashboard />
    </div>
  )
}
