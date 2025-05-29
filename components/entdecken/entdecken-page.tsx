"use client"

import { useRouter } from "next/router"
import { AISearchIntegration } from "@/components/ai/ai-search-integration"

const EntdeckenPage = () => {
  const router = useRouter()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Entdecken</h1>

      <AISearchIntegration
        onResultClick={(result) => {
          // Navigation zur Detailseite basierend auf dem Ergebnistyp
          if (result.type === "erlebnis") {
            router.push(`/erlebnis/${result.id}`)
          }
        }}
        className="w-full max-w-2xl mx-auto"
        placeholder="Suche nach Erlebnissen, Emotionen, Orten..."
      />
    </div>
  )
}

export default EntdeckenPage
