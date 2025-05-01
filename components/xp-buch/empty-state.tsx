"use client"

import { Button } from "@/components/ui/button"
import { BookOpen, Search, Filter, Plus } from "lucide-react"

type EmptyStateType = "empty" | "search" | "filter"

interface EmptyStateProps {
  type: EmptyStateType
  onCreateEntry?: () => void
}

export function EmptyState({ type, onCreateEntry }: EmptyStateProps) {
  const renderContent = () => {
    switch (type) {
      case "empty":
        return {
          icon: <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />,
          title: "Willkommen im XP-Buch!",
          description:
            "Es sind noch keine Einträge vorhanden. Erstelle deinen ersten Eintrag, um deine Erfahrungen festzuhalten.",
          buttonText: "Ersten Eintrag erstellen",
          buttonAction: () => {
            // Hier würde die Aktion zum Erstellen eines Eintrags ausgelöst werden
            // Zum Beispiel ein Modal öffnen oder zu einem Formular navigieren
            console.log("Ersten Eintrag erstellen")
          },
        }
      case "search":
        return {
          icon: <Search className="h-12 w-12 text-muted-foreground mb-4" />,
          title: "Keine Suchergebnisse gefunden",
          description: "Versuche es mit anderen Suchbegriffen oder setze die Filter zurück.",
          buttonText: "Filter zurücksetzen",
          buttonAction: onCreateEntry,
        }
      case "filter":
        return {
          icon: <Filter className="h-12 w-12 text-muted-foreground mb-4" />,
          title: "Keine Einträge gefunden",
          description: "Es wurden keine Einträge gefunden, die deinen Filterkriterien entsprechen.",
          buttonText: "Filter zurücksetzen",
          buttonAction: onCreateEntry,
        }
      default:
        return {
          icon: <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />,
          title: "Keine Einträge vorhanden",
          description: "Es wurden keine Einträge gefunden.",
          buttonText: "Eintrag erstellen",
          buttonAction: () => {
            console.log("Eintrag erstellen")
          },
        }
    }
  }

  const content = renderContent()

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 rounded-lg border border-dashed border-muted h-[calc(100vh-500px)] min-h-[300px]">
      {content.icon}
      <h3 className="text-xl font-semibold mb-2">{content.title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{content.description}</p>
      <Button onClick={content.buttonAction} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        {content.buttonText}
      </Button>
    </div>
  )
}
