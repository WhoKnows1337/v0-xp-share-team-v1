import { cn } from "@/lib/utils"
import type { Message } from "./xp-assistant"
import { KeeperAvatar } from "./keeper-avatar"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isKeeper = message.role === "assistant"

  return (
    <div className={cn("flex w-full gap-3", isKeeper ? "justify-start" : "justify-end")}>
      {isKeeper && (
        <div className="flex-shrink-0 mt-1">
          <KeeperAvatar size="sm" />
        </div>
      )}
      <div
        className={cn(
          "px-4 py-2 rounded-lg max-w-[80%]",
          isKeeper
            ? "bg-gradient-to-br from-slate-100 to-emerald-50/50 dark:from-slate-800 dark:to-emerald-950/30 text-slate-800 dark:text-slate-200 shadow-sm"
            : "bg-emerald-600 text-white shadow-sm",
        )}
      >
        {message.isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-300 dark:bg-emerald-500 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-emerald-300 dark:bg-emerald-500 animate-pulse delay-150" />
            <div className="w-2 h-2 rounded-full bg-emerald-300 dark:bg-emerald-500 animate-pulse delay-300" />
          </div>
        ) : (
          <div className="whitespace-pre-wrap">{message.content}</div>
        )}
      </div>
    </div>
  )
}
