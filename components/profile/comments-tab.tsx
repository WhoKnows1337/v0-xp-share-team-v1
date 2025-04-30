"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Heart, ExternalLink } from "lucide-react"
import Link from "next/link"
import type { User } from "@/lib/mock-users"

interface CommentsTabProps {
  user: User
}

export function CommentsTab({ user }: CommentsTabProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Kommentare</h2>

      {user.kommentare.length > 0 ? (
        <div className="space-y-4">
          {user.kommentare.map((kommentar) => (
            <motion.div
              key={kommentar.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <Link href={`/erlebnis/${kommentar.erlebnisId}`}>
                      <h3 className="font-medium hover:text-primary transition-colors">{kommentar.erlebnisTitel}</h3>
                    </Link>
                    <Badge variant="outline" className="text-xs">
                      Kommentar
                    </Badge>
                  </div>
                  <p className="text-sm mb-2">{kommentar.text}</p>
                </CardContent>
                <CardFooter className="border-t pt-3 flex justify-between">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{kommentar.datum}</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      <span>{kommentar.likes}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/erlebnis/${kommentar.erlebnisId}`}>
                      <ExternalLink className="h-3 w-3 mr-1" />
                      <span>Zum Erlebnis</span>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Keine Kommentare gefunden.</p>
        </div>
      )}
    </div>
  )
}
