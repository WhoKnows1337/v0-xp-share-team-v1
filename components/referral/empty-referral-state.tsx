"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Share2, Users } from "lucide-react"

interface EmptyReferralStateProps {
  onShare: () => void
}

export function EmptyReferralState({ onShare }: EmptyReferralStateProps) {
  return (
    <Card className="p-8 flex flex-col items-center text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Users className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Noch niemand eingeladen</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Teile deinen Einladungslink mit Freunden und erhaltet beide Belohnungen. Jede erfolgreiche Anmeldung schenkt dir
        100 Mana.
      </p>
      <Button onClick={onShare}>
        <Share2 className="h-4 w-4 mr-2" />
        Starte jetzt!
      </Button>
    </Card>
  )
}
