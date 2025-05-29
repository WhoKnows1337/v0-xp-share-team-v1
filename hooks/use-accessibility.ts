"use client"

import { useState, useEffect } from "react"

interface AccessibilitySettings {
  reduceMotion: boolean
  highContrast: boolean
  fontSize: "small" | "medium" | "large"
  screenReader: boolean
}

export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    reduceMotion: false,
    highContrast: false,
    fontSize: "medium",
    screenReader: false,
  })

  useEffect(() => {
    // Lade gespeicherte Einstellungen
    const saved = localStorage.getItem("xp-share-accessibility")
    if (saved) {
      setSettings(JSON.parse(saved))
    }

    // Erkenne System-Präferenzen
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const prefersHighContrast = window.matchMedia("(prefers-contrast: high)").matches

    setSettings((prev) => ({
      ...prev,
      reduceMotion: prefersReducedMotion,
      highContrast: prefersHighContrast,
    }))
  }, [])

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    localStorage.setItem("xp-share-accessibility", JSON.stringify(updated))

    // Wende CSS-Klassen an
    const root = document.documentElement
    root.classList.toggle("reduce-motion", updated.reduceMotion)
    root.classList.toggle("high-contrast", updated.highContrast)
    root.classList.toggle("font-small", updated.fontSize === "small")
    root.classList.toggle("font-large", updated.fontSize === "large")
  }

  return { settings, updateSettings }
}
