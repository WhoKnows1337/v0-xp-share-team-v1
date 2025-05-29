/**
 * Vercel-Konfiguration für das Deployment
 *
 * Diese Datei enthält Hilfsfunktionen und Konfigurationen für das Deployment auf Vercel.
 */

// Umgebungsvariablen, die für das Deployment benötigt werden
export const requiredEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_JWT_SECRET",
]

// Prüft, ob alle erforderlichen Umgebungsvariablen vorhanden sind
export function checkRequiredEnvVars(): { valid: boolean; missing: string[] } {
  const missing = requiredEnvVars.filter(
    (envVar) => typeof process.env[envVar] === "undefined" || process.env[envVar] === "",
  )

  return {
    valid: missing.length === 0,
    missing,
  }
}

// Konfiguration für verschiedene Umgebungen
export const environmentConfig = {
  production: {
    url: "https://xp-share.vercel.app",
    apiUrl: "https://xp-share.vercel.app/api",
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  },
  preview: {
    url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
    apiUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api` : "",
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  },
  development: {
    url: "http://localhost:3000",
    apiUrl: "http://localhost:3000/api",
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  },
}

// Gibt die aktuelle Umgebung zurück
export function getCurrentEnvironment(): "production" | "preview" | "development" {
  if (process.env.VERCEL_ENV === "production") {
    return "production"
  }

  if (process.env.VERCEL_ENV === "preview") {
    return "preview"
  }

  return "development"
}

// Gibt die Konfiguration für die aktuelle Umgebung zurück
export function getEnvironmentConfig() {
  const environment = getCurrentEnvironment()
  return environmentConfig[environment]
}

// Prüft, ob die Anwendung in der Produktion läuft
export function isProduction(): boolean {
  return getCurrentEnvironment() === "production"
}

// Prüft, ob die Anwendung in einer Preview-Umgebung läuft
export function isPreview(): boolean {
  return getCurrentEnvironment() === "preview"
}

// Prüft, ob die Anwendung in der Entwicklungsumgebung läuft
export function isDevelopment(): boolean {
  return getCurrentEnvironment() === "development"
}
