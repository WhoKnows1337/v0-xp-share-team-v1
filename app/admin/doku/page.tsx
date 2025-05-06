import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DokuPage() {
  return (
    <div className="w-full max-w-none">
      <div className="text-red-600 font-bold text-2xl mb-4">TEST</div>
      <Card className="border-none shadow-none">
        <CardContent className="p-0 pt-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start mb-4 overflow-x-auto flex-nowrap">
              <TabsTrigger value="overview">Übersicht</TabsTrigger>
              <TabsTrigger value="architecture">Architektur</TabsTrigger>
              <TabsTrigger value="frontend">Frontend</TabsTrigger>
              <TabsTrigger value="backend">Backend</TabsTrigger>
              <TabsTrigger value="uiux">UI/UX</TabsTrigger>
              <TabsTrigger value="components">Komponenten</TabsTrigger>
              <TabsTrigger value="problems">Probleme</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <h2 className="text-2xl font-bold">XP-Share Projektübersicht</h2>
              <p>
                XP-Share ist eine Plattform zum Teilen und Entdecken von Erfahrungen (Experiences). Die Anwendung
                ermöglicht es Benutzern, ihre persönlichen Erlebnisse zu dokumentieren, zu kategorisieren und mit
                anderen zu teilen.
              </p>

              <h3 className="text-xl font-semibold mt-6">Hauptfunktionen</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Erstellung und Verwaltung von Erfahrungsberichten</li>
                <li>Entdecken von Erlebnissen anderer Benutzer</li>
                <li>Zeitstrahl-basierte Visualisierung von Erfahrungen</li>
                <li>Persönliches XP-Buch zur privaten Dokumentation</li>
                <li>Kommunikation über Nachrichten und thematische Channels</li>
                <li>KI-gestützte Analyse und Zusammenfassung von Erlebnissen</li>
                <li>Gamification-Elemente wie Achievements und Levels</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6">Technologie-Stack</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Frontend: React mit Next.js (App Router)</li>
                <li>UI-Komponenten: shadcn/ui</li>
                <li>Styling: Tailwind CSS</li>
                <li>Mockdaten für die Entwicklung und Demonstration</li>
              </ul>
            </TabsContent>

            <TabsContent value="architecture" className="space-y-4">
              <h2 className="text-2xl font-bold">Systemarchitektur</h2>
              <p>
                XP-Share verwendet eine moderne, komponentenbasierte Architektur mit klarer Trennung von
                Zuständigkeiten.
              </p>

              <h3 className="text-xl font-semibold mt-6">Architekturübersicht</h3>
              <div className="border rounded-md p-4 bg-muted/30">
                <pre className="text-sm">
                  {`
app/                  # Next.js App Router Struktur
  page.tsx            # Startseite
  dashboard/          # Dashboard-Bereich
  entdecken/          # Entdecken-Bereich
  xp-buch/            # XP-Buch-Bereich
  nachrichten/        # Nachrichten-Bereich
  profil/             # Profilseiten
  ...

components/           # React-Komponenten
  dashboard/          # Dashboard-Komponenten
  entdecken/          # Entdecken-Komponenten
  xp-buch/            # XP-Buch-Komponenten
  nachrichten/        # Nachrichten-Komponenten
  profil/             # Profil-Komponenten
  ui/                 # UI-Komponenten (shadcn)
  ...

contexts/             # React Context Provider
  profile-context.tsx # Profil-Kontext
  xp-buch-context.tsx # XP-Buch-Kontext
  ...

hooks/                # Custom React Hooks
  use-local-storage.ts
  use-online-status.ts
  ...

lib/                  # Hilfsfunktionen und Utilities
  mock-data.ts        # Mock-Daten
  utils.ts            # Allgemeine Hilfsfunktionen
  ...

types/                # TypeScript Typdefinitionen
  erlebnis.ts
  message.ts
  ...

public/               # Statische Assets
                  `}
                </pre>
              </div>

              <h3 className="text-xl font-semibold mt-6">Datenfluss</h3>
              <p>Der Datenfluss in XP-Share folgt einem unidirektionalen Muster:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Daten werden aus Mock-APIs oder lokalen Speichern geladen</li>
                <li>Daten werden über Context Provider oder Props an Komponenten weitergegeben</li>
                <li>Komponenten rendern UI basierend auf den erhaltenen Daten</li>
                <li>Benutzerinteraktionen lösen Aktionen aus, die Daten aktualisieren</li>
                <li>Aktualisierte Daten führen zu Re-Renders der betroffenen Komponenten</li>
              </ol>
            </TabsContent>

            <TabsContent value="frontend" className="space-y-4">
              <h2 className="text-2xl font-bold">Frontend-Architektur</h2>
              <p>
                Das Frontend von XP-Share basiert auf React mit Next.js und verwendet den App Router für das Routing.
              </p>

              <h3 className="text-xl font-semibold mt-6">Komponenten-Hierarchie</h3>
              <p>
                Die Komponenten sind hierarchisch organisiert, wobei übergeordnete Komponenten für das Layout und die
                Datenbereitstellung verantwortlich sind, während untergeordnete Komponenten für spezifische UI-Elemente
                und Funktionalitäten zuständig sind.
              </p>

              <h3 className="text-xl font-semibold mt-6">State Management</h3>
              <p>Für das State Management werden verschiedene Ansätze verwendet:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Lokaler State mit useState für komponentenspezifische Zustände</li>
                <li>Context API für globale Zustände (z.B. Benutzerprofile, Einstellungen)</li>
                <li>Custom Hooks für wiederverwendbare Logik und Zustandsverwaltung</li>
                <li>LocalStorage für persistente Daten zwischen Sitzungen</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6">Routing</h3>
              <p>Das Routing basiert auf dem Next.js App Router mit folgender Struktur:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <code>/</code> - Startseite
                </li>
                <li>
                  <code>/dashboard</code> - Benutzer-Dashboard
                </li>
                <li>
                  <code>/entdecken</code> - Entdecken-Bereich
                </li>
                <li>
                  <code>/xp-buch</code> - Persönliches XP-Buch
                </li>
                <li>
                  <code>/nachrichten</code> - Nachrichten-Bereich
                </li>
                <li>
                  <code>/profil/[username]</code> - Benutzerprofile
                </li>
                <li>
                  <code>/erlebnis/[id]</code> - Detailansicht eines Erlebnisses
                </li>
                <li>
                  <code>/admin/*</code> - Admin-Bereich (nur für Administratoren)
                </li>
              </ul>
            </TabsContent>

            <TabsContent value="backend" className="space-y-4">
              <h2 className="text-2xl font-bold">Backend-Simulation</h2>
              <p>
                Da XP-Share derzeit als Frontend-Prototyp entwickelt wird, wird das Backend durch Mock-Daten und
                -Funktionen simuliert.
              </p>

              <h3 className="text-xl font-semibold mt-6">Mock-Daten</h3>
              <p>
                Die Mock-Daten sind in verschiedenen Dateien im <code>lib/</code>-Verzeichnis organisiert:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <code>mock-data.ts</code> - Allgemeine Mock-Daten
                </li>
                <li>
                  <code>mock-users.ts</code> - Benutzerprofile
                </li>
                <li>
                  <code>mock-messages.ts</code> - Nachrichten und Konversationen
                </li>
                <li>
                  <code>mock-xp-eintraege.ts</code> - XP-Buch-Einträge
                </li>
                <li>
                  <code>mock-aktivitaeten.ts</code> - Benutzeraktivitäten
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6">API-Simulation</h3>
              <p>
                Die API-Aufrufe werden durch Funktionen simuliert, die Mock-Daten zurückgeben und Verzögerungen
                einbauen, um reale Netzwerkanfragen zu imitieren.
              </p>
              <div className="border rounded-md p-4 bg-muted/30">
                <pre className="text-sm">
                  {`
// Beispiel für eine simulierte API-Funktion
export async function fetchErlebnisse(filter?: ErlebnisFilter): Promise<Erlebnis[]> {
  // Simuliere Netzwerkverzögerung
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Filtere Mock-Daten basierend auf den Filterkriterien
  let erlebnisse = [...mockErlebnisse];
  
  if (filter) {
    if (filter.kategorie) {
      erlebnisse = erlebnisse.filter(e => e.kategorie === filter.kategorie);
    }
    if (filter.zeitraum) {
      erlebnisse = erlebnisse.filter(e => 
        new Date(e.datum) >= filter.zeitraum.von && 
        new Date(e.datum) <= filter.zeitraum.bis
      );
    }
    // Weitere Filter...
  }
  
  return erlebnisse;
}
                  `}
                </pre>
              </div>

              <h3 className="text-xl font-semibold mt-6">Lokale Persistenz</h3>
              <p>
                Für einige Funktionen wird der LocalStorage des Browsers verwendet, um Daten zwischen Sitzungen zu
                speichern und eine gewisse Persistenz zu ermöglichen.
              </p>
            </TabsContent>

            <TabsContent value="uiux" className="space-y-4">
              <h2 className="text-2xl font-bold">UI/UX Design</h2>
              <p>
                Das UI/UX-Design von XP-Share folgt modernen Design-Prinzipien mit Fokus auf Benutzerfreundlichkeit,
                Zugänglichkeit und visuelle Attraktivität.
              </p>

              <h3 className="text-xl font-semibold mt-6">Design-System</h3>
              <p>XP-Share verwendet ein konsistentes Design-System basierend auf shadcn/ui und Tailwind CSS:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Einheitliche Farbpalette mit Primär- und Akzentfarben</li>
                <li>Konsistente Typografie mit klarer Hierarchie</li>
                <li>Wiederverwendbare UI-Komponenten für einheitliches Look & Feel</li>
                <li>Responsive Design für verschiedene Bildschirmgrößen</li>
                <li>Animationen und Übergänge für bessere Benutzererfahrung</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6">Benutzerflüsse</h3>
              <p>Die wichtigsten Benutzerflüsse wurden sorgfältig gestaltet:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Onboarding und Einrichtung des Benutzerprofils</li>
                <li>Erstellung und Bearbeitung von Erlebnissen</li>
                <li>Entdecken und Filtern von Erlebnissen anderer Benutzer</li>
                <li>Kommunikation über Nachrichten und Channels</li>
                <li>Verwaltung des persönlichen XP-Buchs</li>
              </ol>

              <h3 className="text-xl font-semibold mt-6">Zugänglichkeit</h3>
              <p>XP-Share legt Wert auf Zugänglichkeit (Accessibility):</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Semantisches HTML für bessere Screenreader-Unterstützung</li>
                <li>Ausreichende Farbkontraste für bessere Lesbarkeit</li>
                <li>Tastaturnavigation für Benutzer, die keine Maus verwenden können</li>
                <li>Responsive Design für verschiedene Geräte und Bildschirmgrößen</li>
                <li>Alternative Texte für Bilder und andere nicht-textuelle Inhalte</li>
              </ul>
            </TabsContent>

            <TabsContent value="components" className="space-y-4">
              <h2 className="text-2xl font-bold">Komponenten-Bibliothek</h2>
              <p>
                XP-Share verwendet eine umfangreiche Sammlung von Komponenten, die in verschiedenen Bereichen der
                Anwendung wiederverwendet werden.
              </p>

              <h3 className="text-xl font-semibold mt-6">UI-Komponenten</h3>
              <p>Basis-UI-Komponenten aus shadcn/ui:</p>
              <ul className="list-disc pl-6 space-y-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <li>Button</li>
                <li>Card</li>
                <li>Dialog</li>
                <li>Input</li>
                <li>Textarea</li>
                <li>Select</li>
                <li>Checkbox</li>
                <li>Radio</li>
                <li>Switch</li>
                <li>Tabs</li>
                <li>Toast</li>
                <li>Tooltip</li>
                <li>Badge</li>
                <li>Avatar</li>
                <li>Calendar</li>
                <li>Progress</li>
                <li>Slider</li>
                <li>Sheet</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6">Benutzerdefinierte Komponenten</h3>
              <p>Speziell für XP-Share entwickelte Komponenten:</p>

              <h4 className="text-lg font-semibold mt-4">Dashboard-Komponenten</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>DashboardSidebar - Seitenleiste mit Navigation</li>
                <li>RecentExperiences - Anzeige kürzlich erstellter Erlebnisse</li>
                <li>SharedWithMe - Anzeige von mit dem Benutzer geteilten Erlebnissen</li>
                <li>AktivitaetsFeed - Feed mit Aktivitäten im Netzwerk des Benutzers</li>
              </ul>

              <h4 className="text-lg font-semibold mt-4">Entdecken-Komponenten</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>ErlebnisKarte - Kartenansicht eines Erlebnisses</li>
                <li>ErlebnisFilter - Filter für Erlebnisse</li>
                <li>ZeitStrahl - Visualisierung von Erlebnissen auf einem Zeitstrahl</li>
                <li>OrtFilter - Filter für Orte</li>
                <li>SearchAutocomplete - Suchfeld mit Autovervollständigung</li>
              </ul>

              <h4 className="text-lg font-semibold mt-4">XP-Buch-Komponenten</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>XPBuchLayout - Layout für das XP-Buch</li>
                <li>XPBuchTabs - Tabs für verschiedene Ansichten des XP-Buchs</li>
                <li>XPEintragKarte - Kartenansicht eines XP-Buch-Eintrags</li>
                <li>XPEintragDetail - Detailansicht eines XP-Buch-Eintrags</li>
                <li>MoodSelector - Auswahl der Stimmung für einen Eintrag</li>
                <li>TagVorschlage - Vorschläge für Tags</li>
              </ul>

              <h4 className="text-lg font-semibold mt-4">Nachrichten-Komponenten</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>NachrichtenListe - Liste von Nachrichten</li>
                <li>ChatFenster - Chatfenster für Konversationen</li>
                <li>ThemenChannels - Thematische Channels</li>
                <li>NeueNachrichtDialog - Dialog zum Erstellen einer neuen Nachricht</li>
              </ul>

              <h4 className="text-lg font-semibold mt-4">Profil-Komponenten</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>ProfilHeader - Header mit Profilinformationen</li>
                <li>ProfilTabs - Tabs für verschiedene Profilansichten</li>
                <li>ErlebnisseTab - Tab mit Erlebnissen des Benutzers</li>
                <li>KommentareTab - Tab mit Kommentaren des Benutzers</li>
                <li>LesezeichenTab - Tab mit Lesezeichen des Benutzers</li>
                <li>StatistikenTab - Tab mit Statistiken des Benutzers</li>
              </ul>
            </TabsContent>

            <TabsContent value="problems" className="space-y-4">
              <h2 className="text-2xl font-bold">Bekannte Probleme und Herausforderungen</h2>
              <p>
                Während der Entwicklung von XP-Share sind verschiedene Herausforderungen und Probleme aufgetreten, die
                dokumentiert wurden.
              </p>

              <h3 className="text-xl font-semibold mt-6">Technische Herausforderungen</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Offline-Unterstützung:</strong> Die Implementierung einer robusten Offline-Funktionalität mit
                  Synchronisation ist komplex.
                </li>
                <li>
                  <strong>Leistungsoptimierung:</strong> Bei großen Datenmengen kann die Anwendung langsamer werden,
                  insbesondere bei der Visualisierung auf dem Zeitstrahl.
                </li>
                <li>
                  <strong>Responsive Design:</strong> Einige komplexe UI-Elemente wie der Zeitstrahl sind schwierig auf
                  kleinen Bildschirmen darzustellen.
                </li>
                <li>
                  <strong>Datenschutz:</strong> Die Implementierung granularer Datenschutzeinstellungen für verschiedene
                  Arten von Erlebnissen ist komplex.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6">Bekannte Bugs</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Zeitstrahl-Darstellung:</strong> Bei bestimmten Zeiträumen kann die Darstellung des
                  Zeitstrahls ungenau sein.
                </li>
                <li>
                  <strong>Filter-Reset:</strong> In einigen Fällen werden Filter nicht korrekt zurückgesetzt, wenn
                  zwischen Ansichten gewechselt wird.
                </li>
                <li>
                  <strong>Benachrichtigungen:</strong> Benachrichtigungen werden manchmal doppelt angezeigt oder
                  verschwinden nicht nach dem Lesen.
                </li>
                <li>
                  <strong>Bildupload:</strong> Große Bilder können zu Leistungsproblemen führen und werden nicht immer
                  korrekt komprimiert.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6">Geplante Verbesserungen</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Leistungsoptimierung:</strong> Implementierung von virtualisiertem Scrollen für lange Listen
                  und optimierte Bildverarbeitung.
                </li>
                <li>
                  <strong>Offline-Modus:</strong> Verbesserung der Offline-Funktionalität mit Service Workers und
                  IndexedDB.
                </li>
                <li>
                  <strong>Barrierefreiheit:</strong> Umfassende Überprüfung und Verbesserung der Barrierefreiheit gemäß
                  WCAG-Richtlinien.
                </li>
                <li>
                  <strong>Internationalisierung:</strong> Unterstützung für mehrere Sprachen und Lokalisierung von
                  Datums- und Zeitformaten.
                </li>
                <li>
                  <strong>Erweiterte Suche:</strong> Implementierung einer leistungsfähigeren Suchfunktion mit Facetten
                  und Filterung.
                </li>
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
