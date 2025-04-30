import { mockErlebnisse, mockKategorien, mockTags } from "./mock-data"
import { mockUsers } from "./mock-users"

/**
 * Validates and fixes all mock experiences to ensure they have all required properties
 */
export function validateAndFixMockData() {
  // Validate and fix each experience
  mockErlebnisse.forEach((erlebnis: any) => {
    // Ensure ID exists
    if (!erlebnis.id) {
      erlebnis.id = `generated-${Math.random().toString(36).substring(2, 9)}`
    }

    // Ensure title exists
    if (!erlebnis.titel) {
      erlebnis.titel = "Untitled Experience"
    }

    // Ensure summary exists
    if (!erlebnis.kurzfassung) {
      erlebnis.kurzfassung = "No summary provided"
    }

    // Ensure date exists
    if (!erlebnis.datum) {
      erlebnis.datum = new Date().toLocaleDateString("de-DE")
    }

    // Ensure category exists
    if (!erlebnis.kategorie) {
      erlebnis.kategorie = mockKategorien[0]
    }

    // Ensure tags exist
    if (!erlebnis.tags || !Array.isArray(erlebnis.tags)) {
      erlebnis.tags = [mockTags[0]]
    }

    // Ensure author exists
    if (!erlebnis.autor) {
      erlebnis.autor = {
        name: mockUsers[0].username,
        avatar: mockUsers[0].avatar,
        isVerifiziert: mockUsers[0].isVerifiziert,
      }
    }

    // Ensure media exists
    if (!erlebnis.medien || !Array.isArray(erlebnis.medien) || erlebnis.medien.length === 0) {
      erlebnis.medien = [
        {
          typ: "bild",
          url: "/abstract-experience.png",
        },
      ]
    }

    // Ensure statistics exist
    if (!erlebnis.statistik) {
      erlebnis.statistik = {
        likes: 0,
        kommentare: 0,
        ansichten: 0,
      }
    } else {
      // Ensure all statistics properties exist
      if (erlebnis.statistik.likes === undefined) erlebnis.statistik.likes = 0
      if (erlebnis.statistik.kommentare === undefined) erlebnis.statistik.kommentare = 0
      if (erlebnis.statistik.ansichten === undefined) erlebnis.statistik.ansichten = 0
    }

    // Ensure status exists
    if (!erlebnis.status) {
      erlebnis.status = "veröffentlicht"
    }

    // Ensure verifiziert property exists
    if (erlebnis.verifiziert === undefined) {
      erlebnis.verifiziert = false
    }
  })

  console.log("Mock data validated and fixed")
}

// Call this function when the app initializes
export function initializeMockData() {
  validateAndFixMockData()
}
