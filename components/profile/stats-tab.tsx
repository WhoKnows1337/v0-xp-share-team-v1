"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award, BookOpen, Heart, MessageSquare, Eye } from "lucide-react"
import type { User } from "@/lib/mock-users"

interface StatsTabProps {
  user: User
}

export function StatsTab({ user }: StatsTabProps) {
  // XP bis zum nächsten Level berechnen
  const xpForNextLevel = user.statistiken.xpLevel * 500
  const xpProgress = ((user.statistiken.xpPunkte % xpForNextLevel) / xpForNextLevel) * 100

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Statistiken</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">XP Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-500" />
                  <span className="text-2xl font-bold">{user.statistiken.xpLevel}</span>
                </div>
                <span className="text-sm text-muted-foreground">{user.statistiken.xpPunkte} XP gesamt</span>
              </div>
              <Progress value={xpProgress} className="h-2" />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>{user.statistiken.xpPunkte % xpForNextLevel} XP</span>
                <span>
                  {xpForNextLevel} XP für Level {user.statistiken.xpLevel + 1}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Aktivität</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                  <BookOpen className="h-6 w-6 mb-2 text-primary" />
                  <span className="text-2xl font-bold">{user.statistiken.erlebnisse}</span>
                  <span className="text-xs text-muted-foreground">Erlebnisse</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                  <MessageSquare className="h-6 w-6 mb-2 text-primary" />
                  <span className="text-2xl font-bold">{user.statistiken.kommentare}</span>
                  <span className="text-xs text-muted-foreground">Kommentare</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                  <Heart className="h-6 w-6 mb-2 text-primary" />
                  <span className="text-2xl font-bold">{user.statistiken.erhalteneVotes}</span>
                  <span className="text-xs text-muted-foreground">Likes</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                  <Eye className="h-6 w-6 mb-2 text-primary" />
                  <span className="text-2xl font-bold">1.2k</span>
                  <span className="text-xs text-muted-foreground">Ansichten</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Errungenschaften</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {user.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center p-3 rounded-lg border"
                    style={{ borderColor: achievement.farbe }}
                  >
                    <div
                      className="flex items-center justify-center h-10 w-10 rounded-full mr-3 text-white"
                      style={{ backgroundColor: achievement.farbe }}
                    >
                      <span>{achievement.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{achievement.name}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.beschreibung}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
