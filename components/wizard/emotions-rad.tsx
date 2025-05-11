"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

// Emotionen-Datenstruktur nach Gloria Willcox' Feeling Wheel (1982)
type EmotionsKategorie = {
  id: string
  name: string
  farbe: string
  mittlereEmotionen: { id: string; name: string }[]
  äußereEmotionen: { id: string; name: string; mittlereId: string }[]
}

// Deutsche Übersetzung des Feeling Wheel mit 6 Basisgefühlen und 72 Gefühlswörtern
const emotionsKategorien: EmotionsKategorie[] = [
  {
    id: "wütend",
    name: "Wütend",
    farbe: "#e11d48", // Rot
    mittlereEmotionen: [
      { id: "wütend-kritisch", name: "Kritisch" },
      { id: "wütend-distanziert", name: "Distanziert" },
      { id: "wütend-verärgert", name: "Verärgert" },
    ],
    äußereEmotionen: [
      { id: "wütend-skeptisch", name: "Skeptisch", mittlereId: "wütend-kritisch" },
      { id: "wütend-sarkastisch", name: "Sarkastisch", mittlereId: "wütend-kritisch" },
      { id: "wütend-zynisch", name: "Zynisch", mittlereId: "wütend-kritisch" },
      { id: "wütend-abgelehnt", name: "Abgelehnt", mittlereId: "wütend-distanziert" },
      { id: "wütend-gelangweilt", name: "Gelangweilt", mittlereId: "wütend-distanziert" },
      { id: "wütend-gleichgültig", name: "Gleichgültig", mittlereId: "wütend-distanziert" },
      { id: "wütend-feindselig", name: "Feindselig", mittlereId: "wütend-verärgert" },
      { id: "wütend-frustriert", name: "Frustriert", mittlereId: "wütend-verärgert" },
      { id: "wütend-ungeduldig", name: "Ungeduldig", mittlereId: "wütend-verärgert" },
    ],
  },
  {
    id: "ängstlich",
    name: "Ängstlich",
    farbe: "#65a30d", // Grün
    mittlereEmotionen: [
      { id: "ängstlich-verletzt", name: "Verletzt" },
      { id: "ängstlich-verwirrt", name: "Verwirrt" },
      { id: "ängstlich-besorgt", name: "Besorgt" },
    ],
    äußereEmotionen: [
      { id: "ängstlich-zurückgewiesen", name: "Zurückgewiesen", mittlereId: "ängstlich-verletzt" },
      { id: "ängstlich-bedroht", name: "Bedroht", mittlereId: "ängstlich-verletzt" },
      { id: "ängstlich-unsicher", name: "Unsicher", mittlereId: "ängstlich-verletzt" },
      { id: "ängstlich-verblüfft", name: "Verblüfft", mittlereId: "ängstlich-verwirrt" },
      { id: "ängstlich-skeptisch", name: "Skeptisch", mittlereId: "ängstlich-verwirrt" },
      { id: "ängstlich-durcheinander", name: "Durcheinander", mittlereId: "ängstlich-verwirrt" },
      { id: "ängstlich-ängstlich", name: "Ängstlich", mittlereId: "ängstlich-besorgt" },
      { id: "ängstlich-hilflos", name: "Hilflos", mittlereId: "ängstlich-besorgt" },
      { id: "ängstlich-nervös", name: "Nervös", mittlereId: "ängstlich-besorgt" },
    ],
  },
  {
    id: "traurig",
    name: "Traurig",
    farbe: "#2563eb", // Blau
    mittlereEmotionen: [
      { id: "traurig-einsam", name: "Einsam" },
      { id: "traurig-verzweifelt", name: "Verzweifelt" },
      { id: "traurig-deprimiert", name: "Deprimiert" },
    ],
    äußereEmotionen: [
      { id: "traurig-isoliert", name: "Isoliert", mittlereId: "traurig-einsam" },
      { id: "traurig-verlassen", name: "Verlassen", mittlereId: "traurig-einsam" },
      { id: "traurig-ausgeschlossen", name: "Ausgeschlossen", mittlereId: "traurig-einsam" },
      { id: "traurig-hoffnungslos", name: "Hoffnungslos", mittlereId: "traurig-verzweifelt" },
      { id: "traurig-machtlos", name: "Machtlos", mittlereId: "traurig-verzweifelt" },
      { id: "traurig-traurig", name: "Traurig", mittlereId: "traurig-verzweifelt" },
      { id: "traurig-schuldig", name: "Schuldig", mittlereId: "traurig-deprimiert" },
      { id: "traurig-beschämt", name: "Beschämt", mittlereId: "traurig-deprimiert" },
      { id: "traurig-wertlos", name: "Wertlos", mittlereId: "traurig-deprimiert" },
    ],
  },
  {
    id: "kraftvoll",
    name: "Kraftvoll",
    farbe: "#eab308", // Gelb
    mittlereEmotionen: [
      { id: "kraftvoll-selbstbewusst", name: "Selbstbewusst" },
      { id: "kraftvoll-inspiriert", name: "Inspiriert" },
      { id: "kraftvoll-hoffnungsvoll", name: "Hoffnungsvoll" },
    ],
    äußereEmotionen: [
      { id: "kraftvoll-stark", name: "Stark", mittlereId: "kraftvoll-selbstbewusst" },
      { id: "kraftvoll-mutig", name: "Mutig", mittlereId: "kraftvoll-selbstbewusst" },
      { id: "kraftvoll-stolz", name: "Stolz", mittlereId: "kraftvoll-selbstbewusst" },
      { id: "kraftvoll-kreativ", name: "Kreativ", mittlereId: "kraftvoll-inspiriert" },
      { id: "kraftvoll-enthusiastisch", name: "Enthusiastisch", mittlereId: "kraftvoll-inspiriert" },
      { id: "kraftvoll-begeistert", name: "Begeistert", mittlereId: "kraftvoll-inspiriert" },
      { id: "kraftvoll-optimistisch", name: "Optimistisch", mittlereId: "kraftvoll-hoffnungsvoll" },
      { id: "kraftvoll-offen", name: "Offen", mittlereId: "kraftvoll-hoffnungsvoll" },
      { id: "kraftvoll-positiv", name: "Positiv", mittlereId: "kraftvoll-hoffnungsvoll" },
    ],
  },
  {
    id: "friedlich",
    name: "Friedlich",
    farbe: "#a855f7", // Violett
    mittlereEmotionen: [
      { id: "friedlich-liebevoll", name: "Liebevoll" },
      { id: "friedlich-dankbar", name: "Dankbar" },
      { id: "friedlich-vertrauensvoll", name: "Vertrauensvoll" },
    ],
    äußereEmotionen: [
      { id: "friedlich-akzeptierend", name: "Akzeptierend", mittlereId: "friedlich-liebevoll" },
      { id: "friedlich-mitfühlend", name: "Mitfühlend", mittlereId: "friedlich-liebevoll" },
      { id: "friedlich-liebend", name: "Liebend", mittlereId: "friedlich-liebevoll" },
      { id: "friedlich-wertschätzend", name: "Wertschätzend", mittlereId: "friedlich-dankbar" },
      { id: "friedlich-achtsam", name: "Achtsam", mittlereId: "friedlich-dankbar" },
      { id: "friedlich-demütig", name: "Demütig", mittlereId: "friedlich-dankbar" },
      { id: "friedlich-zuversichtlich", name: "Zuversichtlich", mittlereId: "friedlich-vertrauensvoll" },
      { id: "friedlich-gelassen", name: "Gelassen", mittlereId: "friedlich-vertrauensvoll" },
      { id: "friedlich-sicher", name: "Sicher", mittlereId: "friedlich-vertrauensvoll" },
    ],
  },
  {
    id: "freudig",
    name: "Freudig",
    farbe: "#f97316", // Orange
    mittlereEmotionen: [
      { id: "freudig-glücklich", name: "Glücklich" },
      { id: "freudig-verspielt", name: "Verspielt" },
      { id: "freudig-zufrieden", name: "Zufrieden" },
    ],
    äußereEmotionen: [
      { id: "freudig-freudig", name: "Freudig", mittlereId: "freudig-glücklich" },
      { id: "freudig-aufgeregt", name: "Aufgeregt", mittlereId: "freudig-glücklich" },
      { id: "freudig-energiegeladen", name: "Energiegeladen", mittlereId: "freudig-glücklich" },
      { id: "freudig-amüsiert", name: "Amüsiert", mittlereId: "freudig-verspielt" },
      { id: "freudig-abenteuerlustig", name: "Abenteuerlustig", mittlereId: "freudig-verspielt" },
      { id: "freudig-überrascht", name: "Überrascht", mittlereId: "freudig-verspielt" },
      { id: "freudig-entspannt", name: "Entspannt", mittlereId: "freudig-zufrieden" },
      { id: "freudig-ruhig", name: "Ruhig", mittlereId: "freudig-zufrieden" },
      { id: "freudig-erfüllt", name: "Erfüllt", mittlereId: "freudig-zufrieden" },
    ],
  },
]

// Flache Liste aller Emotionen für einfacheren Zugriff
const alleEmotionen = emotionsKategorien.flatMap((kategorie) => [
  { id: kategorie.id, name: kategorie.name, farbe: kategorie.farbe, typ: "basis", basisId: kategorie.id },
  ...kategorie.mittlereEmotionen.map((emotion) => ({
    id: emotion.id,
    name: emotion.name,
    farbe: kategorie.farbe,
    typ: "mittel",
    basisId: kategorie.id,
  })),
  ...kategorie.äußereEmotionen.map((emotion) => ({
    id: emotion.id,
    name: emotion.name,
    farbe: kategorie.farbe,
    typ: "äußer",
    basisId: kategorie.id,
    mittlereId: emotion.mittlereId,
  })),
])

interface EmotionsRadProps {
  ausgewählteEmotionen: string[]
  onEmotionToggle: (emotion: string) => void
  hideTitle?: boolean
}

export function EmotionsRad({ ausgewählteEmotionen, onEmotionToggle, hideTitle }: EmotionsRadProps) {
  const [hoveredEmotion, setHoveredEmotion] = useState<string | null>(null)

  // Funktion zum Umschalten einer Emotion
  const toggleEmotion = (emotionName: string) => {
    onEmotionToggle(emotionName)
  }

  // Funktion zum Überprüfen, ob eine Emotion ausgewählt ist
  const isEmotionSelected = (emotionName: string) => {
    return ausgewählteEmotionen.includes(emotionName)
  }

  // Berechne den Winkel für ein Segment
  const getSegmentAngle = (index: number, total: number) => {
    return (index * 360) / total
  }

  // Berechne die Position für ein Element im Kreis
  const getPositionOnCircle = (angle: number, radius: number) => {
    const angleInRadians = (angle - 90) * (Math.PI / 180) // -90 um bei 12 Uhr zu starten
    return {
      x: 250 + radius * Math.cos(angleInRadians),
      y: 250 + radius * Math.sin(angleInRadians),
    }
  }

  // Erstelle einen Kreissektor-Pfad
  const createSectorPath = (startAngle: number, endAngle: number, innerRadius: number, outerRadius: number) => {
    const startAngleRad = (startAngle - 90) * (Math.PI / 180)
    const endAngleRad = (endAngle - 90) * (Math.PI / 180)

    const innerStart = {
      x: 250 + innerRadius * Math.cos(startAngleRad),
      y: 250 + innerRadius * Math.sin(startAngleRad),
    }

    const innerEnd = {
      x: 250 + innerRadius * Math.cos(endAngleRad),
      y: 250 + innerRadius * Math.sin(endAngleRad),
    }

    const outerStart = {
      x: 250 + outerRadius * Math.cos(startAngleRad),
      y: 250 + outerRadius * Math.sin(startAngleRad),
    }

    const outerEnd = {
      x: 250 + outerRadius * Math.cos(endAngleRad),
      y: 250 + outerRadius * Math.sin(endAngleRad),
    }

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

    return `
      M ${innerStart.x} ${innerStart.y}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerEnd.x} ${innerEnd.y}
      L ${outerEnd.x} ${outerEnd.y}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${outerStart.x} ${outerStart.y}
      Z
    `
  }

  return (
    <div className="mt-6 space-y-4">
      {!hideTitle && (
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-medium">Wie hast du dich gefühlt?</h4>
          <p className="text-sm text-gray-400">Wähle beliebig viele Emotionen aus</p>
        </div>
      )}

      <div className="flex justify-center mb-4 overflow-hidden">
        <div className="relative w-full max-w-xl">
          <svg viewBox="0 0 500 500" className="w-full h-auto" style={{ maxHeight: "70vh" }}>
            {/* Hintergrund */}
            <circle cx="250" cy="250" r="240" fill="#1a1a1a" />

            {/* Innerer Kreis */}
            <circle cx="250" cy="250" r="60" fill="#222" stroke="#333" strokeWidth="1" />
            <text x="250" y="250" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="16px">
              Emotionen
            </text>

            {/* Basis-Emotionen (innerer Ring) */}
            {emotionsKategorien.map((kategorie, index) => {
              const segmentAngle = 360 / emotionsKategorien.length
              const startAngle = index * segmentAngle
              const endAngle = (index + 1) * segmentAngle

              // Erstelle den Pfad für das Segment
              const path = createSectorPath(startAngle, endAngle, 60, 120)

              // Berechne die Position für den Text
              const textPosition = getPositionOnCircle(startAngle + segmentAngle / 2, 90)

              // Bestimme die Farbe basierend auf dem Auswahlstatus
              const fillColor = isEmotionSelected(kategorie.name)
                ? kategorie.farbe
                : hoveredEmotion === kategorie.name
                  ? `${kategorie.farbe}80` // 50% Transparenz
                  : `${kategorie.farbe}60` // 40% Transparenz

              return (
                <g key={kategorie.id} onClick={() => toggleEmotion(kategorie.name)} style={{ cursor: "pointer" }}>
                  <path
                    d={path}
                    fill={fillColor}
                    stroke="#333"
                    strokeWidth="1"
                    onMouseEnter={() => setHoveredEmotion(kategorie.name)}
                    onMouseLeave={() => setHoveredEmotion(null)}
                  />
                  <text
                    x={textPosition.x}
                    y={textPosition.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="14px"
                    style={{
                      pointerEvents: "none",
                      fontWeight: isEmotionSelected(kategorie.name) ? "bold" : "normal",
                    }}
                  >
                    {kategorie.name}
                  </text>
                </g>
              )
            })}

            {/* Mittlere Emotionen (mittlerer Ring) */}
            {emotionsKategorien.map((kategorie, kategorieIndex) => {
              const basisSegmentAngle = 360 / emotionsKategorien.length
              const basisStartAngle = kategorieIndex * basisSegmentAngle

              return kategorie.mittlereEmotionen.map((emotion, emotionIndex) => {
                const mittlereSegmentAngle = basisSegmentAngle / kategorie.mittlereEmotionen.length
                const startAngle = basisStartAngle + emotionIndex * mittlereSegmentAngle
                const endAngle = basisStartAngle + (emotionIndex + 1) * mittlereSegmentAngle

                // Erstelle den Pfad für das Segment
                const path = createSectorPath(startAngle, endAngle, 120, 180)

                // Berechne die Position für den Text
                const textPosition = getPositionOnCircle(startAngle + mittlereSegmentAngle / 2, 150)

                // Bestimme die Farbe basierend auf dem Auswahlstatus
                const fillColor = isEmotionSelected(emotion.name)
                  ? kategorie.farbe
                  : hoveredEmotion === emotion.name
                    ? `${kategorie.farbe}70` // 45% Transparenz
                    : `${kategorie.farbe}50` // 30% Transparenz

                return (
                  <g key={emotion.id} onClick={() => toggleEmotion(emotion.name)} style={{ cursor: "pointer" }}>
                    <path
                      d={path}
                      fill={fillColor}
                      stroke="#333"
                      strokeWidth="1"
                      onMouseEnter={() => setHoveredEmotion(emotion.name)}
                      onMouseLeave={() => setHoveredEmotion(null)}
                    />
                    <text
                      x={textPosition.x}
                      y={textPosition.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="12px"
                      style={{
                        pointerEvents: "none",
                        fontWeight: isEmotionSelected(emotion.name) ? "bold" : "normal",
                      }}
                    >
                      {emotion.name}
                    </text>
                  </g>
                )
              })
            })}

            {/* Äußere Emotionen (äußerer Ring) */}
            {emotionsKategorien.map((kategorie, kategorieIndex) => {
              const basisSegmentAngle = 360 / emotionsKategorien.length
              const basisStartAngle = kategorieIndex * basisSegmentAngle

              return kategorie.mittlereEmotionen.map((mittlereEmotion, mittlereIndex) => {
                const mittlereSegmentAngle = basisSegmentAngle / kategorie.mittlereEmotionen.length
                const mittlereStartAngle = basisStartAngle + mittlereIndex * mittlereSegmentAngle

                const äußereEmotionen = kategorie.äußereEmotionen.filter((e) => e.mittlereId === mittlereEmotion.id)

                return äußereEmotionen.map((emotion, emotionIndex) => {
                  const äußereSegmentAngle = mittlereSegmentAngle / äußereEmotionen.length
                  const startAngle = mittlereStartAngle + emotionIndex * äußereSegmentAngle
                  const endAngle = mittlereStartAngle + (emotionIndex + 1) * äußereSegmentAngle

                  // Erstelle den Pfad für das Segment
                  const path = createSectorPath(startAngle, endAngle, 180, 240)

                  // Berechne die Position für den Text
                  const textPosition = getPositionOnCircle(startAngle + äußereSegmentAngle / 2, 210)

                  // Bestimme die Farbe basierend auf dem Auswahlstatus
                  const fillColor = isEmotionSelected(emotion.name)
                    ? kategorie.farbe
                    : hoveredEmotion === emotion.name
                      ? `${kategorie.farbe}60` // 40% Transparenz
                      : `${kategorie.farbe}40` // 25% Transparenz

                  return (
                    <g key={emotion.id} onClick={() => toggleEmotion(emotion.name)} style={{ cursor: "pointer" }}>
                      <path
                        d={path}
                        fill={fillColor}
                        stroke="#333"
                        strokeWidth="1"
                        onMouseEnter={() => setHoveredEmotion(emotion.name)}
                        onMouseLeave={() => setHoveredEmotion(null)}
                      />
                      <text
                        x={textPosition.x}
                        y={textPosition.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="10px"
                        style={{
                          pointerEvents: "none",
                          fontWeight: isEmotionSelected(emotion.name) ? "bold" : "normal",
                        }}
                      >
                        {emotion.name}
                      </text>
                    </g>
                  )
                })
              })
            })}
          </svg>

          {/* Tooltip für die aktuell ausgewählte Emotion */}
          {hoveredEmotion && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-md text-sm">
              {hoveredEmotion}
            </div>
          )}
        </div>
      </div>

      {/* Ausgewählte Emotionen anzeigen */}
      {ausgewählteEmotionen.length > 0 && (
        <div className="mt-4">
          <p className="text-sm mb-2">Ausgewählte Emotionen:</p>
          <div className="flex flex-wrap gap-2">
            {ausgewählteEmotionen.map((emotionName) => {
              // Finde die Emotion-Daten
              const emotion = alleEmotionen.find((e) => e.name === emotionName)

              return (
                <Badge
                  key={emotionName}
                  className="px-3 py-1 flex items-center gap-1"
                  style={{ backgroundColor: emotion?.farbe || "#666" }}
                >
                  {emotionName}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 text-white hover:bg-white/20 rounded-full"
                    onClick={() => toggleEmotion(emotionName)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
