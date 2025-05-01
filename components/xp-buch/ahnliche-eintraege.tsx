"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { Info, Tag, Smile, FileText } from "lucide-react"
import type { XPEintrag } from "@/types/xp-eintrag"
import { findSimilarEntriesWithScores } from "@/lib/similarity-utils"
import { useXPBuch } from "@/contexts/xp-buch-context"

interface AhnlicheEintraegeProps {
  eintrag: XPEintrag
  onSelectEntry?: (entry: XPEintrag) => void
}

export function AhnlicheEintraege({ eintrag, onSelectEntry }: AhnlicheEintraegeProps) {
  const { state } = useXPBuch()
  const [similarityType, setSimilarityType] = useState<"overall" | "tags" | "content" | "mood">("overall")

  // Ähnliche Einträge mit Ähnlichkeitswerten finden
  const similarEntriesWithScores = findSimilarEntriesWithScores(eintrag, state.entries, 5)

  // Wenn keine ähnlichen Einträge gefunden wurden
  if (similarEntriesWithScores.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6 text-center">
          <Info className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium mb-2">Keine ähnlichen Einträge gefunden</h3>
          <p className="text-muted-foreground">
            Erstelle mehr Einträge, um Verbindungen zwischen deinen Erlebnissen zu entdecken.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Ähnliche Einträge</h3>
        <Tabs value={similarityType} onValueChange={(v) => setSimilarityType(v as any)} className="w-auto">
          <TabsList className="h-8">
            <TabsTrigger value="overall" className="text-xs px-2 h-7">
              Gesamt
            </TabsTrigger>
            <TabsTrigger value="tags" className="text-xs px-2 h-7">
              <Tag className="h-3 w-3 mr-1" />
              Tags
            </TabsTrigger>
            <TabsTrigger value="content" className="text-xs px-2 h-7">
              <FileText className="h-3 w-3 mr-1" />
              Inhalt
            </TabsTrigger>
            <TabsTrigger value="mood" className="text-xs px-2 h-7">
              <Smile className="h-3 w-3 mr-1" />
              Stimmung
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {similarEntriesWithScores.map(({ entry, similarity }) => (
          <Card key={entry.id} className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{entry.titel}</CardTitle>
              <div className="text-xs text-muted-foreground">
                {format(new Date(entry.datum), "PPP", { locale: de })}
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground line-clamp-2">{entry.inhalt}</p>
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Ähnlichkeit</span>
                  <span>{Math.round(similarity * 100)}%</span>
                </div>
                <Progress value={similarity * 100} className="h-1" />
              </div>
            </CardContent>
            <CardFooter className="pt-2 flex justify-between">
              <div className="flex flex-wrap gap-1">
                {entry.tags &&
                  entry.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
              </div>
              <Button variant="ghost" size="sm" onClick={() => onSelectEntry?.(entry)}>
                Anzeigen
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
