"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import { getTemporaryAccessForContent, createTemporaryAccess, validateTemporaryAccess } from "@/lib/mock-privacy"
import type { TemporaryAccess, PrivacyPermission } from "@/types/privacy"
import { Clock, Link, Copy, Trash, Check, Share2, Eye, MessageSquare } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

interface TemporareFreigabeProps {
  contentId: string
  contentType: "erlebnis" | "kommentar" | "diskussion" | "xp-eintrag"
}

export function TemporareFreigabe({ contentId, contentType }: TemporareFreigabeProps) {
  const [accessLinks, setAccessLinks] = useState<TemporaryAccess[]>([])
  const [loading, setLoading] = useState(true)
  const [accessCode, setAccessCode] = useState("")
  const [validatingCode, setValidatingCode] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  // Neue Freigabe-Einstellungen
  const [permissions, setPermissions] = useState<PrivacyPermission[]>(["view"])
  const [expiresInDays, setExpiresInDays] = useState(7)
  const [maxUses, setMaxUses] = useState(5)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadAccessLinks()
  }, [contentId, contentType])

  const loadAccessLinks = async () => {
    setLoading(true)
    try {
      const links = getTemporaryAccessForContent(contentId)
      setAccessLinks(links)
    } catch (error) {
      console.error("Fehler beim Laden der temporären Freigaben:", error)
      toast({
        title: "Fehler",
        description: "Beim Laden der temporären Freigaben ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePermissionToggle = (permission: PrivacyPermission) => {
    if (permissions.includes(permission)) {
      setPermissions(permissions.filter((p) => p !== permission))
    } else {
      setPermissions([...permissions, permission])
    }
  }

  const handleCreateLink = async () => {
    if (permissions.length === 0) {
      toast({
        title: "Fehler",
        description: "Bitte wähle mindestens eine Berechtigung aus.",
        variant: "destructive",
      })
      return
    }

    setCreating(true)

    try {
      const newAccess = createTemporaryAccess(contentId, contentType, permissions, expiresInDays, maxUses)

      setAccessLinks([...accessLinks, newAccess])

      toast({
        title: "Freigabe erstellt",
        description: "Der temporäre Zugangslink wurde erfolgreich erstellt.",
      })

      setCreateDialogOpen(false)

      // Zurücksetzen der Formularwerte
      setPermissions(["view"])
      setExpiresInDays(7)
      setMaxUses(5)
    } catch (error) {
      console.error("Fehler beim Erstellen des temporären Zugangs:", error)

      toast({
        title: "Fehler",
        description: "Beim Erstellen des temporären Zugangs ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteLink = (id: string) => {
    // In einer echten Anwendung würde hier eine API-Anfrage gesendet werden
    setAccessLinks(accessLinks.filter((link) => link.id !== id))

    toast({
      title: "Freigabe gelöscht",
      description: "Der temporäre Zugangslink wurde erfolgreich gelöscht.",
    })
  }

  const handleCopyLink = (accessCode: string) => {
    // Erstelle den vollständigen Link
    const baseUrl = window.location.origin
    const shareLink = `${baseUrl}/freigabe/${contentId}?code=${accessCode}`

    navigator.clipboard.writeText(shareLink)

    toast({
      title: "Link kopiert",
      description: "Der Freigabelink wurde in die Zwischenablage kopiert.",
    })
  }

  const handleValidateCode = async () => {
    if (!accessCode.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib einen Zugangscode ein.",
        variant: "destructive",
      })
      return
    }

    setValidatingCode(true)

    try {
      const access = validateTemporaryAccess(contentId, accessCode)

      if (access) {
        toast({
          title: "Zugang gewährt",
          description: "Der Zugangscode ist gültig. Du hast jetzt Zugriff auf diesen Inhalt.",
        })

        setAccessCode("")
      } else {
        toast({
          title: "Ungültiger Code",
          description: "Der eingegebene Zugangscode ist ungültig oder abgelaufen.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Fehler bei der Validierung des Zugangscodes:", error)

      toast({
        title: "Fehler",
        description: "Bei der Validierung des Zugangscodes ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
    } finally {
      setValidatingCode(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getContentTypeLabel = (type: "erlebnis" | "kommentar" | "diskussion" | "xp-eintrag") => {
    switch (type) {
      case "erlebnis":
        return "Erlebnis"
      case "kommentar":
        return "Kommentar"
      case "diskussion":
        return "Diskussion"
      case "xp-eintrag":
        return "XP-Eintrag"
      default:
        return "Inhalt"
    }
  }

  const getPermissionLabel = (permission: PrivacyPermission) => {
    switch (permission) {
      case "view":
        return "Ansehen"
      case "comment":
        return "Kommentieren"
      case "share":
        return "Teilen"
      default:
        return permission
    }
  }

  const getPermissionIcon = (permission: PrivacyPermission) => {
    switch (permission) {
      case "view":
        return <Eye className="h-4 w-4" />
      case "comment":
        return <MessageSquare className="h-4 w-4" />
      case "share":
        return <Share2 className="h-4 w-4" />
      default:
        return null
    }
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  const isMaxUsesReached = (access: TemporaryAccess) => {
    return access.usedCount >= access.maxUses
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <CardTitle>Temporäre Freigaben</CardTitle>
        </div>
        <CardDescription>
          Erstelle temporäre Zugangslinks für {getContentTypeLabel(contentType).toLowerCase()} "{contentId}".
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active">
          <TabsList className="mb-4">
            <TabsTrigger value="active">Aktive Freigaben</TabsTrigger>
            <TabsTrigger value="validate">Zugang einlösen</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {loading ? (
              <p className="text-sm text-muted-foreground">Lade Freigaben...</p>
            ) : accessLinks.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Keine aktiven Freigaben</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Du hast noch keine temporären Zugangslinks für diesen Inhalt erstellt.
                </p>
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Link className="h-4 w-4 mr-2" />
                      Neuen Zugangslink erstellen
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Temporären Zugangslink erstellen</DialogTitle>
                      <DialogDescription>
                        Erstelle einen temporären Link, um diesen Inhalt mit anderen zu teilen.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Berechtigungen</Label>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="permission-view"
                              checked={permissions.includes("view")}
                              onCheckedChange={() => handlePermissionToggle("view")}
                            />
                            <Label htmlFor="permission-view" className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              Ansehen
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="permission-comment"
                              checked={permissions.includes("comment")}
                              onCheckedChange={() => handlePermissionToggle("comment")}
                            />
                            <Label htmlFor="permission-comment" className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              Kommentieren
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="permission-share"
                              checked={permissions.includes("share")}
                              onCheckedChange={() => handlePermissionToggle("share")}
                            />
                            <Label htmlFor="permission-share" className="flex items-center gap-1">
                              <Share2 className="h-4 w-4" />
                              Teilen
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="expires-in">Gültig für</Label>
                          <span className="text-sm font-medium">{expiresInDays} Tage</span>
                        </div>
                        <Slider
                          id="expires-in"
                          value={[expiresInDays]}
                          min={1}
                          max={30}
                          step={1}
                          onValueChange={(value) => setExpiresInDays(value[0])}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>1 Tag</span>
                          <span>7 Tage</span>
                          <span>14 Tage</span>
                          <span>30 Tage</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="max-uses">Maximale Nutzungen</Label>
                          <span className="text-sm font-medium">{maxUses}x</span>
                        </div>
                        <Slider
                          id="max-uses"
                          value={[maxUses]}
                          min={1}
                          max={20}
                          step={1}
                          onValueChange={(value) => setMaxUses(value[0])}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>1x</span>
                          <span>5x</span>
                          <span>10x</span>
                          <span>20x</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="notify-access" />
                        <Label htmlFor="notify-access">Bei Zugriff benachrichtigen</Label>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                        Abbrechen
                      </Button>
                      <Button onClick={handleCreateLink} disabled={creating || permissions.length === 0}>
                        {creating ? "Erstelle..." : "Link erstellen"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="space-y-4">
                {accessLinks.map((access) => (
                  <Card
                    key={access.id}
                    className={`border ${isExpired(access.expiresAt) || isMaxUsesReached(access) ? "border-muted bg-muted/20" : "border-border"}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={isExpired(access.expiresAt) || isMaxUsesReached(access) ? "outline" : "default"}
                          >
                            {isExpired(access.expiresAt)
                              ? "Abgelaufen"
                              : isMaxUsesReached(access)
                                ? "Limit erreicht"
                                : "Aktiv"}
                          </Badge>
                          <span className="text-sm font-medium">Code: {access.accessCode}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyLink(access.accessCode)}
                            disabled={isExpired(access.expiresAt) || isMaxUsesReached(access)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Kopieren
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteLink(access.id)}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Löschen</span>
                          </Button>
                        </div>
                      </div>

                      <Separator className="my-3" />

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Berechtigungen</p>
                          <div className="flex items-center gap-1 mt-1">
                            {access.permissions.map((permission) => (
                              <Badge key={permission} variant="secondary" className="mr-1">
                                <span className="flex items-center gap-1">
                                  {getPermissionIcon(permission)}
                                  {getPermissionLabel(permission)}
                                </span>
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-muted-foreground">Gültig bis</p>
                          <p className="font-medium mt-1">{formatDate(access.expiresAt)}</p>
                        </div>

                        <div>
                          <p className="text-muted-foreground">Nutzungen</p>
                          <p className="font-medium mt-1">
                            {access.usedCount} / {access.maxUses}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="flex justify-end">
                  <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Link className="h-4 w-4 mr-2" />
                        Neuen Zugangslink erstellen
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Temporären Zugangslink erstellen</DialogTitle>
                        <DialogDescription>
                          Erstelle einen temporären Link, um diesen Inhalt mit anderen zu teilen.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Berechtigungen</Label>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="permission-view"
                                checked={permissions.includes("view")}
                                onCheckedChange={() => handlePermissionToggle("view")}
                              />
                              <Label htmlFor="permission-view" className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                Ansehen
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="permission-comment"
                                checked={permissions.includes("comment")}
                                onCheckedChange={() => handlePermissionToggle("comment")}
                              />
                              <Label htmlFor="permission-comment" className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                Kommentieren
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="permission-share"
                                checked={permissions.includes("share")}
                                onCheckedChange={() => handlePermissionToggle("share")}
                              />
                              <Label htmlFor="permission-share" className="flex items-center gap-1">
                                <Share2 className="h-4 w-4" />
                                Teilen
                              </Label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="expires-in">Gültig für</Label>
                            <span className="text-sm font-medium">{expiresInDays} Tage</span>
                          </div>
                          <Slider
                            id="expires-in"
                            value={[expiresInDays]}
                            min={1}
                            max={30}
                            step={1}
                            onValueChange={(value) => setExpiresInDays(value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>1 Tag</span>
                            <span>7 Tage</span>
                            <span>14 Tage</span>
                            <span>30 Tage</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="max-uses">Maximale Nutzungen</Label>
                            <span className="text-sm font-medium">{maxUses}x</span>
                          </div>
                          <Slider
                            id="max-uses"
                            value={[maxUses]}
                            min={1}
                            max={20}
                            step={1}
                            onValueChange={(value) => setMaxUses(value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>1x</span>
                            <span>5x</span>
                            <span>10x</span>
                            <span>20x</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch id="notify-access" />
                          <Label htmlFor="notify-access">Bei Zugriff benachrichtigen</Label>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                          Abbrechen
                        </Button>
                        <Button onClick={handleCreateLink} disabled={creating || permissions.length === 0}>
                          {creating ? "Erstelle..." : "Link erstellen"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="validate" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="access-code">Zugangscode eingeben</Label>
                <div className="flex gap-2">
                  <Input
                    id="access-code"
                    placeholder="z.B. ABC123"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                  />
                  <Button onClick={handleValidateCode} disabled={validatingCode || !accessCode.trim()}>
                    {validatingCode ? (
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> Prüfe...
                      </span>
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Gib den Zugangscode ein, den du erhalten hast, um auf diesen Inhalt zuzugreifen.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col items-start border-t px-6 py-4">
        <h4 className="text-sm font-medium">Über temporäre Freigaben</h4>
        <p className="text-sm text-muted-foreground mt-1">
          Temporäre Freigaben ermöglichen es dir, Inhalte mit anderen zu teilen, ohne dass diese ein Konto benötigen.
          Die Links sind zeitlich begrenzt und können nur eine bestimmte Anzahl von Malen verwendet werden.
        </p>
      </CardFooter>
    </Card>
  )
}
