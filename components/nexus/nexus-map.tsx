"use client"

import { useRef, useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Flame, Satellite, Network } from "lucide-react"

interface NexusMapProps {
  mode: "pins" | "heatmap" | "radar" | "graph"
  onModeChange: (mode: "pins" | "heatmap" | "radar" | "graph") => void
  filters: string[]
  timeRange: [Date, Date]
}

export function NexusMap({ mode, onModeChange, filters, timeRange }: NexusMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Aktualisiere die Canvas-Dimensionen bei Größenänderungen
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        const { width, height } = canvasRef.current.parentElement.getBoundingClientRect()
        setDimensions({ width, height })
        canvasRef.current.width = width
        canvasRef.current.height = height
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Zeichne die Karte basierend auf dem ausgewählten Modus
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Lösche den Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Zeichne einen einfachen Hintergrund für die Karte
    ctx.fillStyle = "#1a1f2e"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Zeichne ein Gitter für die Karte
    ctx.strokeStyle = "#2a3142"
    ctx.lineWidth = 1
    const gridSize = 50
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Je nach Modus unterschiedliche Visualisierungen zeichnen
    switch (mode) {
      case "pins":
        drawPins(ctx, canvas.width, canvas.height)
        break
      case "heatmap":
        drawHeatmap(ctx, canvas.width, canvas.height)
        break
      case "radar":
        drawRadar(ctx, canvas.width, canvas.height)
        break
      case "graph":
        drawGraph(ctx, canvas.width, canvas.height)
        break
    }
  }, [mode, dimensions, filters, timeRange])

  // Funktion zum Zeichnen von Pins
  const drawPins = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Simuliere einige zufällige Pins
    const pinCount = 50
    ctx.fillStyle = "#00FFFF"
    ctx.strokeStyle = "#00FFFF"

    for (let i = 0; i < pinCount; i++) {
      const x = Math.random() * width
      const y = Math.random() * height

      // Zeichne einen Pin
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()

      // Zeichne einen Glüheffekt
      ctx.globalAlpha = 0.2
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1.0
    }
  }

  // Funktion zum Zeichnen einer Heatmap
  const drawHeatmap = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Erstelle einen Farbverlauf für die Heatmap
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2)
    gradient.addColorStop(0, "rgba(255, 0, 255, 0.8)")
    gradient.addColorStop(0.5, "rgba(255, 0, 255, 0.3)")
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Füge einige "Hot Spots" hinzu
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const radius = 30 + Math.random() * 50

      const hotspot = ctx.createRadialGradient(x, y, 0, x, y, radius)
      hotspot.addColorStop(0, "rgba(255, 200, 0, 0.8)")
      hotspot.addColorStop(1, "rgba(255, 200, 0, 0)")

      ctx.fillStyle = hotspot
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Funktion zum Zeichnen eines Radars
  const drawRadar = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2
    const centerY = height / 2
    const maxRadius = Math.min(width, height) * 0.4

    // Zeichne Radar-Kreise
    ctx.strokeStyle = "#00FFFF"
    ctx.lineWidth = 1

    for (let r = maxRadius / 4; r <= maxRadius; r += maxRadius / 4) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Zeichne Radar-Linien
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(centerX + Math.cos(angle) * maxRadius, centerY + Math.sin(angle) * maxRadius)
      ctx.stroke()
    }

    // Zeichne einen pulsierenden Radar-Strahl
    const now = Date.now()
    const angle = ((now % 5000) / 5000) * Math.PI * 2

    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + Math.cos(angle) * maxRadius, centerY + Math.sin(angle) * maxRadius)
    ctx.strokeStyle = "#00FFFF"
    ctx.lineWidth = 2
    ctx.stroke()

    // Zeichne einen pulsierenden Kreis
    const pulseRadius = ((now % 3000) / 3000) * maxRadius
    ctx.beginPath()
    ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(0, 255, 255, ${1 - pulseRadius / maxRadius})`
    ctx.stroke()

    // Zeichne einige "Echo-Punkte"
    ctx.fillStyle = "#00FFFF"
    for (let i = 0; i < 10; i++) {
      const pointAngle = Math.random() * Math.PI * 2
      const pointRadius = Math.random() * maxRadius
      const x = centerX + Math.cos(pointAngle) * pointRadius
      const y = centerY + Math.sin(pointAngle) * pointRadius

      ctx.beginPath()
      ctx.arc(x, y, 2, 0, Math.PI * 2)
      ctx.fill()

      // Glüheffekt
      ctx.globalAlpha = 0.3
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1.0
    }
  }

  // Funktion zum Zeichnen eines Graphen
  const drawGraph = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Erstelle einige zufällige Knoten für den Graphen
    const nodeCount = 20
    const nodes: Array<{ x: number; y: number }> = []

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: 50 + Math.random() * (width - 100),
        y: 50 + Math.random() * (height - 100),
      })
    }

    // Zeichne Verbindungen zwischen den Knoten
    ctx.strokeStyle = "rgba(255, 0, 255, 0.3)"
    ctx.lineWidth = 1

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        // Nur einige zufällige Verbindungen zeichnen
        if (Math.random() > 0.7) continue

        const distance = Math.sqrt(Math.pow(nodes[i].x - nodes[j].x, 2) + Math.pow(nodes[i].y - nodes[j].y, 2))

        // Nur Verbindungen innerhalb einer bestimmten Entfernung zeichnen
        if (distance < 150) {
          ctx.beginPath()
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(nodes[j].x, nodes[j].y)
          ctx.stroke()
        }
      }
    }

    // Zeichne die Knoten
    for (const node of nodes) {
      // Knoten
      ctx.fillStyle = "#FF00FF"
      ctx.beginPath()
      ctx.arc(node.x, node.y, 4, 0, Math.PI * 2)
      ctx.fill()

      // Glüheffekt
      ctx.globalAlpha = 0.2
      ctx.beginPath()
      ctx.arc(node.x, node.y, 10, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1.0
    }
  }

  // Animationsschleife für kontinuierliche Updates
  useEffect(() => {
    let animationFrameId: number

    const animate = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        if (ctx && mode === "radar") {
          // Nur den Radar-Modus kontinuierlich aktualisieren
          drawRadar(ctx, canvas.width, canvas.height)
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    if (mode === "radar") {
      animate()
    }

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [mode, dimensions])

  return (
    <div className="relative h-full w-full">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Modus-Tabs */}
      <div className="absolute top-4 right-4 z-10">
        <Tabs value={mode} onValueChange={(value) => onModeChange(value as any)}>
          <TabsList className="bg-gray-900/80 backdrop-blur">
            <TabsTrigger value="pins" className="data-[state=active]:text-cyan-400">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="hidden md:inline">Pins</span>
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="data-[state=active]:text-pink-400">
              <Flame className="h-4 w-4 mr-1" />
              <span className="hidden md:inline">Heatmap</span>
            </TabsTrigger>
            <TabsTrigger value="radar" className="data-[state=active]:text-cyan-400">
              <Satellite className="h-4 w-4 mr-1" />
              <span className="hidden md:inline">Radar</span>
            </TabsTrigger>
            <TabsTrigger value="graph" className="data-[state=active]:text-pink-400">
              <Network className="h-4 w-4 mr-1" />
              <span className="hidden md:inline">Graph</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
