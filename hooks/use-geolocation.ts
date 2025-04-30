"use client"

import { useState } from "react"

interface Coordinates {
  latitude: number
  longitude: number
}

interface GeolocationState {
  coordinates: Coordinates | null
  error: string | null
  loading: boolean
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    loading: false,
  })

  const getPosition = () => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation wird von deinem Browser nicht unterstützt.",
      }))
      return
    }

    setState((prev) => ({ ...prev, loading: true }))

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          error: null,
          loading: false,
        })
      },
      (error) => {
        setState({
          coordinates: null,
          error: `Fehler bei der Standortermittlung: ${error.message}`,
          loading: false,
        })
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    )
  }

  return { ...state, getPosition }
}
