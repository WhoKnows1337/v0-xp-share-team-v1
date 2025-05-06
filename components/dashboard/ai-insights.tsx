"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, Network, ArrowRight, Sparkles } from "lucide-react"

export function AIInsights() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="bg-slate-800/50 border-slate-700 text-white overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-cyan-900/50 to-purple-900/50 pb-2">
        <CardTitle className="flex items-center text-lg">
          <Brain className="h-5 w-5 mr-2 text-cyan-400" />
          KI-Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-slate-700/50 rounded-lg p-3 mt-3">
          <div className="flex items-center mb-2">
            <Sparkles className="h-4 w-4 text-amber-400 mr-2" />
            <h3 className="font-medium text-sm">Was verbindet deine letzten Erlebnisse?</h3>
          </div>
          <div className="text-sm text-slate-300">
            <span className="inline-block mr-1">
              <Badge className="bg-cyan-900/80 text-cyan-200 hover:bg-cyan-800/80">Bewusstseinserweiterung</Badge>
            </span>
            und
            <span className="inline-block mx-1">
              <Badge className="bg-purple-900/80 text-purple-200 hover:bg-purple-800/80">Traumarbeit</Badge>
            </span>
            tauchen in 80% deiner letzten Einträge auf. Deine Erlebnisse zeigen eine Verbindung zwischen Traumsymbolen
            und meditativen Zuständen.
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-emerald-400 mr-2" />
              <h3 className="font-medium text-sm">Muster & Trends</h3>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-slate-400 hover:text-white">
              Details
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-3 text-xs text-slate-300">
            Deine intensivsten Erlebnisse treten häufig zwischen 3-5 Uhr morgens auf. Versuche in dieser Zeit bewusster
            zu sein.
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Network className="h-4 w-4 text-blue-400 mr-2" />
              <h3 className="font-medium text-sm">Dein Erlebnis-Netzwerk</h3>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-slate-400 hover:text-white">
              Vollansicht
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <div className="bg-slate-800/80 rounded-lg overflow-hidden relative" style={{ height: "120px" }}>
            {/* Miniatur-Netzwerk-Visualisierung */}
            <svg width="100%" height="100%" viewBox="0 0 300 120" className="absolute inset-0">
              <circle cx="150" cy="60" r="30" fill="#3b82f6" fillOpacity="0.3" stroke="#3b82f6" strokeWidth="1" />
              <circle cx="90" cy="40" r="15" fill="#8b5cf6" fillOpacity="0.3" stroke="#8b5cf6" strokeWidth="1" />
              <circle cx="200" cy="50" r="20" fill="#10b981" fillOpacity="0.3" stroke="#10b981" strokeWidth="1" />
              <circle cx="120" cy="90" r="18" fill="#f59e0b" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="1" />
              <circle cx="220" cy="85" r="12" fill="#ec4899" fillOpacity="0.3" stroke="#ec4899" strokeWidth="1" />

              <line x1="150" y1="60" x2="90" y2="40" stroke="#4b5563" strokeWidth="1" strokeOpacity="0.6" />
              <line x1="150" y1="60" x2="200" y2="50" stroke="#4b5563" strokeWidth="1" strokeOpacity="0.6" />
              <line x1="150" y1="60" x2="120" y2="90" stroke="#4b5563" strokeWidth="1" strokeOpacity="0.6" />
              <line x1="200" y1="50" x2="220" y2="85" stroke="#4b5563" strokeWidth="1" strokeOpacity="0.6" />
              <line x1="120" y1="90" x2="220" y2="85" stroke="#4b5563" strokeWidth="1" strokeOpacity="0.6" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
            <div className="absolute bottom-2 right-2">
              <Badge variant="outline" className="bg-slate-900/80 text-xs border-slate-700">
                23 Verbindungen
              </Badge>
            </div>
          </div>
        </div>

        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          className="w-full border-slate-700 hover:bg-slate-700/50 text-slate-300"
        >
          {isExpanded ? "Weniger anzeigen" : "Deep Insight anfordern"}
        </Button>

        {isExpanded && (
          <div className="bg-slate-700/30 rounded-lg p-3 text-sm text-slate-300 animate-fadeIn">
            <p className="mb-2">
              Deine Erlebnisse zeigen ein wiederkehrendes Muster von Symbolen, die auf eine tiefere Verbindung zwischen
              deinem Traumleben und deinen Wachzuständen hindeuten.
            </p>
            <p>
              Keeper empfiehlt: Führe ein Traumtagebuch und notiere Symbole, die sowohl in Träumen als auch in
              Meditationen auftauchen.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
