import { Suspense } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Loading } from "@/components/loading"

// Deaktiviere SSR für die EntdeckenPage-Komponente
const EntdeckenPageClient = dynamic(
  () => import("@/components/entdecken/entdecken-page-client").then((mod) => mod.EntdeckenPageClient),
  { ssr: false, loading: () => <Loading /> },
)

// Verhindere statisches Prerendering
export const dynamic = "force-dynamic"

export default function EntdeckenRoute() {
  return (
    <DashboardLayout activeTab="entdecken">
      <Suspense fallback={<Loading />}>
        <EntdeckenPageClient />
      </Suspense>
    </DashboardLayout>
  )
}
