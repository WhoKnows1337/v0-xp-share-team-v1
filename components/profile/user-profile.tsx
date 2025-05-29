// components/profile/user-profile.tsx
"use client"

// import type { User } from "@/lib/mock-users"; // Using ProfileUser now
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Briefcase, CalendarDays, Users, TrendingUp } from "lucide-react"

// Define ProfileUser type here or import if defined globally
interface ProfileUser {
  id: string
  username?: string | null
  display_name?: string | null
  avatar_url?: string | null
  bio?: string | null
  email?: string | null
  experience_points?: number | null
  level?: number | null
  is_premium?: boolean | null
  is_admin?: boolean | null
  created_at?: string | null
  experiences_count?: number
  followers_count?: number
  following_count?: number
}

interface UserProfileProps {
  user: ProfileUser
}

export default function UserProfileComponent({ user }: UserProfileProps) {
  if (!user) {
    return <p className="text-center py-10">Benutzer nicht gefunden.</p>
  }

  const getInitials = (name?: string | null, fallback = "U") => {
    if (!name) return fallback
    const parts = name.split(" ")
    if (parts.length > 1) {
      return parts[0][0] + parts[parts.length - 1][0]
    }
    return name.substring(0, 2)
  }

  const displayName = user.display_name || user.username || "Unbekannter Benutzer"

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-3xl mx-auto shadow-xl">
        <CardHeader className="relative p-0">
          <div className="h-40 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800" />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 transform">
            <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
              <AvatarImage src={user.avatar_url || undefined} alt={displayName} />
              <AvatarFallback className="text-3xl">{getInitials(displayName)}</AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>
        <CardContent className="pt-20 text-center">
          {" "}
          {/* Increased pt to make space for larger avatar */}
          <CardTitle className="text-3xl font-bold">{displayName}</CardTitle>
          {user.username && <p className="text-muted-foreground text-sm">@{user.username}</p>}
          <div className="mt-2 space-x-2">
            {user.is_premium && <Badge variant="premium">Premium</Badge>}
            {user.is_admin && <Badge variant="destructive">Admin</Badge>}
            {user.level && <Badge variant="secondary">Level {user.level}</Badge>}
          </div>
          {user.bio && <p className="mt-4 text-muted-foreground max-w-md mx-auto">{user.bio}</p>}
          <Separator className="my-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-left">
            <div className="flex items-center space-x-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <Briefcase className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Erlebnisse</p>
                <p className="text-muted-foreground">{user.experiences_count ?? 0}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Follower</p>
                <p className="text-muted-foreground">{user.followers_count ?? 0}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <Users className="h-5 w-5 text-primary transform -scale-x-100" /> {/* Icon for following */}
              <div>
                <p className="font-medium">Folgt</p>
                <p className="text-muted-foreground">{user.following_count ?? 0}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">XP Punkte</p>
                <p className="text-muted-foreground">{user.experience_points ?? 0}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <CalendarDays className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Dabei seit</p>
                <p className="text-muted-foreground">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString("de-DE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
          {/* Placeholder for Profile Tabs */}
          <div className="mt-8">
            {/* <ProfileTabs user={user} /> */}
            <p className="text-muted-foreground italic">
              (Bereich für Profil-Tabs: Erlebnisse, Kommentare, Lesezeichen etc.)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
