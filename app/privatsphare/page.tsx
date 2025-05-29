import { ErweitertePrivatsphareEinstellungen } from "@/components/privatsphare/erweiterte-privatsphare-einstellungen"
import { DatenschutzDashboard } from "@/components/privatsphare/datenschutz-dashboard"

export default function PrivatspharePage() {
  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Privatsphäre & Datenschutz</h1>

      <div className="grid grid-cols-1 gap-8">
        <ErweitertePrivatsphareEinstellungen />
        <DatenschutzDashboard />
      </div>
    </div>
  )
}
