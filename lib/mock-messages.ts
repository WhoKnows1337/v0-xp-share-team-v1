"use client"

import type { Conversation, Message, ChatChannel, Attachment } from "@/types/message"
import { findUserByUsername } from "./mock-users"
import { mockUsers } from "./mock-users"

// Re-export mockUsers to fix the missing export error
export { mockUsers }

// Hilfsfunktion zum Erstellen einer Nachricht
const createMessage = (id: string, senderId: string, content: string, timestamp: Date, read = false): Message => ({
  id,
  senderId,
  content,
  timestamp,
  read,
})

// Mock-Direktnachrichten
export const mockDirectMessages: Record<string, Message[]> = {
  conv_1: [
    createMessage(
      "msg_1",
      "AstralExplorer",
      "Hallo! Ich habe dein Erlebnis über die Lichterscheinung im Schwarzwald gesehen. Das klingt faszinierend!",
      new Date(2023, 4, 16, 14, 30),
      true,
    ),
    createMessage(
      "msg_2",
      "WaldEntdecker",
      "Danke! Es war wirklich ein unglaubliches Erlebnis. Hast du schon mal etwas Ähnliches gesehen?",
      new Date(2023, 4, 16, 14, 35),
      true,
    ),
    createMessage(
      "msg_3",
      "AstralExplorer",
      "Nicht direkt, aber ich war letzten Sommer im Schwarzwald und habe dort auch einige seltsame Lichter am Himmel beobachtet.",
      new Date(2023, 4, 16, 14, 40),
      true,
    ),
    createMessage(
      "msg_4",
      "WaldEntdecker",
      "Interessant! In welcher Region war das genau?",
      new Date(2023, 4, 16, 14, 45),
      true,
    ),
    createMessage(
      "msg_5",
      "AstralExplorer",
      "In der Nähe von Freudenstadt. Ich könnte dir die genauen Koordinaten schicken, wenn du möchtest.",
      new Date(2023, 4, 16, 14, 50),
      true,
    ),
    createMessage(
      "msg_6",
      "WaldEntdecker",
      "Das wäre super! Ich sammle solche Berichte für meine Recherche.",
      new Date(2023, 4, 16, 15, 0),
      false,
    ),
  ],
  conv_2: [
    createMessage(
      "msg_7",
      "MeditationsGuide",
      "Hallo! Ich habe gesehen, dass du dich für Meditation interessierst. Ich biete nächste Woche einen Workshop an.",
      new Date(2023, 4, 10, 9, 15),
      true,
    ),
    createMessage(
      "msg_8",
      "AstralExplorer",
      "Das klingt interessant! Worum geht es genau?",
      new Date(2023, 4, 10, 10, 20),
      true,
    ),
    createMessage(
      "msg_9",
      "MeditationsGuide",
      "Es ist ein Workshop über Traummeditation und luzides Träumen. Ich dachte, das könnte dich interessieren, basierend auf deinen Erlebnissen.",
      new Date(2023, 4, 10, 10, 25),
      true,
    ),
    createMessage(
      "msg_10",
      "AstralExplorer",
      "Definitiv! Wann und wo findet es statt?",
      new Date(2023, 4, 10, 10, 30),
      true,
    ),
    createMessage(
      "msg_11",
      "MeditationsGuide",
      "Am 25. Mai um 18 Uhr im Zentrum für Bewusstseinserweiterung in Berlin. Soll ich dich auf die Teilnehmerliste setzen?",
      new Date(2023, 4, 10, 10, 35),
      true,
    ),
    createMessage(
      "msg_12",
      "AstralExplorer",
      "Ja, bitte! Ich freue mich schon darauf.",
      new Date(2023, 4, 10, 10, 40),
      true,
    ),
    createMessage(
      "msg_13",
      "MeditationsGuide",
      "Super! Ich habe dich eingetragen. Hier ist noch ein Link zu einigen Vorbereitungsmaterialien: https://meditation-guide.de/vorbereitung",
      new Date(2023, 4, 10, 10, 45),
      false,
    ),
  ],
  conv_3: [
    createMessage(
      "msg_14",
      "AstralExplorer",
      "Hallo! Ich habe dein Erlebnis über die Synchronizität in deiner Karriere gelesen. Das hat mich sehr inspiriert!",
      new Date(2023, 4, 5, 18, 10),
      true,
    ),
    createMessage(
      "msg_15",
      "KarriereWandler",
      "Vielen Dank! Es war ein wichtiger Wendepunkt in meinem Leben.",
      new Date(2023, 4, 5, 18, 30),
      true,
    ),
    createMessage(
      "msg_16",
      "AstralExplorer",
      "Ich stehe gerade vor einer ähnlichen Entscheidung. Hättest du vielleicht Zeit für einen kurzen Austausch?",
      new Date(2023, 4, 5, 18, 35),
      true,
    ),
    createMessage(
      "msg_17",
      "KarriereWandler",
      "Natürlich! Ich helfe gerne. Worum geht es genau?",
      new Date(2023, 4, 5, 19, 0),
      true,
    ),
    createMessage(
      "msg_18",
      "AstralExplorer",
      "Ich arbeite seit 5 Jahren in der IT-Branche, aber spüre, dass ich mich mehr in Richtung kreative Arbeit entwickeln möchte. Ähnlich wie du es beschrieben hast.",
      new Date(2023, 4, 5, 19, 5),
      true,
    ),
    createMessage(
      "msg_19",
      "KarriereWandler",
      "Das verstehe ich gut. Der Schlüssel für mich war, nicht sofort alles aufzugeben, sondern schrittweise zu wechseln. Ich habe zuerst nebenberuflich als Coach gearbeitet.",
      new Date(2023, 4, 5, 19, 10),
      true,
    ),
    createMessage(
      "msg_20",
      "AstralExplorer",
      "Das ist ein guter Rat! Hast du Tipps, wie ich anfangen könnte?",
      new Date(2023, 4, 5, 19, 15),
      true,
    ),
    createMessage(
      "msg_21",
      "KarriereWandler",
      "Ich würde mit kleinen Projekten beginnen, die deine Kreativität fördern. Vielleicht ein Blog oder Podcast? Wir könnten uns nächste Woche auf einen Kaffee treffen und mehr darüber sprechen.",
      new Date(2023, 4, 5, 19, 20),
      false,
    ),
  ],
  conv_4: [
    createMessage(
      "msg_22",
      "NaturEntdecker",
      "Hallo! Ich organisiere am Wochenende eine Wanderung durch den Schwarzwald und habe gesehen, dass du dich für ähnliche Aktivitäten interessierst. Hättest du Lust mitzukommen?",
      new Date(2023, 4, 18, 11, 0),
      true,
    ),
    createMessage(
      "msg_23",
      "AstralExplorer",
      "Hey! Das klingt super. Wo genau soll die Wanderung stattfinden?",
      new Date(2023, 4, 18, 11, 30),
      true,
    ),
    createMessage(
      "msg_24",
      "NaturEntdecker",
      "Wir starten am Mummelsee und wandern dann zum Hornisgrinde. Es ist eine mittelschwere Tour, etwa 15 km.",
      new Date(2023, 4, 18, 11, 35),
      true,
    ),
    createMessage(
      "msg_25",
      "AstralExplorer",
      "Perfekt! Ich bin dabei. Wann trefft ihr euch?",
      new Date(2023, 4, 18, 11, 40),
      true,
    ),
    createMessage(
      "msg_26",
      "NaturEntdecker",
      "Super! Wir treffen uns am Samstag um 9 Uhr am Parkplatz beim Mummelsee. Bring gute Wanderschuhe und genug Wasser mit!",
      new Date(2023, 4, 18, 11, 45),
      true,
    ),
    createMessage(
      "msg_27",
      "AstralExplorer",
      "Alles klar, ich freue mich! Sind noch andere XP-Share Nutzer dabei?",
      new Date(2023, 4, 18, 11, 50),
      true,
    ),
    createMessage(
      "msg_28",
      "NaturEntdecker",
      "Ja, WaldEntdecker und BergWanderer kommen auch mit. Wird eine tolle Gruppe!",
      new Date(2023, 4, 18, 11, 55),
      false,
    ),
  ],
  conv_5: [
    createMessage(
      "msg_29",
      "TraumDeuter",
      "Hallo! Ich habe deinen Kommentar zu meinem Erlebnis über luzides Träumen gesehen. Hast du Erfahrung damit?",
      new Date(2023, 4, 20, 20, 0),
      true,
    ),
    createMessage(
      "msg_30",
      "AstralExplorer",
      "Ja, ich praktiziere luzides Träumen seit etwa zwei Jahren. Es hat mein Leben verändert!",
      new Date(2023, 4, 20, 20, 15),
      true,
    ),
    createMessage(
      "msg_31",
      "TraumDeuter",
      "Das ist toll zu hören! Hast du bestimmte Techniken, die für dich besonders gut funktionieren?",
      new Date(2023, 4, 20, 20, 20),
      true,
    ),
    createMessage(
      "msg_32",
      "AstralExplorer",
      "Die Realitätschecks tagsüber haben mir am meisten geholfen. Und ein Traumtagebuch zu führen ist essentiell.",
      new Date(2023, 4, 20, 20, 25),
      true,
    ),
    createMessage(
      "msg_33",
      "TraumDeuter",
      "Ich habe mit dem Traumtagebuch angefangen, aber die Realitätschecks noch nicht konsequent durchgeführt. Wie oft machst du sie?",
      new Date(2023, 4, 20, 20, 30),
      true,
    ),
    createMessage(
      "msg_34",
      "AstralExplorer",
      "Ich mache etwa 10-15 Realitätschecks über den Tag verteilt. Am Anfang habe ich mir Erinnerungen mit dem Handy gestellt.",
      new Date(2023, 4, 20, 20, 35),
      true,
    ),
    createMessage(
      "msg_35",
      "TraumDeuter",
      "Das ist ein guter Tipp! Ich werde das ab morgen so machen. Würdest du mir vielleicht mehr über deine Erfahrungen erzählen? Vielleicht bei einem virtuellen Kaffee?",
      new Date(2023, 4, 20, 20, 40),
      false,
    ),
  ],
}

// Mock-Gruppennachrichten
export const mockGroupMessages: Record<string, Message[]> = {
  group_1: [
    createMessage(
      "gmsg_1",
      "AstralExplorer",
      "Hallo zusammen! Ich bin neu in dieser Gruppe und freue mich auf den Austausch über Traumdeutung.",
      new Date(2023, 3, 15, 10, 0),
      true,
    ),
    createMessage(
      "gmsg_2",
      "TraumDeuter",
      "Willkommen in der Gruppe! Wir freuen uns auf deine Beiträge.",
      new Date(2023, 3, 15, 10, 5),
      true,
    ),
    createMessage(
      "gmsg_3",
      "MeditationsGuide",
      "Hallo AstralExplorer! Schön, dass du hier bist. Hast du schon Erfahrung mit Traumdeutung?",
      new Date(2023, 3, 15, 10, 10),
      true,
    ),
    createMessage(
      "gmsg_4",
      "AstralExplorer",
      "Ja, ich beschäftige mich seit etwa drei Jahren damit. Besonders interessant finde ich wiederkehrende Symbole in Träumen.",
      new Date(2023, 3, 15, 10, 15),
      true,
    ),
    createMessage(
      "gmsg_5",
      "TraumDeuter",
      "Das ist ein faszinierendes Thema! Ich habe letzte Woche einen Workshop dazu geleitet. Ich kann dir gerne die Materialien schicken.",
      new Date(2023, 3, 15, 10, 20),
      true,
    ),
    createMessage("gmsg_6", "AstralExplorer", "Das wäre super, vielen Dank!", new Date(2023, 3, 15, 10, 25), true),
    createMessage(
      "gmsg_7",
      "MeditationsGuide",
      "Wir planen übrigens nächsten Monat ein Online-Treffen zum Thema 'Luzides Träumen'. Wäre das interessant für euch?",
      new Date(2023, 3, 15, 10, 30),
      false,
    ),
  ],
}

// Mock-Konversationen
export const mockConversations: Conversation[] = [
  {
    id: "conv_1",
    type: "direct",
    participants: ["AstralExplorer", "WaldEntdecker"],
    lastMessage: mockDirectMessages["conv_1"][mockDirectMessages["conv_1"].length - 1],
    unreadCount: 1,
    createdAt: new Date(2023, 4, 16, 14, 30),
    updatedAt: new Date(2023, 4, 16, 15, 0),
  },
  {
    id: "conv_2",
    type: "direct",
    participants: ["AstralExplorer", "MeditationsGuide"],
    lastMessage: mockDirectMessages["conv_2"][mockDirectMessages["conv_2"].length - 1],
    unreadCount: 1,
    createdAt: new Date(2023, 4, 10, 9, 15),
    updatedAt: new Date(2023, 4, 10, 10, 45),
  },
  {
    id: "conv_3",
    type: "direct",
    participants: ["AstralExplorer", "KarriereWandler"],
    lastMessage: mockDirectMessages["conv_3"][mockDirectMessages["conv_3"].length - 1],
    unreadCount: 1,
    createdAt: new Date(2023, 4, 5, 18, 10),
    updatedAt: new Date(2023, 4, 5, 19, 20),
  },
  {
    id: "conv_4",
    type: "direct",
    participants: ["AstralExplorer", "NaturEntdecker"],
    lastMessage: mockDirectMessages["conv_4"][mockDirectMessages["conv_4"].length - 1],
    unreadCount: 1,
    createdAt: new Date(2023, 4, 18, 11, 0),
    updatedAt: new Date(2023, 4, 18, 11, 55),
  },
  {
    id: "conv_5",
    type: "direct",
    participants: ["AstralExplorer", "TraumDeuter"],
    lastMessage: mockDirectMessages["conv_5"][mockDirectMessages["conv_5"].length - 1],
    unreadCount: 1,
    createdAt: new Date(2023, 4, 20, 20, 0),
    updatedAt: new Date(2023, 4, 20, 20, 40),
  },
  {
    id: "group_1",
    type: "group",
    participants: ["AstralExplorer", "TraumDeuter", "MeditationsGuide", "WaldEntdecker"],
    title: "Traumdeutung & Luzides Träumen",
    description: "Eine Gruppe zum Austausch über Traumdeutung und Techniken des luziden Träumens",
    avatar: "/serene-meditation.png",
    lastMessage: mockGroupMessages["group_1"][mockGroupMessages["group_1"].length - 1],
    unreadCount: 1,
    createdAt: new Date(2023, 3, 15, 10, 0),
    updatedAt: new Date(2023, 3, 15, 10, 30),
  },
]

// Mock-Chat-Channels
export const mockChatChannels: ChatChannel[] = [
  {
    id: "channel_1",
    name: "Traumdeutung & Luzides Träumen",
    description: "Diskussionen und Austausch über die Bedeutung von Träumen und Techniken des luziden Träumens.",
    avatar: "/serene-meditation.png",
    memberCount: 42,
    category: "Persönliche Entwicklung",
    isPublic: true,
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "channel_2",
    name: "Wandern & Outdoor-Abenteuer",
    description: "Teile deine Wanderungen, Outdoor-Erlebnisse und Entdeckungen in der Natur.",
    avatar: "/black-forest-valley.png",
    memberCount: 78,
    category: "Freizeit & Hobby",
    isPublic: true,
    createdAt: new Date("2023-02-28"),
  },
  {
    id: "channel_3",
    name: "Kunst & Kultur",
    description:
      "Ein Ort für Kunstliebhaber und Kulturinteressierte, um sich über Ausstellungen, Konzerte und mehr auszutauschen.",
    avatar: "/Elbphilharmonie-modern-maritime.png",
    memberCount: 23,
    category: "Kunst & Kultur",
    isPublic: true,
    createdAt: new Date("2023-03-10"),
  },
]

// Hilfsfunktionen für das Nachrichtensystem
export const getCurrentUser = () => "AstralExplorer" // Simuliert den aktuellen Benutzer

export const getUserConversations = (username: string): Conversation[] => {
  return mockConversations.filter((conv) => conv.participants.includes(username))
}

export const getConversationById = (id: string): Conversation | undefined => {
  return mockConversations.find((conv) => conv.id === id)
}

export const getConversationMessages = (conversationId: string): Message[] => {
  if (conversationId.startsWith("conv_")) {
    return mockDirectMessages[conversationId] || []
  } else if (conversationId.startsWith("group_")) {
    return mockGroupMessages[conversationId] || []
  }
  return []
}

export const getConversationTitle = (conversation: Conversation, currentUser: string): string => {
  if (conversation.type === "direct") {
    const otherUser = getOtherParticipant(conversation, currentUser)
    const user = findUserByUsername(otherUser)
    return user ? `${user.vorname} ${user.nachname}` : otherUser
  }
  return conversation.title || "Unbenannte Gruppe"
}

export const getConversationAvatar = (conversation: Conversation, currentUser: string): string => {
  if (conversation.type === "direct") {
    const otherUser = getOtherParticipant(conversation, currentUser)
    const user = findUserByUsername(otherUser)
    return user?.avatar || "/serene-spirit.png"
  }
  return conversation.avatar || "/diverse-avatars.png"
}

export const getTotalUnreadMessages = (username: string): number => {
  return getUserConversations(username).reduce((total, conv) => total + conv.unreadCount, 0)
}

export const sendMessage = (conversationId: string, content: string, senderId: string): Message => {
  const newMessage: Message = {
    id: `msg_${Date.now()}`,
    senderId,
    content,
    timestamp: new Date(),
    read: false,
  }

  // In einer echten Anwendung würde hier die Nachricht gespeichert werden
  // Für diese Demo simulieren wir nur das Hinzufügen

  if (conversationId.startsWith("conv_")) {
    if (!mockDirectMessages[conversationId]) {
      mockDirectMessages[conversationId] = []
    }
    mockDirectMessages[conversationId].push(newMessage)
  } else if (conversationId.startsWith("group_")) {
    if (!mockGroupMessages[conversationId]) {
      mockGroupMessages[conversationId] = []
    }
    mockGroupMessages[conversationId].push(newMessage)
  }

  // Aktualisiere die letzte Nachricht in der Konversation
  const conversation = mockConversations.find((conv) => conv.id === conversationId)
  if (conversation) {
    conversation.lastMessage = newMessage
    conversation.updatedAt = new Date()
  }

  return newMessage
}

export const markConversationAsRead = (conversationId: string): void => {
  const conversation = mockConversations.find((conv) => conv.id === conversationId)
  if (conversation) {
    conversation.unreadCount = 0
  }

  // Markiere alle Nachrichten als gelesen
  if (conversationId.startsWith("conv_") && mockDirectMessages[conversationId]) {
    mockDirectMessages[conversationId].forEach((msg) => {
      msg.read = true
    })
  } else if (conversationId.startsWith("group_") && mockGroupMessages[conversationId]) {
    mockGroupMessages[conversationId].forEach((msg) => {
      msg.read = true
    })
  }
}

export const createNewConversation = (
  participants: string[],
  type: "direct" | "group",
  title?: string,
  description?: string,
  avatar?: string,
): Conversation => {
  const id = type === "direct" ? `conv_${Date.now()}` : `group_${Date.now()}`
  const newConversation: Conversation = {
    id,
    type,
    participants,
    title,
    description,
    avatar,
    unreadCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  mockConversations.push(newConversation)
  return newConversation
}

// Hilfsfunktion, um den anderen Teilnehmer in einer Direktnachricht zu finden
const getOtherParticipant = (conversation: Conversation, currentUser: string): string => {
  return conversation.participants.find((p) => p !== currentUser) || ""
}

export const mockMessages: Message[] = []

// Aktualisiere die Mock-Messages-Funktionen, um Anhänge zu unterstützen

// 1. Erweitere die sendMessage-Funktion, um Anhänge zu unterstützen:
export function sendMessageWithAttachments(
  conversationId: string,
  content: string,
  sender: string,
  attachments?: Attachment[],
): Message {
  const conversation = getConversationById(conversationId)
  if (!conversation) {
    throw new Error(`Conversation with id ${conversationId} not found`)
  }

  const message: Message = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    senderId: sender,
    content,
    timestamp: new Date(),
    read: false,
    attachments,
  }

  // Füge die Nachricht zur Konversation hinzu
  mockMessages.push(message)

  // Aktualisiere die letzte Nachricht und das Datum der Konversation
  conversation.lastMessage = message
  conversation.updatedAt = new Date()

  // Erhöhe den Zähler für ungelesene Nachrichten für alle anderen Teilnehmer
  conversation.participants
    .filter((participant) => participant !== sender)
    .forEach((participant) => {
      const userConversation = mockConversations.find(
        (c) => c.id === conversationId && c.participants.includes(participant),
      )
      if (userConversation) {
        userConversation.unreadCount += 1
      }
    })

  return message
}

// 2. Füge eine Funktion zum Abrufen von Chat-Channels hinzu:
export function getMockChatChannels(): ChatChannel[] {
  return [
    {
      id: "traumdeutung",
      name: "Traumdeutung Tipps",
      description: "Teile und interpretiere deine Träume mit der Community",
      memberCount: 156,
      category: "Persönlich",
      isPublic: true,
      createdAt: new Date(2023, 1, 15),
    },
    {
      id: "ufo-norddeutschland",
      name: "UFO-Sichtungen Norddeutschland",
      description: "Diskussion über ungewöhnliche Himmelsphänomene in Norddeutschland",
      memberCount: 89,
      category: "Paranormal",
      isPublic: true,
      createdAt: new Date(2023, 3, 22),
    },
    {
      id: "synchronizitaet",
      name: "Synchronizität & Zufälle",
      description: "Austausch über bedeutungsvolle Zufälle und Synchronizitäten",
      memberCount: 124,
      category: "Spirituell",
      isPublic: true,
      createdAt: new Date(2023, 2, 8),
    },
    {
      id: "outdoor-abenteuer",
      name: "Outdoor Abenteuer",
      description: "Für alle Naturliebhaber und Outdoor-Enthusiasten",
      memberCount: 213,
      category: "Abenteuer",
      isPublic: true,
      createdAt: new Date(2023, 0, 5),
    },
    {
      id: "reiseberichte",
      name: "Reiseberichte",
      description: "Teile deine Reiseerlebnisse und -tipps",
      memberCount: 342,
      category: "Reisen",
      isPublic: true,
      createdAt: new Date(2022, 11, 12),
    },
    {
      id: "persoenliche-entwicklung",
      name: "Persönliche Entwicklung",
      description: "Austausch über Wachstum, Selbstfindung und Transformation",
      memberCount: 178,
      category: "Persönlich",
      isPublic: true,
      createdAt: new Date(2023, 4, 3),
    },
  ]
}
