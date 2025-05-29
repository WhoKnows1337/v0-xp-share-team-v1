import { OnboardingFlow } from "@/components/onboarding/onboarding-flow"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function OnboardingPage() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">XP-Share Onboarding</h1>
      <OnboardingFlow
        onComplete={() => {
          // In einer echten Anwendung würden wir hier den Benutzer zur Dashboard-Seite weiterleiten
          // Da wir in einer statischen Umgebung sind, zeigen wir nur die Komponente an
        }}
      />
      <div className="mt-8">
        <Button asChild variant="outline">
          <Link href="/dashboard">Zum Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
