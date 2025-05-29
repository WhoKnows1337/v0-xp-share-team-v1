// Kalender-Integration
interface CalendarEvent {
  title: string
  description?: string
  start: Date
  end: Date
  location?: string
  attendees?: string[]
}

class CalendarIntegration {
  // Google Calendar Integration
  async addToGoogleCalendar(event: CalendarEvent): Promise<string> {
    const googleCalendarUrl = new URL("https://calendar.google.com/calendar/render")
    googleCalendarUrl.searchParams.set("action", "TEMPLATE")
    googleCalendarUrl.searchParams.set("text", event.title)
    googleCalendarUrl.searchParams.set(
      "dates",
      `${this.formatGoogleDate(event.start)}/${this.formatGoogleDate(event.end)}`,
    )

    if (event.description) {
      googleCalendarUrl.searchParams.set("details", event.description)
    }

    if (event.location) {
      googleCalendarUrl.searchParams.set("location", event.location)
    }

    return googleCalendarUrl.toString()
  }

  // Outlook Calendar Integration
  async addToOutlookCalendar(event: CalendarEvent): Promise<string> {
    const outlookUrl = new URL("https://outlook.live.com/calendar/0/deeplink/compose")
    outlookUrl.searchParams.set("subject", event.title)
    outlookUrl.searchParams.set("startdt", event.start.toISOString())
    outlookUrl.searchParams.set("enddt", event.end.toISOString())

    if (event.description) {
      outlookUrl.searchParams.set("body", event.description)
    }

    if (event.location) {
      outlookUrl.searchParams.set("location", event.location)
    }

    return outlookUrl.toString()
  }

  // iCal-Datei generieren
  generateICalFile(event: CalendarEvent): string {
    const ical = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//XP-Share//Calendar//DE",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@xp-share.com`,
      `DTSTART:${this.formatICalDate(event.start)}`,
      `DTEND:${this.formatICalDate(event.end)}`,
      `SUMMARY:${event.title}`,
      event.description ? `DESCRIPTION:${event.description}` : "",
      event.location ? `LOCATION:${event.location}` : "",
      `DTSTAMP:${this.formatICalDate(new Date())}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .filter(Boolean)
      .join("\r\n")

    return ical
  }

  private formatGoogleDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  }

  private formatICalDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  }
}

// Social Media Integration
class SocialMediaIntegration {
  // Twitter/X Share
  generateTwitterShareUrl(text: string, url?: string, hashtags?: string[]): string {
    const twitterUrl = new URL("https://twitter.com/intent/tweet")
    twitterUrl.searchParams.set("text", text)

    if (url) {
      twitterUrl.searchParams.set("url", url)
    }

    if (hashtags && hashtags.length > 0) {
      twitterUrl.searchParams.set("hashtags", hashtags.join(","))
    }

    return twitterUrl.toString()
  }

  // Facebook Share
  generateFacebookShareUrl(url: string): string {
    const facebookUrl = new URL("https://www.facebook.com/sharer/sharer.php")
    facebookUrl.searchParams.set("u", url)
    return facebookUrl.toString()
  }

  // LinkedIn Share
  generateLinkedInShareUrl(url: string, title?: string, summary?: string): string {
    const linkedinUrl = new URL("https://www.linkedin.com/sharing/share-offsite/")
    linkedinUrl.searchParams.set("url", url)

    if (title) {
      linkedinUrl.searchParams.set("title", title)
    }

    if (summary) {
      linkedinUrl.searchParams.set("summary", summary)
    }

    return linkedinUrl.toString()
  }

  // WhatsApp Share
  generateWhatsAppShareUrl(text: string): string {
    const whatsappUrl = new URL("https://wa.me/")
    whatsappUrl.searchParams.set("text", text)
    return whatsappUrl.toString()
  }
}

// Maps Integration
class MapsIntegration {
  // Google Maps
  generateGoogleMapsUrl(address: string, lat?: number, lng?: number): string {
    const mapsUrl = new URL("https://www.google.com/maps/search/")

    if (lat && lng) {
      mapsUrl.searchParams.set("api", "1")
      mapsUrl.searchParams.set("query", `${lat},${lng}`)
    } else {
      mapsUrl.pathname += encodeURIComponent(address)
    }

    return mapsUrl.toString()
  }

  // Apple Maps
  generateAppleMapsUrl(address: string, lat?: number, lng?: number): string {
    const appleMapsUrl = new URL("https://maps.apple.com/")

    if (lat && lng) {
      appleMapsUrl.searchParams.set("ll", `${lat},${lng}`)
    } else {
      appleMapsUrl.searchParams.set("q", address)
    }

    return appleMapsUrl.toString()
  }
}

// Export-Integration
class ExportIntegration {
  // PDF-Export
  async exportToPDF(content: string, filename: string): Promise<Blob> {
    // Hier würde eine PDF-Bibliothek wie jsPDF verwendet werden
    const pdf = new (await import("jspdf")).jsPDF()
    pdf.text(content, 10, 10)
    return pdf.output("blob")
  }

  // CSV-Export
  exportToCSV(data: any[], filename: string): void {
    const csvContent = this.convertToCSV(data)
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    this.downloadFile(blob, `${filename}.csv`)
  }

  // JSON-Export
  exportToJSON(data: any, filename: string): void {
    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: "application/json" })
    this.downloadFile(blob, `${filename}.json`)
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return ""

    const headers = Object.keys(data[0])
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value
          })
          .join(","),
      ),
    ]

    return csvRows.join("\n")
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

// Hauptintegrations-Manager
export class IntegrationManager {
  calendar = new CalendarIntegration()
  socialMedia = new SocialMediaIntegration()
  maps = new MapsIntegration()
  export = new ExportIntegration()

  // Erlebnis zu Kalender hinzufügen
  async addExperienceToCalendar(experience: any, provider: "google" | "outlook" | "ical"): Promise<string> {
    const event: CalendarEvent = {
      title: experience.titel,
      description: experience.beschreibung,
      start: new Date(experience.datum),
      end: new Date(new Date(experience.datum).getTime() + 2 * 60 * 60 * 1000), // +2h
      location: experience.ort,
    }

    switch (provider) {
      case "google":
        return this.calendar.addToGoogleCalendar(event)
      case "outlook":
        return this.calendar.addToOutlookCalendar(event)
      case "ical":
        return `data:text/calendar;charset=utf8,${encodeURIComponent(this.calendar.generateICalFile(event))}`
      default:
        throw new Error("Unbekannter Kalender-Provider")
    }
  }

  // Erlebnis in sozialen Medien teilen
  shareExperience(
    experience: any,
    platform: "twitter" | "facebook" | "linkedin" | "whatsapp",
    baseUrl: string,
  ): string {
    const url = `${baseUrl}/erlebnis/${experience.id}`
    const text = `Schaut euch mein Erlebnis "${experience.titel}" auf XP-Share an!`

    switch (platform) {
      case "twitter":
        return this.socialMedia.generateTwitterShareUrl(text, url, ["XPShare", "Erlebnis"])
      case "facebook":
        return this.socialMedia.generateFacebookShareUrl(url)
      case "linkedin":
        return this.socialMedia.generateLinkedInShareUrl(url, experience.titel, experience.beschreibung)
      case "whatsapp":
        return this.socialMedia.generateWhatsAppShareUrl(`${text} ${url}`)
      default:
        throw new Error("Unbekannte Social Media Plattform")
    }
  }
}

export const integrationManager = new IntegrationManager()
