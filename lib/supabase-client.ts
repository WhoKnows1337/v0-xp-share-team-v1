import { createClient } from "@supabase/supabase-js"
import { config } from "./config"
import type { Database } from "@/types/supabase-types"

// Singleton-Pattern für den Supabase-Client
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

// Mock-Supabase-Client für Entwicklung und Tests
export const createMockClient = () => {
  return {
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          single: () => Promise.resolve({ data: getMockData(table, value), error: null }),
          order: () => ({
            limit: () => Promise.resolve({ data: getMockDataList(table), error: null }),
          }),
        }),
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

// Mock-Daten
const mockUser = {
  id: "mock-user-id",
  email: "test@example.com",
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

// Hilfsfunktion für Server Components - jetzt aus separater Datei
export { createServerSupabaseClient } from "./server/supabase-server"

// Re-export createClient für externe Verwendung
export { createClient } from "@supabase/supabase-js"
