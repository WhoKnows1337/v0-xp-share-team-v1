import { getSupabaseClient } from "./supabase-client"
import { config } from "./config"

export interface Group {
  id: string
  name: string
  description: string
  avatar_url?: string
  is_private: boolean
  member_count: number
  category: string
  location?: string
  created_at: string
  updated_at: string
  owner_id: string
  tags: string[]
}

export interface GroupMember {
  id: string
  group_id: string
  user_id: string
  role: "owner" | "admin" | "moderator" | "member"
  joined_at: string
  user: {
    username: string
    display_name?: string
    avatar_url?: string
  }
}

export interface GroupInvite {
  id: string
  group_id: string
  inviter_id: string
  invitee_id: string
  status: "pending" | "accepted" | "declined"
  created_at: string
}

// Mock-Daten für Gruppen
const mockGroups: Group[] = [
  {
    id: "1",
    name: "Bergwanderer Hamburg",
    description: "Gemeinsame Wanderungen und Outdoor-Erlebnisse in und um Hamburg",
    avatar_url: "/alpine-mountain-biking-adventure.png",
    is_private: false,
    member_count: 127,
    category: "Outdoor",
    location: "Hamburg",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    owner_id: "user1",
    tags: ["Wandern", "Natur", "Hamburg", "Outdoor"],
  },
  {
    id: "2",
    name: "Fotografie Enthusiasten",
    description: "Teile deine besten Foto-Erlebnisse und lerne von anderen",
    avatar_url: "/contemplative-figure.png",
    is_private: true,
    member_count: 89,
    category: "Kreativ",
    created_at: "2024-01-03T14:00:00Z",
    updated_at: "2024-01-03T14:00:00Z",
    owner_id: "user2",
    tags: ["Fotografie", "Kunst", "Kreativ"],
  },
  {
    id: "3",
    name: "Kulinarische Entdeckungen",
    description: "Restaurants, Rezepte und Food-Erlebnisse",
    avatar_url: "/italian-feast.png",
    is_private: false,
    member_count: 203,
    category: "Kulinarik",
    created_at: "2023-12-20T16:00:00Z",
    updated_at: "2023-12-20T16:00:00Z",
    owner_id: "user3",
    tags: ["Essen", "Restaurants", "Kochen"],
  },
]

const mockMembers: GroupMember[] = [
  {
    id: "1",
    group_id: "1",
    user_id: "user1",
    role: "owner",
    joined_at: "2024-01-15T10:00:00Z",
    user: {
      username: "max_wanderer",
      display_name: "Max Mustermann",
      avatar_url: "/philosophical-wanderer.png",
    },
  },
  {
    id: "2",
    group_id: "1",
    user_id: "user2",
    role: "admin",
    joined_at: "2024-01-20T12:00:00Z",
    user: {
      username: "anna_explorer",
      display_name: "Anna Schmidt",
      avatar_url: "/forest-explorer.png",
    },
  },
]

class GroupService {
  // Holt alle Gruppen
  async getAll(options?: { limit?: number; offset?: number; category?: string; search?: string }) {
    if (config.useMockData) {
      let filtered = [...mockGroups]

      if (options?.category) {
        filtered = filtered.filter((group) => group.category === options.category)
      }

      if (options?.search) {
        const search = options.search.toLowerCase()
        filtered = filtered.filter(
          (group) =>
            group.name.toLowerCase().includes(search) ||
            group.description.toLowerCase().includes(search) ||
            group.tags.some((tag) => tag.toLowerCase().includes(search)),
        )
      }

      const start = options?.offset || 0
      const end = start + (options?.limit || filtered.length)

      return filtered.slice(start, end)
    }

    // Supabase-Implementierung
    try {
      const supabase = getSupabaseClient()
      let query = supabase.from("groups").select("*").order("created_at", { ascending: false })

      if (options?.limit) {
        query = query.limit(options.limit)
      }

      if (options?.category) {
        query = query.eq("category", options.category)
      }

      if (options?.search) {
        query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Fehler beim Abrufen der Gruppen:", error)
      throw error
    }
  }

  // Holt eine Gruppe nach ID
  async getById(id: string) {
    if (config.useMockData) {
      return mockGroups.find((group) => group.id === id) || null
    }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from("groups").select("*").eq("id", id).single()

      if (error) throw error
      return data
    } catch (error) {
      console.error(`Fehler beim Abrufen der Gruppe mit ID ${id}:`, error)
      throw error
    }
  }

  // Erstellt eine neue Gruppe
  async create(group: Omit<Group, "id" | "created_at" | "updated_at" | "member_count">) {
    if (config.useMockData) {
      const newGroup: Group = {
        ...group,
        id: Date.now().toString(),
        member_count: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockGroups.unshift(newGroup)
      return newGroup
    }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("groups")
        .insert({
          ...group,
          member_count: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Fehler beim Erstellen der Gruppe:", error)
      throw error
    }
  }

  // Aktualisiert eine Gruppe
  async update(id: string, updates: Partial<Group>) {
    if (config.useMockData) {
      const index = mockGroups.findIndex((group) => group.id === id)
      if (index === -1) return null

      mockGroups[index] = {
        ...mockGroups[index],
        ...updates,
        updated_at: new Date().toISOString(),
      }
      return mockGroups[index]
    }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("groups")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error(`Fehler beim Aktualisieren der Gruppe mit ID ${id}:`, error)
      throw error
    }
  }

  // Löscht eine Gruppe
  async delete(id: string) {
    if (config.useMockData) {
      const index = mockGroups.findIndex((group) => group.id === id)
      if (index === -1) return false

      mockGroups.splice(index, 1)
      return true
    }

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("groups").delete().eq("id", id)

      if (error) throw error
      return true
    } catch (error) {
      console.error(`Fehler beim Löschen der Gruppe mit ID ${id}:`, error)
      throw error
    }
  }

  // Holt Mitglieder einer Gruppe
  async getMembers(groupId: string) {
    if (config.useMockData) {
      return mockMembers.filter((member) => member.group_id === groupId)
    }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("group_members")
        .select(
          `
          *,
          user:users(username, display_name, avatar_url)
        `,
        )
        .eq("group_id", groupId)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error(`Fehler beim Abrufen der Mitglieder für Gruppe ${groupId}:`, error)
      throw error
    }
  }

  // Fügt ein Mitglied zu einer Gruppe hinzu
  async addMember(groupId: string, userId: string, role: GroupMember["role"] = "member") {
    if (config.useMockData) {
      const newMember: GroupMember = {
        id: Date.now().toString(),
        group_id: groupId,
        user_id: userId,
        role,
        joined_at: new Date().toISOString(),
        user: {
          username: "new_user",
          display_name: "Neues Mitglied",
        },
      }
      mockMembers.push(newMember)
      return newMember
    }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("group_members")
        .insert({
          group_id: groupId,
          user_id: userId,
          role,
          joined_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Fehler beim Hinzufügen des Mitglieds:", error)
      throw error
    }
  }

  // Entfernt ein Mitglied aus einer Gruppe
  async removeMember(groupId: string, userId: string) {
    if (config.useMockData) {
      const index = mockMembers.findIndex((member) => member.group_id === groupId && member.user_id === userId)
      if (index === -1) return false

      mockMembers.splice(index, 1)
      return true
    }

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("group_members").delete().eq("group_id", groupId).eq("user_id", userId)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Fehler beim Entfernen des Mitglieds:", error)
      throw error
    }
  }

  // Aktualisiert die Rolle eines Mitglieds
  async updateMemberRole(groupId: string, userId: string, role: GroupMember["role"]) {
    if (config.useMockData) {
      const member = mockMembers.find((m) => m.group_id === groupId && m.user_id === userId)
      if (member) {
        member.role = role
        return member
      }
      return null
    }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("group_members")
        .update({ role })
        .eq("group_id", groupId)
        .eq("user_id", userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Mitgliederrolle:", error)
      throw error
    }
  }

  // Holt Gruppen eines Benutzers
  async getUserGroups(userId: string) {
    if (config.useMockData) {
      const userMemberships = mockMembers.filter((member) => member.user_id === userId)
      return mockGroups.filter((group) => userMemberships.some((membership) => membership.group_id === group.id))
    }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("group_members")
        .select(
          `
          group:groups(*)
        `,
        )
        .eq("user_id", userId)

      if (error) throw error
      return data?.map((item) => item.group) || []
    } catch (error) {
      console.error(`Fehler beim Abrufen der Gruppen für Benutzer ${userId}:`, error)
      throw error
    }
  }
}

export const groupService = new GroupService()
