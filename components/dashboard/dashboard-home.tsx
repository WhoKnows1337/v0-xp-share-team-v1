"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import {
  Bell,
  Calendar,
  ChevronRight,
  Clock,
  Heart,
  MessageSquare,
  Plus,
  Share2,
  Star,
  TrendingUp,
  Trophy,
  Users,
  PartyPopper,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { openErlebnisWizard } from "../erlebnis-wizard-modal"
import { UserLink } from "@/components/user-link"
import { useRouter } from "next/navigation"
import { InviteCard } from "@/components/referral/invite-card"

// Mock-Daten für den personalisierten Feed
const personalizedFeed = [
  {
    id: "1",
    title: "Luzider Traum: Fliegen über den Ozean",
    category: "Träume",
    subcategory: "Luzide Träume",
    author: {
      name: "maria_schmidt",
      username: "maria_schmidt",
      avatar: "/serene-gaze.png",
    },
    preview: "/deep-sea-fantasy.png",
    excerpt:
      "Gestern hatte ich einen unglaublich lebhaften luziden Traum, in dem ich über einen endlosen Ozean flog...",
    likes: 12,
    comments: 5,
    date: "vor 2 Stunden",
    erlebnisId: "1", // Geändert von "erlebnis-1" zu "1"
  },
  {
    id: "2",
    title: "Meditation führte zu tiefem Bewusstseinszustand",
    category: "Meditation",
    subcategory: "Tiefenmeditation",
    author: {
      name: "Traumreisende",
      username: "Traumreisende",
      avatar: "/thoughtful-gaze.png",
    },
    preview: "/serene-meditation-garden.png",
    excerpt:
      "Nach 30 Minuten Meditation erreichte ich einen Zustand, in dem ich mich vollständig von meinem Körper gelöst fühlte...",
    likes: 24,
    comments: 8,
    date: "vor 5 Stunden",
    erlebnisId: "2", // Geändert von "erlebnis-2" zu "2"
  },
  {
    id: "3",
    title: "Unerwartete Synchronizität beim Jobwechsel",
    category: "Synchronizitäten",
    subcategory: "Berufsleben",
    author: {
      name: "AstralExplorer",
      username: "AstralExplorer",
      avatar: "/confident-leader.png",
    },
    preview: "/Crossroads-of-Change.png",
    excerpt:
      "Als ich über einen Jobwechsel nachdachte, erhielt ich plötzlich eine E-Mail von einem Unternehmen, das genau meinen Traumjob anbot...",
    likes: 18,
    comments: 7,
    date: "vor 1 Tag",
    erlebnisId: "3", // Geändert von "erlebnis-3" zu "3"
  },
  {
    id: "4",
    title: "Mystische Begegnung im Wald",
    category: "Natur",
    subcategory: "Mystik",
    author: {
      name: "WaldEntdecker",
      username: "WaldEntdecker",
      avatar: "/ethereal-forest-glow.png",
    },
    preview: "/ethereal-forest-glow.png",
    excerpt: "Eine unerwartete Begegnung während einer Wanderung im Wald, die meine Perspektive veränderte...",
    likes: 42,
    comments: 8,
    date: "vor 3 Tagen",
    erlebnisId: "4", // Geändert von "erlebnis-4" zu "4"
  },
]

// Mock-Daten für Statistik-Highlights
const statisticHighlights = [
  {
    id: "1",
    title: "Luzide Träume im Trend",
    description: "Diese Woche wurden 27 neue luzide Träume geteilt, 40% mehr als letzte Woche.",
    icon: <TrendingUp className="h-5 w-5 text-blue-400" />,
  },
  {
    id: "2",
    title: "Häufiges Symbol: Tunnel-Licht",
    description: "5 neue Nahtoderfahrungen diese Woche, davon 3 mit dem Symbol 'Tunnel-Licht'.",
    icon: <Star className="h-5 w-5 text-yellow-400" />,
  },
  {
    id: "3",
    title: "Beliebte Kategorie: Meditation",
    description: "Meditationserfahrungen erhielten durchschnittlich 15 Likes, mehr als jede andere Kategorie.",
    icon: <Heart className="h-5 w-5 text-red-400" />,
  },
]

// Mock-Daten für Community-Aktivität
const communityActivity = [
  {
    id: "1",
    text: "4 neue Kommentare zu deinen Beiträgen",
    icon: <MessageSquare className="h-4 w-4 text-blue-400" />,
  },
  {
    id: "2",
    text: "Dein Beitrag 'Meditation am See' wurde 15 Mal geliked",
    icon: <Heart className="h-4 w-4 text-red-400" />,
  },
  {
    id: "3",
    text: "3 Personen haben deine Erlebnisse geteilt",
    icon: <Share2 className="h-4 w-4 text-green-400" />,
  },
]

// Mock-Daten für Leaderboard
const leaderboard = [
  { rank: 1, name: "Traumreisende", username: "Traumreisende", points: 1250, avatar: "/thoughtful-gaze.png" },
  { rank: 2, name: "maria_schmidt", username: "maria_schmidt", points: 980, avatar: "/serene-gaze.png" },
  { rank: 3, name: "AstralExplorer", username: "AstralExplorer", points: 870, avatar: "/confident-leader.png" },
  { rank: 4, name: "WaldEntdecker", username: "WaldEntdecker", points: 650, avatar: "/ethereal-forest-glow.png" },
]

// Mock-Daten für Events
const events = [
  {
    id: "1",
    title: "Vollmond-Meditation",
    date: "Heute, 21:00 Uhr",
    participants: 24,
  },
  {
    id: "2",
    title: "Traumdeutungs-Workshop",
    date: "Morgen, 18:30 Uhr",
    participants: 12,
  },
]

export function DashboardHome({ initialTab = "overview" }: { initialTab?: string }) {
  const [userName, setUserName] = useState("Alice")
  const [feedType, setFeedType] = useState("empfehlungen")
  const [lastActivity, setLastActivity] = useState("vor 3 Tagen")
  const [hasSharedExperiences, setHasSharedExperiences] = useState(true)
  const [daysSinceLastExperience, setDaysSinceLastExperience] = useState(30)
  const router = useRouter()

  // Verwende die openErlebnisWizard-Funktion statt des Hooks
  const handleNewExperience = () => {
    console.log("Dashboard: Öffne ErlebnisWizard")
    openErlebnisWizard()
  }

  const handleErlebnisClick = (item: any) => {
    // Navigiere zur Erlebnis-Detailseite
    if (item.erlebnisId) {
      router.push(`/erlebnis/${item.erlebnisId}`)
    } else if (item.id) {
      // Fallback, falls erlebnisId nicht vorhanden ist
      router.push(`/erlebnis/${item.id}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Begrüßung */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Willkommen zurück, {userName}!</h1>
          <p className="text-slate-400">Dein letzter Besuch war {lastActivity}</p>
        </div>
        <div className="flex gap-2">
          {/* Referral-Button hinzufügen */}
          <Button
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
            onClick={() => router.push("/referrals")}
          >
            <PartyPopper className="mr-2 h-4 w-4" />
            Freunde einladen
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            onClick={handleNewExperience}
          >
            <Plus className="mr-2 h-4 w-4" />
            Neues Erlebnis
          </Button>
        </div>
      </motion.div>

      {/* Hauptinhalt - zweispaltiges Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Linke Spalte - Hauptfeed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Feed-Tabs */}
          <Card className="bg-slate-800/50 border-slate-700 text-white overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">Mein Feed</CardTitle>
                <Tabs defaultValue={feedType} onValueChange={setFeedType}>
                  <TabsList className="bg-slate-700">
                    <TabsTrigger value="empfehlungen" className="data-[state=active]:bg-slate-600">
                      Empfehlungen
                    </TabsTrigger>
                    <TabsTrigger value="neueste" className="data-[state=active]:bg-slate-600">
                      Neueste
                    </TabsTrigger>
                    <TabsTrigger value="beliebt" className="data-[state=active]:bg-slate-600">
                      Beliebt
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <CardDescription className="text-slate-400">
                Für dich interessant: 3 neue luzide Träume diese Woche
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {personalizedFeed.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-700/70 rounded-lg overflow-hidden border border-slate-600"
                >
                  <div className="flex flex-col md:flex-row">
                    <div
                      className="w-full md:w-1/3 h-48 md:h-auto relative cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => handleErlebnisClick(item)}
                    >
                      <Image src={item.preview || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                      <Badge className="absolute top-2 left-2 bg-blue-600 hover:bg-blue-700">{item.category}</Badge>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center mb-2">
                          <UserLink
                            username={item.author.username}
                            avatar={item.author.avatar}
                            showName={true}
                            size="sm"
                          />
                          <span className="mx-2 text-slate-500">•</span>
                          <span className="text-xs text-slate-400">{item.date}</span>
                        </div>
                        <h3
                          className="text-lg font-semibold mb-2 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => handleErlebnisClick(item)}
                        >
                          {item.title}
                        </h3>
                        <p className="text-slate-300 text-sm line-clamp-2">{item.excerpt}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center text-slate-300 hover:text-red-400 transition-colors">
                            <Heart className="h-4 w-4 mr-1" />
                            <span className="text-xs">{item.likes}</span>
                          </button>
                          <button className="flex items-center text-slate-300 hover:text-blue-400 transition-colors">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            <span className="text-xs">{item.comments}</span>
                          </button>
                          <button className="flex items-center text-slate-300 hover:text-green-400 transition-colors">
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
            <CardFooter className="border-t border-slate-700 pt-4">
              <Button variant="ghost" className="w-full text-slate-300 hover:text-white hover:bg-slate-700/50">
                Mehr anzeigen
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Community-Aktivität */}
          <Card className="bg-slate-800/50 border-slate-700 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl font-bold flex items-center">
                  <Bell className="mr-2 h-5 w-5 text-blue-400" />
                  Community-Aktivität
                </CardTitle>
                <CardDescription className="text-slate-400">Updates seit deinem letzten Besuch</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {communityActivity.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center p-3 bg-slate-700/70 rounded-lg border border-slate-600"
                  >
                    <div className="bg-slate-600/50 p-2 rounded-full mr-3">{activity.icon}</div>
                    <p className="text-sm">{activity.text}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA für Beitrag erstellen, wenn wenige oder keine Erlebnisse */}
          {!hasSharedExperiences && (
            <Card className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border-blue-700 text-white">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-bold mb-2">Teile dein erstes Erlebnis!</h3>
                    <p className="text-slate-300">
                      Beginne deine Reise und teile deine außergewöhnlichen Erfahrungen mit der Community.
                    </p>
                  </div>
                  <Button className="bg-white text-blue-900 hover:bg-slate-100" onClick={handleNewExperience}>
                    <Plus className="mr-2 h-4 w-4" />
                    Erlebnis erstellen
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Erinnerung, wenn lange kein Erlebnis geteilt wurde */}
          {hasSharedExperiences && daysSinceLastExperience > 14 && (
            <Card className="bg-slate-800/50 border-slate-700 text-white">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-bold mb-2">
                      Dein letztes Erlebnis liegt {daysSinceLastExperience} Tage zurück
                    </h3>
                    <p className="text-slate-300">Hast du seitdem etwas Neues geträumt oder erlebt?</p>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    onClick={handleNewExperience}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Neues Erlebnis
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Rechte Spalte - Statistiken, Trends und sekundäre Panels */}
        <div className="space-y-6">
          {/* Referral-Karte hinzufügen */}
          <InviteCard />

          {/* Statistik-Highlight / Muster der Woche */}
          <Card className="bg-slate-800/50 border-slate-700 text-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-blue-400" />
                Trends & Muster
              </CardTitle>
              <CardDescription className="text-slate-400">Spannende Entwicklungen in der Community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {statisticHighlights.map((stat) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-3 bg-slate-700/70 rounded-lg border border-slate-600"
                >
                  <div className="flex items-center mb-2">
                    <div className="bg-slate-600/50 p-2 rounded-full mr-2">{stat.icon}</div>
                    <h4 className="font-medium">{stat.title}</h4>
                  </div>
                  <p className="text-sm text-slate-300">{stat.description}</p>
                </motion.div>
              ))}
            </CardContent>
            <CardFooter className="border-t border-slate-700 pt-4">
              <Button variant="ghost" className="w-full text-slate-300 hover:text-white hover:bg-slate-700/50">
                Alle Statistiken anzeigen
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Leaderboard */}
          <Card className="bg-slate-800/50 border-slate-700 text-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center">
                <Trophy className="mr-2 h-5 w-5 text-yellow-400" />
                Leaderboard
              </CardTitle>
              <CardDescription className="text-slate-400">Top-Nutzer dieser Woche</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboard.map((user) => (
                <motion.div
                  key={user.rank}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: user.rank * 0.1 }}
                  className="flex items-center justify-between p-3 bg-slate-700/70 rounded-lg border border-slate-600"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${
                        user.rank === 1 ? "bg-yellow-500" : user.rank === 2 ? "bg-slate-300" : "bg-amber-700"
                      }`}
                    >
                      <span className="font-bold text-sm">{user.rank}</span>
                    </div>
                    <UserLink username={user.username} avatar={user.avatar} showName={true} size="md" />
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 mr-1" />
                    <span className="text-sm">{user.points}</span>
                  </div>
                </motion.div>
              ))}
            </CardContent>
            <CardFooter className="border-t border-slate-700 pt-4">
              <Button variant="ghost" className="w-full text-slate-300 hover:text-white hover:bg-slate-700/50">
                Vollständiges Leaderboard
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Events */}
          <Card className="bg-slate-800/50 border-slate-700 text-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-green-400" />
                Kommende Events
              </CardTitle>
              <CardDescription className="text-slate-400">Nimm an Community-Events teil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-3 bg-slate-700/70 rounded-lg border border-slate-600"
                >
                  <h4 className="font-medium mb-1">{event.title}</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-slate-300">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-300">
                      <Users className="h-3 w-3 mr-1" />
                      <span>{event.participants} Teilnehmer</span>
                    </div>
                  </div>
                  <Button className="w-full mt-2 bg-green-600/50 hover:bg-green-600 text-white">Teilnehmen</Button>
                </motion.div>
              ))}
            </CardContent>
            <CardFooter className="border-t border-slate-700 pt-4">
              <Button variant="ghost" className="w-full text-slate-300 hover:text-white hover:bg-slate-700/50">
                Alle Events anzeigen
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Fortschritt */}
          <Card className="bg-slate-800/50 border-slate-700 text-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Dein Fortschritt</CardTitle>
              <CardDescription className="text-slate-400">Nächstes Level: Traumdeuter (450/500 XP)</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress
                value={90}
                className="h-2 bg-slate-700"
                indicatorStyle={{
                  background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
                }}
              />
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Geteilte Erlebnisse</span>
                  <span className="text-blue-400">12/15</span>
                </div>
                <Progress
                  value={80}
                  className="h-1.5 bg-slate-700"
                  indicatorStyle={{
                    background: "#3b82f6",
                  }}
                />
                <div className="flex justify-between text-sm">
                  <span>Kommentare</span>
                  <span className="text-green-400">24/20</span>
                </div>
                <Progress
                  value={100}
                  className="h-1.5 bg-slate-700"
                  indicatorStyle={{
                    background: "#10b981",
                  }}
                />
                <div className="flex justify-between text-sm">
                  <span>Erhaltene Likes</span>
                  <span className="text-purple-400">85/100</span>
                </div>
                <Progress
                  value={85}
                  className="h-1.5 bg-slate-700"
                  indicatorStyle={{
                    background: "#8b5cf6",
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
