import { config } from "@/lib/config"
import { createMockClient } from "@/lib/supabase-client" // Ensure this path is correct
import { createServerClient as _createServerClientFromSSR, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

function getCookieStore() {
  try {
    return cookies()
  } catch (error) {
    console.warn("Cookie store not available. This client might not work as expected if real auth is needed.", error)
    return {
      get: () => undefined,
      set: () => {},
      remove: () => {},
    } as any
  }
}

export function createServerSupabaseClient(context?: { cookies: () => any }) {
  if (config.useMockData) {
    return createMockClient() as any
  }

  const cookieStore = context?.cookies ? context.cookies() : getCookieStore()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    console.error("Server Supabase Client Error: NEXT_PUBLIC_SUPABASE_URL is not defined.")
    throw new Error("Server Supabase Client: NEXT_PUBLIC_SUPABASE_URL is required when not using mock data.")
  }
  if (!supabaseAnonKey) {
    console.error("Server Supabase Client Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined.")
    throw new Error("Server Supabase Client: NEXT_PUBLIC_SUPABASE_ANON_KEY is required when not using mock data.")
  }

  return _createServerClientFromSSR(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          /* Ignore in Server Components */
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          /* Ignore in Server Components */
        }
      },
    },
  })
}

export function createAdminSupabaseClient() {
  if (config.useMockData) {
    return createMockClient() as any
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    console.error("Admin Supabase Client Error: NEXT_PUBLIC_SUPABASE_URL is not defined.")
    throw new Error("Admin Supabase Client: NEXT_PUBLIC_SUPABASE_URL is required when not using mock data.")
  }
  if (!supabaseServiceKey) {
    console.error("Admin Supabase Client Error: SUPABASE_SERVICE_ROLE_KEY is not defined.")
    throw new Error("Admin Supabase Client: SUPABASE_SERVICE_ROLE_KEY is required when not using mock data.")
  }

  // For admin client, cookie handling is typically not needed for service_role key
  return _createServerClientFromSSR(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    cookies: {
      // Provide dummy cookie handlers for admin client if not using cookies
      get() {
        return undefined
      },
      set() {},
      remove() {},
    },
  })
}

// Für authentifizierte Server-Operationen
export function createAuthenticatedSupabaseClient() {
  const cookieStore = cookies()

  return _createServerClientFromSSR(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // Ignore errors in Server Components
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          // Ignore errors in Server Components
        }
      },
    },
  })
}
