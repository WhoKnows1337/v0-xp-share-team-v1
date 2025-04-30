"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ZoomIn,
  ZoomOut,
  Save,
  Trash2,
  Pencil,
  Eraser,
  Square,
  Circle,
  Type,
  Undo,
  Redo,
  Download,
  X,
  Plus,
  Minus,
} from "lucide-react"

export interface WhiteboardImage {
  id: string
  dataUrl: string
  thumbnail: string
  note: string
  name: string
  createdAt: Date
}

interface WhiteboardProps {
  onSave: (image: WhiteboardImage) => void
}

export function Whiteboard({ onSave }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState<"pencil" | "eraser" | "rectangle" | "circle" | "text">("pencil")
  const [color, setColor] = useState("#000000")
  const [lineWidth, setLineWidth] = useState(5)
  const [zoom, setZoom] = useState(1)
  const [note, setNote] = useState("")
  const [imageName, setImageName] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [textInput, setTextInput] = useState("")
  const [textPosition, setTextPosition] = useState<{ x: number; y: number } | null>(null)
  const [showTextInput, setShowTextInput] = useState(false)
  const [viewImage, setViewImage] = useState<WhiteboardImage | null>(null)

  // Initialisiere Canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = 800
    canvas.height = 600

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth

    setContext(ctx)

    // Initialisiere mit weißem Hintergrund
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Speichere den initialen Zustand im History-Stack
    saveToHistory()
  }, [])

  // Aktualisiere Kontext bei Änderungen
  useEffect(() => {
    if (!context) return
    context.strokeStyle = tool === "eraser" ? "white" : color
    context.lineWidth = lineWidth
  }, [context, color, lineWidth, tool])

  // Speichere den aktuellen Canvas-Zustand im History-Stack
  const saveToHistory = () => {
    if (!canvasRef.current) return

    // Schneide die History ab, wenn wir nicht am Ende sind
    const newHistory = history.slice(0, historyIndex + 1)

    // Füge den aktuellen Zustand hinzu
    newHistory.push(canvasRef.current.toDataURL())

    // Begrenze die History-Größe
    if (newHistory.length > 20) {
      newHistory.shift()
    }

    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  // Undo-Funktion
  const handleUndo = () => {
    if (historyIndex <= 0) return

    const newIndex = historyIndex - 1
    setHistoryIndex(newIndex)

    const img = new Image()
    img.src = history[newIndex]
    img.onload = () => {
      if (!context || !canvasRef.current) return
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      context.drawImage(img, 0, 0)
    }
  }

  // Redo-Funktion
  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return

    const newIndex = historyIndex + 1
    setHistoryIndex(newIndex)

    const img = new Image()
    img.src = history[newIndex]
    img.onload = () => {
      if (!context || !canvasRef.current) return
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      context.drawImage(img, 0, 0)
    }
  }

  // Start-Position für Formen
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null)

  // Maus-Event-Handler
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context || !canvasRef.current) return

    setIsDrawing(true)

    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    if (tool === "text") {
      setTextPosition({ x, y })
      setShowTextInput(true)
      return
    }

    context.beginPath()
    context.moveTo(x, y)

    if (tool === "rectangle" || tool === "circle") {
      setStartPos({ x, y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    if (tool === "pencil" || tool === "eraser") {
      context.lineTo(x, y)
      context.stroke()
    } else if (tool === "rectangle" && startPos) {
      // Zeichne Rechteck-Vorschau
      const tempCanvas = document.createElement("canvas")
      tempCanvas.width = canvasRef.current.width
      tempCanvas.height = canvasRef.current.height
      const tempCtx = tempCanvas.getContext("2d")

      if (!tempCtx) return

      // Kopiere den aktuellen Canvas-Zustand
      tempCtx.drawImage(canvasRef.current, 0, 0)

      // Zeichne das neue Rechteck
      tempCtx.strokeStyle = context.strokeStyle
      tempCtx.lineWidth = context.lineWidth
      tempCtx.strokeRect(startPos.x, startPos.y, x - startPos.x, y - startPos.y)

      // Lösche den Canvas und zeichne das Bild
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      context.drawImage(tempCanvas, 0, 0)
    } else if (tool === "circle" && startPos) {
      // Zeichne Kreis-Vorschau
      const tempCanvas = document.createElement("canvas")
      tempCanvas.width = canvasRef.current.width
      tempCanvas.height = canvasRef.current.height
      const tempCtx = tempCanvas.getContext("2d")

      if (!tempCtx) return

      // Kopiere den aktuellen Canvas-Zustand
      tempCtx.drawImage(canvasRef.current, 0, 0)

      // Berechne Radius
      const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2))

      // Zeichne den neuen Kreis
      tempCtx.strokeStyle = context.strokeStyle
      tempCtx.lineWidth = context.lineWidth
      tempCtx.beginPath()
      tempCtx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI)
      tempCtx.stroke()

      // Lösche den Canvas und zeichne das Bild
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      context.drawImage(tempCanvas, 0, 0)
    }
  }

  const handleMouseUp = () => {
    if (!isDrawing || !context) return

    context.closePath()
    setIsDrawing(false)

    if (tool === "rectangle" || tool === "circle") {
      setStartPos(null)
    }

    // Speichere den Zustand im History-Stack
    saveToHistory()
  }

  // Text hinzufügen
  const addText = () => {
    if (!context || !textPosition || !textInput.trim()) return

    context.font = `${lineWidth * 3}px Arial`
    context.fillStyle = color
    context.fillText(textInput, textPosition.x, textPosition.y)

    setTextInput("")
    setShowTextInput(false)
    setTextPosition(null)

    // Speichere den Zustand im History-Stack
    saveToHistory()
  }

  // Zoom-Funktionen
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5))
  }

  // Speichern des Whiteboard-Inhalts
  const handleSave = () => {
    if (!canvasRef.current) return

    // Erstelle ein Thumbnail
    const thumbnailCanvas = document.createElement("canvas")
    thumbnailCanvas.width = 200
    thumbnailCanvas.height = 150
    const thumbnailCtx = thumbnailCanvas.getContext("2d")

    if (!thumbnailCtx) return

    thumbnailCtx.drawImage(canvasRef.current, 0, 0, 200, 150)

    const newImage: WhiteboardImage = {
      id: Date.now().toString(),
      dataUrl: canvasRef.current.toDataURL(),
      thumbnail: thumbnailCanvas.toDataURL(),
      note: note,
      name: imageName || `Whiteboard ${Date.now()}`,
      createdAt: new Date(),
    }

    onSave(newImage)

    // Zurücksetzen der Felder
    setNote("")
    setImageName("")

    // Zurücksetzen des Canvas
    handleClear()
  }

  // Löschen des Canvas-Inhalts
  const handleClear = () => {
    if (!context || !canvasRef.current) return

    context.fillStyle = "white"
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Speichere den Zustand im History-Stack
    saveToHistory()
  }

  // Download des Whiteboard-Inhalts
  const handleDownload = () => {
    if (!canvasRef.current) return

    const link = document.createElement("a")
    link.download = `${imageName || "whiteboard"}.png`
    link.href = canvasRef.current.toDataURL()
    link.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          className={`bg-white/5 border-white/20 ${tool === "pencil" ? "ring-2 ring-primary" : ""}`}
          onClick={() => setTool("pencil")}
          title="Stift"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`bg-white/5 border-white/20 ${tool === "eraser" ? "ring-2 ring-primary" : ""}`}
          onClick={() => setTool("eraser")}
          title="Radierer"
        >
          <Eraser className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`bg-white/5 border-white/20 ${tool === "rectangle" ? "ring-2 ring-primary" : ""}`}
          onClick={() => setTool("rectangle")}
          title="Rechteck"
        >
          <Square className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`bg-white/5 border-white/20 ${tool === "circle" ? "ring-2 ring-primary" : ""}`}
          onClick={() => setTool("circle")}
          title="Kreis"
        >
          <Circle className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`bg-white/5 border-white/20 ${tool === "text" ? "ring-2 ring-primary" : ""}`}
          onClick={() => setTool("text")}
          title="Text"
        >
          <Type className="h-4 w-4" />
        </Button>

        <div className="flex items-center space-x-2 ml-2">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer"
            title="Farbe wählen"
          />
        </div>

        <div className="flex items-center space-x-2 ml-2">
          <Minus className="h-4 w-4 text-gray-400" />
          <Slider
            value={[lineWidth]}
            min={1}
            max={20}
            step={1}
            onValueChange={(value) => setLineWidth(value[0])}
            className="w-24"
          />
          <Plus className="h-4 w-4 text-gray-400" />
        </div>

        <div className="flex items-center space-x-1 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="bg-white/5 border-white/20"
            title="Rückgängig"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="bg-white/5 border-white/20"
            title="Wiederholen"
          >
            <Redo className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="bg-white/5 border-white/20"
            title="Löschen"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            className="bg-white/5 border-white/20"
            title="Vergrößern"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            className="bg-white/5 border-white/20"
            title="Verkleinern"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="bg-white/5 border-white/20"
            title="Herunterladen"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        className="relative border border-white/20 rounded-md overflow-hidden bg-white"
        style={{ height: "400px", width: "100%", overflow: "auto" }}
      >
        <div style={{ transform: `scale(${zoom})`, transformOrigin: "0 0" }}>
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="cursor-crosshair"
          />
        </div>

        {showTextInput && textPosition && (
          <div
            className="absolute bg-slate-800 p-2 rounded-md"
            style={{
              left: textPosition.x * zoom,
              top: textPosition.y * zoom,
            }}
          >
            <div className="flex">
              <Input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Text eingeben..."
                className="bg-white/5 border-white/20 text-white"
                autoFocus
              />
              <Button size="sm" onClick={addText} className="ml-2">
                OK
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowTextInput(false)} className="ml-1">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3 mt-4">
        <div>
          <Label htmlFor="imageName">Name der Zeichnung</Label>
          <Input
            id="imageName"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            placeholder="z.B. Skizze meines Erlebnisses"
            className="bg-white/5 border-white/20 text-white"
          />
        </div>

        <div>
          <Label htmlFor="note">Notiz zur Zeichnung (optional)</Label>
          <Textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Beschreibe deine Zeichnung oder füge Kontext hinzu..."
            className="bg-white/5 border-white/20 text-white"
            rows={3}
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Zeichnung speichern
        </Button>
      </div>

      {/* Dialog für Vollbild-Ansicht */}
      <Dialog open={!!viewImage} onOpenChange={(open) => !open && setViewImage(null)}>
        <DialogContent className="max-w-4xl bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle>{viewImage?.name}</DialogTitle>
          </DialogHeader>

          <div className="bg-white rounded-md overflow-hidden">
            <img
              src={viewImage?.dataUrl || "/placeholder.svg"}
              alt={viewImage?.name}
              className="w-full object-contain"
              style={{ maxHeight: "70vh" }}
            />
          </div>

          {viewImage?.note && (
            <div className="mt-2 p-3 bg-slate-700 rounded-md">
              <h4 className="text-sm font-medium text-gray-300 mb-1">Notiz:</h4>
              <p className="text-white">{viewImage.note}</p>
            </div>
          )}

          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                if (!viewImage) return
                const link = document.createElement("a")
                link.download = `${viewImage.name}.png`
                link.href = viewImage.dataUrl
                link.click()
              }}
              className="bg-white/5 border-white/20"
            >
              <Download className="h-4 w-4 mr-2" />
              Herunterladen
            </Button>
            <Button variant="default" onClick={() => setViewImage(null)}>
              Schließen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Label-Komponente
function Label({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-300 mb-1">
      {children}
    </label>
  )
}
