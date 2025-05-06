import type { ReactNode } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="container mx-auto py-6" id="admin-bereich">
      <h1 className="text-3xl font-bold mb-6">Admin-Bereich</h1>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        <Card className="h-fit admin-sidebar">
          <CardContent className="p-4">
            <nav className="space-y-2">
              <Link href="/admin" className="block p-2 hover:bg-muted rounded-md transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/tracking" className="block p-2 hover:bg-muted rounded-md transition-colors">
                Tracking
              </Link>
              <Link href="/admin/doku" className="block p-2 hover:bg-muted rounded-md transition-colors">
                Dokumentation
              </Link>
            </nav>
          </CardContent>
        </Card>

        <div>{children}</div>
      </div>
    </div>
  )
}
