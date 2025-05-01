"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  errorType?: "network" | "upload" | "save" | "load" | "generic"
}

export function ErrorState({
  title = "Ein Fehler ist aufgetreten",
  description = "Bitte versuche es später erneut.",
  onRetry,
  errorType = "generic",
}: ErrorStateProps) {
  const getErrorDetails = () => {
    switch (errorType) {
      case "network":
        return {
          icon: <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />,
          title: "Netzwerkfehler",
          description:
            "Die Verbindung zum Server konnte nicht hergestellt werden. Bitte überprüfe deine Internetverbindung.",
          buttonText: "Erneut versuchen",
          imageSrc: "/disconnected-network-icon.png",
        }
      case "upload":
        return {
          icon: <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />,
          title: "Upload fehlgeschlagen",
          description:
            "Die Datei konnte nicht hochgeladen werden. Bitte versuche es später erneut oder wähle eine andere Datei.",
          buttonText: "Erneut versuchen",
          imageSrc: "/placeholder.svg?height=200&width=200&query=failed upload icon",
        }
      case "save":
        return {
          icon: <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />,
          title: "Speichern fehlgeschlagen",
          description:
            "Dein Eintrag konnte nicht gespeichert werden. Wir haben eine lokale Kopie erstellt, damit du keine Daten verlierst.",
          buttonText: "Erneut speichern",
          imageSrc: "/placeholder.svg?height=200&width=200&query=save error icon",
        }
      case "load":
        return {
          icon: <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />,
          title: "Laden fehlgeschlagen",
          description: "Die Einträge konnten nicht geladen werden. Bitte versuche es später erneut.",
          buttonText: "Erneut laden",
          imageSrc: "/placeholder.svg?height=200&width=200&query=loading error icon",
        }
      default:
        return {
          icon: <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />,
          title: title,
          description: description,
          buttonText: "Erneut versuchen",
          imageSrc: "/placeholder.svg?height=200&width=200&query=error icon",
        }
    }
  }

  const errorDetails = getErrorDetails()

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mb-6">
          <img
            src={errorDetails.imageSrc || "/placeholder.svg"}
            alt=""
            className="mx-auto h-40 w-40 rounded-lg object-cover"
            aria-hidden="true"
          />
        </div>
        {errorDetails.icon}
        <h3 className="text-xl font-semibold mb-2">{errorDetails.title}</h3>
        <p className="text-muted-foreground max-w-md mb-6">{errorDetails.description}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="default" className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            {errorDetails.buttonText}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
