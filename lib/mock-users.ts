// Helper utilities for managing mock users, to be used by supabase-auth.ts and supabase-client.ts (mock part)

export interface User {
  id: string
  username: string
  display_name?: string
  avatar_url?: string
  bio?: string
  email: string // email is essential
  experience_points?: number
  level?: number
  is_premium?: boolean
  is_admin?: boolean
  created_at?: string
  updated_at?: string
  preferences?: any
  // For profile page display
  experiences_count?: number
  followers_count?: number
  following_count?: number
}

// Füge die Achievement-Typen hinzu
export interface Achievement {
  id: string
  name: string
  beschreibung: string
  icon: string
  unlocked: boolean
  progress?: {
    current: number
    total: number
  }
}

// Erweitere die User-Schnittstelle um Achievements
// export interface User {
//   // Bestehende Felder...
//   achievements?: Achievement[];
//   // ...
// }

export interface Achievement {
  id: string
  name: string
  beschreibung: string
  icon: string
  unlocked?: boolean
  progress?: {
    current: number
    total: number
  }
}

const mockUsersList: User[] = [
  {
    id: "mock-user-id-1",
    username: "testuser1",
    email: "test1@example.com",
    display_name: "Test User Eins",
    avatar_url: "/placeholder.svg?width=96&height=96&text=T1",
    experience_points: 1250,
    level: 5,
    is_premium: false,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    bio: "Ein Testbenutzer, der gerne Dinge ausprobiert.",
    experiences_count: 5,
    followers_count: 10,
    following_count: 2,
  },
  {
    id: "mock-user-id-2",
    username: "testuser2",
    email: "test2@example.com",
    display_name: "Test User Zwei",
    avatar_url: "/placeholder.svg?width=96&height=96&text=T2",
    experience_points: 2500,
    level: 8,
    is_premium: true,
    created_at: "2023-01-02T00:00:00Z",
    updated_at: "2023-01-02T00:00:00Z",
    bio: "Ein weiterer Testbenutzer mit Premium-Status.",
    experiences_count: 12,
    followers_count: 55,
    following_count: 23,
  },
  {
    id: "mock-user-id-astral", // Used by AuthContext mockUser
    username: "AstralExplorer",
    display_name: "Astral Explorer",
    avatar_url: "/placeholder.svg?width=96&height=96&text=AE",
    bio: "Exploring the digital cosmos and sharing experiences. Loves lucid dreaming and meditation.",
    email: "astral@example.com",
    experience_points: 1500,
    level: 6,
    is_premium: true,
    created_at: "2022-06-15T10:00:00Z",
    updated_at: "2023-01-20T10:00:00Z",
    experiences_count: 10,
    followers_count: 120,
    following_count: 75,
    preferences: {
      notifications: {
        newFollower: true,
        experienceComment: true,
        experienceLike: false,
      },
      theme: "dark",
    },
  },
]

// Mock-Benutzer
export const mockUsers: User[] = [
  {
    id: "user1",
    username: "AstralExplorer",
    name: "Alex Müller",
    vorname: "Alex",
    nachname: "Müller",
    email: "alex@example.com",
    avatar: "/diverse-avatars.png",
    bio: "Astralreisender seit 2010, auf der Suche nach Antworten. Teile meine Erfahrungen mit der Community und freue mich über Austausch.",
    isVerifiziert: true,
    registriertSeit: "15.03.2022",
    statistiken: {
      erlebnisseCount: 42,
      kommentareCount: 128,
      erlebnisse: 42,
      kommentare: 128,
      erhalteneVotes: 756,
      xpLevel: 8,
      xpPunkte: 2450,
    },
    achievements: [
      {
        id: "a1",
        name: "Erfahrener Autor",
        beschreibung: "Hat mehr als 10 Erlebnisse geteilt",
        icon: "BookOpen",
        unlocked: true,
      },
      {
        id: "a2",
        name: "Engagierter Kommentator",
        beschreibung: "Hat mehr als 100 Kommentare verfasst",
        icon: "MessageSquare",
        unlocked: true,
      },
      {
        id: "a3",
        name: "Beliebter Beitragender",
        beschreibung: "Hat mehr als 500 Likes erhalten",
        icon: "Heart",
        unlocked: true,
      },
      {
        id: "a4",
        name: "Frühes Mitglied",
        beschreibung: "Ist der Community in der Betaphase beigetreten",
        icon: "Award",
        unlocked: true,
      },
    ],
    badges: [
      { id: "b1", name: "Top-Autor", farbe: "#4C51BF" },
      { id: "b2", name: "Moderator", farbe: "#38A169" },
    ],
    lesezeichen: ["e1", "e2", "e3"],
    entwuerfe: [],
  },
  {
    id: "user2",
    username: "MeditationsMeister",
    name: "Maria Schmidt",
    vorname: "Maria",
    nachname: "Schmidt",
    email: "maria@example.com",
    avatar: "/serene-spirit.png",
    bio: "Meditationslehrerin und spirituelle Sucherin. Ich teile meine Erfahrungen mit tiefer Meditation und Bewusstseinserweiterung.",
    isVerifiziert: true,
    registriertSeit: "03.05.2022",
    statistiken: {
      erlebnisseCount: 28,
      kommentareCount: 95,
      erlebnisse: 28,
      kommentare: 95,
      erhalteneVotes: 412,
      xpLevel: 6,
      xpPunkte: 1820,
    },
    achievements: [
      {
        id: "a1",
        name: "Erfahrener Autor",
        beschreibung: "Hat mehr als 10 Erlebnisse geteilt",
        icon: "BookOpen",
        unlocked: true,
      },
      {
        id: "a2",
        name: "Engagierter Kommentator",
        beschreibung: "Hat mehr als 100 Kommentare verfasst",
        icon: "MessageSquare",
        unlocked: false,
      },
    ],
    entwuerfe: [],
  },
  {
    id: "user3",
    username: "KosmischerWanderer",
    name: "Klaus Weber",
    vorname: "Klaus",
    nachname: "Weber",
    email: "klaus@example.com",
    avatar: "/elemental-convergence.png",
    bio: "Erforscher des Kosmos und der inneren Welten. Teile meine Erfahrungen mit außerkörperlichen Reisen und kosmischen Begegnungen.",
    isVerifiziert: false,
    registriertSeit: "22.07.2022",
    statistiken: {
      erlebnisseCount: 15,
      kommentareCount: 47,
      erlebnisse: 15,
      kommentare: 47,
      erhalteneVotes: 183,
      xpLevel: 4,
      xpPunkte: 950,
    },
    achievements: [
      {
        id: "a1",
        name: "Erfahrener Autor",
        beschreibung: "Hat mehr als 10 Erlebnisse geteilt",
        icon: "BookOpen",
        unlocked: true,
      },
    ],
    entwuerfe: [],
  },
  {
    id: "user4",
    username: "SynchronizitätsForscherin",
    name: "Sophie Becker",
    vorname: "Sophie",
    nachname: "Becker",
    email: "sophie@example.com",
    avatar: "/thoughtful-gaze.png",
    bio: "Erforsche die Verbindungen zwischen scheinbaren Zufällen und dem kollektiven Unbewussten. Auf der Suche nach Mustern im Chaos.",
    isVerifiziert: false,
    registriertSeit: "14.09.2022",
    statistiken: {
      erlebnisseCount: 8,
      kommentareCount: 36,
      erlebnisse: 8,
      kommentare: 36,
      erhalteneVotes: 97,
      xpLevel: 3,
      xpPunkte: 620,
    },
    achievements: [],
    entwuerfe: [],
  },
  {
    id: "user5",
    username: "TraumDeuter",
    name: "Thomas Fischer",
    vorname: "Thomas",
    nachname: "Fischer",
    email: "thomas@example.com",
    avatar: "/contemplative-figure.png",
    bio: "Traumforscher und Analytiker. Ich helfe Menschen, die Botschaften ihrer Träume zu verstehen und ihr Unterbewusstsein zu erforschen.",
    isVerifiziert: true,
    registriertSeit: "02.11.2022",
    statistiken: {
      erlebnisseCount: 19,
      kommentareCount: 72,
      erlebnisse: 19,
      kommentare: 72,
      erhalteneVotes: 245,
      xpLevel: 5,
      xpPunkte: 1340,
    },
    achievements: [
      {
        id: "a1",
        name: "Erfahrener Autor",
        beschreibung: "Hat mehr als 10 Erlebnisse geteilt",
        icon: "BookOpen",
        unlocked: true,
      },
    ],
    entwuerfe: [],
  },
  {
    id: "user6",
    username: "WaldEntdecker",
    name: "Thomas Bauer",
    vorname: "Thomas",
    nachname: "Bauer",
    email: "thomas.bauer@example.com",
    avatar: "/forest-explorer.png",
    bio: "Naturliebhaber und Waldexperte. Ich teile meine Erfahrungen mit der heilenden Kraft der Natur und besonderen Orten im Wald.",
    isVerifiziert: false,
    registriertSeit: "18.04.2023",
    statistiken: {
      erlebnisseCount: 12,
      kommentareCount: 34,
      erlebnisse: 12,
      kommentare: 34,
      erhalteneVotes: 156,
      xpLevel: 3,
      xpPunkte: 780,
    },
    achievements: [
      {
        id: "a1",
        name: "Erfahrener Autor",
        beschreibung: "Hat mehr als 10 Erlebnisse geteilt",
        icon: "BookOpen",
        unlocked: true,
      },
    ],
    entwuerfe: [],
  },
  {
    id: "user7",
    username: "TraumReisender",
    name: "Julian Berger",
    vorname: "Julian",
    nachname: "Berger",
    email: "julian.berger@example.com",
    avatar: "/dream-traveler.png",
    bio: "Reisender zwischen den Welten. Ich erkunde die Grenzen zwischen Traum und Realität und teile meine Erfahrungen mit luziden Träumen.",
    isVerifiziert: true,
    registriertSeit: "10.07.2022",
    statistiken: {
      erlebnisseCount: 27,
      kommentareCount: 93,
      erlebnisse: 27,
      kommentare: 93,
      erhalteneVotes: 342,
      xpLevel: 6,
      xpPunkte: 1780,
    },
    achievements: [
      {
        id: "a1",
        name: "Erfahrener Autor",
        beschreibung: "Hat mehr als 10 Erlebnisse geteilt",
        icon: "BookOpen",
        unlocked: true,
      },
      {
        id: "a2",
        name: "Engagierter Kommentator",
        beschreibung: "Hat mehr als 100 Kommentare verfasst",
        icon: "MessageSquare",
        unlocked: false,
      },
    ],
    badges: [{ id: "b1", name: "Traumexperte", farbe: "#805AD5" }],
    entwuerfe: [],
  },
  {
    id: "user8",
    username: "Traumreisende",
    name: "Laura Klein",
    vorname: "Laura",
    nachname: "Klein",
    email: "laura.klein@example.com",
    avatar: "/dream-traveler.png",
    bio: "Traumforscherin und Expertin für luzides Träumen. Ich helfe Menschen, ihre Träume bewusst zu erleben und zu steuern.",
    isVerifiziert: true,
    registriertSeit: "05.06.2022",
    statistiken: {
      erlebnisseCount: 24,
      kommentareCount: 87,
      erlebnisse: 24,
      kommentare: 87,
      erhalteneVotes: 320,
      xpLevel: 6,
      xpPunkte: 1650,
    },
    achievements: [
      {
        id: "a1",
        name: "Erfahrener Autor",
        beschreibung: "Hat mehr als 10 Erlebnisse geteilt",
        icon: "BookOpen",
        unlocked: true,
      },
      {
        id: "a2",
        name: "Engagierter Kommentator",
        beschreibung: "Hat mehr als 100 Kommentare verfasst",
        icon: "MessageSquare",
        unlocked: false,
      },
    ],
    entwuerfe: [],
  },
  {
    id: "user9",
    username: "MeditationsGuide",
    name: "Jana Hoffmann",
    vorname: "Jana",
    nachname: "Hoffmann",
    email: "jana.hoffmann@example.com",
    avatar: "/peaceful-meditation-guide.png",
    bio: "Erfahrene Meditationslehrerin mit über 10 Jahren Erfahrung. Ich teile meine Erkenntnisse und Techniken für tiefe Meditation.",
    isVerifiziert: true,
    registriertSeit: "12.08.2022",
    statistiken: {
      erlebnisseCount: 31,
      kommentareCount: 104,
      erlebnisse: 31,
      kommentare: 104,
      erhalteneVotes: 478,
      xpLevel: 7,
      xpPunkte: 2100,
    },
    achievements: [
      {
        id: "a1",
        name: "Erfahrener Autor",
        beschreibung: "Hat mehr als 10 Erlebnisse geteilt",
        icon: "BookOpen",
        unlocked: true,
      },
      {
        id: "a2",
        name: "Engagierter Kommentator",
        beschreibung: "Hat mehr als 100 Kommentare verfasst",
        icon: "MessageSquare",
        unlocked: true,
      },
    ],
    entwuerfe: [],
  },
  {
    id: "user10",
    username: "PhilosophischerWanderer",
    name: "Markus Wagner",
    vorname: "Markus",
    nachname: "Wagner",
    email: "markus.wagner@example.com",
    avatar: "/philosophical-wanderer.png",
    bio: "Philosophischer Wanderer auf der Suche nach Erkenntnis. Ich teile meine Gedanken und Erfahrungen auf dem Weg zur Weisheit.",
    isVerifiziert: false,
    registriertSeit: "23.10.2022",
    statistiken: {
      erlebnisseCount: 16,
      kommentareCount: 58,
      erlebnisse: 16,
      kommentare: 58,
      erhalteneVotes: 210,
      xpLevel: 4,
      xpPunkte: 980,
    },
    achievements: [
      {
        id: "a1",
        name: "Erfahrener Autor",
        beschreibung: "Hat mehr als 10 Erlebnisse geteilt",
        icon: "BookOpen",
        unlocked: true,
      },
    ],
    entwuerfe: [],
  },
  {
    id: "user11",
    username: "SeelenWanderer",
    name: "Sophia Müller",
    vorname: "Sophia",
    nachname: "Müller",
    email: "sophia.mueller@example.com",
    avatar: "/serene-gaze.png",
    bio: "Spirituelle Sucherin und Seelenforscherin. Ich erkunde die Tiefen des Bewusstseins und teile meine Erkenntnisse.",
    isVerifiziert: true,
    registriertSeit: "17.09.2022",
    statistiken: {
      erlebnisseCount: 22,
      kommentareCount: 76,
      erlebnisse: 22,
      kommentare: 76,
      erhalteneVotes: 289,
      xpLevel: 5,
      xpPunkte: 1520,
    },
    achievements: [
      {
        id: "a1",
        name: "Erfahrener Autor",
        beschreibung: "Hat mehr als 10 Erlebnisse geteilt",
        icon: "BookOpen",
        unlocked: true,
      },
    ],
    badges: [{ id: "b1", name: "Spiritueller Guide", farbe: "#9F7AEA" }],
    entwuerfe: [],
  },
  {
    id: "user12",
    username: "NaturEntdecker",
    name: "Niklas Weber",
    vorname: "Niklas",
    nachname: "Weber",
    email: "niklas.weber@example.com",
    avatar: "/forest-explorer.png",
    bio: "Naturliebhaber und Entdecker. Ich teile meine Erfahrungen mit der Natur und besonderen Orten in der Wildnis.",
    isVerifiziert: true,
    registriertSeit: "05.03.2022",
    statistiken: {
      erlebnisseCount: 34,
      kommentareCount: 112,
      erlebnisse: 34,
      kommentare: 112,
      erhalteneVotes: 423,
      xpLevel: 7,
      xpPunkte: 1950,
    },
    achievements: [
      {
        id: "a1",
        name: "Erfahrener Autor",
        beschreibung: "Hat mehr als 10 Erlebnisse geteilt",
        icon: "BookOpen",
        unlocked: true,
      },
      {
        id: "a2",
        name: "Engagierter Kommentator",
        beschreibung: "Hat mehr als 100 Kommentare verfasst",
        icon: "MessageSquare",
        unlocked: true,
      },
    ],
    badges: [{ id: "b1", name: "Naturexperte", farbe: "#38A169" }],
    entwuerfe: [],
  },
  {
    id: "user13",
    username: "KunstLiebhaber",
    name: "Katharina Schulz",
    vorname: "Katharina",
    nachname: "Schulz",
    email: "katharina.schulz@example.com",
    avatar: "/contemplative-woman.png",
    bio: "Kunstliebhaberin und Kulturenthusiastin. Ich teile meine Erfahrungen mit Kunst und Kultur aus aller Welt.",
    isVerifiziert: false,
    registriertSeit: "12.04.2022",
    statistiken: {
      erlebnisseCount: 19,
      kommentareCount: 67,
      erlebnisse: 19,
      kommentare: 67,
      erhalteneVotes: 231,
      xpLevel: 5,
      xpPunkte: 1280,
    },
    achievements: [
      {
        id: "a1",
        name: "Erfahrener Autor",
        beschreibung: "Hat mehr als 10 Erlebnisse geteilt",
        icon: "BookOpen",
        unlocked: true,
      },
    ],
    entwuerfe: [],
  },
  {
    id: "user14",
    username: "Weltenbummler",
    name: "Felix Schmidt",
    vorname: "Felix",
    nachname: "Schmidt",
    email: "felix.schmidt@example.com",
    avatar: "/confident-leader.png",
    bio: "Reisender und Abenteurer. Ich erkunde die Welt und teile meine Erfahrungen mit verschiedenen Kulturen und Orten.",
    isVerifiziert: true,
    registriertSeit: "28.02.2022",
    statistiken: {
      erlebnisseCount: 41,
      kommentareCount: 124,
      erlebnisse: 41,
      kommentare: 124,
      erhalteneVotes: 567,
      xpLevel: 8,
      xpPunkte: 2380,
    },
    achievements: [
      {
        id: "a1",
        name: "Erfahrener Autor",
        beschreibung: "Hat mehr als 10 Erlebnisse geteilt",
        icon: "BookOpen",
        unlocked: true,
      },
      {
        id: "a2",
        name: "Engagierter Kommentator",
        beschreibung: "Hat mehr als 100 Kommentare verfasst",
        icon: "MessageSquare",
        unlocked: true,
      },
    ],
    badges: [{ id: "b1", name: "Globetrotter", farbe: "#3182CE" }],
    entwuerfe: [],
  },
  // Füge den fehlenden Benutzer maria_schmidt hinzu
  {
    id: "user15",
    username: "maria_schmidt",
    name: "Maria Schmidt",
    vorname: "Maria",
    nachname: "Schmidt",
    email: "maria_schmidt@example.com",
    avatar: "/serene-gaze.png",
    bio: "Reiseliebhaberin und Fotografin. Immer auf der Suche nach neuen Abenteuern und besonderen Momenten.",
    isVerifiziert: true,
    registriertSeit: "02.02.2022",
    statistiken: {
      erlebnisseCount: 67,
      kommentareCount: 218,
      erlebnisse: 67,
      kommentare: 218,
      erhalteneVotes: 932,
      xpLevel: 7,
      xpPunkte: 2450,
    },
    achievements: [
      {
        id: "a1",
        name: "Erfahrener Autor",
        beschreibung: "Hat mehr als 10 Erlebnisse geteilt",
        icon: "BookOpen",
        unlocked: true,
      },
    ],
    badges: [
      { id: "b1", name: "Reiseenthusiast", farbe: "#F59E0B" },
      { id: "b2", name: "Fotograf", farbe: "#8B5CF6" },
    ],
    entwuerfe: [],
  },
  // Füge den fehlenden Benutzer KarriereWandler hinzu
  {
    id: "user16",
    username: "KarriereWandler",
    name: "Lukas Hoffmann",
    vorname: "Lukas",
    nachname: "Hoffmann",
    email: "lukas.hoffmann@example.com",
    avatar: "/Crossroads-of-Change.png",
    bio: "Karrierecoach und Mentor. Ich helfe Menschen, ihren beruflichen Weg zu finden und Veränderungen mutig anzugehen.",
    isVerifiziert: true,
    registriertSeit: "10.01.2022",
    statistiken: {
      erlebnisseCount: 29,
      kommentareCount: 87,
      erlebnisse: 29,
      kommentare: 87,
      erhalteneVotes: 345,
      xpLevel: 6,
      xpPunkte: 1850,
    },
    achievements: [
      {
        id: "a1",
        name: "Erfahrener Autor",
        beschreibung: "Hat mehr als 10 Erlebnisse geteilt",
        icon: "BookOpen",
        unlocked: true,
      },
      {
        id: "a2",
        name: "Engagierter Kommentator",
        beschreibung: "Hat mehr als 100 Kommentare verfasst",
        icon: "MessageSquare",
        unlocked: false,
      },
    ],
    badges: [{ id: "b1", name: "Karriere-Experte", farbe: "#DD6B20" }],
    entwuerfe: [],
  },
  // Suche nach dem Benutzer "maxmustermann" und füge Achievements hinzu:
  {
    id: "user17",
    username: "maxmustermann",
    name: "Max Mustermann",
    vorname: "Max",
    nachname: "Mustermann",
    email: "max@example.com",
    avatar: "/diverse-avatars.png",
    bio: "Ein fiktiver Benutzer für Testzwecke.",
    isVerifiziert: false,
    registriertSeit: "01.01.2023",
    statistiken: {
      erlebnisseCount: 5,
      kommentareCount: 10,
      erlebnisse: 5,
      kommentare: 10,
      erhalteneVotes: 20,
      xpLevel: 1,
      xpPunkte: 100,
    },
    achievements: [
      {
        id: "1",
        name: "Erfahrener Autor",
        beschreibung: "Hat mehr als 10 Erlebnisse geteilt",
        icon: "BookOpen",
        unlocked: true,
      },
      {
        id: "2",
        name: "Wöchentlicher Schreiber",
        beschreibung: "Hat 7 Tage in Folge Einträge erstellt",
        icon: "Flame",
        unlocked: true,
      },
      {
        id: "3",
        name: "Community-Liebling",
        beschreibung: "Hat mehr als 100 Likes erhalten",
        icon: "Heart",
        unlocked: false,
        progress: {
          current: 78,
          total: 100,
        },
      },
    ],
    entwuerfe: [],
  },
]

export function getMockDataList(tableName: string): User[] | any[] {
  if (tableName === "users") {
    return [...mockUsersList] // Return a copy
  }
  // Add other tables if needed
  return []
}

export function getMockUserById(id: string): User | undefined {
  return mockUsersList.find((user) => user.id === id)
}

export function getMockUserByUsername(username: string): User | undefined {
  return mockUsersList.find((user) => user.username === username)
}

export function addMockUser(user: User): void {
  if (!mockUsersList.find((u) => u.id === user.id)) {
    mockUsersList.push(user)
  }
}

export function updateMockUser(updatedUser: User): void {
  const index = mockUsersList.findIndex((user) => user.id === updatedUser.id)
  if (index !== -1) {
    mockUsersList[index] = { ...mockUsersList[index], ...updatedUser }
  }
}

// Hilfsfunktion, um einen Benutzer anhand des Benutzernamens zu finden
export function findUserByUsername(username: string): User | undefined {
  if (!username) return undefined

  const user = mockUsers.find((user) => user.username === username)
  if (!user) {
    console.warn(`Benutzer ${username} nicht gefunden in findUserByUsername`)
    return undefined
  }
  return user
}

// Hilfsfunktion, um einen Benutzer anhand des Benutzernamens zu finden
export function getUserByUsername(username: string): User | undefined {
  return mockUsers.find((user) => user.username === username)
}

// This is the user that the mock Supabase client's auth.getUser() will return by default
export const defaultMockAuthUser = {
  id: "mock-user-id-astral",
  email: "astral@example.com",
  // Supabase AuthUser has more fields, but these are often the most used
  app_metadata: { provider: "email" },
  user_metadata: { username: "AstralExplorer" }, // often display_name or full_name here
  aud: "authenticated",
  created_at: new Date().toISOString(),
  // Add other fields as needed by your app from Supabase.User type
}

// Hilfsfunktion, um den aktuellen Benutzer zu erhalten (für Simulationszwecke)
export function getCurrentUser(): User {
  return mockUsers[0] // AstralExplorer ist der aktuelle Benutzer
}

// Hilfsfunktion, um zu prüfen, ob ein Benutzer der aktuelle Benutzer ist
export function isCurrentUser(username: string): boolean {
  return getCurrentUser().username === username
}

// Hilfsfunktion, um alle Benutzerreferenzen in der Anwendung zu finden
export function findAllUserReferences(): string[] {
  // In einer echten Anwendung würde dies alle Benutzerreferenzen aus der Datenbank sammeln
  // Hier geben wir einfach alle bekannten Benutzernamen zurück
  return mockUsers.map((user) => user.username)
}
