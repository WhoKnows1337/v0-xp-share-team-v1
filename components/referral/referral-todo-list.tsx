"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Circle } from "lucide-react"

export function ReferralTodoList() {
  const todoItems = [
    {
      title: "Grundlegende Komponenten",
      items: [
        { name: "InviteCard Komponente", done: true },
        { name: "ShareSheet Komponente", done: true },
        { name: "RewardToast Komponente", done: true },
        { name: "ReferralProgress Komponente", done: true },
        { name: "ReferralLeaderboard Komponente", done: true },
      ],
    },
    {
      title: "Benutzeroberflächen und Seiten",
      items: [
        { name: "Referral Dashboard", done: true },
        { name: "ShareSheet Modal", done: true },
        { name: "Reward Unlocked Modal", done: true },
        { name: "Referral Signup Landing Page", done: true },
        { name: "Milestone Banner", done: true },
      ],
    },
    {
      title: "Integration in bestehende Komponenten",
      items: [
        { name: "Dashboard Sidebar", done: true },
        { name: "Profil-Header-Banner", done: true },
        { name: "Wallet-Update", done: true },
      ],
    },
    {
      title: "Backend-Funktionalität",
      items: [
        { name: "Referral-Tracking-System", done: true },
        { name: "Belohnungssystem", done: true },
        { name: "Referral-Tier-System", done: true },
      ],
    },
    {
      title: "Edge Cases & Fehlerbehandlung",
      items: [
        { name: "Link bereits eingelöst", done: true },
        { name: "Selbst-Einladung (gleiche IP + E-Mail-Domain)", done: true },
        { name: "Tageslimit für Einladungen erreicht", done: true },
        { name: "Reward Webhook Fehler", done: true },
      ],
    },
    {
      title: "Visuelle Elemente & Animationen",
      items: [
        { name: "Münzregen-Animation (Lottie)", done: true },
        { name: "Fortschrittsbalken-Animation", done: true },
        { name: "Badge-Tier-Freischaltung", done: true },
      ],
    },
    {
      title: "Design & Styling",
      items: [
        { name: "Farben", done: true },
        { name: "Schatten", done: true },
        { name: "Abstände", done: true },
      ],
    },
    {
      title: "Analytics & Tracking",
      items: [
        { name: "Event-Tracking", done: true },
        { name: "Funnel-Dashboard", done: true },
      ],
    },
    {
      title: "Texte & Micro-UX",
      items: [
        { name: "Headline InviteCard", done: true },
        { name: "CTA-Button", done: true },
        { name: "ShareSheet-Untertitel", done: true },
        { name: "RewardToast", done: true },
        { name: "Leerer Zustand ReferralDashboard", done: true },
      ],
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral-Programm To-Do Liste</CardTitle>
        <CardDescription>Übersicht über den Implementierungsstatus des Referral-Programms</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {todoItems.map((section, i) => (
            <div key={i}>
              <h3 className="font-medium text-lg mb-2">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-center">
                    {item.done ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-300 mr-2" />
                    )}
                    <span className={item.done ? "" : "text-muted-foreground"}>{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
