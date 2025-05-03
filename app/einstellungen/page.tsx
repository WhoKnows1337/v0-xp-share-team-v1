"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Crown, CreditCard, User, Bell, Shield, HelpCircle } from "lucide-react"

export default function EinstellungenPage() {
  const [activeTab, setActiveTab] = useState("account")

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto pt-24 pb-16 px-4">
        <h1 className="text-3xl font-bold mb-8">Einstellungen</h1>

        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
          {/* Sidebar */}
          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
              <TabsList className="flex flex-col h-auto bg-background p-0 space-y-1">
                <TabsTrigger value="account" className="justify-start px-4 py-2 w-full">
                  <User className="h-4 w-4 mr-2" />
                  Konto
                </TabsTrigger>
                <TabsTrigger value="subscription" className="justify-start px-4 py-2 w-full">
                  <Crown className="h-4 w-4 mr-2" />
                  Abonnement
                </TabsTrigger>
                <TabsTrigger value="notifications" className="justify-start px-4 py-2 w-full">
                  <Bell className="h-4 w-4 mr-2" />
                  Benachrichtigungen
                </TabsTrigger>
                <TabsTrigger value="privacy" className="justify-start px-4 py-2 w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Datenschutz
                </TabsTrigger>
                <TabsTrigger value="help" className="justify-start px-4 py-2 w-full">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Hilfe
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <TabsContent value="account" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Konto-Einstellungen</CardTitle>
                  <CardDescription>Verwalte deine Kontoinformationen und Einstellungen</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Konto-Einstellungen werden hier angezeigt.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscription" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Abonnement</CardTitle>
                  <CardDescription>Verwalte dein Abonnement und deine Zahlungsmethoden</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Hier kannst du dein aktuelles Abonnement einsehen und verwalten.</p>
                  <Button asChild>
                    <Link href="/settings/subscription">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Abonnement verwalten
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="ml-2">
                    <Link href="/pricing">
                      <Crown className="mr-2 h-4 w-4" />
                      Preise anzeigen
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Benachrichtigungen</CardTitle>
                  <CardDescription>Konfiguriere deine Benachrichtigungseinstellungen</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Benachrichtigungseinstellungen werden hier angezeigt.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Datenschutz</CardTitle>
                  <CardDescription>Verwalte deine Datenschutz- und Tracking-Einstellungen</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Datenschutzeinstellungen werden hier angezeigt.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="help" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Hilfe</CardTitle>
                  <CardDescription>Hilfe und Support</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Hilfe und Support-Informationen werden hier angezeigt.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </div>
    </div>
  )
}
