"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function DatenschutzPage() {
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
          <h1 className="text-3xl font-bold">Datenschutzerklärung</h1>
          <p className="text-muted-foreground mt-2">Letzte Aktualisierung: 1. Januar 2024</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Datenschutzerklärung für XP-Share</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Verantwortlicher</h2>
              <p>
                Verantwortlicher für die Datenverarbeitung ist:
                <br />
                XP-Share GmbH
                <br />
                Musterstraße 123
                <br />
                20095 Hamburg
                <br />
                E-Mail: datenschutz@xp-share.de
                <br />
                Telefon: +49 40 123456789
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Erhebung und Verarbeitung personenbezogener Daten</h2>
              <h3 className="text-lg font-medium mb-2">2.1 Registrierung</h3>
              <p>Bei der Registrierung erheben wir folgende Daten:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Benutzername</li>
                <li>E-Mail-Adresse</li>
                <li>Passwort (verschlüsselt gespeichert)</li>
                <li>Profilbild (optional)</li>
                <li>Geburtsdatum (optional)</li>
              </ul>

              <h3 className="text-lg font-medium mb-2 mt-4">2.2 Nutzung der Plattform</h3>
              <p>Während der Nutzung verarbeiten wir:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Ihre geteilten Erlebnisse und Inhalte</li>
                <li>Kommentare und Bewertungen</li>
                <li>Standortdaten (nur mit Ihrer Zustimmung)</li>
                <li>Nutzungsstatistiken und Aktivitätsdaten</li>
                <li>Kommunikationsdaten (Nachrichten, Chats)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Rechtsgrundlagen</h2>
              <p>Die Verarbeitung erfolgt auf Grundlage von:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Art. 6 Abs. 1 lit. b DSGVO:</strong> Vertragserfüllung (Bereitstellung der Plattform)
                </li>
                <li>
                  <strong>Art. 6 Abs. 1 lit. a DSGVO:</strong> Einwilligung (z.B. für Standortdaten, Marketing)
                </li>
                <li>
                  <strong>Art. 6 Abs. 1 lit. f DSGVO:</strong> Berechtigte Interessen (z.B. Sicherheit, Analyse)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Weitergabe von Daten</h2>
              <p>Ihre Daten werden nur in folgenden Fällen weitergegeben:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>An andere Nutzer gemäß Ihren Privatsphäre-Einstellungen</li>
                <li>An Dienstleister (z.B. Hosting, E-Mail-Versand) unter Auftragsverarbeitungsverträgen</li>
                <li>Bei rechtlichen Verpflichtungen oder zum Schutz unserer Rechte</li>
                <li>Mit Ihrer ausdrücklichen Einwilligung</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Speicherdauer</h2>
              <p>Wir speichern Ihre Daten:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Kontodaten: Bis zur Löschung Ihres Kontos</li>
                <li>Inhalte: Bis zur Löschung durch Sie oder uns</li>
                <li>Kommunikationsdaten: 2 Jahre nach letzter Aktivität</li>
                <li>Logdaten: 6 Monate</li>
                <li>Gesetzliche Aufbewahrungsfristen bleiben unberührt</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Ihre Rechte</h2>
              <p>Sie haben folgende Rechte:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Auskunft:</strong> Information über verarbeitete Daten
                </li>
                <li>
                  <strong>Berichtigung:</strong> Korrektur falscher Daten
                </li>
                <li>
                  <strong>Löschung:</strong> Entfernung Ihrer Daten
                </li>
                <li>
                  <strong>Einschränkung:</strong> Beschränkung der Verarbeitung
                </li>
                <li>
                  <strong>Datenübertragbarkeit:</strong> Export Ihrer Daten
                </li>
                <li>
                  <strong>Widerspruch:</strong> Gegen bestimmte Verarbeitungen
                </li>
                <li>
                  <strong>Beschwerde:</strong> Bei der Datenschutzbehörde
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Cookies und Tracking</h2>
              <p>Wir verwenden:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Notwendige Cookies:</strong> Für die Funktionalität der Seite
                </li>
                <li>
                  <strong>Analyse-Cookies:</strong> Zur Verbesserung unseres Angebots (mit Einwilligung)
                </li>
                <li>
                  <strong>Marketing-Cookies:</strong> Für personalisierte Werbung (mit Einwilligung)
                </li>
              </ul>
              <p>Sie können Cookies in Ihren Browser-Einstellungen verwalten.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Sicherheit</h2>
              <p>Wir setzen technische und organisatorische Maßnahmen zum Schutz Ihrer Daten ein:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>SSL-Verschlüsselung für die Datenübertragung</li>
                <li>Verschlüsselte Speicherung sensibler Daten</li>
                <li>Regelmäßige Sicherheitsupdates</li>
                <li>Zugriffskontrolle und Berechtigungsmanagement</li>
                <li>Regelmäßige Sicherheitsaudits</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Internationale Datenübertragung</h2>
              <p>
                Ihre Daten werden hauptsächlich in der EU verarbeitet. Bei Übertragungen in Drittländer stellen wir
                durch geeignete Garantien (z.B. Standardvertragsklauseln) ein angemessenes Schutzniveau sicher.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Änderungen der Datenschutzerklärung</h2>
              <p>
                Wir können diese Datenschutzerklärung bei Bedarf anpassen. Wesentliche Änderungen teilen wir Ihnen
                rechtzeitig mit.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Kontakt</h2>
              <p>
                Bei Fragen zum Datenschutz wenden Sie sich an:
                <br />
                E-Mail: datenschutz@xp-share.de
                <br />
                Post: XP-Share GmbH, Datenschutzbeauftragter, Musterstraße 123, 20095 Hamburg
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
