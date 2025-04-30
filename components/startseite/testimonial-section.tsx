import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

export function TestimonialSection() {
  const testimonials = [
    {
      quote:
        "XP-Share hat die Art und Weise, wie ich meine Reiseerlebnisse mit meiner Familie teile, komplett verändert. Jetzt können alle meine Abenteuer miterleben!",
      author: "Marie Schmidt",
      role: "Reiseenthusiast",
      avatar: "MS",
    },
    {
      quote:
        "Als Fotograf nutze ich XP-Share, um meine Fotoshootings zu organisieren und mit Kunden zu teilen. Die Privatsphäre-Einstellungen sind genau das, was ich brauchte.",
      author: "Thomas Weber",
      role: "Fotograf",
      avatar: "TW",
    },
    {
      quote:
        "Unsere Wandergruppe verwendet XP-Share für alle gemeinsamen Touren. Die Ortsmarkierung und die Möglichkeit, Fotos zu teilen, sind unschlagbar!",
      author: "Lisa Müller",
      role: "Wanderführerin",
      avatar: "LM",
    },
  ]

  return (
    <section className="py-16 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Was unsere Nutzer sagen</h2>
          <p className="mt-4 text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Erfahrungen von Menschen, die XP-Share lieben
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card">
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <p className="text-lg italic mb-6">"{testimonial.quote}"</p>
                  </div>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage
                        src={`/abstract-geometric-shapes.png?key=phm95&height=40&width=40&query=${testimonial.author}`}
                        alt={testimonial.author}
                      />
                      <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
