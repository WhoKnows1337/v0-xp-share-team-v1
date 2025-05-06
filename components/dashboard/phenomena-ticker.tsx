"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Globe, Search, AlertTriangle, Sun, Waves, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock-Daten für Phänomene
const phenomena = {
  earthquakes: [
    {
      id: "eq1",
      location: "Pazifischer Ozean, Japan",
      magnitude: 5.2,
      time: "vor 3 Stunden",
      depth: "10 km",
      severity: "mittel",
    },
    {
      id: "eq2",
      location: "Kalifornien, USA",
      magnitude: 3.8,
      time: "vor 12 Stunden",
      depth: "8 km",
      severity: "niedrig",
    },
  ],
  solarStorms: [
    {
      id: "ss1",
      type: "Koronaler Massenauswurf",
      intensity: "G2",
      time: "vor 6 Stunden",
      impact: "Mögliche Polarlichter in mittleren Breiten",
      severity: "mittel",
    },
  ],
}

export function PhenomenaTicker() {
  const [activeTab, setActiveTab] = useState<"earthquakes" | "solarStorms">("earthquakes")

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "hoch":
        return "bg-red-900/30 text-red-300 border-red-700"
      case "mittel":
        return "bg-amber-900/30 text-amber-300 border-amber-700"
      case "niedrig":
        return "bg-emerald-900/30 text-emerald-300 border-emerald-700"
      default:
        return "bg-slate-700 text-slate-300 border-slate-600"
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 text-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Externe Phänomene-Ticker
          </CardTitle>
          <Tabs defaultValue={activeTab} onValueChange={(v) => setActiveTab(v as "earthquakes" | "solarStorms")}>
            <TabsList className="bg-slate-700 h-8">
              <TabsTrigger value="earthquakes" className="h-6 px-3 data-[state=active]:bg-slate-600 flex items-center">
                <Waves className="h-3 w-3 mr-1" />
                Erdbeben
              </TabsTrigger>
              <TabsTrigger value="solarStorms" className="h-6 px-3 data-[state=active]:bg-slate-600 flex items-center">
                <Sun className="h-3 w-3 mr-1" />
                Sonnenstürme
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <CardDescription className="text-slate-400">
          Aktuelle Ereignisse und ihre möglichen Auswirkungen
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeTab === "earthquakes" ? (
          <>
            {phenomena.earthquakes.map((eq) => (
              <motion.div
                key={eq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-slate-700/30 rounded-lg p-3 border border-slate-600"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1 text-amber-400" />
                      {eq.location}
                    </h4>
                    <div className="flex items-center text-sm text-slate-400 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {eq.time}
                    </div>
                  </div>
                  <Badge className={`${getSeverityColor(eq.severity)}`}>M{eq.magnitude}</Badge>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-slate-400">Tiefe: {eq.depth}</span>
                  <Button size="sm" variant="outline" className="h-7 text-xs border-slate-600 hover:bg-slate-700">
                    <Search className="h-3 w-3 mr-1" />
                    XPs ±24h
                  </Button>
                </div>
              </motion.div>
            ))}
          </>
        ) : (
          <>
            {phenomena.solarStorms.map((ss) => (
              <motion.div
                key={ss.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-slate-700/30 rounded-lg p-3 border border-slate-600"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium flex items-center">
                      <Sun className="h-3 w-3 mr-1 text-amber-400" />
                      {ss.type}
                    </h4>
                    <div className="flex items-center text-sm text-slate-400 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {ss.time}
                    </div>
                  </div>
                  <Badge className={`${getSeverityColor(ss.severity)}`}>{ss.intensity}</Badge>
                </div>
                <p className="text-xs text-slate-300 mt-2">{ss.impact}</p>
                <div className="flex justify-end mt-2">
                  <Button size="sm" variant="outline" className="h-7 text-xs border-slate-600 hover:bg-slate-700">
                    <Search className="h-3 w-3 mr-1" />
                    XPs ±24h
                  </Button>
                </div>
              </motion.div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  )
}
