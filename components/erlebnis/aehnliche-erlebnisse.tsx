import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ErlebnisKarte } from "@/components/entdecken/erlebnis-karte"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, TrendingUp } from "lucide-react"
import Link from "next/link"
import type { Erlebnis } from "@/types/erlebnis"

interface AehnlicheErlebnisseProps {
  erlebnisse?: Erlebnis[]
  erlebnis?: Erlebnis
  clusterInfo?: {
    count: number
    name: string
    description: string
  }
}

export function AehnlicheErlebnisse({ erlebnisse, erlebnis, clusterInfo }: AehnlicheErlebnisseProps) {
  // Unterstützt beide Prop-Strukturen für Abwärtskompatibilität
  const aehnlicheErlebnisse = erlebnisse || erlebnis?.aehnlicheErlebnisse || []

  if (aehnlicheErlebnisse.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-primary" />
            Ähnliche Erlebnisse
            {clusterInfo && (
              <Badge variant="outline" className="ml-2 bg-primary/10">
                {clusterInfo.count}+ ähnlich
              </Badge>
            )}
          </CardTitle>
        </div>
        {clusterInfo && (
          <p className="text-sm text-muted-foreground mt-1">
            {clusterInfo.description || `Teil eines Clusters: "${clusterInfo.name}"`}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {aehnlicheErlebnisse.slice(0, 3).map((erlebnis, index) => (
          <div key={index} className="relative">
            <ErlebnisKarte erlebnis={erlebnis} compact />
            {erlebnis.verknuepfungstyp && (
              <Badge className="absolute top-2 right-2 bg-primary/20 text-xs">{erlebnis.verknuepfungstyp}</Badge>
            )}
          </div>
        ))}
      </CardContent>
      {aehnlicheErlebnisse.length > 3 && (
        <CardFooter>
          <Link href={`/erlebnis/${erlebnis?.id || "1"}/aehnliche`} passHref>
            <Button variant="ghost" className="w-full justify-between">
              <span>Alle ähnlichen Erlebnisse anzeigen</span>
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  )
}
