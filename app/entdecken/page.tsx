"use client"

import { EntdeckenPageRedesigned } from "@/components/entdecken/entdecken-page-redesigned"
import { useEffect, useState } from "react"

// Force dynamic rendering to prevent SSR issues
export const dynamic = "force-dynamic"

export default function EntdeckenPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-center">
          <h2 className="text-2xl font-bold mb-4">Lade Erlebnisse...</h2>
          <div className="w-32 h-2 bg-gray-300 rounded-full mx-auto mb-2"></div>
          <div className="w-24 h-2 bg-gray-300 rounded-full mx-auto"></div>
        </div>
      </div>
    )
  }

  return <EntdeckenPageRedesigned />
}
