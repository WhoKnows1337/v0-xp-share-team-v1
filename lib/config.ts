// Konfiguration für die Anwendung
export const config = {
  // Wenn true, werden Mock-Daten verwendet, sonst Supabase
  useMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" || process.env.NODE_ENV === "development",

  // API-Basis-URL
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || "",

  // Supabase-Konfiguration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  },

  // Feature-Flags
  features: {
    enableRealtime: true,
    enableOfflineSupport: true,
    enableAIFeatures: true,
  },
}
