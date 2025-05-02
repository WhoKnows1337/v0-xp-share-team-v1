import { Suspense } from "react"
import { Dashboard } from "@/components/dashboard/dashboard"
import Loading from "@/app/loading"

export default function DashboardPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  )
}
