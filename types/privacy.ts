export type PrivacyLevel = "public" | "followers" | "private" | "custom"

export type PrivacyPermission = "view" | "comment" | "share"

export interface PrivacySettings {
  id: string
  userId: string
  defaultVisibility: PrivacyLevel
  locationSharing: boolean
  activityTracking: boolean
  searchVisibility: boolean
  profileVisibility: PrivacyLevel
  allowComments: PrivacyLevel
  allowDirectMessages: PrivacyLevel
  showOnlineStatus: boolean
  showReadReceipts: boolean
  dataRetentionPeriod: number // in days, 0 = forever
  thirdPartySharing: boolean
  updatedAt: string
}

export interface ContentPrivacySettings {
  id: string
  contentId: string
  contentType: "erlebnis" | "kommentar" | "diskussion" | "xp-eintrag"
  visibility: PrivacyLevel
  allowedUsers?: string[] // user IDs
  allowedGroups?: string[] // group IDs
  expiresAt?: string // ISO date string
  password?: string // hashed password
  updatedAt: string
}

export interface TemporaryAccess {
  id: string
  contentId: string
  contentType: "erlebnis" | "kommentar" | "diskussion" | "xp-eintrag"
  accessCode: string
  permissions: PrivacyPermission[]
  createdBy: string // user ID
  createdAt: string
  expiresAt: string
  maxUses: number
  usedCount: number
  isActive: boolean
}

export interface PrivacyAuditLog {
  id: string
  userId: string
  action: "view" | "update" | "delete" | "share" | "access"
  contentId?: string
  contentType?: "erlebnis" | "kommentar" | "diskussion" | "xp-eintrag" | "profile"
  timestamp: string
  ipAddress?: string
  userAgent?: string
  success: boolean
  details?: string
}
