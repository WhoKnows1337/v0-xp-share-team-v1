"use client"

import { useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import { Coins, Sparkles } from "lucide-react"

interface RewardToastProps {
  amount: number
  type: "mana" | "stardust"
  message?: string
  autoShow?: boolean
}

export function showRewardToast(props: RewardToastProps) {
  const { amount, type, message } = props

  const icon =
    type === "mana" ? <Coins className="h-5 w-5 text-blue-500" /> : <Sparkles className="h-5 w-5 text-purple-500" />

  const title = `🎉 +${amount} ${type === "mana" ? "Mana" : "Stardust"}!`
  const description = message || (type === "mana" ? "Weiter so!" : "Fantastisch!")

  toast({
    title,
    description,
    icon,
  })
}

export function RewardToast(props: RewardToastProps) {
  const { autoShow = true } = props

  useEffect(() => {
    if (autoShow) {
      showRewardToast(props)
    }
  }, [props, autoShow])

  return null
}
