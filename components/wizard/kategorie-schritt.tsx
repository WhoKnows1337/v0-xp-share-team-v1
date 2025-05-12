"use client"

import { useState, useEffect, useRef } from "react"
import type { ErlebnisData } from "../erlebnis-wizard"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Moon,
  Sparkles,
  Zap,
  Rocket,
  Ghost,
  Lightbulb,
  Compass,
  HelpCircle,
  Cpu,
  X,
  Search,
  Check,
  Heart,
  Leaf,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface KategorieSchrittProps {
  data: ErlebnisData
  updateData: (data: Partial<ErlebnisData>) => void
}

// Hauptkategorien - Reihenfolge angepasst
const hauptkategorien = [
  {
    id: "automatisch",
    name: "Automatisch erkennen",
    icon: Cpu,
    description: "KI analysiert deine Beschreibung und wählt die passende Kategorie",
  },
  { id: "traum", name: "Traum", icon: Moon, description: "Luzide Träume, wiederkehrende Träume, prophetische Träume" },
  {
    id: "nahtoderfahrung",
    name: "Nahtoderfahrung",
    icon: Sparkles,
    description: "Erlebnisse an der Schwelle zwischen Leben und Tod",
  },
  {
    id: "intuition",
    name: "Intuition",
    icon: Lightbulb,
    description: "Vorahnungen, starke Eingebungen, Bauchgefühle die sich bewahrheitet haben",
  },
  {
    id: "himmelsphänomen",
    name: "Himmelsphänomen",
    icon: Rocket,
    description: "UFO/UAP-Sichtungen, Meteoriten, Polarlichter und andere bedeutsame Phänomene am Himmel",
  },
  {
    id: "paranormal",
    name: "Paranormales",
    icon: Ghost,
    description: "Geistersichtungen, unerklärliche Phänomene, Spuk",
  },
  { id: "synchronizitat", name: "Synchronizität", icon: Zap, description: "Bedeutungsvolle Zufälle und Verbindungen" },
  {
    id: "spirituell",
    name: "Spirituelle Erfahrung",
    icon: Compass,
    description: "Erleuchtungserlebnisse, tiefe spirituelle Einsichten",
  },
  {
    id: "psychodelisch",
    name: "Psychodelische Reisen",
    icon: Sparkles,
    description: "Erfahrungen mit veränderten Bewusstseinszuständen und visionären Erlebnissen",
  },
  { id: "sonstiges", name: "Sonstiges", icon: HelpCircle, description: "Andere außergewöhnliche Erfahrungen" },
  {
    id: "gesundheit",
    name: "Gesundheit",
    icon: Heart,
    description: "Erfahrungen mit Behandlungen, Heilmethoden, Medikamenten und gesundheitsfördernden Praktiken",
  },
  {
    id: "natur",
    name: "Natur",
    icon: Leaf,
    description: "Außergewöhnliche Naturerlebnisse, Naturphänomene und Begegnungen mit der natürlichen Welt",
  },
]

// Unterkategorien für jede Hauptkategorie
const unterkategorien: Record<string, { id: string; name: string; description: string }[]> = {
  traum: [
    { id: "traum-luzid", name: "Luzider Traum", description: "Träume, in denen du dir bewusst bist, dass du träumst" },
    {
      id: "traum-wiederkehrend",
      name: "Wiederkehrender Traum",
      description: "Träume, die sich regelmäßig wiederholen",
    },
    {
      id: "traum-prophetisch",
      name: "Prophetischer Traum",
      description: "Träume, die zukünftige Ereignisse vorhersagen",
    },
    { id: "traum-albtraum", name: "Albtraum", description: "Beängstigende oder verstörende Träume" },
    { id: "traum-klartraum", name: "Klartraum", description: "Besonders lebhafte und klare Träume" },
    { id: "traum-parallelwelt", name: "Parallelwelt", description: "Träume von alternativen Realitäten oder Welten" },
  ],
  nahtoderfahrung: [
    { id: "nde-tunnel", name: "Tunnelerfahrung", description: "Erlebnis eines Tunnels mit Licht am Ende" },
    { id: "nde-lebensruckblick", name: "Lebensrückblick", description: "Erleben des eigenen Lebens wie in einem Film" },
    { id: "nde-ausserkörperlich", name: "Außerkörperliche Erfahrung", description: "Verlassen des eigenen Körpers" },
    { id: "nde-begegnung", name: "Begegnung", description: "Treffen mit verstorbenen Angehörigen oder Lichtwesen" },
    {
      id: "nde-grenzerfahrung",
      name: "Grenzerfahrung",
      description: "Erfahrung an der Schwelle zwischen Leben und Tod",
    },
  ],
  intuition: [
    { id: "intuition-vorahnung", name: "Vorahnung", description: "Gefühl, dass etwas bestimmtes passieren wird" },
    { id: "intuition-warnung", name: "Warnung", description: "Intuitive Warnung vor Gefahren oder Problemen" },
    {
      id: "intuition-entscheidung",
      name: "Entscheidungsfindung",
      description: "Intuitive Entscheidungen, die sich als richtig erweisen",
    },
    {
      id: "intuition-verbindung",
      name: "Verbindung",
      description: "Intuitive Verbindung zu anderen Menschen oder Orten",
    },
    { id: "intuition-wissen", name: "Wissen", description: "Plötzliches Wissen ohne erkennbare Quelle" },
  ],
  himmelsphänomen: [
    { id: "ufo-lichter", name: "Ungewöhnliche Lichter", description: "Beobachtung seltsamer Lichter am Himmel" },
    {
      id: "ufo-objekt",
      name: "Unidentifiziertes Objekt",
      description: "Sichtung eines nicht identifizierbaren Flugobjekts",
    },
    { id: "ufo-begegnung", name: "Nahbegegnung", description: "Direkter Kontakt oder Begegnung mit UFOs oder Wesen" },
    {
      id: "ufo-entfuhrung",
      name: "Entführungserfahrung",
      description: "Erfahrung einer möglichen Entführung durch Außerirdische",
    },
    {
      id: "ufo-zeitverlust",
      name: "Zeitverlust",
      description: "Unerklärlicher Zeitverlust während einer UFO-Sichtung",
    },
  ],
  paranormal: [
    {
      id: "paranormal-geist",
      name: "Geistersichtung",
      description: "Sichtung oder Wahrnehmung von Geistern oder Erscheinungen",
    },
    {
      id: "paranormal-spuk",
      name: "Spukphänomene",
      description: "Unerklärliche Geräusche, bewegende Objekte oder andere Phänomene",
    },
    {
      id: "paranormal-berührung",
      name: "Berührungserfahrung",
      description: "Gefühl einer Berührung ohne sichtbare Ursache",
    },
    {
      id: "paranormal-stimmen",
      name: "EVP/Stimmen",
      description: "Hören von Stimmen oder elektronische Stimmenphänomene",
    },
    {
      id: "paranormal-schatten",
      name: "Schattengestalten",
      description: "Sichtung von schattenhaften Figuren oder Wesen",
    },
  ],
  synchronizitat: [
    {
      id: "synchronizitat-zufall",
      name: "Bedeutungsvoller Zufall",
      description: "Ungewöhnliche Zufälle mit persönlicher Bedeutung",
    },
    {
      id: "synchronizitat-wiederholung",
      name: "Wiederholungsmuster",
      description: "Sich wiederholende Zahlen, Symbole oder Ereignisse",
    },
    {
      id: "synchronizitat-verbindung",
      name: "Verbindungserlebnis",
      description: "Synchrone Erlebnisse, die Menschen oder Ereignisse verbinden",
    },
    {
      id: "synchronizitat-antwort",
      name: "Antwort auf Fragen",
      description: "Synchronizitäten als Antwort auf innere Fragen",
    },
    {
      id: "synchronizitat-zeichen",
      name: "Zeichendeutung",
      description: "Deutung von Zeichen oder Symbolen in alltäglichen Ereignissen",
    },
  ],
  spirituell: [
    {
      id: "spirituell-erleuchtung",
      name: "Erleuchtungserfahrung",
      description: "Plötzliches tiefes Verständnis oder Erkenntnis",
    },
    {
      id: "spirituell-einheit",
      name: "Einheitserfahrung",
      description: "Gefühl der Einheit mit allem oder dem Universum",
    },
    {
      id: "spirituell-kundalini",
      name: "Kundalini-Erwachen",
      description: "Erwachen der Kundalini-Energie entlang der Wirbelsäule",
    },
    {
      id: "spirituell-vision",
      name: "Spirituelle Vision",
      description: "Visionen mit spiritueller oder religiöser Bedeutung",
    },
    {
      id: "spirituell-präsenz",
      name: "Göttliche Präsenz",
      description: "Wahrnehmung einer göttlichen oder höheren Präsenz",
    },
  ],
  psychodelisch: [
    {
      id: "psychodelisch-vision",
      name: "Visuelle Erfahrung",
      description: "Intensive visuelle Halluzinationen oder Muster",
    },
    { id: "psychodelisch-ego", name: "Ego-Auflösung", description: "Erfahrung der Auflösung des Selbst oder Ego-Tod" },
    { id: "psychodelisch-zeit", name: "Zeitverzerrung", description: "Verändertes Zeitempfinden oder Zeitlosigkeit" },
    {
      id: "psychodelisch-synästhesie",
      name: "Synästhesie",
      description: "Vermischung von Sinneswahrnehmungen (z.B. Farben hören)",
    },
    {
      id: "psychodelisch-einsicht",
      name: "Tiefe Einsichten",
      description: "Bedeutungsvolle Erkenntnisse oder Einsichten",
    },
  ],
  sonstiges: [
    { id: "sonstiges-deja-vu", name: "Déjà-vu", description: "Gefühl, eine Situation bereits erlebt zu haben" },
    { id: "sonstiges-zeitanomalie", name: "Zeitanomalie", description: "Unerklärliche Erfahrungen mit der Zeit" },
    {
      id: "sonstiges-energiephanomen",
      name: "Energiephänomen",
      description: "Wahrnehmung ungewöhnlicher Energien oder Felder",
    },
    { id: "sonstiges-heilung", name: "Spontanheilung", description: "Unerklärliche Heilung oder Genesung" },
    { id: "sonstiges-telepathie", name: "Telepathie", description: "Gedankenübertragung oder mentale Verbindung" },
  ],
  gesundheit: [
    {
      id: "gesundheit-heilung",
      name: "Heilungserfahrung",
      description: "Ungewöhnliche oder bemerkenswerte Heilungsprozesse",
    },
    {
      id: "gesundheit-behandlung",
      name: "Alternative Behandlung",
      description: "Erfahrungen mit alternativen oder komplementären Heilmethoden",
    },
    {
      id: "gesundheit-medikament",
      name: "Medikamentenerfahrung",
      description: "Ungewöhnliche Reaktionen oder Erfahrungen mit Medikamenten",
    },
    {
      id: "gesundheit-yoga",
      name: "Yoga & Meditation",
      description: "Transformative Erfahrungen durch Yoga oder Meditationspraxis",
    },
    {
      id: "gesundheit-atem",
      name: "Atemtechniken",
      description: "Erfahrungen mit bewussten Atemtechniken und deren Auswirkungen",
    },
  ],
  natur: [
    {
      id: "natur-katastrophe",
      name: "Naturkatastrophe",
      description: "Erlebnisse während oder im Zusammenhang mit Naturkatastrophen",
    },
    {
      id: "natur-phaenomen",
      name: "Seltenes Naturphänomen",
      description: "Beobachtung ungewöhnlicher oder seltener Naturphänomene",
    },
    {
      id: "natur-begegnung",
      name: "Tierbegegnung",
      description: "Außergewöhnliche Begegnungen mit Tieren oder ungewöhnliches Tierverhalten",
    },
    {
      id: "natur-landschaft",
      name: "Besondere Landschaft",
      description: "Erlebnisse an Orten mit besonderer Energie oder Atmosphäre",
    },
    {
      id: "natur-wetter",
      name: "Wetterphänomen",
      description: "Ungewöhnliche Wetterereignisse oder atmosphärische Erscheinungen",
    },
  ],
}

// Beispiele für jede Hauptkategorie
const beispiele: Record<string, string[]> = {
  traum: [
    "Ich konnte im Traum fliegen und wusste, dass ich träume",
    "Seit Jahren träume ich vom selben Haus, das ich nie betreten habe",
    "Ich träumte von einem Unfall, der am nächsten Tag tatsächlich passierte",
  ],
  nahtoderfahrung: [
    "Nach dem Unfall schwebte ich über meinem Körper und sah die Ärzte",
    "Ich sah ein helles Licht und fühlte tiefe Ruhe und Frieden",
    "Ich begegnete verstorbenen Verwandten, die mich begrüßten",
  ],
  himmelsphänomen: [
    "Drei pulsierende Lichter in Dreiecksformation, die plötzlich verschwanden",
    "Ein scheibenförmiges Objekt, das unmögliche Flugmanöver ausführte",
    "Ein leuchtendes Objekt, das mehrere Minuten still am Himmel stand",
  ],
  paranormal: [
    "Ich hörte deutlich meinen Namen, obwohl niemand im Raum war",
    "Gegenstände bewegten sich von selbst durch den Raum",
    "Ich sah eine schattenhafte Gestalt am Ende des Flurs stehen",
  ],
  synchronizitat: [
    "Ich dachte an einen alten Freund und erhielt Sekunden später seinen Anruf",
    "Die gleiche seltene Zahl erschien mir an einem Tag fünfmal in verschiedenen Kontexten",
    "Ein zufälliges Buch fiel aus dem Regal und öffnete sich genau bei der Seite mit der Antwort auf meine Frage",
  ],
  spirituell: [
    "Ich fühlte plötzlich eine tiefe Verbundenheit mit allem Leben",
    "Während der Meditation erlebte ich ein intensives Licht und tiefe Erkenntnis",
    "Ich spürte eine göttliche Präsenz, die mir Trost und Führung gab",
  ],
  psychodelisch: [
    "Die Grenzen zwischen mir und meiner Umgebung lösten sich vollständig auf",
    "Ich konnte Farben hören und Klänge sehen",
    "Die Zeit schien stillzustehen, während geometrische Muster mein Sichtfeld füllten",
  ],
  sonstiges: [
    "Ich wusste genau, was die andere Person sagen würde, bevor sie sprach",
    "Meine chronische Krankheit verschwand über Nacht ohne medizinische Erklärung",
    "Ich erlebte mehrere Stunden Zeitverlust, die ich nicht erklären kann",
  ],
  gesundheit: [
    "Nach einer speziellen Atemtechnik konnte ich plötzlich eine chronische Verspannung lösen",
    "Während einer Yoga-Sitzung erlebte ich eine intensive Energieströmung durch meinen Körper",
    "Ein Heilkraut, das mir empfohlen wurde, führte zu einer unerwarteten Besserung meiner Symptome",
  ],
  natur: [
    "Kurz vor dem Erdbeben verhielten sich alle Tiere in der Umgebung merkwürdig still",
    "Ich beobachtete eine perfekte Lichtsäule über dem See, die nicht durch normale Lichtbrechung erklärbar war",
    "In diesem Waldgebiet schien die Zeit anders zu verlaufen und ich verlor jedes Zeitgefühl",
  ],
}

// Farbschemata für jede Hauptkategorie
const kategorienFarben: Record<
  string,
  { bg: string; border: string; hoverBg: string; activeBg: string; iconColor: string }
> = {
  traum: {
    bg: "bg-blue-900/20",
    border: "border-blue-700/40",
    hoverBg: "hover:bg-blue-900/30",
    activeBg: "bg-blue-900/40",
    iconColor: "text-blue-400",
  },
  nahtoderfahrung: {
    bg: "bg-purple-900/20",
    border: "border-purple-700/40",
    hoverBg: "hover:bg-purple-900/30",
    activeBg: "bg-purple-900/40",
    iconColor: "text-purple-400",
  },
  intuition: {
    bg: "bg-amber-900/20",
    border: "border-amber-700/40",
    hoverBg: "hover:bg-amber-900/30",
    activeBg: "bg-amber-900/40",
    iconColor: "text-amber-400",
  },
  himmelsphänomen: {
    bg: "bg-green-900/20",
    border: "border-green-700/40",
    hoverBg: "hover:bg-green-900/30",
    activeBg: "bg-green-900/40",
    iconColor: "text-green-400",
  },
  paranormal: {
    bg: "bg-indigo-900/20",
    border: "border-indigo-700/40",
    hoverBg: "hover:bg-indigo-900/30",
    activeBg: "bg-indigo-900/40",
    iconColor: "text-indigo-400",
  },
  synchronizitat: {
    bg: "bg-cyan-900/20",
    border: "border-cyan-700/40",
    hoverBg: "hover:bg-cyan-900/30",
    activeBg: "bg-cyan-900/40",
    iconColor: "text-cyan-400",
  },
  spirituell: {
    bg: "bg-violet-900/20",
    border: "border-violet-700/40",
    hoverBg: "hover:bg-violet-900/30",
    activeBg: "bg-violet-900/40",
    iconColor: "text-violet-400",
  },
  psychodelisch: {
    bg: "bg-fuchsia-900/20",
    border: "border-fuchsia-700/40",
    hoverBg: "hover:bg-fuchsia-900/30",
    activeBg: "bg-fuchsia-900/40",
    iconColor: "text-fuchsia-400",
  },
  sonstiges: {
    bg: "bg-slate-800/50",
    border: "border-slate-700/40",
    hoverBg: "hover:bg-slate-800/70",
    activeBg: "bg-slate-800/80",
    iconColor: "text-gray-300", // Geändert von text-slate-400 zu text-gray-300 für bessere Sichtbarkeit
  },
  automatisch: {
    bg: "bg-teal-900/20",
    border: "border-teal-700/40",
    hoverBg: "hover:bg-teal-900/30",
    activeBg: "bg-teal-900/40",
    iconColor: "text-teal-400",
  },
  gesundheit: {
    bg: "bg-rose-900/20",
    border: "border-rose-700/40",
    hoverBg: "hover:bg-rose-900/30",
    activeBg: "bg-rose-900/40",
    iconColor: "text-rose-400",
  },
  natur: {
    bg: "bg-emerald-900/20",
    border: "border-emerald-700/40",
    hoverBg: "hover:bg-emerald-900/30",
    activeBg: "bg-emerald-900/40",
    iconColor: "text-emerald-400",
  },
}

// Funktion zum Abrufen der Farben für eine Kategorie
const getKategorieFarben = (kategorieId: string) => {
  return kategorienFarben[kategorieId] || kategorienFarben.sonstiges
}

export function KategorieSchritt({ data, updateData }: KategorieSchrittProps) {
  // Referenz für die erste Kategorie-Option für Fokus-Management
  const firstOptionRef = useRef<HTMLLabelElement>(null)

  // State für erweiterte Details
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(data.unterkategorie || null)
  const [subcategoryFilter, setSubcategoryFilter] = useState("")
  const [showSubcategoryInput, setShowSubcategoryInput] = useState(false)

  // State für automatisch erkannte Kategorie
  const [autoErkannteKategorie, setAutoErkannteKategorie] = useState<string>("traum")

  // State für automatisch erkannte Unterkategorie
  const [autoErkannteUnterkategorie, setAutoErkannteUnterkategorie] = useState<string | null>("traum-luzid")

  // Stelle sicher, dass die automatisch erkannte Kategorie immer verfügbar ist
  useEffect(() => {
    // Wenn keine Kategorie erkannt wurde, setze eine Standard-Mock-Kategorie
    if (!autoErkannteKategorie) {
      setAutoErkannteKategorie("traum")
      updateData({ autoErkannteKategorie: "traum" })
    }
  }, [autoErkannteKategorie, updateData])

  // Setze den Fokus auf die erste Option, wenn keine Kategorie ausgewählt ist
  useEffect(() => {
    if (!data.kategorie && firstOptionRef.current) {
      firstOptionRef.current.focus()
    }
  }, [data.kategorie])

  // Funktion zum Umschalten der erweiterten Details
  const toggleCategory = (categoryId: string) => {
    if (categoryId === "automatisch") {
      // Für "Automatisch erkennen" keine Unterkategorien anzeigen
      setExpandedCategory(null)
      return
    }

    // Wenn die Kategorie bereits expandiert ist, schließe sie
    if (expandedCategory === categoryId) {
      setExpandedCategory(null)
    } else {
      // Sonst öffne die neue Kategorie
      setExpandedCategory(categoryId)
      setSubcategoryFilter("")
      setShowSubcategoryInput(false)
    }
  }

  // Funktion zum Auswählen einer Unterkategorie
  const selectSubcategory = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId)
    updateData({ unterkategorie: subcategoryId })
    setShowSubcategoryInput(false)
  }

  // Filtere Unterkategorien basierend auf der Eingabe
  const getFilteredSubcategories = (categoryId: string) => {
    if (!unterkategorien[categoryId]) return []

    if (!subcategoryFilter) return unterkategorien[categoryId]

    return unterkategorien[categoryId].filter(
      (subcat) =>
        subcat.name.toLowerCase().includes(subcategoryFilter.toLowerCase()) ||
        subcat.description.toLowerCase().includes(subcategoryFilter.toLowerCase()),
    )
  }

  // Prüfe, ob die Kategorie Unterkategorien hat
  const hasSubcategories = (categoryId: string) => {
    return unterkategorien[categoryId] && unterkategorien[categoryId].length > 0
  }

  // Finde den Namen der ausgewählten Unterkategorie
  const getSelectedSubcategoryName = () => {
    if (!selectedSubcategory) return null

    for (const categoryId in unterkategorien) {
      const subcat = unterkategorien[categoryId].find((s) => s.id === selectedSubcategory)
      if (subcat) return subcat.name
    }

    return null
  }

  // Finde den Namen der automatisch erkannten Kategorie
  const getAutoErkannteKategorieName = () => {
    if (!autoErkannteKategorie) return null

    const kategorie = hauptkategorien.find((k) => k.id === autoErkannteKategorie)
    return kategorie ? kategorie.name : null
  }

  // Finde den Namen der automatisch erkannten Unterkategorie
  const getAutoErkannteUnterkategorieName = () => {
    if (!autoErkannteUnterkategorie) return null

    for (const categoryId in unterkategorien) {
      const subcat = unterkategorien[categoryId].find((s) => s.id === autoErkannteUnterkategorie)
      if (subcat) return subcat.name
    }

    return null
  }

  return (
    <div className="space-y-4 pb-16">
      <div>
        <h3 className="text-xl font-semibold mb-2">Wähle eine Kategorie für dein Erlebnis</h3>
        <p className="text-gray-300 mb-4">
          Die Kategorie hilft anderen, dein Erlebnis einzuordnen und ähnliche Erfahrungen zu finden.
        </p>
      </div>

      {/* Anzeige der ausgewählten Unterkategorie */}
      {selectedSubcategory && (
        <div className="mb-4 p-3 rounded-md bg-primary/20 border border-primary/30">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-300">Ausgewählte Unterkategorie:</span>
              <h4 className="font-medium">{getSelectedSubcategoryName()}</h4>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedSubcategory(null)
                updateData({ unterkategorie: undefined })
              }}
              className="text-gray-300 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <RadioGroup
        value={data.kategorie || "automatisch"} // Standardmäßig "automatisch" auswählen
        onValueChange={(value) => {
          updateData({ kategorie: value })
          // Wenn eine neue Kategorie ausgewählt wird, setze die Unterkategorie zurück
          if (selectedSubcategory && !selectedSubcategory.startsWith(value)) {
            setSelectedSubcategory(null)
            updateData({ unterkategorie: undefined })
          }
          // Öffne automatisch die Unterkategorien, wenn verfügbar
          toggleCategory(value)
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        aria-label="Kategorie des Erlebnisses"
        aria-required="true"
      >
        {hauptkategorien.map((kategorie, index) => {
          const isAutomatisch = kategorie.id === "automatisch"
          const hasSubcats = hasSubcategories(kategorie.id)
          const isExpanded = expandedCategory === kategorie.id
          const isSelected = data.kategorie === kategorie.id
          const farben = getKategorieFarben(kategorie.id)

          return (
            <div key={kategorie.id} className="relative">
              <RadioGroupItem
                value={kategorie.id}
                id={kategorie.id}
                className="peer sr-only"
                aria-labelledby={`${kategorie.id}-label`}
                aria-describedby={`${kategorie.id}-description`}
              />
              <div className="flex flex-col">
                <Label
                  htmlFor={kategorie.id}
                  className={cn(
                    "flex items-start p-4 bg-white/5 border border-white/20 rounded-lg cursor-pointer transition-all hover:bg-white/10",
                    isSelected && "border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]",
                    isAutomatisch && isSelected && "border-amber-500/70 shadow-[0_0_5px_rgba(245,158,11,0.3)]",
                    "min-h-[140px]", // Einheitliche Mindesthöhe für alle Boxen
                  )}
                  ref={index === 0 ? firstOptionRef : null}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      updateData({ kategorie: kategorie.id })
                      toggleCategory(kategorie.id)
                    }
                  }}
                  onClick={() => {
                    if (isSelected) {
                      toggleCategory(kategorie.id)
                    }
                  }}
                >
                  <kategorie.icon
                    className={cn("h-5 w-5 mr-3 mt-0.5 shrink-0", isSelected ? farben.iconColor : "text-gray-400")}
                    aria-hidden="true"
                  />
                  <div className="flex-1">
                    <div className="font-medium" id={`${kategorie.id}-label`}>
                      {kategorie.name}
                    </div>
                    <p className="text-sm text-gray-400" id={`${kategorie.id}-description`}>
                      {kategorie.description}
                    </p>

                    {/* Anzeige der automatisch erkannten Kategorie unter der Beschreibung */}
                    {isAutomatisch && autoErkannteKategorie && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center">
                          <Check className="h-4 w-4 mr-1 text-green-400" />
                          <span className="text-green-400 font-medium">Erkannt: {getAutoErkannteKategorieName()}</span>
                        </div>
                        {autoErkannteUnterkategorie && (
                          <div className="flex items-center pl-5">
                            <span className="text-green-400/80 text-sm">
                              Unterkategorie: {getAutoErkannteUnterkategorieName()}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Label>
              </div>

              {/* Erweiterte Details (Unterkategorien und Beispiele) - jetzt außerhalb des flex-col */}
              {isExpanded && hasSubcats && (
                <div
                  id={`${kategorie.id}-details`}
                  className={cn(
                    "mt-1 p-3 bg-slate-800/80 border rounded-md animate-in fade-in slide-in-from-top-2 duration-200 z-10",
                    isSelected ? "border-green-500/30" : "border-slate-700/80",
                  )}
                >
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium">Unterkategorien:</h4>

                      {/* Suchfeld für Unterkategorien */}
                      <div className="flex items-center">
                        {showSubcategoryInput ? (
                          <div className="relative">
                            <Input
                              type="text"
                              value={subcategoryFilter}
                              onChange={(e) => setSubcategoryFilter(e.target.value)}
                              placeholder="Suchen..."
                              className="h-7 text-xs w-40 bg-slate-700 border-slate-600"
                              autoFocus
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-7 w-7 p-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSubcategoryFilter("")
                                setShowSubcategoryInput(false)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowSubcategoryInput(true)
                            }}
                          >
                            <Search className="h-3 w-3 mr-1" />
                            Suchen
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {getFilteredSubcategories(kategorie.id).map((subcat) => (
                        <div
                          key={subcat.id}
                          className={cn(
                            "p-2 rounded-md cursor-pointer text-sm transition-colors",
                            selectedSubcategory === subcat.id
                              ? "bg-slate-700 border border-slate-600"
                              : "bg-slate-800/80 border border-slate-700/80 hover:bg-slate-700/70",
                          )}
                          onClick={(e) => {
                            e.stopPropagation()
                            selectSubcategory(subcat.id)
                          }}
                        >
                          <div className="font-medium">{subcat.name}</div>
                          <div className="text-xs text-gray-300 mt-1">{subcat.description}</div>
                        </div>
                      ))}

                      {getFilteredSubcategories(kategorie.id).length === 0 && (
                        <div className="text-center py-2 text-sm text-gray-400">
                          Keine passenden Unterkategorien gefunden
                        </div>
                      )}
                    </div>
                  </div>

                  {beispiele[kategorie.id] && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Beispiele:</h4>
                      <ul className="list-disc list-inside space-y-1 text-xs text-gray-300">
                        {beispiele[kategorie.id].map((beispiel, i) => (
                          <li key={i}>{beispiel}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </RadioGroup>

      <div className="bg-blue-900/30 p-4 rounded-md border border-blue-800/50 mt-6" role="note">
        <h4 className="font-medium mb-2">Tipp</h4>
        <p className="text-sm text-gray-300">
          Wähle die Kategorie, die am besten zu deinem Erlebnis passt. Für eine genauere Einordnung kannst du auch eine
          Unterkategorie auswählen. Falls du dir unsicher bist, kannst du später noch Tags hinzufügen, um dein Erlebnis
          genauer zu beschreiben oder die Option "Automatisch erkennen" verwenden.
        </p>
      </div>
    </div>
  )
}
