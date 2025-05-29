"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy, Eye, EyeOff, Check } from "lucide-react"

interface EnvVarGroup {
  title: string
  description: string
  variables: {
    name: string
    description: string
    required: boolean
    sensitive?: boolean
    value?: string
  }[]
}

export function EnvironmentVariables() {
  const [activeTab, setActiveTab] = useState("supabase")
  const [showSensitive, setShowSensitive] = useState<Record<string, boolean>>({})
  const [copied, setCopied] = useState<Record<string, boolean>>({})

  // Umgebungsvariablen-Gruppen
  const envVarGroups: EnvVarGroup[] = [
    {
      title: "Supabase",
      description: "Umgebungsvariablen für die Supabase-Integration",
      variables: [
        {
          name: "NEXT_PUBLIC_SUPABASE_URL",
          description: "Die URL deiner Supabase-Instanz",
          required: true,
          value: process.env.NEXT_PUBLIC_SUPABASE_URL,
        },
        {
          name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
          description: "Der anonyme Schlüssel für die Supabase-API",
          required: true,
          sensitive: true,
          value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        },
        {
          name: "SUPABASE_SERVICE_ROLE_KEY",
          description: "Der Service-Rollen-Schlüssel für die Supabase-API",
          required: true,
          sensitive: true,
          value: process.env.SUPABASE_SERVICE_ROLE_KEY,
        },
        {
          name: "SUPABASE_JWT_SECRET",
          description: "Das JWT-Secret für die Supabase-Authentifizierung",
          required: true,
          sensitive: true,
          value: process.env.SUPABASE_JWT_SECRET,
        },
      ],
    },
    {
      title: "Vercel",
      description: "Umgebungsvariablen für das Vercel-Deployment",
      variables: [
        {
          name: "VERCEL_URL",
          description: "Die URL deiner Vercel-Deployment-Instanz",
          required: false,
          value: process.env.VERCEL_URL,
        },
        {
          name: "VERCEL_ENV",
          description: "Die aktuelle Vercel-Umgebung (production, preview, development)",
          required: false,
          value: process.env.VERCEL_ENV,
        },
      ],
    },
    {
      title: "Anwendung",
      description: "Anwendungsspezifische Umgebungsvariablen",
      variables: [
        {
          name: "NEXT_PUBLIC_APP_URL",
          description: "Die öffentliche URL der Anwendung",
          required: false,
          value: process.env.NEXT_PUBLIC_APP_URL,
        },
        {
          name: "NEXT_PUBLIC_API_URL",
          description: "Die URL der API",
          required: false,
          value: process.env.NEXT_PUBLIC_API_URL,
        },
      ],
    },
  ]

  // Kopiere den Wert einer Umgebungsvariable
  const copyToClipboard = (name: string, value?: string) => {
    if (value) {
      navigator.clipboard.writeText(value)
      setCopied({ ...copied, [name]: true })
      setTimeout(() => {
        setCopied({ ...copied, [name]: false })
      }, 2000)
    }
  }

  // Zeige/Verstecke den Wert einer sensiblen Umgebungsvariable
  const toggleShowSensitive = (name: string) => {
    setShowSensitive({ ...showSensitive, [name]: !showSensitive[name] })
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle>Umgebungsvariablen</CardTitle>
        <CardDescription>Übersicht der Umgebungsvariablen für das Deployment</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3">
            {envVarGroups.map((group) => (
              <TabsTrigger key={group.title.toLowerCase()} value={group.title.toLowerCase()}>
                {group.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {envVarGroups.map((group) => (
            <TabsContent key={group.title.toLowerCase()} value={group.title.toLowerCase()} className="space-y-4">
              <p className="text-sm text-muted-foreground">{group.description}</p>

              <div className="space-y-4">
                {group.variables.map((variable) => (
                  <div key={variable.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={variable.name} className="flex items-center space-x-2">
                        <span>{variable.name}</span>
                        {variable.required && <Badge variant="outline">Erforderlich</Badge>}
                      </Label>
                      <div className="flex items-center space-x-2">
                        {variable.sensitive && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleShowSensitive(variable.name)}
                            className="h-8 w-8"
                          >
                            {showSensitive[variable.name] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(variable.name, variable.value)}
                          className="h-8 w-8"
                          disabled={!variable.value}
                        >
                          {copied[variable.name] ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        id={variable.name}
                        value={
                          variable.value
                            ? variable.sensitive && !showSensitive[variable.name]
                              ? "••••••••••••••••"
                              : variable.value
                            : ""
                        }
                        readOnly
                        placeholder={variable.value ? undefined : "Nicht gesetzt"}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{variable.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
