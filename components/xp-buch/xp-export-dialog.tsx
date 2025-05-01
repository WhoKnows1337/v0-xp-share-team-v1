"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, FileText } from "lucide-react"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { useXPBuch } from "@/contexts/xp-buch-context"
import { useToast } from "@/hooks/use-toast"

interface XPExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ExportFormat = "pdf" | "csv"

export function XPExportDialog({ open, onOpenChange }: XPExportDialogProps) {
  const { state } = useXPBuch()
  const { toast } = useToast()
  const [exportFormat, setExportFormat] = useState<ExportFormat>("pdf")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  })
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)

    // Filtere Einträge nach Datumsbereich
    const filteredEntries = state.entries.filter((entry) => {
      const entryDate = new Date(entry.datum)
      if (dateRange.from && dateRange.to) {
        return entryDate >= dateRange.from && entryDate <= dateRange.to
      }
      return true
    })

    // Simuliere Export-Verzögerung
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generiere Dateinamen
    const fileName = `xp-buch-export-${format(new Date(), "yyyy-MM-dd")}.${exportFormat}`

    // In einer echten Anwendung würde hier der tatsächliche Export stattfinden
    // Für PDF: Generiere ein PDF mit jsPDF oder ähnlicher Bibliothek
    // Für CSV: Konvertiere die Einträge in CSV-Format und lade sie herunter

    // Zeige Erfolgsmeldung
    toast({
      title: "Export erfolgreich",
      description: `${filteredEntries.length} Einträge wurden als ${exportFormat.toUpperCase()} exportiert.`,
      duration: 3000,
    })

    setIsExporting(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>XP-Buch exportieren</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Format-Auswahl */}
          <div className="space-y-2">
            <Label>Exportformat</Label>
            <RadioGroup
              value={exportFormat}
              onValueChange={(value) => setExportFormat(value as ExportFormat)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  PDF (Journal-Layout)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  CSV (Tabellenformat)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Zeitraum-Auswahl */}
          <div className="space-y-2">
            <Label>Zeitraum</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Von</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left" disabled={isExporting}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? format(dateRange.from, "PPP", { locale: de }) : <span>Datum wählen</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                      initialFocus
                      locale={de}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Bis</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left" disabled={isExporting}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to ? format(dateRange.to, "PPP", { locale: de }) : <span>Datum wählen</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                      initialFocus
                      locale={de}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Vorschau */}
          <div className="space-y-2">
            <Label>Vorschau</Label>
            <div className="border rounded-md p-4 bg-muted/30">
              <p className="text-sm text-muted-foreground">
                {exportFormat === "pdf"
                  ? "PDF-Export im Journal-Layout mit Einträgen, Stimmungen und Statistiken."
                  : "CSV-Export mit Spalten für Datum, Titel, Inhalt, Tags und Stimmungen."}
              </p>
              <p className="text-sm font-medium mt-2">
                {
                  state.entries.filter((entry) => {
                    const entryDate = new Date(entry.datum)
                    if (dateRange.from && dateRange.to) {
                      return entryDate >= dateRange.from && entryDate <= dateRange.to
                    }
                    return true
                  }).length
                }{" "}
                Einträge werden exportiert
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>
            Abbrechen
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? "Wird exportiert..." : `Als ${exportFormat.toUpperCase()} exportieren`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
