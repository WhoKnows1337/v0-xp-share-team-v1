import Image from "next/image"
import { cn } from "@/lib/utils"

interface KeeperAvatarProps {
  size?: "sm" | "md" | "lg"
  isTyping?: boolean
}

export function KeeperAvatar({ size = "md", isTyping = false }: KeeperAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }

  return (
    <div className="relative">
      <div
        className={cn(
          "relative rounded-full overflow-hidden",
          sizeClasses[size],
          isTyping ? "ring-2 ring-emerald-500 ring-offset-1" : "ring-1 ring-emerald-300/50 dark:ring-emerald-700/50",
        )}
      >
        <Image
          src="/keeper-avatar.png"
          alt="Keeper Avatar"
          width={48}
          height={48}
          className={cn("object-cover", isTyping && "animate-pulse")}
        />
      </div>
      {isTyping && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800"></span>
      )}
    </div>
  )
}
