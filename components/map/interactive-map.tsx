"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin, Crosshair, Layers } from "lucide-react"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Erlebnis } from "@/lib/mock-data"

interface Coordinates {
  lat: number
  lng: number
}

interface InteractiveMapProps {
  initialCoordinates?: Coordinates
  onLocationSelect?: (location: { coordinates: Coordinates; address: string }) => void
  height?: string
  erlebnisse?: Erlebnis[]
}

export function InteractiveMap({
  initialCoordinates,
  onLocationSelect,
  height = "600px",
  erlebnisse = [],
}: InteractiveMapProps) {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(initialCoordinates || null)
  const [address, setAddress] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingMap, setIsLoadingMap] = useState<boolean>(true)
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap")
  const [error, setError] = useState<string | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const isOnline = useOnlineStatus()
  const prevCoordinatesRef = useRef<Coordinates | null>(null)
  const [selectedUmkreis, setSelectedUmkreis] = useState<number>(50) // Default umkreis

  // Aktualisiere die Koordinaten, wenn sich initialCoordinates ändert
  useEffect(() => {
    if (initialCoordinates) {
      setCoordinates(initialCoordinates)
    }
  }, [initialCoordinates])

  // Simuliere das Laden der Karte
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingMap(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Simuliere die Initialisierung der Karte
  useEffect(() => {
    if (!isLoadingMap && mapContainerRef.current) {
      // In einer echten Implementierung würde hier die Karte initialisiert werden
      // z.B. mit Leaflet oder Google Maps
      console.log("Karte initialisiert")

      // Setze Standardkoordinaten, falls keine vorhanden sind
      if (!coordinates) {
        // Berlin als Standardposition
        setCoordinates({ lat: 52.520008, lng: 13.404954 })
      }
    }
  }, [isLoadingMap, coordinates])

  // Simuliere das Reverse Geocoding
  useEffect(() => {
    if (coordinates) {
      // In einer echten Implementierung würde hier ein API-Aufruf für Reverse Geocoding erfolgen
      const simulatedAddress = `Simulierte Adresse bei ${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`
      setAddress(simulatedAddress)

      // Wichtig: Nur beim ersten Mal oder bei tatsächlicher Änderung der Koordinaten den Parent informieren
      // Wir verwenden eine Referenz, um den vorherigen Wert zu speichern
      if (
        onLocationSelect &&
        (!prevCoordinatesRef.current ||
          prevCoordinatesRef.current.lat !== coordinates.lat ||
          prevCoordinatesRef.current.lng !== coordinates.lng)
      ) {
        // Informiere den Parent über die Auswahl
        onLocationSelect({
          coordinates,
          address: simulatedAddress,
        })

        // Aktualisiere die Referenz
        prevCoordinatesRef.current = { ...coordinates }
      }
    }
  }, [coordinates, onLocationSelect])

  // Funktion zum Setzen eines Markers auf der Karte
  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return

    const rect = mapContainerRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Simuliere Koordinatenberechnung basierend auf Klickposition
    // In einer echten Implementierung würden hier die tatsächlichen Geokoordinaten berechnet
    const newLat = 52.52 + (y - rect.height / 2) / 10000
    const newLng = 13.4 + (x - rect.width / 2) / 10000

    setCoordinates({ lat: newLat, lng: newLng })
  }

  // Funktion zum Ermitteln des aktuellen Standorts
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation wird von deinem Browser nicht unterstützt.")
      return
    }

    setIsLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setCoordinates({ lat: latitude, lng: longitude })
        setIsLoading(false)
      },
      (err) => {
        setError(`Fehler bei der Standortermittlung: ${err.message}`)
        setIsLoading(false)
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    )
  }

  // Funktion zum Wechseln des Kartentyps
  const toggleMapType = () => {
    setMapType(mapType === "roadmap" ? "satellite" : "roadmap")
  }

  // Berechne die Position der Marker für die Erlebnisse
  const getMarkerPosition = (erlebnis: Erlebnis) => {
    if (erlebnis.ort && erlebnis.ort.koordinaten) {
      return {
        left: `${50 + (erlebnis.ort.koordinaten.lng - 13.4) * 10000}px`,
        top: `${50 + (erlebnis.ort.koordinaten.lat - 52.52) * 10000}px`,
      }
    }

    // Fallback für Erlebnisse ohne Koordinaten
    return {
      left: "50%",
      top: "50%",
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button
            onClick={handleGetCurrentLocation}
            disabled={isLoading || !isOnline}
            className="bg-primary hover:bg-primary/80 text-white"
            aria-label="Meinen Standort verwenden"
          >
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Crosshair className="h-4 w-4 mr-2" />}
            Meinen Standort verwenden
          </Button>
          <Button
            onClick={toggleMapType}
            variant="outline"
            className="bg-white/5 border-white/20 text-white"
            aria-label={`Zu ${mapType === "roadmap" ? "Satellitenansicht" : "Straßenansicht"} wechseln`}
          >
            <Layers className="h-4 w-4 mr-2" />
            {mapType === "roadmap" ? "Satellit" : "Straße"}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-900/50 border-red-800 text-white">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isOnline && (
        <Alert className="bg-yellow-900/30 border-yellow-800 text-white">
          <AlertDescription>
            Du bist offline. Du kannst manuell einen Punkt auf der Karte setzen, aber die genaue Adresse wird erst
            ermittelt, wenn du wieder online bist.
          </AlertDescription>
        </Alert>
      )}

      <div
        ref={mapContainerRef}
        onClick={handleMapClick}
        className={`relative w-full rounded-md overflow-hidden border border-white/20 bg-slate-800`}
        style={{ height }}
        role="application"
        aria-label="Interaktive Karte zur Ortsauswahl"
      >
        {isLoadingMap ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-white">Karte wird geladen...</span>
          </div>
        ) : (
          <>
            {/* Simulierte Kartenansicht */}
            <div
              className={`absolute inset-0 ${
                mapType === "roadmap" ? "bg-slate-700" : "bg-slate-900"
              } grid grid-cols-6 grid-rows-6`}
            >
              {Array.from({ length: 36 }).map((_, i) => (
                <div
                  key={i}
                  className={`border ${mapType === "roadmap" ? "border-slate-600" : "border-slate-800"} opacity-30`}
                ></div>
              ))}
            </div>

            {/* Simulierte Straßen */}
            {mapType === "roadmap" && (
              <>
                <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-slate-500/50"></div>
                <div className="absolute right-1/3 top-0 bottom-0 w-1 bg-slate-500/50"></div>
                <div className="absolute top-1/3 left-0 right-0 h-1 bg-slate-500/50"></div>
                <div className="absolute bottom-1/4 left-0 right-0 h-1 bg-slate-500/50"></div>
              </>
            )}

            {/* Simulierte Gebäude/Strukturen */}
            {mapType === "roadmap" ? (
              <>
                <div className="absolute left-1/5 top-1/4 w-12 h-8 bg-slate-600/70 rounded-sm"></div>
                <div className="absolute right-1/4 bottom-1/3 w-16 h-10 bg-slate-600/70 rounded-sm"></div>
                <div className="absolute left-1/3 bottom-1/5 w-10 h-14 bg-slate-600/70 rounded-sm"></div>
              </>
            ) : (
              <>
                <div className="absolute left-1/5 top-1/4 w-12 h-8 bg-slate-700/40 rounded-sm"></div>
                <div className="absolute right-1/4 bottom-1/3 w-16 h-10 bg-slate-700/40 rounded-sm"></div>
                <div className="absolute left-1/3 bottom-1/5 w-10 h-14 bg-slate-700/40 rounded-sm"></div>
              </>
            )}

            {/* Marker für Erlebnisse */}
            {erlebnisse &&
              erlebnisse.length > 0 &&
              erlebnisse.map((erlebnis) => {
                // Prüfe, ob das Erlebnis einen Ort mit Koordinaten hat
                if (!erlebnis.ort || !erlebnis.ort.koordinaten) return null

                const markerPosition = getMarkerPosition(erlebnis)

                return (
                  <div
                    key={erlebnis.id}
                    className="absolute transform -translate-x-1/2 -translate-y-full"
                    style={{
                      left: markerPosition.left,
                      top: markerPosition.top,
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <MapPin
                        className="h-6 w-6 text-red-500 drop-shadow-md"
                        style={{
                          color: erlebnis.kategorie.farbe,
                        }}
                      />
                      <div className="mt-1 px-2 py-1 bg-slate-900/80 text-white text-xs rounded-md max-w-[150px] truncate">
                        {erlebnis.titel}
                      </div>
                    </div>
                  </div>
                )
              })}

            {/* Marker für ausgewählten Standort */}
            {coordinates && !onLocationSelect && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-full"
                style={{
                  left: `${50 + (coordinates.lng - 13.4) * 10000}px`,
                  top: `${50 + (coordinates.lat - 52.52) * 10000}px`,
                }}
                aria-label={`Markierter Standort: ${address}`}
              >
                <div className="flex flex-col items-center">
                  <MapPin className="h-8 w-8 text-blue-500 drop-shadow-md" />
                  <div className="mt-1 px-2 py-1 bg-slate-900/80 text-white text-xs rounded-md max-w-[150px] truncate">
                    {address}
                  </div>
                </div>
              </div>
            )}

            {/* Umkreis um den ausgewählten Standort */}
            {coordinates && (
              <div
                className="absolute rounded-full border-2 border-blue-500/50 bg-blue-500/10"
                style={{
                  left: `${50 + (coordinates.lng - 13.4) * 10000}px`,
                  top: `${50 + (coordinates.lat - 52.52) * 10000}px`,
                  width: `${selectedUmkreis * 2}px`,
                  height: `${selectedUmkreis * 2}px`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}

            {/* Hinweis zum Klicken */}
            {!coordinates && !erlebnisse?.length && (
              <div className="absolute inset-0 flex items-center justify-center text-white/70 pointer-events-none">
                <p className="text-center bg-slate-900/50 p-2 rounded-md">
                  Klicke auf die Karte, um einen Standort auszuwählen
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {coordinates && !onLocationSelect && (
        <div className="text-sm text-gray-300">
          <p>
            <span className="font-medium">Ausgewählter Ort:</span> {address}
          </p>
          <p className="text-xs text-gray-400">
            Koordinaten: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
          </p>
        </div>
      )}

      {erlebnisse && erlebnisse.length > 0 && (
        <div className="text-sm text-gray-300">
          <p>
            <span className="font-medium">Angezeigte Erlebnisse:</span> {erlebnisse.length}
          </p>
          <p className="text-xs text-gray-400">Klicke auf einen Marker, um Details zum Erlebnis anzuzeigen.</p>
        </div>
      )}
    </div>
  )
}
