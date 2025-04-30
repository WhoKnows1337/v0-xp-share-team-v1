import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { XPAssistantProvider } from "@/components/xp-assistant-provider"
import { SidebarProvider } from "@/contexts/sidebar-context"
import ClientLayout from "./client-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "XP-Share",
  description: "Teile und entdecke außergewöhnliche Erfahrungen",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SidebarProvider>
            <XPAssistantProvider>
              <ClientLayout>{children}</ClientLayout>
              <Toaster />
            </XPAssistantProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
