import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "XP Share - Teile deine Erlebnisse",
  description: "Eine Plattform zum Teilen und Entdecken von Erlebnissen",
    generator: 'v0.dev'
}

import ClientPage from "./page"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientPage>{children}</ClientPage>
}


import './globals.css'