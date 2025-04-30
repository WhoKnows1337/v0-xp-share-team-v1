"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { NachrichtenListe } from "@/components/nachrichten/nachrichten-liste"
import { ChatFenster } from "@/components/nachrichten/chat-fenster"
import { ThemenChannels } from "@/components/nachrichten/themen-channels"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlusCircle, MessageSquare, Hash } from "lucide-react"
import { NeueNachrichtDialog } from "@/components/nachrichten/neue-nachricht-dialog"
import { getCurrentUser, getUserConversations, getConversationMessages, getConversationById } from "@/lib/mock-messages"
import { getMockChatChannels } from "@/lib/mock-messages"

export function NachrichtenUebersicht() {
  const [activeTab, setActiveTab] = useState("direktnachrichten")
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showConversation, setShowConversation] = useState(false)
  const searchParams = useSearchParams()
  const currentUser = getCurrentUser()
  const conversations = getUserConversations(currentUser)
  const channels = getMockChatChannels()

  // Überprüfe, ob ein Konversations-ID in der URL vorhanden ist
  useEffect(() => {
    const id = searchParams.get("id")
    if (id) {
      setSelectedConversationId(id)
      setShowConversation(true)
    }
  }, [searchParams])

  // Überprüfe die Bildschirmgröße
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id)
    if (isMobile) {
      setShowConversation(true)
    }
  }

  const handleBack = () => {
    setShowConversation(false)
  }

  const selectedConversation = selectedConversationId ? getConversationById(selectedConversationId) : null

  const messages = selectedConversationId ? getConversationMessages(selectedConversationId) : []

  // Wenn auf Mobilgeräten eine Konversation angezeigt wird, blende die Liste aus
  if (isMobile && showConversation && selectedConversation) {
    return (
      <div className="h-full">
        <ChatFenster conversation={selectedConversation} messages={messages} onBack={handleBack} />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">Nachrichten</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Neue Nachricht
        </Button>
      </div>

      <Tabs
        defaultValue="direktnachrichten"
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="px-4 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="direktnachrichten" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Direktnachrichten
            </TabsTrigger>
            <TabsTrigger value="channels" className="flex-1">
              <Hash className="h-4 w-4 mr-2" />
              Themen-Channels
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 flex md:flex-row flex-col overflow-hidden">
          <TabsContent value="direktnachrichten" className="flex-1 flex mt-0 h-full">
            <div className={`${selectedConversationId && !isMobile ? "w-1/3 border-r" : "w-full"} h-full`}>
              <NachrichtenListe
                conversations={conversations}
                selectedConversationId={selectedConversationId}
                onSelectConversation={handleSelectConversation}
              />
            </div>

            {selectedConversationId && selectedConversation && !isMobile && (
              <div className="w-2/3 h-full">
                <ChatFenster conversation={selectedConversation} messages={messages} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="channels" className="flex-1 mt-0 h-full">
            <ThemenChannels channels={channels} />
          </TabsContent>
        </div>
      </Tabs>

      <NeueNachrichtDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}
