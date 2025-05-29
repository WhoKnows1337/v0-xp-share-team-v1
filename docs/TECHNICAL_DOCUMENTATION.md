# XP Share - Technische Projektdokumentation

## Inhaltsverzeichnis

1. [Projektübersicht](#projektübersicht)
2. [Architektur](#architektur)
3. [Technologie-Stack](#technologie-stack)
4. [Datenbankschema](#datenbankschema)
5. [API-Dokumentation](#api-dokumentation)
6. [Authentifizierung & Autorisierung](#authentifizierung--autorisierung)
7. [Core Features](#core-features)
8. [Services & Utilities](#services--utilities)
9. [Frontend-Architektur](#frontend-architektur)
10. [KI-Integration](#ki-integration)
11. [Real-time Features](#real-time-features)
12. [Offline-Funktionalität](#offline-funktionalität)
13. [Performance & Optimierung](#performance--optimierung)
14. [Deployment](#deployment)
15. [Debugging & Entwicklung](#debugging--entwicklung)
16. [Testing](#testing)
17. [Sicherheit](#sicherheit)

---

## Projektübersicht

**XP Share** ist eine moderne Web-Plattform für das Teilen und Verwalten von Lebenserfahrungen. Die Anwendung ermöglicht es Benutzern, ihre Erlebnisse zu dokumentieren, zu kategorisieren und mit einer Community zu teilen.

### Kernfunktionalitäten
- **Erlebnis-Management**: Erstellen, bearbeiten und teilen von Erfahrungen
- **XP-Buch**: Persönliches Journal für private Einträge
- **Community-Features**: Gruppen, Diskussionen, Events
- **Gamification**: XP-System, Achievements, Quests
- **KI-Integration**: Automatische Analyse, Empfehlungen, semantische Suche
- **Real-time Messaging**: Chat-System mit Channels
- **Referral-System**: Einladungen und Belohnungen

---

## Architektur

### Gesamtarchitektur
\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   (Supabase)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Components │    │   Services      │    │   Storage       │
│   (React/TSX)   │    │   (Business     │    │   (Files/Media) │
│                 │    │    Logic)       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
\`\`\`

### Ordnerstruktur
\`\`\`
xp-share/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── (auth)/            # Auth-spezifische Seiten
│   ├── dashboard/         # Dashboard-Bereich
│   ├── admin/             # Admin-Bereich
│   └── ...               # Weitere Seiten
├── components/            # React-Komponenten
│   ├── ui/               # Basis-UI-Komponenten
│   ├── dashboard/        # Dashboard-spezifisch
│   ├── auth/             # Authentifizierung
│   └── ...              # Feature-spezifische Komponenten
├── lib/                  # Utilities und Services
│   ├── ai/              # KI-Services
│   ├── server/          # Server-seitige Utilities
│   └── ...              # Weitere Services
├── types/               # TypeScript-Typdefinitionen
├── hooks/               # Custom React Hooks
├── contexts/            # React Contexts
└── docs/               # Dokumentation
\`\`\`

---

## Technologie-Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Context + Hooks
- **Forms**: React Hook Form
- **TypeScript**: Vollständige Typisierung

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Realtime

### KI & Machine Learning
- **AI SDK**: Vercel AI SDK
- **LLM Provider**: OpenAI (GPT-4)
- **Embeddings**: OpenAI Embeddings
- **Vector Database**: Supabase Vector (pgvector)

### Development Tools
- **Language**: TypeScript
- **Package Manager**: npm/yarn
- **Linting**: ESLint
- **Formatting**: Prettier
- **Version Control**: Git

---

## Datenbankschema

### Haupttabellen

#### users
\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  username VARCHAR UNIQUE NOT NULL,
  display_name VARCHAR,
  avatar_url VARCHAR,
  bio TEXT,
  experience_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  is_premium BOOLEAN DEFAULT false,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

#### experiences
\`\`\`sql
CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  category VARCHAR,
  tags TEXT[],
  location VARCHAR,
  date DATE,
  is_public BOOLEAN DEFAULT true,
  privacy_level VARCHAR DEFAULT 'public',
  media_urls TEXT[],
  emotions TEXT[],
  experience_rating INTEGER,
  weather VARCHAR,
  mood_before INTEGER,
  mood_after INTEGER,
  insights TEXT[],
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

#### xp_entries
\`\`\`sql
CREATE TABLE xp_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR DEFAULT 'reflection',
  mood VARCHAR,
  tags TEXT[],
  date DATE NOT NULL,
  private BOOLEAN DEFAULT true,
  draft BOOLEAN DEFAULT false,
  media_urls TEXT[],
  location VARCHAR,
  weather VARCHAR,
  insights TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

#### groups
\`\`\`sql
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  description TEXT,
  avatar_url VARCHAR,
  is_private BOOLEAN DEFAULT false,
  category VARCHAR,
  location VARCHAR,
  owner_id UUID REFERENCES users(id),
  member_count INTEGER DEFAULT 1,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

#### messages
\`\`\`sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id),
  recipient_id UUID REFERENCES users(id),
  channel_id UUID,
  content TEXT NOT NULL,
  type VARCHAR DEFAULT 'text',
  media_url VARCHAR,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### Indizes und Constraints
\`\`\`sql
-- Performance-Indizes
CREATE INDEX idx_experiences_author ON experiences(author_id);
CREATE INDEX idx_experiences_category ON experiences(category);
CREATE INDEX idx_experiences_date ON experiences(date);
CREATE INDEX idx_experiences_public ON experiences(is_public);
CREATE INDEX idx_xp_entries_user ON xp_entries(user_id);
CREATE INDEX idx_xp_entries_date ON xp_entries(date);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);

-- Volltext-Suche
CREATE INDEX idx_experiences_search ON experiences USING gin(to_tsvector('german', title || ' ' || description || ' ' || content));
CREATE INDEX idx_xp_entries_search ON xp_entries USING gin(to_tsvector('german', title || ' ' || content));
\`\`\`

---

## API-Dokumentation

### Authentifizierung

Alle API-Endpunkte verwenden Bearer Token Authentication über Supabase Auth.

\`\`\`typescript
// Header-Format
Authorization: Bearer <supabase_access_token>
\`\`\`

### Basis-URL
\`\`\`
Production: https://your-domain.com/api
Development: http://localhost:3000/api
\`\`\`

### Experiences API

#### GET /api/experiences
Holt eine Liste von Erlebnissen.

**Query Parameters:**
- `limit` (number, optional): Anzahl der Ergebnisse (default: 10)
- `offset` (number, optional): Offset für Pagination (default: 0)
- `userId` (string, optional): Filter nach Benutzer-ID
- `category` (string, optional): Filter nach Kategorie
- `tags` (string, optional): Komma-getrennte Liste von Tags
- `q` (string, optional): Suchbegriff
- `orderBy` (string, optional): Sortierfeld (default: created_at)
- `orderDirection` (string, optional): asc/desc (default: desc)

**Response:**
\`\`\`json
{
  "experiences": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "content": "string",
      "author_id": "uuid",
      "author_name": "string",
      "category": "string",
      "tags": ["string"],
      "location": "string",
      "date": "2024-01-15",
      "is_public": true,
      "media_urls": ["string"],
      "emotions": ["string"],
      "experience_rating": 5,
      "likes_count": 0,
      "comments_count": 0,
      "created_at": "2024-01-15T10:00:00Z"
    }
  ],
  "count": 100
}
\`\`\`

#### POST /api/experiences
Erstellt ein neues Erlebnis.

**Request Body:**
\`\`\`json
{
  "title": "string",
  "description": "string",
  "content": "string",
  "category": "string",
  "tags": ["string"],
  "location": "string",
  "date": "2024-01-15",
  "is_public": true,
  "media_urls": ["string"],
  "emotions": ["string"],
  "experience_rating": 5,
  "weather": "string",
  "mood_before": 7,
  "mood_after": 9,
  "insights": ["string"]
}
\`\`\`

#### GET /api/experiences/[id]
Holt ein spezifisches Erlebnis.

#### PUT /api/experiences/[id]
Aktualisiert ein Erlebnis (nur Autor).

#### DELETE /api/experiences/[id]
Löscht ein Erlebnis (nur Autor).

### XP Entries API

#### GET /api/xp-entries
Holt XP-Einträge des authentifizierten Benutzers.

**Query Parameters:**
- `limit`, `offset`: Pagination
- `tags`: Filter nach Tags
- `mood`: Filter nach Stimmung
- `private`: Filter nach Privatsphäre
- `draft`: Filter nach Entwürfen
- `q`: Suchbegriff

#### POST /api/xp-entries
Erstellt einen neuen XP-Eintrag.

**Request Body:**
\`\`\`json
{
  "title": "string",
  "content": "string",
  "type": "reflection",
  "mood": "happy",
  "tags": ["string"],
  "date": "2024-01-15",
  "private": true,
  "draft": false,
  "location": "string",
  "weather": "string"
}
\`\`\`

### AI API

#### POST /api/ai/analyze
Analysiert Text mit KI.

**Request Body:**
\`\`\`json
{
  "type": "patterns|summary|emotions|suggestions",
  "data": {
    "text": "string",
    "entries": [],
    "context": {}
  },
  "userId": "uuid"
}
\`\`\`

#### POST /api/ai/embeddings
Erstellt Embeddings oder führt semantische Suche durch.

**Request Body:**
\`\`\`json
{
  "text": "string",
  "action": "create|search"
}
\`\`\`

### Media API

#### POST /api/media/upload
Lädt eine Mediendatei hoch.

**Request:** Multipart Form Data
- `file`: Die hochzuladende Datei
- `folder`: Zielordner (optional)

**Response:**
\`\`\`json
{
  "id": "uuid",
  "filename": "string",
  "url": "string",
  "type": "image|video|audio",
  "size": 1024000,
  "metadata": {
    "width": 800,
    "height": 600
  }
}
\`\`\`

---

## Authentifizierung & Autorisierung

### Supabase Auth Integration

\`\`\`typescript
// Client-seitige Authentifizierung
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Anmeldung
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// Registrierung
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    data: {
      username: 'username'
    }
  }
})
\`\`\`

### Server-seitige Authentifizierung

\`\`\`typescript
// lib/server/supabase-server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerSupabaseClient() {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}
\`\`\`

### Autorisierung

#### Row Level Security (RLS)
\`\`\`sql
-- Beispiel: Nur Autoren können ihre Erlebnisse bearbeiten
CREATE POLICY "Users can update own experiences" ON experiences
  FOR UPDATE USING (auth.uid() = author_id);

-- Öffentliche Erlebnisse sind für alle sichtbar
CREATE POLICY "Public experiences are viewable by everyone" ON experiences
  FOR SELECT USING (is_public = true);

-- Private Erlebnisse nur für Autoren
CREATE POLICY "Private experiences only for authors" ON experiences
  FOR SELECT USING (auth.uid() = author_id OR is_public = true);
\`\`\`

#### Middleware
\`\`\`typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  // Geschützte Routen
  if (req.nextUrl.pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  // Admin-Routen
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session || !session.user.user_metadata?.is_admin) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }
  
  return res
}
\`\`\`

---

## Core Features

### 1. Erlebnis-Management

#### Erlebnis-Wizard
\`\`\`typescript
// components/erlebnis-wizard.tsx
export interface ErlebnisData {
  titel: string
  beschreibung: string
  kategorie: string
  ort: string
  datum: string
  emotionen: string[]
  tags: string[]
  medien: File[]
  privatsphaere: 'public' | 'friends' | 'private'
}

const steps = [
  'titel',
  'beschreibung', 
  'kategorie',
  'datum-ort',
  'emotionen',
  'tags',
  'medien',
  'privatsphaere'
]
\`\`\`

#### KI-Analyse Integration
\`\`\`typescript
// Automatische Analyse beim Speichern
const analyzeExperience = async (content: string) => {
  const analysis = await aiService.analyzeExperience(content)
  
  return {
    sentiment: analysis.sentiment,
    emotions: analysis.emotions,
    keywords: analysis.keywords,
    categories: analysis.categories,
    insights: analysis.insights
  }
}
\`\`\`

### 2. XP-Buch (Persönliches Journal)

#### Eintrag-Typen
- **Reflexion**: Persönliche Gedanken und Erkenntnisse
- **Dankbarkeit**: Dankbarkeitstagebuch
- **Ziele**: Ziele und Fortschritte
- **Träume**: Traumtagebuch
- **Gewohnheiten**: Habit-Tracking

#### Offline-Synchronisation
\`\`\`typescript
// hooks/use-offline-xp-sync.ts
export function useOfflineXPSync() {
  const syncPendingEntries = async () => {
    const pendingEntries = offlineService.getQueuedActions()
      .filter(action => action.entity === 'xp_entry')
    
    for (const entry of pendingEntries) {
      try {
        await xpEntryService.create(entry.data)
        offlineService.markActionSynced(entry.id)
      } catch (error) {
        console.error('Sync failed:', error)
      }
    }
  }
  
  return { syncPendingEntries }
}
\`\`\`

### 3. Community-Features

#### Gruppen-Management
\`\`\`typescript
// lib/group-service.ts
export interface Group {
  id: string
  name: string
  description: string
  is_private: boolean
  member_count: number
  category: string
  owner_id: string
  tags: string[]
}

export const groupService = {
  async create(group: Omit<Group, 'id' | 'member_count'>): Promise<Group>,
  async join(groupId: string, userId: string): Promise<void>,
  async leave(groupId: string, userId: string): Promise<void>,
  async getMembers(groupId: string): Promise<GroupMember[]>
}
\`\`\`

#### Event-System
\`\`\`typescript
// Gruppen-Events
export interface GroupEvent {
  id: string
  group_id: string
  title: string
  description: string
  date: string
  location: string
  max_participants?: number
  participants: string[]
}
\`\`\`

### 4. Messaging-System

#### Real-time Chat
\`\`\`typescript
// lib/realtime-service.ts
export class RealtimeService {
  subscribe(channelName: string, callback: (message: RealtimeMessage) => void) {
    const channel = this.client
      .channel(channelName)
      .on('broadcast', { event: '*' }, callback)
      .subscribe()
    
    return () => channel.unsubscribe()
  }
  
  async broadcast(channelName: string, event: string, payload: any) {
    const channel = this.channels.get(channelName)
    await channel?.send({ type: 'broadcast', event, payload })
  }
}
\`\`\`

#### Channel-Typen
- **Direct Messages**: 1:1 Nachrichten
- **Group Channels**: Gruppen-Chat
- **Topic Channels**: Themen-spezifische Diskussionen

### 5. Gamification

#### XP-System
\`\`\`typescript
// lib/xp-system.ts
export const XP_REWARDS = {
  CREATE_EXPERIENCE: 10,
  DAILY_LOGIN: 5,
  COMPLETE_PROFILE: 25,
  FIRST_COMMENT: 15,
  SHARE_EXPERIENCE: 20,
  INVITE_FRIEND: 50
}

export const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 100)) + 1
}
\`\`\`

#### Achievement-System
\`\`\`typescript
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  xp_reward: number
  requirements: {
    type: 'count' | 'streak' | 'specific'
    target: number
    action: string
  }
}

const ACHIEVEMENTS = [
  {
    id: 'first_experience',
    name: 'Erste Schritte',
    description: 'Dein erstes Erlebnis geteilt',
    xp_reward: 25,
    requirements: { type: 'count', target: 1, action: 'create_experience' }
  }
]
\`\`\`

#### Quest-System
\`\`\`typescript
export interface Quest {
  id: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'monthly' | 'special'
  xp_reward: number
  requirements: QuestRequirement[]
  expires_at?: string
}
\`\`\`

---

## Services & Utilities

### 1. KI-Services

#### Embedding-Service
\`\`\`typescript
// lib/ai/embedding-service.ts
export async function createEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    encoding_format: 'float'
  })
  
  return {
    embedding: response.data[0].embedding,
    usage: response.usage
  }
}
\`\`\`

#### Pattern-Recognition
\`\`\`typescript
// lib/ai/pattern-recognition.ts
export async function analyzePatterns(entries: XPEntry[]) {
  const patterns = {
    temporal: analyzeTemporalPatterns(entries),
    emotional: analyzeEmotionalPatterns(entries),
    location: analyzeLocationPatterns(entries),
    activity: analyzeActivityPatterns(entries)
  }
  
  return {
    patterns,
    trends: calculateTrends(patterns),
    recommendations: generateRecommendations(patterns)
  }
}
\`\`\`

#### Semantic Search
\`\`\`typescript
// lib/ai/semantic-search.ts
export async function semanticSearch(query: string, limit = 10) {
  const queryEmbedding = await createEmbedding(query)
  
  const { data, error } = await supabase.rpc('match_experiences', {
    query_embedding: queryEmbedding.embedding,
    match_threshold: 0.7,
    match_count: limit
  })
  
  return data
}
\`\`\`

### 2. Media-Service

#### Upload-Handling
\`\`\`typescript
// lib/media-service.ts
export class MediaService {
  async uploadFile(file: File, folder = 'uploads'): Promise<MediaFile> {
    // Validierung
    this.validateFile(file)
    
    // Komprimierung für Bilder
    const processedFile = await this.processFile(file)
    
    // Upload zu Supabase Storage
    const { data, error } = await supabase.storage
      .from('media')
      .upload(filePath, processedFile)
    
    // Metadaten extrahieren und speichern
    const metadata = await this.extractMetadata(processedFile)
    
    return this.saveFileRecord(data.path, metadata)
  }
  
  private async processFile(file: File): Promise<File> {
    if (file.type.startsWith('image/')) {
      return this.compressImage(file)
    }
    return file
  }
}
\`\`\`

### 3. Notification-Service

#### Push-Notifications
\`\`\`typescript
// lib/notifications/push-service.ts
export class PushNotificationService {
  async sendNotification(userId: string, notification: {
    title: string
    body: string
    data?: any
  }) {
    // Web Push API Integration
    const subscription = await this.getUserSubscription(userId)
    
    if (subscription) {
      await webpush.sendNotification(subscription, JSON.stringify(notification))
    }
    
    // Interne Benachrichtigung erstellen
    await notificationService.create({
      user_id: userId,
      type: 'system',
      title: notification.title,
      message: notification.body,
      data: notification.data,
      read: false
    })
  }
}
\`\`\`

### 4. Search-Service

#### Hybrid-Suche
\`\`\`typescript
// lib/search-service.ts
export class SearchService {
  async search(query: string, filters?: SearchFilters, useAI = false) {
    if (useAI) {
      return this.semanticSearch(query, filters)
    } else {
      return this.textSearch(query, filters)
    }
  }
  
  private async textSearch(query: string, filters?: SearchFilters) {
    let queryBuilder = supabase
      .from('experiences')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    
    // Filter anwenden
    if (filters?.category) {
      queryBuilder = queryBuilder.eq('category', filters.category)
    }
    
    return queryBuilder
  }
}
\`\`\`

---

## Frontend-Architektur

### 1. Komponenten-Hierarchie

\`\`\`
App Layout
├── Navigation
│   ├── Main Navigation
│   ├── User Menu
│   └── Notifications
├── Sidebar (Dashboard)
│   ├── Navigation Items
│   ├── Quick Actions
│   └── Status Indicators
├── Main Content
│   ├── Page Header
│   ├── Content Area
│   └── Action Buttons
└── Modals/Dialogs
    ├── Erlebnis Wizard
    ├── Settings
    └── Confirmations
\`\`\`

### 2. State Management

#### Context-basierte Architektur
\`\`\`typescript
// contexts/auth-context.tsx
export const AuthContext = createContext<{
  user: User | null
  session: Session | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  loading: boolean
}>()

// contexts/xp-buch-context.tsx
export const XPBuchContext = createContext<{
  entries: XPEntry[]
  createEntry: (entry: Partial<XPEntry>) => Promise<void>
  updateEntry: (id: string, updates: Partial<XPEntry>) => Promise<void>
  deleteEntry: (id: string) => Promise<void>
  loading: boolean
}>()
\`\`\`

#### Custom Hooks
\`\`\`typescript
// hooks/use-experiences.ts
export function useExperiences(filters?: ExperienceFilters) {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const fetchExperiences = useCallback(async () => {
    try {
      setLoading(true)
      const data = await experienceService.getAll(filters)
      setExperiences(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filters])
  
  useEffect(() => {
    fetchExperiences()
  }, [fetchExperiences])
  
  return { experiences, loading, error, refetch: fetchExperiences }
}
\`\`\`

### 3. UI-Komponenten

#### Design System
\`\`\`typescript
// components/ui/button.tsx
export interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

// Verwendung von shadcn/ui als Basis
// Anpassungen über Tailwind CSS
\`\`\`

#### Responsive Design
\`\`\`typescript
// hooks/use-mobile.tsx
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkDevice()
    window.addEventListener('resize', checkDevice)
    
    return () => window.removeEventListener('resize', checkDevice)
  }, [])
  
  return isMobile
}
\`\`\`

---

## KI-Integration

### 1. OpenAI Integration

#### Konfiguration
\`\`\`typescript
// lib/ai/config.ts
import { OpenAI } from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID
})

export const AI_MODELS = {
  CHAT: 'gpt-4o-mini',
  EMBEDDINGS: 'text-embedding-3-small',
  VISION: 'gpt-4-vision-preview'
}
\`\`\`

#### Text-Analyse
\`\`\`typescript
// lib/ai/intelligent-summary.ts
export async function generateMultiEntrySummary(
  entries: XPEntry[], 
  timeframe: string
) {
  const prompt = `
    Analysiere die folgenden ${entries.length} Tagebucheinträge aus dem Zeitraum ${timeframe}.
    Erstelle eine zusammenfassende Analyse der wichtigsten Themen, Emotionen und Entwicklungen.
    
    Einträge:
    ${entries.map(entry => `${entry.date}: ${entry.content}`).join('\n\n')}
    
    Bitte strukturiere die Antwort wie folgt:
    1. Hauptthemen
    2. Emotionale Entwicklung
    3. Wichtige Erkenntnisse
    4. Empfehlungen
  `
  
  const { text } = await generateText({
    model: openai(AI_MODELS.CHAT),
    prompt,
    temperature: 0.7
  })
  
  return text
}
\`\`\`

### 2. Vector Database

#### Supabase Vector Extension
\`\`\`sql
-- Aktiviere pgvector Extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Erstelle Embeddings-Tabelle
CREATE TABLE experience_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID REFERENCES experiences(id),
  embedding vector(1536),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index für Ähnlichkeitssuche
CREATE INDEX ON experience_embeddings USING ivfflat (embedding vector_cosine_ops);
\`\`\`

#### Similarity Search Function
\`\`\`sql
CREATE OR REPLACE FUNCTION match_experiences(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  title text,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    e.id,
    e.title,
    1 - (ee.embedding <=> query_embedding) as similarity
  FROM experience_embeddings ee
  JOIN experiences e ON ee.experience_id = e.id
  WHERE 1 - (ee.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;
\`\`\`

### 3. Batch Processing

#### Background Jobs
\`\`\`typescript
// lib/ai/batch-processor.ts
export class AIBatchProcessor {
  private queue: Array<{
    id: string
    type: 'embedding' | 'analysis' | 'summary'
    data: any
    priority: number
  }> = []
  
  async processQueue() {
    // Sortiere nach Priorität
    this.queue.sort((a, b) => b.priority - a.priority)
    
    for (const job of this.queue) {
      try {
        await this.processJob(job)
        this.removeFromQueue(job.id)
      } catch (error) {
        console.error(`Job ${job.id} failed:`, error)
        // Retry-Logik implementieren
      }
    }
  }
  
  private async processJob(job: any) {
    switch (job.type) {
      case 'embedding':
        return this.createEmbedding(job.data)
      case 'analysis':
        return this.analyzeContent(job.data)
      case 'summary':
        return this.generateSummary(job.data)
    }
  }
}
\`\`\`

---

## Real-time Features

### 1. Supabase Realtime

#### Channel-Konfiguration
\`\`\`typescript
// lib/realtime-service.ts
export class RealtimeService {
  private client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    }
  )
  
  subscribeToMessages(channelId: string, callback: (message: Message) => void) {
    return this.client
      .channel(`messages:${channelId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `channel_id=eq.${channelId}`
      }, callback)
      .subscribe()
  }
}
\`\`\`

### 2. Live Activity Feed

#### Real-time Updates
\`\`\`typescript
// components/realtime/live-activity-feed.tsx
export function LiveActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([])
  
  useEffect(() => {
    const channel = supabase
      .channel('activity_feed')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'activities'
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setActivities(prev => [payload.new as Activity, ...prev])
        }
      })
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
  
  return (
    <div className="space-y-4">
      {activities.map(activity => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </div>
  )
}
\`\`\`

### 3. Typing Indicators

\`\`\`typescript
// components/realtime/typing-indicator.tsx
export function useTypingIndicator(channelId: string) {
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  
  const sendTyping = useCallback((isTyping: boolean) => {
    realtimeService.sendTyping(channelId, currentUser.id, isTyping)
  }, [channelId])
  
  useEffect(() => {
    const unsubscribe = realtimeService.subscribe(
      channelId,
      (message) => {
        if (message.type === 'user_typing') {
          const { userId, isTyping } = message.payload
          
          setTypingUsers(prev => {
            if (isTyping && !prev.includes(userId)) {
              return [...prev, userId]
            } else if (!isTyping) {
              return prev.filter(id => id !== userId)
            }
            return prev
          })
        }
      }
    )
    
    return unsubscribe
  }, [channelId])
  
  return { typingUsers, sendTyping }
}
\`\`\`

---

## Offline-Funktionalität

### 1. Service Worker

#### Caching-Strategie
\`\`\`typescript
// public/sw.js
const CACHE_NAME = 'xp-share-v1'
const urlsToCache = [
  '/',
  '/dashboard',
  '/static/js/bundle.js',
  '/static/css/main.css'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response
        }
        return fetch(event.request)
      })
  )
})
\`\`\`

### 2. Offline Queue

#### Action Queue
\`\`\`typescript
// lib/offline-service.ts
export interface OfflineAction {
  id: string
  type: 'create' | 'update' | 'delete'
  entity: 'experience' | 'xp_entry' | 'comment'
  data: any
  timestamp: string
  synced: boolean
}

export class OfflineService {
  async queueAction(action: Omit<OfflineAction, 'id' | 'timestamp' | 'synced'>) {
    const offlineAction: OfflineAction = {
      ...action,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      synced: false
    }
    
    const actions = this.getQueuedActions()
    actions.push(offlineAction)
    localStorage.setItem('offline_actions', JSON.stringify(actions))
    
    return offlineAction
  }
  
  async syncActions() {
    const actions = this.getQueuedActions()
    const pendingActions = actions.filter(action => !action.synced)
    
    for (const action of pendingActions) {
      try {
        await this.syncSingleAction(action)
        this.markActionSynced(action.id)
      } catch (error) {
        console.error(`Sync failed for action ${action.id}:`, error)
      }
    }
  }
}
\`\`\`

### 3. Background Sync

\`\`\`typescript
// hooks/use-offline-sync.ts
export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [pendingActions, setPendingActions] = useState(0)
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      offlineService.syncActions()
    }
    
    const handleOffline = () => {
      setIsOnline(false)
    }
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
  
  return { isOnline, pendingActions }
}
\`\`\`

---

## Performance & Optimierung

### 1. Code Splitting

#### Dynamic Imports
\`\`\`typescript
// Lazy Loading von Komponenten
const ErlebnisWizard = dynamic(() => import('@/components/erlebnis-wizard'), {
  loading: () => <div>Lädt...</div>,
  ssr: false
})

const AdminDashboard = dynamic(() => import('@/components/admin/dashboard'), {
  loading: () => <AdminSkeleton />
})
\`\`\`

#### Route-based Splitting
\`\`\`typescript
// app/layout.tsx - Nur kritische Komponenten laden
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <Suspense fallback={<LoadingSpinner />}>
          <AuthProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  )
}
\`\`\`

### 2. Caching

#### React Query Integration
\`\`\`typescript
// lib/performance/caching.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 Minuten
      cacheTime: 10 * 60 * 1000, // 10 Minuten
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
    }
  }
})

// Verwendung in Komponenten
export function useExperiences() {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: () => experienceService.getAll(),
    staleTime: 5 * 60 * 1000
  })
}
\`\`\`

#### Memory Management
\`\`\`typescript
// hooks/use-infinite-scroll.ts
export function useInfiniteScroll<T>(
  fetchFn: (page: number) => Promise<T[]>,
  options: { pageSize: number; threshold: number } = { pageSize: 10, threshold: 0.8 }
) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    
    setLoading(true)
    try {
      const newItems = await fetchFn(page)
      
      if (newItems.length < options.pageSize) {
        setHasMore(false)
      }
      
      setItems(prev => [...prev, ...newItems])
      setPage(prev => prev + 1)
    } catch (error) {
      console.error('Failed to load more items:', error)
    } finally {
      setLoading(false)
    }
  }, [fetchFn, page, loading, hasMore, options.pageSize])
  
  return { items, loading, hasMore, loadMore }
}
\`\`\`

### 3. Bundle Optimization

#### Webpack Konfiguration
\`\`\`typescript
// next.config.mjs
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@supabase/supabase-js']
  },
  
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true
          }
        }
      }
    }
    
    return config
  }
}
\`\`\`

---

## Deployment

### 1. Vercel Deployment

#### Konfiguration
\`\`\`json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-role-key",
    "OPENAI_API_KEY": "@openai-api-key"
  }
}
\`\`\`

#### Environment Variables
\`\`\`bash
# .env.local (Development)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Production (Vercel Environment Variables)
NEXT_PUBLIC_SUPABASE_URL=production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=production_anon_key
SUPABASE_SERVICE_ROLE_KEY=production_service_role_key
OPENAI_API_KEY=production_openai_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
\`\`\`

### 2. Database Migration

#### Supabase Migrations
\`\`\`sql
-- migrations/001_initial_schema.sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  username VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- migrations/002_add_experiences.sql
CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

#### Deployment Script
\`\`\`bash
#!/bin/bash
# deploy.sh

echo "Starting deployment..."

# Build the application
npm run build

# Run database migrations
npx supabase db push

# Deploy to Vercel
vercel --prod

echo "Deployment completed!"
\`\`\`

### 3. Monitoring

#### Error Tracking
\`\`\`typescript
// lib/monitoring.ts
export function initMonitoring() {
  if (process.env.NODE_ENV === 'production') {
    // Sentry Integration
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.1
    })
  }
}

// Error Boundary
export class ErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(error, { extra: errorInfo })
    }
  }
}
\`\`\`

---

## Debugging & Entwicklung

### 1. Debug-Tools

#### Mock Data Toggle
\`\`\`typescript
// lib/config.ts
export const config = {
  useMockData: process.env.NODE_ENV === 'development' || 
               process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true',
  
  features: {
    enableAI: process.env.OPENAI_API_KEY !== undefined,
    enableRealtime: true,
    enableOffline: true
  }
}

// components/debug/toggle-mock-data.tsx
export function ToggleMockData() {
  const [useMock, setUseMock] = useState(config.useMockData)
  
  const toggleMockData = async () => {
    const response = await fetch('/api/toggle-mock-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: !useMock })
    })
    
    if (response.ok) {
      setUseMock(!useMock)
      window.location.reload()
    }
  }
  
  return (
    <Button onClick={toggleMockData}>
      {useMock ? 'Disable' : 'Enable'} Mock Data
    </Button>
  )
}
\`\`\`

#### Feature Availability Checker
\`\`\`typescript
// components/debug/availability-checker.tsx
export function AvailabilityChecker() {
  const [status, setStatus] = useState<Record<string, boolean>>({})
  
  useEffect(() => {
    const checkAvailability = async () => {
      const checks = {
        supabase: await checkSupabaseConnection(),
        openai: await checkOpenAIConnection(),
        storage: await checkStorageAccess(),
        realtime: await checkRealtimeConnection()
      }
      
      setStatus(checks)
    }
    
    checkAvailability()
  }, [])
  
  return (
    <div className="space-y-4">
      {Object.entries(status).map(([service, available]) => (
        <div key={service} className="flex items-center gap-2">
          <Badge variant={available ? 'default' : 'destructive'}>
            {service}: {available ? 'Available' : 'Unavailable'}
          </Badge>
        </div>
      ))}
    </div>
  )
}
\`\`\`

### 2. Development Workflow

#### Hot Reload Setup
\`\`\`typescript
// next.config.mjs
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js'
        }
      }
    }
  },
  
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300
      }
    }
    
    return config
  }
}
\`\`\`

#### Development Scripts
\`\`\`json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "db:generate-types": "supabase gen types typescript --local > types/supabase-types.ts",
    "db:reset": "supabase db reset",
    "db:seed": "node scripts/seed.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
\`\`\`

### 3. Logging

#### Structured Logging
\`\`\`typescript
// lib/logger.ts
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export class Logger {
  private level: LogLevel
  
  constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level
  }
  
  debug(message: string, meta?: any) {
    if (this.level <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`, meta)
    }
  }
  
  info(message: string, meta?: any) {
    if (this.level <= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, meta)
    }
  }
  
  warn(message: string, meta?: any) {
    if (this.level <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, meta)
    }
  }
  
  error(message: string, error?: Error, meta?: any) {
    if (this.level <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, error, meta)
      
      // In Production: Send to monitoring service
      if (process.env.NODE_ENV === 'production') {
        this.sendToMonitoring(message, error, meta)
      }
    }
  }
  
  private sendToMonitoring(message: string, error?: Error, meta?: any) {
    // Implementation für Monitoring-Service
  }
}

export const logger = new Logger(
  process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO
)
\`\`\`

---

## Testing

### 1. Unit Tests

#### Jest Konfiguration
\`\`\`javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './'
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ]
}

module.exports = createJestConfig(customJestConfig)
\`\`\`

#### Test Examples
\`\`\`typescript
// __tests__/lib/experience-service.test.ts
import { experienceService } from '@/lib/experience-service'
import { config } from '@/lib/config'

describe('ExperienceService', () => {
  beforeEach(() => {
    config.useMockData = true
  })
  
  it('should fetch experiences', async () => {
    const experiences = await experienceService.getAll()
    
    expect(experiences).toBeDefined()
    expect(Array.isArray(experiences)).toBe(true)
    expect(experiences.length).toBeGreaterThan(0)
  })
  
  it('should create new experience', async () => {
    const newExperience = {
      title: 'Test Experience',
      description: 'Test Description',
      content: 'Test Content',
      author_id: 'test-user',
      category: 'Test',
      tags: ['test'],
      is_public: true
    }
    
    const created = await experienceService.create(newExperience)
    
    expect(created).toBeDefined()
    expect(created.title).toBe(newExperience.title)
    expect(created.id).toBeDefined()
  })
})
\`\`\`

### 2. Integration Tests

#### API Testing
\`\`\`typescript
// __tests__/api/experiences.test.ts
import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/experiences/route'

describe('/api/experiences', () => {
  it('should return experiences list', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      headers: {
        'Authorization': 'Bearer test-token'
      }
    })
    
    await handler(req, res)
    
    expect(res._getStatusCode()).toBe(200)
    
    const data = JSON.parse(res._getData())
    expect(data.experiences).toBeDefined()
    expect(Array.isArray(data.experiences)).toBe(true)
  })
})
\`\`\`

### 3. E2E Tests

#### Playwright Setup
\`\`\`typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  }
})
\`\`\`

#### E2E Test Example
\`\`\`typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('[data-testid=email]', 'test@example.com')
    await page.fill('[data-testid=password]', 'password123')
    await page.click('[data-testid=login-button]')
    
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('[data-testid=user-menu]')).toBeVisible()
  })
  
  test('should create new experience', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('[data-testid=email]', 'test@example.com')
    await page.fill('[data-testid=password]', 'password123')
    await page.click('[data-testid=login-button]')
    
    // Navigate to create experience
    await page.click('[data-testid=create-experience]')
    
    // Fill form
    await page.fill('[data-testid=experience-title]', 'Test Experience')
    await page.fill('[data-testid=experience-description]', 'Test Description')
    await page.click('[data-testid=save-experience]')
    
    // Verify creation
    await expect(page.locator('[data-testid=success-message]')).toBeVisible()
  })
})
\`\`\`

---

## Sicherheit

### 1. Authentifizierung

#### JWT Token Handling
\`\`\`typescript
// lib/auth/token-manager.ts
export class TokenManager {
  private static readonly TOKEN_KEY = 'supabase.auth.token'
  
  static getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.TOKEN_KEY)
  }
  
  static setToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.TOKEN_KEY, token)
  }
  
  static removeToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.TOKEN_KEY)
  }
  
  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 < Date.now()
    } catch {
      return true
    }
  }
}
\`\`\`

### 2. Input Validation

#### Zod Schemas
\`\`\`typescript
// lib/validation/schemas.ts
import { z } from 'zod'

export const ExperienceSchema = z.object({
  title: z.string().min(1, 'Titel ist erforderlich').max(200, 'Titel zu lang'),
  description: z.string().max(500, 'Beschreibung zu lang').optional(),
  content: z.string().min(10, 'Inhalt zu kurz').max(10000, 'Inhalt zu lang'),
  category: z.string().min(1, 'Kategorie ist erforderlich'),
  tags: z.array(z.string()).max(10, 'Zu viele Tags'),
  location: z.string().max(200, 'Ort zu lang').optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ungültiges Datumsformat'),
  is_public: z.boolean(),
  experience_rating: z.number().min(1).max(5).optional(),
  mood_before: z.number().min(1).max(10).optional(),
  mood_after: z.number().min(1).max(10).optional()
})

export const XPEntrySchema = z.object({
  title: z.string().min(1, 'Titel ist erforderlich').max(200),
  content: z.string().min(1, 'Inhalt ist erforderlich').max(5000),
  type: z.enum(['reflection', 'gratitude', 'goal', 'dream', 'habit']),
  mood: z.string().optional(),
  tags: z.array(z.string()).max(10),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  private: z.boolean(),
  draft: z.boolean()
})
\`\`\`

### 3. Rate Limiting

#### API Rate Limiting
\`\`\`typescript
// lib/rate-limiting.ts
import { LRUCache } from 'lru-cache'

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
}

export default function rateLimit(options: Options = {}) {
  const tokenCache = new LRUCache({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000
  })

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0]
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount)
        }
        tokenCount[0] += 1

        const currentUsage = tokenCount[0]
        const isRateLimited = currentUsage >= limit

        if (isRateLimited) {
          reject(new Error('Rate limit exceeded'))
        } else {
          resolve()
          reject(new Error('Rate limit exceeded'))
        } else {
          resolve()
        }
      })
  }
}

// Verwendung in API Routes
// app/api/experiences/route.ts
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500 // limit each IP to 500 requests per interval
})

export async function POST(request: NextRequest) {
  try {
    const ip = request.ip ?? '127.0.0.1'
    await limiter.check(10, ip) // 10 requests per minute per IP
    
    // Continue with normal request handling
  } catch {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    )
  }
}
\`\`\`

### 4. Content Security Policy

#### CSP Headers
\`\`\`typescript
// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.openai.com",
              "media-src 'self' https://*.supabase.co",
              "frame-src 'none'"
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}
\`\`\`

### 5. Data Sanitization

#### XSS Prevention
\`\`\`typescript
// lib/security/sanitization.ts
import DOMPurify from 'isomorphic-dompurify'

export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li'],
    ALLOWED_ATTR: []
  })
}

export function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .substring(0, 10000) // Limit length
}

// Verwendung in Komponenten
export function SafeContent({ content }: { content: string }) {
  const sanitizedContent = useMemo(() => sanitizeHTML(content), [content])
  
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      className="prose prose-sm max-w-none"
    />
  )
}
\`\`\`

---

## Fazit

Diese technische Dokumentation bietet einen umfassenden Überblick über das XP Share Projekt. Sie deckt alle wichtigen Aspekte ab:

### Implementierte Features ✅
- **Vollständige Authentifizierung** mit Supabase Auth
- **Erlebnis-Management** mit KI-Integration
- **XP-Buch** für persönliche Einträge
- **Community-Features** (Gruppen, Messaging)
- **Gamification-System** (XP, Achievements, Quests)
- **Real-time Funktionalität** für Chat und Updates
- **Offline-Unterstützung** mit Synchronisation
- **Responsive Design** für alle Geräte
- **Admin-Dashboard** für Verwaltung und Debugging

### Technische Highlights 🚀
- **Modern Stack**: Next.js 14, TypeScript, Tailwind CSS
- **Skalierbare Architektur** mit klarer Trennung von Concerns
- **KI-Integration** für automatische Analyse und Empfehlungen
- **Performance-Optimierung** durch Code Splitting und Caching
- **Umfassende Sicherheit** mit RLS, Rate Limiting und Input Validation
- **Developer Experience** mit Hot Reload, TypeScript und Testing

### Nächste Schritte 📋
1. **Testing**: Erweiterte Test-Coverage implementieren
2. **Performance**: Bundle-Größe weiter optimieren
3. **Monitoring**: Detailliertes Logging und Metriken
4. **Skalierung**: Microservices-Architektur evaluieren
5. **Mobile App**: React Native Implementation

Diese Dokumentation dient als Referenz für alle Entwickler, die am Projekt arbeiten, und stellt sicher, dass das System wartbar, erweiterbar und sicher bleibt.
