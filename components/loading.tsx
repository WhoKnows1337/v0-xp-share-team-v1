import { Loader2 } from "lucide-react"

interface LoadingProps {
  message?: string
}

export function Loading({ message = "Wird geladen..." }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-gray-600">{message}</p>
    </div>
  )
}
