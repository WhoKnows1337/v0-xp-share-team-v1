import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-4 w-[350px]" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-[180px] w-full" />
            <Skeleton className="h-[180px] w-full" />
            <Skeleton className="h-[180px] w-full" />
          </div>

          <Skeleton className="h-[400px] w-full" />

          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
