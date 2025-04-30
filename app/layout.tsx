import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "@/lib/mock-init" // Initialize mocks
import ClientLayout from "./client-layout"

// Optimiere die Schriftart-Einbindung
const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Verwende 'swap' für bessere Benutzererfahrung während des Ladens
  preload: true, // Explizit preload aktivieren
  fallback: ["system-ui", "sans-serif"], // Fallback-Schriftarten
})

export const metadata: Metadata = {
  title: "XP Share - Teile deine außergewöhnlichen Erlebnisse",
  description: "Eine Plattform zum Teilen und Entdecken von außergewöhnlichen Erlebnissen und Erfahrungen.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
