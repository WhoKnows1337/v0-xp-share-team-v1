import type { Message } from "./xp-assistant"
import { mockErlebnisse } from "@/lib/mock-data"
import { getCurrentUser } from "@/lib/mock-users"

// Simuliere eine Verzögerung für die Antwort
const simulateDelay = async () => {
  return new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))
}

// Verarbeite eine Suchanfrage
const handleSearchQuery = async (query: string): Promise<string> => {
  await simulateDelay()

  // Einfache Keyword-Suche in den Mock-Daten
  const keywords = query.toLowerCase().split(/\s+/)
  const relevantExperiences = mockErlebnisse.filter((exp) => {
    const searchText = `${exp.titel} ${exp.beschreibung} ${exp.kurzfassung} ${exp.tags.join(" ")}`.toLowerCase()
    return keywords.some((keyword) => searchText.includes(keyword))
  })

  if (relevantExperiences.length === 0) {
    return "Ich konnte keine Erlebnisse finden, die zu deiner Anfrage passen. Versuche es mit anderen Suchbegriffen oder schau dir die Kategorien an."
  }

  return `Ich habe ${relevantExperiences.length} Erlebnisse gefunden, die zu deiner Anfrage passen:\n\n${relevantExperiences
    .slice(0, 3)
    .map((exp, i) => `${i + 1}. "${exp.titel}" - ${exp.kurzfassung.substring(0, 100)}...`)
    .join("\n\n")}${relevantExperiences.length > 3 ? "\n\n...und weitere Ergebnisse." : ""}`
}

// Verarbeite eine Analyseanfrage
const handleAnalysisQuery = async (query: string): Promise<string> => {
  await simulateDelay()

  const currentUser = getCurrentUser()
  const userExperiences = mockErlebnisse.filter((exp) =>
    typeof exp.autor === "object" ? exp.autor.name === currentUser.username : exp.autor === currentUser.username,
  )

  if (userExperiences.length === 0) {
    return "Du hast noch keine Erlebnisse geteilt. Sobald du Erlebnisse teilst, kann ich dir helfen, Muster und Zusammenhänge zu erkennen."
  }

  // Sammle alle Tags aus den Erlebnissen des Nutzers
  const allTags: Record<string, number> = {}
  userExperiences.forEach((exp) => {
    exp.tags.forEach((tag) => {
      allTags[tag] = (allTags[tag] || 0) + 1
    })
  })

  // Sortiere Tags nach Häufigkeit
  const sortedTags = Object.entries(allTags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  if (query.toLowerCase().includes("schlagwort") || query.toLowerCase().includes("tag")) {
    return `In deinen ${userExperiences.length} Erlebnissen sind die häufigsten Schlagwörter:\n\n${sortedTags
      .map(([tag, count]) => `- "${tag}" (${count}x)`)
      .join("\n")}`
  }

  // Einfache Stimmungsanalyse basierend auf Schlüsselwörtern
  const positiveWords = ["freude", "glück", "positiv", "schön", "wunderbar", "erstaunlich"]
  const negativeWords = ["angst", "furcht", "negativ", "traurig", "beunruhigend", "beängstigend"]

  let positiveCount = 0
  let negativeCount = 0

  userExperiences.forEach((exp) => {
    const text = `${exp.titel} ${exp.beschreibung} ${exp.kurzfassung}`.toLowerCase()
    positiveWords.forEach((word) => {
      if (text.includes(word)) positiveCount++
    })
    negativeWords.forEach((word) => {
      if (text.includes(word)) negativeCount++
    })
  })

  const sentiment =
    positiveCount > negativeCount
      ? "überwiegend positiv"
      : positiveCount < negativeCount
        ? "überwiegend herausfordernd"
        : "ausgewogen"

  return (
    `Basierend auf deinen ${userExperiences.length} Erlebnissen kann ich folgende Muster erkennen:\n\n` +
    `- Die häufigsten Themen sind: ${sortedTags
      .slice(0, 3)
      .map(([tag]) => tag)
      .join(", ")}\n` +
    `- Die emotionale Tonalität deiner Erlebnisse ist ${sentiment}\n` +
    `- Du teilst am häufigsten Erlebnisse in der Kategorie "${userExperiences[0].kategorie.name}"\n\n` +
    `Möchtest du eine detailliertere Analyse zu einem bestimmten Aspekt?`
  )
}

// Verarbeite eine Hilfeanfrage für den Wizard
const handleWizardHelp = async (query: string, context: string): Promise<string> => {
  await simulateDelay()

  if (query.toLowerCase().includes("kategorie")) {
    return (
      "Basierend auf deiner Beschreibung würde ich folgende Kategorien vorschlagen:\n\n" +
      "- Traum: Für alle Erlebnisse, die während des Schlafes auftreten\n" +
      "- Meditation: Für Erfahrungen während meditativer Zustände\n" +
      "- Synchronizität: Für bedeutungsvolle Zufälle\n" +
      "- Außerkörperliche Erfahrung: Wenn du das Gefühl hattest, deinen Körper zu verlassen\n\n" +
      "Wähle die Kategorie, die am besten zu deinem Erlebnis passt."
    )
  }

  if (query.toLowerCase().includes("tag") || query.toLowerCase().includes("schlagwort")) {
    return (
      "Hier sind einige Tag-Vorschläge basierend auf deiner Beschreibung:\n\n" +
      "- bewusstseinserweiterung\n" +
      "- transformation\n" +
      "- spirituell\n" +
      "- selbsterkenntnis\n" +
      "- klartraum\n\n" +
      "Du kannst diese Tags verwenden oder eigene hinzufügen, die dein Erlebnis am besten beschreiben."
    )
  }

  return (
    "Ich kann dir beim Ausfüllen des Formulars helfen. Frag mich zum Beispiel:\n\n" +
    "- In welche Kategorie passt mein Erlebnis?\n" +
    "- Welche Tags sollte ich verwenden?\n" +
    "- Wie ausführlich sollte meine Beschreibung sein?\n\n" +
    "Je mehr Details du mir über dein Erlebnis gibst, desto besser kann ich dir helfen."
  )
}

// Verarbeite eine allgemeine Plattformfrage
const handlePlatformQuery = async (query: string): Promise<string> => {
  await simulateDelay()

  const faqs: Record<string, string> = {
    profilbild:
      'Um dein Profilbild zu ändern, gehe zu deinem Profil (klicke auf deinen Avatar oben rechts) und dann auf "Profil bearbeiten". Dort kannst du ein neues Bild hochladen.',
    passwort:
      'Um dein Passwort zu ändern, gehe zu den Einstellungen (über dein Profilmenü oben rechts) und wähle den Tab "Sicherheit". Dort kannst du dein Passwort ändern.',
    privat:
      'Du kannst die Privatsphäre-Einstellungen für jedes Erlebnis individuell festlegen. Beim Erstellen oder Bearbeiten eines Erlebnisses findest du im letzten Schritt die Option "Privatsphäre", wo du zwischen "privat", "nur mit Link", "öffentlich" oder "Gruppe" wählen kannst.',
    löschen:
      'Um ein Erlebnis zu löschen, öffne das Erlebnis und klicke auf das Drei-Punkte-Menü oben rechts. Dort findest du die Option "Löschen". Bitte beachte, dass diese Aktion nicht rückgängig gemacht werden kann.',
    teilen:
      "Um ein Erlebnis zu teilen, klicke auf das Teilen-Symbol in der Aktionsleiste unter dem Erlebnis. Du kannst dann einen Link kopieren oder das Erlebnis direkt über verschiedene Plattformen teilen.",
    benachrichtigung:
      'Benachrichtigungseinstellungen findest du in deinem Profil unter "Einstellungen" und dann im Tab "Benachrichtigungen". Dort kannst du festlegen, worüber du informiert werden möchtest.',
    sprache:
      'Du kannst die Sprache der Plattform in den Einstellungen unter dem Tab "Allgemein" ändern. Aktuell unterstützen wir Deutsch und Englisch.',
    datenschutz:
      'Unsere Datenschutzrichtlinien findest du im Footer der Website unter "Datenschutz". Dort erklären wir ausführlich, wie wir mit deinen Daten umgehen.',
    kontakt:
      'Bei Fragen oder Problemen kannst du uns über das Kontaktformular erreichen, das du im Footer unter "Kontakt" findest. Alternativ kannst du uns auch eine E-Mail an support@xp-share.de schreiben.',
  }

  // Suche nach passenden Schlüsselwörtern in der Anfrage
  const queryLower = query.toLowerCase()
  for (const [keyword, answer] of Object.entries(faqs)) {
    if (queryLower.includes(keyword)) {
      return answer
    }
  }

  return "Ich verstehe deine Frage zur Plattform nicht genau. Du kannst mich zu Themen wie Profilbild ändern, Passwort zurücksetzen, Privatsphäre-Einstellungen, Erlebnisse löschen oder teilen, Benachrichtigungen, Spracheinstellungen, Datenschutz oder Kontaktmöglichkeiten fragen."
}

// Hauptfunktion zur Verarbeitung von Chat-Anfragen
// Simuliere eine Verzögerung für die Antwort
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function processChatQuery(query: string, messages: Message[]): Promise<string> {
  // Simuliere eine Verarbeitungszeit
  await delay(1000)

  // Einfache Antwortlogik basierend auf Schlüsselwörtern
  const lowercaseQuery = query.toLowerCase()

  // Hilfe bei der Plattform
  if (lowercaseQuery.includes("wie funktioniert") || lowercaseQuery.includes("hilfe")) {
    return "XP-Share ist eine Plattform zum Teilen und Entdecken von außergewöhnlichen Erlebnissen. Du kannst eigene Erlebnisse teilen, andere entdecken und mit Gleichgesinnten in Kontakt treten."
  }

  // Erlebnisse finden
  if (lowercaseQuery.includes("finde") || lowercaseQuery.includes("suche") || lowercaseQuery.includes("erlebnis")) {
    return "Um Erlebnisse zu finden, kannst du die Suchfunktion oder die Filter auf der 'Entdecken'-Seite nutzen. Du kannst nach Kategorien, Orten oder Zeiträumen filtern."
  }

  // Erlebnis erstellen
  if (
    lowercaseQuery.includes("erstellen") ||
    lowercaseQuery.includes("teilen") ||
    lowercaseQuery.includes("neues erlebnis")
  ) {
    return "Um ein neues Erlebnis zu teilen, klicke auf den '+ Erlebnis teilen' Button in der Navigation. Du wirst durch einen Wizard geführt, der dich Schritt für Schritt durch den Prozess leitet."
  }

  // Profil
  if (
    lowercaseQuery.includes("profil") ||
    lowercaseQuery.includes("konto") ||
    lowercaseQuery.includes("einstellungen")
  ) {
    return "Du kannst dein Profil über den Menüpunkt 'Profil' in der Navigation bearbeiten. Dort kannst du deine persönlichen Informationen, Datenschutzeinstellungen und Benachrichtigungen verwalten."
  }

  // Datenschutz
  if (
    lowercaseQuery.includes("datenschutz") ||
    lowercaseQuery.includes("privat") ||
    lowercaseQuery.includes("sichtbarkeit")
  ) {
    return "Du kannst die Sichtbarkeit deiner Erlebnisse beim Erstellen oder später in den Einstellungen festlegen. Es gibt die Optionen 'Öffentlich', 'Nur für Freunde' und 'Privat'."
  }

  // Standardantwort
  return "Ich bin Keeper, dein XP-Assistant. Ich kann dir helfen, Erlebnisse zu finden, zu analysieren oder einzutragen. Stelle mir gerne eine spezifischere Frage!"
}
