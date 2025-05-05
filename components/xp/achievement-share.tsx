"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Facebook, Twitter, Linkedin, Copy } from "lucide-react"

interface AchievementShareProps {
  achievement: {
    id: string
    name: string
    description: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AchievementShare({ achievement, open, onOpenChange }: AchievementShareProps) {
  const [customMessage, setCustomMessage] = useState("")
  const { toast } = useToast()

  const shareUrl = `https://xp-share.example.com/achievements/${achievement.id}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    toast({
      title: "Link kopiert!",
      description: "Der Link wurde in die Zwischenablage kopiert.",
      duration: 3000,
    })
  }

  const handleShare = (platform: string) => {
    let shareLink = ""
    const message = customMessage || `Ich habe das Achievement "${achievement.name}" auf XP-Share freigeschaltet!`

    switch (platform) {
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          message,
        )}&url=${encodeURIComponent(shareUrl)}`
        break
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl,
        )}&quote=${encodeURIComponent(message)}`
        break
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          shareUrl,
        )}&summary=${encodeURIComponent(message)}`
        break
      default:
        return
    }

    window.open(shareLink, "_blank")
    toast({
      title: "Geteilt!",
      description: `Dein Achievement wurde auf ${platform} geteilt.`,
      duration: 3000,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Achievement teilen</DialogTitle>
          <DialogDescription>
            Teile dein Achievement "{achievement.name}" mit deinen Freunden und auf sozialen Medien.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="message">Deine Nachricht (optional)</Label>
            <Textarea
              id="message"
              placeholder="Ich habe gerade ein tolles Achievement freigeschaltet!"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Link zum Achievement</Label>
            <div className="flex items-center gap-2">
              <Input value={shareUrl} readOnly />
              <Button size="icon" variant="outline" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Auf sozialen Medien teilen</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90"
                onClick={() => handleShare("twitter")}
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-[#1877F2] text-white hover:bg-[#1877F2]/90"
                onClick={() => handleShare("facebook")}
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90"
                onClick={() => handleShare("linkedin")}
              >
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Schließen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
