"use client"

import { useState, useEffect } from "react"
import { EntdeckenPageRedesigned } from "./entdecken-page-redesigned"
import { Skeleton } from "@/components/ui/skeleton"

export function EntdeckenPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simuliere eine kurze Verzögerung, um sicherzustellen, dass die Daten geladen werden
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-10 w-[200px]" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <Skeleton className="h-[200px] w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return <EntdeckenPageRedesigned />
}
