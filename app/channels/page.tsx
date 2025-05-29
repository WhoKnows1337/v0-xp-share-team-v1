"use client"

import { ThemenChannels } from "@/components/nachrichten/themen-channels"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Hash, Users, TrendingUp, MessageCircle, Star } from "lucide-react"
import { useState } from "react"

export default function ChannelsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const popularChannels = [
    {
      id: "1",
      name: "Reise-Erlebnisse",
      description: "Teile deine Reiseabenteuer und entdecke neue Orte",
      members: 1247,
      messages: 3421,
      icon: "🌍",
      trending: true,
    },
    {
      id: "2",
      name: "Kulinarische Entdeckungen",
      description: "Food-Erlebnisse und Restaurantempfehlungen",
      members: 892,
      messages: 2156,
      icon: "🍽️",
      trending: false,
    },
    {
      id: "3",
      name: "Outdoor-Abenteuer",
      description: "Wandern, Klettern und Naturerlebnisse",
      members: 634,
      messages: 1789,
      icon: "🏔️",
      trending: true,
    },
    {
      id: "4",
      name: "Kunst & Kultur",
      description: "Museen, Konzerte und kulturelle Erlebnisse",
      members: 445,
      messages: 987,
      icon: "🎨",
      trending: false,
    },
    {
      id: "5",
      name: "Sport & Fitness",
      description: "Sportliche Aktivitäten und Fitness-Erlebnisse",
      members: 723,
      messages: 1543,
      icon: "⚽",
      trending: false,
    },
  ]

  const myChannels = [
    {
      id: "6",
      name: "Hamburg Locals",
      description: "Für alle Hamburger und Hamburg-Liebhaber",
      members: 234,
      messages: 567,
      icon: "🏙️",
      role: "Admin",
    },
    {
      id: "7",
      name: "Fotografie",
      description: "Teile deine besten Fotos und Fotografie-Tipps",
      members: 156,
      messages: 432,
      icon: "📸",
      role: "Member",
    },
  ]

  const filteredChannels = popularChannels.filter(
    (channel) =>
      channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      channel.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Themen-Channels</h1>
            <p className="text-muted-foreground">Entdecke und tritt Channels bei, die deine Interessen teilen</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Channel erstellen
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Channels durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="entdecken" className="space-y-6">
        <TabsList>
          <TabsTrigger value="entdecken" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Entdecken
          </TabsTrigger>
          <TabsTrigger value="meine" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Meine Channels
          </TabsTrigger>
          <TabsTrigger value="alle" className="flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Alle Channels
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entdecken" className="space-y-6">
          {/* Trending Channels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending Channels
              </CardTitle>
              <CardDescription>Die beliebtesten und aktivsten Channels dieser Woche</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularChannels
                  .filter((c) => c.trending)
                  .map((channel) => (
                    <Card key={channel.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="text-2xl">{channel.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold truncate">{channel.name}</h3>
                              {channel.trending && (
                                <Badge variant="secondary" className="text-xs">
                                  Trending
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{channel.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {channel.members.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {channel.messages.toLocaleString()}
                          </div>
                        </div>

                        <Button className="w-full" size="sm">
                          Beitreten
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Beliebte Kategorien</CardTitle>
              <CardDescription>Entdecke Channels nach Kategorien</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <span className="text-2xl">🌍</span>
                  <span className="text-sm">Reisen</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <span className="text-2xl">🍽️</span>
                  <span className="text-sm">Food</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <span className="text-2xl">🏔️</span>
                  <span className="text-sm">Outdoor</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <span className="text-2xl">🎨</span>
                  <span className="text-sm">Kultur</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meine" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myChannels.map((channel) => (
              <Card key={channel.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-2xl">{channel.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{channel.name}</h3>
                        <Badge variant={channel.role === "Admin" ? "default" : "secondary"} className="text-xs">
                          {channel.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{channel.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {channel.members.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {channel.messages.toLocaleString()}
                    </div>
                  </div>

                  <Button className="w-full" size="sm" variant="outline">
                    Channel öffnen
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alle" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChannels.map((channel) => (
              <Card key={channel.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-2xl">{channel.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{channel.name}</h3>
                        {channel.trending && (
                          <Badge variant="secondary" className="text-xs">
                            Trending
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{channel.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {channel.members.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {channel.messages.toLocaleString()}
                    </div>
                  </div>

                  <Button className="w-full" size="sm">
                    Beitreten
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Original ThemenChannels Component */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Channel-Übersicht</h2>
        <ThemenChannels />
      </div>
    </div>
  )
}
