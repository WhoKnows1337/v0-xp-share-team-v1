"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin, Eye, Heart, MessageSquare, Bookmark } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

// Mock-Daten für Lesezeichen
const mockLesezeichen = [
  {
    id: "l1",
    erlebnis: {
      id: "e10",
      titel: "Meditation im Zen-Garten",
      kurzfassung: "Eine tiefe Erfahrung der Stille und des inneren Friedens",
      datum: "10.02.2023",
      ort: "Kyoto, Japan",
      kategorie: { name: "Meditation", icon: "lotus", farbe: "green" },
      tags: ["Zen", "Stille", "Japan"],
      preview: "/placeholder.svg?height=200&width=300&query=zen%20garden%20meditation",
      statistik: { ansichten: 423, likes: 112, kommentare: 28 },
      autor: {
        username: "ZenMeister",
        avatar: "/placeholder.svg?height=40&width=40&query=avatar%20zen",
      },
    },
  },
  {
    id: "l2",
    erlebnis: {
      id: "e11",
      titel: "Begegnung mit dem Vierblättrigen Kleeblatt",
      kurzfassung: "Ein unerwarteter Fund und die darauf folgenden Glücksmomente",
      datum: "05.03.2023",
      ort: "Irische Wiese",
      kategorie: { name: "Glücksmomente", icon: "clover", farbe: "emerald" },
      tags: ["Glück", "Zufall", "Natur"],
      preview: "/placeholder.svg?height=200&width=300&query=four%20leaf%20clover%20field",
      statistik: { ansichten: 287, likes: 76, kommentare: 15 },
      autor: {
        username: "GlücksPilz",
        avatar: "/placeholder.svg?height=40&width=40&query=avatar%20luck",
      },
    },
  },
  {
    id: "l3",
    erlebnis: {
      id: "e12",
      titel: "Sternschnuppennacht und kosmische Verbindung",
      kurzfassung: "Eine Nacht unter dem Sternenhimmel mit unerwarteten Einsichten",
      datum: "20.08.2023",
      ort: "Wüste Negev",
      kategorie: { name: "Kosmische Erfahrungen", icon: "star", farbe: "indigo" },
      tags: ["Sterne", "Kosmos", "Nacht"],
      preview: "/placeholder.svg?height=200&width=300&query=starry%20night%20desert",
      statistik: { ansichten: 356, likes: 94, kommentare: 22 },
      autor: {
        username: "KosmischerWanderer",
        avatar: "/placeholder.svg?height=40&width=40&query=avatar%20cosmic",
      },
    },
  },
]

export function LesezeichenTab() {
  const { toast } = useToast()

  const handleRemoveBookmark = (id: string, titel: string) => {
    // In einer echten App würden wir hier das Lesezeichen entfernen
    toast({
      title: "Lesezeichen entfernt",
      description: `"${titel}" wurde aus deinen Lesezeichen entfernt.`,
    })
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Meine Lesezeichen</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockLesezeichen.map((lesezeichen) => (
          <motion.div
            key={lesezeichen.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden h-full flex flex-col">
              <div className="relative">
                <img
                  src={lesezeichen.erlebnis.preview || "/placeholder.svg"}
                  alt={lesezeichen.erlebnis.titel}
                  className="h-48 w-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <Badge style={{ backgroundColor: lesezeichen.erlebnis.kategorie.farbe }} className="text-white">
                    {lesezeichen.erlebnis.kategorie.name}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white"
                  onClick={() => handleRemoveBookmark(lesezeichen.id, lesezeichen.erlebnis.titel)}
                >
                  <Bookmark className="h-4 w-4 fill-current" />
                </Button>
              </div>

              <CardContent className="pt-4 flex-grow">
                <h3 className="text-lg font-semibold mb-2">{lesezeichen.erlebnis.titel}</h3>
                <p className="text-muted-foreground text-sm mb-3">{lesezeichen.erlebnis.kurzfassung}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {lesezeichen.erlebnis.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{lesezeichen.erlebnis.datum}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{lesezeichen.erlebnis.ort}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t pt-3 flex justify-between">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    <span>{lesezeichen.erlebnis.statistik.ansichten}</span>
                  </div>
                  <div className="flex items-center">
                    <Heart className="h-3 w-3 mr-1" />
                    <span>{lesezeichen.erlebnis.statistik.likes}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    <span>{lesezeichen.erlebnis.statistik.kommentare}</span>
                  </div>
                </div>

                <Button size="sm" variant="outline">
                  Anzeigen
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {mockLesezeichen.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Keine Lesezeichen gefunden.</p>
        </div>
      )}
    </div>
  )
}
