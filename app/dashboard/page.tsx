import AppLayout from "../app-layout"
import { DashboardHome } from "@/components/dashboard/dashboard-home"
import { DashboardReferralBanner } from "@/components/referral/dashboard-referral-banner"

interface DashboardPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  const tab = searchParams.tab as string | undefined

  return (
    <AppLayout>
      <DashboardReferralBanner />
      <DashboardHome initialTab={tab || "overview"} />
    </AppLayout>
  )
}
