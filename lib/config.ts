// Konfiguration für die Anwendung
export const config = {
  // Immer Mock-Daten verwenden für Next.js
  useMockData: false, // <<< HIER ÄNDERN

  // Supabase-Konfiguration (wird bei Mock-Daten nicht verwendet)
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  },

  // App-Konfiguration
  app: {
    name: "XP Share",
    version: "1.0.0",
    description: "Teile deine Erlebnisse und entdecke neue Perspektiven",
  },

  // Feature-Flags
  features: {
    aiFeatures: true,
    realtime: true,
    notifications: true,
    gamification: true,
  },

  // API-Konfiguration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
  },
}
