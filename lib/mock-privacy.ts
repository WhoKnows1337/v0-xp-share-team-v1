import type { PrivacySettings, ContentPrivacySettings, TemporaryAccess, PrivacyAuditLog } from "@/types/privacy"
import { getCurrentUser } from "./mock-users"

// Mock-Daten für Privatsphäre-Einstellungen
export const mockPrivacySettings: PrivacySettings = {
  id: "privacy1",
  userId: getCurrentUser().id,
  defaultVisibility: "followers",
  locationSharing: true,
  activityTracking: true,
  searchVisibility: true,
  profileVisibility: "public",
  allowComments: "followers",
  allowDirectMessages: "followers",
  showOnlineStatus: true,
  showReadReceipts: true,
  dataRetentionPeriod: 365, // 1 Jahr
  thirdPartySharing: false,
  updatedAt: new Date().toISOString(),
}

// Mock-Daten für Inhalts-Privatsphäre-Einstellungen
export const mockContentPrivacySettings: ContentPrivacySettings[] = [
  {
    id: "content-privacy1",
    contentId: "e1",
    contentType: "erlebnis",
    visibility: "public",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "content-privacy2",
    contentId: "e2",
    contentType: "erlebnis",
    visibility: "followers",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "content-privacy3",
    contentId: "e3",
    contentType: "erlebnis",
    visibility: "private",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "content-privacy4",
    contentId: "e4",
    contentType: "erlebnis",
    visibility: "custom",
    allowedUsers: ["user2", "user3"],
    allowedGroups: ["group1"],
    updatedAt: new Date().toISOString(),
  },
]

// Mock-Daten für temporäre Zugänge
export const mockTemporaryAccess: TemporaryAccess[] = [
  {
    id: "temp1",
    contentId: "e3",
    contentType: "erlebnis",
    accessCode: "ABC123",
    permissions: ["view"],
    createdBy: getCurrentUser().id,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 Tag alt
    expiresAt: new Date(Date.now() + 86400000 * 6).toISOString(), // 6 Tage gültig
    maxUses: 5,
    usedCount: 2,
    isActive: true,
  },
  {
    id: "temp2",
    contentId: "e4",
    contentType: "erlebnis",
    accessCode: "XYZ789",
    permissions: ["view", "comment"],
    createdBy: getCurrentUser().id,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 Tage alt
    expiresAt: new Date(Date.now() + 86400000 * 4).toISOString(), // 4 Tage gültig
    maxUses: 10,
    usedCount: 0,
    isActive: true,
  },
  {
    id: "temp3",
    contentId: "e2",
    contentType: "erlebnis",
    accessCode: "DEF456",
    permissions: ["view", "comment", "share"],
    createdBy: getCurrentUser().id,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 Tage alt
    expiresAt: new Date(Date.now() - 86400000 * 3).toISOString(), // Abgelaufen
    maxUses: 3,
    usedCount: 3,
    isActive: false,
  },
]

// Mock-Daten für Audit-Logs
export const mockPrivacyAuditLogs: PrivacyAuditLog[] = [
  {
    id: "log1",
    userId: getCurrentUser().id,
    action: "update",
    contentType: "profile",
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    success: true,
    details: "Privatsphäre-Einstellungen aktualisiert",
  },
  {
    id: "log2",
    userId: "user2",
    action: "view",
    contentId: "e3",
    contentType: "erlebnis",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    ipAddress: "192.168.1.2",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    success: true,
    details: "Erlebnis mit temporärem Zugang angesehen",
  },
  {
    id: "log3",
    userId: "user3",
    action: "access",
    contentId: "e4",
    contentType: "erlebnis",
    timestamp: new Date(Date.now() - 86400000 / 2).toISOString(),
    ipAddress: "192.168.1.3",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)",
    success: false,
    details: "Zugriff verweigert: Keine Berechtigung",
  },
]

// Hilfsfunktionen für die Privatsphäre-Einstellungen
export function getUserPrivacySettings(userId: string): PrivacySettings {
  // In einer echten Anwendung würde dies aus der Datenbank abgerufen werden
  return mockPrivacySettings
}

export function getContentPrivacySettings(contentId: string): ContentPrivacySettings | undefined {
  return mockContentPrivacySettings.find((settings) => settings.contentId === contentId)
}

export function getTemporaryAccessForContent(contentId: string): TemporaryAccess[] {
  return mockTemporaryAccess.filter((access) => access.contentId === contentId && access.isActive)
}

export function validateTemporaryAccess(contentId: string, accessCode: string): TemporaryAccess | undefined {
  const access = mockTemporaryAccess.find(
    (a) =>
      a.contentId === contentId &&
      a.accessCode === accessCode &&
      a.isActive &&
      new Date(a.expiresAt) > new Date() &&
      a.usedCount < a.maxUses,
  )

  if (access) {
    // In einer echten Anwendung würde hier der usedCount inkrementiert werden
    access.usedCount += 1

    // Wenn die maximale Anzahl erreicht ist, deaktivieren
    if (access.usedCount >= access.maxUses) {
      access.isActive = false
    }

    // Audit-Log erstellen
    const log: PrivacyAuditLog = {
      id: `log-${Date.now()}`,
      userId: getCurrentUser().id,
      action: "access",
      contentId,
      contentType: access.contentType,
      timestamp: new Date().toISOString(),
      success: true,
      details: `Zugriff mit temporärem Code: ${accessCode}`,
    }

    mockPrivacyAuditLogs.push(log)
  }

  return access
}

export function createTemporaryAccess(
  contentId: string,
  contentType: "erlebnis" | "kommentar" | "diskussion" | "xp-eintrag",
  permissions: ("view" | "comment" | "share")[],
  expiresInDays: number,
  maxUses: number,
): TemporaryAccess {
  // Zufälligen Zugangscode generieren
  const accessCode = Math.random().toString(36).substring(2, 8).toUpperCase()

  const newAccess: TemporaryAccess = {
    id: `temp-${Date.now()}`,
    contentId,
    contentType,
    accessCode,
    permissions,
    createdBy: getCurrentUser().id,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * expiresInDays).toISOString(),
    maxUses,
    usedCount: 0,
    isActive: true,
  }

  mockTemporaryAccess.push(newAccess)

  return newAccess
}

export function updatePrivacySettings(settings: Partial<PrivacySettings>): PrivacySettings {
  // In einer echten Anwendung würde dies in der Datenbank aktualisiert werden
  Object.assign(mockPrivacySettings, settings, { updatedAt: new Date().toISOString() })

  // Audit-Log erstellen
  const log: PrivacyAuditLog = {
    id: `log-${Date.now()}`,
    userId: getCurrentUser().id,
    action: "update",
    contentType: "profile",
    timestamp: new Date().toISOString(),
    success: true,
    details: "Privatsphäre-Einstellungen aktualisiert",
  }

  mockPrivacyAuditLogs.push(log)

  return mockPrivacySettings
}

export function updateContentPrivacy(
  contentId: string,
  settings: Partial<ContentPrivacySettings>,
): ContentPrivacySettings {
  const existingSettings = mockContentPrivacySettings.find((s) => s.contentId === contentId)

  if (existingSettings) {
    Object.assign(existingSettings, settings, { updatedAt: new Date().toISOString() })
    return existingSettings
  } else {
    const contentType = settings.contentType || "erlebnis"
    const newSettings: ContentPrivacySettings = {
      id: `content-privacy-${Date.now()}`,
      contentId,
      contentType,
      visibility: settings.visibility || "public",
      allowedUsers: settings.allowedUsers,
      allowedGroups: settings.allowedGroups,
      updatedAt: new Date().toISOString(),
    }

    mockContentPrivacySettings.push(newSettings)
    return newSettings
  }
}

export function getPrivacyAuditLogs(userId: string, limit = 10): PrivacyAuditLog[] {
  return mockPrivacyAuditLogs
    .filter((log) => log.userId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)
}
