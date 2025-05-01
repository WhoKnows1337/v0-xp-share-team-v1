import type { XPEintrag, MoodType } from "@/types/xp-eintrag"
import { v4 as uuidv4 } from "uuid"

// Hilfsfunktion zum Erstellen eines Datums mit Offset in Tagen
function getDateWithOffset(offset: number): string {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return date.toISOString()
}

// Hilfsfunktion zum Erstellen eines zufälligen Datums in den letzten 30 Tagen
function getRandomRecentDate(): string {
  const daysAgo = Math.floor(Math.random() * 30)
  return getDateWithOffset(-daysAgo)
}

// Hilfsfunktion zum Berechnen des aktuellen Streaks
export function calculateStreak(): number {
  // In einer echten Anwendung würde hier die tatsächliche Streak-Berechnung stattfinden
  // Für die Demo geben wir einen festen Wert zurück
  return 7
}

// Hilfsfunktion zum Berechnen der Mood-Verteilung
export function calculateMoodDistribution(): Record<MoodType, number> {
  return {
    glücklich: 12,
    zufrieden: 18,
    neutral: 7,
    nachdenklich: 15,
    traurig: 3,
    frustriert: 5,
    inspiriert: 10,
    energiegeladen: 8,
    erschöpft: 4,
    ängstlich: 2,
  }
}

// Hilfsfunktion zum Berechnen der häufigsten Tags
export function calculateTopTags(count = 5): Array<{ tag: string; anzahl: number }> {
  const tagCounts: Record<string, number> = {}

  mockXPEintraege.forEach((entry) => {
    if (entry.tags) {
      entry.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    }
  })

  return Object.entries(tagCounts)
    .map(([tag, anzahl]) => ({ tag, anzahl }))
    .sort((a, b) => b.anzahl - a.anzahl)
    .slice(0, count)
}

// Mock-Daten für XP-Einträge
export const mockXPEintraege: XPEintrag[] = [
  {
    id: uuidv4(),
    titel: "Meine erste Meditation",
    inhalt:
      "Heute habe ich zum ersten Mal richtig meditiert. Es war eine interessante Erfahrung, die mir geholfen hat, meinen Geist zu beruhigen und mich auf den Moment zu konzentrieren.",
    datum: getDateWithOffset(-1),
    tags: ["Meditation", "Achtsamkeit", "Neubeginn"],
    mood: "zufrieden",
    privat: false,
    entwurf: false,
    bilder: ["/serene-meditation-garden.png"],
    erstellt: getDateWithOffset(-1),
    benutzer: {
      id: "1",
      name: "Max Mustermann",
      avatar: "/contemplative-figure.png",
    },
  },
  {
    id: uuidv4(),
    titel: "Unerwartete Begegnung",
    inhalt:
      "Auf dem Weg zur Arbeit traf ich heute einen alten Schulfreund. Wir hatten uns seit Jahren nicht gesehen, aber es fühlte sich an, als wäre keine Zeit vergangen. Wir haben uns sofort auf einen Kaffee verabredet.",
    datum: getDateWithOffset(-2),
    tags: ["Begegnung", "Zufall", "Freundschaft"],
    mood: "glücklich",
    privat: false,
    entwurf: false,
    erstellt: getDateWithOffset(-2),
    benutzer: {
      id: "1",
      name: "Max Mustermann",
      avatar: "/contemplative-figure.png",
    },
  },
  {
    id: uuidv4(),
    titel: "Durchbruch im Projekt",
    inhalt:
      "Nach wochenlanger Arbeit habe ich endlich den Durchbruch in meinem Projekt erzielt. Die Lösung kam mir plötzlich in den Sinn, als ich gar nicht daran dachte. Manchmal muss man wohl loslassen, damit die Ideen fließen können.",
    datum: getDateWithOffset(-3),
    tags: ["Arbeit", "Erfolg", "Kreativität"],
    mood: "energiegeladen",
    privat: false,
    entwurf: false,
    erstellt: getDateWithOffset(-3),
    benutzer: {
      id: "1",
      name: "Max Mustermann",
      avatar: "/contemplative-figure.png",
    },
  },
  {
    id: uuidv4(),
    titel: "Reflexion über Veränderung",
    inhalt:
      "Heute habe ich darüber nachgedacht, wie viel sich in den letzten Monaten verändert hat. Es ist erstaunlich, wie schnell die Zeit vergeht und wie sehr wir uns anpassen können. Veränderung ist die einzige Konstante im Leben.",
    datum: getDateWithOffset(-5),
    tags: ["Reflexion", "Veränderung", "Philosophie"],
    mood: "nachdenklich",
    privat: true,
    entwurf: false,
    erstellt: getDateWithOffset(-5),
    benutzer: {
      id: "1",
      name: "Max Mustermann",
      avatar: "/contemplative-figure.png",
    },
  },
  {
    id: uuidv4(),
    titel: "Traumdeutung: Fliegende Inseln",
    inhalt:
      "Letzte Nacht träumte ich von fliegenden Inseln und kristallenen Städten. Ich konnte fliegen und besuchte verschiedene Welten. Es fühlte sich so real an, dass ich beim Aufwachen kurz verwirrt war. Vielleicht sollte ich anfangen, meine Träume regelmäßig aufzuschreiben.",
    datum: getDateWithOffset(-7),
    tags: ["Traum", "Fantasie", "Unterbewusstsein"],
    mood: "inspiriert",
    privat: false,
    entwurf: false,
    bilder: ["/lucid-dream-ocean.png"],
    erstellt: getDateWithOffset(-7),
    benutzer: {
      id: "1",
      name: "Max Mustermann",
      avatar: "/contemplative-figure.png",
    },
  },
  {
    id: uuidv4(),
    titel: "Zufällige Synchronizität",
    inhalt:
      "Heute ist etwas Seltsames passiert. Ich dachte an ein Lied, das ich seit Jahren nicht gehört hatte, und keine 5 Minuten später spielte es im Radio. Solche Zufälle geben mir immer zu denken. Ist das Universum manchmal auf seltsame Weise verbunden?",
    datum: getDateWithOffset(-8),
    tags: ["Synchronizität", "Zufall", "Universum"],
    mood: ["überrascht", "nachdenklich"],
    privat: false,
    entwurf: false,
    erstellt: getDateWithOffset(-8),
    benutzer: {
      id: "1",
      name: "Max Mustermann",
      avatar: "/contemplative-figure.png",
    },
  },
  {
    id: uuidv4(),
    titel: "Entscheidung am Scheideweg",
    inhalt:
      "Ich stehe vor einer wichtigen beruflichen Entscheidung. Der sichere Weg oder das Risiko? Heute habe ich lange mit einem Mentor gesprochen, der mir eine neue Perspektive gegeben hat. Manchmal braucht man einen Blick von außen.",
    datum: getDateWithOffset(-10),
    tags: ["Entscheidung", "Karriere", "Mentoring"],
    mood: ["ängstlich", "hoffnungsvoll"],
    privat: true,
    entwurf: false,
    bilder: ["/Crossroads-of-Change.png"],
    erstellt: getDateWithOffset(-10),
    benutzer: {
      id: "1",
      name: "Max Mustermann",
      avatar: "/contemplative-figure.png",
    },
  },
  {
    id: uuidv4(),
    titel: "Unerwartetes Glück",
    inhalt:
      "Auf dem Weg zur Arbeit fand ich ein vierblättriges Kleeblatt. Ein kleines Zeichen des Glücks an einem ganz normalen Tag. Ich habe es gepresst und in mein Notizbuch gelegt als Erinnerung daran, dass besondere Momente oft in der Alltäglichkeit versteckt sind.",
    datum: getDateWithOffset(-12),
    tags: ["Glück", "Zeichen", "Alltag"],
    mood: "glücklich",
    privat: false,
    entwurf: false,
    bilder: ["/four-leaf-clover-field.png"],
    erstellt: getDateWithOffset(-12),
    benutzer: {
      id: "1",
      name: "Max Mustermann",
      avatar: "/contemplative-figure.png",
    },
  },
  {
    id: uuidv4(),
    titel: "Gedanken zur Vergänglichkeit",
    inhalt:
      "Beim Aufräumen fand ich alte Fotos aus meiner Kindheit. Es ist seltsam zu sehen, wie schnell die Zeit vergeht und wie sehr wir uns verändern. Gleichzeitig fühlt sich ein Teil von mir immer noch wie dieses Kind an. Die Vergänglichkeit des Lebens ist sowohl beängstigend als auch wunderschön.",
    datum: getDateWithOffset(-15),
    tags: ["Zeit", "Erinnerungen", "Vergänglichkeit"],
    mood: "nachdenklich",
    privat: true,
    entwurf: false,
    erstellt: getDateWithOffset(-15),
    benutzer: {
      id: "1",
      name: "Max Mustermann",
      avatar: "/contemplative-figure.png",
    },
  },
  {
    id: uuidv4(),
    titel: "Kreative Blockade überwunden",
    inhalt:
      "Nach Wochen der kreativen Blockade hatte ich heute endlich wieder Inspiration. Ein langer Spaziergang im Wald hat meine Gedanken befreit und plötzlich flossen die Ideen wieder. Manchmal muss man sich vom Problem entfernen, um die Lösung zu finden.",
    datum: getDateWithOffset(-18),
    tags: ["Kreativität", "Inspiration", "Natur"],
    mood: "inspiriert",
    privat: false,
    entwurf: false,
    bilder: ["/ethereal-forest-glow.png"],
    erstellt: getDateWithOffset(-18),
    benutzer: {
      id: "1",
      name: "Max Mustermann",
      avatar: "/contemplative-figure.png",
    },
  },
]

// Weitere 10 Einträge für mehr Daten
for (let i = 0; i < 10; i++) {
  const moodOptions: MoodType[] = [
    "glücklich",
    "zufrieden",
    "neutral",
    "nachdenklich",
    "traurig",
    "frustriert",
    "inspiriert",
    "energiegeladen",
    "erschöpft",
    "ängstlich",
  ]
  const randomMood = moodOptions[Math.floor(Math.random() * moodOptions.length)]

  const tagOptions = [
    "Alltag",
    "Erkenntnis",
    "Lernen",
    "Wachstum",
    "Herausforderung",
    "Erfolg",
    "Misserfolg",
    "Beziehung",
    "Selbstreflexion",
    "Natur",
    "Kunst",
    "Musik",
    "Literatur",
    "Sport",
    "Reisen",
    "Essen",
    "Gesundheit",
    "Spiritualität",
  ]
  const randomTags = []
  const tagCount = Math.floor(Math.random() * 3) + 1 // 1-3 Tags

  for (let j = 0; j < tagCount; j++) {
    const randomTag = tagOptions[Math.floor(Math.random() * tagOptions.length)]
    if (!randomTags.includes(randomTag)) {
      randomTags.push(randomTag)
    }
  }

  const randomDate = getRandomRecentDate()

  mockXPEintraege.push({
    id: uuidv4(),
    titel: `Eintrag ${i + 1}: ${tagOptions[Math.floor(Math.random() * tagOptions.length)]}`,
    inhalt: `Dies ist ein automatisch generierter Eintrag für Testzwecke. Er enthält zufällige Tags und Stimmungen, um die Funktionalität des XP-Buchs zu demonstrieren. In einer echten Anwendung würde hier ein persönlicher Erfahrungsbericht stehen.`,
    datum: randomDate,
    tags: randomTags,
    mood: randomMood,
    privat: Math.random() > 0.7, // 30% Wahrscheinlichkeit für privat
    entwurf: Math.random() > 0.9, // 10% Wahrscheinlichkeit für Entwurf
    erstellt: randomDate,
    benutzer: {
      id: "1",
      name: "Max Mustermann",
      avatar: "/contemplative-figure.png",
    },
  })
}

// Sortiere die Einträge nach Datum (neueste zuerst)
mockXPEintraege.sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime())
