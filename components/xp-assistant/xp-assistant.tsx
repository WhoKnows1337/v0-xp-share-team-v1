"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X, Minimize2, Maximize2, Volume2, VolumeX, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { ChatMessage } from "./chat-message"
import { KeeperAvatar } from "./keeper-avatar"
import { useToast } from "@/hooks/use-toast"
import { processChatQuery } from "./chat-processor"

export type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  isLoading?: boolean
  context?: string
}

interface XPAssistantProps {
  initialContext?: string
  initialOpen?: boolean
}

export function XPAssistant({ initialContext, initialOpen = false }: XPAssistantProps) {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Initialisiere den Chat mit einer Begrüßungsnachricht
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        content: initialContext
          ? `Hallo! Ich bin Keeper, dein XP-Assistant. Ich sehe, du interessierst dich für "${initialContext}". Wie kann ich dir dabei helfen?`
          : "Hallo! Ich bin Keeper, dein XP-Assistant. Ich kann dir helfen, Erlebnisse zu finden, zu analysieren oder einzutragen. Was möchtest du wissen?",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, initialContext, messages.length])

  // Scrolle zum Ende der Nachrichten, wenn neue hinzukommen
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Fokussiere das Eingabefeld, wenn der Chat geöffnet wird
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [isOpen, isMinimized])

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false)
      return
    }
    setIsOpen(!isOpen)
  }

  const minimizeChat = () => {
    setIsMinimized(true)
  }

  const maximizeChat = () => {
    setIsMinimized(false)
  }

  const toggleSpeech = () => {
    setIsSpeechEnabled(!isSpeechEnabled)
    toast({
      title: isSpeechEnabled ? "Sprachausgabe deaktiviert" : "Sprachausgabe aktiviert",
      duration: 2000,
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Füge die Benutzernachricht hinzu
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    // Füge eine temporäre Antwortnachricht hinzu
    const tempBotMessage: Message = {
      id: `assistant-${Date.now()}`,
      content: "",
      role: "assistant",
      timestamp: new Date(),
      isLoading: true,
    }

    setMessages((prev) => [...prev, userMessage, tempBotMessage])
    setInput("")
    setIsTyping(true)

    try {
      // Verarbeite die Anfrage und erhalte eine Antwort
      const response = await processChatQuery(input, messages)

      // Aktualisiere die temporäre Nachricht mit der tatsächlichen Antwort
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === tempBotMessage.id) {
            return {
              ...msg,
              content: response,
              isLoading: false,
            }
          }
          return msg
        }),
      )

      // Sprachausgabe, wenn aktiviert
      if (isSpeechEnabled) {
        const utterance = new SpeechSynthesisUtterance(response)
        utterance.lang = "de-DE"
        window.speechSynthesis.speak(utterance)
      }
    } catch (error) {
      console.error("Fehler bei der Verarbeitung der Anfrage:", error)

      // Aktualisiere die temporäre Nachricht mit einer Fehlermeldung
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === tempBotMessage.id) {
            return {
              ...msg,
              content:
                "Entschuldigung, ich konnte deine Anfrage nicht verarbeiten. Bitte versuche es später noch einmal.",
              isLoading: false,
            }
          }
          return msg
        }),
      )
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <>
      {/* Schwebender Chat-Button mit Keeper-Avatar */}
      <Button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-6 right-6 rounded-full shadow-lg z-50 w-14 h-14 p-0 flex items-center justify-center",
          isOpen && !isMinimized
            ? "bg-emerald-600 hover:bg-emerald-700"
            : "bg-slate-800 hover:bg-slate-700 shadow-emerald-500/20",
        )}
        aria-label={isOpen ? "Chat schließen" : "Chat öffnen"}
      >
        {isOpen && !isMinimized ? (
          <X size={24} />
        ) : (
          <div className="w-10 h-10">
            <KeeperAvatar size="md" />
          </div>
        )}
      </Button>

      {/* Chat-Fenster */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={
              isMinimized
                ? { opacity: 1, y: 0, scale: 0.95, height: "60px" }
                : { opacity: 1, y: 0, scale: 1, height: "auto" }
            }
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed bottom-24 right-6 w-[90vw] sm:w-[400px] bg-background rounded-lg shadow-xl z-40 overflow-hidden border border-emerald-200 dark:border-emerald-900/30",
              isMinimized ? "max-h-[60px]" : "max-h-[80vh]",
            )}
          >
            {/* Chat-Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-slate-100 to-emerald-50/30 dark:from-slate-900 dark:to-emerald-950/20">
              <div className="flex items-center space-x-3">
                <KeeperAvatar isTyping={isTyping} size="md" />
                <div>
                  <h3 className="font-medium text-slate-800 dark:text-slate-200">Keeper</h3>
                  <p className="text-xs text-muted-foreground">XP-Assistant</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                  onClick={toggleSpeech}
                  aria-label={isSpeechEnabled ? "Sprachausgabe deaktivieren" : "Sprachausgabe aktivieren"}
                >
                  {isSpeechEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </Button>
                {isMinimized ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={maximizeChat}
                    aria-label="Chat maximieren"
                  >
                    <Maximize2 size={18} />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={minimizeChat}
                    aria-label="Chat minimieren"
                  >
                    <Minimize2 size={18} />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsOpen(false)}
                  aria-label="Chat schließen"
                >
                  <X size={18} />
                </Button>
              </div>
            </div>

            {/* Chat-Nachrichten */}
            {!isMinimized && (
              <div className="flex flex-col h-[50vh] max-h-[50vh]">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Eingabebereich */}
                <div className="p-4 border-t">
                  <div className="flex items-end space-x-2">
                    <Textarea
                      ref={inputRef}
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Stelle eine Frage..."
                      className="flex-1 min-h-[60px] max-h-[120px] resize-none focus-visible:ring-emerald-500/50"
                      disabled={isTyping}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isTyping}
                      className="h-10 w-10 rounded-full p-0 flex-shrink-0 bg-emerald-600 hover:bg-emerald-700"
                      aria-label="Nachricht senden"
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Ich bin ein KI-Assistent. Obwohl ich auf den XP-Daten basiere, kann ich Fehler machen.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
