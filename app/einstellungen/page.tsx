import { EinstellungenDialog } from "@/components/profil/einstellungen-dialog"

export default function EinstellungenPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Einstellungen</h1>
      <EinstellungenDialog />
    </div>
  )
}
