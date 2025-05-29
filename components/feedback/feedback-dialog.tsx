"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { MessageSquare } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function FeedbackDialog() {
  const [open, setOpen] = useState(false)
  const [feedbackType, setFeedbackType] = useState("suggestion")
  const [feedbackText, setFeedbackText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!feedbackText.trim()) {
      toast({
        title: "Feedback erforderlich",
        description: "Bitte gib dein Feedback ein, bevor du es absendest.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simuliere eine API-Anfrage
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In einer echten Anwendung würden wir das Feedback an einen Server senden
    console.log("Feedback gesendet:", { feedbackType, feedbackText })

    toast({
      title: "Feedback gesendet",
      description: "Vielen Dank für dein Feedback!",
    })

    setIsSubmitting(false)
    setFeedbackText("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          Feedback geben
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Feedback geben</DialogTitle>
          <DialogDescription>Teile uns deine Gedanken mit, um XP-Share zu verbessern.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup value={feedbackType} onValueChange={setFeedbackType} className="grid grid-cols-3 gap-4">
            <div>
              <RadioGroupItem value="suggestion" id="suggestion" className="peer sr-only" />
              <Label
                htmlFor="suggestion"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span>Vorschlag</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="issue" id="issue" className="peer sr-only" />
              <Label
                htmlFor="issue"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span>Problem</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="praise" id="praise" className="peer sr-only" />
              <Label
                htmlFor="praise"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span>Lob</span>
              </Label>
            </div>
          </RadioGroup>
          <div className="grid gap-2">
            <Label htmlFor="feedback">Dein Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="Teile uns deine Gedanken mit..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Wird gesendet..." : "Feedback senden"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
