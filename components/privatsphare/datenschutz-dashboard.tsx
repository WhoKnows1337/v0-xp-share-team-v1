"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { getPrivacyAuditLogs } from "@/lib/mock-privacy"
import type { PrivacyAuditLog } from "@/types/privacy"
import { Shield, Download, AlertTriangle, Clock, Eye, User, FileText, RefreshCw } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getCurrentUser } from "@/lib/mock-users"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DatenschutzDashboard() {
  const [auditLogs, setAuditLogs] = useState<PrivacyAuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Mock-Daten für das Dashboard
  const [dataStats, setDataStats] = useState({
    totalData: 128, // MB
    publicData: 42, // MB
    privateData: 86, // MB
    dataShared: 35, // MB
    dataRequests: 3,
    dataBreaches: 0,
    lastScan: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 Tage alt
  })

  useEffect(() => {
    loadAuditLogs()
  }, [])

  const loadAuditLogs = async () => {
    setLoading(true)
    try {
      const logs = getPrivacyAuditLogs(getCurrentUser().id, 20)
      setAuditLogs(logs)
    } catch (error) {
      console.error("Fehler beim Laden der Audit-Logs:", error)
      toast({
        title: "Fehler",
        description: "Beim Laden der Datenschutz-Audit-Logs ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await loadAuditLogs()
      toast({
        title: "Aktualisiert",
        description: "Die Datenschutz-Informationen wurden aktualisiert.",
      })
    } catch (error) {
      console.error("Fehler beim Aktualisieren:", error)
    } finally {
      setRefreshing(false)
    }
  }

  const handleExportData = () => {
    // In einer echten Anwendung würde hier ein Datenexport gestartet werden
    toast({
      title: "Datenexport gestartet",
      description: "Deine Daten werden vorbereitet. Du erhältst eine E-Mail, sobald der Export abgeschlossen ist.",
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case "view":
        return "Angesehen"
      case "update":
        return "Aktualisiert"
      case "delete":
        return "Gelöscht"
      case "share":
        return "Geteilt"
      case "access":
        return "Zugegriffen"
      default:
        return action
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "view":
        return <Eye className="h-4 w-4" />
      case "update":
        return <RefreshCw className="h-4 w-4" />
      case "delete":
        return <AlertTriangle className="h-4 w-4" />
      case "share":
        return <User className="h-4 w-4" />
      case "access":
        return <FileText className="h-4 w-4" />
      default:
        return <Eye className="h-4 w-4" />
    }
  }

  const getActionColor = (action: string, success: boolean) => {
    if (!success) return "destructive"

    switch (action) {
      case "view":
        return "default"
      case "update":
        return "default"
      case "delete":
        return "destructive"
      case "share":
        return "default"
      case "access":
        return "default"
      default:
        return "default"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Datenschutz-Dashboard</CardTitle>
        </div>
        <CardDescription>Überwache und verwalte deine Datenschutzeinstellungen und -aktivitäten.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="activity">Aktivitäten</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Datennutzung</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dataStats.totalData} MB</div>
                  <p className="text-xs text-muted-foreground">Gespeicherte Daten</p>

                  <div className="mt-4 space-y-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Öffentlich</span>
                        <span>{Math.round((dataStats.publicData / dataStats.totalData) * 100)}%</span>
                      </div>
                      <Progress value={(dataStats.publicData / dataStats.totalData) * 100} className="h-1" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Privat</span>
                        <span>{Math.round((dataStats.privateData / dataStats.totalData) * 100)}%</span>
                      </div>
                      <Progress value={(dataStats.privateData / dataStats.totalData) * 100} className="h-1" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Geteilt</span>
                        <span>{Math.round((dataStats.dataShared / dataStats.totalData) * 100)}%</span>
                      </div>
                      <Progress value={(dataStats.dataShared / dataStats.totalData) * 100} className="h-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Datenschutz-Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Sicher
                    </Badge>
                    <span className="text-sm">Keine Probleme erkannt</span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Letzte Prüfung</span>
                      <span className="text-muted-foreground">{formatDate(dataStats.lastScan)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Datenzugriffe</span>
                      <span className="text-muted-foreground">{auditLogs.length} in den letzten 30 Tagen</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Datenabfragen</span>
                      <span className="text-muted-foreground">{dataStats.dataRequests} in den letzten 30 Tagen</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Sicherheitsvorfälle</span>
                      <span className="text-muted-foreground">{dataStats.dataBreaches}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Aktionen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={handleExportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Daten exportieren
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={handleRefresh}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                    Datenschutz-Scan
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Daten löschen
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Datenschutz-Tipps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Überprüfe deine Privatsphäre-Einstellungen regelmäßig</h4>
                    <p className="text-sm text-muted-foreground">
                      Stelle sicher, dass deine Privatsphäre-Einstellungen deinen Wünschen entsprechen und überprüfe sie
                      regelmäßig.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Verwende temporäre Freigaben</h4>
                    <p className="text-sm text-muted-foreground">
                      Nutze temporäre Freigaben, um Inhalte zu teilen, anstatt sie dauerhaft öffentlich zu machen.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Überprüfe deine Follower regelmäßig</h4>
                    <p className="text-sm text-muted-foreground">
                      Überprüfe regelmäßig, wer dir folgt, und entferne unerwünschte Follower.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Datenschutz-Aktivitäten</h3>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                Aktualisieren
              </Button>
            </div>

            {loading ? (
              <p className="text-sm text-muted-foreground">Lade Aktivitäten...</p>
            ) : auditLogs.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Keine Aktivitäten</h3>
                <p className="text-sm text-muted-foreground">
                  Es wurden keine Datenschutz-Aktivitäten in den letzten 30 Tagen aufgezeichnet.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[400px] border rounded-md p-4">
                <div className="space-y-4">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                      <div className="bg-primary/10 p-2 rounded-full">{getActionIcon(log.action)}</div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant={log.success ? "default" : "destructive"}>
                              {getActionLabel(log.action)}
                            </Badge>
                            {log.contentType && <Badge variant="outline">{log.contentType}</Badge>}
                          </div>
                          <span className="text-xs text-muted-foreground">{formatDate(log.timestamp)}</span>
                        </div>

                        <p className="text-sm">
                          {log.details || `Aktion: ${log.action} auf ${log.contentType || "unbekanntem Inhalt"}`}
                        </p>

                        <div className="text-xs text-muted-foreground">
                          {log.ipAddress && <span className="mr-2">IP: {log.ipAddress}</span>}
                          {log.userAgent && <span>Agent: {log.userAgent.substring(0, 30)}...</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Aktivitäten exportieren
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col items-start border-t px-6 py-4">
        <h4 className="text-sm font-medium">Über das Datenschutz-Dashboard</h4>
        <p className="text-sm text-muted-foreground mt-1">
          Das Datenschutz-Dashboard gibt dir einen Überblick über deine Daten und Datenschutzaktivitäten. Du kannst hier
          deine Daten exportieren, löschen und Datenschutz-Aktivitäten überwachen.
        </p>
      </CardFooter>
    </Card>
  )
}
