"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, MessageSquare, Share2, Bookmark, Flag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTracking } from "@/hooks/use-tracking"

interface ErlebnisAktionenProps {
  erlebnisId: string
  initialLikes: number
  initialComments: number
  initialBookmarked?: boolean
}

export function ErlebnisAktionen({
  erlebnisId,
  initialLikes = 0,
  initialComments = 0,
  initialBookmarked = false,
}: ErlebnisAktionenProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)
  const { toast } = useToast()
  const tracking = useTracking()

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1)
      setIsLiked(false)
    } else {
      setLikes(likes + 1)
      setIsLiked(true)
      // Tracking für Like-Aktion
      tracking.trackExperienceLike(erlebnisId)
    }
  }

  const handleComment = () => {
    // Hier würde die Kommentar-Funktionalität implementiert werden
    console.log("Kommentar hinzufügen")

    // Tracking für Kommentar-Aktion
    tracking.trackExperienceComment(erlebnisId)
  }

  const handleShare = () => {
    // Hier würde die Teilen-Funktionalität implementiert werden
    toast({
      title: "Link kopiert",
      description: "Der Link wurde in die Zwischenablage kopiert.",
    })

    // Tracking für Teilen-Aktion
    tracking.trackExperienceShare(erlebnisId, "clipboard")
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)

    toast({
      title: isBookmarked ? "Aus Lesezeichen entfernt" : "Zu Lesezeichen hinzugefügt",
      description: isBookmarked
        ? "Das Erlebnis wurde aus deinen Lesezeichen entfernt."
        : "Das Erlebnis wurde zu deinen Lesezeichen hinzugefügt.",
    })

    // Tracking für Bookmark-Aktion
    tracking.trackEvent(isBookmarked ? "bookmark_remove" : "bookmark_add", { erlebnisId })
  }

  const handleReport = () => {
    // Hier würde die Melden-Funktionalität implementiert werden
    toast({
      title: "Erlebnis gemeldet",
      description: "Vielen Dank für deine Meldung. Wir werden das Erlebnis überprüfen.",
    })

    // Tracking für Melden-Aktion
    tracking.trackEvent("report", { erlebnisId })
  }

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center ${isLiked ? "text-red-500" : ""}`}
          onClick={handleLike}
        >
          <Heart className={`mr-1 h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          <span>{likes}</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center" onClick={handleComment}>
          <MessageSquare className="mr-1 h-4 w-4" />
          <span>{initialComments}</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center" onClick={handleShare}>
          <Share2 className="mr-1 h-4 w-4" />
          <span>Teilen</span>
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center ${isBookmarked ? "text-primary" : ""}`}
          onClick={handleBookmark}
        >
          <Bookmark className={`mr-1 h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
          <span>{isBookmarked ? "Gespeichert" : "Speichern"}</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center" onClick={handleReport}>
          <Flag className="mr-1 h-4 w-4" />
          <span>Melden</span>
        </Button>
      </div>
    </div>
  )
}
