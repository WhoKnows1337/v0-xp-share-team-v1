import type { ReactNode } from "react"

export default function AchievementsLayout({ children }: { children: ReactNode }) {
  return <div className="container mx-auto py-6">{children}</div>
}
