import { CheckCircle, Share2, Users, Calendar, MapPin, Tag, Shield } from "lucide-react"

export function FeatureSection() {
  const features = [
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Erlebnisse dokumentieren",
      description: "Halte deine besonderen Momente mit Datum, Ort und Details fest.",
    },
    {
      icon: <Share2 className="h-10 w-10 text-primary" />,
      title: "Einfach teilen",
      description: "Teile deine Erlebnisse mit Freunden, Familie oder in Gruppen.",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Gruppen erstellen",
      description: "Organisiere deine Kontakte in Gruppen für einfacheres Teilen.",
    },
    {
      icon: <MapPin className="h-10 w-10 text-primary" />,
      title: "Orte markieren",
      description: "Füge genaue Standorte zu deinen Erlebnissen hinzu.",
    },
    {
      icon: <Tag className="h-10 w-10 text-primary" />,
      title: "Mit Tags organisieren",
      description: "Kategorisiere deine Erlebnisse für bessere Übersicht.",
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Privatsphäre-Kontrolle",
      description: "Du entscheidest, wer deine Erlebnisse sehen kann.",
    },
  ]

  return (
    <section className="py-16 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Funktionen</h2>
          <p className="mt-4 text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Entdecke, was XP-Share zu bieten hat
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm border">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <div className="inline-flex items-center rounded-full border px-6 py-3 text-sm font-medium">
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            <span>Alle Funktionen sind in der kostenlosen Version enthalten</span>
          </div>
        </div>
      </div>
    </section>
  )
}
