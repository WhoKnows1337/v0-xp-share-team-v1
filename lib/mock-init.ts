import { initializeMockData } from "./mock-data-utils"

// Initialize all mock data
export function initializeMocks() {
  // Initialize and validate mock data
  initializeMockData()

  // Log that mocks are initialized
  console.log("Mock environment initialized")

  // Return true to indicate successful initialization
  return true
}

// Auto-initialize when imported
const initialized = initializeMocks()
export default initialized
