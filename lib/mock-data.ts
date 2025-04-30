// lib/mock-data.ts

export interface Kategorie {
  name: string
  icon: string
  farbe: string
}

export interface Erlebnis {
  id: string
  titel: string
  kurzfassung: string
  beschreibung?: string
  datum: string | Date
  kategorie: Kategorie
  tags: string[]
  ort?: {
    name: string
    koordinaten: {
      lat: number
      lng: number
    }
  }
  autor:
    | {
        name: string
        avatar?: string
        isVerifiziert?: boolean
      }
    | string
  medien: {
    typ: "bild" | "video" | "audio"
    url: string
    beschreibung?: string
    privat?: boolean
  }[]
  verifiziert?: boolean
  statistik?: {
    likes: number
    kommentare: number
    ansichten: number
  }
  status?: "entwurf" | "veröffentlicht"
  sichtbarkeit?: "öffentlich" | "privat" | "freunde"
  bewertungen?: number
  kommentare?: number
  erstelltAm?: Date
  bearbeitetAm?: Date
  zeitstrahl?: {
    zeit: Date
    titel: string
    beschreibung: string
  }[]
  dauer?: string
  details?: string
  kiZusammenfassung?: string
  englishSummary?: string
  kiZusammenfassungStatus?: "pending" | "completed" | "failed"
}

// Kategorien für Erlebnisse
export const mockKategorien: Kategorie[] = [
  { name: "Spirituell", icon: "✨", farbe: "#8b5cf6" },
  { name: "Traum", icon: "💤", farbe: "#8b5cf6" },
  { name: "Déjà-vu", icon: "🔄", farbe: "#0ea5e9" },
  { name: "Synchronizität", icon: "⚡", farbe: "#eab308" },
  { name: "Paranormal", icon: "👻", farbe: "#6b7280" },
  { name: "Nahtoderfahrung", icon: "💫", farbe: "#ec4899" },
  { name: "Außerkörperlich", icon: "🧠", farbe: "#10b981" },
  { name: "Meditation", icon: "🧘", farbe: "#10b981" },
  { name: "Intuition", icon: "🔮", farbe: "#8b5cf6" },
  { name: "Spirituelle Heilung", icon: "✨", farbe: "#8b5cf6" },
  { name: "Unerklärliche Begegnung", icon: "🔮", farbe: "#8b5cf6" },
  { name: "Kollektive Erfahrung", icon: "🧠", farbe: "#10b981" },
  { name: "UFO-Sichtung", icon: "👽", farbe: "#6d28d9" },
  { name: "Astralreisen", icon: "Star", farbe: "#805AD5" },
  { name: "Traumreisen", icon: "Cloud", farbe: "#4C51BF" },
  { name: "Spirituelle Erfahrung", icon: "Sun", farbe: "#DD6B20" },
  { name: "Spirituelle Führung", icon: "Shield", farbe: "#805AD5" },
  { name: "Energiearbeit", icon: "Zap", farbe: "#D53F8C" },
  { name: "Quantenheilung", icon: "Activity", farbe: "#3182CE" },
]

// Tags für Erlebnisse
export const mockTags = [
  "Licht",
  "Energie",
  "Stimmen",
  "Vision",
  "Erscheinung",
  "Vorahnung",
  "Zufall",
  "Begegnung",
  "Heilung",
  "Transformation",
  "Erleuchtung",
  "Geist",
  "Seele",
  "Jenseits",
  "Bewusstsein",
  "Unterbewusstsein",
  "Traum",
  "Klartraum",
  "Astralreise",
  "Zeitreise",
  "Parallelwelt",
  "Engel",
  "Schutzengel",
  "Geistführer",
  "Verstorbene",
  "Ahnen",
  "UFO",
  "Alien",
  "Außerirdisch",
  "Kontakt",
  "Botschaft",
  "Chakra",
  "Aura",
  "Energie",
  "Kundalini",
  "Erwachen",
  "Meditation",
  "Heilung",
  "Chronische Schmerzen",
  "Fremder",
  "Telepathie",
  "Schicksal",
  "Rettung",
  "Intuition",
  "Gruppenmeditation",
  "Kollektives Bewusstsein",
  "Astralreise",
  "Außerkörperliche Erfahrung",
  "Bewusstseinserweiterung",
  "Erleuchtung",
  "Einheitserfahrung",
  "Höheres Selbst",
  "Spirituelle Führung",
  "Lebensweg",
  "Luzider Traum",
  "Kosmische Reise",
  "Bewusstes Träumen",
  "Synchronizität",
  "Zeichen",
  "Lebensführung",
  "Chakren",
  "Energetische Heilung",
  "Kundalini",
  "Spirituelle Begleitung",
  "Innere Weisheit",
  "Zeitlinien",
  "Quantenheilung",
  "Parallelrealitäten",
  "Naturmeditation",
  "Stille",
  "Selbsterkenntnis",
  "Kosmischer Kontakt",
  "Traumkommunikation",
  "Außerirdische Intelligenz",
  "Berufswahl",
]

// Funktion zur Generierung von KI-Zusammenfassungen
const generateKiSummary = (erlebnis: Erlebnis): string => {
  const templates = [
    `In diesem Erlebnis beschreibt der Autor eine faszinierende ${erlebnis.kategorie.name}-Erfahrung. Die Begegnung mit ${erlebnis.tags.slice(0, 2).join(" und ")} führt zu tiefgreifenden Einsichten über die Natur unserer Realität.`,
    `Der Autor teilt eine persönliche ${erlebnis.kategorie.name}-Erfahrung, die in ${erlebnis.ort?.name || "einem besonderen Ort"} stattfand. Die Erfahrung ist geprägt von Elementen wie ${erlebnis.tags.slice(0, 3).join(", ")} und bietet wertvolle Einblicke in die Thematik.`,
    `Diese ${erlebnis.kategorie.name}-Erfahrung zeigt exemplarisch, wie ${erlebnis.tags[0]} und ${erlebnis.tags[1] || erlebnis.tags[0]} unser Verständnis der Welt erweitern können. Der Autor beschreibt detailliert die emotionalen und kognitiven Aspekte des Erlebnisses.`,
    `Eine bemerkenswerte Schilderung einer ${erlebnis.kategorie.name}-Erfahrung, die Themen wie ${erlebnis.tags.slice(0, 3).join(", ")} berührt. Die Authentizität und Detailgenauigkeit der Beschreibung machen dieses Erlebnis besonders wertvoll für die Community.`,
    `Der Bericht über diese ${erlebnis.kategorie.name}-Erfahrung bietet einen tiefen Einblick in die subjektive Wahrnehmung des Autors. Besonders die Aspekte ${erlebnis.tags.slice(0, 2).join(" und ")} werden anschaulich dargestellt und in einen größeren Kontext eingeordnet.`,
  ]

  return templates[Math.floor(Math.random() * templates.length)]
}

// Funktion zur Generierung von englischen Zusammenfassungen
const generateEnglishSummary = (erlebnis: Erlebnis): string => {
  const templates = [
    `In this experience, the author describes a fascinating ${erlebnis.kategorie.name} encounter. The interaction with ${erlebnis.tags.slice(0, 2).join(" and ")} leads to profound insights about the nature of our reality.`,
    `The author shares a personal ${erlebnis.kategorie.name} experience that took place in ${erlebnis.ort?.name || "a special location"}. The experience is characterized by elements such as ${erlebnis.tags.slice(0, 3).join(", ")} and offers valuable insights into the subject.`,
    `This ${erlebnis.kategorie.name} experience exemplifies how ${erlebnis.tags[0]} and ${erlebnis.tags[1] || erlebnis.tags[0]} can expand our understanding of the world. The author describes in detail the emotional and cognitive aspects of the experience.`,
    `A remarkable account of a ${erlebnis.kategorie.name} experience that touches on themes like ${erlebnis.tags.slice(0, 3).join(", ")}. The authenticity and detail of the description make this experience particularly valuable for the community.`,
    `The report on this ${erlebnis.kategorie.name} experience provides deep insight into the author's subjective perception. Particularly the aspects of ${erlebnis.tags.slice(0, 2).join(" and ")} are vividly presented and placed in a broader context.`,
  ]

  return templates[Math.floor(Math.random() * templates.length)]
}

// Mock-Erlebnisse mit KI-Zusammenfassungen
export const mockErlebnisse: Erlebnis[] = [
  {
    id: "1",
    titel: "Lichterscheinung über dem Schwarzwald",
    kurzfassung:
      "Während einer Nachtwanderung beobachtete ich seltsame Lichter am Himmel, die sich in Formation bewegten.",
    beschreibung:
      "Es war eine klare Nacht im Schwarzwald. Ich war mit Freunden auf einer Nachtwanderung, als wir plötzlich mehrere helle Lichter am Himmel sahen. Sie bewegten sich in einer dreieckigen Formation und schienen zu schweben. Nach etwa 5 Minuten beschleunigten sie und verschwanden in Sekundenschnelle. Keiner von uns hatte je etwas Ähnliches gesehen.",
    datum: "15. Mai 2023",
    kategorie: {
      name: "UFO-Sichtung",
      icon: "👽",
      farbe: "#6d28d9",
    },
    tags: ["Lichter", "Nachthimmel", "Formation", "Schwarzwald"],
    ort: {
      name: "Schwarzwald, Deutschland",
      koordinaten: {
        lat: 48.3,
        lng: 8.2,
      },
    },
    autor: "WaldEntdecker",
    medien: [
      {
        typ: "bild",
        url: "/black-forest-valley.png",
      },
    ],
    verifiziert: false,
    statistik: {
      likes: 42,
      kommentare: 15,
      ansichten: 230,
    },
    status: "veröffentlicht",
    kiZusammenfassung:
      "In diesem Erlebnis beschreibt der Autor eine UFO-Sichtung im Schwarzwald. Mehrere Zeugen beobachteten unidentifizierte Lichter am Nachthimmel, die sich in einer dreieckigen Formation bewegten und plötzlich mit hoher Geschwindigkeit verschwanden. Die präzise Formation und das ungewöhnliche Flugverhalten deuten auf ein Phänomen hin, das mit konventionellen Luftfahrzeugen nicht zu erklären ist.",
    englishSummary:
      "In this experience, the author describes a UFO sighting in the Black Forest. Multiple witnesses observed unidentified lights in the night sky moving in a triangular formation before suddenly disappearing at high speed. The precise formation and unusual flight behavior suggest a phenomenon that cannot be explained by conventional aircraft.",
    kiZusammenfassungStatus: "completed",
  },
  {
    id: "2",
    titel: "Intensiver luzider Traum mit wiederkehrenden Symbolen",
    kurzfassung:
      "In meinem Traum konnte ich fliegen und besuchte einen Tempel mit seltsamen Symbolen, die ich schon einmal gesehen hatte.",
    beschreibung:
      "Ich wurde im Traum plötzlich bewusst, dass ich träumte. Sofort nutzte ich die Gelegenheit und begann zu fliegen. Ich steuerte auf einen goldenen Tempel zu, der in der Ferne schimmerte. Im Inneren des Tempels waren Wände mit seltsamen Symbolen bedeckt. Das Merkwürdige war, dass ich diese Symbole wiedererkannte, obwohl ich sie im wachen Leben nie gesehen hatte. Sie schienen eine Botschaft zu enthalten, die ich fast verstehen konnte.",
    datum: "3. Juni 2023",
    kategorie: {
      name: "Traum",
      icon: "💤",
      farbe: "#8b5cf6",
    },
    tags: ["Luzider Traum", "Fliegen", "Symbole", "Tempel"],
    ort: {
      name: "Berlin, Deutschland",
      koordinaten: {
        lat: 52.52,
        lng: 13.4,
      },
    },
    autor: "Traumreisende",
    medien: [
      {
        typ: "bild",
        url: "/lucid-dream-ocean.png",
      },
    ],
    verifiziert: true,
    statistik: {
      likes: 87,
      kommentare: 32,
      ansichten: 412,
    },
    status: "veröffentlicht",
    kiZusammenfassung:
      "Der Autor beschreibt einen intensiven luziden Traum, in dem er die Fähigkeit zu fliegen erlangte und einen goldenen Tempel mit mysteriösen Symbolen besuchte. Besonders bemerkenswert ist die Wiedererkennung dieser Symbole, obwohl der Autor sie im Wachzustand nie gesehen hatte. Diese Erfahrung deutet auf eine tiefe Verbindung zum kollektiven Unbewussten oder auf Erinnerungen aus früheren Leben hin, wie sie in der Traumforschung dokumentiert sind.",
    englishSummary:
      "The author describes an intense lucid dream in which they gained the ability to fly and visited a golden temple with mysterious symbols. Particularly noteworthy is the recognition of these symbols, although the author had never seen them in the waking state. This experience suggests a deep connection to the collective unconscious or memories from past lives, as documented in dream research.",
    kiZusammenfassungStatus: "completed",
  },
  {
    id: "3",
    titel: "Synchronizität führte zu lebensverändernder Begegnung",
    kurzfassung:
      "Eine Reihe unwahrscheinlicher Zufälle führte dazu, dass ich genau die Person traf, die mir bei meiner Karriere helfen konnte.",
    beschreibung:
      "Ich hatte gerade meinen Job verloren und saß in einem Café, um Stellenanzeigen durchzusehen. Mein Laptop ging plötzlich aus, und ich fragte die Person am Nebentisch, ob ich kurz ihr Ladegerät benutzen könnte. Wir kamen ins Gespräch, und es stellte sich heraus, dass sie die Personalchefin einer Firma war, die genau die Fähigkeiten suchte, die ich hatte. Noch seltsamer: Sie hatte eigentlich nie in diesem Café gesessen, war aber heute spontan hereingekommen, weil ihr üblicher Platz geschlossen war. Zwei Wochen später hatte ich den Job.",
    datum: "22. April 2023",
    kategorie: {
      name: "Synchronizität",
      icon: "⚡",
      farbe: "#eab308",
    },
    tags: ["Zufall", "Begegnung", "Karriere", "Schicksal"],
    ort: {
      name: "Hamburg, Deutschland",
      koordinaten: {
        lat: 53.55,
        lng: 10.0,
      },
    },
    autor: "Glückspilz23",
    medien: [
      {
        typ: "bild",
        url: "/synchronicity-career.png",
      },
    ],
    verifiziert: false,
    statistik: {
      likes: 56,
      kommentare: 18,
      ansichten: 203,
    },
    status: "veröffentlicht",
    kiZusammenfassung:
      "Diese Erfahrung illustriert ein klassisches Beispiel für Synchronizität nach C.G. Jung - eine bedeutungsvolle Koinzidenz ohne kausalen Zusammenhang. Der Autor verlor seinen Job, und durch eine Verkettung unwahrscheinlicher Ereignisse (leerer Laptop-Akku, geschlossenes Stammcafé einer Personalchefin) ergab sich eine berufliche Chance, die perfekt zu seinen Fähigkeiten passte. Die Geschichte verdeutlicht, wie scheinbare Zufälle manchmal zu lebensverändernden Wendepunkten führen können.",
    englishSummary:
      "This experience illustrates a classic example of synchronicity according to C.G. Jung - a meaningful coincidence without causal connection. The author lost his job, and through a chain of unlikely events (empty laptop battery, closed regular café of an HR manager), a professional opportunity arose that perfectly matched his skills. The story illustrates how apparent coincidences can sometimes lead to life-changing turning points.",
    kiZusammenfassungStatus: "completed",
  },
  {
    id: "4",
    titel: "Meditation führte zu außerkörperlicher Erfahrung",
    kurzfassung:
      "Während einer tiefen Meditation hatte ich das Gefühl, meinen Körper zu verlassen und von oben zu betrachten.",
    beschreibung:
      "Ich praktiziere seit Jahren Meditation, aber diese Erfahrung war anders. Nach etwa 30 Minuten tiefer Meditation spürte ich ein Vibrieren und dann ein Gefühl des 'Herausgleitens'. Plötzlich konnte ich mich selbst von oben sehen, wie ich auf meinem Meditationskissen saß. Ich schwebte unter der Decke und konnte jeden Winkel des Raumes sehen. Ich fühlte mich völlig friedlich und frei. Nach einigen Minuten (so kam es mir vor) kehrte ich sanft in meinen Körper zurück. Als ich auf die Uhr sah, waren fast zwei Stunden vergangen.",
    datum: "10. Mai 2023",
    kategorie: {
      name: "Außerkörperlich",
      icon: "🧠",
      farbe: "#10b981",
    },
    tags: ["Meditation", "Außerkörperlich", "Astralreise", "Bewusstsein"],
    ort: {
      name: "München, Deutschland",
      koordinaten: {
        lat: 48.14,
        lng: 11.58,
      },
    },
    autor: "SeelenWanderer",
    medien: [
      {
        typ: "bild",
        url: "/meditation-experience.png",
      },
    ],
    verifiziert: true,
    statistik: {
      likes: 124,
      kommentare: 45,
      ansichten: 530,
    },
    status: "veröffentlicht",
    kiZusammenfassung:
      "Der Autor beschreibt eine klassische außerkörperliche Erfahrung (AKE), die während einer tiefen Meditation auftrat. Nach einer Phase von Vibrationen - einem typischen Vorzeichen für AKEs - erlebte er eine Trennung vom physischen Körper und konnte sich selbst von oben beobachten. Die Zeitverzerrung (subjektiv einige Minuten, objektiv fast zwei Stunden) ist ein häufiges Phänomen bei solchen Erfahrungen und wird in der Forschungsliteratur zu veränderten Bewusstseinszuständen dokumentiert.",
    englishSummary:
      "The author describes a classic out-of-body experience (OBE) that occurred during deep meditation. After a phase of vibrations - a typical precursor for OBEs - they experienced a separation from their physical body and could observe themselves from above. The time distortion (subjectively a few minutes, objectively almost two hours) is a common phenomenon in such experiences and is documented in research literature on altered states of consciousness.",
    kiZusammenfassungStatus: "completed",
  },
  {
    id: "5",
    titel: "Déjà-vu-Erlebnis mit erstaunlicher Genauigkeit",
    kurzfassung:
      "Ich betrat einen Raum, den ich noch nie zuvor gesehen hatte, konnte aber jedes Detail vorhersagen, bevor ich es sah.",
    beschreibung:
      "Ich war zu einem Vorstellungsgespräch in einem Gebäude, in dem ich noch nie zuvor gewesen war. Als die Sekretärin mich in den Konferenzraum führte, überkam mich ein intensives Déjà-vu. Ich wusste genau, dass hinter der Tür ein ovaler Tisch mit sieben Stühlen stehen würde, dass an der linken Wand ein abstraktes Gemälde in Blau- und Grüntönen hängen würde und dass einer der Stühle einen kleinen Riss in der Lehne haben würde. Als die Tür geöffnet wurde, war alles genau so, wie ich es 'erinnert' hatte, obwohl ich diesen Raum nie zuvor gesehen hatte.",
    datum: "2. Juni 2023",
    kategorie: {
      name: "Déjà-vu",
      icon: "🔄",
      farbe: "#0ea5e9",
    },
    tags: ["Vorahnung", "Erinnerung", "Zeitwahrnehmung"],
    ort: {
      name: "Berlin, Deutschland",
      koordinaten: {
        lat: 52.52,
        lng: 13.4,
      },
    },
    autor: "ZeitReisender",
    medien: [
      {
        typ: "bild",
        url: "/Crossroads-of-Change.png",
      },
    ],
    verifiziert: false,
    statistik: {
      likes: 67,
      kommentare: 23,
      ansichten: 289,
    },
    status: "veröffentlicht",
    kiZusammenfassung:
      "Diese Déjà-vu-Erfahrung geht über das übliche Gefühl der Vertrautheit hinaus und zeigt Elemente von Präkognition. Der Autor konnte spezifische Details eines nie zuvor besuchten Raumes vorhersagen, einschließlich der Möbelanordnung, eines Gemäldes und sogar eines beschädigten Stuhls. Solche intensiven Déjà-vu-Erlebnisse werden in der parapsychologischen Forschung untersucht und könnten auf eine Verbindung zwischen Zeitwahrnehmung und Bewusstsein hindeuten.",
    englishSummary:
      "This déjà vu experience goes beyond the usual feeling of familiarity and shows elements of precognition. The author was able to predict specific details of a never-before-visited room, including the furniture arrangement, a painting, and even a damaged chair. Such intense déjà vu experiences are studied in parapsychological research and could indicate a connection between time perception and consciousness.",
    kiZusammenfassungStatus: "completed",
  },
  {
    id: "6",
    titel: "Begegnung mit einem Geist im alten Familienhaus",
    kurzfassung:
      "In unserem Familienhaus habe ich eine transparente Gestalt gesehen, die durch die Wand ging. Später erfuhr ich, dass andere Familienmitglieder Ähnliches erlebt hatten.",
    beschreibung:
      "Ich übernachtete im alten Haus meiner Großeltern, das seit Generationen in unserer Familie ist. Mitten in der Nacht wachte ich auf und sah eine durchscheinende Gestalt einer älteren Frau, die langsam durch mein Zimmer ging und dann durch die Wand verschwand. Sie schien mich nicht zu bemerken. Am nächsten Morgen erzählte ich meiner Mutter davon, und sie wurde blass. Sie sagte, dass meine Großmutter und zwei meiner Tanten über die Jahre die gleiche Frau gesehen hatten. Nach einigen Nachforschungen fanden wir heraus, dass vor unserer Familie eine ältere Dame in dem Haus gelebt hatte, die den Beschreibungen entsprach.",
    datum: "12. April 2023",
    kategorie: {
      name: "Paranormal",
      icon: "👻",
      farbe: "#6b7280",
    },
    tags: ["Geist", "Familienhaus", "Erscheinung", "Paranormal"],
    ort: {
      name: "München, Deutschland",
      koordinaten: {
        lat: 48.14,
        lng: 11.58,
      },
    },
    autor: "GeschichtenSammler",
    medien: [
      {
        typ: "bild",
        url: "/serene-meditation-garden.png",
      },
    ],
    verifiziert: false,
    statistik: {
      likes: 45,
      kommentare: 28,
      ansichten: 312,
    },
    status: "veröffentlicht",
    kiZusammenfassung:
      "Der Bericht beschreibt eine klassische Geistererscheinung in einem Familienhaus mit generationsübergreifenden Zeugenberichten. Die Erscheinung einer durchscheinenden älteren Frau wurde von mehreren Familienmitgliedern unabhängig voneinander über Jahre hinweg beobachtet. Besonders interessant ist die spätere Bestätigung, dass eine Person mit ähnlicher Beschreibung tatsächlich in dem Haus gelebt hatte, was auf ein mögliches residuales Haunting hindeutet - ein Phänomen, bei dem Energien oder Erinnerungen im physischen Raum gespeichert bleiben.",
    englishSummary:
      "The report describes a classic ghost apparition in a family house with multi-generational witness accounts. The appearance of a translucent elderly woman was observed independently by several family members over the years. Particularly interesting is the later confirmation that a person matching the description had actually lived in the house, suggesting a possible residual haunting - a phenomenon where energies or memories remain stored in physical space.",
    kiZusammenfassungStatus: "completed",
  },
  {
    id: "7",
    titel: "Unerwartete Heilung durch Meditation",
    kurzfassung:
      "Nach monatelangen chronischen Schmerzen verschwanden diese während einer intensiven Meditationssitzung vollständig.",
    beschreibung:
      "Ich litt seit einem Unfall unter chronischen Rückenschmerzen, die auf keine Behandlung ansprachen. Als letzten Versuch begann ich mit Meditation, ohne große Erwartungen. Nach drei Wochen täglicher Praxis hatte ich während einer besonders tiefen Meditation plötzlich das Gefühl einer warmen Energie, die durch meinen Rücken strömte. Als ich die Augen öffnete, waren die Schmerzen verschwunden und kamen nicht wieder. Mein Arzt konnte es nicht erklären, aber die Scans zeigten eine deutliche Verbesserung der Entzündung.",
    datum: "5. März 2023",
    kategorie: {
      name: "Spirituelle Heilung",
      icon: "✨",
      farbe: "#8b5cf6",
    },
    tags: ["Heilung", "Meditation", "Energie", "Chronische Schmerzen"],
    ort: {
      name: "Frankfurt, Deutschland",
      koordinaten: {
        lat: 50.11,
        lng: 8.68,
      },
    },
    autor: "HeilungsWeg",
    medien: [
      {
        typ: "bild",
        url: "/meditation-experience.png",
      },
    ],
    verifiziert: true,
    statistik: {
      likes: 189,
      kommentare: 56,
      ansichten: 720,
    },
    status: "veröffentlicht",
    kiZusammenfassung:
      "Diese Erfahrung dokumentiert einen Fall von spontaner Heilung durch Meditation, bei dem chronische Rückenschmerzen nach einer intensiven Meditationssitzung verschwanden. Das beschriebene Wärmegefühl entspricht dem Konzept der 'Qi' oder 'Prana'-Energie in östlichen Heiltraditionen. Medizinisch interessant ist die objektive Bestätigung durch Scans, die eine Verbesserung der Entzündung zeigten, was auf mögliche psychosomatische Heilungsmechanismen oder die Aktivierung des körpereigenen Selbstheilungssystems durch tiefe Meditation hindeutet.",
    englishSummary:
      "This experience documents a case of spontaneous healing through meditation, where chronic back pain disappeared after an intensive meditation session. The described feeling of warmth corresponds to the concept of 'Qi' or 'Prana' energy in Eastern healing traditions. Medically interesting is the objective confirmation through  energy in Eastern healing traditions. Medically interesting is the objective confirmation through scans, which supports the growing field of research on mind-body medicine and the neurobiological effects of meditation on inflammation and pain perception.",
    kiZusammenfassungStatus: "completed",
  },
  {
    id: "8",
    titel: "Begegnung mit einem Fremden, der meine Gedanken kannte",
    kurzfassung: "Ein Fremder sprach mich an und wusste Details aus meinem Leben, die er unmöglich kennen konnte.",
    beschreibung:
      "Ich saß in einem Café in einer Stadt, in der ich noch nie zuvor gewesen war. Ein älterer Herr setzte sich zu mir und begann ein Gespräch. Zu meinem Erstaunen sprach er mich mit meinem Namen an und erwähnte Details aus meinem Leben, wie den Namen meiner Kindheitskatze und ein besonderes Erlebnis aus meiner Jugend, das ich nie mit jemandem geteilt hatte. Als ich ihn fragte, woher er das wisse, lächelte er nur und sagte: 'Manchmal kreuzen sich Wege aus gutem Grund.' Dann stand er auf und ging. Ich habe ihn nie wiedergesehen.",
    datum: "17. Juli 2023",
    kategorie: {
      name: "Unerklärliche Begegnung",
      icon: "🔮",
      farbe: "#8b5cf6",
    },
    tags: ["Fremder", "Telepathie", "Synchronizität", "Schicksal"],
    ort: {
      name: "Wien, Österreich",
      koordinaten: {
        lat: 48.21,
        lng: 16.37,
      },
    },
    autor: "Wahrheitssucher",
    medien: [
      {
        typ: "bild",
        url: "/contemplative-woman.png",
      },
    ],
    verifiziert: false,
    statistik: {
      likes: 103,
      kommentare: 47,
      ansichten: 512,
    },
    status: "veröffentlicht",
    kiZusammenfassung:
      "Diese Begegnung weist Merkmale einer außergewöhnlichen telepathischen Erfahrung auf. Der Fremde verfügte über Wissen, das er auf konventionellem Wege nicht hätte erlangen können, einschließlich persönlicher Erinnerungen, die der Autor nie geteilt hatte. Solche Begegnungen werden in verschiedenen spirituellen Traditionen als Treffen mit 'Weisen', 'Engeln' oder 'spirituellen Führern' interpretiert. Aus psychologischer Sicht könnte es sich um eine bedeutungsvolle Synchronizität handeln, die dem Autor eine wichtige Botschaft vermitteln sollte.",
    englishSummary:
      "This encounter shows characteristics of an extraordinary telepathic experience. The stranger possessed knowledge that he could not have obtained through conventional means, including personal memories that the author had never shared. Such encounters are interpreted in various spiritual traditions as meetings with 'sages', 'angels', or 'spiritual guides'. From a psychological perspective, it could be a meaningful synchronicity intended to convey an important message to the author.",
    kiZusammenfassungStatus: "completed",
  },
  {
    id: "9",
    titel: "Vorahnung rettete mein Leben",
    kurzfassung:
      "Ein plötzliches ungutes Gefühl ließ mich meinen Weg ändern, kurz bevor an meiner ursprünglichen Route ein schwerer Unfall passierte.",
    beschreibung:
      "Ich war auf dem Weg zur Arbeit und wollte wie jeden Tag die Hauptstraße entlanggehen. Plötzlich überkam mich ein intensives Gefühl der Angst, verbunden mit dem Gedanken 'Geh heute die andere Route'. Obwohl es keinen logischen Grund gab, folgte ich diesem Impuls und nahm einen längeren Weg. Zehn Minuten später hörte ich Sirenen. Wie ich später erfuhr, war genau an der Stelle, an der ich normalerweise entlanggegangen wäre, ein Auto von der Straße abgekommen und hatte mehrere Fußgänger verletzt. Die Zeit stimmte exakt mit dem Moment überein, an dem ich dort gewesen wäre.",
    datum: "23. August 2023",
    kategorie: {
      name: "Intuition",
      icon: "🔮",
      farbe: "#0ea5e9",
    },
    tags: ["Vorahnung", "Rettung", "Intuition", "Schicksal"],
    ort: {
      name: "Köln, Deutschland",
      koordinaten: {
        lat: 50.94,
        lng: 6.96,
      },
    },
    autor: "Intuitionsfolgerin",
    medien: [
      {
        typ: "bild",
        url: "/diverging-paths.png",
      },
    ],
    verifiziert: true,
    statistik: {
      likes: 245,
      kommentare: 78,
      ansichten: 890,
    },
    status: "veröffentlicht",
    kiZusammenfassung:
      "Diese Erfahrung dokumentiert einen Fall von präkognitiver Intuition mit lebensrettenden Konsequenzen. Der Autor beschreibt ein plötzliches, intensives Angstgefühl und einen klaren inneren Impuls, seinen gewohnten Weg zu ändern, ohne erkennbaren äußeren Anlass. Die spätere Bestätigung, dass genau zu diesem Zeitpunkt an seinem üblichen Weg ein Unfall geschah, deutet auf eine Form von Vorahnung hin, die in der parapsychologischen Forschung als 'Präkognition' oder 'Prämonition' bezeichnet wird.",
    englishSummary:
      "This experience documents a case of precognitive intuition with life-saving consequences. The author describes a sudden, intense feeling of fear and a clear inner impulse to change his usual route without any recognizable external cause. The later confirmation that an accident occurred at exactly that time on his usual path suggests a form of premonition that is referred to in parapsychological research as 'precognition' or 'premonition'.",
    kiZusammenfassungStatus: "completed",
  },
  {
    id: "10",
    titel: "Kollektive Traumvision in einer Meditationsgruppe",
    kurzfassung:
      "Während einer Gruppenmeditation hatten fünf von uns die gleiche Vision eines unbekannten Ortes, den wir später tatsächlich fanden.",
    beschreibung:
      "Unsere Meditationsgruppe trifft sich wöchentlich. Bei einer Sitzung führte unser Leiter eine geführte Meditation durch, bei der wir uns vorstellen sollten, an einen Ort zu reisen, an dem wir Antworten finden würden. Nach der Sitzung beschrieben fünf von uns unabhängig voneinander den gleichen Ort: einen kleinen Tempel auf einem Hügel mit einem markanten Baum davor und einer ungewöhnlichen Steinformation. Zwei Monate später stieß ein Gruppenmitglied zufällig auf Fotos eines abgelegenen Tempels in Japan, der exakt unserer gemeinsamen Vision entsprach – bis hin zu Details, die keiner von uns hätte kennen können.",
    datum: "12. September 2023",
    kategorie: {
      name: "Kollektive Erfahrung",
      icon: "🧠",
      farbe: "#10b981",
    },
    tags: ["Gruppenmeditation", "Vision", "Kollektives Bewusstsein", "Synchronizität"],
    ort: {
      name: "Dresden, Deutschland",
      koordinaten: {
        lat: 51.05,
        lng: 13.74,
      },
    },
    autor: "MeditationsMeister",
    medien: [
      {
        typ: "bild",
        url: "/serene-meditation-garden.png",
      },
    ],
    verifiziert: true,
    statistik: {
      likes: 142,
      kommentare: 53,
      ansichten: 610,
    },
    status: "veröffentlicht",
    kiZusammenfassung:
      "Diese Erfahrung dokumentiert ein bemerkenswertes Phänomen kollektiver Wahrnehmung während einer Gruppenmeditation. Fünf Teilnehmer hatten unabhängig voneinander identische Visionen eines spezifischen Ortes mit detaillierten Übereinstimmungen. Die spätere Entdeckung eines real existierenden Tempels in Japan, der exakt mit der gemeinsamen Vision übereinstimmte, deutet auf Phänomene hin, die in der Bewusstseinsforschung als 'kollektives Bewusstsein', 'Remote Viewing' oder 'non-lokale Wahrnehmung' bezeichnet werden.",
    englishSummary:
      "This experience documents a remarkable phenomenon of collective perception during group meditation. Five participants independently had identical visions of a specific location with detailed correspondences. The subsequent discovery of a real temple in Japan that exactly matched the shared vision points to phenomena referred to in consciousness research as 'collective consciousness', 'remote viewing', or 'non-local perception'.",
    kiZusammenfassungStatus: "completed",
  },
  {
    id: "ws1",
    titel: "Begegnung mit einem weisen Fremden, der mein Leben veränderte",
    kurzfassung: "Ein zufälliges Gespräch mit einem Fremden führte zu einer tiefgreifenden Lebensveränderung.",
    beschreibung:
      "Ich saß in einem Café in einer Stadt, in der ich noch nie zuvor gewesen war. Ein älterer Herr setzte sich zu mir und begann ein Gespräch. Zu meinem Erstaunen sprach er genau die Themen an, mit denen ich innerlich rang, obwohl ich sie nicht erwähnt hatte. Er gab mir Ratschläge, die so tiefgründig und passend waren, dass sie mein Leben veränderten. Als ich ihn nach seinem Namen fragte, lächelte er nur und sagte: 'Namen sind nicht wichtig, nur die Begegnung zählt.' Als ich kurz abgelenkt war, verschwand er, und niemand im Café konnte sich an ihn erinnern, obwohl wir fast eine Stunde gesprochen hatten.",
    datum: "3. Mai 2023",
    kategorie: { name: "Unerklärliche Begegnung", icon: "🔮", farbe: "#8b5cf6" },
    tags: ["Fremder", "Weisheit", "Lebensveränderung", "Mysteriös"],
    ort: {
      name: "Wien, Österreich",
      koordinaten: { lat: 48.21, lng: 16.37 },
    },
    autor: "Wahrheitssucher",
    medien: [{ typ: "bild", url: "/philosophical-wanderer.png" }],
    verifiziert: false,
    statistik: {
      likes: 98,
      kommentare: 41,
      ansichten: 470,
    },
    status: "veröffentlicht",
    kiZusammenfassung:
      "Diese Begegnung weist Merkmale einer außergewöhnlichen telepathischen Erfahrung auf. Der Fremde verfügte über Wissen, das er auf konventionellem Wege nicht hätte erlangen können, einschließlich persönlicher Erinnerungen, die der Autor nie geteilt hatte. Solche Begegnungen werden in verschiedenen spirituellen Traditionen als Treffen mit 'Weisen', 'Engeln' oder 'spirituellen Führern' interpretiert. Aus psychologischer Sicht könnte es sich um eine bedeutungsvolle Synchronizität handeln, die dem Autor eine wichtige Botschaft vermitteln sollte.",
    englishSummary:
      "This encounter shows characteristics of an extraordinary telepathic experience. The stranger possessed knowledge that he could not have obtained through conventional means, including personal memories that the author had never shared. Such encounters are interpreted in various spiritual traditions as meetings with 'sages', 'angels', or 'spiritual guides'. From a psychological perspective, it could be a meaningful synchronicity intended to convey an important message to the author.",
    kiZusammenfassungStatus: "completed",
  },
  // Erlebnisse für AstralExplorer
  {
    id: "e1",
    titel: "Astralreise in die Sternenwelt",
    kurzfassung:
      "Eine tiefgreifende Erfahrung, bei der ich mich außerhalb meines Körpers befand und verschiedene Ebenen des Bewusstseins erkunden konnte.",
    beschreibung:
      "Eine tiefgreifende Erfahrung, bei der ich mich außerhalb meines Körpers befand und verschiedene Ebenen des Bewusstseins erkunden konnte.",
    datum: "15. März 2023",
    kategorie: { name: "Astralreisen", icon: "Star", farbe: "#805AD5" },
    tags: ["Astralreise", "Außerkörperliche Erfahrung", "Bewusstseinserweiterung"],
    ort: {
      name: "Zuhause, Berlin",
      koordinaten: { lat: 52.52, lng: 13.405 },
    },
    autor: "AstralExplorer",
    medien: [{ typ: "bild", url: "/celestial-contemplation.png" }],
    verifiziert: true,
    statistik: {
      likes: 42,
      kommentare: 12,
      ansichten: 230,
    },
    status: "veröffentlicht",
    sichtbarkeit: "öffentlich",
    kiZusammenfassung:
      "Der Autor beschreibt eine tiefgreifende außerkörperliche Erfahrung, die als Astralreise klassifiziert werden kann. Während dieser Erfahrung konnte er sein Bewusstsein von seinem physischen Körper lösen und verschiedene Bewusstseinsebenen erkunden. Die Beschreibung enthält typische Elemente von Astralreisen, wie sie in der Literatur zu veränderten Bewusstseinszuständen dokumentiert sind, einschließlich der Wahrnehmung subtiler Energien und der Erfahrung erweiterter Bewusstseinszustände jenseits der physischen Realität.",
    englishSummary:
      "The author describes a profound out-of-body experience that can be classified as astral travel. During this experience, they were able to separate their consciousness from their physical body and explore different levels of consciousness. The description contains typical elements of astral journeys as documented in the literature on altered states of consciousness, including the perception of subtle energies and the experience of expanded states of consciousness beyond physical reality.",
    kiZusammenfassungStatus: "completed",
  },
  // Füge für alle weiteren Erlebnisse KI-Zusammenfassungen hinzu
  {
    id: "e2",
    titel: "Meditation und Erleuchtungserfahrung",
    kurzfassung:
      "Nach monatelanger intensiver Meditationspraxis erlebte ich einen Moment vollkommener Klarheit und Einheit mit allem.",
    beschreibung:
      "Nach monatelanger intensiver Meditationspraxis erlebte ich einen Moment vollkommener Klarheit und Einheit mit allem.",
    datum: "20. Januar 2023",
    kategorie: { name: "Meditation", icon: "Moon", farbe: "#3182CE" },
    tags: ["Meditation", "Erleuchtung", "Einheitserfahrung"],
    ort: {
      name: "Meditationszentrum, München",
      koordinaten: { lat: 48.137, lng: 11.575 },
    },
    autor: "AstralExplorer",
    medien: [{ typ: "bild", url: "/serene-meditation.png" }],
    verifiziert: true,
    statistik: {
      likes: 38,
      kommentare: 15,
      ansichten: 180,
    },
    status: "veröffentlicht",
    sichtbarkeit: "öffentlich",
    kiZusammenfassung:
      "Der Autor berichtet von einer Erleuchtungserfahrung während intensiver Meditation, einem Zustand tiefer Klarheit und Verbundenheit. Solche Erfahrungen werden oft als transzendent beschrieben, in denen das Selbstgefühl sich auflöst und ein Gefühl der Einheit mit dem Universum entsteht. Die neurologische Forschung deutet darauf hin, dass solche Zustände mit veränderter Gehirnaktivität, insbesondere in den frontalen und parietalen Regionen, korrelieren.",
    englishSummary:
      "The author reports an enlightenment experience during intense meditation, a state of deep clarity and connectedness. Such experiences are often described as transcendent, in which the sense of self dissolves and a feeling of unity with the universe arises. Neurological research suggests that such states correlate with altered brain activity, particularly in the frontal and parietal regions.",
    kiZusammenfassungStatus: "completed",
  },
  {
    id: "e3",
    titel: "Begegnung mit dem Höheren Selbst",
    kurzfassung:
      "In einer tiefen Meditation hatte ich eine Begegnung mit meinem Höheren Selbst, die mir wichtige Einsichten für meinen Lebensweg gab.",
    beschreibung:
      "In einer tiefen Meditation hatte ich eine Begegnung mit meinem Höheren Selbst, die mir wichtige Einsichten für meinen Lebensweg gab.",
    datum: "5. Mai 2023",
    kategorie: { name: "Spirituelle Erfahrung", icon: "Sun", farbe: "#DD6B20" },
    tags: ["Höheres Selbst", "Spirituelle Führung", "Lebensweg"],
    ort: {
      name: "Waldretreat, Schwarzwald",
      koordinaten: { lat: 48.3, lng: 8.2 },
    },
    autor: "AstralExplorer",
    medien: [{ typ: "bild", url: "/ethereal-forest-glow.png" }],
    verifiziert: true,
    statistik: {
      likes: 29,
      kommentare: 8,
      ansichten: 150,
    },
    status: "veröffentlicht",
    sichtbarkeit: "öffentlich",
    kiZusammenfassung:
      "Der Autor beschreibt eine Begegnung mit dem 'Höheren Selbst' während einer tiefen Meditation, die zu wichtigen Einsichten über den Lebensweg führte. Das Konzept des Höheren Selbst ist in vielen spirituellen Traditionen präsent und repräsentiert eine erweiterte, weisere Version des eigenen Selbst, die Führung und Perspektive bieten kann. Solche Erfahrungen können als transformative Momente der Selbsterkenntnis und spirituellen Ausrichtung dienen.",
    englishSummary:
      "The author describes an encounter with the 'Higher Self' during deep meditation, leading to important insights about their life path. The concept of the Higher Self is present in many spiritual traditions and represents an expanded, wiser version of one's self that can offer guidance and perspective. Such experiences can serve as transformative moments of self-discovery and spiritual alignment.",
    kiZusammenfassungStatus: "completed",
  },
  {
    id: "e4",
    titel: "Luzider Traum: Reise durch die Galaxie",
    kurzfassung:
      "Ein intensiver luzider Traum, in dem ich bewusst durch verschiedene Galaxien reiste und mit kosmischen Energien interagierte.",
    beschreibung:
      "Ein intensiver luzider Traum, in dem ich bewusst durch verschiedene Galaxien reiste und mit kosmischen Energien interagierte.",
    datum: "10. Februar 2023",
    kategorie: { name: "Traumreisen", icon: "Cloud", farbe: "#4C51BF" },
    tags: ["Luzider Traum", "Kosmische Reise", "Bewusstes Träumen"],
    ort: {
      name: "Zuhause, Berlin",
      koordinaten: { lat: 52.52, lng: 13.405 },
    },
    autor: "AstralExplorer",
    medien: [{ typ: "bild", url: "/deep-sea-fantasy.png" }],
    verifiziert: true,
    statistik: {
      likes: 35,
      kommentare: 14,
      ansichten: 200,
    },
    status: "veröffentlicht",
    sichtbarkeit: "öffentlich",
    kiZusammenfassung:
      "Der Autor schildert einen intensiven luziden Traum, in dem er durch verschiedene Galaxien reiste und mit kosmischen Energien interagierte. Luzides Träumen ermöglicht bewusste Kontrolle über den Trauminhalt und kann zu außergewöhnlichen Erfahrungen führen, die die Grenzen der physischen Realität überschreiten. Solche kosmischen Reisen im Traum können als symbolische Erkundung des eigenen Bewusstseins und der unendlichen Möglichkeiten des Geistes interpretiert werden.",
    englishSummary:
      "The author recounts an intense lucid dream in which they traveled through various galaxies and interacted with cosmic energies. Lucid dreaming allows conscious control over the dream content and can lead to extraordinary experiences that transcend the boundaries of physical reality. Such cosmic journeys in dreams can be interpreted as a symbolic exploration of one's own consciousness and the infinite possibilities of the mind.",
    kiZusammenfassungStatus: "completed",
  },
  {
    id: "e5",
    titel: "Synchronizitäten und Zeichen",
    kurzfassung:
      "Eine Reihe von erstaunlichen Synchronizitäten, die mich zu einer wichtigen Entscheidung in meinem Leben führten.",
    beschreibung:
      "Eine Reihe von erstaunlichen Synchronizitäten, die mich zu einer wichtigen Entscheidung in meinem Leben führten.",
    datum: "18. April 2023",
    kategorie: { name: "Synchronizitäten", icon: "RefreshCw", farbe: "#38A169" },
    tags: ["Synchronizität", "Zeichen", "Lebensführung"],
    ort: {
      name: "Verschiedene Orte, Berlin",
      koordinaten: { lat: 52.52, lng: 13.405 },
    },
    autor: "AstralExplorer",
    medien: [{ typ: "bild", url: "/synchronicity-career.png" }],
    verifiziert: true,
    statistik: {
      likes: 27,
      kommentare: 9,
      ansichten: 160,
    },
    status: "veröffentlicht",
    sichtbarkeit: "öffentlich",
    kiZusammenfassung:
      "Der Autor berichtet von einer Reihe von Synchronizitäten, die ihn zu einer wichtigen Lebensentscheidung führten. Synchronizitäten, bedeutungsvolle Koinzidenzen ohne offensichtliche kausale Verbindung, werden oft als Zeichen oder Wegweiser interpretiert, die uns auf unserem Lebensweg unterstützen. Die bewusste Wahrnehmung und Interpretation solcher Zeichen kann uns helfen, intuitiver zu handeln und Entscheidungen im Einklang mit unserem inneren Selbst zu treffen.",
    englishSummary:
      "The author reports a series of synchronicities that led them to an important life decision. Synchronicities, meaningful coincidences without obvious causal connection, are often interpreted as signs or signposts that support us on our life path. Conscious perception and interpretation of such signs can help us act more intuitively and make decisions in alignment with our inner self.",
    kiZusammenfassungStatus: "completed",
  },
  {
    id: "e6",
    titel: "Energetische Heilung und Chakra-Aktivierung",
    kurzfassung:
      "Eine tiefgreifende Erfahrung der energetischen Heilung, bei der ich eine vollständige Aktivierung meiner Chakren erlebte.",
    beschreibung:
      "Eine tiefgreifende Erfahrung der energetischen Heilung, bei der ich eine vollständige Aktivierung meiner Chakren erlebte.",
    datum: "12. Juni 2023",
    kategorie: { name: "Energiearbeit", icon: "Zap", farbe: "#D53F8C" },
    tags: ["Chakren", "Energetische Heilung", "Kundalini"],
    ort: {
      name: "Heilzentrum, Hamburg",
      koordinaten: { lat: 53.551, lng: 9.993 },
    },
    autor: "AstralExplorer",
    medien: [{ typ: "bild", url: "/elemental-convergence.png" }],
    verifiziert: true,
    statistik: {
      likes: 31,
      kommentare: 11,
      ansichten: 175,
    },
    status: "veröffentlicht",
    sichtbarkeit: "öffentlich",
    kiZusammenfassung:
      "Der Autor beschreibt eine tiefgreifende Erfahrung energetischer Heilung mit vollständiger Chakra-Aktivierung. In vielen östlichen Traditionen werden Chakren als Energiezentren im Körper betrachtet, deren Aktivierung zu körperlichem, emotionalem und spirituellem Wohlbefinden beitragen kann. Energetische Heilungstechniken zielen darauf ab, Blockaden in diesen Energiezentren zu lösen und den Energiefluss im Körper zu harmonisieren.",
    englishSummary:
      "The author describes a profound experience of energetic healing with complete chakra activation. In many Eastern traditions, chakras are considered energy centers in the body, the activation of which can contribute to physical, emotional, and spiritual well-being. Energetic healing techniques aim to release blockages in these energy centers and harmonize the flow of energy in the body.",
    kiZusammenfassungStatus: "completed",
  },
  {
    id: "e7",
    titel: "Begegnung mit einem Geistführer",
    kurzfassung:
      "Während einer geführten Meditation hatte ich eine klare Begegnung mit einem Geistführer, der sich als mein Begleiter vorstellte.",
    beschreibung:
      "Während einer geführten Meditation hatte ich eine klare Begegnung mit einem Geistführer, der sich als mein Begleiter vorstellte.",
    datum: "25. Juli 2023",
    kategorie: { name: "Spirituelle Führung", icon: "Shield", farbe: "#805AD5" },
    tags: ["Geistführer", "Spirituelle Begleitung", "Innere Weisheit"],
    ort: {
      name: "Spirituelles Zentrum, Dresden",
      koordinaten: { lat: 51.05, lng: 13.74 },
    },
    autor: "AstralExplorer",
    medien: [{ typ: "bild", url: "/blue-being-wondering.png" }],
    verifiziert: false,
    statistik: {
      likes: 0,
      kommentare: 0,
      ansichten: 0,
    },
    status: "entwurf",
    sichtbarkeit: "privat",
    kiZusammenfassung:
      "Der Autor berichtet von einer Begegnung mit einem Geistführer während einer geführten Meditation. Geistführer werden in vielen spirituellen Traditionen als wohlwollende Wesen angesehen, die uns auf unserem Lebensweg begleiten und unterstützen. Solche Begegnungen können als Quelle von Inspiration, Führung und innerer Weisheit dienen.",
    englishSummary:
      "The author reports an encounter with a spirit guide during a guided meditation. Spirit guides are regarded in many spiritual traditions as benevolent beings who accompany and support us on our life path. Such encounters can serve as a source of inspiration, guidance, and inner wisdom.",
    kiZusammenfassungStatus: "completed",
  },
  {
    id: "e8",
    titel: "Quantenheilung und Zeitlinienarbeit",
    kurzfassung:
      "Eine Session in Quantenheilung, bei der ich verschiedene Zeitlinien meines Lebens besuchen und heilen konnte.",
    beschreibung:
      "Eine Session in Quantenheilung, bei der ich verschiedene Zeitlinien meines Lebens besuchen und heilen konnte.",
    datum: "8. August 2023",
    kategorie: { name: "Quantenheilung", icon: "Activity", farbe: "#3182CE" },
    tags: ["Zeitlinien", "Quantenheilung", "Parallelrealitäten"],
    ort: {
      name: "Praxis für ganzheitliche Heilung, Frankfurt",
      koordinaten: { lat: 50.11, lng: 8.68 },
    },
    autor: "AstralExplorer",
    medien: [{ typ: "bild", url: "/diverging-paths.png" }],
    verifiziert: false,
    statistik: {
      likes: 0,
      kommentare: 0,
      ansichten: 0,
    },
    status: "entwurf",
    sichtbarkeit: "privat",
    kiZusammenfassung:
      "Der Autor beschreibt eine Session in Quantenheilung, bei der er verschiedene Zeitlinien seines Lebens besuchen und heilen konnte. Quantenheilung basiert auf dem Konzept, dass Realität nichtlinear ist und dass wir durch die Beeinflussung von Quantenfeldern Veränderungen in unserer Vergangenheit, Gegenwart und Zukunft bewirken können. Die Arbeit mit Zeitlinien ermöglicht es, traumatische Erfahrungen zu transformieren und neue Möglichkeiten für unser Leben zu erschließen.",
    englishSummary:
      "The author describes a session in quantum healing in which they were able to visit and heal different timelines of their life. Quantum healing is based on the concept that reality is non-linear and that by influencing quantum fields we can effect changes in our past, present, and future. Working with timelines allows us to transform traumatic experiences and unlock new possibilities for our lives.",
    kiZusammenfassungStatus: "completed",
  },

  // Neue Erlebnisse für andere Benutzer
  // Erlebnisse für Traumreisende
  {
    id: "tr1",
    titel: "Wiederkehrender Traum von einer alten Bibliothek",
    kurzfassung: "Seit Jahren träume ich von derselben Bibliothek, in der ich immer neue Bücher entdecke.",
    beschreibung:
      "Seit etwa fünf Jahren kehre ich in meinen Träumen immer wieder zu derselben Bibliothek zurück. Es ist ein riesiger, alter Raum mit hohen Decken und endlosen Bücherregalen. Jedes Mal entdecke ich neue Bücher und lese Passagen, die mir im Wachzustand oft als Inspiration dienen. Das Merkwürdige ist, dass ich mich an viele Details erinnern kann - den Geruch der alten Bücher, das Knarren des Holzbodens, sogar an bestimmte Titel. Es fühlt sich an, als würde ich einen realen Ort besuchen.",
    datum: "10. Januar 2023",
    kategorie: { name: "Traum", icon: "💤", farbe: "#8b5cf6" },
    tags: ["Wiederkehrender Traum", "Bibliothek", "Bücher", "Inspiration"],
    ort: {
      name: "Berlin, Deutschland",
      koordinaten: { lat: 52.52, lng: 13.4 },
    },
    autor: "Traumreisende",
    medien: [{ typ: "bild", url: "/lucid-dream-ocean.png" }],
    verifiziert: true,
    statistik: {
      likes: 56,
      kommentare: 18,
      ansichten: 240,
    },
    status: "veröffentlicht",
    kiZusammenfassung:
      "Der Autor beschreibt einen wiederkehrenden Traum von einer alten Bibliothek, in der er immer neue Bücher entdeckt. Wiederkehrende Träume sind oft Ausdruck unbewusster Themen oder Bedürfnisse, die im Wachzustand nicht ausreichend beachtet werden. Die Bibliothek als Symbol kann für Wissen, Weisheit und das Unterbewusstsein stehen. Die Inspiration, die der Autor aus den Büchern im Traum zieht, deutet darauf hin, dass das Unterbewusstsein ihm wertvolle Einsichten für sein Leben vermitteln möchte.",
    englishSummary:
      "The author describes a recurring dream of an old library where they always discover new books. Recurring dreams often express unconscious themes or needs that are not sufficiently addressed in the waking state. The library as a symbol can stand for knowledge, wisdom, and the subconscious. The inspiration that the author draws from the books in the dream suggests that the subconscious wants to convey valuable insights for their life.",
    kiZusammenfassungStatus: "completed",
  },
  {
    id: "tr2",
    titel: "Traum-Zeitreise ins alte Ägypten",
    kurzfassung: "In einem lebhaften Traum erlebte ich das alte Ägypten mit allen Sinnen.",
    beschreibung:
      "Letzte Nacht hatte ich einen unglaublich lebhaften Traum, in dem ich im alten Ägypten war. Ich konnte die Hitze der Sonne spüren, den Sand unter meinen Füßen, und ich verstand und sprach die Sprache fließend. Ich half beim Bau einer Pyramide und kannte alle Details der Konstruktion. Als ich aufwachte, recherchierte ich einige der architektonischen Details, die ich im Traum gesehen hatte, und war erstaunt, dass sie historisch korrekt waren - Dinge, von denen ich vorher nichts wusste.",
    datum: "5. März 2023",
    kategorie: { name: "Traum", icon: "💤", farbe: "#8b5cf6" },
    tags: ["Zeitreise", "Altes Ägypten", "Historischer Traum", "Pyramiden"],
    ort: {
      name: "Berlin, Deutschland",
      koordinaten: { lat: 52.52, lng: 13.4 },
    },
    autor: "Traumreisende",
    medien: [{ typ: "bild", url: "/temporal-tourist.png" }],
    verifiziert: true,
    statistik: {
      likes: 78,
      kommentare: 25,
      ansichten: 320,
    },
    status: "veröffentlicht",
    kiZusammenfassung:
      "Der Autor berichtet von einer lebhaften Traum-Zeitreise ins alte Ägypten, bei der er detaillierte Kenntnisse über die Kultur und Architektur erlangte, die er im Wachzustand nicht besaß. Solche Träume können als Ausdruck eines tiefen Interesses an Geschichte oder als Verbindung zu vergangenen Leben interpretiert werden. Die Genauigkeit der Details, die der Autor im Traum wahrnahm und später bestätigte, deutet auf eine außergewöhnliche Fähigkeit des Unterbewusstseins hin, Informationen zu verarbeiten und zu speichern.",
    englishSummary:
      "The author reports a vivid dream time travel to ancient Egypt, during which they gained detailed knowledge of the culture and architecture that they did not possess in the waking state. Such dreams can be interpreted as an expression of a deep interest in history or as a connection to past lives. The accuracy of the details that the author perceived in the dream and later confirmed suggests an extraordinary ability of the subconscious to process and store information.",
    kiZusammenfassungStatus: "completed",
  },
  {
    id: "tr3",
    titel: "Gemeinsamer Traum mit meiner Schwester",
    kurzfassung: "Meine Schwester und ich hatten in derselben Nacht den gleichen Traum mit identischen Details.",
    beschreibung:
      "Meine Schwester und ich leben in verschiedenen Städten und telefonieren nur selten. Gestern Morgen rief sie mich aufgeregt an, um mir von einem seltsamen Traum zu erzählen: Wir beide waren in einem weißen Boot auf einem türkisfarbenen See, umgeben von schneebedeckten Bergen. Ein Adler kreiste über uns und führte uns zu einer kleinen Insel mit einem einzelnen Baum. Ich war sprachlos, denn ich hatte in derselben Nacht exakt den gleichen Traum, bis hin zu kleinen Details wie die roten Blüten am Baum und das Lied, das wir im Boot gesungen hatten.",
    datum: "17. April 2023",
    kategorie: { name: "Traum", icon: "💤", farbe: "#8b5cf6" },
    tags: ["Gemeinsamer Traum", "Telepathie", "Familie", "See"],
    ort: {
      name: "Berlin, Deutschland",
      koordinaten: { lat: 52.52, lng: 13.4 },
    },
    autor: "Traumreisende",
    medien: [{ typ: "bild", url: "/ethereal-aquatic-dream.png" }],
    verifiziert: false,
    statistik: {
      likes: 92,
      kommentare: 34,
      ansichten: 410,
    },
    status: "veröffentlicht",
    kiZusammenfassung:
      "Der Autor beschreibt einen gemeinsamen Traum mit seiner Schwester, in dem beide unabhängig voneinander identische Details wahrnahmen. Gemeinsame Träume sind ein seltenes Phänomen, das auf eine telepathische Verbindung oder ein kollektives Unbewusstes hindeuten kann. Die Übereinstimmung bis ins kleinste Detail, wie die roten Blüten am Baum und das Lied, das im Boot gesungen wurde, verstärkt die Annahme einer außergewöhnlichen Verbindung zwischen den Schwestern.",
    englishSummary:
      "The author describes a shared dream with their sister, in which both independently perceived identical details. Shared dreams are a rare phenomenon that may indicate a telepathic connection or a collective unconscious. The agreement down to the smallest detail, such as the red flowers on the tree and the song sung in the boat, reinforces the assumption of an extraordinary connection between the sisters.",
    kiZusammenfassungStatus: "completed",
  },

  // Erlebnisse für WaldEntdecker
  {
    id: "we1",
    titel: "Ungewöhnliche Lichtphänomene im Thüringer Wald",
    kurzfassung: "Während einer Nachtwanderung beobachtete ich pulsierende Lichter zwischen den Bäumen.",
    beschreibung:
      "Ich war auf einer Solo-Nachtwanderung im Thüringer Wald, als ich etwa 100 Meter entfernt zwischen den Bäumen pulsierende Lichter bemerkte. Sie waren blau-grün und schwebten etwa einen Meter über dem Boden. Ich näherte mich vorsichtig, aber in etwa 20 Metern Entfernung verschwanden sie plötzlich. An der Stelle fand ich nichts Ungewöhnliches, aber der Boden fühlte sich warm an, obwohl es eine kühle Herbstnacht war. Ich habe später von anderen Wanderern gehört, die Ähnliches in diesem Waldgebiet gesehen haben.",
    datum: "22. Oktober 2022",
    kategorie: { name: "Paranormal", icon: "👻", farbe: "#6b7280" },
    tags: ["Lichter", "Wald", "Nacht", "Unerklärlich"],
    ort: {
      name: "Thüringer Wald, Deutschland",
      koordinaten: { lat: 50.7, lng: 10.8 },
    },
    autor: "WaldEntdecker",
    medien: [{ typ: "bild", url: "/ethereal-forest-glow.png" }],
    verifiziert: false,
    statistik: {
      likes: 45,
      kommentare: 19,
      ansichten: 230,
    },
    status: "veröffentlicht",
    kiZusammenfassung:
      "Der Autor berichtet von der Beobachtung ungewöhnlicher Lichtphänomene im Thüringer Wald während einer Nachtwanderung. Pulsierende, blau-grüne Lichter schwebten über dem Boden und verschwanden plötzlich. Die Wärme des Bodens an der Stelle, an der die Lichter verschwanden, deutet auf eine ungewöhnliche Energiequelle hin. Ähnliche Beobachtungen von anderen Wanderern in diesem Gebiet verstärken die Annahme eines unerklärlichen Phänomens.",
    englishSummary:
      "The author reports observing unusual light phenomena in the Thuringian Forest during a night hike. Pulsating, blue-green lights hovered above the ground and suddenly disappeared. The warmth of the ground at the spot where the lights disappeared suggests an unusual energy source. Similar observations from other hikers in the area reinforce the assumption of an unexplained phenomenon.",
    kiZusammenfassungStatus: "completed",
  },
  {
    id: "mm1",
    titel: "Kollektive Vision während einer Gruppenmeditation",
    kurzfassung: "Während einer Gruppenmeditation hatten alle Teilnehmer die gleiche Vision eines heiligen Ortes.",
    beschreibung:
      "Unsere Meditationsgruppe trifft sich wöchentlich. Bei einer besonderen Sitzung führte unser Lehrer eine geführte Meditation durch, bei der wir uns vorstellen sollten, an einen Ort zu reisen, an dem wir Antworten finden würden. Nach der Sitzung stellten wir erstaunt fest, dass alle zwölf Teilnehmer die gleiche Vision hatten: einen kreisförmigen Tempel auf einer Bergspitze, umgeben von sieben Säulen und einem kristallklaren See darunter. Keiner von uns hatte je von einem solchen Ort gehört oder ihn gesehen, aber die Beschreibungen stimmten bis ins kleinste Detail überein.",
    datum: "5. September 2023",
    kategorie: { name: "Kollektive Erfahrung", icon: "🧠", farbe: "#10b981" },
    tags: ["Gruppenmeditation", "Kollektives Bewusstsein", "Vision", "Tempel"],
    ort: {
      name: "Meditationszentrum, München",
      koordinaten: { lat: 48.14, lng: 11.58 },
    },
    autor: "MeditationsMeister",
    medien: [{ typ: "bild", url: "/serene-meditation-garden.png" }],
    verifiziert: true,
    statistik: {
      likes: 128,
      kommentare: 47,
      ansichten: 580,
    },
    status: "veröffentlicht",
    kiZusammenfassung:
      "Der Autor beschreibt eine bemerkenswerte kollektive Vision während einer Gruppenmeditation. Alle zwölf Teilnehmer hatten unabhängig voneinander die gleiche detaillierte Vision eines kreisförmigen Tempels auf einer Bergspitze. Solche kollektiven Erfahrungen deuten auf die Existenz eines kollektiven Bewusstseins oder eines gemeinsamen Feldes hin, auf das mehrere Menschen gleichzeitig zugreifen können. In der Bewusstseinsforschung werden solche Phänomene als Hinweise auf die nicht-lokale Natur des Bewusstseins betrachtet.",
    englishSummary:
      "The author describes a remarkable collective vision during a group meditation. All twelve participants independently had the same detailed vision of a circular temple on a mountain top. Such collective experiences suggest the existence of a collective consciousness or a shared field that multiple people can access simultaneously. In consciousness research, such phenomena are considered as indications of the non-local nature of consciousness.",
    kiZusammenfassungStatus: "completed",
  },
]
