import { SeasonOverview } from "@/components/gamification/season-overview"
import { getActiveSeason } from "@/lib/mock-gamification"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"

export default function SeasonPage() {
  const activeSeason = getActiveSeason()

  if (!activeSeason) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">Keine aktive Saison</h3>
          <p className="text-muted-foreground mb-6">Derzeit läuft keine Saison. Schau später wieder vorbei!</p>
          <Button>Kommende Saisons anzeigen</Button>
        </CardContent>
      </Card>
    )
  }

  return <SeasonOverview season={activeSeason} />
}
