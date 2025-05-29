"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Chrome, Facebook, Apple, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseAuthClient } from "@/lib/supabase-auth"

interface SocialLoginProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function SocialLogin({ onSuccess, onError }: SocialLoginProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [show2FA, setShow2FA] = useState(false)
  const [twoFactorCode, setTwoFactorCode] = useState("")
  const { toast } = useToast()

  const handleSocialLogin = async (provider: "google" | "facebook" | "apple") => {
    setIsLoading(provider)
    const supabase = getSupabaseAuthClient()

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      toast({
        title: "Anmeldung erfolgreich",
        description: `Du wirst mit ${provider} angemeldet.`,
      })

      onSuccess?.()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Anmeldung fehlgeschlagen"
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: errorMessage,
        variant: "destructive",
      })
      onError?.(errorMessage)
    } finally {
      setIsLoading(null)
    }
  }

  const handlePhoneLogin = async (phoneNumber: string) => {
    setIsLoading("phone")
    const supabase = getSupabaseAuthClient()

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      })

      if (error) throw error

      toast({
        title: "SMS gesendet",
        description: "Bitte gib den Code aus der SMS ein.",
      })

      setShow2FA(true)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "SMS-Versand fehlgeschlagen"
      toast({
        title: "Fehler",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  const verify2FA = async () => {
    const supabase = getSupabaseAuthClient()

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: "+49", // Hier würde die echte Telefonnummer stehen
        token: twoFactorCode,
        type: "sms",
      })

      if (error) throw error

      toast({
        title: "Anmeldung erfolgreich",
        description: "Du bist jetzt angemeldet.",
      })

      setShow2FA(false)
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Ungültiger Code",
        description: "Bitte überprüfe den eingegebenen Code.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <Button
            variant="outline"
            onClick={() => handleSocialLogin("google")}
            disabled={!!isLoading}
            className="w-full"
          >
            {isLoading === "google" ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
            ) : (
              <Chrome className="h-4 w-4 mr-2" />
            )}
            Mit Google anmelden
          </Button>

          <Button
            variant="outline"
            onClick={() => handleSocialLogin("facebook")}
            disabled={!!isLoading}
            className="w-full"
          >
            {isLoading === "facebook" ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
            ) : (
              <Facebook className="h-4 w-4 mr-2" />
            )}
            Mit Facebook anmelden
          </Button>

          <Button
            variant="outline"
            onClick={() => handleSocialLogin("apple")}
            disabled={!!isLoading}
            className="w-full"
          >
            {isLoading === "apple" ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
            ) : (
              <Apple className="h-4 w-4 mr-2" />
            )}
            Mit Apple anmelden
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Oder</span>
          </div>
        </div>

        <PhoneLoginForm onSubmit={handlePhoneLogin} isLoading={isLoading === "phone"} />
      </div>

      <Dialog open={show2FA} onOpenChange={setShow2FA}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zwei-Faktor-Authentifizierung</DialogTitle>
            <DialogDescription>Gib den 6-stelligen Code aus der SMS ein.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center">
              <Smartphone className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <Label htmlFor="2fa-code">Bestätigungscode</Label>
              <Input
                id="2fa-code"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
            </div>
            <Button onClick={verify2FA} className="w-full" disabled={twoFactorCode.length !== 6}>
              Code bestätigen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function PhoneLoginForm({ onSubmit, isLoading }: { onSubmit: (phone: string) => void; isLoading: boolean }) {
  const [phoneNumber, setPhoneNumber] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(phoneNumber)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Label htmlFor="phone">Telefonnummer</Label>
        <Input
          id="phone"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+49 123 456789"
          required
        />
      </div>
      <Button type="submit" variant="outline" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
        ) : (
          <Smartphone className="h-4 w-4 mr-2" />
        )}
        Mit SMS anmelden
      </Button>
    </form>
  )
}
