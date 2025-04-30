"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, Calendar, MapPin, ImageIcon, Mic, Video, Clock, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock-Daten für die Übersicht
const recentExperiences = [
  {
    id: "1",
    title: "Wanderung im Schwarzwald",
    date: "15.04.2023",
    location: "Schwarzwald",
    type: "image",
    preview: "/placeholder.svg?key=islz9",
  },
  {
    id: "2",
    title: "Konzert in der Elbphilharmonie",
    date: "03.05.2023",
    location: "Hamburg",
    type: "audio",
    preview: "/placeholder.svg?key=960zg",
  },
  {
    id: "3",
    title: "Stadtführung in Berlin",
    date: "22.06.2023",
    location: "Berlin",
    type: "video",
    preview: "/placeholder.svg?key=274dn",
  },
]

const activityData = [
  { month: "Jan", count: 3 },
  { month: "Feb", count: 5 },
  { month: "Mär", count: 2 },
  { month: "Apr", count: 7 },
  { month: "Mai", count: 4 },
  { month: "Jun", count: 8 },
  { month: "Jul", count: 6 },
  { month: "Aug", count: 9 },
  { month: "Sep", count: 5 },
  { month: "Okt", count: 4 },
  { month: "Nov", count: 6 },
  { month: "Dez", count: 3 },
]

const stats = [
  { label: "Erlebnisse gesamt", value: "42", icon: <Calendar className="h-4 w-4" /> },
  { label: "Besuchte Orte", value: "18", icon: <MapPin className="h-4 w-4" /> },
  { label: "Fotos", value: "156", icon: <ImageIcon className="h-4 w-4" /> },
  { label: "Audio", value: "23", icon: <Mic className="h-4 w-4" /> },
  { label: "Videos", value: "12", icon: <Video className="h-4 w-4" /> },
  { label: "Aktive Zeit", value: "86h", icon: <Clock className="h-4 w-4" /> },
]

export function DashboardOverview() {
  const [timeRange, setTimeRange] = useState<string>("year")

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "audio":
        return <Mic className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <Button variant="outline" className="text-white border-white hover:bg-white/10">
          Alle Erlebnisse
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className="bg-slate-700/50 p-3 rounded-lg">{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-slate-800/50 border-slate-700 text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Aktivitätsübersicht</CardTitle>
                <Tabs defaultValue={timeRange} onValueChange={setTimeRange}>
                  <TabsList className="bg-slate-700">
                    <TabsTrigger value="month" className="data-[state=active]:bg-slate-600">
                      Monat
                    </TabsTrigger>
                    <TabsTrigger value="year" className="data-[state=active]:bg-slate-600">
                      Jahr
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <CardDescription className="text-slate-400">Anzahl der erstellten Erlebnisse über Zeit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-end justify-between gap-2">
                {activityData.map((month, i) => (
                  <div key={i} className="relative flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-gradient-to-t from-emerald-500 to-cyan-500 rounded-t-sm"
                      style={{
                        height: `${(month.count / Math.max(...activityData.map((d) => d.count))) * 150}px`,
                      }}
                    ></div>
                    <span className="text-xs mt-2 text-slate-400">{month.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="bg-slate-800/50 border-slate-700 text-white h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Kategorien
              </CardTitle>
              <CardDescription className="text-slate-400">Verteilung deiner Erlebnisse</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Reisen</span>
                    <span className="text-sm text-slate-400">42%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "42%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Kultur</span>
                    <span className="text-sm text-slate-400">28%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: "28%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Sport</span>
                    <span className="text-sm text-slate-400">15%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: "15%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Andere</span>
                    <span className="text-sm text-slate-400">15%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: "15%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader>
            <CardTitle>Neueste Erlebnisse</CardTitle>
            <CardDescription className="text-slate-400">Deine zuletzt erstellten Erlebnisse</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentExperiences.map((exp) => (
                <div key={exp.id} className="group relative rounded-lg overflow-hidden">
                  <img
                    src={exp.preview || "/placeholder.svg"}
                    alt={exp.title}
                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
                    <div className="flex items-center text-xs text-slate-300 mb-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{exp.date}</span>
                      <span className="mx-2">•</span>
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{exp.location}</span>
                    </div>
                    <h3 className="font-medium">{exp.title}</h3>
                    <div className="flex items-center mt-2">
                      <div className="bg-slate-800/80 p-1 rounded-md">{getTypeIcon(exp.type)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t border-slate-700 pt-4">
            <Button variant="ghost" className="w-full text-slate-300 hover:text-white hover:bg-slate-700/50">
              Alle Erlebnisse anzeigen
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
