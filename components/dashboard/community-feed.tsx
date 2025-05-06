"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ListFilter,
  Grid3X3,
  ThumbsUp,
  MessageSquare,
  Share2,
  Star,
  Network,
  Users,
  Calendar,
  MapPin,
  Sparkles,
  Info,
} from "lucide-react"

// Mock-Daten für den Community-Feed
const communityPosts = [
  {
    id: "1",
    user: {
      name: "MindExplorer",
      avatar: "/forest-explorer.png",
      level: 42,
    },
    title: "Meditation am Bergsee",
    category: "Achtsamkeit",
    date: "Heute, 14:30",
    location: "Alpen, Österreich",
    likes: 24,
    comments: 8,
    image: "/serene-meditation-garden.png",
    hasExperiencedToo: false,
    tags: ["meditation", "natur", "stille", "bewusstsein"],
    connections: ["2", "5", "8"],
  },
  {
    id: "2",
    user: {
      name: "DreamWalker",
      avatar: "/dream-traveler.png",
      level: 37,
    },
    title: "Luzides Träumen - Durchbruch",
    category: "Traumarbeit",
    date: "Gestern, 09:15",
    location: "Berlin",
    likes: 42,
    comments: 15,
    image: "/lucid-dream-ocean.png",
    hasExperiencedToo: true,
    tags: ["luzideträume", "bewusstsein", "traumwelt", "kontrolle"],
    connections: ["1", "3", "7"],
  },
  {
    id: "3",
    user: {
      name: "SeelenWanderer",
      avatar: "/philosophical-wanderer.png",
      level: 28,
    },
    title: "Synchronizität im Berufsleben",
    category: "Persönliches Wachstum",
    date: "Vor 2 Tagen",
    location: "Hamburg",
    likes: 18,
    comments: 7,
    image: "/synchronicity-career.png",
    hasExperiencedToo: false,
    tags: ["synchronizität", "karriere", "zufall", "bedeutung"],
    connections: ["2", "4", "6"],
  },
  {
    id: "4",
    user: {
      name: "AstralExplorer",
      avatar: "/confident-leader.png",
      level: 56,
    },
    title: "Außerkörperliche Erfahrung",
    category: "Bewusstseinserweiterung",
    date: "Vor 3 Tagen",
    location: "München",
    likes: 67,
    comments: 23,
    image: "/celestial-contemplation.png",
    hasExperiencedToo: false,
    tags: ["astralreise", "außerkörperlich", "bewusstsein", "seele"],
    connections: ["3", "5", "7"],
  },
  {
    id: "5",
    user: {
      name: "ZenMaster",
      avatar: "/peaceful-meditation-guide.png",
      level: 63,
    },
    title: "Tiefe Meditation und Heilung",
    category: "Achtsamkeit",
    date: "Vor 4 Tagen",
    location: "Dresden",
    likes: 89,
    comments: 31,
    image: "/meditation-experience.png",
    hasExperiencedToo: true,
    tags: ["meditation", "heilung", "energie", "chakren"],
    connections: ["1", "4", "8"],
  },
  {
    id: "6",
    user: {
      name: "Traumreisende",
      avatar: "/thoughtful-gaze.png",
      level: 41,
    },
    title: "Gemeinsamer Traum mit Schwester",
    category: "Traumarbeit",
    date: "Vor 5 Tagen",
    location: "Frankfurt",
    likes: 54,
    comments: 19,
    image: "/ethereal-aquatic-dream.png",
    hasExperiencedToo: false,
    tags: ["gemeinsamertraum", "familie", "telepathie", "verbindung"],
    connections: ["2", "3", "7"],
  },
  {
    id: "7",
    user: {
      name: "CosmicObserver",
      avatar: "/dream-traveler.png",
      level: 49,
    },
    title: "Quantenheilung und Zeitlinien",
    category: "Bewusstseinserweiterung",
    date: "Vor 6 Tagen",
    location: "Köln",
    likes: 72,
    comments: 27,
    image: "/diverging-paths.png",
    hasExperiencedToo: true,
    tags: ["quantenheilung", "zeitlinien", "parallelrealitäten", "heilung"],
    connections: ["2", "4", "6"],
  },
  {
    id: "8",
    user: {
      name: "WaldEntdecker",
      avatar: "/forest-explorer.png",
      level: 33,
    },
    title: "Lichtphänomene im Wald",
    category: "Paranormal",
    date: "Vor einer Woche",
    location: "Schwarzwald",
    likes: 46,
    comments: 18,
    image: "/ethereal-forest-glow.png",
    hasExperiencedToo: false,
    tags: ["lichtphänomene", "wald", "nacht", "unerklärlich"],
    connections: ["1", "5"],
  },
]

// Netzwerk-Daten für den 3D-Graph
const networkData = {
  nodes: communityPosts.map((post) => ({
    id: post.id,
    title: post.title,
    category: post.category,
    image: post.image,
    user: post.user.name,
    size: post.likes / 10 + 10, // Größe basierend auf Likes
    color: getCategoryColor(post.category),
  })),
  links: [
    // Verbindungen zwischen Erlebnissen
    { source: "1", target: "2", strength: 0.8, type: "ähnlich" },
    { source: "1", target: "5", strength: 0.9, type: "gleiche kategorie" },
    { source: "1", target: "8", strength: 0.7, type: "ähnlicher ort" },
    { source: "2", target: "3", strength: 0.6, type: "ähnlich" },
    { source: "2", target: "6", strength: 0.8, type: "gleiche kategorie" },
    { source: "2", target: "7", strength: 0.7, type: "gemeinsame tags" },
    { source: "3", target: "4", strength: 0.5, type: "ähnlich" },
    { source: "3", target: "6", strength: 0.6, type: "gemeinsame tags" },
    { source: "4", target: "5", strength: 0.7, type: "ähnlich" },
    { source: "4", target: "7", strength: 0.9, type: "gleiche kategorie" },
    { source: "5", target: "8", strength: 0.6, type: "gemeinsame tags" },
    { source: "6", target: "7", strength: 0.8, type: "ähnlich" },
    // Verbindungen zu deinen eigenen Erlebnissen
    { source: "2", target: "eigen1", strength: 0.9, type: "du hattest das auch" },
    { source: "5", target: "eigen1", strength: 0.7, type: "du hattest das auch" },
    { source: "7", target: "eigen2", strength: 0.8, type: "du hattest das auch" },
  ],
  userNodes: [
    { id: "eigen1", title: "Meine Meditation", category: "Achtsamkeit", size: 15, color: "#10b981" },
    { id: "eigen2", title: "Meine Zeitlinienarbeit", category: "Bewusstseinserweiterung", size: 15, color: "#8b5cf6" },
  ],
}

// Hilfsfunktion für Kategorie-Farben
function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    Achtsamkeit: "#10b981", // Grün
    Traumarbeit: "#8b5cf6", // Lila
    "Persönliches Wachstum": "#f59e0b", // Gelb
    Bewusstseinserweiterung: "#3b82f6", // Blau
    Paranormal: "#6b7280", // Grau
    default: "#ec4899", // Pink (Fallback)
  }
  return colorMap[category] || colorMap.default
}

const keeperRecommendations = [
  {
    id: "1",
    title: "Meditation im Wald",
    category: "Achtsamkeit",
    image: "/ethereal-forest-glow.png",
    match: "98% Match",
  },
  {
    id: "2",
    title: "Astralreisen Grundlagen",
    category: "Bewusstseinserweiterung",
    image: "/celestial-contemplation.png",
    match: "92% Match",
  },
  {
    id: "3",
    title: "Traumdeutung Workshop",
    category: "Traumarbeit",
    image: "/diverging-paths.png",
    match: "87% Match",
  },
]

interface CommunityFeedProps {
  onQuestComplete?: () => void
}

export function CommunityFeed({ onQuestComplete }: CommunityFeedProps) {
  const [viewMode, setViewMode] = useState<"list" | "graph">("list")
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [isGraphInitialized, setIsGraphInitialized] = useState(false)
  const graphContainerRef = useRef<HTMLDivElement>(null)

  const filteredPosts =
    activeCategory === "all"
      ? communityPosts
      : communityPosts.filter((post) => post.category.toLowerCase() === activeCategory.toLowerCase())

  const handleMeTooClick = (postId: string) => {
    // Simuliere Quest-Abschluss nach "Me Too"-Klick
    if (postId === "1" && onQuestComplete) {
      setTimeout(() => {
        onQuestComplete()
      }, 500)
    }
  }

  // Simuliere die Initialisierung des 3D-Graphen
  useEffect(() => {
    if (viewMode === "graph" && !isGraphInitialized && graphContainerRef.current) {
      const timer = setTimeout(() => {
        setIsGraphInitialized(true)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [viewMode, isGraphInitialized])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Community Feed</h2>
        <div className="flex items-center gap-2">
          <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="bg-slate-700">
              <TabsTrigger value="all" className="data-[state=active]:bg-slate-600">
                Alle
              </TabsTrigger>
              <TabsTrigger value="achtsamkeit" className="data-[state=active]:bg-slate-600">
                Achtsamkeit
              </TabsTrigger>
              <TabsTrigger value="traumarbeit" className="data-[state=active]:bg-slate-600">
                Traumarbeit
              </TabsTrigger>
              <TabsTrigger
                value="bewusstseinserweiterung"
                className="data-[state=active]:bg-slate-600 hidden md:inline-flex"
              >
                Bewusstsein
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon" className="bg-slate-700 border-slate-600">
            <ListFilter className="h-4 w-4" />
          </Button>
          <Tabs defaultValue={viewMode} onValueChange={(value) => setViewMode(value as "list" | "graph")}>
            <TabsList className="bg-slate-700">
              <TabsTrigger value="list" className="data-[state=active]:bg-slate-600">
                <Grid3X3 className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="graph" className="data-[state=active]:bg-slate-600">
                <Network className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "list" ? (
          <motion.div
            key="list-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 text-white overflow-hidden group">
                  <div className="relative">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
                      <div className="flex items-center mb-2">
                        <img
                          src={post.user.avatar || "/placeholder.svg"}
                          alt={post.user.name}
                          className="w-8 h-8 rounded-full border-2 border-emerald-500 mr-2"
                        />
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium">{post.user.name}</span>
                            <Badge variant="outline" className="ml-2 bg-slate-700/50 text-xs">
                              Lvl {post.user.level}
                            </Badge>
                          </div>
                          <div className="flex items-center text-xs text-slate-300">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{post.date}</span>
                            <span className="mx-1">•</span>
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{post.location}</span>
                          </div>
                        </div>
                      </div>
                      <h3 className="text-lg font-medium">{post.title}</h3>
                      <Badge className="self-start mt-1 bg-emerald-600/80 hover:bg-emerald-600 border-none">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-slate-700/50 text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-300 hover:text-white hover:bg-slate-700/50"
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {post.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-300 hover:text-white hover:bg-slate-700/50"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {post.comments}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-300 hover:text-white hover:bg-slate-700/50"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant={post.hasExperiencedToo ? "default" : "outline"}
                        size="sm"
                        className={
                          post.hasExperiencedToo
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "border-emerald-600/50 text-emerald-400 hover:bg-emerald-900/20"
                        }
                        onClick={() => handleMeTooClick(post.id)}
                      >
                        <Users className="h-4 w-4 mr-1" />
                        {post.hasExperiencedToo ? "Auch erlebt" : "Ich auch!"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="graph-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 text-white">
              <CardContent className="p-4">
                <div
                  ref={graphContainerRef}
                  className="relative rounded-lg overflow-hidden"
                  style={{ height: "500px" }}
                >
                  {!isGraphInitialized ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/80">
                      <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-emerald-500 animate-spin mb-4"></div>
                      <p className="text-slate-300">Erlebnis-Netzwerk wird geladen...</p>
                    </div>
                  ) : (
                    <div className="absolute inset-0">
                      {/* Simulierter 3D-Graph mit SVG */}
                      <svg width="100%" height="100%" viewBox="0 0 800 500" className="bg-slate-900/80">
                        {/* Verbindungen */}
                        {networkData.links.map((link, i) => (
                          <line
                            key={`link-${i}`}
                            x1={100 + Math.random() * 600}
                            y1={100 + Math.random() * 300}
                            x2={100 + Math.random() * 600}
                            y2={100 + Math.random() * 300}
                            stroke={link.type.includes("du") ? "#f59e0b" : "#4b5563"}
                            strokeWidth={link.strength * 3}
                            strokeOpacity={0.6}
                          />
                        ))}

                        {/* Knoten für Community-Erlebnisse */}
                        {networkData.nodes.map((node, i) => (
                          <g
                            key={`node-${i}`}
                            transform={`translate(${100 + Math.random() * 600}, ${100 + Math.random() * 300})`}
                          >
                            <circle r={node.size} fill={node.color} opacity={0.8} stroke="#fff" strokeWidth={1} />
                            <text textAnchor="middle" y={node.size + 15} fill="white" fontSize="10px">
                              {node.title.length > 15 ? node.title.substring(0, 15) + "..." : node.title}
                            </text>
                          </g>
                        ))}

                        {/* Knoten für eigene Erlebnisse */}
                        {networkData.userNodes.map((node, i) => (
                          <g
                            key={`user-node-${i}`}
                            transform={`translate(${100 + Math.random() * 600}, ${100 + Math.random() * 300})`}
                          >
                            <circle r={node.size} fill={node.color} opacity={0.9} stroke="#f59e0b" strokeWidth={2} />
                            <text
                              textAnchor="middle"
                              y={node.size + 15}
                              fill="#f59e0b"
                              fontSize="10px"
                              fontWeight="bold"
                            >
                              {node.title}
                            </text>
                          </g>
                        ))}
                      </svg>

                      {/* Legende */}
                      <div className="absolute bottom-4 right-4 bg-slate-800/90 p-3 rounded-lg border border-slate-700">
                        <h4 className="text-sm font-medium mb-2">Legende:</h4>
                        <div className="flex items-center mb-1">
                          <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                          <span className="text-xs">Achtsamkeit</span>
                        </div>
                        <div className="flex items-center mb-1">
                          <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                          <span className="text-xs">Traumarbeit</span>
                        </div>
                        <div className="flex items-center mb-1">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                          <span className="text-xs">Bewusstseinserweiterung</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full border-2 border-amber-500 mr-2"></div>
                          <span className="text-xs">Deine Erlebnisse</span>
                        </div>
                      </div>

                      {/* Info-Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-4 right-4 bg-slate-800/90 border-slate-700"
                      >
                        <Info className="h-4 w-4 mr-1" />
                        <span className="text-xs">Wie funktioniert das?</span>
                      </Button>
                    </div>
                  )}
                </div>

                {isGraphInitialized && (
                  <div className="mt-4 bg-slate-700/50 p-3 rounded-lg">
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <Sparkles className="h-4 w-4 text-amber-400 mr-2" />
                      Netzwerk-Insights
                    </h3>
                    <div className="text-sm text-slate-300">
                      Deine Erlebnisse im Bereich "Achtsamkeit" und "Bewusstseinserweiterung" zeigen starke Verbindungen
                      zu 3 Community-Erlebnissen. Entdecke ähnliche Erfahrungen, indem du auf die Knoten klickst.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keeper-Empfehlungen */}
      <div className="mt-6">
        <div className="flex items-center mb-3">
          <Star className="h-5 w-5 text-amber-400 mr-2" />
          <h3 className="text-lg font-medium text-white">Keeper empfiehlt für dich</h3>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
          {keeperRecommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="min-w-[240px]"
            >
              <Card className="bg-slate-800/50 border-slate-700 text-white h-full">
                <div className="relative h-32">
                  <img
                    src={rec.image || "/placeholder.svg"}
                    alt={rec.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-amber-600/90 hover:bg-amber-600 border-none">{rec.match}</Badge>
                  </div>
                </div>
                <CardContent className="p-3">
                  <h4 className="font-medium">{rec.title}</h4>
                  <p className="text-sm text-slate-400">{rec.category}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
