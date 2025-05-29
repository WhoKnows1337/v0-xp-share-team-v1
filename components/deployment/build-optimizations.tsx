"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { CheckCircle2, XCircle, AlertCircle, Code, Package, Zap } from "lucide-react"

export function BuildOptimizations() {
  const [activeTab, setActiveTab] = useState("bundle")
  const [optimizations, setOptimizations] = useState({
    imageOptimization: true,
    treeShaking: true,
    codeMinification: true,
    bundleSplitting: true,
    lazyLoading: true,
    preloading: true,
    compression: true,
    caching: true,
  })

  // Ändere den Status einer Optimierung
  const toggleOptimization = (key: keyof typeof optimizations) => {
    setOptimizations({ ...optimizations, [key]: !optimizations[key] })
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle>Build-Optimierungen</CardTitle>
        <CardDescription>Konfiguriere die Optimierungen für den Build-Prozess</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="bundle">
              <Package className="h-4 w-4 mr-2" />
              Bundle-Optimierung
            </TabsTrigger>
            <TabsTrigger value="code">
              <Code className="h-4 w-4 mr-2" />
              Code-Optimierung
            </TabsTrigger>
            <TabsTrigger value="performance">
              <Zap className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bundle" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="bundleSplitting"
                  checked={optimizations.bundleSplitting}
                  onCheckedChange={() => toggleOptimization("bundleSplitting")}
                />
                <div className="space-y-1">
                  <Label htmlFor="bundleSplitting" className="font-medium">
                    Bundle-Splitting
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Teilt den Code in kleinere Chunks auf, um das initiale Laden zu beschleunigen.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="treeShaking"
                  checked={optimizations.treeShaking}
                  onCheckedChange={() => toggleOptimization("treeShaking")}
                />
                <div className="space-y-1">
                  <Label htmlFor="treeShaking" className="font-medium">
                    Tree Shaking
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Entfernt ungenutzten Code aus dem Bundle, um die Größe zu reduzieren.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="lazyLoading"
                  checked={optimizations.lazyLoading}
                  onCheckedChange={() => toggleOptimization("lazyLoading")}
                />
                <div className="space-y-1">
                  <Label htmlFor="lazyLoading" className="font-medium">
                    Lazy Loading
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Lädt Komponenten erst, wenn sie benötigt werden, um die initiale Ladezeit zu reduzieren.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="preloading"
                  checked={optimizations.preloading}
                  onCheckedChange={() => toggleOptimization("preloading")}
                />
                <div className="space-y-1">
                  <Label htmlFor="preloading" className="font-medium">
                    Preloading
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Lädt wichtige Ressourcen im Voraus, um die Ladezeit zu verbessern.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 border rounded-md mt-4">
              <h3 className="font-medium mb-2">Bundle-Analyse</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Gesamtgröße</span>
                  <Badge variant="outline">245 KB</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Größte Abhängigkeiten</span>
                  <div className="flex space-x-2">
                    <Badge variant="outline">react (42 KB)</Badge>
                    <Badge variant="outline">next (38 KB)</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Chunks</span>
                  <Badge variant="outline">12</Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="codeMinification"
                  checked={optimizations.codeMinification}
                  onCheckedChange={() => toggleOptimization("codeMinification")}
                />
                <div className="space-y-1">
                  <Label htmlFor="codeMinification" className="font-medium">
                    Code-Minifizierung
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Reduziert die Größe des Codes durch Entfernen von Leerzeichen, Kommentaren und Umbenennung von
                    Variablen.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="imageOptimization"
                  checked={optimizations.imageOptimization}
                  onCheckedChange={() => toggleOptimization("imageOptimization")}
                />
                <div className="space-y-1">
                  <Label htmlFor="imageOptimization" className="font-medium">
                    Bild-Optimierung
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Optimiert Bilder für verschiedene Geräte und Bildschirmgrößen.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="compression"
                  checked={optimizations.compression}
                  onCheckedChange={() => toggleOptimization("compression")}
                />
                <div className="space-y-1">
                  <Label htmlFor="compression" className="font-medium">
                    Kompression
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Komprimiert Ressourcen mit Gzip oder Brotli, um die Übertragungsgröße zu reduzieren.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 border rounded-md mt-4">
              <h3 className="font-medium mb-2">Code-Qualität</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">TypeScript-Typen sind vollständig</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">ESLint-Prüfung bestanden</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">3 Warnungen bei der Prettier-Formatierung</span>
                </div>
                <div className="flex items-center space-x-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">2 zirkuläre Abhängigkeiten gefunden</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="caching"
                  checked={optimizations.caching}
                  onCheckedChange={() => toggleOptimization("caching")}
                />
                <div className="space-y-1">
                  <Label htmlFor="caching" className="font-medium">
                    Caching-Strategien
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Konfiguriert Cache-Header für statische Ressourcen, um wiederholte Downloads zu vermeiden.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 border rounded-md mt-4">
              <h3 className="font-medium mb-2">Performance-Metriken</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">First Contentful Paint</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    0.8s
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Largest Contentful Paint</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    1.2s
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Time to Interactive</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    1.5s
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cumulative Layout Shift</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    0.02
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Blocking Time</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    120ms
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline">Zurücksetzen</Button>
              <Button>Optimierungen anwenden</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
