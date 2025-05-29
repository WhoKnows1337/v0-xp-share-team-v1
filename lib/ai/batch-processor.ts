class EmbeddingProcessor {
  private isConfigured = false
  private isRunning = false

  constructor() {
    this.checkConfiguration()
  }

  private checkConfiguration() {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        this.isConfigured = true
      } else {
        console.warn('AI-Services sind nicht konfiguriert. Supabase-Umgebungsvariablen fehlen.')
      }
    } catch (error) {
      console.warn('Fehler bei der AI-Service-Konfiguration:', error)
    }
  }

  async start() {
    if (!this.isConfigured) {
      console.log('AI-Services übersprungen - Konfiguration fehlt')
      return
    }
    
    if (this.isRunning) return
    // Rest der start() Methode...
  }
}
