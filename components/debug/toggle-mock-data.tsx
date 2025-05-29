"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { config } from "@/lib/config"
import { useToast } from "@/hooks/use-toast"

export function ToggleMockData() {
  const [useMock, setUseMock] = useState(config.useMockData)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/toggle-mock-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ useMock: !useMock }),
      })

      const data = await response.json()

      if (data.success) {
        setUseMock(!useMock)
        toast({
          title: "Erfolgreich",
          description: data.message,
        })

        // In einer echten Anwendung würde man hier die Seite neu laden
        // window.location.reload()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Die Einstellung konnte nicht geändert werden.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datenquelle</CardTitle>
        <CardDescription>Wähle zwischen Mock-Daten und Supabase-Daten</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Switch id="mock-data" checked={useMock} onCheckedChange={handleToggle} disabled={isLoading} />
          <label
            htmlFor="mock-data"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {useMock ? "Mock-Daten verwenden" : "Supabase-Daten verwenden"}
          </label>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          {useMock
            ? "Mock-Daten werden für die Entwicklung verwendet. Keine Datenbankverbindung erforderlich."
            : "Supabase-Daten werden verwendet. Stellt eine Verbindung zur Datenbank her."}
        </p>
      </CardFooter>
    </Card>
  )
}
