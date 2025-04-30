import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background border-t py-12">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">XP-Share</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Teile deine Erlebnisse mit der Welt.</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  Startseite
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  Über uns
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  Funktionen
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  Preise
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Rechtliches</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  AGB
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  Cookie-Einstellungen
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Kontakt</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-500 dark:text-gray-400">E-Mail: info@xp-share.de</li>
              <li className="text-gray-500 dark:text-gray-400">Telefon: +49 123 456789</li>
              <li className="text-gray-500 dark:text-gray-400">Adresse: Musterstraße 123, 12345 Berlin</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} XP-Share. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  )
}
