// Simulierte Geocoding-Funktion
// In einer echten Anwendung würde hier eine API wie Google Maps oder OpenStreetMap verwendet werden
export function simulateGeocode(address: string): { lat: number; lng: number } {
  // Simulierte Koordinaten für einige deutsche Städte
  const coordinates: Record<string, { lat: number; lng: number }> = {
    "Berlin, Deutschland": { lat: 52.52, lng: 13.405 },
    "Hamburg, Deutschland": { lat: 53.551, lng: 9.993 },
    "München, Deutschland": { lat: 48.137, lng: 11.576 },
    "Köln, Deutschland": { lat: 50.937, lng: 6.96 },
    "Frankfurt, Deutschland": { lat: 50.11, lng: 8.682 },
    "Stuttgart, Deutschland": { lat: 48.775, lng: 9.182 },
    "Düsseldorf, Deutschland": { lat: 51.227, lng: 6.773 },
    "Leipzig, Deutschland": { lat: 51.339, lng: 12.377 },
    "Dresden, Deutschland": { lat: 51.05, lng: 13.738 },
    "Hannover, Deutschland": { lat: 52.375, lng: 9.732 },
  }

  // Wenn die Adresse bekannt ist, gib die entsprechenden Koordinaten zurück
  if (address in coordinates) {
    return coordinates[address]
  }

  // Ansonsten generiere zufällige Koordinaten in Deutschland
  return {
    lat: 51.165691 + (Math.random() - 0.5) * 5,
    lng: 10.451526 + (Math.random() - 0.5) * 10,
  }
}

// Berechnet die Entfernung zwischen zwei Koordinaten in Kilometern (Haversine-Formel)
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Erdradius in Kilometern
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c
  return d
}

// Hilfsfunktion zur Umrechnung von Grad in Radian
function toRad(value: number): number {
  return (value * Math.PI) / 180
}
