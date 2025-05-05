import AppLayout from "../app-layout"

export default function EinstellungenPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Einstellungen</h1>

        <div className="grid gap-6">
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Persönliche Informationen</h2>
            <p className="text-muted-foreground mb-4">
              Verwalte deine persönlichen Informationen und wie diese angezeigt werden.
            </p>
            <div className="flex justify-end">
              <button className="text-primary hover:underline">Bearbeiten</button>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Konto & Sicherheit</h2>
            <p className="text-muted-foreground mb-4">
              Verwalte deine Anmeldeinformationen und Sicherheitseinstellungen.
            </p>
            <div className="flex justify-end">
              <button className="text-primary hover:underline">Bearbeiten</button>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Benachrichtigungen</h2>
            <p className="text-muted-foreground mb-4">Passe an, wie und wann du benachrichtigt werden möchtest.</p>
            <div className="flex justify-end">
              <button className="text-primary hover:underline">Bearbeiten</button>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Datenschutz</h2>
            <p className="text-muted-foreground mb-4">
              Verwalte, wer deine Inhalte sehen kann und wie deine Daten verwendet werden.
            </p>
            <div className="flex justify-end">
              <button className="text-primary hover:underline">Bearbeiten</button>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Abonnement & Zahlungen</h2>
            <p className="text-muted-foreground mb-4">Verwalte dein Abonnement und deine Zahlungsinformationen.</p>
            <div className="flex justify-end">
              <button className="text-primary hover:underline">Verwalten</button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
