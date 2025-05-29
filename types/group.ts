export interface Group {
  id: string
  name: string
  description: string
  created_by: string
  created_at: string
  updated_at: string
  avatar_url?: string
  banner_url?: string
  is_private: boolean
  member_count: number
  experience_count: number
}

export interface GroupMember {
  id: string
  group_id: string
  user_id: string
  role: "admin" | "moderator" | "member"
  joined_at: string
  user: {
    id: string
    username: string
    display_name: string
    avatar_url?: string
  }
}

export interface GroupExperience {
  id: string
  group_id: string
  experience_id: string
  shared_by: string
  shared_at: string
  experience: {
    id: string
    title: string
    summary: string
    created_at: string
    user_id: string
    image_url?: string
    category: string
    location?: string
  }
  user: {
    id: string
    username: string
    display_name: string
    avatar_url?: string
  }
}

export interface GroupInvitation {
  id: string
  group_id: string
  invited_by: string
  invited_user_id: string
  status: "pending" | "accepted" | "declined"
  created_at: string
  expires_at: string
  group: {
    id: string
    name: string
    avatar_url?: string
  }
  inviter: {
    id: string
    username: string
    display_name: string
    avatar_url?: string
  }
}

export interface GroupDiscussion {
  id: string
  group_id: string
  title: string
  content: string
  created_by: string
  created_at: string
  updated_at: string
  comment_count: number
  user: {
    id: string
    username: string
    display_name: string
    avatar_url?: string
  }
}
