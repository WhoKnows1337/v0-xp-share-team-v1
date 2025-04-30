"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, MapPin, Eye, Heart, MessageSquare, MoreHorizontal, Bookmark, Share2, Flag } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserLink } from "@/components/user-link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Erlebnis } from "@/types/erlebnis"
import { toast } from "@/components/ui/use-toast"
import { ErlebnisAPI, UserAPI } from "@/lib/mock-api"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Copy } from "lucide-react"

interface ErlebnisKarteProps {
  erlebnis: Erlebnis
  compact?: boolean
  onUpdate?: (updatedErlebnis: Erlebnis) => void
}

export function ErlebnisKarte({ erlebnis, compact = false, onUpdate }: ErlebnisKarteProps) {
  const router = useRouter()
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(erlebnis.statistik?.likes || 0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Check bookmark status on mount
  React.useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const { bookmarks } = await UserAPI.getUserBookmarks()
        setIsBookmarked(bookmarks.some((b) => b.id === erlebnis.id))
      } catch (error) {
        console.error("Error checking bookmark status:", error)
      }
    }

    checkBookmarkStatus()
  }, [erlebnis.id])

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()

    try {
      setIsLoading(true)
      const newLikedState = !liked
      setLiked(newLikedState)
      setLikesCount(newLikedState ? likesCount + 1 : likesCount - 1)

      const result = await ErlebnisAPI.likeErlebnis(erlebnis.id, newLikedState)

      if (result.success && onUpdate) {
        onUpdate({
          ...erlebnis,
          statistik: {
            ...erlebnis.statistik,
            likes: result.likes,
          },
        })
      }

      if (newLikedState) {
        toast({
          description: "Dir gefällt dieses Erlebnis",
          duration: 1500,
        })
      }
    } catch (error) {
      console.error("Error liking experience:", error)
      // Revert on error
      setLiked(!liked)
      setLikesCount(liked ? likesCount - 1 : likesCount + 1)

      toast({
        title: "Fehler",
        description: "Die Aktion konnte nicht durchgeführt werden.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation()

    try {
      setIsLoading(true)
      const result = await UserAPI.toggleBookmark(erlebnis.id)
      setIsBookmarked(result.isBookmarked)

      toast({
        description: result.message,
        duration: 1500,
      })
    } catch (error) {
      console.error("Error toggling bookmark:", error)
      toast({
        title: "Fehler",
        description: "Die Aktion konnte nicht durchgeführt werden.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()

    // Create the URL for the experience
    const shareUrl = `${window.location.origin}/erlebnis/${erlebnis.id}`

    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl)

    toast({
      description: "Link in die Zwischenablage kopiert",
      duration: 1500,
    })
  }

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation()

    toast({
      title: "Erlebnis gemeldet",
      description: "Vielen Dank für deine Meldung. Wir werden den Inhalt überprüfen.",
      duration: 3000,
    })
  }

  const handleCardClick = () => {
    router.push(`/erlebnis/${erlebnis.id}`)
  }

  const handleUserLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  // Sicherstellen, dass erlebnis.medien existiert und ein Array ist
  const medien = Array.isArray(erlebnis.medien) ? erlebnis.medien : []
  const mainImage = medien.length > 0 ? medien[0].url : "/placeholder.svg"

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer ${compact ? "h-full" : ""}`}
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={mainImage || "/placeholder.svg"}
          alt={erlebnis.titel}
          className={`w-full object-cover ${compact ? "h-32" : "h-48"}`}
          onError={(e) => {
            // Fallback for broken images
            ;(e.target as HTMLImageElement).src = "/placeholder.svg"
          }}
        />
        {erlebnis.kategorie && (
          <div className="absolute top-2 left-2">
            <Badge style={{ backgroundColor: erlebnis.kategorie.farbe }} className="text-white">
              {erlebnis.kategorie.name}
            </Badge>
          </div>
        )}
        <div className="absolute top-2 right-2" onClick={handleMenuClick}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="bg-white/80 hover:bg-white/90 dark:bg-slate-800/80 dark:hover:bg-slate-800/90"
                disabled={isLoading}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleBookmark}>
                <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? "fill-current text-blue-500" : ""}`} />
                {isBookmarked ? "Aus Lesezeichen entfernen" : "Als Lesezeichen speichern"}
              </DropdownMenuItem>

              <Popover>
                <PopoverTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Teilen
                  </DropdownMenuItem>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="start">
                  <div className="grid gap-1">
                    <Button
                      variantt="ghost"
                      size="sm"
                      className="flex items-center justify-start gap-2 w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        const shareUrl = `${window.location.origin}/erlebnis/${erlebnis.id}`
                        navigator.clipboard.writeText(shareUrl)
                        toast({
                          description: "Link in die Zwischenablage kopiert",
                          duration: 1500,
                        })
                      }}
                    >
                      <Copy className="h-4 w-4" />
                      <span>Link kopieren</span>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <DropdownMenuItem onClick={handleReport} className="text-red-500">
                <Flag className="h-4 w-4 mr-2" />
                Melden
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardContent className={`pt-4 ${compact ? "pb-2" : ""}`}>
        <h3 className={`font-semibold mb-2 ${compact ? "text-base" : "text-lg"}`}>{erlebnis.titel}</h3>
        {!compact && (
          <p className="text-muted-foreground text-sm mb-3">
            {erlebnis.kiZusammenfassung || erlebnis.kurzfassung || ""}
          </p>
        )}

        {!compact && erlebnis.tags && erlebnis.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {erlebnis.tags.slice(0, 4).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {erlebnis.tags.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{erlebnis.tags.length - 4}
              </Badge>
            )}
          </div>
        )}

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

      <CardFooter className={`border-t pt-3 flex justify-between ${compact ? "pb-2" : ""}`}>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            <span>{erlebnis.statistik?.ansichten || 0}</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className={`flex items-center gap-1 p-0 h-auto ${liked ? "text-red-500" : ""}`}
            onClick={handleLike}
            disabled={isLoading}
          >
            <Heart className={`h-3 w-3 ${liked ? "fill-current" : ""}`} />
            <span>{likesCount}</span>
          </Button>
          <div className="flex items-center">
            <MessageSquare className="h-3 w-3 mr-1" />
            <span>{erlebnis.statistik?.kommentare || 0}</span>
          </div>
        </div>

        {erlebnis.autor && (
          <div onClick={handleUserLinkClick}>
            <UserLink
              username={
                typeof erlebnis.autor === "string"
                  ? erlebnis.autor
                  : erlebnis.autor.name || erlebnis.autor.username || "Unbekannt"
              }
              avatar={typeof erlebnis.autor === "string" ? undefined : erlebnis.autor.avatar}
              isVerifiziert={
                typeof erlebnis.autor === "string"
                  ? false
                  : erlebnis.autor.isVerifiziert || erlebnis.autor.verifiziert || false
              }
              size="sm"
            />
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
