import { mockUsers } from "./mock-users"
import { getCurrentUser as getUser } from "./mock-users"

// Re-export getCurrentUser to fix the missing export error
export const getCurrentUser = getUser

// Verbessern Sie die findUserByUsername Funktion, um robuster zu sein
export function findUserByUsername(username: string) {
  if (!username) return null

  // Normalisieren Sie den Benutzernamen für den Vergleich (Kleinbuchstaben, Leerzeichen entfernen)
  const normalizedSearchName = username.toLowerCase().trim()

  return mockUsers.find((user) => {
    const normalizedUsername = user.username.toLowerCase().trim()
    return normalizedUsername === normalizedSearchName
  })
}

export function isCurrentUser(username: string) {
  const currentUser = getCurrentUser()
  return currentUser?.username?.toLowerCase() === username?.toLowerCase()
}
