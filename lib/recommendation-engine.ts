"use client"

import { useEffect } from "react"

import { useState } from "react"

import type { Erlebnis } from "@/types/erlebnis"

interface UserPreferences {
  categories: Record<string, number>
  tags: Record<string, number>
  locations: Record<string, number>
  timeOfDay: Record<string, number>
  interactionHistory: string[]
}

interface RecommendationScore {
  erlebnisId: string
  score: number
  reasons: string[]
}

export class RecommendationEngine {
  private userPreferences: UserPreferences

  constructor(userPreferences: UserPreferences) {
    this.userPreferences = userPreferences
  }

  generateRecommendations(allExperiences: Erlebnis[], userExperiences: Erlebnis[], limit = 10): Erlebnis[] {
    // Filtere bereits gesehene Erlebnisse aus
    const unseenExperiences = allExperiences.filter((exp) => !this.userPreferences.interactionHistory.includes(exp.id))

    // Berechne Scores für alle ungesehenen Erlebnisse
    const scoredExperiences = unseenExperiences.map((experience) => ({
      experience,
      score: this.calculateRecommendationScore(experience, userExperiences),
    }))

    // Sortiere nach Score und gib die besten zurück
    return scoredExperiences
      .sort((a, b) => b.score.score - a.score.score)
      .slice(0, limit)
      .map((item) => item.experience)
  }

  private calculateRecommendationScore(experience: Erlebnis, userExperiences: Erlebnis[]): RecommendationScore {
    let score = 0
    const reasons: string[] = []

    // Kategorie-Präferenz (30% Gewichtung)
    const categoryScore = this.getCategoryScore(experience)
    score += categoryScore * 0.3
    if (categoryScore > 0.5) {
      reasons.push(`Beliebte Kategorie: ${this.getCategoryName(experience.kategorie)}`)
    }

    // Tag-Ähnlichkeit (25% Gewichtung)
    const tagScore = this.getTagScore(experience)
    score += tagScore * 0.25
    if (tagScore > 0.4) {
      reasons.push("Ähnliche Interessen basierend auf Tags")
    }

    // Standort-Präferenz (20% Gewichtung)
    const locationScore = this.getLocationScore(experience)
    score += locationScore * 0.2
    if (locationScore > 0.3) {
      reasons.push(`Beliebter Standort: ${experience.ort}`)
    }

    // Ähnlichkeit zu eigenen Erlebnissen (15% Gewichtung)
    const similarityScore = this.getSimilarityScore(experience, userExperiences)
    score += similarityScore * 0.15
    if (similarityScore > 0.4) {
      reasons.push("Ähnlich zu deinen eigenen Erlebnissen")
    }

    // Popularität und Bewertungen (10% Gewichtung)
    const popularityScore = this.getPopularityScore(experience)
    score += popularityScore * 0.1
    if (popularityScore > 0.7) {
      reasons.push("Sehr beliebt in der Community")
    }

    return {
      erlebnisId: experience.id,
      score: Math.min(score, 1), // Normalisiere auf 0-1
      reasons,
    }
  }

  private getCategoryScore(experience: Erlebnis): number {
    const categoryName = this.getCategoryName(experience.kategorie)
    return this.userPreferences.categories[categoryName] || 0
  }

  private getTagScore(experience: Erlebnis): number {
    if (!experience.tags || experience.tags.length === 0) return 0

    const tagScores = experience.tags.map((tag) => this.userPreferences.tags[tag] || 0)
    return Math.max(...tagScores)
  }

  private getLocationScore(experience: Erlebnis): number {
    if (!experience.ort) return 0
    return this.userPreferences.locations[experience.ort] || 0
  }

  private getSimilarityScore(experience: Erlebnis, userExperiences: Erlebnis[]): number {
    if (userExperiences.length === 0) return 0

    const similarities = userExperiences.map((userExp) => this.calculateExperienceSimilarity(experience, userExp))

    return Math.max(...similarities)
  }

  private calculateExperienceSimilarity(exp1: Erlebnis, exp2: Erlebnis): number {
    let similarity = 0
    let factors = 0

    // Kategorie-Ähnlichkeit
    if (this.getCategoryName(exp1.kategorie) === this.getCategoryName(exp2.kategorie)) {
      similarity += 0.4
    }
    factors += 0.4

    // Tag-Überschneidung
    if (exp1.tags && exp2.tags) {
      const commonTags = exp1.tags.filter((tag) => exp2.tags!.includes(tag))
      const tagSimilarity = commonTags.length / Math.max(exp1.tags.length, exp2.tags.length)
      similarity += tagSimilarity * 0.3
    }
    factors += 0.3

    // Standort-Ähnlichkeit
    if (exp1.ort && exp2.ort && exp1.ort === exp2.ort) {
      similarity += 0.3
    }
    factors += 0.3

    return factors > 0 ? similarity / factors : 0
  }

  private getPopularityScore(experience: Erlebnis): number {
    const likes = experience.bewertungen || 0
    const comments = experience.kommentare?.length || 0

    // Normalisiere basierend auf typischen Werten
    const normalizedLikes = Math.min(likes / 100, 1)
    const normalizedComments = Math.min(comments / 20, 1)

    return (normalizedLikes + normalizedComments) / 2
  }

  private getCategoryName(kategorie: any): string {
    if (typeof kategorie === "string") return kategorie
    if (typeof kategorie === "object" && kategorie?.name) return kategorie.name
    return "Unbekannt"
  }

  updateUserPreferences(interaction: "view" | "like" | "comment" | "share", experience: Erlebnis): void {
    const weight = this.getInteractionWeight(interaction)

    // Update Kategorie-Präferenz
    const categoryName = this.getCategoryName(experience.kategorie)
    this.userPreferences.categories[categoryName] = (this.userPreferences.categories[categoryName] || 0) + weight

    // Update Tag-Präferenzen
    if (experience.tags) {
      experience.tags.forEach((tag) => {
        this.userPreferences.tags[tag] = (this.userPreferences.tags[tag] || 0) + weight * 0.5
      })
    }

    // Update Standort-Präferenz
    if (experience.ort) {
      this.userPreferences.locations[experience.ort] =
        (this.userPreferences.locations[experience.ort] || 0) + weight * 0.3
    }

    // Füge zur Interaktionshistorie hinzu
    if (!this.userPreferences.interactionHistory.includes(experience.id)) {
      this.userPreferences.interactionHistory.push(experience.id)
    }

    // Normalisiere Präferenzen (verhindere unbegrenztes Wachstum)
    this.normalizePreferences()
  }

  private getInteractionWeight(interaction: "view" | "like" | "comment" | "share"): number {
    switch (interaction) {
      case "view":
        return 0.1
      case "like":
        return 0.3
      case "comment":
        return 0.5
      case "share":
        return 0.7
      default:
        return 0.1
    }
  }

  private normalizePreferences(): void {
    // Normalisiere Kategorien
    const maxCategoryScore = Math.max(...Object.values(this.userPreferences.categories))
    if (maxCategoryScore > 10) {
      Object.keys(this.userPreferences.categories).forEach((key) => {
        this.userPreferences.categories[key] /= maxCategoryScore / 10
      })
    }

    // Normalisiere Tags
    const maxTagScore = Math.max(...Object.values(this.userPreferences.tags))
    if (maxTagScore > 5) {
      Object.keys(this.userPreferences.tags).forEach((key) => {
        this.userPreferences.tags[key] /= maxTagScore / 5
      })
    }

    // Begrenze Interaktionshistorie
    if (this.userPreferences.interactionHistory.length > 1000) {
      this.userPreferences.interactionHistory = this.userPreferences.interactionHistory.slice(-1000)
    }
  }
}

// Hook für die Verwendung des Empfehlungsalgorithmus
export function useRecommendations() {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    categories: {},
    tags: {},
    locations: {},
    timeOfDay: {},
    interactionHistory: [],
  })

  const [engine] = useState(() => new RecommendationEngine(userPreferences))

  useEffect(() => {
    // Lade Benutzer-Präferenzen aus localStorage
    const saved = localStorage.getItem("xp-share-user-preferences")
    if (saved) {
      const preferences = JSON.parse(saved)
      setUserPreferences(preferences)
      engine.userPreferences = preferences
    }
  }, [engine])

  const updatePreferences = (interaction: "view" | "like" | "comment" | "share", experience: Erlebnis) => {
    engine.updateUserPreferences(interaction, experience)
    setUserPreferences({ ...engine.userPreferences })

    // Speichere in localStorage
    localStorage.setItem("xp-share-user-preferences", JSON.stringify(engine.userPreferences))
  }

  const getRecommendations = (allExperiences: Erlebnis[], userExperiences: Erlebnis[], limit?: number) => {
    return engine.generateRecommendations(allExperiences, userExperiences, limit)
  }

  return {
    userPreferences,
    updatePreferences,
    getRecommendations,
  }
}
