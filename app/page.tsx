import { VercelLayout } from "@/components/layout/vercel-layout"
import { VercelCard, VercelCardDescription, VercelCardHeader, VercelCardTitle } from "@/components/ui/vercel-card"
import { VercelButton } from "@/components/ui/vercel-button"
import { Sparkles, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <VercelLayout showSidebar={false}>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-12">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Teile deine{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                außergewöhnlichen
              </span>{" "}
              Erlebnisse
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Entdecke eine Plattform für mystische Erfahrungen, Träume und spirituelle Erlebnisse. Verbinde dich mit
              Gleichgesinnten und erkunde das Unbekannte.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <VercelButton variant="vercel" size="lg" asChild>
              <Link href="/registrieren">
                <Sparkles className="mr-2 h-4 w-4" />
                Jetzt starten
              </Link>
            </VercelButton>
            <VercelButton variant="vercel-outline" size="lg" asChild>
              <Link href="/entdecken">Erlebnisse entdecken</Link>
            </VercelButton>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-6">
          <VercelCard>
            <VercelCardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <VercelCardTitle>Erlebnisse teilen</VercelCardTitle>
              <VercelCardDescription>
                Dokumentiere deine außergewöhnlichen Erfahrungen und teile sie mit der Community
              </VercelCardDescription>
            </VercelCardHeader>
          </VercelCard>

          <VercelCard>
            <VercelCardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <VercelCardTitle>Community</VercelCardTitle>
              <VercelCardDescription>
                Verbinde dich mit Gleichgesinnten und tausche dich über mystische Erfahrungen aus
              </VercelCardDescription>
            </VercelCardHeader>
          </VercelCard>

          <VercelCard>
            <VercelCardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <VercelCardTitle>Erkenntnisse</VercelCardTitle>
              <VercelCardDescription>
                Entdecke Muster und Verbindungen zwischen verschiedenen Erfahrungen
              </VercelCardDescription>
            </VercelCardHeader>
          </VercelCard>
        </section>

        {/* Stats Section */}
        <section className="bg-accent/50 rounded-2xl p-8">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Die XP Share Community</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">1,234</div>
                <div className="text-sm text-muted-foreground">Geteilte Erlebnisse</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">567</div>
                <div className="text-sm text-muted-foreground">Aktive Nutzer</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">89</div>
                <div className="text-sm text-muted-foreground">Kategorien</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">2,345</div>
                <div className="text-sm text-muted-foreground">Verbindungen</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </VercelLayout>
  )
}
