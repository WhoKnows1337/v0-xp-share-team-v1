import type React from "react"
/**
 * Handles image loading errors by providing a fallback
 * @param event The error event from the image
 * @param fallbackSrc Optional custom fallback source
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>, fallbackSrc?: string) => {
  const target = event.target as HTMLImageElement
  const defaultFallback = "/placeholder.svg"

  // If the image is already the fallback, don't try to replace it again
  if (target.src.includes(defaultFallback) || (fallbackSrc && target.src.includes(fallbackSrc))) {
    return
  }

  // Set the fallback image
  target.src = fallbackSrc || defaultFallback

  // Add a class to indicate it's a fallback image
  target.classList.add("fallback-image")
}

/**
 * Creates a placeholder image URL with the specified dimensions and query
 * @param width Width of the placeholder image
 * @param height Height of the placeholder image
 * @param query Description of the image content
 * @returns Placeholder image URL
 */
export const createPlaceholderImage = (width: number, height: number, query: string): string => {
  return `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(query)}`
}

/**
 * Validates if a URL is a valid image URL
 * @param url The URL to validate
 * @returns Promise that resolves to true if valid, false otherwise
 */
export const isValidImageUrl = async (url: string): Promise<boolean> => {
  if (!url) return false

  try {
    const response = await fetch(url, { method: "HEAD" })
    const contentType = response.headers.get("content-type")
    return response.ok && contentType?.startsWith("image/")
  } catch (error) {
    console.error("Error validating image URL:", error)
    return false
  }
}
