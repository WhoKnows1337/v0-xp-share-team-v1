import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <Skeleton className="h-12 w-full" />
      <div className="flex flex-col md:flex-row gap-4">
        <Skeleton className="h-[600px] w-full md:w-[300px]" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-8 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-[200px] w-full" />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
