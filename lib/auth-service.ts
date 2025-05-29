// Mock Auth Service für next-lite
export interface AuthUser {
  id: string
  email: string
}

export interface AuthSession {
  user: AuthUser
}

export interface UserProfile {
  id: string
  username: string
  full_name?: string
  email: string
  experience_points: number
  level: number
  is_premium: boolean
}

// Mock-Implementierungen
export async function signUp(email: string, password: string, username: string) {
  return {
    user: { id: "mock-user", email },
    session: { user: { id: "mock-user", email } },
  }
}

export async function signIn(email: string, password: string) {
  return {
    user: { id: "mock-user", email },
    session: { user: { id: "mock-user", email } },
  }
}

export async function signOut() {
  return Promise.resolve()
}

export async function getCurrentUser() {
  return { id: "mock-user", email: "test@example.com" }
}

export async function getCurrentSession() {
  return { user: { id: "mock-user", email: "test@example.com" } }
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  return {
    id: userId,
    username: "testuser",
    full_name: "Test User",
    email: "test@example.com",
    experience_points: 1250,
    level: 5,
    is_premium: false,
  }
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  return {
    id: userId,
    username: "testuser",
    full_name: "Test User",
    email: "test@example.com",
    experience_points: 1250,
    level: 5,
    is_premium: false,
    ...updates,
  }
}

export async function updateUserPreferences(userId: string, preferences: any) {
  return getUserProfile(userId)
}

export async function updatePassword(password: string) {
  return Promise.resolve()
}

export async function resetPassword(email: string) {
  return Promise.resolve()
}
