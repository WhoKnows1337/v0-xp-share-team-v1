"use client"

import { useState, useEffect } from "react"

// Hook für die Verwendung von localStorage mit automatischer Serialisierung/Deserialisierung
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // State zum Speichern des aktuellen Werts
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Initialisiere den State beim ersten Rendern
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        const parsedItem = JSON.parse(item)
        setStoredValue(parsedItem)
      }
    } catch (error) {
      console.error(`Fehler beim Laden von ${key} aus localStorage:`, error)
    }
  }, [key])

  // Funktion zum Aktualisieren des Werts im localStorage und im State
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Speichere im State
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)

      // Speichere im localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Fehler beim Speichern von ${key} in localStorage:`, error)
    }
  }

  return [storedValue, setValue]
}
