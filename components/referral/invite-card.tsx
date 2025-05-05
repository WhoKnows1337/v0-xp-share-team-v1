"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PartyPopper, Copy, Check } from "lucide-react"
import { useState } from "react"
import { getReferralLink, getUserReferralStats } from "@/lib/mock-referrals"
import { useToast } from "@/hooks/use-toast"
import { ShareSheet } from "./share-sheet"

interface InviteCardProps {
  className?: string
  onShare?: () => void
}

export function InviteCard({ className, onShare }: InviteCardProps) {
  const [copied, setCopied] = useState(false)
  const [shareSheetOpen, setShareSheetOpen] = useState(false)
  const { toast } = useToast()
  const stats = getUserReferralStats()
  const referralLink = getReferralLink()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      toast({
        title: "Link kopiert!",
        description: "Der Einladungslink wurde in die Zwischenablage kopiert.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Fehler beim Kopieren",
        description: "Der Link konnte nicht kopiert werden. Bitte versuche es erneut.",
        variant: "destructive",
      })
    }
  }

  const handleShare = () => {
    setShareSheetOpen(true)
    if (onShare) onShare()
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <PartyPopper className="h-5 w-5 text-yellow-500" />
            Teile die Magie – erhalte Mana
          </CardTitle>
        </div>
        <CardDescription>
          Lade Freunde ein und erhaltet beide Belohnungen. Jede erfolgreiche Anmeldung schenkt dir 100 Mana.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="bg-muted rounded-md px-3 py-2">
              <div className="font-medium">{stats.accepted}</div>
              <div className="text-muted-foreground">Angenommen</div>
            </div>
            <div className="bg-muted rounded-md px-3 py-2">
              <div className="font-medium">{stats.pending}</div>
              <div className="text-muted-foreground">Ausstehend</div>
            </div>
            <div className="bg-muted rounded-md px-3 py-2">
              <div className="font-medium">{stats.totalManaEarned}</div>
              <div className="text-muted-foreground">Mana verdient</div>
            </div>
            {stats.totalStardustEarned > 0 && (
              <div className="bg-muted rounded-md px-3 py-2">
                <div className="font-medium">{stats.totalStardustEarned}</div>
                <div className="text-muted-foreground">Stardust verdient</div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Input
              value={referralLink}
              readOnly
              className="font-mono text-sm"
              onClick={(e) => e.currentTarget.select()}
            />
            <Button size="icon" variant="outline" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleShare}>
          Freunde einladen
        </Button>
      </CardFooter>

      <ShareSheet open={shareSheetOpen} onOpenChange={setShareSheetOpen} referralLink={referralLink} />
    </Card>
  )
}
