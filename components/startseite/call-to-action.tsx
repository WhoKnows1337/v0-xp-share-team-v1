"use client"

import { Button } from "@/components/ui/button"
import { useErlebnisWizard } from "../erlebnis-wizard-modal"

export function CallToAction() {
  const { openWizard } = useErlebnisWizard()

  const handleNewExperience = () => {
    console.log("Startseite CTA: Öffne ErlebnisWizard")
    openWizard()
  }

  return (
    <section className="py-16">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Bereit, deine Erlebnisse zu teilen?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Erstelle noch heute ein Konto und beginne damit, deine besonderen Momente festzuhalten und mit anderen zu
          teilen.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="bg-white text-emerald-700 hover:bg-gray-100" onClick={handleNewExperience}>
            Erlebnis teilen
          </Button>
          <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
            Mehr erfahren
          </Button>
        </div>
      </div>
    </section>
  )
}
