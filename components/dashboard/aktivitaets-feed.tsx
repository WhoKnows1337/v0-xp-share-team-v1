"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Heart, MessageSquare, Share2, Clock, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserLink } from "@/components/user-link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface AktivitaetsFeedProps {
  aktivitaeten: any[]
}

export function AktivitaetsFeed({ aktivitaeten = [] }: AktivitaetsFeedProps) {
  const [feed, setFeed] = useState(aktivitaeten)
  const router = useRouter()

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Verhindert, dass der Klick den Eintrag öffnet
    setFeed(
      feed.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            liked: !item.liked,
            likes: item.liked ? item.likes - 1 : item.likes + 1,
          }
        }
        return item
      }),
    )
  }

  const handleErlebnisClick = (aktivitaet: any) => {
    // Navigiere zur Erlebnis-Detailseite
    if (aktivitaet.erlebnisId) {
      router.push(`/erlebnis/${aktivitaet.erlebnisId}`)
    } else if (aktivitaet.id) {
      // Fallback, falls erlebnisId nicht vorhanden ist
      router.push(`/erlebnis/${aktivitaet.id}`)
    }
  }

  return (
    <div className="space-y-4">
      {feed.map((aktivitaet) => (
        <motion.div
          key={aktivitaet.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="p-4 pb-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <UserLink
                    username={aktivitaet.benutzer.name}
                    avatar={aktivitaet.benutzer.avatar}
                    isVerifiziert={aktivitaet.benutzer.verifiziert}
                  />
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{aktivitaet.zeit}</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Nicht mehr anzeigen</DropdownMenuItem>
                    <DropdownMenuItem>Melden</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-4 cursor-pointer" onClick={() => handleErlebnisClick(aktivitaet)}>
              <p className="mb-3 hover:text-primary transition-colors">{aktivitaet.text}</p>
              {aktivitaet.bild && (
                <div className="relative rounded-md overflow-hidden mb-3 hover:opacity-90 transition-opacity">
                  <img src={aktivitaet.bild || "/placeholder.svg"} alt="" className="w-full h-auto object-cover" />
                </div>
              )}
              <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                {aktivitaet.tags?.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-1 ${aktivitaet.liked ? "text-red-500" : ""}`}
                  onClick={(e) => handleLike(aktivitaet.id, e)}
                >
                  <Heart className={`h-4 w-4 ${aktivitaet.liked ? "fill-current" : ""}`} />
                  <span>{aktivitaet.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{aktivitaet.kommentare}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Share2 className="h-4 w-4" />
                  <span>Teilen</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
