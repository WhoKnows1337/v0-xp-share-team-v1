import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CtaSection() {
  return (
    <section className="py-16 bg-primary/10">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Bereit, deine Erlebnisse zu teilen?
          </h2>
          <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Melde dich jetzt an und beginne, deine besonderen Momente festzuhalten und mit anderen zu teilen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 min-w-[200px]">
            <Button asChild size="lg">
              <Link href="/dashboard">Jetzt starten</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#features">Mehr erfahren</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
