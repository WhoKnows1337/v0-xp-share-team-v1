"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NutzungsbedingungenPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/registrieren">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zur Registrierung
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Nutzungsbedingungen</h1>
          <p className="text-muted-foreground mt-2">Letzte Aktualisierung: 1. Januar 2024</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Allgemeine Geschäftsbedingungen für XP-Share</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Geltungsbereich</h2>
              <p>
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der XP-Share Plattform, einem
                Service zum Teilen und Entdecken von Erlebnissen. Durch die Registrierung und Nutzung unserer Dienste
                akzeptieren Sie diese Bedingungen.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Registrierung und Nutzerkonto</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sie müssen mindestens 16 Jahre alt sein, um ein Konto zu erstellen</li>
                <li>Sie sind verpflichtet, wahrheitsgemäße Angaben zu machen</li>
                <li>Sie sind für die Sicherheit Ihres Kontos verantwortlich</li>
                <li>Ein Konto ist nicht übertragbar</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Nutzung der Plattform</h2>
              <p>Sie verpflichten sich:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Die Plattform nur für legale Zwecke zu nutzen</li>
                <li>Keine beleidigenden, diskriminierenden oder rechtswidrigen Inhalte zu veröffentlichen</li>
                <li>Die Rechte anderer Nutzer zu respektieren</li>
                <li>Keine Spam- oder Werbeinhalte ohne Genehmigung zu posten</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Inhalte und geistiges Eigentum</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sie behalten die Rechte an Ihren veröffentlichten Inhalten</li>
                <li>Sie gewähren XP-Share eine Lizenz zur Nutzung Ihrer Inhalte auf der Plattform</li>
                <li>Sie dürfen keine urheberrechtlich geschützten Inhalte ohne Erlaubnis verwenden</li>
                <li>XP-Share behält sich das Recht vor, Inhalte zu moderieren oder zu entfernen</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Datenschutz</h2>
              <p>
                Der Schutz Ihrer persönlichen Daten ist uns wichtig. Details zur Datenverarbeitung finden Sie in unserer
                Datenschutzerklärung.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Haftung</h2>
              <p>
                XP-Share haftet nur für Schäden, die auf Vorsatz oder grober Fahrlässigkeit beruhen. Die Haftung für
                leichte Fahrlässigkeit ist ausgeschlossen, soweit nicht Schäden aus der Verletzung des Lebens, des
                Körpers oder der Gesundheit betroffen sind.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Kündigung</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sie können Ihr Konto jederzeit kündigen</li>
                <li>XP-Share kann Konten bei Verstößen gegen diese AGB sperren</li>
                <li>Bei Kündigung werden Ihre Daten gemäß unserer Datenschutzerklärung behandelt</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Änderungen der AGB</h2>
              <p>
                XP-Share behält sich das Recht vor, diese AGB zu ändern. Änderungen werden Ihnen rechtzeitig mitgeteilt.
                Widersprechen Sie nicht innerhalb von 30 Tagen, gelten die Änderungen als angenommen.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Schlussbestimmungen</h2>
              <p>
                Es gilt deutsches Recht. Gerichtsstand ist Hamburg. Sollten einzelne Bestimmungen unwirksam sein, bleibt
                die Wirksamkeit der übrigen Bestimmungen unberührt.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Kontakt</h2>
              <p>
                Bei Fragen zu diesen AGB wenden Sie sich an:
                <br />
                XP-Share GmbH
                <br />
                Musterstraße 123
                <br />
                20095 Hamburg
                <br />
                E-Mail: legal@xp-share.de
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
