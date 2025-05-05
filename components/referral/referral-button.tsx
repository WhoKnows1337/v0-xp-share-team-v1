"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { PartyPopper } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface ReferralButtonProps extends ButtonProps {
  showIcon?: boolean
  text?: string
}

export function ReferralButton({
  showIcon = true,
  text = "Freunde einladen",
  className,
  ...props
}: ReferralButtonProps) {
  const router = useRouter()

  return (
    <Button
      onClick={() => router.push("/referrals")}
      className={cn("bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600", className)}
      {...props}
    >
      {showIcon && <PartyPopper className="mr-2 h-4 w-4" />}
      {text}
    </Button>
  )
}
