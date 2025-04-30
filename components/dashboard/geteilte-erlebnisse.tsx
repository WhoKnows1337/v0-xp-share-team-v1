"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Calendar, MapPin, Eye, Heart, MessageSquare, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserLink } from "@/components/user-link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface GeteilteErlebnisseProps {
  erlebnisse: any[]
}

export function GeteilteErlebnisse({ erlebnisse }: GeteilteErlebnisseProps) {
  const [items, setItems] = useState(erlebnisse)

  const handleLike = (id: string) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            liked: !item.liked,
            statistik: {
              ...item.statistik,
              likes: item.liked ? item.statistik.likes - 1 : item.statistik.likes + 1,
            },
          }
        }
        return item
      }),
    )
  }

  return (
    <div className="space-y-4">
      {items.map((erlebnis) => (
        <motion.div
          key={erlebnis.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden">
            <div className="relative">
              <img
                src={erlebnis.medien[0]?.url || "/placeholder.svg"}
                alt={erlebnis.titel}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 left-2">
                <Badge style={{ backgroundColor: erlebnis.kategorie.farbe }} className="text-white">
                  {erlebnis.kategorie.name}
                </Badge>
              </div>
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="bg-white/80 hover:bg-white/90 dark:bg-slate-800/80 dark:hover:bg-slate-800/90"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Als Lesezeichen speichern</DropdownMenuItem>
                    <DropdownMenuItem>Teilen</DropdownMenuItem>
                    <DropdownMenuItem>Melden</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <CardContent className="pt-4">
              <Link href={`/erlebnis/${erlebnis.id}`} className="block">
                <h3 className="text-lg font-semibold mb-2">{erlebnis.titel}</h3>
              </Link>
              <p className="text-muted-foreground text-sm mb-3">{erlebnis.kurzfassung}</p>

              <div className="flex flex-wrap gap-1 mb-3">
                {erlebnis.tags.slice(0, 4).map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
                {erlebnis.tags.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{erlebnis.tags.length - 4}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{erlebnis.datum}</span>
                </div>
                {erlebnis.ort && (
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{erlebnis.ort.name}</span>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="border-t pt-3 flex justify-between">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  <span>{erlebnis.statistik.ansichten}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className={`flex items-center gap-1 p-0 h-auto ${erlebnis.liked ? "text-red-500" : ""}`}
                  onClick={() => handleLike(erlebnis.id)}
                >
                  <Heart className={`h-3 w-3 ${erlebnis.liked ? "fill-current" : ""}`} />
                  <span>{erlebnis.statistik.likes}</span>
                </Button>
                <div className="flex items-center">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  <span>{erlebnis.statistik.kommentare}</span>
                </div>
              </div>

              <UserLink
                username={erlebnis.autor.name}
                avatar={erlebnis.autor.avatar}
                isVerifiziert={erlebnis.autor.verifiziert}
                size="sm"
              />
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
