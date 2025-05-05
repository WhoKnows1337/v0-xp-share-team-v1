"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CommunityMembers } from "./community-members"
import { CommunityGroups } from "./community-groups"
import { CommunityEvents } from "./community-events"
import { CommunityDiscussions } from "./community-discussions"

export function CommunityPage() {
  const [activeTab, setActiveTab] = useState("members")

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Community</h1>
          <p className="text-muted-foreground">
            Entdecke und verbinde dich mit anderen Mitgliedern der XP Share Community.
          </p>
        </div>

        <Tabs defaultValue="members" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="members">Mitglieder</TabsTrigger>
            <TabsTrigger value="groups">Gruppen</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="discussions">Diskussionen</TabsTrigger>
          </TabsList>
          <TabsContent value="members">
            <CommunityMembers />
          </TabsContent>
          <TabsContent value="groups">
            <CommunityGroups />
          </TabsContent>
          <TabsContent value="events">
            <CommunityEvents />
          </TabsContent>
          <TabsContent value="discussions">
            <CommunityDiscussions />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
