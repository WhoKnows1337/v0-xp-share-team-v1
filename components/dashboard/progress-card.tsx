"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Zap, Award, TrendingUp } from "lucide-react"

// Mock-Daten für die Badges
const recentBadges = [
  { id: 1, name: "Import-Meister", icon: <Trophy className="h-3 w-3" />, color: "bg-amber-500" },
  { id: 2, name: "Streak-Held", icon: <Star className="h-3 w-3" />, color: "bg-cyan-500" },
  { id: 3, name: "Insight-Guru", icon: <Zap className="h-3 w-3" />, color: "bg-purple-500" },
  { id: 4, name: "Community-Star", icon: <Award className="h-3 w-3" />, color: "bg-emerald-500" },
]

// Mock-Daten für die XP-Timeline
const weeklyXP = [
  { day: "Mo", xp: 120 },
  { day: "Di", xp: 85 },
  { day: "Mi", xp: 150 },
  { day: "Do", xp: 75 },
  { day: "Fr", xp: 200 },
  { day: "Sa", xp: 160 },
  { day: "So", xp: 90 },
]

// Mock-Daten für Mana-Verbrauch
const manaUsage = [
  { category: "AI-Analysen", percentage: 45, color: "bg-purple-500" },
  { category: "VR-Spaces", percentage: 30, color: "bg-cyan-500" },
  { category: "Deep Insights", percentage: 15, color: "bg-emerald-500" },
  { category: "Sonstiges", percentage: 10, color: "bg-amber-500" },
]

export function ProgressCard() {
  const [timeView, setTimeView] = useState<"day" | "week">("week")
  const maxXP = Math.max(...weeklyXP.map((day) => day.xp))

  return (
    <Card className="bg-slate-800/50 border-slate-700 text-white overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-emerald-400" />
            <CardTitle>Mein Fortschritt</CardTitle>
          </div>
          <Tabs defaultValue={timeView} onValueChange={(value) => setTimeView(value as "day" | "week")}>
            <TabsList className="bg-slate-700">
              <TabsTrigger value="day" className="data-[state=active]:bg-slate-600">
                Tag
              </TabsTrigger>
              <TabsTrigger value="week" className="data-[state=active]:bg-slate-600">
                Woche
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <CardDescription className="text-slate-400">Deine XP-Entwicklung und Erfolge</CardDescription>
      </CardHeader>

      <CardContent className="pb-4">
        {/* XP-Timeline */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-300 mb-3">XP-Timeline</h4>
          <div className="h-[100px] flex items-end justify-between gap-2">
            {weeklyXP.map((day, i) => (
              <div key={i} className="relative flex flex-col items-center flex-1 group">
                <div
                  className="w-full bg-gradient-to-t from-emerald-500 to-cyan-500 rounded-t-sm relative"
                  style={{
                    height: `${(day.xp / maxXP) * 80}px`,
                  }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-700 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {day.xp} XP
                  </div>
                </div>
                <span className="text-xs mt-2 text-slate-400">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Badges im Fokus */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Letzte Erfolge</h4>
          <div className="flex flex-wrap gap-2">
            {recentBadges.map((badge) => (
              <motion.div
                key={badge.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Badge className={`${badge.color} text-white flex items-center gap-1 px-2 py-1 h-6`} variant="outline">
                  {badge.icon}
                  <span>{badge.name}</span>
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mana-Verbrauch Heat-Map */}
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-3">Mana-Verbrauch</h4>
          <div className="space-y-3">
            {manaUsage.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-300">{item.category}</span>
                  <span className="text-xs text-slate-400">{item.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
