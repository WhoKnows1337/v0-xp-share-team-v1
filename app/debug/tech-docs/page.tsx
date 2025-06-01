"use client"

import { useState, useRef, useEffect } from "react"
import { FileText, Download, Copy, Search, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

// Mock-Daten für die Demo, ersetzen durch echte Daten oder API-Aufrufe
const mockSupabaseStatus = { connected: true, version: "15.1.0.118" }
const mockOpenAIStatus = { accessible: true, model: "gpt-4o-mini" }
const mockStorageStatus = { readable: true, writable: true }
const mockRealtimeStatus = { connected: true, channels: 5 }

const checkSupabaseConnection = async () => mockSupabaseStatus
const checkOpenAIConnection = async () => mockOpenAIStatus
const checkStorageAccess = async () => mockStorageStatus
const checkRealtimeConnection = async () => mockRealtimeStatus

export default function TechnicalDocumentation() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeSection, setActiveSection] = useState("overview")
  const contentRef = useRef<HTMLDivElement>(null)

  const docSections = [
    { id: "overview", title: "Projektübersicht" },
    { id: "architecture", title: "Architektur" },
    { id: "tech-stack", title: "Technologie-Stack" },
    { id: "database", title: "Datenbankschema" },
    { id: "api", title: "API-Dokumentation" },
    { id: "auth", title: "Authentifizierung & Autorisierung" },
    { id: "features", title: "Core Features" },
    { id: "services", title: "Services & Utilities" },
    { id: "frontend", title: "Frontend-Architektur" },
    { id: "ai", title: "KI-Integration" },
    { id: "realtime", title: "Real-time Features" },
    { id: "offline", title: "Offline-Funktionalität" },
    { id: "performance", title: "Performance & Optimierung" },
    { id: "deployment", title: "Deployment & CI/CD" },
    { id: "debugging", title: "Debugging & Entwicklung" },
    { id: "testing", title: "Testing-Strategie" },
    { id: "security", title: "Sicherheitsaspekte" },
    { id: "conclusion", title: "Fazit & Ausblick" },
  ]

  const filteredSections = docSections.filter((section) =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
      setActiveSection(sectionId)
      // Update URL hash
      if (history.pushState) {
        history.pushState(null, "", `#${sectionId}`)
      } else {
        location.hash = `#${sectionId}`
      }
    }
  }

  useEffect(() => {
    const hash = window.location.hash.replace("#", "")
    if (hash && docSections.some((s) => s.id === hash)) {
      scrollToSection(hash)
    }
  }, [])

  const copyToClipboard = async () => {
    try {
      let textToCopy = `XP Share - Technische Projektdokumentation\n\n`
      docSections.forEach((section) => {
        const sectionElement = document.getElementById(section.id)
        if (sectionElement) {
          textToCopy += `## ${section.title}\n\n${sectionElement.innerText}\n\n`
        }
      })

      await navigator.clipboard.writeText(textToCopy)
      toast({
        title: "In Zwischenablage kopiert",
        description: "Die technische Dokumentation wurde in die Zwischenablage kopiert.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Fehler beim Kopieren:", error)
      toast({
        title: "Fehler beim Kopieren",
        description: "Die Dokumentation konnte nicht kopiert werden.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const downloadDocumentation = () => {
    let markdownContent = `# XP Share - Technische Projektdokumentation\n\n`
    docSections.forEach((section) => {
      const sectionElement = document.getElementById(section.id)
      if (sectionElement) {
        // Basic HTML to Markdown conversion (can be improved)
        let sectionHTML = sectionElement.innerHTML
        // Replace h2, h3, h4 with markdown equivalents
        sectionHTML = sectionHTML.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n")
        sectionHTML = sectionHTML.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n")
        sectionHTML = sectionHTML.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n")
        // Replace p with newlines
        sectionHTML = sectionHTML.replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n")
        // Replace ul/ol and li
        sectionHTML = sectionHTML.replace(
          /<ul[^>]*>([\s\S]*?)<\/ul>/gi,
          (match, p1) => p1.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n") + "\n",
        )
        sectionHTML = sectionHTML.replace(
          /<ol[^>]*>([\s\S]*?)<\/ol>/gi,
          (match, p1) =>
            p1.replace(/<li[^>]*>(.*?)<\/li>/gi, (liMatch, liContent, index) => `${index + 1}. ${liContent}\n`) + "\n",
        )
        // Replace pre with code blocks
        sectionHTML = sectionHTML.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, "```\n$1\n```\n\n")
        sectionHTML = sectionHTML.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, "```\n$1\n```\n\n")
        // Replace strong/b with **
        sectionHTML = sectionHTML.replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi, "**$2**")
        // Replace em/i with *
        sectionHTML = sectionHTML.replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gi, "*$2*")
        // Strip remaining HTML tags
        sectionHTML = sectionHTML.replace(/<[^>]+>/g, "")
        // Decode HTML entities
        const tempElem = document.createElement("textarea")
        tempElem.innerHTML = sectionHTML
        sectionHTML = tempElem.value

        markdownContent += `## ${section.title}\n\n${sectionHTML.trim()}\n\n`
      }
    })

    const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "XP_Share_Technical_Documentation.md"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const AvailabilityCheckerContent = () => {
    const [status, setStatus] = useState<Record<string, any>>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const checkAvailability = async () => {
        setLoading(true)
        const checks = {
          supabase: await checkSupabaseConnection(),
          openai: await checkOpenAIConnection(),
          storage: await checkStorageAccess(),
          realtime: await checkRealtimeConnection(),
        }
        setStatus(checks)
        setLoading(false)
      }
      checkAvailability()
    }, [])

    if (loading) return <p>Prüfe Systemverfügbarkeit...</p>

    return (
      <div className="space-y-3">
        {Object.entries(status).map(([service, data]) => (
          <div key={service} className="flex items-center gap-2">
            <span className="font-semibold capitalize">{service}:</span>
            {service === "supabase" && (
              <Badge variant={data.connected ? "default" : "destructive"}>
                {data.connected ? `Verbunden (v${data.version})` : "Nicht Verbunden"}
              </Badge>
            )}
            {service === "openai" && (
              <Badge variant={data.accessible ? "default" : "destructive"}>
                {data.accessible ? `Erreichbar (Modell: ${data.model})` : "Nicht Erreichbar"}
              </Badge>
            )}
            {service === "storage" && (
              <Badge variant={data.readable && data.writable ? "default" : "destructive"}>
                {data.readable && data.writable ? "Lese-/Schreibzugriff OK" : "Zugriffsproblem"}
              </Badge>
            )}
            {service === "realtime" && (
              <Badge variant={data.connected ? "default" : "destructive"}>
                {data.connected ? `Verbunden (${data.channels} Kanäle)` : "Nicht Verbunden"}
              </Badge>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b">
        <div className="flex items-center mb-4 sm:mb-0">
          <FileText className="h-10 w-10 mr-3 text-primary" />
          <h1 className="text-4xl font-extrabold tracking-tight">Technische Dokumentation</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={copyToClipboard} size="sm">
            <Copy className="h-4 w-4 mr-2" />
            Alles Kopieren
          </Button>
          <Button onClick={downloadDocumentation} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Als Markdown
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 lg:sticky lg:top-8 self-start">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Navigation</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Abschnitt suchen..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-220px)] pr-3">
                {" "}
                {/* Adjust height as needed */}
                <nav className="space-y-1">
                  {filteredSections.map((section) => (
                    <Button
                      key={section.id}
                      variant={activeSection === section.id ? "secondary" : "ghost"}
                      className="w-full justify-start text-left h-auto py-2 px-3"
                      onClick={() => scrollToSection(section.id)}
                    >
                      <ChevronRight
                        className={`h-4 w-4 mr-2 transition-transform ${activeSection === section.id ? "rotate-90" : ""}`}
                      />
                      {section.title}
                    </Button>
                  ))}
                </nav>
              </ScrollArea>
            </CardContent>
          </Card>
        </aside>

        <main className="lg:col-span-3" ref={contentRef}>
          <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary hover:prose-a:text-primary/80 prose-pre:bg-slate-100 dark:prose-pre:bg-slate-800 prose-pre:rounded-md prose-pre:p-4 prose-pre:overflow-x-auto">
            <section id="overview" className="scroll-mt-20 mb-16 p-6 bg-card rounded-lg shadow">
              <h2 className="!text-3xl !mb-6 border-b pb-2">Projektübersicht</h2>
              <p>
                <strong>XP Share</strong> ist eine moderne Web-Plattform, konzipiert für das Teilen, Entdecken und
                Verwalten von persönlichen Lebenserfahrungen. Die Anwendung zielt darauf ab, eine Community zu fördern,
                in der Benutzer ihre Erlebnisse dokumentieren, kategorisieren, reflektieren und mit anderen teilen
                können. Ein zentrales Element ist die KI-gestützte Analyse und Aufbereitung von Inhalten, um tiefere
                Einblicke und Verbindungen zu ermöglichen.
              </p>
              <h3 className="!text-2xl !mt-6 !mb-3">Kernfunktionalitäten</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Erlebnis-Management</strong>: Intuitives Erstellen, Bearbeiten, Kategorisieren und Teilen von
                  detaillierten Erfahrungen.
                </li>
                <li>
                  <strong>XP-Buch (Journaling)</strong>: Ein privater Bereich für persönliche Reflexionen,
                  Stimmungs-Tracking und Zielsetzung.
                </li>
                <li>
                  <strong>Community-Features</strong>: Erstellung und Teilnahme an Gruppen, themenspezifische
                  Diskussionen und Event-Planung.
                </li>
                <li>
                  <strong>Gamification</strong>: Einbindung von XP-Punkten, Levels, Achievements und Quests zur
                  Motivationssteigerung.
                </li>
                <li>
                  <strong>KI-Integration</strong>: Automatische Inhaltsanalyse (Emotionen, Muster, Themen), intelligente
                  Zusammenfassungen und personalisierte Empfehlungen.
                </li>
                <li>
                  <strong>Semantische Suche & Entdecken</strong>: Erweiterte Suchfunktionen und Filter, um relevante
                  Erlebnisse und Nutzer zu finden.
                </li>
                <li>
                  <strong>Real-time Messaging</strong>: Direktnachrichten und Gruppenchats mit Echtzeit-Interaktion.
                </li>
                <li>
                  <strong>Referral-System</strong>: Belohnungssystem für das Einladen neuer Nutzer.
                </li>
                <li>
                  <strong>Personalisierte Profile</strong>: Darstellung von Nutzeraktivitäten, Achievements und
                  geteilten Erlebnissen.
                </li>
                <li>
                  <strong>Offline-Fähigkeit</strong>: Basisfunktionen auch ohne Internetverbindung nutzbar, mit späterer
                  Synchronisation.
                </li>
              </ul>
            </section>

            <section id="architecture" className="scroll-mt-20 mb-16 p-6 bg-card rounded-lg shadow">
              <h2 className="!text-3xl !mb-6 border-b pb-2">Architektur</h2>
              <p>
                XP Share basiert auf einer modernen, serverseitig gerenderten (SSR) und clientseitig interaktiven
                Architektur, die Next.js als Full-Stack-Framework nutzt. Supabase dient als Backend-as-a-Service (BaaS)
                für Datenbank, Authentifizierung, Storage und Realtime-Funktionen.
              </p>
              <h3 className="!text-2xl !mt-6 !mb-3">Gesamtarchitektur</h3>
              <pre>
                {`
  Client (Browser/PWA)
      │
      ▼
┌─────────────────────┐      ┌─────────────────────┐
│ Next.js Frontend    │<----->│ Next.js API Routes  │ (Serverless Functions)
│ (React, Shadcn/UI)  │      │ (Business Logic,    │
└─────────────────────┘      │  AI Orchestration) │
      │                      └──────────┬──────────┘
      │                                 │
      ▼                                 ▼
┌─────────────────────┐      ┌─────────────────────┐
│ Vercel AI SDK       │      │ Supabase              │
│ (LLM Integration)   │      │ (PostgreSQL, Auth,  │
└─────────────────────┘      │  Storage, Realtime, │
                             │  Vector DB)          │
                             └─────────────────────┘
`}
              </pre>
              <h3 className="!text-2xl !mt-6 !mb-3">Ordnerstruktur (Auszug)</h3>
              <pre>
                {`
xp-share/
├── app/                    # Next.js App Router (Seiten, Layouts, API Routen)
│   ├── (main)/             # Haupt-Layout für eingeloggte Nutzer
│   │   ├── dashboard/
│   │   ├── entdecken/
│   │   └── ...
│   ├── (auth)/             # Authentifizierungsseiten (Login, Register)
│   ├── admin/              # Admin-Bereich
│   ├── api/                # API Endpunkte (z.B. /api/experiences)
│   │   ├── ai/             # KI-spezifische API Routen
│   │   └── auth/           # Auth Callbacks etc.
│   ├── layout.tsx          # Root Layout
│   └── page.tsx            # Startseite (Landing Page)
├── components/             # Wiederverwendbare React Komponenten
│   ├── ui/                 # Basis UI-Elemente (von shadcn/ui)
│   ├── auth/               # Authentifizierungs-Komponenten
│   ├── dashboard/          # Dashboard-spezifische Komponenten
│   ├── erlebnis/           # Komponenten rund um Erlebnisse
│   └── ...
├── lib/                    # Hilfsfunktionen, Services, Konfigurationen
│   ├── ai/                 # KI-spezifische Logik, Prompts
│   ├── server/             # Server-seitige Supabase Clients, Utilities
│   ├── supabase/           # Supabase Client-Konfigurationen
│   ├── utils.ts            # Allgemeine Hilfsfunktionen
│   └── config.ts           # Projektkonfiguration
├── hooks/                  # Custom React Hooks
├── contexts/               # React Contexts für globales State Management
├── types/                  # TypeScript Typdefinitionen (z.B. Erlebnis, User)
├── public/                 # Statische Assets (Bilder, Icons)
├── docs/                   # Projektdokumentation (Markdown etc.)
└── middleware.ts           # Next.js Middleware für Auth-Schutz etc.
`}
              </pre>
            </section>

            <section id="tech-stack" className="scroll-mt-20 mb-16 p-6 bg-card rounded-lg shadow">
              <h2 className="!text-3xl !mb-6 border-b pb-2">Technologie-Stack</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="!text-2xl !mt-6 !mb-3">Frontend</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Framework</strong>: Next.js 14+ (App Router)
                    </li>
                    <li>
                      <strong>UI Library</strong>: React 18+
                    </li>
                    <li>
                      <strong>Styling</strong>: Tailwind CSS
                    </li>
                    <li>
                      <strong>UI Komponenten</strong>: shadcn/ui
                    </li>
                    <li>
                      <strong>Icons</strong>: Lucide React
                    </li>
                    <li>
                      <strong>State Management</strong>: React Context, Zustand (optional für komplexere States)
                    </li>
                    <li>
                      <strong>Formulare</strong>: React Hook Form mit Zod für Validierung
                    </li>
                    <li>
                      <strong>Sprache</strong>: TypeScript
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="!text-2xl !mt-6 !mb-3">Backend & Datenbank</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Runtime</strong>: Node.js (via Next.js API Routes)
                    </li>
                    <li>
                      <strong>BaaS</strong>: Supabase
                    </li>
                    <li>
                      <strong>Datenbank</strong>: PostgreSQL (via Supabase)
                    </li>
                    <li>
                      <strong>Authentifizierung</strong>: Supabase Auth (JWT, OAuth)
                    </li>
                    <li>
                      <strong>Dateispeicher</strong>: Supabase Storage
                    </li>
                    <li>
                      <strong>Real-time</strong>: Supabase Realtime (WebSockets)
                    </li>
                    <li>
                      <strong>Vector Database</strong>: pgvector Extension in Supabase
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="!text-2xl !mt-6 !mb-3">KI & Machine Learning</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>AI SDK</strong>: Vercel AI SDK
                    </li>
                    <li>
                      <strong>LLM Provider</strong>: OpenAI (GPT-4o-mini, GPT-4-Turbo)
                    </li>
                    <li>
                      <strong>Embeddings</strong>: OpenAI Embeddings (text-embedding-3-small)
                    </li>
                    <li>
                      <strong>Modelle für</strong>: Textgenerierung, Zusammenfassung, Analyse, semantische Suche
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="!text-2xl !mt-6 !mb-3">Entwicklungstools & CI/CD</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Versionskontrolle</strong>: Git (GitHub)
                    </li>
                    <li>
                      <strong>Package Manager</strong>: npm
                    </li>
                    <li>
                      <strong>Linting</strong>: ESLint
                    </li>
                    <li>
                      <strong>Formatting</strong>: Prettier
                    </li>
                    <li>
                      <strong>Deployment</strong>: Vercel
                    </li>
                    <li>
                      <strong>Testing</strong>: Jest, React Testing Library, (Playwright für E2E optional)
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="database" className="scroll-mt-20 mb-16 p-6 bg-card rounded-lg shadow">
              <h2 className="!text-3xl !mb-6 border-b pb-2">Datenbankschema</h2>
              <p>Das Datenbankschema ist in Supabase (PostgreSQL) implementiert. Die wichtigsten Tabellen sind:</p>

              <h3 className="!text-2xl !mt-6 !mb-3">
                <code>users</code>
              </h3>
              <pre>
                {`
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT auth.uid() PRIMARY KEY, -- Referenziert auth.users
  username character varying(50) UNIQUE,
  display_name character varying(100),
  avatar_url text,
  bio text,
  email character varying(255) UNIQUE, -- Wird von auth.users gespiegelt
  experience_points integer DEFAULT 0,
  level integer DEFAULT 1,
  is_premium boolean DEFAULT false,
  is_admin boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT username_length CHECK ((char_length(username) >= 3))
);
-- RLS Policies für users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON users FOR UPDATE USING (auth.uid() = id);
                `}
              </pre>

              <h3 className="!text-2xl !mt-6 !mb-3">
                <code>experiences</code>
              </h3>
              <pre>
                {`
CREATE TABLE public.experiences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title character varying(255) NOT NULL,
  description text,
  content jsonb NOT NULL, -- Strukturierter Inhalt (z.B. Tiptap JSON)
  category character varying(100),
  tags text[],
  location_name text,
  location_coordinates point, -- Geographische Koordinaten
  experience_date date,
  privacy_level character varying(50) DEFAULT 'public'::character varying, -- 'public', 'friends', 'private'
  media_urls jsonb, -- Array von Objekten mit {url, type, caption}
  emotions text[],
  mood_before smallint, -- Skala 1-10
  mood_after smallint, -- Skala 1-10
  insights text[],
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  shares_count integer DEFAULT 0,
  embedding public.vector(1536), -- Für semantische Suche (OpenAI text-embedding-3-small)
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
-- Indizes für experiences
CREATE INDEX idx_experiences_author_id ON public.experiences USING btree (author_id);
CREATE INDEX idx_experiences_category ON public.experiences USING btree (category);
CREATE INDEX idx_experiences_tags ON public.experiences USING gin (tags);
CREATE INDEX idx_experiences_embedding ON public.experiences USING ivfflat (embedding public.vector_cosine_ops) WITH (lists = 100);

-- RLS Policies für experiences
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public experiences are viewable by everyone." ON experiences FOR SELECT USING (privacy_level = 'public');
CREATE POLICY "Users can view their own private/friends experiences." ON experiences FOR SELECT USING (auth.uid() = author_id);
-- Weitere Policies für friends-only etc.
CREATE POLICY "Users can insert their own experiences." ON experiences FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own experiences." ON experiences FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own experiences." ON experiences FOR DELETE USING (auth.uid() = author_id);
                `}
              </pre>

              <h3 className="!text-2xl !mt-6 !mb-3">
                <code>xp_entries</code> (XP-Buch / Journal)
              </h3>
              <pre>
                {`
CREATE TABLE public.xp_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title character varying(255) NOT NULL,
  content jsonb NOT NULL,
  entry_type character varying(50) DEFAULT 'reflection'::character varying, -- 'reflection', 'gratitude', 'goal'
  mood character varying(50),
  tags text[],
  entry_date date NOT NULL,
  is_draft boolean DEFAULT false,
  media_urls jsonb,
  embedding public.vector(1536),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
-- RLS Policies für xp_entries (strikt privat)
ALTER TABLE public.xp_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own xp_entries." ON xp_entries FOR ALL USING (auth.uid() = user_id);
                `}
              </pre>
              <p>
                Weitere Tabellen umfassen <code>comments</code>, <code>likes</code>, <code>groups</code>,{" "}
                <code>group_members</code>, <code>messages</code>, <code>achievements</code>,{" "}
                <code>user_achievements</code>, <code>quests</code>, <code>user_quests</code>,{" "}
                <code>notifications</code>, <code>referrals</code>.
              </p>
            </section>

            <section id="api" className="scroll-mt-20 mb-16 p-6 bg-card rounded-lg shadow">
              <h2 className="!text-3xl !mb-6 border-b pb-2">API-Dokumentation</h2>
              <p>
                Die API wird über Next.js API Routes implementiert (<code>app/api/...</code>). Authentifizierung erfolgt
                über JWTs (Supabase Auth), die im Authorization Header als Bearer Token gesendet werden.
              </p>

              <h3 className="!text-2xl !mt-6 !mb-3">Basis-URL</h3>
              <p>
                <code>{process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api</code>
              </p>

              <h3 className="!text-2xl !mt-6 !mb-3">Header-Format</h3>
              <pre>{`Authorization: Bearer ${"<supabase_access_token>"}`}</pre>

              <h3 className="!text-2xl !mt-6 !mb-3">
                Beispiel-Endpunkte für <code>experiences</code>:
              </h3>
              <h4 className="!text-xl !mt-4 !mb-2">
                <code>POST /api/experiences</code>
              </h4>
              <p>Erstellt ein neues Erlebnis. Benötigt Authentifizierung.</p>
              <p>
                <strong>Request Body (JSON):</strong>
              </p>
              <pre>{`{
  "title": "string",
  "content": { /* Tiptap JSON */ },
  "category": "string",
  "tags": ["string"],
  "privacy_level": "public" | "friends" | "private",
  // ... weitere Felder
}`}</pre>
              <p>
                <strong>Response:</strong> <code>201 Created</code> mit dem erstellten Erlebnis-Objekt.
              </p>

              <h4 className="!text-xl !mt-4 !mb-2">
                <code>GET /api/experiences</code>
              </h4>
              <p>Ruft eine Liste von Erlebnissen ab. Unterstützt Pagination und Filterung.</p>
              <p>
                <strong>Query Parameter:</strong>
              </p>
              <ul className="list-disc pl-5">
                <li>
                  <code>limit</code> (number, default: 10)
                </li>
                <li>
                  <code>offset</code> (number, default: 0)
                </li>
                <li>
                  <code>userId</code> (string): Filter nach Autor
                </li>
                <li>
                  <code>category</code> (string)
                </li>
                <li>
                  <code>tags</code> (string, kommasepariert)
                </li>
                <li>
                  <code>q</code> (string): Suchbegriff (für Textsuche)
                </li>
                <li>
                  <code>semantic_q</code> (string): Suchbegriff (für semantische Suche)
                </li>
              </ul>
              <p>
                <strong>Response:</strong> <code>200 OK</code> mit{" "}
                <code>{`{ experiences: Experience[], count: number }`}</code>.
              </p>

              <h4 className="!text-xl !mt-4 !mb-2">
                <code>GET /api/experiences/[id]</code>
              </h4>
              <p>Ruft ein spezifisches Erlebnis ab.</p>
              <p>
                <strong>Response:</strong> <code>200 OK</code> mit dem Erlebnis-Objekt oder <code>404 Not Found</code>.
              </p>

              <h4 className="!text-xl !mt-4 !mb-2">
                <code>PUT /api/experiences/[id]</code>
              </h4>
              <p>Aktualisiert ein Erlebnis. Nur für den Autor erlaubt.</p>
              <p>
                <strong>Response:</strong> <code>200 OK</code> mit dem aktualisierten Erlebnis-Objekt.
              </p>

              <h4 className="!text-xl !mt-4 !mb-2">
                <code>DELETE /api/experiences/[id]</code>
              </h4>
              <p>Löscht ein Erlebnis. Nur für den Autor erlaubt.</p>
              <p>
                <strong>Response:</strong> <code>204 No Content</code>.
              </p>

              <h3 className="!text-2xl !mt-6 !mb-3">KI-spezifische Endpunkte:</h3>
              <h4 className="!text-xl !mt-4 !mb-2">
                <code>POST /api/ai/analyze-experience</code>
              </h4>
              <p>Analysiert den Inhalt eines Erlebnisses (Emotionen, Themen, Zusammenfassung).</p>
              <p>
                <strong>Request Body (JSON):</strong> <code>{`{ experienceId: "uuid", content: "string" }`}</code>
              </p>
              <p>
                <strong>Response:</strong> <code>200 OK</code> mit Analyseergebnissen.
              </p>

              <h4 className="!text-xl !mt-4 !mb-2">
                <code>POST /api/ai/generate-embedding</code>
              </h4>
              <p>Generiert und speichert ein Embedding für ein Erlebnis oder einen XP-Eintrag.</p>
              <p>
                <strong>Request Body (JSON):</strong>{" "}
                <code>{`{ text: "string", type: "experience" | "xp_entry", entryId: "uuid" }`}</code>
              </p>
              <p>
                <strong>Response:</strong> <code>200 OK</code>.
              </p>
              <p>
                Weitere API-Endpunkte existieren für <code>xp-entries</code>, <code>users</code>, <code>comments</code>,{" "}
                <code>groups</code>, <code>messages</code> etc. und folgen ähnlichen Mustern.
              </p>
            </section>

            <section id="auth" className="scroll-mt-20 mb-16 p-6 bg-card rounded-lg shadow">
              <h2 className="!text-3xl !mb-6 border-b pb-2">Authentifizierung & Autorisierung</h2>
              <p>Die Authentifizierung und Autorisierung basiert vollständig auf Supabase Auth.</p>
              <h3 className="!text-2xl !mt-6 !mb-3">Authentifizierungsmechanismen</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>E-Mail & Passwort</strong>: Standard-Login-Methode.
                </li>
                <li>
                  <strong>OAuth Provider</strong>: Integration von Google, GitHub etc. über Supabase.
                </li>
                <li>
                  <strong>Magic Links</strong>: Passwortloser Login per E-Mail.
                </li>
              </ul>
              <h3 className="!text-2xl !mt-6 !mb-3">JWT Handling</h3>
              <p>
                Supabase Auth verwendet JWTs. Der Supabase Client (<code>@supabase/supabase-js</code>) verwaltet die
                Tokens (Access Token, Refresh Token) automatisch im Local Storage des Browsers. Access Tokens sind
                kurzlebig und werden bei Bedarf mit dem Refresh Token erneuert.
              </p>
              <h3 className="!text-2xl !mt-6 !mb-3">Serverseitige Authentifizierung</h3>
              <p>
                Für Server Components und API Routes wird <code>@supabase/ssr</code> verwendet, um den Supabase Client
                mit Cookie-basiertem Session Management zu initialisieren.
              </p>
              <pre>{`// lib/server/supabase-server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createSupabaseServerClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options })},
        remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options })},
      },
    }
  )
}`}</pre>
              <h3 className="!text-2xl !mt-6 !mb-3">Autorisierung (Row Level Security - RLS)</h3>
              <p>
                Die Zugriffskontrolle auf Daten erfolgt primär über RLS-Policies in der PostgreSQL-Datenbank. Beispiele
                sind im Abschnitt "Datenbankschema" zu finden. Dies stellt sicher, dass Benutzer nur auf die Daten
                zugreifen können, für die sie berechtigt sind, selbst wenn API-Endpunkte umgangen würden.
              </p>
              <h3 className="!text-2xl !mt-6 !mb-3">Middleware für Routenschutz</h3>
              <p>
                Die Next.js Middleware (<code>middleware.ts</code>) wird verwendet, um bestimmte Routen (z.B.{" "}
                <code>/dashboard/*</code>, <code>/admin/*</code>) für nicht authentifizierte oder nicht autorisierte
                Benutzer zu sperren und sie ggf. zur Login-Seite umzuleiten.
              </p>
              <pre>{`// middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers }})
  const supabase = createServerClient( /* ... */ { cookies: { /* ... */ }})
  const { data: { session } } = await supabase.auth.getSession()

  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  // Weitere Logik für Admin-Routen etc.
  return response
}`}</pre>
            </section>

            <section id="features" className="scroll-mt-20 mb-16 p-6 bg-card rounded-lg shadow">
              <h2 className="!text-3xl !mb-6 border-b pb-2">Core Features</h2>
              <p>Detaillierte Beschreibung der Implementierung einiger Kernfunktionalitäten.</p>

              <h3 className="!text-2xl !mt-6 !mb-3">1. Erlebnis-Management</h3>
              <p>
                Nutzer können Erlebnisse über einen mehrstufigen Wizard (<code>components/erlebnis-wizard.tsx</code>)
                erstellen. Die Daten werden clientseitig validiert (Zod) und dann an den API-Endpunkt{" "}
                <code>POST /api/experiences</code> gesendet. Die Bearbeitung erfolgt ähnlich. Erlebnisse können mit
                strukturiertem Inhalt (Tiptap Editor), Medien, Tags, Emotionen etc. angereichert werden.
              </p>

              <h3 className="!text-2xl !mt-6 !mb-3">2. XP-Buch (Journaling)</h3>
              <p>
                Das XP-Buch (<code>app/xp-buch/*</code>) ist ein privater Bereich. Einträge (<code>xp_entries</code>{" "}
                Tabelle) sind strikt an den Nutzer gebunden (RLS). Funktionen umfassen verschiedene Eintragstypen,
                Stimmungs-Tracking und die Möglichkeit, Entwürfe zu speichern. KI-gestützte Zusammenfassungen und
                Mustererkennung sind für das XP-Buch geplant.
              </p>

              <h3 className="!text-2xl !mt-6 !mb-3">3. Community & Gruppen</h3>
              <p>
                Nutzer können Gruppen erstellen und beitreten (<code>components/community/*</code>). Gruppen können
                öffentlich oder privat sein und eigene Diskussionsforen (verknüpft mit <code>messages</code> oder einer
                dedizierten <code>posts</code> Tabelle) und Events haben. Die Verwaltung von Mitgliedschaften und
                Berechtigungen innerhalb von Gruppen erfolgt serverseitig.
              </p>

              <h3 className="!text-2xl !mt-6 !mb-3">4. Messaging</h3>
              <p>
                Ein Real-time Chat-System (<code>components/nachrichten/*</code>) nutzt Supabase Realtime für
                Nachrichtenübermittlung. Es unterstützt Direktnachrichten und Gruppenchats. Nachrichten werden in der{" "}
                <code>messages</code> Tabelle gespeichert. Typing-Indikatoren und Lesebestätigungen verbessern die UX.
              </p>

              <h3 className="!text-2xl !mt-6 !mb-3">5. Gamification</h3>
              <p>
                Das System (<code>components/gamification/*</code>, <code>lib/quest-service.ts</code>) umfasst:
              </p>
              <ul className="list-disc pl-5">
                <li>
                  <strong>XP-Punkte & Level</strong>: Vergabe für Aktionen (Erlebnis erstellen, kommentieren etc.).
                  Levelaufstiege schalten ggf. Features oder Badges frei.
                </li>
                <li>
                  <strong>Achievements</strong>: Einmalige Erfolge für Meilensteine (z.B. "Erstes Erlebnis geteilt").
                </li>
                <li>
                  <strong>Quests</strong>: Zeitlich begrenzte oder wiederkehrende Aufgaben (z.B. "Teile 3 Erlebnisse
                  diese Woche").
                </li>
              </ul>
              <p>
                Die Logik zur Vergabe und Überprüfung wird serverseitig (ggf. über Supabase Edge Functions oder API
                Routes) implementiert, um Manipulationen zu vermeiden.
              </p>

              <h3 className="!text-2xl !mt-6 !mb-3">6. Semantische Suche & Entdecken</h3>
              <p>
                Nutzt OpenAI Embeddings und pgvector. Beim Erstellen/Aktualisieren von Erlebnissen wird der Inhalt an{" "}
                <code>POST /api/ai/generate-embedding</code> gesendet, um einen Vektor zu erzeugen und zu speichern. Die
                Suche (<code>app/entdecken/*</code>) kann dann über{" "}
                <code>GET /api/experiences?semantic_q=Suchbegriff</code> eine Ähnlichkeitssuche durchführen, die
                relevantere Ergebnisse als reine Textsuche liefert.
              </p>
            </section>

            <section id="services" className="scroll-mt-20 mb-16 p-6 bg-card rounded-lg shadow">
              <h2 className="!text-3xl !mb-6 border-b pb-2">Services & Utilities</h2>
              <p>
                Wichtige Hilfsmodule und Service-Klassen im <code>lib/</code> Verzeichnis.
              </p>

              <h3 className="!text-2xl !mt-6 !mb-3">
                <code>lib/ai-service.ts</code>
              </h3>
              <p>Zentrale Anlaufstelle für KI-Funktionen. Nutzt die Vercel AI SDK und den OpenAI Client.</p>
              <pre>{`// Beispielhafte Funktionen
export async function getCompletion(prompt: string): Promise<string>;
export async function generateEmbedding(text: string): Promise<number[]>;
export async function analyzeExperienceContent(content: string): Promise<AnalysisResult>;
// AnalysisResult könnte { emotions: string[], themes: string[], summary: string } sein
`}</pre>

              <h3 className="!text-2xl !mt-6 !mb-3">
                <code>lib/experience-service.ts</code> & <code>lib/xp-entry-service.ts</code>
              </h3>
              <p>
                Abstraktionsebenen für CRUD-Operationen mit Erlebnissen und XP-Bucheinträgen. Kommunizieren mit den
                Supabase API-Endpunkten oder direkt mit dem Supabase Client.
              </p>
              <pre>{`// lib/experience-service.ts
export async function createExperience(data: NewExperienceData): Promise<Experience>;
export async function getExperienceById(id: string): Promise<Experience | null>;
export async function updateExperience(id: string, data: Partial<Experience>): Promise<Experience>;
`}</pre>

              <h3 className="!text-2xl !mt-6 !mb-3">
                <code>lib/media-service.ts</code>
              </h3>
              <p>
                Verantwortlich für das Hochladen von Medien (Bilder, Videos) zu Supabase Storage. Beinhaltet Logik für
                Dateivalidierung, ggf. Komprimierung (clientseitig oder über Edge Function) und das Generieren von URLs.
              </p>

              <h3 className="!text-2xl !mt-6 !mb-3">
                <code>lib/notification-service.ts</code>
              </h3>
              <p>
                Verwaltet das Erstellen und Abrufen von In-App-Benachrichtigungen. Könnte auch Push-Benachrichtigungen
                (via Supabase Edge Functions und Web Push API) steuern.
              </p>

              <h3 className="!text-2xl !mt-6 !mb-3">
                <code>lib/utils.ts</code>
              </h3>
              <p>
                Sammlung allgemeiner Hilfsfunktionen, z.B. Datumsformatierung (mit <code>date-fns</code>),
                String-Manipulation, <code>cn</code> für Tailwind Class Merging.
              </p>
            </section>

            <section id="frontend" className="scroll-mt-20 mb-16 p-6 bg-card rounded-lg shadow">
              <h2 className="!text-3xl !mb-6 border-b pb-2">Frontend-Architektur</h2>
              <p>
                Das Frontend ist mit React und Next.js (App Router) aufgebaut, unter Verwendung von TypeScript und
                Tailwind CSS.
              </p>

              <h3 className="!text-2xl !mt-6 !mb-3">Komponentenstruktur</h3>
              <p>
                Komponenten sind modular organisiert und folgen oft dem Atomic Design Prinzip (Atoms, Molecules,
                Organisms, Templates, Pages).
              </p>
              <ul className="list-disc pl-5">
                <li>
                  <strong>
                    <code>components/ui/</code>
                  </strong>
                  : Basis-UI-Elemente von shadcn/ui (Button, Card, Input etc.), ggf. leicht angepasst.
                </li>
                <li>
                  <strong>
                    <code>components/[feature]/</code>
                  </strong>
                  : Feature-spezifische Komponenten (z.B. <code>components/erlebnis/erlebnis-card.tsx</code>).
                </li>
                <li>
                  <strong>Server Components & Client Components</strong>: Bewusste Nutzung der Stärken beider
                  Komponententypen. Server Components für Daten-Fetching und Rendering, Client Components ("use client")
                  für Interaktivität und State.
                </li>
              </ul>

              <h3 className="!text-2xl !mt-6 !mb-3">State Management</h3>
              <ul className="list-disc pl-5">
                <li>
                  <strong>Lokaler State</strong>: <code>useState</code> und <code>useReducer</code> für
                  Komponenten-internen State.
                </li>
                <li>
                  <strong>Globaler State</strong>: React Context API für themenübergreifenden State (z.B.{" "}
                  <code>AuthContext</code>, <code>ThemeContext</code>). Für komplexere globale Zustände wird ggf.
                  Zustand eingesetzt.
                </li>
                <li>
                  <strong>Server State / Caching</strong>: Serverseitige Daten werden oft direkt in Server Components
                  gefetcht. Für clientseitiges Caching, Mutations und Refetching von Serverdaten kann React Query
                  (TanStack Query) integriert werden, ist aber aktuell nicht primär im Einsatz. Supabase Client bietet
                  eigenes Caching.
                </li>
                <li>
                  <strong>Serverseitiges Caching (Next.js)</strong>: Nutzung von <code>fetch</code> mit Caching-Optionen
                  in Server Components oder Route Handlers.
                </li>
              </ul>
              <pre>{`// Beispiel: fetch mit Revalidierung in Server Component
async function getData() {
  const res = await fetch('https://api.example.com/...', { next: { revalidate: 3600 } })
  return res.json()
}`}</pre>

              <h3 className="!text-2xl !mt-6 !mb-3">3. Optimierung von Assets</h3>
              <ul className="list-disc pl-5">
                <li>
                  <strong>Bilder</strong>: Nutzung von <code>next/image</code> für automatische Bildoptimierung (Größe,
                  Format, Lazy Loading).
                </li>
                <li>
                  <strong>Schriftarten</strong>: Selbst-Hosting von Schriftarten mit <code>next/font</code> für bessere
                  Performance und Vermeidung von Layout Shifts.
                </li>
                <li>
                  <strong>SVG Icons</strong>: Bevorzugt gegenüber Icon-Fonts, da sie kleiner sind und besser skalieren.
                  Lucide React wird verwendet.
                </li>
              </ul>

              <h3 className="!text-2xl !mt-6 !mb-3">4. Bundle-Analyse</h3>
              <p>
                Regelmäßige Analyse des JavaScript-Bundles mit Tools wie <code>@next/bundle-analyzer</code>, um große
                Abhängigkeiten oder unnötigen Code zu identifizieren.
              </p>

              <h3 className="!text-2xl !mt-6 !mb-3">5. Weitere Techniken</h3>
              <ul className="list-disc pl-5">
                <li>
                  <strong>Debouncing und Throttling</strong>: Für Event Handler (z.B. Sucheingabe, Scroll-Events).
                </li>
                <li>
                  <strong>Virtualisierung</strong>: Für lange Listen (z.B. mit <code>react-window</code> oder{" "}
                  <code>tanstack-virtual</code>), um nur sichtbare Elemente zu rendern.
                </li>
                <li>
                  <strong>Memoization</strong>: Einsatz von <code>React.memo</code>, <code>useMemo</code>,{" "}
                  <code>useCallback</code>, um unnötige Re-Renders zu vermeiden.
                </li>
              </ul>
            </section>

            <section id="deployment" className="scroll-mt-20 mb-16 p-6 bg-card rounded-lg shadow">
              <h2 className="!text-3xl !mb-6 border-b pb-2">Deployment & CI/CD</h2>
              <p>Das Projekt wird auf Vercel deployed, was eine nahtlose Integration mit Next.js bietet.</p>

              <h3 className="!text-2xl !mt-6 !mb-3">1. Vercel Deployment</h3>
              <ul className="list-disc pl-5">
                <li>
                  <strong>Git-Integration</strong>: Automatisches Deployment bei Push auf den Main-Branch (Produktion)
                  oder Feature-Branches (Preview Deployments).
                </li>
                <li>
                  <strong>Build-Prozess</strong>: Vercel führt <code>npm run build</code> aus, um die Next.js-Anwendung
                  zu bauen.
                </li>
                <li>
                  <strong>Serverless Functions</strong>: API Routes werden als Serverless Functions deployed.
                </li>
                <li>
                  <strong>Edge Functions</strong>: Middleware und ggf. einige API Routes können als Edge Functions für
                  geringere Latenz deployed werden.
                </li>
                <li>
                  <strong>Environment Variables</strong>: Verwaltung von Umgebungsvariablen (Supabase Keys, OpenAI API
                  Key etc.) über das Vercel Dashboard.
                </li>
              </ul>
              <pre>{`// vercel.json (Beispiel, oft nicht nötig bei Standard Next.js)
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}`}</pre>

              <h3 className="!text-2xl !mt-6 !mb-3">2. Datenbank-Migrationen (Supabase)</h3>
              <ul className="list-disc pl-5">
                <li>
                  <strong>Supabase CLI</strong>: Wird für die Verwaltung von Datenbankschema-Änderungen verwendet.
                </li>
                <li>
                  <strong>Migrations-Workflow</strong>:
                  <ol className="list-decimal pl-5">
                    <li>
                      Lokale Entwicklung: <code>supabase db diff -f migration_name</code> erstellt eine neue
                      Migrationsdatei.
                    </li>
                    <li>Anpassung der Migrationsdatei.</li>
                    <li>
                      Lokales Anwenden: <code>supabase db reset</code> (für frische DB) oder{" "}
                      <code>supabase migration up</code>.
                    </li>
                    <li>Commit der Migrationsdateien ins Git-Repository.</li>
                  </ol>
                </li>
                <li>
                  <strong>Deployment von Migrationen</strong>:
                  <ul>
                    <li>
                      <strong>Manuell</strong>: Über Supabase Dashboard oder CLI (
                      <code>supabase migration up --linked</code>) nach dem Code-Deployment.
                    </li>
                    <li>
                      <strong>Automatisiert (CI/CD)</strong>: Ein CI/CD-Schritt (z.B. GitHub Action) kann{" "}
                      <code>supabase migration up</code> ausführen, nachdem der Build erfolgreich war. Dies erfordert
                      sichere Handhabung des <code>SUPABASE_ACCESS_TOKEN</code> und <code>SUPABASE_DB_PASSWORD</code>.
                    </li>
                  </ul>
                </li>
              </ul>

              <h3 className="!text-2xl !mt-6 !mb-3">3. CI/CD-Pipeline (Beispiel mit GitHub Actions)</h3>
              <pre>{`# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches:
      - main # Produktions-Branch

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install Dependencies
        run: npm ci

      - name: Lint and Test
        run: |
          npm run lint
          npm run type-check
          npm run test:ci # Führt Tests aus

      # Optional: Supabase DB Migrationen
      # - name: Setup Supabase CLI
      #   uses: supabase/setup-cli@v1
      #   with:
      #     version: latest
      # - name: Apply DB Migrations
      #   run: supabase link --project-ref ${"${{ secrets.SUPABASE_PROJECT_ID }}"} && supabase migration up
      #   env:
      #     SUPABASE_ACCESS_TOKEN: ${"${{ secrets.SUPABASE_ACCESS_TOKEN }}"}
      #     SUPABASE_DB_PASSWORD: ${"${{ secrets.SUPABASE_DB_PASSWORD }}"}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${"${{ secrets.VERCEL_TOKEN }}"}
          vercel-org-id: ${"${{ secrets.VERCEL_ORG_ID }}"}
          vercel-project-id: ${"${{ secrets.VERCEL_PROJECT_ID }}"}
          vercel-args: '--prod' # Für Produktions-Deployment
`}</pre>

              <h3 className="!text-2xl !mt-6 !mb-3">4. Monitoring & Logging</h3>
              <ul className="list-disc pl-5">
                <li>
                  <strong>Vercel Analytics</strong>: Bietet Einblicke in Web Vitals und Traffic.
                </li>
                <li>
                  <strong>Vercel Logs</strong>: Echtzeit-Logs für Serverless Functions und Builds.
                </li>
                <li>
                  <strong>Externe Monitoring-Tools</strong>: Integration von Sentry oder ähnlichen Diensten für Error
                  Tracking und Performance Monitoring in der Produktion.
                </li>
                <li>
                  <strong>Supabase Dashboard</strong>: Bietet Logs und Monitoring für Datenbank und Auth.
                </li>
              </ul>
            </section>

            <section id="debugging" className="scroll-mt-20 mb-16 p-6 bg-card rounded-lg shadow">
              <h2 className="!text-3xl !mb-6 border-b pb-2">Debugging & Entwicklung</h2>

              <h3 className="!text-2xl !mt-6 !mb-3">1. Entwicklertools im Browser</h3>
              <p>
                Standard-Browser-DevTools (Konsole, Netzwerk-Tab, Komponenten-Inspektor via React DevTools) sind
                unerlässlich.
              </p>

              <h3 className="!text-2xl !mt-6 !mb-3">2. Next.js Debugging</h3>
              <ul className="list-disc pl-5">
                <li>
                  <strong>Source Maps</strong>: Standardmäßig aktiviert für einfacheres Debuggen von TypeScript/JSX.
                </li>
                <li>
                  <strong>Server Component Logging</strong>: <code>console.log</code> in Server Components erscheint im
                  Terminal, in dem der Next.js Dev-Server läuft.
                </li>
                <li>
                  <strong>Client Component Logging</strong>: <code>console.log</code> erscheint in der Browser-Konsole.
                </li>
                <li>
                  <strong>Node.js Debugger</strong>: Kann für das Debuggen von API Routes und Server-Code verwendet
                  werden (<code>NODE_OPTIONS='--inspect' npm run dev</code>).
                </li>
              </ul>

              <h3 className="!text-2xl !mt-6 !mb-3">3. Supabase Studio & Logs</h3>
              <p>Das Supabase Dashboard (Studio) bietet:</p>
              <ul className="list-disc pl-5">
                <li>
                  <strong>Table Editor</strong>: Direkter Zugriff auf Datenbanktabellen.
                </li>
                <li>
                  <strong>SQL Editor</strong>: Ausführen von SQL-Abfragen.
                </li>
                <li>
                  <strong>Auth Logs</strong>: Überwachung von Login-Versuchen etc.
                </li>
                <li>
                  <strong>API Logs</strong>: Logs für Datenbank-API-Aufrufe.
                </li>
              </ul>
              <p>
                Die Supabase CLI (<code>supabase logs --project-ref {"<ref>"}</code>) ermöglicht den Zugriff auf Logs
                der Supabase-Dienste.
              </p>

              <h3 className="!text-2xl !mt-6 !mb-3">4. Dedizierte Debug-Seiten</h3>
              <p>
                Im Admin-Bereich (<code>app/admin/*</code>) oder unter speziellen Debug-Routen (<code>app/debug/*</code>
                ) können Seiten für Entwicklungs- und Debugging-Zwecke erstellt werden:
              </p>
              <ul className="list-disc pl-5">
                <li>
                  <strong>
                    <code>app/debug/availability/page.tsx</code>
                  </strong>
                  : Überprüft die Verbindung zu externen Diensten (Supabase, OpenAI).
                  <div className="my-2 p-3 border rounded-md bg-slate-50 dark:bg-slate-800">
                    <AvailabilityCheckerContent />
                  </div>
                </li>
                <li>
                  <strong>
                    <code>app/debug/toggle-mock/page.tsx</code>
                  </strong>
                  : Ermöglicht das Umschalten zwischen echten Daten und Mock-Daten im Entwicklungsmodus.
                </li>
                <li>
                  <strong>
                    <code>app/debug/tech-docs/page.tsx</code>
                  </strong>
                  : Diese Seite hier!
                </li>
                <li>
                  <strong>
                    <code>app/debug/missing-features/page.tsx</code>
                  </strong>
                  : Eine Seite zur Analyse fehlender Features.
                </li>
                <li>
                  <strong>
                    <code>app/debug/deployment/page.tsx</code>
                  </strong>
                  : Eine Seite zur Überprüfung des Deployments.
                </li>
              </ul>

              <h3 className="!text-2xl !mt-6 !mb-3">5. Error Handling & Boundaries</h3>
              <ul className="list-disc pl-5">
                <li>
                  <strong>Next.js Error Handling</strong>: Nutzung von <code>error.tsx</code> für Fehler in
                  Routen-Segmenten und <code>global-error.tsx</code> für Root-Layout-Fehler.
                </li>
                <li>
                  <strong>React Error Boundaries</strong>: Für fein granulareres Error Handling innerhalb von
                  Komponenten-Teilbäumen.
                </li>
                <li>
                  <strong>Try-Catch Blöcke</strong>: Standardfehlerbehandlung in asynchronen Operationen und
                  API-Aufrufen.
                </li>
              </ul>

              <h3 className="!text-2xl !mt-6 !mb-3">6. TypeScript</h3>
              <p>
                Die strikte Typisierung von TypeScript hilft, viele Fehler bereits während der Entwicklung zu erkennen.
              </p>
            </section>

            <section id="testing" className="scroll-mt-20 mb-16 p-6 bg-card rounded-lg shadow">
              <h2 className="!text-3xl !mb-6 border-b pb-2">Testing-Strategie</h2>
              <p>Eine umfassende Testing-Strategie ist wichtig für die Codequalität und Stabilität.</p>

              <h3 className="!text-2xl !mt-6 !mb-3">1. Unit Tests</h3>
              <ul className="list-disc pl-5">
                <li>
                  <strong>Framework</strong>: Jest.
                </li>
                <li>
                  <strong>Fokus</strong>: Testen einzelner Funktionen, Komponenten-Logik (ohne UI-Rendering),
                  Utility-Funktionen.
                </li>
                <li>
                  <strong>Beispiele</strong>: Validierungslogik, Berechnungen (z.B. XP-Punkte), Hilfsfunktionen in{" "}
                  <code>lib/</code>.
                </li>
                <li>
                  <strong>Mocking</strong>: Supabase Client, externe API-Aufrufe und andere Abhängigkeiten werden
                  gemockt.
                </li>
              </ul>
              <pre>{`// __tests__/lib/utils.test.ts
import { cn, formatDate } from '@/lib/utils';

describe('Utility Functions', () => {
  it('cn should merge class names', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });
  it('formatDate should format date correctly', () => {
    expect(formatDate(new Date(2024, 0, 15))).toBe('15. Januar 2024');
  });
});`}</pre>

              <h3 className="!text-2xl !mt-6 !mb-3">2. Integration Tests / Komponenten-Tests</h3>
              <ul className="list-disc pl-5">
                <li>
                  <strong>Frameworks</strong>: Jest mit React Testing Library (RTL).
                </li>
                <li>
                  <strong>Fokus</strong>: Testen von React-Komponenten und deren Interaktion, Rendering, Event Handling,
                  State Updates. Testen, wie mehrere Einheiten zusammenarbeiten.
                </li>
                <li>
                  <strong>Beispiele</strong>: Testen eines Login-Formulars (Eingabe, Klick, erwartetes Verhalten),
                  Interaktion mit einem Erlebnis-Wizard, korrekte Anzeige von Daten in einer Komponente.
                </li>
                <li>
                  <strong>Mocking</strong>: API-Aufrufe (z.B. mit <code>msw</code> - Mock Service Worker) und Context
                  Provider werden gemockt oder mit Test-Implementierungen versehen.
                </li>
              </ul>
              <pre>{`// __tests__/components/auth/login-form.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '@/components/auth/login-form';
// Mocken von useRouter und AuthContext etc.

it('should display error on empty submission', async () => {
  render(<LoginForm />);
  fireEvent.click(screen.getByRole('button', { name: /anmelden/i }));
  // Erwarte Fehlermeldungen
});`}</pre>

              <h3 className="!text-2xl !mt-6 !mb-3">3. End-to-End (E2E) Tests (Optional/Zukünftig)</h3>
              <ul className="list-disc pl-5">
                <li>
                  <strong>Framework</strong>: Playwright oder Cypress.
                </li>
                <li>
                  <strong>Fokus</strong>: Testen kompletter User Flows durch die Anwendung im Browser, als ob ein echter
                  Nutzer interagiert.
                </li>
                <li>
                  <strong>Beispiele</strong>: Registrierungsprozess, Erstellen eines Erlebnisses von Anfang bis Ende,
                  Senden einer Chat-Nachricht.
                </li>
                <li>
                  <strong>Setup</strong>: Erfordert eine laufende Anwendung (lokal oder auf einer Staging-Umgebung) und
                  ggf. eine Test-Datenbank.
                </li>
              </ul>
              <p>
                <em>
                  Hinweis: E2E-Tests sind aufwendiger in Setup und Wartung und werden ggf. erst in späteren
                  Projektphasen intensiviert.
                </em>
              </p>

              <h3 className="!text-2xl !mt-6 !mb-3">Test-Ausführung & CI</h3>
              <ul className="list-disc pl-5">
                <li>
                  <strong>Lokale Ausführung</strong>: <code>npm run test</code> oder <code>npm run test:watch</code>.
                </li>
                <li>
                  <strong>CI-Pipeline</strong>: Tests werden automatisch als Teil der CI/CD-Pipeline (z.B. GitHub
                  Actions) ausgeführt, bevor ein Deployment erfolgt.
                </li>
                <li>
                  <strong>Coverage Reports</strong>: Generierung von Test-Coverage-Berichten (z.B. mit Jest's{" "}
                  <code>--coverage</code> Option), um ungetestete Codebereiche zu identifizieren.
                </li>
              </ul>
            </section>

            <section id="security" className="scroll-mt-20 mb-16 p-6 bg-card rounded-lg shadow">
              <h2 className="!text-3xl !mb-6 border-b pb-2">Sicherheitsaspekte</h2>
              <p>Sicherheit ist ein integraler Bestandteil der Entwicklung.</p>

              <h3 className="!text-2xl !mt-6 !mb-3">1. Authentifizierung & Autorisierung</h3>
              <ul className="list-disc pl-5">
                <li>
                  <strong>Starke Passwörter & OAuth</strong>: Durch Supabase Auth erzwungen/angeboten.
                </li>
                <li>
                  <strong>Row Level Security (RLS)</strong>: Primärer Mechanismus zur Datenzugriffskontrolle (siehe
                  "Datenbankschema").
                </li>
                <li>
                  <strong>Serverseitige Validierung von Berechtigungen</strong>: Zusätzlich zu RLS wird in API Routes
                  und Server Actions geprüft, ob der Nutzer die angeforderte Aktion ausführen darf.
                </li>
                <li>
                  <strong>Schutz vor Brute-Force-Angriffen</strong>: Supabase Auth bietet eingebaute Schutzmechanismen.
                </li>
              </ul>

              <h3 className="!text-2xl !mt-6 !mb-3">2. Input Validation & Sanitization</h3>
              <ul className="list-disc pl-5">
                <li>
                  <strong>Serverseitige Validierung</strong>: Alle Benutzereingaben werden serverseitig validiert (z.B.
                  mit Zod in API Routes), auch wenn bereits clientseitig validiert wurde.
                </li>
                <li>
                  <strong>Schutz vor XSS (Cross-Site Scripting)</strong>:
                  <ul>
                    <li>React rendert standardmäßig keine rohen HTML-Strings, was viele XSS-Vektoren verhindert.</li>
                    <li>
                      Bei expliziter Nutzung von <code>dangerouslySetInnerHTML</code> (z.B. für Rich-Text-Inhalte) wird
                      der Inhalt serverseitig mit Bibliotheken wie <code>DOMPurify</code> bereinigt.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Schutz vor SQL-Injection</strong>: Durch die Verwendung des Supabase Clients und
                  parametrisierter Abfragen (oder ORM-ähnlicher Methoden) wird SQL-Injection weitgehend verhindert.
                  Direkte SQL-Konstruktion mit Benutzereingaben wird vermieden.
                </li>
              </ul>

              <h3 className="!text-2xl !mt-6 !mb-3">3. API-Sicherheit</h3>
              <ul className="list-disc pl-5">
                <li>
                  <strong>Rate Limiting</strong>: Implementierung von Rate Limiting für API-Endpunkte, um Missbrauch zu
                  verhindern (z.B. mit <code>@upstash/ratelimit</code> oder einer eigenen Lösung).
                </li>
                <li>
                  <strong>HTTPS</strong>: Ausschließlich Verwendung von HTTPS (durch Vercel erzwungen).
                </li>
                <li>
                  <strong>CORS-Konfiguration</strong>: Korrekte Konfiguration von Cross-Origin Resource Sharing, falls
                  die API von anderen Domains genutzt werden soll (Standard Next.js API Routes sind Same-Origin).
                </li>
              </ul>

              <h3 className="!text-2xl !mt-6 !mb-3">4. Security Headers</h3>
              <p>
                Einsatz von Security Headers (z.B. Content Security Policy (CSP), X-Content-Type-Options,
                X-Frame-Options, Referrer-Policy) über die Next.js Konfiguration (<code>next.config.mjs</code>), um
                verschiedene Angriffsvektoren zu mitigieren.
              </p>
              <pre>{`// next.config.mjs (Auszug)
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Weitere Header...
]
module.exports = { async headers() { return [{ source: '/(.*)', headers: securityHeaders }] }`}</pre>

              <h3 className="!text-2xl !mt-6 !mb-3">5. Abhängigkeitsmanagement</h3>
              <p>
                Regelmäßige Überprüfung und Aktualisierung von Abhängigkeiten (<code>npm audit</code>, Dependabot), um
                bekannte Schwachstellen zu beheben.
              </p>

              <h3 className="!text-2xl !mt-6 !mb-3">6. Secrets Management</h3>
              <p>
                Sichere Verwaltung von API-Keys und anderen Geheimnissen über Vercel Environment Variables. Keine harten
                Kodierungen von Secrets im Code.
              </p>
            </section>

            <section id="conclusion" className="scroll-mt-20 mb-16 p-6 bg-card rounded-lg shadow">
              <h2 className="!text-3xl !mb-6 border-b pb-2">Fazit & Ausblick</h2>
              <p>
                XP Share ist ein ambitioniertes Projekt mit einer soliden technischen Grundlage. Die gewählte
                Architektur mit Next.js und Supabase ermöglicht eine schnelle Entwicklung und Skalierbarkeit. Die
                KI-Integration bietet erhebliches Potenzial für einzigartige Nutzererlebnisse.
              </p>
              <h3 className="!text-2xl !mt-6 !mb-3">Aktueller Stand & Stärken</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Kernfunktionalitäten für Erlebnis-Management, XP-Buch und Community sind konzipiert und teilweise
                  implementiert.
                </li>
                <li>Moderne, performante Technologie-Stack.</li>
                <li>Gute Grundlage für KI-gestützte Features.</li>
                <li>Skalierbarkeit durch Serverless-Architektur und BaaS.</li>
              </ul>
              <h3 className="!text-2xl !mt-6 !mb-3">Zukünftige Entwicklung & Herausforderungen</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Vollständige Implementierung aller Features</strong>: Insbesondere Community-Management,
                  erweiterte Gamification und komplexe KI-Analysen.
                </li>
                <li>
                  <strong>Testing-Abdeckung</strong>: Ausbau der Unit- und Integrationstests, Einführung von E2E-Tests.
                </li>
                <li>
                  <strong>Performance-Feintuning</strong>: Kontinuierliche Überwachung und Optimierung, insbesondere bei
                  steigenden Nutzerzahlen und Datenmengen.
                </li>
                <li>
                  <strong>Offline-Synchronisation</strong>: Robuste Implementierung der Konfliktlösung.
                </li>
                <li>
                  <strong>Skalierung der KI-Kosten</strong>: Effiziente Nutzung der OpenAI API und Caching-Strategien.
                </li>
                <li>
                  <strong>Datenschutz & DSGVO</strong>: Kontinuierliche Sicherstellung der Konformität, insbesondere bei
                  KI-Analysen.
                </li>
                <li>
                  <strong>Mobile Optimierung</strong>: Ggf. Entwicklung einer PWA oder nativer Apps.
                </li>
              </ul>
              <p>
                Diese technische Dokumentation dient als lebendiges Dokument und wird parallel zur Weiterentwicklung des
                Projekts aktualisiert.
              </p>
            </section>
          </article>
        </main>
      </div>
    </div>
  )
}
