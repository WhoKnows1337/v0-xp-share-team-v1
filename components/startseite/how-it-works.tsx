import { Check, MapPin, Camera, Share2, Users } from "lucide-react"

const features = [
  {
    icon: <Camera className="h-10 w-10 text-emerald-500" />,
    title: "Erlebnisse dokumentieren",
    description: "Halte deine besonderen Momente mit Fotos, Videos, Audios und Texten fest.",
  },
  {
    icon: <MapPin className="h-10 w-10 text-emerald-500" />,
    title: "Orte markieren",
    description: "Verknüpfe deine Erlebnisse mit genauen Standorten auf interaktiven Karten.",
  },
  {
    icon: <Users className="h-10 w-10 text-emerald-500" />,
    title: "Gruppen erstellen",
    description: "Teile Erlebnisse mit Freunden, Familie oder speziellen Interessengruppen.",
  },
  {
    icon: <Share2 className="h-10 w-10 text-emerald-500" />,
    title: "Erfahrungen teilen",
    description: "Inspiriere andere mit deinen Erlebnissen oder entdecke neue Ideen.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">So funktioniert XP-Share</h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          In wenigen einfachen Schritten kannst du deine Erlebnisse dokumentieren und mit anderen teilen.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-emerald-500/50 transition-colors duration-300"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-slate-800/50 border border-slate-700 rounded-lg p-8">
        <h3 className="text-2xl font-bold mb-6 text-center">Warum XP-Share wählen?</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            "Intuitive Benutzeroberfläche für einfache Bedienung",
            "Umfangreiche Privatsphäre-Einstellungen",
            "Kategorisierung und Tagging für bessere Organisation",
            "Offline-Nutzung für unterwegs",
            "Interaktive Karten zur Visualisierung",
            "Multimediale Unterstützung (Fotos, Videos, Audio)",
            "Kollaborative Funktionen für Gruppenaktivitäten",
            "Personalisierte Empfehlungen",
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="mt-1 bg-emerald-500/20 p-1 rounded-full">
                <Check className="h-4 w-4 text-emerald-500" />
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
