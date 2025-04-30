export interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
  read: boolean
  attachments?: Attachment[]
}

export interface Attachment {
  id: string
  type: "image" | "file"
  url: string
  name: string
}

export interface Conversation {
  id: string
  type: "direct" | "group"
  participants: string[] // Benutzernamen
  lastMessage?: Message
  unreadCount: number
  title?: string // Nur für Gruppenchats
  description?: string // Nur für Gruppenchats
  avatar?: string // Nur für Gruppenchats
  createdAt: Date
  updatedAt: Date
}

export interface ChatChannel {
  id: string
  name: string
  description: string
  avatar?: string
  memberCount: number
  category: string
  isPublic: boolean
  createdAt: Date
}
