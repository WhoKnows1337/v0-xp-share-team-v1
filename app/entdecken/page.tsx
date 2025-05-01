import { EntdeckenPage } from "@/components/entdecken/entdecken-page"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"

export default function EntdeckenRoute() {
  return (
    <DashboardLayout activeTab="entdecken">
      <EntdeckenPage />
    </DashboardLayout>
  )
}
