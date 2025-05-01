import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { XPBuchLayout } from "@/components/xp-buch/xp-buch-layout"

export default function XPBuchPage() {
  return (
    <DashboardLayout activeTab="xp-buch">
      <XPBuchLayout />
    </DashboardLayout>
  )
}
