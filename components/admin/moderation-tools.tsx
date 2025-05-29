"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Flag, Eye, CheckCircle, XCircle, Clock, AlertTriangle, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Report {
  id: string
  type: "experience" | "comment" | "user" | "message"
  reportedBy: {
    id: string
    name: string
    avatar?: string
  }
  reportedContent: {
    id: string
    title: string
    content: string
    author: string
  }
  reason: string
  description: string
  status: "pending" | "reviewed" | "resolved" | "dismissed"
  priority: "low" | "medium" | "high" | "critical"
  createdAt: Date
  reviewedBy?: string
  reviewedAt?: Date
}

interface ModerationAction {
  id: string
  type: "warning" | "suspension" | "ban" | "content_removal"
  targetUser: string
  reason: string
  duration?: number
  createdBy: string
  createdAt: Date
}

export function ModerationTools() {
  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      type: "experience",
      reportedBy: {
        id: "user1",
        name: "Max Mustermann",
        avatar: "/placeholder.svg",
      },
      reportedContent: {
        id: "exp1",
        title: "Unangemessenes Erlebnis",
        content: "Dieses Erlebnis enthält unangemessene Inhalte...",
        author: "ProblemUser",
      },
      reason: "Unangemessener Inhalt",
      description: "Enthält explizite Inhalte, die nicht für alle Altersgruppen geeignet sind.",
      status: "pending",
      priority: "high",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "2",
      type: "comment",
      reportedBy: {
        id: "user2",
        name: "Anna Schmidt",
        avatar: "/placeholder.svg",
      },
      reportedContent: {
        id: "comment1",
        title: "Beleidigender Kommentar",
        content: "Du bist so dumm...",
        author: "TrollUser",
      },
      reason: "Beleidigung",
      description: "Persönliche Angriffe und Beleidigungen gegen andere Nutzer.",
      status: "pending",
      priority: "medium",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
  ])

  const [actions, setActions] = useState<ModerationAction[]>([])
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const { toast } = useToast()

  const handleReportAction = (reportId: string, action: "approve" | "dismiss" | "escalate") => {
    setReports(
      reports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status: action === "approve" ? "resolved" : action === "dismiss" ? "dismissed" : "reviewed",
              reviewedBy: "Admin",
              reviewedAt: new Date(),
            }
          : report,
      ),
    )

    toast({
      title: "Meldung bearbeitet",
      description: `Die Meldung wurde ${action === "approve" ? "bestätigt" : action === "dismiss" ? "abgelehnt" : "eskaliert"}.`,
    })
  }

  const createModerationAction = (
    type: ModerationAction["type"],
    targetUser: string,
    reason: string,
    duration?: number,
  ) => {
    const newAction: ModerationAction = {
      id: Date.now().toString(),
      type,
      targetUser,
      reason,
      duration,
      createdBy: "Admin",
      createdAt: new Date(),
    }

    setActions([newAction, ...actions])

    toast({
      title: "Moderationsaktion erstellt",
      description: `${type} wurde für ${targetUser} erstellt.`,
    })
  }

  const getPriorityColor = (priority: Report["priority"]) => {
    switch (priority) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: Report["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "reviewed":
        return "bg-blue-500"
      case "resolved":
        return "bg-green-500"
      case "dismissed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Moderationstools</h2>
          <p className="text-muted-foreground">Verwalte Meldungen und führe Moderationsaktionen durch</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Shield className="h-4 w-4 mr-2" />
            Auto-Moderation
          </Button>
          <Button variant="outline">
            <Flag className="h-4 w-4 mr-2" />
            Neue Meldung
          </Button>
        </div>
      </div>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">Meldungen</TabsTrigger>
          <TabsTrigger value="actions">Aktionen</TabsTrigger>
          <TabsTrigger value="automod">Auto-Moderation</TabsTrigger>
          <TabsTrigger value="analytics">Statistiken</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Offene Meldungen</CardTitle>
                <Flag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reports.filter((r) => r.status === "pending").length}</div>
                <p className="text-xs text-muted-foreground">+2 seit gestern</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hohe Priorität</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {reports.filter((r) => r.priority === "high" || r.priority === "critical").length}
                </div>
                <p className="text-xs text-muted-foreground">Benötigen sofortige Aufmerksamkeit</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Heute bearbeitet</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+8% gegenüber gestern</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Durchschnittliche Bearbeitungszeit</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4h</div>
                <p className="text-xs text-muted-foreground">-15% gegenüber letzter Woche</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Aktuelle Meldungen</CardTitle>
              <CardDescription>Überprüfe und bearbeite gemeldete Inhalte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(report.priority)}`} />
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(report.status)}`} />
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={report.reportedBy.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{report.reportedBy.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{report.reportedContent.title}</span>
                          <Badge variant="outline">{report.type}</Badge>
                          <Badge variant="outline">{report.reason}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Gemeldet von {report.reportedBy.name} • {report.createdAt.toLocaleString("de-DE")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Meldungsdetails</DialogTitle>
                            <DialogDescription>
                              Überprüfe die gemeldeten Inhalte und triff eine Entscheidung
                            </DialogDescription>
                          </DialogHeader>
                          {selectedReport && <ReportDetailView report={selectedReport} onAction={handleReportAction} />}
                        </DialogContent>
                      </Dialog>
                      {report.status === "pending" && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleReportAction(report.id, "approve")}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Bestätigen
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleReportAction(report.id, "dismiss")}>
                            <XCircle className="h-4 w-4 mr-1" />
                            Ablehnen
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Moderationsaktionen</CardTitle>
              <CardDescription>Übersicht über durchgeführte Moderationsaktionen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {actions.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">Noch keine Moderationsaktionen durchgeführt</p>
                ) : (
                  actions.map((action) => (
                    <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline">{action.type}</Badge>
                        <div>
                          <p className="font-medium">{action.targetUser}</p>
                          <p className="text-sm text-muted-foreground">{action.reason}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{action.createdBy}</p>
                        <p className="text-sm text-muted-foreground">{action.createdAt.toLocaleString("de-DE")}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automod" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Auto-Moderation</CardTitle>
              <CardDescription>Konfiguriere automatische Moderationsregeln</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Spam-Erkennung</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Automatische Erkennung und Entfernung von Spam-Inhalten
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status: Aktiv</span>
                    <Button variant="outline" size="sm">
                      Konfigurieren
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Toxizitäts-Filter</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    KI-gestützte Erkennung von toxischen und beleidigenden Inhalten
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status: Aktiv</span>
                    <Button variant="outline" size="sm">
                      Konfigurieren
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Bildinhalt-Analyse</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Automatische Überprüfung von hochgeladenen Bildern auf unangemessene Inhalte
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status: Inaktiv</span>
                    <Button variant="outline" size="sm">
                      Aktivieren
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Meldungen diese Woche</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">24</div>
                <p className="text-sm text-muted-foreground">+12% gegenüber letzter Woche</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bearbeitungsrate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">95%</div>
                <p className="text-sm text-muted-foreground">Innerhalb von 24h bearbeitet</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Auto-Moderation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">156</div>
                <p className="text-sm text-muted-foreground">Automatisch entfernte Inhalte</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ReportDetailView({
  report,
  onAction,
}: {
  report: Report
  onAction: (reportId: string, action: "approve" | "dismiss" | "escalate") => void
}) {
  const [actionReason, setActionReason] = useState("")

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Gemeldet von</Label>
          <div className="flex items-center space-x-2 mt-1">
            <Avatar className="h-6 w-6">
              <AvatarImage src={report.reportedBy.avatar || "/placeholder.svg"} />
              <AvatarFallback>{report.reportedBy.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{report.reportedBy.name}</span>
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium">Grund</Label>
          <p className="text-sm mt-1">{report.reason}</p>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Beschreibung</Label>
        <p className="text-sm mt-1">{report.description}</p>
      </div>

      <div>
        <Label className="text-sm font-medium">Gemeldeter Inhalt</Label>
        <div className="mt-1 p-3 bg-muted rounded-lg">
          <p className="font-medium text-sm">{report.reportedContent.title}</p>
          <p className="text-sm text-muted-foreground">von {report.reportedContent.author}</p>
          <p className="text-sm mt-2">{report.reportedContent.content}</p>
        </div>
      </div>

      <div>
        <Label htmlFor="actionReason">Begründung für Entscheidung</Label>
        <Textarea
          id="actionReason"
          value={actionReason}
          onChange={(e) => setActionReason(e.target.value)}
          placeholder="Begründe deine Entscheidung..."
          rows={3}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={() => onAction(report.id, "approve")} className="flex-1">
          <CheckCircle className="h-4 w-4 mr-2" />
          Bestätigen
        </Button>
        <Button variant="outline" onClick={() => onAction(report.id, "dismiss")} className="flex-1">
          <XCircle className="h-4 w-4 mr-2" />
          Ablehnen
        </Button>
        <Button variant="destructive" onClick={() => onAction(report.id, "escalate")} className="flex-1">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Eskalieren
        </Button>
      </div>
    </div>
  )
}
