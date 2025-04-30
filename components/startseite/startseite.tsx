"use client"

import { HeroSection } from "./hero-section"
import { FeatureSection } from "./feature-section"
import { TestimonialSection } from "./testimonial-section"
import { CtaSection } from "./cta-section"
import { Footer } from "./footer"
import { SkipLink } from "../ui/skip-link"

export function Startseite() {
  return (
    <>
      <SkipLink href="#main-content">Zum Hauptinhalt springen</SkipLink>
      <main id="main-content" className="min-h-screen">
        <HeroSection />
        <FeatureSection />
        <TestimonialSection />
        <CtaSection />
        <Footer />
      </main>
    </>
  )
}
