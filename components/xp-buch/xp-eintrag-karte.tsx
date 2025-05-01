"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { XPEintrag } from "@/types/xp-eintrag"
import { useXPBuch } from "@/contexts/xp-buch-context"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { Edit, Trash2, Eye, Lock, FileEdit, Bookmark, BookmarkCheck } from "lucide-react"
import { XPEintragDetail } from "./xp-eintrag-detail"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface XPEintragKarteProps {
  eintrag: XPEintrag
  isGridView?: boolean
}

export function XPEintragKarte({ eintrag, isGridView = false }: XPEintragKarteProps) {
  const { deleteEntry, updateEntry } = useXPBuch()
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(eintrag.bookmarked || false)

  const handleDelete = () => {
    if (isConfirmingDelete) {
      deleteEntry(eintrag.id)
      setIsConfirmingDelete(false)
    } else {
      setIsConfirmingDelete(true)
    }
  }

  const toggleBookmark = () => {
    const newBookmarkState = !isBookmarked
    setIsBookmarked(newBookmarkState)
    updateEntry(eintrag.id, { bookmarked: newBookmarkState })
  }

  // Formatiere das Datum
  const formattedDate = format(new Date(eintrag.datum), "PPP", { locale: de })

  // Kürze den Inhalt für die Vorschau
  const previewContent =
    eintrag.inhalt.length > (isGridView ? 80 : 150)
      ? `${eintrag.inhalt.substring(0, isGridView ? 80 : 150)}...`
      : eintrag.inhalt

  return (
    <>
      <Card className={cn("transition-all hover:shadow-md", isGridView ? "h-full flex flex-col" : "")}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-muted-foreground">{formattedDate}</div>
              <h3 className="text-xl font-semibold mt-1">{eintrag.titel}</h3>
            </div>
            <div className="flex space-x-1">
              {eintrag.privat && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  <span>Privat</span>
                </Badge>
              )}
              {eintrag.entwurf && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <FileEdit className="h-3 w-3" />
                  <span>Entwurf</span>
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className={cn("pb-2", isGridView ? "flex-grow" : "")}>
          <p className="text-muted-foreground">{previewContent}</p>

          {eintrag.tags && eintrag.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {eintrag.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between pt-2">
          <div className="flex items-center text-sm text-muted-foreground">
            {Array.isArray(eintrag.mood) ? eintrag.mood.join(", ") : eintrag.mood}
          </div>

          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setIsDetailOpen(true)}>
              <Eye className="h-4 w-4 mr-1" />
              <span className={isGridView ? "sr-only" : ""}>Ansehen</span>
            </Button>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              <span className={isGridView ? "sr-only" : ""}>Bearbeiten</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleBookmark}>
              {isBookmarked ? (
                <BookmarkCheck className="h-4 w-4 mr-1 text-primary" />
              ) : (
                <Bookmark className="h-4 w-4 mr-1" />
              )}
              <span className={isGridView ? "sr-only" : ""}>Merken</span>
            </Button>
            <Button variant={isConfirmingDelete ? "destructive" : "ghost"} size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              <span className={isGridView ? "sr-only" : ""}>{isConfirmingDelete ? "Bestätigen" : "Löschen"}</span>
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          <XPEintragDetail eintrag={eintrag} onClose={() => setIsDetailOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
