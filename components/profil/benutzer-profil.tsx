"use client"

import { useState } from "react"
import { ProfilHeader } from "./profil-header"
import { ProfilTabs } from "./profil-tabs"
import { ErlebnisseTab } from "./erlebnisse-tab"
import { KommentareTab } from "./kommentare-tab"
import { LesezeichenTab } from "./lesezeichen-tab"
import { StatistikenTab } from "./statistiken-tab"
import { isCurrentUser } from "@/lib/user-utils"
import type { User } from "@/lib/mock-users"

interface BenutzerProfilProps {
  benutzer?: User
  user?: User // Alternative Prop für Kompatibilität
}

export function BenutzerProfil({ benutzer, user }: BenutzerProfilProps) {
  const [activeTab, setActiveTab] = useState("erlebnisse")

  // Verwende entweder benutzer oder user prop
  const userToDisplay = benutzer || user

  if (!userToDisplay) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Benutzer wurde nicht gefunden.</p>
          <a href="/" className="mt-2 text-sm underline hover:text-red-800">
            Zurück zur Startseite
          </a>
        </div>
      </div>
    )
  }

  const isUserCurrentUser = isCurrentUser(userToDisplay.username)

  return (
    <div className="container mx-auto py-8 px-4">
      <ProfilHeader benutzer={userToDisplay} isCurrentUser={isUserCurrentUser} />

      <div className="mt-8">
        <ProfilTabs activeTab={activeTab} setActiveTab={setActiveTab} isCurrentUser={isUserCurrentUser} />

        <div className="mt-6">
          {activeTab === "erlebnisse" && <ErlebnisseTab benutzer={userToDisplay} isCurrentUser={isUserCurrentUser} />}
          {activeTab === "kommentare" && <KommentareTab benutzer={userToDisplay} />}
          {activeTab === "lesezeichen" && isUserCurrentUser && <LesezeichenTab />}
          {activeTab === "statistiken" && <StatistikenTab benutzer={userToDisplay} />}
        </div>
      </div>
    </div>
  )
}
