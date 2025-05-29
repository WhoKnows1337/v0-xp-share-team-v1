import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { config } from "./config"
import type { Database } from "@/types/supabase-types"
import {
  getMockDataList as getMockUsersList, // Renamed for clarity
  getMockUserById,
  getMockUserByUsername,
  defaultMockAuthUser,
  addMockUser as addMockUserToList, // Renamed for clarity
  updateMockUser as updateMockUserInList, // Renamed for clarity
  type User as MockUserProfile, // Using the User type from mock-users
} from "./mock-users"

// Singleton-Pattern für den Supabase-Client
let supabaseInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null

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
  const mockAuthUser = defaultMockAuthUser // The user returned by auth.getUser()

  return {
    from: (table: string) => ({
      select: (columns = "*") => ({
        // Default to selecting all columns
        eq: (column: string, value: any) => {
          if (table === "users") {
            let user: MockUserProfile | undefined
            if (column === "id") {
              user = getMockUserById(value)
            } else if (column === "username") {
              user = getMockUserByUsername(value)
            }
            return {
              single: () =>
                Promise.resolve({
                  data: user || null,
                  error: user ? null : { message: "Mock user not found", code: "PGRST116" }, // PGRST116 is Supabase "No rows found"
                }),
              // Add other chainable methods if needed
            }
          }
          // Fallback for other tables or unhandled columns
          return {
            single: () =>
              Promise.resolve({
                data: null,
                error: { message: `Mock .eq not fully implemented for ${table}.${column}`, code: "MOCKERR" },
              }),
            // order, limit etc. would go here if needed for other tables
          }
        },
        order: (column: string, { ascending }: { ascending: boolean }) => ({
          limit: (count: number) => {
            if (table === "users") {
              const users = getMockUsersList("users") as MockUserProfile[]
              // Basic sort example (can be expanded)
              users.sort((a, b) => {
                const valA = (a as any)[column]
                const valB = (b as any)[column]
                if (valA < valB) return ascending ? -1 : 1
                if (valA > valB) return ascending ? 1 : -1
                return 0
              })
              return Promise.resolve({ data: users.slice(0, count), error: null })
            }
            return Promise.resolve({ data: [], error: null })
          },
        }),
        // Generic single without .eq (e.g., if an ID is implied or for specific scenarios)
        single: () => {
          if (table === "users" && columns === "*") {
            // A common pattern for fetching current user's profile
            const profile = getMockUserById(mockAuthUser.id)
            return Promise.resolve({
              data: profile,
              error: profile ? null : { message: "Current mock user profile not found", code: "PGRST116" },
            })
          }
          return Promise.resolve({
            data: null,
            error: { message: `Mock .single not fully implemented for ${table}`, code: "MOCKERR" },
          })
        },
      }),
      insert: (insertData: any | any[]) => {
        if (table === "users") {
          const itemsToInsert = Array.isArray(insertData) ? insertData : [insertData]
          const insertedItems: MockUserProfile[] = []
          itemsToInsert.forEach((item) => {
            const newUser = {
              ...item,
              id: item.id || `mock-id-${Date.now()}-${Math.random()}`,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            } as MockUserProfile
            addMockUserToList(newUser)
            insertedItems.push(newUser)
          })
          return {
            select: () =>
              Promise.resolve({ data: insertedItems.length === 1 ? insertedItems[0] : insertedItems, error: null }),
            single: () => Promise.resolve({ data: insertedItems[0], error: null }), // if only one inserted
          }
        }
        return Promise.resolve({ data: insertData, error: null }) // Generic echo back
      },
      update: (updateData: Partial<MockUserProfile>) => ({
        eq: (column: string, value: any) => {
          if (table === "users" && column === "id") {
            const existingUser = getMockUserById(value)
            if (existingUser) {
              const updatedUser = { ...existingUser, ...updateData, updated_at: new Date().toISOString() }
              updateMockUserInList(updatedUser)
              return {
                select: () => Promise.resolve({ data: updatedUser, error: null }),
                single: () => Promise.resolve({ data: updatedUser, error: null }),
              }
            }
          }
          return Promise.resolve({ data: null, error: { message: "Mock user to update not found", code: "PGRST116" } })
        },
      }),
      delete: () => ({
        eq: (column: string, value: any) => {
          // Implement mock delete if needed, e.g., remove from mockUsersList
          return Promise.resolve({ error: null })
        },
      }),
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: mockAuthUser as any }, error: null }), // Cast to any if mockAuthUser doesn't perfectly match Supabase.User
      getSession: () =>
        Promise.resolve({
          data: {
            session: {
              access_token: "mock-access-token",
              refresh_token: "mock-refresh-token",
              user: mockAuthUser as any, // Cast here too
              expires_in: 3600,
              expires_at: Date.now() / 1000 + 3600,
              token_type: "bearer",
            },
          },
          error: null,
        }),
      signUp: ({ email, password, options }: any) => {
        const userId = `mock-signup-${Date.now()}`
        const newUser = {
          id: userId,
          email: email,
          app_metadata: { provider: "email" },
          user_metadata: options?.data || {},
          aud: "authenticated",
          created_at: new Date().toISOString(),
        }
        // In a real scenario, Supabase handles this. For mock, we simulate.
        // The profile creation is handled in supabase-auth.ts for mock sign up.
        return Promise.resolve({
          data: {
            user: newUser as any,
            session: {
              /* mock session */
            } as any,
          },
          error: null,
        })
      },
      signInWithPassword: ({ email, password }: any) => {
        // Find user by email in mock list for a slightly more realistic mock sign-in
        const userProfile = (getMockUsersList("users") as MockUserProfile[]).find((u) => u.email === email)
        if (userProfile) {
          const authUser = {
            // Construct a mock AuthUser based on the profile
            id: userProfile.id,
            email: userProfile.email,
            app_metadata: { provider: "email" },
            user_metadata: { username: userProfile.username, display_name: userProfile.display_name },
            aud: "authenticated",
            created_at: userProfile.created_at || new Date().toISOString(),
          }
          return Promise.resolve({
            data: {
              user: authUser as any,
              session: {
                access_token: "mock-access-token",
                refresh_token: "mock-refresh-token",
                user: authUser as any,
                expires_in: 3600,
                expires_at: Date.now() / 1000 + 3600,
                token_type: "bearer",
              } as any,
            },
            error: null,
          })
        }
        return Promise.resolve({
          data: { user: null, session: null },
          error: { message: "Mock: Invalid credentials", status: 400 },
        })
      },
      signOut: () => Promise.resolve({ error: null }),
      updateUser: (updates: any) => {
        // For password updates etc.
        // Simulate success
        return Promise.resolve({ data: { user: mockAuthUser as any }, error: null })
      },
    },
    storage: {
      from: (bucket: string) => ({
        upload: (path: string, file: File) =>
          Promise.resolve({ data: { path: `mock-storage-path/${path}` }, error: null }),
        getPublicUrl: (path: string) => ({ data: { publicUrl: `https://mock.storage.com/${bucket}/${path}` } }),
        // Add other storage methods as needed
      }),
    },
  } as any // Cast to any to satisfy SupabaseClient type, as mock won't implement everything
}

// Client-Side Supabase Client
export const getSupabaseClient = () => {
  if (config.useMockData) {
    // Ensure a new mock client is created each time if it holds state,
    // or return a singleton if its state is managed externally (like mockUsersList).
    // For now, creating a new one is safer if its internal methods modify shared mock data.
    return createMockClient()
  }

  if (!supabaseInstance) {
    const supabaseUrl = config.supabase.url
    const supabaseAnonKey = config.supabase.anonKey

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error(
        "Supabase Umgebungsvariablen fehlen! NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY müssen gesetzt sein.",
      )
      // Potentially throw an error or return a more graceful fallback
      // For now, this will cause issues if not in mock mode.
      throw new Error("Supabase Konfiguration unvollständig für nicht-Mock-Modus.")
    }

    supabaseInstance = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
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

  return createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey, {
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
export { createSupabaseClient as createActualSupabaseClient }
