"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, BarChart, PieChart, Network, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface NexusInsightsProps {
  filters: string[]
}

export function NexusInsights({ filters }: NexusInsightsProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("stats")

  return (
    <div
      className={`border-b border-gray-800 bg-gray-900 transition-all duration-300 ${isCollapsed ? "h-10" : "h-64"}`}
    >
      <div className="flex items-center justify-between px-4 h-10 border-b border-gray-800">
        <h3 className="text-sm font-medium flex items-center">
          <Zap className="h-4 w-4 mr-2 text-cyan-400" />
          KI-Insights
        </h3>
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8">
          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="p-4 h-[calc(100%-2.5rem)] overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="mb-4">
              <TabsTrigger value="stats" className="flex items-center">
                <BarChart className="h-4 w-4 mr-2" />
                Statistiken
              </TabsTrigger>
              <TabsTrigger value="correlations" className="flex items-center">
                <Network className="h-4 w-4 mr-2" />
                Korrelationen
              </TabsTrigger>
              <TabsTrigger value="explain" className="flex items-center">
                <PieChart className="h-4 w-4 mr-2" />
                Erklärung
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="h-[calc(100%-3rem)]">
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium mb-2">Kategorieverteilung</h4>
                  <div className="h-[calc(100%-2rem)] flex items-center justify-center">
                    {/* Hier würde ein echtes Diagramm stehen */}
                    <div className="w-32 h-32 rounded-full border-8 border-cyan-400 relative">
                      <div
                        className="absolute inset-0 border-8 border-pink-400 rounded-full"
                        style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)" }}
                      ></div>
                      <div
                        className="absolute inset-0 border-8 border-yellow-400 rounded-full"
                        style={{ clipPath: "polygon(0 50%, 100% 50%, 100% 70%, 0 70%)" }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium mb-2">Zeitliche Verteilung</h4>
                  <div className="h-[calc(100%-2rem)] flex items-center justify-center">
                    {/* Hier würde ein echtes Diagramm stehen */}
                    <div className="w-full h-24 flex items-end space-x-1">
                      {Array(12)
                        .fill(0)
                        .map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-cyan-400"
                            style={{ height: `${20 + Math.random() * 80}%` }}
                          ></div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="correlations" className="h-[calc(100%-3rem)]">
              <div className="bg-gray-800 rounded-lg p-4 h-full">
                <h4 className="text-sm font-medium mb-4">Häufige Korrelationen</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-cyan-500/20 text-cyan-400">Luzide Träume</Badge>
                  <Badge className="bg-pink-500/20 text-pink-400">Synchronizität</Badge>
                  <Badge className="bg-yellow-500/20 text-yellow-400">Meditation</Badge>
                  <Badge className="bg-green-500/20 text-green-400">Naturerlebnisse</Badge>
                  <Badge className="bg-purple-500/20 text-purple-400">Déjà-vu</Badge>
                  <Badge className="bg-blue-500/20 text-blue-400">Intuition</Badge>
                  <Badge className="bg-red-500/20 text-red-400">Emotionale Intensität</Badge>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="explain" className="h-[calc(100%-3rem)]">
              <div className="bg-gray-800 rounded-lg p-4 h-full flex flex-col">
                <p className="text-sm mb-4">
                  Die Analyse zeigt eine signifikante Häufung von luziden Traumerlebnissen in urbanen Gebieten Japans,
                  besonders in Tokyo. Diese Erlebnisse korrelieren mit erhöhter Mondaktivität und treten vermehrt
                  während der Vollmondphase auf.
                </p>
                <div className="mt-auto">
                  <Button className="w-full">Deep Insight (20 Mana)</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
