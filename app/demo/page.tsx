"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KIAnalyse } from "@/components/ki-features/ki-analyse"
import { KIEmpfehlungen } from "@/components/ki-features/ki-empfehlungen"
import { ErweiterteSuche } from "@/components/erweiterte-suche/erweiterte-suche"
import { ErweiterteAnalytics } from "@/components/analytics/erweiterte-analytics"
import { GruppenListe } from "@/components/gruppen/gruppen-liste"
import { GruppeDetail } from "@/components/gruppen/gruppe-detail"

export default function DemoPage() {
  // Mock-IDs für die Demo
  const userId = "550e8400-e29b-41d4-a716-446655440020"
  const experienceId = "550e8400-e29b-41d4-a716-446655440001"
  const groupId = "g-001"

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">XP-Share Features Demo</h1>

      <Tabs defaultValue="gruppen" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ki-features">KI-Features</TabsTrigger>
          <TabsTrigger value="erweiterte-suche">Erweiterte Suche</TabsTrigger>
          <TabsTrigger value="erweiterte-analytics">Erweiterte Analytics</TabsTrigger>
          <TabsTrigger value="gruppen">Gruppen & Kollaboration</TabsTrigger>
        </TabsList>

        <TabsContent value="ki-features" className="mt-6 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">KI-Analyse eines Erlebnisses</h2>
            <KIAnalyse experienceId={experienceId} />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Personalisierte KI-Empfehlungen</h2>
            <KIEmpfehlungen userId={userId} />
          </div>
        </TabsContent>

        <TabsContent value="erweiterte-suche" className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Erweiterte Suchfunktionen</h2>
          <ErweiterteSuche userId={userId} />
        </TabsContent>

        <TabsContent value="erweiterte-analytics" className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Erweiterte Analytics</h2>
          <ErweiterteAnalytics userId={userId} />
        </TabsContent>

        <TabsContent value="gruppen" className="mt-6 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Gruppenliste</h2>
            <GruppenListe />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Gruppendetails</h2>
            <GruppeDetail groupId={groupId} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
