"use client"

import { useEffect, useState } from "react"
import { EntdeckenPage } from "@/components/entdecken/entdecken-page"
import { Loading } from "@/components/loading"

export default function EntdeckenClient() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <Loading />
  }

  return <EntdeckenPage />
}
