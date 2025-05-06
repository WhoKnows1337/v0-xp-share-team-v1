"use client"

import { motion } from "framer-motion"
import { Users, Calendar, Gift, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

// Mock-Daten für Quests und Gruppen
const groupQuests = [
  {
    id: "1",
    title: "30 Tage Meditation",
    group: "Achtsamkeits-Zirkel",
    progress: 70,
    daysLeft: 9,
    members: 24,
  },
  {
    id: "2",
    title: "Traum-Journaling",
    group: "Traumdeuter",
    progress: 40,
    daysLeft: 18,
    members: 12,
  },
]

const globalEvents = [
  {
    id: "1",
    title: "Grand Meditation",
    date: "15. Mai 2023",
    time: "20:00 Uhr",
    participants: 342,
    countdown: "2 Tage 4 Stunden",
  },
]

const invitations = [
  {
    id: "1",
    from: {
      name: "SeelenWanderer",
      avatar: "/forest-explorer.png",
    },
    group: "Astralreisen-Kollektiv",
    reward: "250 XP + Astral-Badge",
    date: "vor 2 Tagen",
  },
  {
    id: "2",
    from: {
      name: "LichtArbeiter",
      avatar: "/dream-traveler.png",
    },
    group: "Lichtkreis-Meditation",
    reward: "150 XP + Mana-Boost",
    date: "vor 5 Tagen",
  },
]

export function QuestsGroups() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Aktive Quests & Gruppen</h2>

      {/* Gruppen-Quests */}
      <div className="space-y-3">
        <h3 className="text-md font-semibold text-slate-300 flex items-center">
          <Users className="h-4 w-4 mr-2" />
          Meine Gruppen-Quests
        </h3>
        {groupQuests.map((quest, index) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{quest.title}</h4>
                    <p className="text-sm text-slate-400">Gruppe: {quest.group}</p>
                  </div>
                  <Badge variant="outline" className="bg-slate-700/50">
                    <Users className="h-3 w-3 mr-1" />
                    {quest.members}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Fortschritt: {quest.progress}%</span>
                    <span>
                      <Clock className="h-3 w-3 inline mr-1" />
                      {quest.daysLeft} Tage übrig
                    </span>
                  </div>
                  <Progress value={quest.progress} className="h-2 bg-slate-700" />
                  <div className="flex justify-end mt-2">
                    <Button size="sm" className="text-xs h-7 px-2 bg-emerald-600 hover:bg-emerald-700">
                      XP hinzufügen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Global Events */}
      <div className="space-y-3">
        <h3 className="text-md font-semibold text-slate-300 flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Global Events
        </h3>
        {globalEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 text-white overflow-hidden">
              <div className="flex">
                <div className="bg-indigo-600 w-1.5"></div>
                <CardContent className="p-4 w-full">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-slate-400">
                        {event.date} um {event.time}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-indigo-900/30 border-indigo-700 text-indigo-300">
                      <Users className="h-3 w-3 mr-1" />
                      {event.participants}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-sm text-indigo-300 font-medium">
                      <Clock className="h-3 w-3 inline mr-1" />
                      Startet in {event.countdown}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7 border-indigo-600 text-indigo-300 hover:bg-indigo-900/30"
                    >
                      Teilnehmen
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Einladungen */}
      <div className="space-y-3">
        <h3 className="text-md font-semibold text-slate-300 flex items-center">
          <Gift className="h-4 w-4 mr-2" />
          Einladungen
        </h3>
        {invitations.map((invite, index) => (
          <motion.div
            key={invite.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 text-white">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <img
                    src={invite.from.avatar || "/placeholder.svg"}
                    alt={invite.from.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{invite.from.name}</h4>
                      <span className="text-xs text-slate-400">{invite.date}</span>
                    </div>
                    <p className="text-sm text-slate-400">Lädt dich zu "{invite.group}" ein</p>
                    <div className="flex items-center mt-1">
                      <Gift className="h-3 w-3 text-amber-400 mr-1" />
                      <span className="text-xs text-amber-400">{invite.reward}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                    Ablehnen
                  </Button>
                  <Button size="sm" className="text-xs h-7 px-2 bg-emerald-600 hover:bg-emerald-700">
                    Annehmen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
