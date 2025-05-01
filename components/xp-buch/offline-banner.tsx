"use client"
import { WifiOff } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useOnlineStatus } from "@/hooks/use-online-status"

export function OfflineBanner() {
  const isOnline = useOnlineStatus()

  if (isOnline) {
    return null
  }

  return (
    <Alert variant="warning" className="mb-4">
      <WifiOff className="h-4 w-4" />
      <AlertTitle>Du bist derzeit offline</AlertTitle>
      <AlertDescription>
        Neue Einträge werden lokal gespeichert und später synchronisiert, sobald du wieder online bist.
      </AlertDescription>
    </Alert>
  )
}
