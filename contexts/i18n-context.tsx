"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { translations, type Locale, type TranslationKey } from "@/lib/i18n/translations"

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("de")

  useEffect(() => {
    // Lade gespeicherte Sprache aus localStorage
    const savedLocale = localStorage.getItem("xp-share-locale") as Locale
    if (savedLocale && (savedLocale === "de" || savedLocale === "en")) {
      setLocale(savedLocale)
    } else {
      // Erkenne Browser-Sprache
      const browserLang = navigator.language.split("-")[0]
      if (browserLang === "en") {
        setLocale("en")
      }
    }
  }, [])

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem("xp-share-locale", newLocale)
    // Aktualisiere HTML lang Attribut
    document.documentElement.lang = newLocale
  }

  const t = (key: TranslationKey): string => {
    return translations[locale][key] || key
  }

  return <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
