"use client"

import { useState } from "react"
import { Heart, MessageSquare, Share2, Star, TrendingUp } from "lucide-react"
import { openErlebnisWizard } from "@/components/erlebnis-wizard-modal"
import { useRouter } from "next/navigation"
import { DashboardOverview } from "./dashboard-overview"
import { MeineErlebnisse } from "./meine-erlebnisse"
import { AktivitaetsFeed } from "./aktivitaets-feed"
import { GeteilteErlebnisse } from "./geteilte-erlebnisse"
import { DashboardHeader } from "./dashboard-header"
import { DashboardReferralBanner } from "../referral/dashboard-referral-banner"

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

interface DashboardHomeProps {
  initialTab?: "overview" | "my-experiences" | "shared-experiences" | "activity"
}

export function DashboardHome({ initialTab = "overview" }: DashboardHomeProps) {
  const [userName, setUserName] = useState("Alice")
  const [feedType, setFeedType] = useState("empfehlungen")
  const [lastActivity, setLastActivity] = useState("vor 3 Tagen")
  const [hasSharedExperiences, setHasSharedExperiences] = useState(true)
  const [daysSinceLastExperience, setDaysSinceLastExperience] = useState(30)
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(initialTab)

  // Verwende die openErlebnisWizard-Funktion statt des Hooks
  const handleNewExperience = () => {
    console.log("Dashboard: Öffne ErlebnisWizard")

    // Rufe die Funktion direkt auf
    openErlebnisWizard()

    // Alternativ, löse das Event direkt aus
    if (typeof window !== "undefined") {
      console.log("Dashboard: Löse Event 'openErlebnisWizard' aus")
      const event = new CustomEvent("openErlebnisWizard")
      window.dispatchEvent(event)
    }
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
      <DashboardReferralBanner />
      <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "overview" && <DashboardOverview />}
      {activeTab === "my-experiences" && <MeineErlebnisse />}
      {activeTab === "shared-experiences" && <GeteilteErlebnisse />}
      {activeTab === "activity" && <AktivitaetsFeed />}
    </div>
  )
}
