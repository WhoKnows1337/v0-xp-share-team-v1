"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check, Mail, Share2, QrCode } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface ShareSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  referralLink: string
}

export function ShareSheet({ open, onOpenChange, referralLink }: ShareSheetProps) {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      toast({
        title: "Link kopiert!",
        description: "Der Einladungslink wurde in die Zwischenablage kopiert.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Fehler beim Kopieren",
        description: "Der Link konnte nicht kopiert werden. Bitte versuche es erneut.",
        variant: "destructive",
      })
    }
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent("Entdecke XP Share mit mir!")
    const body = encodeURIComponent(
      `Hey,\n\nich habe eine tolle Plattform zum Teilen von Erlebnissen entdeckt. Melde dich mit meinem Link an und wir bekommen beide 100 Mana!\n\n${referralLink}\n\nViele Grüße`,
    )
    window.open(`mailto:?subject=${subject}&body=${body}`)
    toast({
      title: "E-Mail-Client geöffnet",
      description: "Teile deinen Link per E-Mail mit Freunden.",
    })
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Entdecke XP Share mit mir!",
          text: "Melde dich mit meinem Link an und wir bekommen beide 100 Mana!",
          url: referralLink,
        })
        toast({
          title: "Geteilt!",
          description: "Danke fürs Teilen deines Links.",
        })
      } catch (err) {
        // Benutzer hat abgebrochen oder ein Fehler ist aufgetreten
        console.error("Fehler beim Teilen:", err)
      }
    } else {
      // Fallback für Browser ohne Web Share API
      handleCopy()
    }
  }

  const toggleQR = () => {
    setShowQR(!showQR)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Teile deinen Einladungslink</DialogTitle>
          <DialogDescription>
            Jede erfolgreiche Anmeldung schenkt dir 100 Mana. Teile deinen Link über einen dieser Kanäle.
          </DialogDescription>
        </DialogHeader>

        {showQR ? (
          <div className="flex flex-col items-center justify-center p-4">
            <div className="bg-white p-4 rounded-lg mb-4">
              {/* Hier würde normalerweise ein echter QR-Code generiert werden */}
              <div className="w-64 h-64 bg-gray-200 flex items-center justify-center">
                <QrCode className="w-32 h-32 text-gray-500" />
                <span className="sr-only">QR-Code für {referralLink}</span>
              </div>
            </div>
            <Button variant="outline" onClick={toggleQR}>
              Link-Optionen anzeigen
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-2 mb-4">
              <Input
                value={referralLink}
                readOnly
                className="font-mono text-sm"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button size="icon" variant="outline" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={handleEmailShare}>
                <Mail className="h-8 w-8" />
                <span>E-Mail</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={handleNativeShare}>
                <Share2 className="h-8 w-8" />
                <span>Teilen</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={toggleQR}>
                <QrCode className="h-8 w-8" />
                <span>QR-Code</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2"
                onClick={() => {
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(`Entdecke XP Share mit mir! Melde dich mit meinem Link an und wir bekommen beide 100 Mana: ${referralLink}`)}`,
                  )
                }}
              >
                <Image src="/whatsapp-logo.png" alt="WhatsApp" width={32} height={32} />
                <span>WhatsApp</span>
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
