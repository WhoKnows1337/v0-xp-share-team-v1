"use client"

import { useState, useEffect, useCallback } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useOnlineStatus } from "@/hooks/use-online-status"
import type { XPEintrag } from "@/types/xp-eintrag"
import { useToast } from "@/hooks/use-toast"

interface OfflineEntry extends XPEintrag {
  _offline?: boolean
  _syncStatus?: "pending" | "syncing" | "synced" | "error"
  _lastModified?: number
}

interface SyncStatus {
  isOnline: boolean
  pendingCount: number
  lastSync?: Date
  isSyncing: boolean
}

export function useOfflineXPSync() {
  const [offlineEntries, setOfflineEntries] = useLocalStorage<OfflineEntry[]>("xp-offline-entries", [])
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: true,
    pendingCount: 0,
    isSyncing: false,
  })
  const isOnline = useOnlineStatus()
  const { toast } = useToast()

  // Aktualisiere den Online-Status
  useEffect(() => {
    setSyncStatus((prev) => ({
      ...prev,
      isOnline,
      pendingCount: offlineEntries.filter((entry) => entry._syncStatus === "pending").length,
    }))
  }, [isOnline, offlineEntries])

  // Speichere Eintrag offline
  const saveOfflineEntry = useCallback(
    (entry: XPEintrag) => {
      const offlineEntry: OfflineEntry = {
        ...entry,
        _offline: true,
        _syncStatus: "pending",
        _lastModified: Date.now(),
      }

      setOfflineEntries((prev) => {
        const existingIndex = prev.findIndex((e) => e.id === entry.id)
        if (existingIndex >= 0) {
          const updated = [...prev]
          updated[existingIndex] = offlineEntry
          return updated
        }
        return [...prev, offlineEntry]
      })

      toast({
        title: "Offline gespeichert",
        description: "Der Eintrag wird synchronisiert, sobald du wieder online bist.",
      })
    },
    [setOfflineEntries, toast],
  )

  // Synchronisiere alle ausstehenden Einträge
  const syncPendingEntries = useCallback(async () => {
    if (!isOnline || syncStatus.isSyncing) return

    const pendingEntries = offlineEntries.filter((entry) => entry._syncStatus === "pending")
    if (pendingEntries.length === 0) return

    setSyncStatus((prev) => ({ ...prev, isSyncing: true }))

    try {
      for (const entry of pendingEntries) {
        // Markiere als "syncing"
        setOfflineEntries((prev) =>
          prev.map((e) => (e.id === entry.id ? { ...e, _syncStatus: "syncing" as const } : e)),
        )

        // Simuliere API-Aufruf
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Simuliere gelegentliche Fehler
        if (Math.random() < 0.1) {
          throw new Error("Sync failed")
        }

        // Markiere als synchronisiert
        setOfflineEntries((prev) =>
          prev.map((e) =>
            e.id === entry.id
              ? {
                  ...e,
                  _syncStatus: "synced" as const,
                  _offline: false,
                }
              : e,
          ),
        )
      }

      // Entferne synchronisierte Einträge nach kurzer Zeit
      setTimeout(() => {
        setOfflineEntries((prev) => prev.filter((entry) => entry._syncStatus !== "synced"))
      }, 2000)

      setSyncStatus((prev) => ({
        ...prev,
        lastSync: new Date(),
        pendingCount: 0,
      }))

      toast({
        title: "Synchronisation abgeschlossen",
        description: `${pendingEntries.length} Einträge wurden synchronisiert.`,
      })
    } catch (error) {
      // Markiere fehlgeschlagene Einträge
      setOfflineEntries((prev) =>
        prev.map((e) => (e._syncStatus === "syncing" ? { ...e, _syncStatus: "error" as const } : e)),
      )

      toast({
        title: "Synchronisation fehlgeschlagen",
        description: "Einige Einträge konnten nicht synchronisiert werden.",
        variant: "destructive",
      })
    } finally {
      setSyncStatus((prev) => ({ ...prev, isSyncing: false }))
    }
  }, [isOnline, offlineEntries, syncStatus.isSyncing, setOfflineEntries, toast])

  // Automatische Synchronisation wenn online
  useEffect(() => {
    if (isOnline && !syncStatus.isSyncing) {
      const timer = setTimeout(syncPendingEntries, 1000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, syncPendingEntries, syncStatus.isSyncing])

  // Lösche fehlgeschlagene Einträge
  const clearFailedEntries = useCallback(() => {
    setOfflineEntries((prev) => prev.filter((entry) => entry._syncStatus !== "error"))
    toast({
      title: "Fehlgeschlagene Einträge gelöscht",
      description: "Die Einträge wurden aus dem Offline-Speicher entfernt.",
    })
  }, [setOfflineEntries, toast])

  // Wiederhole fehlgeschlagene Synchronisation
  const retryFailedSync = useCallback(() => {
    setOfflineEntries((prev) =>
      prev.map((entry) => (entry._syncStatus === "error" ? { ...entry, _syncStatus: "pending" } : entry)),
    )
    syncPendingEntries()
  }, [setOfflineEntries, syncPendingEntries])

  return {
    offlineEntries,
    syncStatus,
    saveOfflineEntry,
    syncPendingEntries,
    clearFailedEntries,
    retryFailedSync,
  }
}
