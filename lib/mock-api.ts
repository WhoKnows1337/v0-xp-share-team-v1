import { mockErlebnisse, mockKategorien, mockTags } from "./mock-data"
import { mockUsers, findUserByUsername, getCurrentUser } from "./mock-users"
import { toast } from "@/components/ui/use-toast"

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Generic error handling
const handleError = (error: any) => {
  console.error("API Error:", error)
  toast({
    title: "Fehler",
    description: "Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.",
    variant: "destructive",
  })
  throw error
}

// Experience API
export const ErlebnisAPI = {
  // Get all experiences with optional filtering
  async getAll(filters?: {
    kategorie?: string
    tags?: string[]
    search?: string
    autor?: string
    zeitraum?: { von?: string; bis?: string }
    ort?: string
    sortBy?: string
    limit?: number
    offset?: number
  }) {
    try {
      await delay(800) // Simulate network delay

      let filtered = [...mockErlebnisse]

      // Apply filters
      if (filters) {
        if (filters.kategorie) {
          filtered = filtered.filter((e) => e.kategorie.name === filters.kategorie)
        }

        if (filters.tags && filters.tags.length > 0) {
          filtered = filtered.filter((e) => filters.tags!.some((tag) => e.tags.includes(tag)))
        }

        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          filtered = filtered.filter(
            (e) =>
              e.titel.toLowerCase().includes(searchLower) ||
              e.kurzfassung.toLowerCase().includes(searchLower) ||
              e.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
          )
        }

        if (filters.autor) {
          filtered = filtered.filter((e) => e.autor.name === filters.autor)
        }

        if (filters.zeitraum) {
          if (filters.zeitraum.von) {
            const vonDate = new Date(filters.zeitraum.von)
            filtered = filtered.filter((e) => {
              const erlebnisDate = new Date(e.datum.split(".").reverse().join("-"))
              return erlebnisDate >= vonDate
            })
          }

          if (filters.zeitraum.bis) {
            const bisDate = new Date(filters.zeitraum.bis)
            filtered = filtered.filter((e) => {
              const erlebnisDate = new Date(e.datum.split(".").reverse().join("-"))
              return erlebnisDate <= bisDate
            })
          }
        }

        if (filters.ort) {
          filtered = filtered.filter((e) => e.ort && e.ort.name.toLowerCase().includes(filters.ort!.toLowerCase()))
        }

        // Apply sorting
        if (filters.sortBy) {
          switch (filters.sortBy) {
            case "datum-neu":
              filtered.sort((a, b) => {
                const dateA = new Date(a.datum.split(".").reverse().join("-"))
                const dateB = new Date(b.datum.split(".").reverse().join("-"))
                return dateB.getTime() - dateA.getTime()
              })
              break
            case "datum-alt":
              filtered.sort((a, b) => {
                const dateA = new Date(a.datum.split(".").reverse().join("-"))
                const dateB = new Date(b.datum.split(".").reverse().join("-"))
                return dateA.getTime() - dateB.getTime()
              })
              break
            case "titel-az":
              filtered.sort((a, b) => a.titel.localeCompare(b.titel))
              break
            case "titel-za":
              filtered.sort((a, b) => b.titel.localeCompare(a.titel))
              break
            case "beliebtheit":
              filtered.sort((a, b) => b.statistik.likes - a.statistik.likes)
              break
            case "ansichten":
              filtered.sort((a, b) => b.statistik.ansichten - a.statistik.ansichten)
              break
          }
        }

        // Apply pagination
        if (filters.limit && filters.offset !== undefined) {
          filtered = filtered.slice(filters.offset, filters.offset + filters.limit)
        }
      }

      return {
        erlebnisse: filtered,
        total: mockErlebnisse.length,
        filtered: filtered.length,
      }
    } catch (error) {
      return handleError(error)
    }
  },

  // Get a single experience by ID
  async getById(id: string) {
    try {
      await delay(600)

      if (!id) {
        throw new Error("Keine Erlebnis-ID angegeben")
      }

      console.log("API: Suche Erlebnis mit ID:", id)
      const erlebnis = mockErlebnisse.find((e) => e.id === id)

      if (!erlebnis) {
        console.error(
          `API: Erlebnis mit ID ${id} nicht gefunden. Verfügbare IDs:`,
          mockErlebnisse.map((e) => e.id),
        )
        throw new Error(`Erlebnis mit ID ${id} nicht gefunden`)
      }

      console.log("API: Erlebnis gefunden:", erlebnis.titel)

      // Increment view count (in a real app, this would be a separate API call)
      if (erlebnis.statistik) {
        erlebnis.statistik.ansichten += 1
      }

      // Generate related experiences based on tags and category
      const relatedByCategory = mockErlebnisse
        .filter((e) => e.id !== id && e.kategorie.name === erlebnis.kategorie.name)
        .slice(0, 2)
        .map((e) => ({
          ...e,
          verknuepfungstyp: `Gleiche Kategorie: ${e.kategorie.name}`,
        }))

      const relatedByTags = mockErlebnisse
        .filter(
          (e) =>
            e.id !== id &&
            e.id !== relatedByCategory[0]?.id &&
            e.id !== relatedByCategory[1]?.id &&
            e.tags.some((tag) => erlebnis.tags.includes(tag)),
        )
        .slice(0, 2)
        .map((e) => ({
          ...e,
          verknuepfungstyp: `Gemeinsame Tags: ${e.tags.filter((tag) => erlebnis.tags.includes(tag)).join(", ")}`,
        }))

      // Generate similar experiences based on other criteria
      const otherSimilar = mockErlebnisse
        .filter(
          (e) =>
            e.id !== id && !relatedByCategory.some((r) => r.id === e.id) && !relatedByTags.some((r) => r.id === e.id),
        )
        .slice(0, 2)
        .map((e) => ({
          ...e,
          verknuepfungstyp: "Ähnlicher Inhalt",
        }))

      // Generate AI summary and sentiment analysis
      const sentimentOptions = [
        { emotion: "Freude", icon: "😊", color: "text-green-500" },
        { emotion: "Angst", icon: "😨", color: "text-purple-500" },
        { emotion: "Trauer", icon: "😢", color: "text-blue-500" },
        { emotion: "Überraschung", icon: "😲", color: "text-yellow-500" },
        { emotion: "Ehrfurcht", icon: "😮", color: "text-cyan-500" },
        { emotion: "Verwirrung", icon: "😕", color: "text-orange-500" },
        { emotion: "Neutral", icon: "😐", color: "text-gray-500" },
      ]

      const randomSentiment = sentimentOptions[Math.floor(Math.random() * sentimentOptions.length)]

      // Mock comments
      const mockComments = [
        {
          id: `kommentar-${Date.now()}-1`,
          autor: {
            name: mockUsers[1].username,
            avatar: mockUsers[1].avatar || "/serene-gaze.png",
            isVerifiziert: mockUsers[1].isVerifiziert,
          },
          text: "Danke für das Teilen dieser tiefgründigen Erfahrung! Ich hatte vor einigen Jahren ein sehr ähnliches Erlebnis. Die Beschreibung erinnert mich stark an meine eigene Erfahrung. Hast du solche Erlebnisse regelmäßig?",
          datum: "vor 2 Tagen",
          likes: Math.floor(Math.random() * 10),
          antworten: [
            {
              id: `antwort-${Date.now()}-1`,
              autor: {
                name: erlebnis.autor.name,
                avatar: erlebnis.autor.avatar || "/placeholder.svg",
              },
              text: "Danke für deinen Kommentar! Nein, das war tatsächlich das erste Mal, dass ich so etwas erlebt habe. Ich meditiere zwar regelmäßig, aber diese Intensität war völlig neu für mich.",
              datum: "vor 1 Tag",
              likes: Math.floor(Math.random() * 5),
            },
          ],
        },
        {
          id: `kommentar-${Date.now()}-2`,
          autor: {
            name: mockUsers[2].username,
            avatar: mockUsers[2].avatar || "/thoughtful-gaze.png",
          },
          text: "Interessant! Ich habe in der Literatur über ähnliche Phänomene gelesen. Oft werden sie als 'mystische Erfahrungen' bezeichnet. Die Wissenschaft beginnt gerade erst, solche Zustände zu erforschen. Danke fürs Teilen!",
          datum: "vor 1 Tag",
          likes: Math.floor(Math.random() * 8),
        },
      ]

      // Generate KI summary
      const kiZusammenfassung = `In diesem Erlebnis beschreibt der Autor ${erlebnis.kurzfassung} Die Erfahrung zeigt Elemente von ${erlebnis.kategorie.name} und berührt Themen wie ${erlebnis.tags.slice(0, 3).join(", ")}.`

      // Generate English summary (for some experiences)
      const hasEnglishSummary = Math.random() > 0.3
      const englishSummary = hasEnglishSummary
        ? `In this experience, the author describes ${erlebnis.kurzfassung} The experience shows elements of ${erlebnis.kategorie.name} and touches on themes like ${erlebnis.tags.slice(0, 3).join(", ")}.`
        : undefined

      // Return enhanced experience data
      return {
        ...erlebnis,
        kiZusammenfassung,
        englishSummary,
        kiZusammenfassungStatus: "completed",
        sentiment: {
          emotion: randomSentiment.emotion,
          icon: randomSentiment.icon,
          color: randomSentiment.color,
        },
        verknuepfteErlebnisse: [...relatedByCategory, ...relatedByTags].map((e) => e.id),
        aehnlicheErlebnisse: [...relatedByCategory, ...relatedByTags, ...otherSimilar],
        kommentare: mockComments,
      }
    } catch (error) {
      return handleError(error)
    }
  },

  // Like an experience
  async likeErlebnis(id: string, isLiked: boolean) {
    try {
      await delay(300)

      const erlebnis = mockErlebnisse.find((e) => e.id === id)

      if (!erlebnis) {
        throw new Error(`Erlebnis mit ID ${id} nicht gefunden`)
      }

      if (isLiked) {
        erlebnis.statistik.likes += 1
      } else {
        erlebnis.statistik.likes = Math.max(0, erlebnis.statistik.likes - 1)
      }

      return { success: true, likes: erlebnis.statistik.likes }
    } catch (error) {
      return handleError(error)
    }
  },

  // Add a comment to an experience
  async addComment(id: string, text: string) {
    try {
      await delay(500)

      const erlebnis = mockErlebnisse.find((e) => e.id === id)

      if (!erlebnis) {
        throw new Error(`Erlebnis mit ID ${id} nicht gefunden`)
      }

      const currentUser = getCurrentUser()

      const newComment = {
        id: `kommentar-${Date.now()}`,
        autor: {
          name: currentUser.username,
          avatar: currentUser.avatar || "/serene-meditation.png",
          isVerifiziert: currentUser.isVerifiziert,
        },
        text,
        datum: "gerade eben",
        likes: 0,
        antworten: [],
      }

      // In a real app, we would add this to a database
      // For mock purposes, we'll just increment the comment count
      erlebnis.statistik.kommentare += 1

      return { success: true, comment: newComment }
    } catch (error) {
      return handleError(error)
    }
  },

  // Add a reply to a comment
  async addReply(erlebnisId: string, kommentarId: string, text: string) {
    try {
      await delay(500)

      const currentUser = getCurrentUser()

      const newReply = {
        id: `antwort-${Date.now()}`,
        autor: {
          name: currentUser.username,
          avatar: currentUser.avatar || "/serene-meditation.png",
        },
        text,
        datum: "gerade eben",
        likes: 0,
      }

      return { success: true, reply: newReply }
    } catch (error) {
      return handleError(error)
    }
  },

  // Create a new experience
  async createErlebnis(erlebnisData: any) {
    try {
      await delay(1000)

      const newId = `${mockErlebnisse.length + 1}`
      const currentUser = getCurrentUser()

      const newErlebnis = {
        id: newId,
        ...erlebnisData,
        autor: {
          name: currentUser.username,
          avatar: currentUser.avatar,
          isVerifiziert: currentUser.isVerifiziert,
        },
        verifiziert: false,
        statistik: {
          likes: 0,
          kommentare: 0,
          ansichten: 0,
        },
      }

      // In a real app, we would add this to a database
      mockErlebnisse.push(newErlebnis)

      return { success: true, erlebnis: newErlebnis }
    } catch (error) {
      return handleError(error)
    }
  },

  // Get categories and tags
  async getMetadata() {
    try {
      await delay(300)

      return {
        kategorien: mockKategorien,
        tags: mockTags,
      }
    } catch (error) {
      return handleError(error)
    }
  },
}

// User API
export const UserAPI = {
  // Get user profile
  async getUserProfile(username: string) {
    try {
      await delay(600)

      const user = findUserByUsername(username)

      if (!user) {
        throw new Error(`Benutzer ${username} nicht gefunden`)
      }

      // Get user's experiences
      const userErlebnisse = await ErlebnisAPI.getAll({ autor: username })

      return {
        ...user,
        erlebnisse: userErlebnisse.erlebnisse,
      }
    } catch (error) {
      return handleError(error)
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      await delay(300)

      const currentUser = getCurrentUser()
      return currentUser
    } catch (error) {
      return handleError(error)
    }
  },

  // Check if a user is the current user
  async isCurrentUser(username: string) {
    try {
      await delay(100)

      const currentUser = getCurrentUser()
      return { isCurrentUser: currentUser.username === username }
    } catch (error) {
      return handleError(error)
    }
  },

  // Update user profile
  async updateProfile(userData: any) {
    try {
      await delay(800)

      const currentUser = getCurrentUser()

      // In a real app, we would update the database
      // For mock purposes, we'll just return success

      return {
        success: true,
        message: "Profil erfolgreich aktualisiert",
        user: { ...currentUser, ...userData },
      }
    } catch (error) {
      return handleError(error)
    }
  },

  // Get user bookmarks
  async getUserBookmarks() {
    try {
      await delay(500)

      const currentUser = getCurrentUser()

      if (!currentUser.lesezeichen || currentUser.lesezeichen.length === 0) {
        return { bookmarks: [] }
      }

      const bookmarkedErlebnisse = mockErlebnisse.filter((e) => currentUser.lesezeichen?.includes(e.id))

      return { bookmarks: bookmarkedErlebnisse }
    } catch (error) {
      return handleError(error)
    }
  },

  // Add/remove bookmark
  async toggleBookmark(erlebnisId: string) {
    try {
      await delay(300)

      const currentUser = getCurrentUser()

      if (!currentUser.lesezeichen) {
        currentUser.lesezeichen = []
      }

      const isBookmarked = currentUser.lesezeichen.includes(erlebnisId)

      if (isBookmarked) {
        // Remove bookmark
        currentUser.lesezeichen = currentUser.lesezeichen.filter((id) => id !== erlebnisId)
      } else {
        // Add bookmark
        currentUser.lesezeichen.push(erlebnisId)
      }

      return {
        success: true,
        isBookmarked: !isBookmarked,
        message: isBookmarked ? "Aus Lesezeichen entfernt" : "Zu Lesezeichen hinzugefügt",
      }
    } catch (error) {
      return handleError(error)
    }
  },
}

// Message API
export const MessageAPI = {
  // Get user conversations
  async getConversations() {
    try {
      await delay(600)

      // This would come from a database in a real app
      const mockConversations = mockUsers.slice(1, 6).map((user) => ({
        id: `conv-${user.id}`,
        user: {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
          isVerifiziert: user.isVerifiziert,
        },
        lastMessage: {
          text: `Letzte Nachricht mit ${user.vorname}`,
          timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
          isRead: Math.random() > 0.3,
        },
        unreadCount: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0,
      }))

      return { conversations: mockConversations }
    } catch (error) {
      return handleError(error)
    }
  },

  // Get messages for a conversation
  async getMessages(conversationId: string) {
    try {
      await delay(700)

      // Extract user ID from conversation ID
      const userId = conversationId.replace("conv-", "")
      const user = mockUsers.find((u) => u.id === userId)

      if (!user) {
        throw new Error(`Benutzer für Konversation ${conversationId} nicht gefunden`)
      }

      const currentUser = getCurrentUser()

      // Generate mock messages
      const mockMessages = Array.from({ length: 10 }, (_, i) => {
        const isFromCurrentUser = i % 2 === 0
        const timestamp = new Date(Date.now() - (10 - i) * 3600000)

        return {
          id: `msg-${conversationId}-${i}`,
          text: isFromCurrentUser
            ? `Nachricht von dir an ${user.vorname} (${i + 1})`
            : `Nachricht von ${user.vorname} an dich (${i + 1})`,
          timestamp: timestamp.toISOString(),
          sender: isFromCurrentUser ? currentUser.id : user.id,
          isRead: true,
        }
      })

      return {
        messages: mockMessages,
        conversation: {
          id: conversationId,
          user: {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            isVerifiziert: user.isVerifiziert,
          },
        },
      }
    } catch (error) {
      return handleError(error)
    }
  },

  // Send a message
  async sendMessage(conversationId: string, text: string) {
    try {
      await delay(400)

      const currentUser = getCurrentUser()

      const newMessage = {
        id: `msg-${conversationId}-${Date.now()}`,
        text,
        timestamp: new Date().toISOString(),
        sender: currentUser.id,
        isRead: false,
      }

      return { success: true, message: newMessage }
    } catch (error) {
      return handleError(error)
    }
  },

  // Start a new conversation
  async startConversation(userId: string, initialMessage: string) {
    try {
      await delay(800)

      const user = mockUsers.find((u) => u.id === userId)

      if (!user) {
        throw new Error(`Benutzer mit ID ${userId} nicht gefunden`)
      }

      const conversationId = `conv-${userId}`

      // Send initial message
      await this.sendMessage(conversationId, initialMessage)

      return {
        success: true,
        conversationId,
        message: "Konversation erfolgreich gestartet",
      }
    } catch (error) {
      return handleError(error)
    }
  },
}
