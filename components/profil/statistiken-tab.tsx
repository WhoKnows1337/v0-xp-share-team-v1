"use client"

import type { User } from "@/lib/mock-users"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Achievements } from "./achievements"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface StatistikenTabProps {
  benutzer: User
}

export function StatistikenTab({ benutzer }: StatistikenTabProps) {
  // XP bis zum nächsten Level berechnen
  const xpForCurrentLevel = benutzer.statistiken.xpLevel * 500
  const xpForNextLevel = (benutzer.statistiken.xpLevel + 1) * 500
  const xpProgress = ((benutzer.statistiken.xpPunkte - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Benutzerstatistiken</CardTitle>
          <CardDescription>Übersicht über deine Aktivitäten auf der Plattform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Level {benutzer.statistiken.xpLevel}</span>
                  <span className="text-sm font-medium">{benutzer.statistiken.xpPunkte} XP</span>
                </div>
                <Progress value={xpProgress} className="h-2" />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">{xpForCurrentLevel} XP</span>
                  <span className="text-xs text-muted-foreground">{xpForNextLevel} XP</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-2xl font-bold">{benutzer.statistiken.erlebnisse}</div>
                  <div className="text-sm text-muted-foreground">Geteilte Erlebnisse</div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-2xl font-bold">{benutzer.statistiken.kommentare}</div>
                  <div className="text-sm text-muted-foreground">Kommentare</div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-2xl font-bold">{benutzer.statistiken.erhalteneVotes}</div>
                  <div className="text-sm text-muted-foreground">Erhaltene Likes</div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-2xl font-bold">{benutzer.lesezeichen?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Lesezeichen</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Mitglied seit</h3>
              <div className="bg-muted p-4 rounded-lg mb-4">
                <div className="text-xl">{benutzer.registriertSeit}</div>
              </div>

              <h3 className="text-lg font-medium mb-2">Aktivitätstrend</h3>
              <div className="h-24 bg-muted rounded-lg flex items-end justify-between p-2">
                {/* Hier könnte ein Aktivitätsdiagramm angezeigt werden */}
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-primary w-8 rounded-t-sm"
                    style={{
                      height: `${Math.max(10, Math.floor(Math.random() * 100))}%`,
                      opacity: 0.7 + i * 0.05,
                    }}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Mo</span>
                <span>Di</span>
                <span>Mi</span>
                <span>Do</span>
                <span>Fr</span>
                <span>Sa</span>
                <span>So</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Errungenschaften</CardTitle>
          <CardDescription>Abzeichen, die du für deine Aktivitäten erhalten hast</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="unlocked">
            <TabsList className="mb-4">
              <TabsTrigger value="unlocked">Freigeschaltet</TabsTrigger>
              <TabsTrigger value="all">Alle Abzeichen</TabsTrigger>
            </TabsList>
            <TabsContent value="unlocked">
              <div className="mb-2">
                <h3 className="text-lg font-medium">Deine Abzeichen</h3>
                <p className="text-sm text-muted-foreground">
                  Du hast {benutzer.achievements.filter((a) => a.unlocked).length} von {benutzer.achievements.length}{" "}
                  Abzeichen freigeschaltet
                </p>
              </div>
              <Achievements achievements={benutzer.achievements} />
            </TabsContent>
            <TabsContent value="all">
              <div className="mb-2">
                <h3 className="text-lg font-medium">Alle Abzeichen</h3>
                <p className="text-sm text-muted-foreground">
                  Hier siehst du alle verfügbaren Abzeichen und deinen Fortschritt
                </p>
              </div>
              <Achievements achievements={benutzer.achievements} showLocked={true} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
