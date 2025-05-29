import { createClient } from "@supabase/supabase-js"
import { config } from "./config"
import type { Database } from "@/types/supabase-types"

// Singleton-Pattern für den Supabase-Client
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

// Mock-Daten Typen
interface User {
  id: string
  username: string
  email: string
  display_name: string
  avatar_url: string
  experience_points: number
  level: number
  is_premium: boolean
  created_at: string
  updated_at: string
}

// Mock-Auth Objekt
const mockAuth = {
  getUser: () => ({ data: { user: mockUser }, error: null }),
  getSession: () => ({ data: { session: { user: mockUser } }, error: null }),
  signUp: () => ({ data: { user: mockUser }, error: null }),
  signInWithPassword: () => ({ data: { user: mockUser }, error: null }),
  signOut: () => ({ error: null }),
}

// Mock-Supabase-Client für Entwicklung und Tests
export const createMockClient = () => {
  return {
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (column: string, value: any) => {
          if (table === "users" && column === "username") {
            // Changed from "profiles"
            const users = getMockDataList(table) as User[]
            const user = users.find((u) => u.username === value)
            return {
              single: () =>
                Promise.resolve({
                  data: user || null,
                  error: user ? null : { message: "User not found", code: "PGRST116" },
                }),
              // Add other chainable methods if needed, or ensure 'single' is what's used
            }
          }
          // Original eq logic for ID-based fetching
          return {
            single: () => Promise.resolve({ data: getMockData(table, value), error: null }),
            order: () => ({
              limit: () => Promise.resolve({ data: getMockDataList(table), error: null }),
            }),
          }
        },
        // ... other methods like order, limit etc.
        // Ensure a generic .single() is available if no .eq is called
        single: () => {
          // This might be called if query is supabase.from("users").select().eq("id", user.id).single()
          if (table === "users") {
            // Assuming current user fetch
            const {
              data: { user: authUser },
            } = mockAuth.getUser()
            if (authUser) {
              const users = getMockDataList(table) as User[]
              const user = users.find((u) => u.id === authUser.id)
              return Promise.resolve({ data: user || null, error: null })
            }
          }
          return Promise.resolve({
            data: null,
            error: { message: "Cannot fetch single without ID for this mock table", code: "MOCKERR" },
          })
        },
        order: () => ({
          limit: () => Promise.resolve({ data: getMockDataList(table), error: null }),
        }),
      }),
      insert: (data: any) => ({
        select: () => Promise.resolve({ data, error: null }),
      }),
      update: (data: any) => ({
        eq: () => ({
          select: () => Promise.resolve({ data, error: null }),
        }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: mockUser }, error: null }),
      getSession: () => Promise.resolve({ data: { session: { user: mockUser } }, error: null }),
      signUp: () => Promise.resolve({ data: { user: mockUser }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: mockUser }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
    storage: {
      from: (bucket: string) => ({
        upload: () => Promise.resolve({ data: { path: "mock-path" }, error: null }),
        getPublicUrl: (path: string) => ({ data: { publicUrl: `https://mock-storage.com/${path}` } }),
      }),
    },
  }
}

// Client-Side Supabase Client
export const getSupabaseClient = () => {
  if (config.useMockData) {
    return createMockClient()
  }

  if (!supabaseInstance) {
    const supabaseUrl = config.supabase.url
    const supabaseAnonKey = config.supabase.anonKey

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase Umgebungsvariablen fehlen!")
      throw new Error("Supabase Konfiguration unvollständig")
    }

    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }
  return supabaseInstance
}

// Server-Side Supabase Admin Client
export const getSupabaseAdmin = () => {
  if (config.useMockData) {
    return createMockClient()
  }

  const supabaseUrl = config.supabase.url
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Supabase Admin Umgebungsvariablen fehlen!")
    throw new Error("Supabase Admin Konfiguration unvollständig")
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Server-only Funktionen - direkt hier definiert
export async function createServerSupabaseClient() {
  return getSupabaseAdmin()
}

export async function getServerSession() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    console.error("Fehler beim Abrufen der Server-Session:", error)
    return null
  }

  return session
}

export async function getServerUser() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error("Fehler beim Abrufen des Server-Users:", error)
    return null
  }

  return user
}

// Mock-Daten
const mockUser = {
  id: "mock-user-id-astral", // Make it unique if needed
  email: "astral@example.com",
  // Add other fields if your auth.getUser() mock returns more
}

// Hilfsfunktionen für Mock-Daten
function getMockData(table: string, id: string) {
  const mockData: Record<string, any> = {
    users: {
      id: "mock-user-id",
      username: "testuser",
      email: "test@example.com",
      display_name: "Test User",
      avatar_url: "/serene-meditation.png",
      experience_points: 1250,
      level: 5,
      is_premium: false,
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
    },
    experiences: {
      id: "mock-exp-id",
      title: "Meditation im Schwarzwald",
      description: "Eine tiefe Meditationserfahrung in der Natur des Schwarzwaldes.",
      content: "Heute habe ich eine wunderbare Meditation im Schwarzwald erlebt...",
      author_id: "mock-user-id",
      category_id: 1,
      location: "Schwarzwald, Deutschland",
      date: "2024-01-15",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
      is_public: true,
      likes_count: 24,
      comments_count: 8,
      shares_count: 3,
      tags: ["meditation", "natur", "schwarzwald"],
      emotions: ["peaceful", "grateful"],
      rating: 5,
      privacy_level: "public",
    },
  }

  return mockData[table] || null
}

function getMockDataList(table: string) {
  const mockDataLists: Record<string, any[]> = {
    users: [
      {
        id: "mock-user-id-1",
        username: "testuser1",
        email: "test1@example.com",
        display_name: "Test User 1",
        avatar_url: "/serene-meditation.png",
        experience_points: 1250,
        level: 5,
        is_premium: false,
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
      },
      {
        id: "mock-user-id-2",
        username: "testuser2",
        email: "test2@example.com",
        display_name: "Test User 2",
        avatar_url: "/contemplative-figure.png",
        experience_points: 2500,
        level: 8,
        is_premium: true,
        created_at: "2023-01-02T00:00:00Z",
        updated_at: "2023-01-02T00:00:00Z",
      },
      {
        id: "mock-user-id-astral",
        username: "AstralExplorer",
        display_name: "Astral Explorer",
        avatar_url: "/placeholder.svg?width=96&height=96&text=AE",
        bio: "Exploring the digital cosmos.",
        email: "astral@example.com",
        experience_points: 1500,
        level: 6,
        is_premium: true,
        created_at: "2022-06-15T10:00:00Z",
        updated_at: "2023-01-20T10:00:00Z",
        // Mock counts
        experiences_count: 10,
        followers_count: 120,
        following_count: 75,
      },
    ],
    experiences: [
      {
        id: "mock-exp-id-1",
        title: "Meditation im Schwarzwald",
        description: "Eine tiefe Meditationserfahrung in der Natur des Schwarzwaldes.",
        content: "Heute habe ich eine wunderbare Meditation im Schwarzwald erlebt...",
        author_id: "mock-user-id-1",
        category_id: 1,
        location: "Schwarzwald, Deutschland",
        date: "2024-01-15",
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
        is_public: true,
        likes_count: 24,
        comments_count: 8,
        shares_count: 3,
        tags: ["meditation", "natur", "schwarzwald"],
        emotions: ["peaceful", "grateful"],
        rating: 5,
        privacy_level: "public",
      },
      {
        id: "mock-exp-id-2",
        title: "Pasta-Kochkurs in Italien",
        description: "Authentischer Pasta-Kochkurs bei einer italienischen Familie.",
        content: "Ein unvergesslicher Tag in der Küche einer italienischen Nonna...",
        author_id: "mock-user-id-2",
        category_id: 2,
        location: "Toskana, Italien",
        date: "2024-01-10",
        created_at: "2024-01-10T14:00:00Z",
        updated_at: "2024-01-10T14:00:00Z",
        is_public: true,
        likes_count: 42,
        comments_count: 15,
        shares_count: 7,
        tags: ["kochen", "italien", "pasta", "kultur"],
        emotions: ["joyful", "curious"],
        rating: 5,
        privacy_level: "public",
      },
    ],
  }

  return mockDataLists[table] || []
}

// Re-export createClient für externe Verwendung
export { createClient } from "@supabase/supabase-js"
