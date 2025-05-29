import { LeaderboardComponent } from "@/components/gamification/leaderboard-component"
import { mockLeaderboards } from "@/lib/mock-gamification"

export default function LeaderboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bestenliste</h2>
        <p className="text-muted-foreground">Vergleiche deine Leistung mit anderen Benutzern</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockLeaderboards.map((leaderboard) => (
          <LeaderboardComponent key={leaderboard.id} leaderboards={[leaderboard]} currentUserId="u1" />
        ))}
      </div>
    </div>
  )
}
