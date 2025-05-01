"use client"

import { useState, useEffect } from "react"
import { EntdeckenPageRedesigned } from "./entdecken-page-redesigned"

export function EntdeckenPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p>Lade Entdecken-Seite...</p>
      </div>
    )
  }

  return <EntdeckenPageRedesigned />
}
