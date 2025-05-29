"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface OfflineData {
  id: string
  type: "experience" | "comment" | "like"
  data: any
  timestamp: number
}

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingSync, setPendingSync] = useState<OfflineData[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Online/Offline Status überwachen
    const handleOnline = () => {
      setIsOnline(true)
      syncPendingData()
      toast({
        title: "Verbindung wiederhergestellt",
        description: "Deine Daten werden synchronisiert.",
      })
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast({
        title: "Offline-Modus",
        description: "Deine Änderungen werden gespeichert und später synchronisiert.",
        variant: "destructive",
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Lade ausstehende Synchronisationen
    loadPendingSync()

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const loadPendingSync = () => {
    const saved = localStorage.getItem("xp-share-offline-sync")
    if (saved) {
      setPendingSync(JSON.parse(saved))
    }
  }

  const addToSync = (data: Omit<OfflineData, "timestamp">) => {
    const newItem: OfflineData = {
      ...data,
      timestamp: Date.now(),
    }

    const updated = [...pendingSync, newItem]
    setPendingSync(updated)
    localStorage.setItem("xp-share-offline-sync", JSON.stringify(updated))
  }

  const syncPendingData = async () => {
    if (pendingSync.length === 0) return

    try {
      // Hier würde die tatsächliche Synchronisation mit dem Server stattfinden
      for (const item of pendingSync) {
        await syncItem(item)
      }

      setPendingSync([])
      localStorage.removeItem("xp-share-offline-sync")

      toast({
        title: "Synchronisation abgeschlossen",
        description: `${pendingSync.length} Elemente wurden synchronisiert.`,
      })
    } catch (error) {
      toast({
        title: "Synchronisation fehlgeschlagen",
        description: "Einige Daten konnten nicht synchronisiert werden.",
        variant: "destructive",
      })
    }
  }

  const syncItem = async (item: OfflineData) => {
    // Mock-Implementierung für Synchronisation
    return new Promise((resolve) => setTimeout(resolve, 100))
  }

  return {
    isOnline,
    pendingSync: pendingSync.length,
    addToSync,
    syncPendingData,
  }
}
