// lib/mock-data-utils.ts

import { mockKategorien, mockTags, mockErlebnisse } from "./mock-data"
import { mockUsers } from "./mock-users"

export function initializeMockData() {
  // Basic validation to ensure mock data is present
  if (!mockKategorien || mockKategorien.length === 0) {
    console.warn("Mock categories are missing or empty.")
  }

  if (!mockTags || mockTags.length === 0) {
    console.warn("Mock tags are missing or empty.")
  }

  if (!mockErlebnisse || mockErlebnisse.length === 0) {
    console.warn("Mock erlebnisse are missing or empty.")
  }

  if (!mockUsers || mockUsers.length === 0) {
    console.warn("Mock users are missing or empty.")
  }

  // You can add more complex validation logic here if needed
  // For example, check if all erlebnisse have valid categories and authors
}
