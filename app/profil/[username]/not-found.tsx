import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, User } from "lucide-react"

export default function UserNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Benutzer nicht gefunden</h1>
          <p className="text-slate-400">Der gesuchte Benutzer existiert nicht oder wurde möglicherweise gelöscht.</p>
        </div>

        <div className="p-6 bg-slate-800 rounded-lg border border-slate-700 shadow-lg">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-24 w-24 bg-slate-700 rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-slate-400" />
            </div>
            <p className="text-slate-300">Wir konnten das gesuchte Benutzerprofil nicht finden.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" className="border-slate-700 hover:bg-slate-800">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Zur Startseite
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-slate-700 hover:bg-slate-800">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zum Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
